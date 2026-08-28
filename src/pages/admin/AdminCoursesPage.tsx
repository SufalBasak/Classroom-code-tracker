import React, { useState } from 'react';
import { Course } from '../../types';
import { courseService } from '../../services/courseService';
import { Button } from '../../components/common/Button';
import { DifficultyBadge } from '../../components/common/Badge';
import { useToast } from '../../components/common/Toast';
import { NavLink, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, EyeOff, Layers } from 'lucide-react';

export const AdminCoursesPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [courses, setCourses] = useState<Course[]>(courseService.getCourses());

  const handleTogglePublish = (courseId: string) => {
    const updated = courses.map((c) => {
      if (c.id === courseId) {
        const nextState = !c.published;
        showToast(`${c.title} is now ${nextState ? 'Published' : 'Unpublished'}`, 'info');
        return { ...c, published: nextState };
      }
      return c;
    });
    setCourses(updated);
    localStorage.setItem('codesnap_mock_courses', JSON.stringify(updated));
  };

  const handleDelete = (courseId: string) => {
    courseService.deleteCourse(courseId);
    setCourses(courseService.getCourses());
    showToast('Course deleted successfully', 'success');
  };

  return (
    <div className="space-y-6 animate-element">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Course Track Management</h1>
          <p className="text-sm text-slate-500 mt-1">Create, edit, reorder, and manage coding course curriculum tracks.</p>
        </div>

        <NavLink to="/admin/courses/new">
          <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
            Create New Course
          </Button>
        </NavLink>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-3.5 px-6">Course Title</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Difficulty</th>
              <th className="py-3.5 px-4">Questions</th>
              <th className="py-3.5 px-4">Students</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
            {courses.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50">
                <td className="py-4 px-6">
                  <div className="font-bold text-slate-900">{c.title}</div>
                  <div className="text-xs text-slate-400 font-normal line-clamp-1">{c.description}</div>
                </td>

                <td className="py-4 px-4 text-xs font-semibold text-slate-600">{c.category}</td>

                <td className="py-4 px-4">
                  <DifficultyBadge difficulty={c.difficulty} />
                </td>

                <td className="py-4 px-4 font-bold text-slate-900">{c.questionIds.length} Questions</td>

                <td className="py-4 px-4 text-slate-600">{c.enrolledUsersCount} Enrolled</td>

                <td className="py-4 px-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    c.published ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {c.published ? 'Published' : 'Draft'}
                  </span>
                </td>

                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      onClick={() => navigate(`/admin/courses/${c.id}`)}
                      variant="outline"
                      size="sm"
                      leftIcon={<Layers className="w-3.5 h-3.5" />}
                    >
                      Builder
                    </Button>

                    <Button
                      onClick={() => handleTogglePublish(c.id)}
                      variant="ghost"
                      size="sm"
                      title={c.published ? 'Unpublish' : 'Publish'}
                    >
                      {c.published ? <EyeOff className="w-4 h-4 text-amber-600" /> : <Eye className="w-4 h-4 text-emerald-600" />}
                    </Button>

                    <Button
                      onClick={() => navigate(`/admin/courses/${c.id}/edit`)}
                      variant="ghost"
                      size="sm"
                    >
                      <Edit className="w-4 h-4 text-slate-600" />
                    </Button>

                    <Button
                      onClick={() => handleDelete(c.id)}
                      variant="ghost"
                      size="sm"
                    >
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
