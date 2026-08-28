import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { useToast } from '../../components/common/Toast';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  const { showToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      showToast('Password reset link sent to your email (Demo mode).', 'info');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 py-12">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6 animate-element">
        <NavLink to="/login" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-blue-600">
          <ArrowLeft className="w-4 h-4" /> Back to Sign In
        </NavLink>

        {!submitted ? (
          <>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Reset your password</h1>
              <p className="text-sm text-slate-500 mt-1">Enter your registered email and we'll send you a password reset link.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 block">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <Button type="submit" variant="primary" size="lg" className="w-full">
                Send Reset Link
              </Button>
            </form>
          </>
        ) : (
          <div className="text-center space-y-4 py-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Check your inbox</h2>
            <p className="text-sm text-slate-500">
              We sent a password reset link to <strong className="text-slate-900">{email}</strong>.
            </p>
            <div className="pt-2">
              <NavLink to="/reset-password">
                <Button variant="outline" size="sm" className="w-full">
                  Demo: Continue to Reset Password Form
                </Button>
              </NavLink>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
