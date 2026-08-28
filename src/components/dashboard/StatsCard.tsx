import React from 'react';
import { Target, CheckCircle2, Clock, PieChart, Flame, BookOpen } from 'lucide-react';

export interface StatsCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon: React.ReactNode;
  color?: 'blue' | 'emerald' | 'amber' | 'indigo' | 'orange' | 'purple';
}

export const StatsCard: React.FC<StatsCardProps> = ({ label, value, subtext, icon, color = 'blue' }) => {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    orange: 'bg-orange-50 text-orange-600 border-orange-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100'
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs flex items-center justify-between gap-3 transition-all hover:shadow-md">
      <div className="space-y-1">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">{label}</span>
        <div className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">{value}</div>
        {subtext && <p className="text-[11px] text-slate-400 font-medium">{subtext}</p>}
      </div>
      <div className={`w-12 h-12 lg:w-14 lg:h-14 rounded-2xl border flex items-center justify-center shrink-0 ${colorMap[color]}`}>
        {icon}
      </div>
    </div>
  );
};

export const DashboardStatsGrid: React.FC<{
  totalQuestions: number;
  solvedCount: number;
  remainingCount: number;
  completionPercentage: number;
  currentStreak: number;
  joinedCoursesCount: number;
}> = ({
  totalQuestions,
  solvedCount,
  remainingCount,
  completionPercentage,
  currentStreak,
  joinedCoursesCount
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <StatsCard
        label="Total Questions"
        value={totalQuestions}
        subtext="Platform goal"
        icon={<Target className="w-6 h-6" />}
        color="blue"
      />
      <StatsCard
        label="Questions Solved"
        value={solvedCount}
        subtext="Verified & manual"
        icon={<CheckCircle2 className="w-6 h-6" />}
        color="emerald"
      />
      <StatsCard
        label="Remaining"
        value={remainingCount}
        subtext="Questions left"
        icon={<Clock className="w-6 h-6" />}
        color="amber"
      />
      <StatsCard
        label="Completion"
        value={`${completionPercentage}%`}
        subtext="Overall progress"
        icon={<PieChart className="w-6 h-6" />}
        color="indigo"
      />
      <StatsCard
        label="Current Streak"
        value={`${currentStreak} Days`}
        subtext="Active streak"
        icon={<Flame className="w-6 h-6" />}
        color="orange"
      />
      <StatsCard
        label="Courses Joined"
        value={joinedCoursesCount}
        subtext="Enrolled tracks"
        icon={<BookOpen className="w-6 h-6" />}
        color="purple"
      />
    </div>
  );
};
