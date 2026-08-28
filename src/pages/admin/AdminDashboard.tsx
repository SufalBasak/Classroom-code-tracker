import React from 'react';
import { StatsCard } from '../../components/dashboard/StatsCard';
import { QuestionsOverTimeChart } from '../../components/analytics/QuestionsOverTimeChart';
import { PlatformDistributionChart } from '../../components/analytics/PlatformDistributionChart';
import { Users, BookOpen, Code2, CheckCircle2, Shield, Plus, Layers } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { NavLink } from 'react-router-dom';
import { progressService } from '../../services/progressService';
import { courseService } from '../../services/courseService';

export const AdminDashboard: React.FC = () => {
  const summary = progressService.getProgressSummary();
  const courses = courseService.getCourses();

  return (
    <div className="space-y-8 animate-element">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Command Center</h1>
          <p className="text-sm text-slate-500 mt-1">Platform overview metrics, curriculum controls, and user administration.</p>
        </div>

        <div className="flex items-center gap-3">
          <NavLink to="/admin/courses/new">
            <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
              Create Course
            </Button>
          </NavLink>
          <NavLink to="/admin/questions/import">
            <Button variant="outline" size="sm" leftIcon={<Layers className="w-4 h-4" />}>
              Bulk CSV Import
            </Button>
          </NavLink>
        </div>
      </div>

      {/* Admin Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard label="Total Users" value="1,420" subtext="182 active today" icon={<Users className="w-6 h-6" />} color="blue" />
        <StatsCard label="Total Courses" value={courses.length} subtext="5 Published" icon={<BookOpen className="w-6 h-6" />} color="emerald" />
        <StatsCard label="Total Questions" value="300" subtext="Across 4 platforms" icon={<Code2 className="w-6 h-6" />} color="indigo" />
        <StatsCard label="Total Solves Logged" value="14,850" subtext="Verified & manual" icon={<CheckCircle2 className="w-6 h-6" />} color="purple" />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QuestionsOverTimeChart />
        <PlatformDistributionChart data={summary.platformBreakdown} />
      </div>

      {/* Course Popularity Overview */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-base">Course Track Performance</h3>
          <NavLink to="/admin/courses" className="text-xs text-blue-600 font-semibold hover:underline">
            Manage All Courses
          </NavLink>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {courses.slice(0, 3).map((c) => (
            <div key={c.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-900">{c.title}</span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md text-[10px]">
                  {c.published ? 'Published' : 'Draft'}
                </span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-1">{c.description}</p>
              <div className="flex justify-between text-xs text-slate-600 font-semibold pt-1 border-t border-slate-200">
                <span>{c.questionIds.length} Questions</span>
                <span>{c.enrolledUsersCount} Enrolled</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
