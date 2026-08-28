import React from 'react';
import { Inbox, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No content found',
  description = 'Try adjusting your search or filters to find what you are looking for.',
  actionLabel,
  onAction,
  icon
}) => (
  <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-sm my-4">
    <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
      {icon || <Inbox className="w-8 h-8" />}
    </div>
    <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
    <p className="text-sm text-slate-500 max-w-md mt-1 mb-6 leading-relaxed">{description}</p>
    {actionLabel && onAction && (
      <Button onClick={onAction} variant="outline" size="sm">
        {actionLabel}
      </Button>
    )}
  </div>
);

export interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  description = "We couldn't load this content. Please check your connection and try again.",
  onRetry
}) => (
  <div className="flex flex-col items-center justify-center p-12 text-center bg-rose-50/50 rounded-2xl border border-rose-200/80 my-4">
    <div className="w-16 h-16 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600 mb-4">
      <AlertCircle className="w-8 h-8" />
    </div>
    <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
    <p className="text-sm text-slate-600 max-w-md mt-1 mb-6 leading-relaxed">{description}</p>
    {onRetry && (
      <Button onClick={onRetry} variant="danger" size="sm" leftIcon={<RefreshCw className="w-4 h-4" />}>
        Retry Loading
      </Button>
    )}
  </div>
);
