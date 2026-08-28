import React from 'react';
import { Achievement } from '../../types';
import { NavLink } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export interface AwardsBadgesCardProps {
  achievements?: Achievement[];
  unlockedCount?: number;
  totalCount?: number;
}

interface HexBadgeItem {
  id: string;
  title: string;
  icon: string;
  borderColor: string;
  bgTint: string;
  unlocked: boolean;
}

export const AwardsBadgesCard: React.FC<AwardsBadgesCardProps> = () => {
  const badges: HexBadgeItem[] = [
    { id: 'b1', title: 'First Solve', icon: '🚀', borderColor: '#F97316', bgTint: 'rgba(249, 115, 22, 0.06)', unlocked: true },
    { id: 'b2', title: '3-Day Streak', icon: '🔥', borderColor: '#EF4444', bgTint: 'rgba(239, 68, 68, 0.06)', unlocked: true },
    { id: 'b3', title: '7-Day Streak', icon: '⚡', borderColor: '#EAB308', bgTint: 'rgba(234, 179, 8, 0.06)', unlocked: true },
    { id: 'b4', title: 'High Trust', icon: '🛡️', borderColor: '#CBD5E1', bgTint: 'rgba(241, 245, 249, 0.5)', unlocked: false },
    { id: 'b5', title: 'SQL Veteran', icon: '💎', borderColor: '#2563EB', bgTint: 'rgba(37, 99, 235, 0.06)', unlocked: true },
    { id: 'b6', title: 'Centurion', icon: '🏆', borderColor: '#9333EA', bgTint: 'rgba(147, 51, 234, 0.06)', unlocked: true },
    { id: 'b7', title: '500 Days Badge', icon: '🏅', borderColor: '#F59E0B', bgTint: 'rgba(245, 158, 11, 0.06)', unlocked: true },
  ];

  const unlockedCount = badges.filter((b) => b.unlocked).length;
  const totalCount = badges.length;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-sm space-y-6">
      <div className="flex justify-between items-start sm:items-center">
        <div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">Awards & Badges</h3>
          <p className="text-sm font-medium text-slate-500 mt-0.5">
            <strong className="text-slate-700">{unlockedCount} of {totalCount}</strong> Milestones Unlocked
          </p>
        </div>

        <NavLink
          to="/achievements"
          className="text-xs font-semibold text-blue-600 hover:underline inline-flex items-center gap-1"
        >
          View All <ArrowRight className="w-3.5 h-3.5" />
        </NavLink>
      </div>

      {/* Hexagonal Badges Row */}
      <div className="overflow-x-auto pb-2">
        <div className="flex items-center justify-between min-w-[650px] gap-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`flex flex-col items-center text-center space-y-2.5 transition-transform hover:scale-105 ${
                badge.unlocked ? 'opacity-100' : 'opacity-40 grayscale-[40%]'
              }`}
            >
              {/* Hexagon Container */}
              <div className="relative w-20 h-24 flex items-center justify-center">
                <svg viewBox="0 0 100 115" className="w-full h-full drop-shadow-2xs">
                  <polygon
                    points="50,5 95,30 95,85 50,110 5,85 5,30"
                    fill={badge.unlocked ? badge.bgTint : '#F8FAFC'}
                    stroke={badge.borderColor}
                    strokeWidth="4"
                    strokeLinejoin="round"
                  />
                </svg>

                {/* Badge Emoji / Icon */}
                <span className="absolute text-2xl select-none transform transition-transform hover:scale-110">
                  {badge.icon}
                </span>
              </div>

              {/* Badge Title */}
              <span className={`text-xs font-bold leading-tight max-w-[85px] truncate ${
                badge.unlocked ? 'text-slate-800' : 'text-slate-400 font-medium'
              }`}>
                {badge.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
