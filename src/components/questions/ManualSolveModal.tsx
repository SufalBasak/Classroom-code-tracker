import React from 'react';
import { Question } from '../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { VerificationBadge } from '../common/Badge';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

export interface ManualSolveModalProps {
  isOpen: boolean;
  question: Question | null;
  onClose: () => void;
  onConfirm: (questionId: string) => void;
}

export const ManualSolveModal: React.FC<ManualSolveModalProps> = ({
  isOpen,
  question,
  onClose,
  onConfirm
}) => {
  if (!question) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Mark Problem as Solved"
      description="Record manual progress on CodeSnap"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<CheckCircle2 className="w-4 h-4" />}
            onClick={() => {
              onConfirm(question.id);
              onClose();
            }}
          >
            Mark as Solved
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-slate-900 text-sm">{question.title}</h4>
            <span className="text-xs font-semibold text-blue-600">{question.platform}</span>
          </div>
          <p className="text-xs text-slate-500 line-clamp-2">{question.description || 'Coding challenge problem.'}</p>
        </div>

        <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 space-y-1">
            <p className="font-semibold">Manual Progress Recording</p>
            <p className="leading-relaxed">
              This problem will be recorded with status <strong className="text-emerald-700">Solved</strong> and verification type:
            </p>
            <div className="pt-1">
              <VerificationBadge verification="MANUAL" />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
