import React from 'react';
import { User } from '../../types';
import { progressService } from '../../services/progressService';
import { courseService } from '../../services/courseService';
import { QuestionsOverTimeChart } from '../../components/analytics/QuestionsOverTimeChart';
import { DifficultyDonutChart } from '../../components/analytics/DifficultyDonutChart';
import { PlatformDistributionChart } from '../../components/analytics/PlatformDistributionChart';
import { TopicBarChart } from '../../components/analytics/TopicBarChart';
import { Heatmap } from '../../components/dashboard/Heatmap';
import { CheckCircle2, TrendingUp, Target } from 'lucide-react';

export const MyProgressPage: React.FC<{ user: User }> = ({ user }) => {
  const summary = progressService.getProgressSummary();
  const courses = courseService.getCourses();

  return (
    <div className="space-y-8 animate-element">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Progress & Analytics</h1>
        <p className="text-sm text-slate-500 mt-1">Deep-dive into your problem solving trajectory, consistency, and platform distribution.</p>
      </div>

      {/* Heatmap */}
      <Heatmap userId={user.id} currentStreak={summary.currentStreak} />

      {/* Primary Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QuestionsOverTimeChart />
        <TopicBarChart data={summary.topicBreakdown} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DifficultyDonutChart data={summary.difficultyBreakdown} />
        <PlatformDistributionChart data={summary.platformBreakdown} />
      </div>

      {/* Course Completion Breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div>
          <h3 className="font-bold text-slate-900 text-base">Track Completion Rates</h3>
          <p className="text-xs text-slate-500 mt-0.5">Progress across enrolled course tracks</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.slice(0, 4).map((c) => {
            const solved = c.id === 'c1' ? 4 : c.id === 'c2' ? 4 : 2;
            const total = c.questionIds.length || 8;
            const pct = Math.round((solved / total) * 100);

            return (
              <div key={c.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-900">{c.title}</span>
                  <span className="text-blue-600">{pct}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <div className="text-[11px] text-slate-500 flex justify-between">
                  <span>{solved} / {total} solved</span>
                  <span>{c.category}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
