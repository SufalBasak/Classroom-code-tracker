import React, { useEffect, useState } from 'react';
import { progressService } from '../../services/progressService';
import { platformService } from '../../services/platformService';
import { Flame, Info, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

export interface HeatmapProps {
  currentStreak: number;
  userId: string;
}

export const Heatmap: React.FC<HeatmapProps> = ({ currentStreak, userId }) => {
  const [selectedYear, setSelectedYear] = useState<'2026' | '2025'>('2026');
  const [externalCalendar, setExternalCalendar] = useState<Record<string, number> | null>(null);
  const [loadingCalendar, setLoadingCalendar] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoadingCalendar(true);
    platformService
      .getActivityCalendar(userId)
      .then((calendar) => {
        if (!cancelled) setExternalCalendar(calendar);
      })
      .finally(() => {
        if (!cancelled) setLoadingCalendar(false);
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const { days, totalSubmissions, monthsHeader } = progressService.getHeatmapData(52, externalCalendar || undefined);

  const getCellColor = (level: number) => {
    switch (level) {
      case 1:
        return 'bg-blue-300 border-blue-400/50';
      case 2:
        return 'bg-blue-500 border-blue-600/50';
      case 3:
        return 'bg-blue-700 border-blue-800/50';
      case 4:
        return 'bg-blue-900 border-blue-950/50';
      default:
        return 'bg-slate-100 border-slate-200/60';
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-3 border-b border-slate-100">
        <div>
          <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
            <span>Coding Activity Heatmap</span>
          </h3>
          <p className="text-xs font-medium text-slate-500 mt-0.5 flex items-center gap-1.5">
            <strong className="text-slate-800">{totalSubmissions} submissions</strong> in the last 12 months
            {loadingCalendar && <Loader2 className="w-3 h-3 animate-spin text-slate-400" />}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          {/* Year selector */}
          <div className="p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold flex">
            <button
              onClick={() => setSelectedYear('2026')}
              className={clsx(
                'px-3 py-1 rounded-lg transition-all',
                selectedYear === '2026' ? 'bg-white text-blue-700 shadow-2xs font-extrabold' : 'text-slate-500 hover:text-slate-900'
              )}
            >
              2026
            </button>
            <button
              onClick={() => setSelectedYear('2025')}
              className={clsx(
                'px-3 py-1 rounded-lg transition-all',
                selectedYear === '2025' ? 'bg-white text-blue-700 shadow-2xs font-extrabold' : 'text-slate-500 hover:text-slate-900'
              )}
            >
              2025
            </button>
          </div>

          {/* Current Streak badge */}
          <span className="flex items-center gap-1.5 bg-orange-50 text-orange-700 px-3.5 py-1.5 rounded-full border border-orange-200 text-xs font-bold shadow-2xs">
            <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
            <span>{currentStreak} Days Current Streak</span>
          </span>
        </div>
      </div>

      {/* GitHub / LeetCode Continuous Matrix */}
      <div className="overflow-x-auto pb-2">
        <div className="min-w-[760px] space-y-1.5">
          {/* Months header aligned with columns */}
          <div className="relative h-4 text-[11px] font-bold text-slate-400 pl-8">
            {monthsHeader.map((m, idx) => (
              <span
                key={idx}
                style={{ left: `${m.colIndex * 14.5 + 32}px` }}
                className="absolute"
              >
                {m.month}
              </span>
            ))}
          </div>

          {/* 52 Columns x 7 Rows dense heat grid */}
          <div className="flex gap-2 items-center">
            {/* Weekday labels */}
            <div className="flex flex-col justify-between text-[10px] font-bold text-slate-400 h-[105px] pr-1 select-none">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
            </div>

            {/* Matrix grid */}
            <div className="grid grid-flow-col grid-rows-7 gap-[2.5px] flex-1">
              {days.map((day, idx) => (
                <div
                  key={idx}
                  title={`${day.date}: ${day.count} submissions`}
                  className={clsx(
                    'w-3 h-3 rounded-[2px] border transition-transform hover:scale-125 cursor-pointer relative group',
                    getCellColor(day.level)
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Legend */}
      <div className="flex flex-col sm:flex-row justify-between items-center text-xs font-medium text-slate-500 pt-2 border-t border-slate-100 gap-2">
        <span className="flex items-center gap-1 text-slate-400 hover:text-slate-600 cursor-pointer">
          <Info className="w-3.5 h-3.5" />
          <span>Learn how we count contributions</span>
        </span>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-xs font-semibold">Less</span>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-[2px] bg-slate-100 border border-slate-200/60" />
            <div className="w-3 h-3 rounded-[2px] bg-blue-300 border border-blue-400/50" />
            <div className="w-3 h-3 rounded-[2px] bg-blue-500 border border-blue-600/50" />
            <div className="w-3 h-3 rounded-[2px] bg-blue-700 border border-blue-800/50" />
            <div className="w-3 h-3 rounded-[2px] bg-blue-900 border border-blue-950/50" />
          </div>
          <span className="text-slate-400 text-xs font-semibold">More</span>
        </div>
      </div>
    </div>
  );
};
