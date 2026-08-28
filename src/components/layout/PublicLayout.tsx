import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Button } from '../common/Button';
import Logo from '../common/Logo';
import HoverFooter from '../ui/hover-footer';
import { authService } from '../../services/authService';

export const PublicLayout: React.FC = () => {
  const currentUser = authService.getCurrentUser();
  const isAuthenticated = authService.isAuthenticated();

  const dashboardPath = currentUser?.role === 'ADMIN' ? '/admin' : '/dashboard';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Public Navbar */}
      <header className="h-20 px-6 lg:px-12 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-3">
          <Logo size="md" showTagline />
        </NavLink>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <NavLink to="/" className={({ isActive }) => (isActive ? 'text-blue-600 font-semibold' : 'hover:text-slate-900')}>
            Home
          </NavLink>
        </nav>

        {/* Dynamic Auth Header Section */}
        <div className="flex items-center gap-3">
          {isAuthenticated && currentUser ? (
            <NavLink
              to={dashboardPath}
              className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors py-2 px-3 rounded-xl hover:bg-slate-100 whitespace-nowrap"
            >
              My Profile
            </NavLink>
          ) : (
            <>
              <NavLink to="/login">
                <Button variant="ghost" size="sm" className="font-semibold text-slate-700 hover:text-slate-900">
                  Login
                </Button>
              </NavLink>
              <NavLink to="/register">
                <Button variant="primary" size="sm" className="font-semibold shadow-md shadow-blue-600/20">
                  Get Started
                </Button>
              </NavLink>
            </>
          )}
        </div>
      </header>

      {/* Main Public Route Container */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Public Hover Footer */}
      <HoverFooter />
    </div>
  );
};
