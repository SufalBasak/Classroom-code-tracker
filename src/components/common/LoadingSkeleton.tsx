import React from 'react';
import { clsx } from 'clsx';

export const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={clsx('animate-pulse bg-slate-200 rounded-lg', className)} />
);

export const CardSkeleton: React.FC = () => (
  <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-4">
    <div className="flex items-center justify-between">
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-6 w-16 rounded-full" />
    </div>
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-2/3" />
    <div className="pt-2 flex justify-between items-center">
      <Skeleton className="h-8 w-24 rounded-xl" />
      <Skeleton className="h-8 w-20 rounded-xl" />
    </div>
  </div>
);

export const TableRowSkeleton: React.FC = () => (
  <div className="flex items-center justify-between py-3.5 px-4 border-b border-slate-100 gap-4">
    <Skeleton className="h-4 w-1/3" />
    <Skeleton className="h-4 w-1/6" />
    <Skeleton className="h-4 w-1/6" />
    <Skeleton className="h-6 w-20 rounded-full" />
  </div>
);
