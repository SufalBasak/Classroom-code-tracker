import React from 'react';
import { Role } from '../../types';
import { Shield, User as UserIcon } from 'lucide-react';
import { clsx } from 'clsx';

export interface DemoRoleSwitcherProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
  className?: string;
}

export const DemoRoleSwitcher: React.FC<DemoRoleSwitcherProps> = ({ currentRole, onRoleChange, className }) => {
  return (
    <div className={clsx('inline-flex items-center p-1 bg-slate-100 border border-slate-200 rounded-xl text-xs font-medium', className)}>
      <span className="px-2 text-slate-400 font-normal hidden lg:inline">Demo Role:</span>
      <button
        onClick={() => onRoleChange('USER')}
        className={clsx(
          'flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all',
          currentRole === 'USER'
            ? 'bg-white text-blue-700 shadow-xs font-semibold'
            : 'text-slate-600 hover:text-slate-900'
        )}
      >
        <UserIcon className="w-3.5 h-3.5" />
        <span>User</span>
      </button>
      <button
        onClick={() => onRoleChange('ADMIN')}
        className={clsx(
          'flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all',
          currentRole === 'ADMIN'
            ? 'bg-blue-600 text-white shadow-xs font-semibold'
            : 'text-slate-600 hover:text-slate-900'
        )}
      >
        <Shield className="w-3.5 h-3.5" />
        <span>Admin</span>
      </button>
    </div>
  );
};
