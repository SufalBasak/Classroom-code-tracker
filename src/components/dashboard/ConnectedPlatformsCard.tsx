import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { CodingProfile } from '../../types';
import { platformService } from '../../services/platformService';
import { codingStatsService } from '../../services/codingStatsService';
import { PlatformBadge } from '../common/Badge';
import { Skeleton } from '../common/LoadingSkeleton';
import { Trophy, Link2, ArrowRight } from 'lucide-react';

export const ConnectedPlatformsCard: React.FC<{ userId: string }> = ({ userId }) => {
  const [profiles, setProfiles] = useState<CodingProfile[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    platformService.getProfiles(userId).then((data) => {
      if (!cancelled) setProfiles(data);
    });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const connected = (profiles || []).filter((p) => p.connected);
  const totalSolved = connected.reduce((sum, p) => sum + (p.solvedCount ?? 0), 0);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
      <div className="flex justify-between items-center pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          <h3 className="font-bold text-slate-900 text-base">Connected Coding Platforms</h3>
        </div>
        <NavLink to="/settings/coding-profiles" className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1">
          Manage <ArrowRight className="w-3.5 h-3.5" />
        </NavLink>
      </div>

      {profiles === null ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
        </div>
      ) : connected.length === 0 ? (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-slate-50 border border-slate-100 rounded-xl">
          <p className="text-sm text-slate-500">Connect your LeetCode or GeeksforGeeks handle to auto-sync your real solved count here.</p>
          <NavLink
            to="/settings/coding-profiles"
            className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors"
          >
            <Link2 className="w-3.5 h-3.5" /> Connect Account
          </NavLink>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {connected.map((p) => (
              <div key={p.platform} className="flex items-center justify-between p-3.5 bg-slate-50/70 border border-slate-100 rounded-xl">
                <div className="space-y-1">
                  <PlatformBadge platform={p.platform} />
                  <p className="text-xs text-slate-500 font-mono">@{(p.username || '').replace(/^@/, '')}</p>
                </div>
                <div className="text-right">
                  {codingStatsService.isAutoSyncSupported(p.platform) ? (
                    <>
                      <div className="text-xl font-extrabold text-slate-900">{p.solvedCount ?? 0}</div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider">Solved</div>
                    </>
                  ) : (
                    <div className="text-[11px] text-slate-400 italic">Sync unavailable</div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 pt-1">
            <strong className="text-slate-900">{totalSolved}</strong> total problems solved across connected platforms.
          </p>
        </>
      )}
    </div>
  );
};
