import React, { useState, useEffect } from 'react';
import { User, Role } from '../../types';
import { adminService } from '../../services/adminService';
import { Button } from '../../components/common/Button';
import { Search, Shield, Loader2 } from 'lucide-react';
import { useToast } from '../../components/common/Toast';

export const AdminUsersPage: React.FC = () => {
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    let isMounted = true;
    async function fetchUsers() {
      try {
        const realUsers = await adminService.getAllUsers();
        if (isMounted) {
          if (realUsers.length > 0) {
            setUsers(realUsers);
          } else {
            // Fallback default sample user if table is fresh
            setUsers([
              {
                id: 'u1',
                name: 'Sufal Basak',
                username: 'coding_user',
                email: 'classroomplus07@gmail.com',
                role: 'ADMIN',
                joinedDate: 'Jan 2024',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
                points: 1870,
                streak: 12,
                totalSolved: 127,
                joinedCourseIds: ['c1']
              }
            ]);
          }
        }
      } catch (err) {
        console.error('Error fetching users:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchUsers();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleRole = async (userId: string) => {
    const targetUser = users.find((u) => u.id === userId);
    if (!targetUser) return;

    const newRole: Role = targetUser.role === 'USER' ? 'ADMIN' : 'USER';

    // Optimistic UI update
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );

    const success = await adminService.updateUserRole(userId, newRole);
    if (success) {
      showToast(`Changed role of ${targetUser.name} to ${newRole}`, 'success');
    } else {
      showToast(`Role updated locally for ${targetUser.name}`, 'info');
    }
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
        {loading ? (
          <div className="flex items-center justify-center p-12 text-slate-500 gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            <span className="text-sm">Loading user accounts...</span>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">No users matched your search filter.</div>
        ) : (
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
        )}
      </div>
    </div>
  );
};
