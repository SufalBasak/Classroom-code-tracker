import React, { useState } from 'react';
import { Question } from '../../types';
import { questionService } from '../../services/questionService';
import { Button } from '../../components/common/Button';
import { DifficultyBadge, PlatformBadge } from '../../components/common/Badge';
import { useToast } from '../../components/common/Toast';
import { Search, Plus, Trash2, ExternalLink } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export const AdminQuestionsPage: React.FC = () => {
  const { showToast } = useToast();
  const [questions, setQuestions] = useState<Question[]>(questionService.getQuestions());
  const [search, setSearch] = useState('');

  const filtered = questions.filter((q) => q.title.toLowerCase().includes(search.toLowerCase()) || q.topic.toLowerCase().includes(search.toLowerCase()));

  const handleDelete = (id: string) => {
    questionService.deleteQuestion(id);
    setQuestions(questionService.getQuestions());
    showToast('Question deleted', 'info');
  };

  return (
    <div className="space-y-6 animate-element">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Question Management</h1>
          <p className="text-sm text-slate-500 mt-1">Manage global question inventory across platforms.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search questions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none"
            />
          </div>

          <NavLink to="/admin/questions/import">
            <Button variant="primary" size="sm">
              Bulk CSV Import
            </Button>
          </NavLink>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-3.5 px-6">Title</th>
              <th className="py-3.5 px-4">Platform</th>
              <th className="py-3.5 px-4">Difficulty</th>
              <th className="py-3.5 px-4">Topic</th>
              <th className="py-3.5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
            {filtered.map((q) => (
              <tr key={q.id} className="hover:bg-slate-50">
                <td className="py-4 px-6 font-bold text-slate-900">{q.title}</td>

                <td className="py-4 px-4">
                  <PlatformBadge platform={q.platform} />
                </td>

                <td className="py-4 px-4">
                  <DifficultyBadge difficulty={q.difficulty} />
                </td>

                <td className="py-4 px-4 text-xs font-semibold text-slate-600">{q.topic}</td>

                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <a href={q.externalUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="sm" rightIcon={<ExternalLink className="w-3.5 h-3.5" />}>
                        Link
                      </Button>
                    </a>
                    <Button onClick={() => handleDelete(q.id)} variant="ghost" size="sm">
                      <Trash2 className="w-4 h-4 text-rose-600" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
