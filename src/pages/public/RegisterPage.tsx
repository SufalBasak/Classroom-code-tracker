import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { authService } from '../../services/authService';
import { useToast } from '../../components/common/Toast';
import { User } from '../../types';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '../../components/common/Button';

export interface RegisterPageProps {
  onUserUpdate?: (user: User) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onUserUpdate }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!agreed) {
      showToast('Please agree to the Terms of Service to continue.', 'warning');
      return;
    }

    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const email = (formData.get('email') as string || '').trim();
    const name = (formData.get('name') as string || '').trim();
    const username = (formData.get('username') as string || '').trim();

    try {
      const { user, needsEmailConfirmation } = await authService.registerUser({ name, username, email, password });

      if (needsEmailConfirmation) {
        showToast(`Almost there! We sent a confirmation link to ${email} — verify it, then sign in.`, 'success');
        navigate('/login', { replace: true });
        return;
      }

      if (onUserUpdate) {
        onUserUpdate(user);
      }

      showToast(`✓ Welcome to CodeSnap, ${user.name}! Your account is registered.`, 'success');

      if (user.role === 'ADMIN') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err: any) {
      showToast(err?.message || 'Registration failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 py-12">
      <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-3xl border border-slate-200 shadow-xl space-y-6 animate-element">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-xl shadow-md shadow-blue-600/30">
            CS
          </div>
          <span className="font-bold text-slate-900 text-xl tracking-tight">
            Code<span className="text-blue-600">Snap</span>
          </span>
        </div>

        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create your account</h1>
          <p className="text-xs text-slate-500 mt-1">Start tracking your practice across coding platforms</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 block">Full Name</label>
            <input
              name="name"
              type="text"
              required
              placeholder="e.g. Sufal Basak"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 block">Username</label>
            <input
              name="username"
              type="text"
              required
              placeholder="e.g. sufaldev"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-blue-500 font-mono text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 block">Email Address</label>
            <input
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 block">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-blue-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {password && (
              <div className="mt-2 space-y-1">
                <div className="flex gap-1 h-1">
                  <div className={`flex-1 rounded-full ${strength >= 1 ? 'bg-rose-500' : 'bg-slate-200'}`} />
                  <div className={`flex-1 rounded-full ${strength >= 2 ? 'bg-amber-500' : 'bg-slate-200'}`} />
                  <div className={`flex-1 rounded-full ${strength >= 3 ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                </div>
                <p className="text-[10px] text-slate-500">
                  {strength < 2 ? 'Weak password' : strength === 2 ? 'Medium strength' : 'Strong password'}
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="terms"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            />
            <label htmlFor="terms" className="text-xs text-slate-600">
              I agree to the <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> & <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
            </label>
          </div>

          <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>

        <p className="text-center text-xs text-slate-500">
          Already registered?{' '}
          <NavLink to="/login" className="text-blue-600 font-bold hover:underline">
            Sign in to your account
          </NavLink>
        </p>
      </div>
    </div>
  );
};
