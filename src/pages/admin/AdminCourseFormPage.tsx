import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Course, Difficulty } from '../../types';
import { courseService } from '../../services/courseService';
import { Button } from '../../components/common/Button';
import { useToast } from '../../components/common/Toast';
import { ArrowLeft } from 'lucide-react';

export const AdminCourseFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const isEdit = Boolean(id && id !== 'new');
  const existingCourse = isEdit ? courseService.getCourseById(id!) : undefined;

  const [title, setTitle] = useState(existingCourse?.title || '');
  const [slug, setSlug] = useState(existingCourse?.slug || '');
  const [description, setDescription] = useState(existingCourse?.description || '');
  const [category, setCategory] = useState(existingCourse?.category || 'Databases');
  const [difficulty, setDifficulty] = useState<Difficulty>(existingCourse?.difficulty || 'Medium');
  const [thumbnail, setThumbnail] = useState(existingCourse?.thumbnail || 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&auto=format&fit=crop&q=80');
  const [published, setPublished] = useState(existingCourse?.published ?? true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Course title is required.', 'error');
      return;
    }

    courseService.saveCourse({
      id: isEdit ? id : undefined,
      title,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description,
      category,
      difficulty,
      thumbnail,
      published
    });

    showToast(`✓ Course ${isEdit ? 'updated' : 'created'} successfully!`, 'success');
    navigate('/admin/courses');
  };

  return (
    <div className="space-y-6 animate-element max-w-2xl mx-auto">
      <button
        onClick={() => navigate('/admin/courses')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-blue-600"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Courses
      </button>

      <div>
        <h1 className="text-2xl font-bold text-slate-900">{isEdit ? 'Edit Course' : 'Create New Course'}</h1>
        <p className="text-sm text-slate-500 mt-1">Configure track metadata, category, and publishing settings.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div>
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 block">Course Name</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!isEdit) setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
            }}
            placeholder="e.g. Graph Algorithms Masterclass"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 block">Slug (URL path)</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-blue-500 font-mono text-xs"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 block">Description</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Summary of what students will master..."
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 block">Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 block">Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-blue-500"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 block">Thumbnail Image URL</label>
          <input
            type="text"
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="pt-2">
          <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-slate-700">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="custom-checkbox"
            />
            <span>Publish course to students immediately</span>
          </label>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button type="button" variant="outline" size="sm" onClick={() => navigate('/admin/courses')}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="md">
            {isEdit ? 'Save Changes' : 'Create Course Track'}
          </Button>
        </div>
      </form>
    </div>
  );
};
