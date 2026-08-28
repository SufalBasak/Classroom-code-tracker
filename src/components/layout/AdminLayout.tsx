import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { User, Role } from '../../types';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { X } from 'lucide-react';

export interface AdminLayoutProps {
  user: User;
  onUserUpdate: (u: User) => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ user, onUserUpdate }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block shrink-0">
        <Sidebar
          user={user}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
          isAdminMode={true}
        />
      </div>

      {/* Mobile Drawer Sidebar */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={() => setIsMobileOpen(false)} />
          <div className="relative flex-1 max-w-xs bg-white h-full z-10">
            <button
              onClick={() => setIsMobileOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
            <Sidebar user={user} onCloseMobile={() => setIsMobileOpen(false)} isAdminMode={true} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          user={user}
          onOpenMobileMenu={() => setIsMobileOpen(true)}
          title="Admin Control Center"
          subtitle="Manage courses, users, questions, platform settings, and bulk import."
        />

        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
