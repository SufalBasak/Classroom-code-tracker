import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from './components/common/Toast';
import { AppRoutes } from './routes/AppRoutes';
import { authService } from './services/authService';
import { courseService } from './services/courseService';
import { questionService } from './services/questionService';
import { User } from './types';

export function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(authService.getCurrentUser());

  useEffect(() => {
    // Fetch live real data from Supabase database on app startup
    courseService.fetchCoursesFromSupabase();
    questionService.fetchQuestionsFromSupabase();
  }, []);

  const handleUserUpdate = (updatedUser: User) => {
    setCurrentUser(updatedUser);
  };

  return (
    <BrowserRouter>
      <ToastProvider>
        <AppRoutes user={currentUser} onUserUpdate={handleUserUpdate} />
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
