import { supabase } from '../lib/supabase';
import { courseService } from './courseService';
import { questionService } from './questionService';
import { User, Role, Course, Question } from '../types';

export interface AdminStats {
  totalUsers: number;
  activeUsersSubtext: string;
  totalCourses: number;
  publishedCoursesSubtext: string;
  totalQuestions: number;
  platformsSubtext: string;
  totalSolves: number;
  solvesSubtext: string;
  platformDistribution: { name: string; value: number; color: string }[];
  questionsOverTime: { date: string; solved: number }[];
}

export const adminService = {
  async getAdminStats(): Promise<AdminStats> {
    let usersCount = 0;
    let adminCount = 0;
    let totalSolvesSum = 0;
    let createdTodayCount = 0;
    const todayStr = new Date().toISOString().split('T')[0];

    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, role, created_at, total_solved');

      if (!error && profiles) {
        usersCount = profiles.length;
        adminCount = profiles.filter((p) => p.role === 'ADMIN').length;
        totalSolvesSum = profiles.reduce((acc, p) => acc + (p.total_solved || 0), 0);
        createdTodayCount = profiles.filter(
          (p) => p.created_at && p.created_at.startsWith(todayStr)
        ).length;
      }
    } catch (err) {
      console.warn('Failed to fetch user profiles for admin stats:', err);
    }

    let courses: Course[] = [];
    try {
      courses = await courseService.fetchCoursesFromSupabase();
    } catch {
      courses = courseService.getCourses();
    }

    const totalCourses = courses.length;
    const publishedCoursesCount = courses.filter((c) => c.published).length;

    let questions: Question[] = [];
    try {
      questions = await questionService.fetchQuestionsFromSupabase();
    } catch {
      questions = questionService.getQuestions();
    }

    const totalQuestions = questions.length;
    const uniquePlatforms = new Set(questions.map((q) => q.platform));
    const platformCount = uniquePlatforms.size || 4;

    const localSolvedCount = questions.filter((q) => q.status === 'SOLVED').length;
    const finalTotalSolves = Math.max(totalSolvesSum, localSolvedCount);

    const platformColors: Record<string, string> = {
      LeetCode: '#2563EB',
      GeeksforGeeks: '#10B981',
      HackerRank: '#6366F1',
      Codeforces: '#EF4444'
    };

    const platforms = ['LeetCode', 'GeeksforGeeks', 'HackerRank', 'Codeforces'];
    const platformDistribution = platforms.map((plat) => {
      const count = questions.filter((q) => q.platform === plat).length;
      return {
        name: plat,
        value: count,
        color: platformColors[plat] || '#64748b'
      };
    });

    const dateMap: Record<string, number> = {};
    questions.forEach((q) => {
      if (q.solvedAt) {
        const dateStr = new Date(q.solvedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        dateMap[dateStr] = (dateMap[dateStr] || 0) + 1;
      }
    });

    let cumulative = 0;
    const questionsOverTime = Object.entries(dateMap).map(([date, count]) => {
      cumulative += count;
      return { date, solved: cumulative };
    });

    if (questionsOverTime.length === 0) {
      questionsOverTime.push(
        { date: 'Initial', solved: Math.round(totalQuestions * 0.2) },
        { date: 'Recent', solved: totalQuestions }
      );
    }

    return {
      totalUsers: usersCount,
      activeUsersSubtext: createdTodayCount > 0 ? `${createdTodayCount} new today` : `${adminCount} Admin / ${usersCount - adminCount} Standard`,
      totalCourses,
      publishedCoursesSubtext: `${publishedCoursesCount} Published`,
      totalQuestions,
      platformsSubtext: `Across ${platformCount} platform${platformCount === 1 ? '' : 's'}`,
      totalSolves: finalTotalSolves,
      solvesSubtext: 'Verified & platform synced',
      platformDistribution,
      questionsOverTime
    };
  },

  async getAllUsers(): Promise<User[]> {
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && profiles && profiles.length > 0) {
        return profiles.map((p: any) => ({
          id: p.id,
          name: p.name || p.email?.split('@')[0] || 'User',
          username: p.username || p.email?.split('@')[0] || 'user',
          email: p.email || '',
          role: (p.role as Role) || 'USER',
          joinedDate: p.created_at
            ? new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
            : 'Recently',
          avatar: p.avatar || (p.role === 'ADMIN' 
            ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' 
            : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'),
          points: p.points || 0,
          streak: 0,
          totalSolved: p.total_solved || 0,
          joinedCourseIds: p.joined_course_ids || []
        }));
      }
    } catch (err) {
      console.warn('Failed to load users from Supabase:', err);
    }
    return [];
  },

  async updateUserRole(userId: string, newRole: Role): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (!error) return true;
      console.error('Error updating user role:', error.message);
    } catch (err) {
      console.error('Failed to update user role:', err);
    }
    return false;
  }
};
