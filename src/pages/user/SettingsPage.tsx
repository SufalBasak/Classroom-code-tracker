import React, { useState } from 'react';
import { User } from '../../types';
import { authService } from '../../services/authService';
import { useToast } from '../../components/common/Toast';
import { Button } from '../../components/common/Button';
import { CodingProfilesPage } from './CodingProfilesPage';
import { User as UserIcon, UserCheck, Bell, Moon, Shield } from 'lucide-react';

export const SettingsPage: React.FC<{ user: User; onUserUpdate: (u: User) => void }> = ({ user, onUserUpdate }) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'profile' | 'coding-profiles' | 'notifications' | 'appearance'>('profile');

  const [name, setName] = useState(user.name);
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio || '');
  const [avatar, setAvatar] = useState(user.avatar);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = authService.updateUserProfile({ name, username, bio, avatar });
    onUserUpdate(updated);
    showToast('✓ Profile updated successfully!', 'success');
  };

  return (
    <div className="space-y-6 animate-element">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Account Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your public profile information, coding handles, and preferences.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'profile' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <UserIcon className="w-4 h-4" /> Profile Information
        </button>
        <button
          onClick={() => setActiveTab('coding-profiles')}
          className={`pb-3 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'coding-profiles' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <UserCheck className="w-4 h-4" /> Coding Profiles
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`pb-3 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'notifications' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Bell className="w-4 h-4" /> Notifications
        </button>
      </div>

      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6 max-w-2xl">
          <div className="flex items-center gap-6">
            <img src={avatar} alt={name} className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-200 shadow-sm" />
            <div className="space-y-2 flex-1">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">Avatar Image URL</label>
              <input
                type="text"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div>
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 block">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 block">Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 block">Bio / Summary</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                placeholder="Tell other developers about your coding focus..."
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="submit" variant="primary" size="md">
              Save Changes
            </Button>
          </div>
        </form>
      )}

      {activeTab === 'coding-profiles' && <CodingProfilesPage user={user} />}

      {activeTab === 'notifications' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 max-w-2xl">
          <h3 className="font-bold text-slate-900 text-base">Notification Preferences</h3>
          <div className="space-y-3 text-sm text-slate-700">
            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
              <span>Daily Streak Reminder</span>
              <input type="checkbox" defaultChecked className="custom-checkbox" />
            </label>
            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
              <span>New Course Alerts</span>
              <input type="checkbox" defaultChecked className="custom-checkbox" />
            </label>
            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
              <span>Weekly Progress Summary</span>
              <input type="checkbox" defaultChecked className="custom-checkbox" />
            </label>
          </div>
        </div>
      )}
    </div>
  );
};
