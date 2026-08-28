import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseService } from '../../services/courseService';
import { questionService } from '../../services/questionService';
import { Question, PlatformId, Difficulty } from '../../types';
import { Button } from '../../components/common/Button';
import { DifficultyBadge, PlatformBadge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../components/common/Toast';
import { platformService } from '../../services/platformService';
import {
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle2,
  BookOpen
} from 'lucide-react';

export const AdminCourseBuilderPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [course, setCourse] = useState(courseService.getCourseById(id || ''));
  const allQuestions = questionService.getQuestions();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Add Question Form State
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newPlatform, setNewPlatform] = useState<PlatformId>('LeetCode');
  const [newDifficulty, setNewDifficulty] = useState<Difficulty>('Easy');
  const [newTopic, setNewTopic] = useState('Algorithms');

  if (!course) return null;

  const courseQuestions = allQuestions.filter((q) => course.questionIds.includes(q.id));

  const handleUrlChange = (url: string) => {
    setNewUrl(url);
    const detected = platformService.detectPlatformFromUrl(url);
    if (detected) {
      setNewPlatform(detected);
    }
  };

  const handleMoveQuestion = (index: number, direction: 'up' | 'down') => {
    const ids = [...course.questionIds];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= ids.length) return;

    const temp = ids[index];
    ids[index] = ids[targetIdx];
    ids[targetIdx] = temp;

    const updated = courseService.reorderQuestionsInCourse(course.id, ids);
    if (updated) setCourse(updated);
  };

  const handleAddQuestionToCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newUrl) {
      showToast('Title and external question link are required.', 'error');
      return;
    }

    const created = questionService.saveQuestion({
      title: newTitle,
      externalUrl: newUrl,
      platform: newPlatform,
      difficulty: newDifficulty,
      topic: newTopic,
      courseId: course.id
    });

    const updatedIds = [...course.questionIds, created.id];
    const updatedCourse = courseService.reorderQuestionsInCourse(course.id, updatedIds);
    if (updatedCourse) setCourse(updatedCourse);

    setNewTitle('');
    setNewUrl('');
    setIsAddModalOpen(false);
    showToast('✓ Question link added to course track!', 'success');
  };

  const handleRemoveQuestion = (qId: string) => {
    const updatedIds = course.questionIds.filter((qid) => qid !== qId);
    const updatedCourse = courseService.reorderQuestionsInCourse(course.id, updatedIds);
    if (updatedCourse) setCourse(updatedCourse);
    showToast('Question removed from course.', 'info');
  };

  return (
    <div className="space-y-6 animate-element max-w-5xl mx-auto">
      <button
        onClick={() => navigate('/admin/courses')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-blue-600"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Courses
      </button>

      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Course Track Builder</span>
            <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded-md text-xs font-bold">{course.category}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">{course.title}</h1>
          <p className="text-xs text-slate-500 mt-0.5">{courseQuestions.length} Questions configured in this curriculum track</p>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={() => setIsAddModalOpen(true)} variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
            Add Question Link
          </Button>
          <Button onClick={() => navigate(`/courses/${course.id}`)} variant="outline" size="sm">
            Preview Student View
          </Button>
        </div>
      </div>

      {/* Structured Table Format */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm space-y-4 p-6">
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-base">Curriculum Question Table</h3>
          <span className="text-xs text-slate-500 font-semibold">{courseQuestions.length} total questions</span>
        </div>

        {courseQuestions.length > 0 ? (
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4 w-16">Reorder</th>
                  <th className="py-3.5 px-4">#</th>
                  <th className="py-3.5 px-5">Question Title</th>
                  <th className="py-3.5 px-4">Platform</th>
                  <th className="py-3.5 px-4">Difficulty</th>
                  <th className="py-3.5 px-4">Topic</th>
                  <th className="py-3.5 px-5">External Link</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {courseQuestions.map((q, idx) => (
                  <tr key={q.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1">
                        <button
                          disabled={idx === 0}
                          onClick={() => handleMoveQuestion(idx, 'up')}
                          className="p-1 text-slate-400 hover:text-blue-600 disabled:opacity-30 rounded-md hover:bg-slate-200/60"
                          title="Move up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          disabled={idx === courseQuestions.length - 1}
                          onClick={() => handleMoveQuestion(idx, 'down')}
                          className="p-1 text-slate-400 hover:text-blue-600 disabled:opacity-30 rounded-md hover:bg-slate-200/60"
                          title="Move down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-400">#{idx + 1}</td>

                    <td className="py-3.5 px-5">
                      <div className="font-bold text-slate-900 text-sm">{q.title}</div>
                      {q.description && <div className="text-[11px] text-slate-400 font-normal line-clamp-1">{q.description}</div>}
                    </td>

                    <td className="py-3.5 px-4">
                      <PlatformBadge platform={q.platform} />
                    </td>

                    <td className="py-3.5 px-4">
                      <DifficultyBadge difficulty={q.difficulty} />
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 font-semibold">{q.topic}</td>

                    <td className="py-3.5 px-5">
                      <a
                        href={q.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 font-mono text-[11px] hover:underline inline-flex items-center gap-1.5"
                      >
                        <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate max-w-[160px]">{q.externalUrl}</span>
                      </a>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleRemoveQuestion(q.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Remove question"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-sm text-slate-500">
            No questions configured in this course yet. Click 'Add Question Link' above to populate table.
          </div>
        )}
      </div>

      {/* Add Question Link Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Question Link to Course"
        description="Enter external platform link (LeetCode, GFG, HackerRank, Codeforces)"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleAddQuestionToCourse}>
              Save Question to Table
            </Button>
          </>
        }
      >
        <form onSubmit={handleAddQuestionToCourse} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 block">External Question Link URL</label>
            <input
              type="url"
              required
              value={newUrl}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="e.g. https://leetcode.com/problems/two-sum/"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-blue-500 font-mono text-xs"
            />
            {newUrl && (
              <p className="text-xs text-blue-600 font-semibold mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Auto-Detected Platform: <strong>{newPlatform}</strong>
              </p>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 block">Question Title</label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Two Sum"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 block">Platform</label>
              <select
                value={newPlatform}
                onChange={(e) => setNewPlatform(e.target.value as PlatformId)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none"
              >
                <option value="LeetCode">LeetCode</option>
                <option value="GeeksforGeeks">GeeksforGeeks</option>
                <option value="HackerRank">HackerRank</option>
                <option value="Codeforces">Codeforces</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 block">Difficulty</label>
              <select
                value={newDifficulty}
                onChange={(e) => setNewDifficulty(e.target.value as Difficulty)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 block">Topic / Tag</label>
            <input
              type="text"
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              placeholder="e.g. Arrays"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-blue-500"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
