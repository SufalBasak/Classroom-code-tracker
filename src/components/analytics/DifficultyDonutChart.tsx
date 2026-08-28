import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

export interface DifficultyDonutProps {
  data: { name: string; value: number; color: string }[];
}

export const DifficultyDonutChart: React.FC<DifficultyDonutProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
      <div>
        <h3 className="font-bold text-slate-900 text-base">Difficulty Breakdown</h3>
        <p className="text-xs text-slate-500 mt-0.5">Distribution of solved problems</p>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', borderColor: '#e2e8f0' }}
              itemStyle={{ fontSize: 12, fontWeight: 'semibold' }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              formatter={(value) => <span className="text-xs font-semibold text-slate-700">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
