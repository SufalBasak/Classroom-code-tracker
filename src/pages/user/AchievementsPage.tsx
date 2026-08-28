import React from 'react';
import { achievementService } from '../../services/achievementService';
import { Award, Zap, Target, Trophy, Crown, Flame, Sparkles, Database, Code, Lock, CheckCircle2 } from 'lucide-react';

export const AchievementsPage: React.FC = () => {
  const achievements = achievementService.getAchievements();

  const getIcon = (iconName: string, unlocked: boolean) => {
    const props = { className: `w-6 h-6 ${unlocked ? 'text-blue-600' : 'text-slate-400'}` };
    switch (iconName) {
      case 'Zap': return <Zap {...props} />;
      case 'Award': return <Award {...props} />;
      case 'Target': return <Target {...props} />;
      case 'Trophy': return <Trophy {...props} />;
      case 'Crown': return <Crown {...props} />;
      case 'Flame': return <Flame className={`w-6 h-6 ${unlocked ? 'text-orange-500 fill-orange-500' : 'text-slate-400'}`} />;
      case 'Sparkles': return <Sparkles {...props} />;
      case 'Database': return <Database {...props} />;
      case 'Code': return <Code {...props} />;
      default: return <Award {...props} />;
    }
  };

  return (
    <div className="space-y-6 animate-element">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Achievements & Badges</h1>
        <p className="text-sm text-slate-500 mt-1">Unlock badges by solving questions, maintaining streaks, and completing courses.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((ach) => (
          <div
            key={ach.id}
            className={`p-6 rounded-2xl border transition-all flex flex-col justify-between gap-4 ${
              ach.unlocked
                ? 'bg-white border-blue-200 shadow-md hover:shadow-lg'
                : 'bg-slate-50/70 border-slate-200 opacity-70'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${
                  ach.unlocked ? 'bg-blue-50 border-blue-200' : 'bg-slate-200 border-slate-300'
                }`}>
                  {getIcon(ach.iconName, ach.unlocked)}
                </div>

                {ach.unlocked ? (
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Unlocked
                  </span>
                ) : (
                  <span className="px-2.5 py-1 bg-slate-200 text-slate-600 rounded-full text-xs font-semibold flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" /> Locked
                  </span>
                )}
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-lg">{ach.title}</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{ach.description}</p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <div className="flex justify-between text-xs font-semibold text-slate-600">
                <span>Progress</span>
                <span>{ach.progress} / {ach.target}</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${ach.unlocked ? 'bg-blue-600' : 'bg-slate-400'}`}
                  style={{ width: `${Math.min(100, (ach.progress / ach.target) * 100)}%` }}
                />
              </div>
              {ach.unlockedAt && (
                <p className="text-[10px] text-slate-400 text-right pt-0.5">Unlocked on {ach.unlockedAt}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
