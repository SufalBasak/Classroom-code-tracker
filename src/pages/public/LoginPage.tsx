import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SignInPage, Testimonial } from '../../components/ui/sign-in';
import { authService } from '../../services/authService';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../components/common/Toast';
import { User } from '../../types';

const sampleTestimonials: Testimonial[] = [
  {
    avatarSrc: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    name: 'Sufal Basak',
    handle: '@coding_user',
    text: 'CodeSnap helped me track 120+ LeetCode & GFG problems. The daily streak feature keeps me accountable!'
  },
  {
    avatarSrc: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    name: 'Rahul Sharma',
    handle: '@rahul_algo',
    text: 'Clean SaaS interface and curated SQL & DSA tracks. Perfect for tech interview prep!'
  }
];

export interface LoginPageProps {
  onUserUpdate?: (user: User) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onUserUpdate }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = (formData.get('email') as string || '').trim();
    const password = (formData.get('password') as string || '').trim();

    try {
      const user = await authService.loginUser(email, password);
      if (onUserUpdate) {
        onUserUpdate(user);
      }
      showToast(`Welcome back, ${user.name}! Logged in successfully.`, 'success');
      if (user.role === 'ADMIN') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err: any) {
      showToast(err?.message || 'Sign in failed. Please try again.', 'error');
    }
  };

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` }
    });
    if (error) {
      showToast(error.message || 'Google sign-in is not available right now.', 'error');
    }
  };

  const handleResetPassword = () => {
    navigate('/forgot-password');
  };

  const handleCreateAccount = () => {
    navigate('/register');
  };

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen flex items-center justify-center">
      <SignInPage
        heroImageSrc="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1600&auto=format&fit=crop&q=80"
        testimonials={sampleTestimonials}
        onSignIn={handleSignIn}
        onGoogleSignIn={handleGoogleSignIn}
        onResetPassword={handleResetPassword}
        onCreateAccount={handleCreateAccount}
      />
    </div>
  );
};
