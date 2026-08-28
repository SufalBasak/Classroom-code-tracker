import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { User } from '../types';
import { authService } from '../services/authService';

import { PublicLayout } from '../components/layout/PublicLayout';
import { UserLayout } from '../components/layout/UserLayout';
import { AdminLayout } from '../components/layout/AdminLayout';

import { LandingPage } from '../pages/public/LandingPage';
import { LoginPage } from '../pages/public/LoginPage';
import { RegisterPage } from '../pages/public/RegisterPage';
import { ForgotPasswordPage } from '../pages/public/ForgotPasswordPage';
import { ResetPasswordPage } from '../pages/public/ResetPasswordPage';

import { UserDashboard } from '../pages/user/UserDashboard';
import { CoursesPage } from '../pages/user/CoursesPage';
import { CourseDetailPage } from '../pages/user/CourseDetailPage';
import { ProblemsPage } from '../pages/user/ProblemsPage';
import { MyProgressPage } from '../pages/user/MyProgressPage';
import { ActivityFeedPage } from '../pages/user/ActivityFeedPage';
import { LeaderboardPage } from '../pages/user/LeaderboardPage';
import { AchievementsPage } from '../pages/user/AchievementsPage';
import { SettingsPage } from '../pages/user/SettingsPage';
import { CodingProfilesPage } from '../pages/user/CodingProfilesPage';

import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { AdminUsersPage } from '../pages/admin/AdminUsersPage';
import { AdminCoursesPage } from '../pages/admin/AdminCoursesPage';
import { AdminCourseFormPage } from '../pages/admin/AdminCourseFormPage';
import { AdminCourseBuilderPage } from '../pages/admin/AdminCourseBuilderPage';
import { AdminQuestionsPage } from '../pages/admin/AdminQuestionsPage';
import { AdminBulkImportPage } from '../pages/admin/AdminBulkImportPage';
import { AdminPlatformsPage } from '../pages/admin/AdminPlatformsPage';

export interface AppRoutesProps {
  user: User | null;
  onUserUpdate: (u: User) => void;
}

const ProtectedUserGuard: React.FC<{ user: User | null; onUserUpdate: (u: User) => void }> = ({ user, onUserUpdate }) => {
  const isAuth = authService.isAuthenticated();
  const currentUser = user || authService.getCurrentUser();
  if (!isAuth || !currentUser) {
    return <Navigate to="/login" replace />;
  }
  return <UserLayout user={currentUser} onUserUpdate={onUserUpdate} />;
};

const ProtectedAdminGuard: React.FC<{ user: User | null; onUserUpdate: (u: User) => void }> = ({ user, onUserUpdate }) => {
  const isAuth = authService.isAuthenticated();
  const currentUser = user || authService.getCurrentUser();
  if (!isAuth || !currentUser) {
    return <Navigate to="/login" replace />;
  }
  if (currentUser.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }
  return <AdminLayout user={currentUser} onUserUpdate={onUserUpdate} />;
};

export const AppRoutes: React.FC<AppRoutesProps> = ({ user, onUserUpdate }) => {
  const activeUser = user || authService.getCurrentUser() || {
    id: 'guest',
    name: 'Developer',
    username: 'dev',
    email: 'dev@example.com',
    role: 'USER',
    joinedDate: '2026',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bio: 'Software developer',
    points: 0,
    streak: 0,
    totalSolved: 0,
    joinedCourseIds: []
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage onUserUpdate={onUserUpdate} />} />
        <Route path="/register" element={<RegisterPage onUserUpdate={onUserUpdate} />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Route>

      {/* Protected User Dashboard Routes */}
      <Route element={<ProtectedUserGuard user={user} onUserUpdate={onUserUpdate} />}>
        <Route path="/dashboard" element={<UserDashboard user={activeUser} onUserUpdate={onUserUpdate} />} />
        <Route path="/courses" element={<CoursesPage user={activeUser} onUserUpdate={onUserUpdate} />} />
        <Route path="/courses/:id" element={<CourseDetailPage user={activeUser} onUserUpdate={onUserUpdate} />} />
        <Route path="/problems" element={<ProblemsPage />} />
        <Route path="/progress" element={<MyProgressPage user={activeUser} />} />
        <Route path="/activity" element={<ActivityFeedPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage user={activeUser} />} />
        <Route path="/achievements" element={<AchievementsPage />} />
        <Route path="/settings" element={<SettingsPage user={activeUser} onUserUpdate={onUserUpdate} />} />
        <Route path="/settings/profile" element={<SettingsPage user={activeUser} onUserUpdate={onUserUpdate} />} />
        <Route path="/settings/coding-profiles" element={<CodingProfilesPage user={activeUser} />} />
      </Route>

      {/* Protected Admin Panel Routes */}
      <Route element={<ProtectedAdminGuard user={user} onUserUpdate={onUserUpdate} />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="/admin/courses" element={<AdminCoursesPage />} />
        <Route path="/admin/courses/new" element={<AdminCourseFormPage />} />
        <Route path="/admin/courses/:id/edit" element={<AdminCourseFormPage />} />
        <Route path="/admin/courses/:id" element={<AdminCourseBuilderPage />} />
        <Route path="/admin/questions" element={<AdminQuestionsPage />} />
        <Route path="/admin/questions/import" element={<AdminBulkImportPage />} />
        <Route path="/admin/platforms" element={<AdminPlatformsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
