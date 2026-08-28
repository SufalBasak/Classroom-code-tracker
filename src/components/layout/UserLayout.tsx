import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { User, Role } from '../../types';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { X } from 'lucide-react';

export interface UserLayoutProps {
  user: User;
  onUserUpdate: (u: User) => void;
}

export const UserLayout: React.FC<UserLayoutProps> = ({ user, onUserUpdate }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard':
        return { title: 'User Dashboard', subtitle: 'Overview of your coding activity, courses, and progress.' };
      case '/courses':
        return { title: 'Practice Courses', subtitle: 'Structured problem lists to master technical topics.' };
      case '/problems':
        return { title: 'Problem Browser', subtitle: 'Filter and solve problems across LeetCode, GFG, HackerRank & Codeforces.' };
      case '/progress':
        return { title: 'My Progress & Analytics', subtitle: 'Deep dive into your difficulty, platform, and topic breakdowns.' };
      case '/activity':
        return { title: 'Activity History', subtitle: 'Chronological timeline of solved questions.' };
      case '/leaderboard':
        return { title: 'Global Leaderboard', subtitle: 'Compete with developers worldwide based on points & streak.' };
      case '/achievements':
        return { title: 'Milestones & Badges', subtitle: 'Level up your achievements as you solve more problems.' };
      case '/settings':
        return { title: 'Account Settings', subtitle: 'Manage your profile details and preferences.' };
      case '/settings/coding-profiles':
        return { title: 'Connected Coding Accounts', subtitle: 'Link your LeetCode, GFG, HackerRank & Codeforces profiles.' };
      default:
        return { title: 'Dashboard', subtitle: 'Track. Solve. Improve.' };
    }
  };

  const { title, subtitle } = getPageTitle();

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block shrink-0">
        <Sidebar
          user={user}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        />
      </div>

      {/* Mobile Drawer Sidebar */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={() => setIsMobileOpen(false)} />
          <div className="relative z-10 w-72 bg-white h-full shadow-2xl flex flex-col">
            <button
              onClick={() => setIsMobileOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
            <Sidebar user={user} onCloseMobile={() => setIsMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          user={user}
          onOpenMobileMenu={() => setIsMobileOpen(true)}
          title={title}
          subtitle={subtitle}
        />

        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
