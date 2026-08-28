import React, { useState } from 'react';
import { User, Course, Difficulty } from '../../types';
import { CourseCard } from '../../components/courses/CourseCard';
import { courseService } from '../../services/courseService';
import { useToast } from '../../components/common/Toast';
import { Search, Filter, BookOpen } from 'lucide-react';
import { EmptyState } from '../../components/common/EmptyState';

export const CoursesPage: React.FC<{ user: User; onUserUpdate: (u: User) => void }> = ({ user, onUserUpdate }) => {
  const { showToast } = useToast();
  const [courses, setCourses] = useState<Course[]>(courseService.getCourses());
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'ALL'>('ALL');

  const categories = ['ALL', 'Databases', 'Algorithms', 'Data Structures', 'Language Basics', 'Advanced Algorithms'];

  const filteredCourses = courses.filter((c) => {
    if (search && !c.title.toLowerCase().includes(search.toLowerCase()) && !c.description.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (selectedCategory !== 'ALL' && c.category !== selectedCategory) {
      return false;
    }
    if (selectedDifficulty !== 'ALL' && c.difficulty !== selectedDifficulty) {
      return false;
    }
    return true;
  });

  const handleJoinCourse = (courseId: string) => {
    const updatedJoinedIds = courseService.joinCourse(courseId, user.joinedCourseIds);
    onUserUpdate({ ...user, joinedCourseIds: updatedJoinedIds });
    setCourses(courseService.getCourses());
    showToast('✓ Successfully joined course track!', 'success');
  };

  return (
    <div className="space-y-6 animate-element">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Explore Coding Courses</h1>
        <p className="text-sm text-slate-500 mt-1">Structured problem lists curated for technical interviews and skill mastery.</p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Category Pill Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Difficulty Dropdown */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value as any)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
      </div>

      {/* Course Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((c) => (
            <CourseCard
              key={c.id}
              course={c}
              isJoined={user.joinedCourseIds.includes(c.id)}
              onJoinCourse={handleJoinCourse}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No courses found"
          description="No courses matched your search or filter criteria. Try clearing your filters."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearch('');
            setSelectedCategory('ALL');
            setSelectedDifficulty('ALL');
          }}
        />
      )}
    </div>
  );
};
