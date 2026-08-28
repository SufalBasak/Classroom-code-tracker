import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles, MessageCircleQuestion } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface FaqItem {
  question: string;
  answer: string;
  category?: string;
}

const FAQS: FaqItem[] = [
  {
    category: 'General',
    question: 'What is CodeSnap and how does it help my coding practice?',
    answer: 'CodeSnap is a unified coding practice and progress-tracking platform. It organizes problems from LeetCode, GeeksforGeeks, HackerRank, and Codeforces into structured courses, tracking your daily streak, contribution heatmaps, and difficulty metrics in one clean dashboard.'
  },
  {
    category: 'Workflow',
    question: 'Do I need to solve problems directly inside CodeSnap?',
    answer: 'No! You solve problems on their original platforms (LeetCode, GFG, HackerRank, Codeforces). CodeSnap provides direct links to the exact problem pages and tracks your progress so you never lose context.'
  },
  {
    category: 'Pricing',
    question: 'Is CodeSnap free for students and developers?',
    answer: 'Yes! CodeSnap is 100% free for students, job seekers, and developers. You get full access to curated tracks, progress heatmaps, milestone badges, and global leaderboards.'
  },
  {
    category: 'Analytics',
    question: 'How does the Daily Coding Streak & 52-Week Heatmap work?',
    answer: 'Every day you solve a problem, CodeSnap logs your activity on a GitHub/LeetCode-style 52-week heat matrix. Consistent daily practice increments your streak counter and unlocks exclusive milestone badges.'
  },
  {
    category: 'Admin & Import',
    question: 'Can administrators create courses and bulk-import questions?',
    answer: 'Yes! Administrators can create custom courses, organize problem links into structured tables, and bulk-import questions using Excel/CSV spreadsheets directly from the Admin Control Center.'
  },
  {
    category: 'Accounts',
    question: 'How do I connect my LeetCode, GFG, or Codeforces accounts?',
    answer: 'Navigate to Settings > Connected Coding Accounts to link your handles. CodeSnap will aggregate your solved problem metrics across all platforms in one central view.'
  }
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-4">
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-200/60">
          <MessageCircleQuestion className="w-4 h-4 text-blue-600" />
          <span>Frequently Asked Questions</span>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Everything You Need to Know</h2>
        <p className="text-sm text-slate-600 max-w-xl mx-auto">
          Have questions about tracking your coding practice or using CodeSnap? We have answers.
        </p>
      </div>

      <div className="space-y-4">
        {FAQS.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className={cn(
                'rounded-2xl border transition-all duration-200 overflow-hidden bg-white',
                isOpen
                  ? 'border-blue-500 shadow-md ring-2 ring-blue-500/10'
                  : 'border-slate-200 hover:border-slate-300 shadow-xs'
              )}
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 font-semibold text-slate-900 focus:outline-none"
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-colors shrink-0',
                    isOpen ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                  )}>
                    Q{index + 1}
                  </div>
                  <span className="text-sm md:text-base font-bold text-slate-900">{faq.question}</span>
                </div>
                <div className={cn(
                  'p-1.5 rounded-full transition-transform duration-200 shrink-0',
                  isOpen ? 'rotate-180 bg-blue-50 text-blue-600' : 'text-slate-400 hover:bg-slate-100'
                )}>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              {isOpen && (
                <div className="px-6 pb-5 pt-1 text-xs md:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                  <p className="pl-11">{faq.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-10 text-center p-6 bg-slate-100/70 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-left">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Still have questions?</h4>
            <p className="text-xs text-slate-500">Contact our community support team anytime.</p>
          </div>
        </div>
        <a
          href="mailto:support@codesnap.dev"
          className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-sm"
        >
          Contact Support
        </a>
      </div>
    </div>
  );
};
