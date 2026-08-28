import React from 'react';
import { Course } from '../../types';
import { Button } from '../common/Button';
import { DifficultyBadge } from '../common/Badge';
import { BookOpen, Users, CheckCircle2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface CourseCardProps {
  course: Course;
  isJoined?: boolean;
  solvedCount?: number;
  totalQuestionsCount?: number;
  onJoinCourse?: (courseId: string) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  isJoined = false,
  solvedCount = 0,
  totalQuestionsCount,
  onJoinCourse
}) => {
  const navigate = useNavigate();
  const total = totalQuestionsCount || course.questionIds.length || 10;
  const percentage = Math.min(100, Math.round((solvedCount / total) * 100));

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
      <div>
        {/* Course Header Thumbnail */}
        <div className="relative h-44 overflow-hidden bg-slate-100">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className="px-2.5 py-1 bg-white/90 backdrop-blur-md rounded-lg text-xs font-semibold text-slate-800 shadow-2xs">
              {course.category}
            </span>
            <DifficultyBadge difficulty={course.difficulty} />
          </div>
          {isJoined && (
            <div className="absolute top-3 right-3 px-2.5 py-1 bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-md">
              <CheckCircle2 className="w-3.5 h-3.5" /> Enrolled
            </div>
          )}
        </div>

        {/* Content Details */}
        <div className="p-6 space-y-3">
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
            {course.title}
          </h3>
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{course.description}</p>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span className="flex items-center gap-1">
              <BookOpen className="w-4 h-4 text-slate-400" /> {total} Problems
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4 text-slate-400" /> {course.enrolledUsersCount} Enrolled
            </span>
          </div>

          {/* Progress Bar (if enrolled or in progress) */}
          {isJoined && (
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-600">{solvedCount} / {total} completed</span>
                <span className="text-blue-600">{percentage}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-6 pt-0">
        {isJoined ? (
          <Button
            onClick={() => navigate(`/courses/${course.id}`)}
            variant="primary"
            size="sm"
            className="w-full"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Continue Course
          </Button>
        ) : (
          <Button
            onClick={() => onJoinCourse?.(course.id)}
            variant="outline"
            size="sm"
            className="w-full"
          >
            Join Course
          </Button>
        )}
      </div>
    </div>
  );
};
