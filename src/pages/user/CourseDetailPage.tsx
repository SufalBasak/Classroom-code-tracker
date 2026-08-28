import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Question } from '../../types';
import { courseService } from '../../services/courseService';
import { questionService } from '../../services/questionService';
import { QuestionTable } from '../../components/questions/QuestionTable';
import { ManualSolveModal } from '../../components/questions/ManualSolveModal';
import { Button } from '../../components/common/Button';
import { DifficultyBadge } from '../../components/common/Badge';
import { useToast } from '../../components/common/Toast';
import { ArrowLeft, BookOpen, CheckCircle2, Users } from 'lucide-react';
import { EmptyState } from '../../components/common/EmptyState';

export const CourseDetailPage: React.FC<{ user: User; onUserUpdate: (u: User) => void }> = ({ user, onUserUpdate }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [selectedQuestionForModal, setSelectedQuestionForModal] = useState<Question | null>(null);

  const course = courseService.getCourseById(id || '');
  const allQuestions = questionService.getQuestions();
  const courseQuestions = allQuestions.filter((q) => q.courseId === course?.id || course?.questionIds.includes(q.id));

  if (!course) {
    return (
      <EmptyState
        title="Course Not Found"
        description="The course you requested could not be located."
        actionLabel="Back to Courses"
        onAction={() => navigate('/courses')}
      />
    );
  }

  const isJoined = user.joinedCourseIds.includes(course.id);
  const solvedCount = courseQuestions.filter((q) => q.status === 'SOLVED').length;
  const totalCount = courseQuestions.length;
  const percentage = Math.round((solvedCount / (totalCount || 1)) * 100);

  const handleJoinCourse = () => {
    const updated = courseService.joinCourse(course.id, user.joinedCourseIds);
    onUserUpdate({ ...user, joinedCourseIds: updated });
    showToast('✓ Joined course successfully!', 'success');
  };

  const handleExternalSolve = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleConfirmManualSolve = (questionId: string) => {
    questionService.markAsSolved(questionId, true);
    showToast('✓ Marked problem as solved!', 'success');
  };

  return (
    <div className="space-y-8 animate-element">
      <button
        onClick={() => navigate('/courses')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Courses
      </button>

      {/* Course Hero Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold">
                {course.category}
              </span>
              <DifficultyBadge difficulty={course.difficulty} />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900">{course.title}</h1>
            <p className="text-sm text-slate-600 leading-relaxed">{course.description}</p>

            <div className="flex items-center gap-6 text-xs text-slate-500 pt-2">
              <span className="flex items-center gap-1.5 font-medium">
                <BookOpen className="w-4 h-4 text-slate-400" /> {totalCount} Problems
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <Users className="w-4 h-4 text-slate-400" /> {course.enrolledUsersCount} Students Enrolled
              </span>
            </div>
          </div>

          <div>
            {isJoined ? (
              <div className="p-4 bg-blue-50/80 border border-blue-200 rounded-2xl text-center space-y-2 min-w-[200px]">
                <span className="px-2.5 py-1 bg-emerald-500 text-white rounded-md text-xs font-bold inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Enrolled Track
                </span>
                <div className="text-xs text-slate-600 font-semibold">{solvedCount} / {totalCount} completed ({percentage}%)</div>
                <div className="w-full bg-blue-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: `${percentage}%` }} />
                </div>
              </div>
            ) : (
              <Button onClick={handleJoinCourse} variant="primary" size="lg">
                Join Course Track
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Question Checklist */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-900">Curated Question Checklist</h2>
          <span className="text-xs text-slate-500">{solvedCount} of {totalCount} Solved</span>
        </div>

        {courseQuestions.length > 0 ? (
          <QuestionTable
            questions={courseQuestions}
            onSolve={handleExternalSolve}
            onMarkSolvedModal={(q) => setSelectedQuestionForModal(q)}
          />
        ) : (
          <EmptyState
            title="No questions in this course yet"
            description="The admin will add questions to this course track soon."
          />
        )}
      </div>

      <ManualSolveModal
        isOpen={Boolean(selectedQuestionForModal)}
        question={selectedQuestionForModal}
        onClose={() => setSelectedQuestionForModal(null)}
        onConfirm={handleConfirmManualSolve}
      />
    </div>
  );
};
