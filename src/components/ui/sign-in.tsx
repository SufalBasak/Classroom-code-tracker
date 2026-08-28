import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s12-5.373 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-2.641-.21-5.236-.611-7.743z" />
    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.022 35.026 44 30.038 44 24c0-2.641-.21-5.236-.611-7.743z" />
  </svg>
);

export interface Testimonial {
  avatarSrc: string;
  name: string;
  handle: string;
  text: string;
}

export interface SignInPageProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  heroImageSrc?: string;
  testimonials?: Testimonial[];
  onSignIn?: (event: React.FormEvent<HTMLFormElement>) => void;
  onGoogleSignIn?: () => void;
  onResetPassword?: () => void;
  onCreateAccount?: () => void;
}

const GlassInputWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl border border-slate-200 bg-slate-50/80 backdrop-blur-sm transition-all focus-within:border-blue-500/80 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/20">
    {children}
  </div>
);

const TestimonialCard = ({ testimonial, delay }: { testimonial: Testimonial; delay: string }) => (
  <div className={`animate-testimonial ${delay} flex items-start gap-3 rounded-3xl bg-white/80 backdrop-blur-xl border border-slate-200/80 p-5 w-72 shadow-lg`}>
    <img src={testimonial.avatarSrc} className="h-10 w-10 object-cover rounded-2xl shrink-0" alt="avatar" />
    <div className="text-sm leading-snug">
      <p className="flex items-center gap-1 font-semibold text-slate-900">{testimonial.name}</p>
      <p className="text-xs text-slate-500">{testimonial.handle}</p>
      <p className="mt-1.5 text-xs text-slate-600 leading-normal">{testimonial.text}</p>
    </div>
  </div>
);

export const SignInPage: React.FC<SignInPageProps> = ({
  title = <span className="font-bold text-slate-900 tracking-tight">Welcome Back</span>,
  description = "Access your CodeSnap account and continue your coding journey",
  heroImageSrc,
  testimonials = [],
  onSignIn,
  onGoogleSignIn,
  onResetPassword,
  onCreateAccount,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex flex-col md:flex-row w-full font-sans bg-slate-50">
      {/* Left column: sign-in form */}
      <section className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-3xl border border-slate-200 shadow-xl">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-xl shadow-md shadow-blue-600/30">
                CS
              </div>
              <span className="font-bold text-slate-900 text-xl tracking-tight">
                Code<span className="text-blue-600">Snap</span>
              </span>
            </div>

            <div>
              <h1 className="animate-element animate-delay-100 text-3xl font-bold leading-tight text-slate-900">{title}</h1>
              <p className="animate-element animate-delay-200 text-sm text-slate-500 mt-1">{description}</p>
            </div>

            <form className="space-y-4" onSubmit={onSignIn}>
              <div className="animate-element animate-delay-300">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 block">Email Address</label>
                <GlassInputWrapper>
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="Enter your email address"
                    className="w-full bg-transparent text-sm p-3.5 text-slate-900 placeholder:text-slate-400 focus:outline-none"
                  />
                </GlassInputWrapper>
              </div>

              <div className="animate-element animate-delay-400">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 block">Password</label>
                <GlassInputWrapper>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Enter your password"
                      className="w-full bg-transparent text-sm p-3.5 pr-12 text-slate-900 placeholder:text-slate-400 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </GlassInputWrapper>
              </div>

              <div className="animate-element animate-delay-500 flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="rememberMe" defaultChecked className="custom-checkbox" />
                  <span className="text-slate-600 font-medium">Keep me signed in</span>
                </label>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onResetPassword?.();
                  }}
                  className="hover:underline text-blue-600 font-semibold transition-colors"
                >
                  Reset password?
                </a>
              </div>

              <button
                type="submit"
                className="animate-element animate-delay-600 w-full rounded-2xl bg-blue-600 py-3.5 font-semibold text-white hover:bg-blue-700 shadow-md shadow-blue-600/25 active:scale-[0.99] transition-all"
              >
                Sign In to Dashboard
              </button>
            </form>

            <div className="animate-element animate-delay-700 relative flex items-center justify-center">
              <span className="w-full border-t border-slate-200"></span>
              <span className="px-3 text-xs text-slate-400 bg-white absolute">Or continue with</span>
            </div>

            <button
              type="button"
              onClick={onGoogleSignIn}
              className="animate-element animate-delay-800 w-full flex items-center justify-center gap-3 border border-slate-200 rounded-2xl py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <GoogleIcon />
              Continue with Google
            </button>

            <p className="animate-element animate-delay-900 text-center text-xs text-slate-500">
              New to CodeSnap?{' '}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onCreateAccount?.();
                }}
                className="text-blue-600 font-semibold hover:underline transition-colors"
              >
                Create Account
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Right column: hero image + testimonials */}
      {heroImageSrc && (
        <section className="hidden md:block flex-1 relative p-6">
          <div
            className="animate-slide-right animate-delay-300 absolute inset-6 rounded-3xl bg-cover bg-center shadow-xl overflow-hidden border border-slate-200"
            style={{ backgroundImage: `url(${heroImageSrc})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/40 to-transparent" />
            
            <div className="absolute top-10 left-10 text-white max-w-lg space-y-2">
              <span className="px-3 py-1 bg-blue-600/80 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider text-white">
                Developer Productivity Platform
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight">Track. Solve. Improve.</h2>
              <p className="text-sm text-slate-200 leading-relaxed">
                Consolidate your coding practice across LeetCode, GeeksforGeeks, HackerRank, and Codeforces into one unified progress dashboard.
              </p>
            </div>
          </div>

          {testimonials.length > 0 && (
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-4 px-8 w-full justify-center">
              <TestimonialCard testimonial={testimonials[0]} delay="animate-delay-1000" />
              {testimonials[1] && <div className="hidden xl:flex"><TestimonialCard testimonial={testimonials[1]} delay="animate-delay-1200" /></div>}
            </div>
          )}
        </section>
      )}
    </div>
  );
};
