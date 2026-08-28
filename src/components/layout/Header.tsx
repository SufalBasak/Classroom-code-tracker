import React, { useState } from 'react';
import { User } from '../../types';
import { Search, Bell, Menu, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { useToast } from '../common/Toast';

export interface HeaderProps {
  user: User;
  onOpenMobileMenu: () => void;
  title?: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onOpenMobileMenu,
  title = 'Dashboard',
  subtitle = 'Track your practice, solve problems, and keep improving.'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/problems?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    showToast('Logged out successfully.', 'info');
    navigate('/login');
  };

  const sampleNotifications = [
    { id: '1', title: 'Daily Streak Alert', message: 'You are on a 12-day streak! Solve 1 question to keep it going.', time: '10m ago' },
    { id: '2', title: 'New Course Available', message: 'Dynamic Programming Masterclass has been updated.', time: '1h ago' },
    { id: '3', title: 'Achievement Unlocked', message: 'You unlocked "100 Problems Solved" badge!', time: '1d ago' }
  ];

  return (
    <header className="h-16 px-4 lg:px-8 bg-white border-b border-slate-200 sticky top-0 z-20 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex flex-col">
          <h1 className="text-base lg:text-lg font-bold text-slate-900 leading-tight">{title}</h1>
          {subtitle && <p className="text-xs text-slate-500 hidden md:block">{subtitle}</p>}
        </div>
      </div>

      {/* Center: Global Search Bar */}
      <div className="relative flex-1 max-w-md hidden md:block">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search problems, topics, or courses..."
            className="w-full pl-10 pr-4 py-2 bg-slate-100/80 border border-slate-200/80 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 transition-all"
          />
        </form>
      </div>

      {/* Right: Notifications & User Avatar & Log Out */}
      <div className="flex items-center gap-3">
        {/* Notification Bell Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl border border-slate-200 shadow-xl p-4 z-40 animate-element">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <h4 className="font-semibold text-slate-900 text-sm">Notifications</h4>
                <span className="text-xs text-blue-600 font-medium cursor-pointer">Mark all read</span>
              </div>
              <div className="space-y-3">
                {sampleNotifications.map((notif) => (
                  <div key={notif.id} className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 space-y-1 text-xs">
                    <div className="flex justify-between items-center font-semibold text-slate-900">
                      <span>{notif.title}</span>
                      <span className="text-[10px] text-slate-400">{notif.time}</span>
                    </div>
                    <p className="text-slate-600 leading-snug">{notif.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile & Logout Button */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
          <div className="flex items-center gap-2">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-9 h-9 rounded-xl object-cover border border-slate-200 shadow-2xs"
            />
            <div className="hidden xl:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-900 leading-tight">{user.name}</span>
              <span className="text-[11px] text-slate-500 font-mono">@{user.username}</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-rose-50 hover:text-rose-600 font-semibold text-xs transition-colors border border-slate-200/80"
            title="Log Out of CodeSnap"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Log Out</span>
          </button>
        </div>
      </div>
    </header>
  );
};
