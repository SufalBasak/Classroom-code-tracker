import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { User } from '../../types';
import { authService } from '../../services/authService';
import Logo from '../common/Logo';
import {
  LayoutDashboard,
  BookOpen,
  Code2,
  TrendingUp,
  Activity,
  Award,
  Trophy,
  UserCheck,
  Settings,
  LogOut,
  Shield,
  Layers,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { clsx } from 'clsx';

export interface SidebarProps {
  user: User;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onCloseMobile?: () => void;
  isAdminMode?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  user,
  isCollapsed = false,
  onToggleCollapse,
  onCloseMobile,
  isAdminMode = false
}) => {
  const navigate = useNavigate();

  const userNavItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Courses', path: '/courses', icon: BookOpen },
    { label: 'Problems', path: '/problems', icon: Code2 },
    { label: 'My Progress', path: '/progress', icon: TrendingUp },
    { label: 'Activity', path: '/activity', icon: Activity },
    { label: 'Coding Profiles', path: '/settings/coding-profiles', icon: UserCheck },
    { label: 'Leaderboard', path: '/leaderboard', icon: Trophy },
    { label: 'Achievements', path: '/achievements', icon: Award },
    { label: 'Settings', path: '/settings', icon: Settings }
  ];

  const adminNavItems = [
    { label: 'Admin Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Users', path: '/admin/users', icon: UserCheck },
    { label: 'Courses', path: '/admin/courses', icon: BookOpen },
    { label: 'Questions', path: '/admin/questions', icon: Code2 },
    { label: 'Bulk Import', path: '/admin/questions/import', icon: Layers },
    { label: 'Platforms', path: '/admin/platforms', icon: Shield },
    { label: 'Back to User App', path: '/dashboard', icon: LayoutDashboard }
  ];

  const navItems = isAdminMode ? adminNavItems : userNavItems;

  const handleLogout = () => {
    authService.logoutMock();
    navigate('/login');
  };

  return (
    <aside
      className={clsx(
        'h-screen sticky top-0 bg-white border-r border-slate-200 flex flex-col justify-between transition-all duration-300 z-30 select-none',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Top Header Logo */}
      <div>
        <div className="h-16 px-4 border-b border-slate-100 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2 overflow-hidden">
            <Logo size={isCollapsed ? 'sm' : 'md'} />
          </NavLink>

          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Mode Tag */}
        {isAdminMode && !isCollapsed && (
          <div className="mx-4 mt-3 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold flex items-center gap-2 border border-blue-200/60">
            <Shield className="w-4 h-4 text-blue-600" />
            <span>Admin Workspace</span>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="p-3 space-y-1 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200',
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-semibold shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  )
                }
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className={clsx('w-5 h-5 shrink-0 transition-colors')} />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User Footer Profile */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center justify-between gap-3 p-2 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-3 overflow-hidden">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-9 h-9 rounded-lg object-cover border border-slate-200 shrink-0"
            />
            {!isCollapsed && (
              <div className="flex flex-col truncate">
                <span className="text-xs font-semibold text-slate-900 truncate">{user.name}</span>
                <span className="text-[11px] text-slate-500 capitalize">{user.role.toLowerCase()}</span>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <button
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
