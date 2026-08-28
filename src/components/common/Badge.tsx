import React from 'react';
import { Difficulty, QuestionStatus, VerificationType, PlatformId } from '../../types';
import { clsx } from 'clsx';
import { CheckCircle2, Clock, CircleDot, ShieldCheck, UserCheck, AlertCircle } from 'lucide-react';

export interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'easy' | 'medium' | 'hard' | 'solved' | 'inProgress' | 'notStarted' | 'verified' | 'manual' | 'notVerified' | 'neutral' | 'blue';
  className?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'neutral', className, size = 'sm' }) => {
  const sizeStyles = size === 'sm' ? 'px-2.5 py-0.5 text-xs font-medium' : 'px-3 py-1 text-sm font-medium';

  const variantStyles = {
    easy: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
    medium: 'bg-amber-50 text-amber-700 border border-amber-200/60',
    hard: 'bg-rose-50 text-rose-700 border border-rose-200/60',
    solved: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
    inProgress: 'bg-blue-50 text-blue-700 border border-blue-200/60',
    notStarted: 'bg-slate-100 text-slate-600 border border-slate-200',
    verified: 'bg-blue-50 text-blue-700 border border-blue-200/60',
    manual: 'bg-purple-50 text-purple-700 border border-purple-200/60',
    notVerified: 'bg-amber-50 text-amber-700 border border-amber-200/60',
    neutral: 'bg-slate-100 text-slate-600 border border-slate-200',
    blue: 'bg-blue-50 text-blue-700 border border-blue-200'
  };

  return (
    <span className={clsx('inline-flex items-center gap-1.2 rounded-full border', variantStyles[variant], sizeStyles, className)}>
      {children}
    </span>
  );
};

export const DifficultyBadge: React.FC<{ difficulty: Difficulty; className?: string }> = ({ difficulty, className }) => {
  const map: Record<Difficulty, BadgeProps['variant']> = {
    Easy: 'easy',
    Medium: 'medium',
    Hard: 'hard'
  };
  return <Badge variant={map[difficulty]} className={className}>{difficulty}</Badge>;
};

export const StatusBadge: React.FC<{ status: QuestionStatus; className?: string }> = ({ status, className }) => {
  if (status === 'SOLVED') {
    return (
      <Badge variant="solved" className={className}>
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        <span>Solved</span>
      </Badge>
    );
  }
  if (status === 'IN_PROGRESS') {
    return (
      <Badge variant="inProgress" className={className}>
        <Clock className="w-3.5 h-3.5 text-blue-600" />
        <span>In Progress</span>
      </Badge>
    );
  }
  return (
    <Badge variant="notStarted" className={className}>
      <CircleDot className="w-3.5 h-3.5 text-slate-400" />
      <span>Not Started</span>
    </Badge>
  );
};

export const VerificationBadge: React.FC<{ verification: VerificationType; className?: string }> = ({ verification, className }) => {
  if (verification === 'VERIFIED') {
    return (
      <Badge variant="verified" className={className}>
        <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
        <span>Verified</span>
      </Badge>
    );
  }
  if (verification === 'MANUAL') {
    return (
      <Badge variant="manual" className={className}>
        <UserCheck className="w-3.5 h-3.5 text-purple-600" />
        <span>Manual</span>
      </Badge>
    );
  }
  return (
    <Badge variant="notVerified" className={className}>
      <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
      <span>Not Verified</span>
    </Badge>
  );
};

export const PlatformBadge: React.FC<{ platform: PlatformId; className?: string }> = ({ platform, className }) => {
  const platformColors: Record<PlatformId, string> = {
    LeetCode: 'bg-blue-50 text-blue-700 border-blue-200',
    GeeksforGeeks: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    HackerRank: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    Codeforces: 'bg-rose-50 text-rose-700 border-rose-200'
  };

  return (
    <span className={clsx('inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold border', platformColors[platform], className)}>
      {platform}
    </span>
  );
};
