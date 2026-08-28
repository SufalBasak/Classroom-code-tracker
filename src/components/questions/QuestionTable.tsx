import React from 'react';
import { Question } from '../../types';
import { Button } from '../common/Button';
import { DifficultyBadge, StatusBadge, VerificationBadge, PlatformBadge } from '../common/Badge';
import { QuestionCard } from './QuestionCard';
import { ExternalLink, CheckCircle2 } from 'lucide-react';

export interface QuestionTableProps {
  questions: Question[];
  onSolve: (url: string) => void;
  onMarkSolvedModal: (question: Question) => void;
}

export const QuestionTable: React.FC<QuestionTableProps> = ({
  questions,
  onSolve,
  onMarkSolvedModal
}) => {
  return (
    <div>
      {/* Mobile Card Grid View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
        {questions.map((q) => (
          <QuestionCard
            key={q.id}
            question={q}
            onSolve={onSolve}
            onMarkSolvedModal={onMarkSolvedModal}
          />
        ))}
      </div>

      {/* Desktop Responsive Table */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-5">Question</th>
                <th className="py-3.5 px-4">Platform</th>
                <th className="py-3.5 px-4">Difficulty</th>
                <th className="py-3.5 px-4">Topic</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Verification</th>
                <th className="py-3.5 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {questions.map((q) => (
                <tr key={q.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-5">
                    <div className="font-semibold text-slate-900">{q.title}</div>
                    {q.description && <div className="text-xs text-slate-400 font-normal line-clamp-1">{q.description}</div>}
                  </td>
                  <td className="py-4 px-4">
                    <PlatformBadge platform={q.platform} />
                  </td>
                  <td className="py-4 px-4">
                    <DifficultyBadge difficulty={q.difficulty} />
                  </td>
                  <td className="py-4 px-4 text-xs text-slate-600 font-medium">
                    {q.topic}
                  </td>
                  <td className="py-4 px-4">
                    <StatusBadge status={q.status} />
                  </td>
                  <td className="py-4 px-4">
                    {q.status === 'SOLVED' ? (
                      <VerificationBadge verification={q.verification} />
                    ) : (
                      <span className="text-xs text-slate-400 font-normal">-</span>
                    )}
                  </td>
                  <td className="py-4 px-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        onClick={() => onSolve(q.externalUrl)}
                        variant="primary"
                        size="sm"
                        rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
                      >
                        Solve
                      </Button>

                      {q.status !== 'SOLVED' && (
                        <Button
                          onClick={() => onMarkSolvedModal(q)}
                          variant="outline"
                          size="sm"
                        >
                          Mark Solved
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
