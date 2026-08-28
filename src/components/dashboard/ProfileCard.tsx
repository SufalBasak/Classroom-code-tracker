import React from 'react';
import { User } from '../../types';
import { Flame, Trophy, Calendar, UserCheck, Edit3 } from 'lucide-react';
import { Button } from '../common/Button';
import { useNavigate } from 'react-router-dom';

export const ProfileCard: React.FC<{ user: User }> = ({ user }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
      <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-200 shadow-md shrink-0"
        />
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              {user.role}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-mono">@{user.username}</p>
          {user.bio && <p className="text-xs text-slate-600 max-w-md line-clamp-2 leading-relaxed">{user.bio}</p>}

          <div className="flex items-center justify-center sm:justify-start gap-4 pt-1 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" /> Joined {user.joinedDate}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 border-t sm:border-t-0 sm:border-l border-slate-100 pt-4 sm:pt-0 sm:pl-6 w-full sm:w-auto justify-around sm:justify-end">
        <div className="text-center px-3">
          <div className="flex items-center justify-center gap-1 text-amber-500 font-bold text-lg">
            <Trophy className="w-4 h-4" />
            <span>{user.points}</span>
          </div>
          <div className="text-[11px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">Total Points</div>
        </div>

        <div className="text-center px-3">
          <div className="flex items-center justify-center gap-1 text-blue-600 font-bold text-lg">
            <Flame className="w-4 h-4 text-orange-500" />
            <span>{user.streak} Days</span>
          </div>
          <div className="text-[11px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">Current Streak</div>
        </div>

        <div className="pl-2">
          <Button
            onClick={() => navigate('/settings')}
            variant="outline"
            size="sm"
            leftIcon={<Edit3 className="w-3.5 h-3.5" />}
          >
            Edit Profile
          </Button>
        </div>
      </div>
    </div>
  );
};
