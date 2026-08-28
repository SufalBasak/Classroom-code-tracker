import React, { useEffect, useState } from 'react';
import { User, Question, LeaderboardUser } from '../../types';
import { ProfileCard } from '../../components/dashboard/ProfileCard';
import { AwardsBadgesCard } from '../../components/dashboard/AwardsBadgesCard';
import { ConnectedPlatformsCard } from '../../components/dashboard/ConnectedPlatformsCard';
import { Heatmap } from '../../components/dashboard/Heatmap';
import { CourseCard } from '../../components/courses/CourseCard';
import { QuestionTable } from '../../components/questions/QuestionTable';
import { ManualSolveModal } from '../../components/questions/ManualSolveModal';
import { DifficultyDonutChart } from '../../components/analytics/DifficultyDonutChart';
import { PlatformDistributionChart } from '../../components/analytics/PlatformDistributionChart';
import { progressService } from '../../services/progressService';
import { courseService } from '../../services/courseService';
import { questionService } from '../../services/questionService';
import { achievementService } from '../../services/achievementService';
import { leaderboardService } from '../../services/leaderboardService';
import { useToast } from '../../components/common/Toast';
import { Button } from '../../components/common/Button';
import { NavLink, useNavigate } from 'react-router-dom';
import { ArrowRight, Trophy } from 'lucide-react';

export const UserDashboard: React.FC<{ user: User; onUserUpdate: (u: User) => void }> = ({ user, onUserUpdate }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [selectedQuestionForModal, setSelectedQuestionForModal] = useState<Question | null>(null);

  const summary = progressService.getProgressSummary();
  const courses = courseService.getCourses();
  const allQuestions = questionService.getQuestions();
  const recentQuestions = allQuestions.slice(0, 5);
  const [leaderboardTop, setLeaderboardTop] = useState<LeaderboardUser[]>([]);

  useEffect(() => {
    leaderboardService.getLeaderboard('allTime').then((data) => setLeaderboardTop(data.slice(0, 4)));
  }, []);

  const handleExternalSolve = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleConfirmManualSolve = (questionId: string) => {
    questionService.markAsSolved(questionId, true);
    const newSolvedCount = summary.solvedCount + 1;
    const newPoints = user.points + 20;

    const updatedUser = {
      ...user,
      points: newPoints,
      totalSolved: user.totalSolved + 1
    };
    onUserUpdate(updatedUser);

    achievementService.evaluateAchievements(newSolvedCount, summary.currentStreak);
    showToast('✓ Question marked as solved manually!', 'success');
  };

  return (
    <div className="space-y-8 animate-element">
      {/* Profile Card */}
      <ProfileCard user={user} />

      {/* Connected Coding Platforms (LeetCode / GeeksforGeeks auto-sync) */}
      <ConnectedPlatformsCard userId={user.id} />

      {/* Awards & Badges Hexagonal Milestones Card */}
      <AwardsBadgesCard />

      {/* Activity Heatmap */}
      <Heatmap userId={user.id} currentStreak={summary.currentStreak} />

      {/* Course Progress Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Enrolled Practice Tracks</h3>
            <p className="text-xs text-slate-500">Continue solving problem sets in your courses</p>
          </div>
          <NavLink to="/courses">
            <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
              View All Courses
            </Button>
          </NavLink>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.slice(0, 3).map((c) => (
            <CourseCard
              key={c.id}
              course={c}
              isJoined={user.joinedCourseIds.includes(c.id)}
              solvedCount={c.id === 'c1' ? 4 : c.id === 'c2' ? 4 : 2}
            />
          ))}
        </div>
      </div>

      {/* Analytics & Distribution Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DifficultyDonutChart data={summary.difficultyBreakdown} />
        <PlatformDistributionChart data={summary.platformBreakdown} />
      </div>

      {/* Quick Problem List Table */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Recent Recommended Problems</h3>
            <p className="text-xs text-slate-500">Pick up where you left off or solve new challenges</p>
          </div>
          <NavLink to="/problems">
            <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Problem Browser
            </Button>
          </NavLink>
        </div>

        <QuestionTable
          questions={recentQuestions}
          onSolve={handleExternalSolve}
          onMarkSolvedModal={(q) => setSelectedQuestionForModal(q)}
        />
      </div>

      {/* Leaderboard Quick Preview Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-slate-900 text-base">Top Performers</h3>
          </div>
          <NavLink to="/leaderboard" className="text-xs text-blue-600 font-semibold hover:underline">
            Full Leaderboard
          </NavLink>
        </div>

        {leaderboardTop.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-4">No ranked developers yet — connect a coding platform to appear here.</p>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {leaderboardTop.map((u) => (
            <div
              key={u.id}
              className={`flex items-center justify-between p-3.5 rounded-xl border transition-colors ${
                u.id === user.id ? 'bg-blue-50/80 border-blue-200' : 'bg-slate-50/50 border-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="font-extrabold text-sm w-5 text-slate-400">#{u.rank}</span>
                <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-lg object-cover" />
                <div>
                  <div className="text-xs font-bold text-slate-900">{u.name}</div>
                  <div className="text-[11px] text-slate-400">@{u.username}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-slate-900">{u.solvedCount} Solved</div>
                <div className="text-[10px] text-slate-400">{u.points} pts</div>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>

      {/* Manual Solve Modal */}
      <ManualSolveModal
        isOpen={Boolean(selectedQuestionForModal)}
        question={selectedQuestionForModal}
        onClose={() => setSelectedQuestionForModal(null)}
        onConfirm={handleConfirmManualSolve}
      />
    </div>
  );
};
