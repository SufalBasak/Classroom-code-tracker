import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const sampleTimeData = [
  { date: 'May 1', solved: 45 },
  { date: 'May 15', solved: 58 },
  { date: 'Jun 1', solved: 72 },
  { date: 'Jun 15', solved: 89 },
  { date: 'Jul 1', solved: 104 },
  { date: 'Jul 15', solved: 115 },
  { date: 'Aug 1', solved: 121 },
  { date: 'Aug 28', solved: 127 }
];

export interface QuestionsOverTimeProps {
  data?: { date: string; solved: number }[];
}

export const QuestionsOverTimeChart: React.FC<QuestionsOverTimeProps> = ({ data }) => {
  const chartData = data && data.length > 0 ? data : sampleTimeData;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
      <div>
        <h3 className="font-bold text-slate-900 text-base">Questions Solved Over Time</h3>
        <p className="text-xs text-slate-500 mt-0.5">Cumulative progress trajectory</p>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', borderColor: '#e2e8f0', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
              labelStyle={{ fontSize: 12, fontWeight: 'bold', color: '#0f172a' }}
              itemStyle={{ fontSize: 12, color: '#2563EB' }}
            />
            <Area type="monotone" dataKey="solved" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#blueGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
