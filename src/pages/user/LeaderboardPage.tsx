import React, { useEffect, useState } from 'react';
import { User, LeaderboardUser } from '../../types';
import { leaderboardService, Timeframe } from '../../services/leaderboardService';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { Trophy, Flame, Award, Shield, Users } from 'lucide-react';

export const LeaderboardPage: React.FC<{ user: User }> = ({ user }) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('allTime');
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLeaderboard(null);
    leaderboardService.getLeaderboard(timeframe).then((data) => {
      if (!cancelled) setLeaderboard(data);
    });
    return () => {
      cancelled = true;
    };
  }, [timeframe]);

  return (
    <div className="space-y-6 animate-element max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-500" />
            <span>Community Leaderboard</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">Top problem solvers ranked by total verified questions and points.</p>
        </div>

        {/* Timeframe selector */}
        <div className="p-1 bg-slate-100 border border-slate-200 rounded-xl flex text-xs font-semibold">
          <button
            onClick={() => setTimeframe('weekly')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              timeframe === 'weekly' ? 'bg-white text-blue-600 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setTimeframe('monthly')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              timeframe === 'monthly' ? 'bg-white text-blue-600 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setTimeframe('allTime')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              timeframe === 'allTime' ? 'bg-white text-blue-600 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Time
          </button>
        </div>
      </div>

      {/* Leaderboard Table */}
      {leaderboard === null ? (
        <CardSkeleton />
      ) : leaderboard.length === 0 ? (
        <EmptyState
          icon={<Users className="w-8 h-8" />}
          title="No ranked developers yet"
          description="As users connect and sync their LeetCode or GeeksforGeeks accounts, they'll appear here ranked by real solved counts."
        />
      ) : (
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-3.5 px-6">Rank</th>
              <th className="py-3.5 px-6">Developer</th>
              <th className="py-3.5 px-6">Questions Solved</th>
              <th className="py-3.5 px-6">Total Points</th>
              <th className="py-3.5 px-6 text-right">Streak</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
            {leaderboard.map((u) => {
              const isCurrentUser = u.id === user.id;

              return (
                <tr
                  key={u.id}
                  className={`transition-colors ${
                    isCurrentUser ? 'bg-blue-50/80 font-bold border-l-4 border-blue-600' : 'hover:bg-slate-50'
                  }`}
                >
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-extrabold ${
                        u.rank === 1
                          ? 'bg-amber-100 text-amber-700 border border-amber-300'
                          : u.rank === 2
                          ? 'bg-slate-200 text-slate-700'
                          : u.rank === 3
                          ? 'bg-amber-800/10 text-amber-900'
                          : 'text-slate-400'
                      }`}
                    >
                      #{u.rank}
                    </span>
                  </td>

                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img src={u.avatar} alt={u.name} className="w-9 h-9 rounded-xl object-cover border border-slate-200" />
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          {u.name}
                          {isCurrentUser && (
                            <span className="px-1.5 py-0.2 bg-blue-600 text-white rounded-md text-[10px]">You</span>
                          )}
                        </div>
                        <div className="text-xs text-slate-400 font-mono">@{u.username}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-6 font-bold text-slate-900">{u.solvedCount} Solved</td>

                  <td className="py-4 px-6 text-blue-600 font-bold">{u.points} pts</td>

                  <td className="py-4 px-6 text-right">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">
                      <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                      {u.streak} Days
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      )}
    </div>
  );
};
