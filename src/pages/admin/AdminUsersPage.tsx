import React, { useState } from 'react';
import { User, Role } from '../../types';
import { MOCK_LEADERBOARD } from '../../data/mockData';
import { Button } from '../../components/common/Button';
import { Search, Shield, UserCheck, Lock } from 'lucide-react';
import { useToast } from '../../components/common/Toast';

export const AdminUsersPage: React.FC = () => {
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<User[]>([
    { id: 'u1', name: 'Sufal Basak', username: 'coding_user', email: 'sufal@example.com', role: 'USER', joinedDate: 'Jan 2024', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', points: 1870, streak: 12, totalSolved: 127, joinedCourseIds: ['c1'] },
    { id: 'u-admin', name: 'CodeSnap Admin', username: 'admin', email: 'admin@codesnap.dev', role: 'ADMIN', joinedDate: 'Dec 2023', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', points: 4500, streak: 45, totalSolved: 340, joinedCourseIds: ['c1', 'c2'] },
    { id: 'u-rahul', name: 'Rahul Sharma', username: 'rahul_algo', email: 'rahul@example.com', role: 'USER', joinedDate: 'Feb 2024', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80', points: 2450, streak: 28, totalSolved: 187, joinedCourseIds: ['c2'] },
    { id: 'u-priya', name: 'Priya Patel', username: 'priya_code', email: 'priya@example.com', role: 'USER', joinedDate: 'Mar 2024', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', points: 2280, streak: 19, totalSolved: 172, joinedCourseIds: ['c1'] }
  ]);

  const filteredUsers = users.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  const handleToggleRole = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const newRole: Role = u.role === 'USER' ? 'ADMIN' : 'USER';
          showToast(`Changed role of ${u.name} to ${newRole}`, 'info');
          return { ...u, role: newRole };
        }
        return u;
      })
    );
  };

  return (
    <div className="space-y-6 animate-element">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
          <p className="text-sm text-slate-500 mt-1">View user accounts, adjust administrative roles, and inspect progress metrics.</p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-3.5 px-6">User</th>
              <th className="py-3.5 px-4">Role</th>
              <th className="py-3.5 px-4">Questions Solved</th>
              <th className="py-3.5 px-4">Joined Date</th>
              <th className="py-3.5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
            {filteredUsers.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <img src={u.avatar} alt={u.name} className="w-9 h-9 rounded-xl object-cover border border-slate-200" />
                    <div>
                      <div className="font-bold text-slate-900">{u.name}</div>
                      <div className="text-xs text-slate-400 font-mono">{u.email}</div>
                    </div>
                  </div>
                </td>

                <td className="py-4 px-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    u.role === 'ADMIN' ? 'bg-blue-100 text-blue-800 border border-blue-200' : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}>
                    {u.role}
                  </span>
                </td>

                <td className="py-4 px-4 font-bold text-slate-900">{u.totalSolved} Solved</td>

                <td className="py-4 px-4 text-xs text-slate-500">{u.joinedDate}</td>

                <td className="py-4 px-6 text-right">
                  <Button
                    onClick={() => handleToggleRole(u.id)}
                    variant="outline"
                    size="sm"
                    leftIcon={<Shield className="w-3.5 h-3.5" />}
                  >
                    Toggle Role ({u.role === 'USER' ? 'Make Admin' : 'Make User'})
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
