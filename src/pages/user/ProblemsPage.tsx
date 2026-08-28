import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Question, PlatformId, Difficulty, QuestionStatus } from '../../types';
import { questionService, QuestionFilters } from '../../services/questionService';
import { QuestionTable } from '../../components/questions/QuestionTable';
import { ManualSolveModal } from '../../components/questions/ManualSolveModal';
import { Pagination } from '../../components/common/Pagination';
import { EmptyState } from '../../components/common/EmptyState';
import { useToast } from '../../components/common/Toast';
import { Search, Filter, RefreshCw } from 'lucide-react';

export const ProblemsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { showToast } = useToast();
  const [questions, setQuestions] = useState<Question[]>(questionService.getQuestions());
  const [selectedQuestionForModal, setSelectedQuestionForModal] = useState<Question | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const [filters, setFilters] = useState<QuestionFilters>({
    search: searchParams.get('search') || '',
    platform: (searchParams.get('platform') as PlatformId) || 'ALL',
    difficulty: (searchParams.get('difficulty') as Difficulty) || 'ALL',
    topic: 'ALL',
    status: 'ALL'
  });

  useEffect(() => {
    const qSearch = searchParams.get('search');
    if (qSearch) {
      setFilters((prev) => ({ ...prev, search: qSearch }));
    }
  }, [searchParams]);

  const filteredQuestions = questionService.filterQuestions(questions, filters);
  const totalPages = Math.ceil(filteredQuestions.length / pageSize) || 1;
  const paginatedQuestions = filteredQuestions.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleFilterChange = (key: keyof QuestionFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({ search: '', platform: 'ALL', difficulty: 'ALL', topic: 'ALL', status: 'ALL' });
    setSearchParams({});
    setCurrentPage(1);
  };

  const handleExternalSolve = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleConfirmManualSolve = (questionId: string) => {
    questionService.markAsSolved(questionId, true);
    setQuestions(questionService.getQuestions());
    showToast('✓ Problem marked as manually solved!', 'success');
  };

  return (
    <div className="space-y-6 animate-element">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Problem Browser</h1>
        <p className="text-sm text-slate-500 mt-1">Browse, filter, and practice coding challenges from top platforms.</p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search problem title or topic..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Platform Filter */}
            <select
              value={filters.platform}
              onChange={(e) => handleFilterChange('platform', e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="ALL">All Platforms</option>
              <option value="LeetCode">LeetCode</option>
              <option value="GeeksforGeeks">GeeksforGeeks</option>
              <option value="HackerRank">HackerRank</option>
              <option value="Codeforces">Codeforces</option>
            </select>

            {/* Difficulty Filter */}
            <select
              value={filters.difficulty}
              onChange={(e) => handleFilterChange('difficulty', e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="ALL">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>

            {/* Status Filter */}
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="SOLVED">Solved</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="NOT_STARTED">Not Started</option>
            </select>

            {(filters.search || filters.platform !== 'ALL' || filters.difficulty !== 'ALL' || filters.status !== 'ALL') && (
              <button
                onClick={handleClearFilters}
                className="text-xs text-rose-600 font-semibold hover:underline px-2 py-1"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results Table */}
      {paginatedQuestions.length > 0 ? (
        <div className="space-y-4">
          <QuestionTable
            questions={paginatedQuestions}
            onSolve={handleExternalSolve}
            onMarkSolvedModal={(q) => setSelectedQuestionForModal(q)}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
            totalItems={filteredQuestions.length}
            pageSize={pageSize}
          />
        </div>
      ) : (
        <EmptyState
          title="No problems found"
          description="We couldn't find any questions matching your current filters."
          actionLabel="Reset Search & Filters"
          onAction={handleClearFilters}
        />
      )}

      <ManualSolveModal
        isOpen={Boolean(selectedQuestionForModal)}
        question={selectedQuestionForModal}
        onClose={() => setSelectedQuestionForModal(null)}
        onConfirm={handleConfirmManualSolve}
      />
    </div>
  );
};
