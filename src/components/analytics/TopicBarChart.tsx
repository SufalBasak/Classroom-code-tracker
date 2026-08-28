import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export interface TopicBarChartProps {
  data: { topic: string; solved: number; total: number }[];
}

export const TopicBarChart: React.FC<TopicBarChartProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
      <div>
        <h3 className="font-bold text-slate-900 text-base">Topic Breakdown</h3>
        <p className="text-xs text-slate-500 mt-0.5">Problems solved vs topic target</p>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="topic" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', borderColor: '#e2e8f0' }}
              itemStyle={{ fontSize: 12 }}
            />
            <Bar dataKey="solved" fill="#2563EB" radius={[6, 6, 0, 0]} name="Solved" />
            <Bar dataKey="total" fill="#E2E8F0" radius={[6, 6, 0, 0]} name="Total Goal" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
