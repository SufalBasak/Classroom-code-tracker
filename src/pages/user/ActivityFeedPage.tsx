import React from 'react';
import { progressService } from '../../services/progressService';
import { Activity } from '../../types';
import { DifficultyBadge, PlatformBadge } from '../../components/common/Badge';
import { CheckCircle2, Clock } from 'lucide-react';

export const ActivityFeedPage: React.FC = () => {
  const activities = progressService.getRecentActivities();

  return (
    <div className="space-y-6 animate-element max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Activity History</h1>
        <p className="text-sm text-slate-500 mt-1">Chronological timeline of your problem-solving activities.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {activities.map((act: Activity) => (
            <div key={act.id} className="relative flex items-start justify-between gap-4 group">
              {/* Timeline Bullet Dot */}
              <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-blue-600 ring-4 ring-white flex items-center justify-center text-white text-[10px] shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                    {act.questionTitle}
                  </h4>
                  <PlatformBadge platform={act.platform} />
                  <DifficultyBadge difficulty={act.difficulty} />
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-2">
                  <span>Action: <strong className="text-slate-700">{act.action}</strong></span>
                </p>
              </div>

              <div className="text-xs font-semibold text-slate-400 shrink-0 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{act.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
