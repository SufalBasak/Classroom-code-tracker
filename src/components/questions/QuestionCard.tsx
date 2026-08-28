import React from 'react';
import { Question } from '../../types';
import { Button } from '../common/Button';
import { DifficultyBadge, StatusBadge, VerificationBadge, PlatformBadge } from '../common/Badge';
import { ExternalLink, CheckCircle2 } from 'lucide-react';

export interface QuestionCardProps {
  question: Question;
  onSolve: (url: string) => void;
  onMarkSolvedModal: (question: Question) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ question, onSolve, onMarkSolvedModal }) => {
  return (
    <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <PlatformBadge platform={question.platform} />
          <DifficultyBadge difficulty={question.difficulty} />
        </div>

        <div>
          <h4 className="font-bold text-slate-900 text-base leading-snug">{question.title}</h4>
          <p className="text-xs text-slate-500 mt-1 line-clamp-2">{question.description || 'Practice problem.'}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[11px] font-semibold">
            {question.topic}
          </span>
          <StatusBadge status={question.status} />
          {question.status === 'SOLVED' && <VerificationBadge verification={question.verification} />}
        </div>
      </div>

      <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
        <Button
          onClick={() => onSolve(question.externalUrl)}
          variant="primary"
          size="sm"
          className="flex-1"
          rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
        >
          Solve
        </Button>

        {question.status !== 'SOLVED' ? (
          <Button
            onClick={() => onMarkSolvedModal(question)}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            Mark Solved
          </Button>
        ) : (
          <div className="flex-1 text-center text-xs font-semibold text-emerald-600 flex items-center justify-center gap-1">
            <CheckCircle2 className="w-4 h-4" /> Solved
          </div>
        )}
      </div>
    </div>
  );
};
