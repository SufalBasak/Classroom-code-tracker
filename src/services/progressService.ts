import { Question, Activity } from '../types';
import { questionService } from './questionService';

export interface ProgressSummary {
  totalQuestions: number;
  solvedCount: number;
  remainingCount: number;
  completionPercentage: number;
  currentStreak: number;
  difficultyBreakdown: { name: string; value: number; color: string }[];
  platformBreakdown: { name: string; value: number; color: string }[];
  topicBreakdown: { topic: string; solved: number; total: number }[];
}

export interface HeatmapDay {
  date: string;
  count: number;
  level: number;
}

export const progressService = {
  calculateCurrentStreak(activityDates: string[]): number {
    if (!activityDates || activityDates.length === 0) return 0;
    const uniqueDays = Array.from(new Set(activityDates.map((d) => d.split('T')[0]))).sort().reverse();
    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    let currentCheck = new Date(today);

    for (let i = 0; i < 30; i++) {
      const dateStr = currentCheck.toISOString().split('T')[0];
      if (uniqueDays.includes(dateStr)) {
        streak++;
      } else if (i === 0) {
        currentCheck.setDate(currentCheck.getDate() - 1);
        continue;
      } else {
        break;
      }
      currentCheck.setDate(currentCheck.getDate() - 1);
    }
    return streak;
  },

  getProgressSummary(): ProgressSummary {
    const questions = questionService.getQuestions();
    const totalQuestions = questions.length;
    const solvedQuestions = questions.filter((q) => q.status === 'SOLVED');
    const solvedCount = solvedQuestions.length;
    const remainingCount = Math.max(0, totalQuestions - solvedCount);
    const completionPercentage = totalQuestions > 0 ? Math.round((solvedCount / totalQuestions) * 100) : 0;

    const easySolved = questions.filter((q) => q.status === 'SOLVED' && q.difficulty === 'Easy').length;
    const mediumSolved = questions.filter((q) => q.status === 'SOLVED' && q.difficulty === 'Medium').length;
    const hardSolved = questions.filter((q) => q.status === 'SOLVED' && q.difficulty === 'Hard').length;

    const difficultyBreakdown = [
      { name: 'Easy', value: easySolved, color: '#10B981' },
      { name: 'Medium', value: mediumSolved, color: '#F59E0B' },
      { name: 'Hard', value: hardSolved, color: '#EF4444' }
    ];

    const leetcodeSolved = questions.filter((q) => q.status === 'SOLVED' && q.platform === 'LeetCode').length;
    const gfgSolved = questions.filter((q) => q.status === 'SOLVED' && q.platform === 'GeeksforGeeks').length;
    const hrSolved = questions.filter((q) => q.status === 'SOLVED' && q.platform === 'HackerRank').length;
    const cfSolved = questions.filter((q) => q.status === 'SOLVED' && q.platform === 'Codeforces').length;

    const platformBreakdown = [
      { name: 'LeetCode', value: leetcodeSolved, color: '#2563EB' },
      { name: 'GeeksforGeeks', value: gfgSolved, color: '#10B981' },
      { name: 'HackerRank', value: hrSolved, color: '#6366F1' },
      { name: 'Codeforces', value: cfSolved, color: '#EF4444' }
    ];

    const topicsMap: { [key: string]: { solved: number; total: number } } = {};

    questions.forEach((q) => {
      const top = q.topic || 'General';
      if (!topicsMap[top]) {
        topicsMap[top] = { solved: 0, total: 0 };
      }
      topicsMap[top].total += 1;
      if (q.status === 'SOLVED') {
        topicsMap[top].solved += 1;
      }
    });

    const topicBreakdown = Object.keys(topicsMap).slice(0, 5).map((topic) => ({
      topic,
      solved: topicsMap[topic].solved,
      total: topicsMap[topic].total
    }));

    const solvedDates = solvedQuestions.map((q) => q.solvedAt || new Date().toISOString());

    return {
      totalQuestions,
      solvedCount,
      remainingCount,
      completionPercentage,
      currentStreak: this.calculateCurrentStreak(solvedDates),
      difficultyBreakdown,
      platformBreakdown,
      topicBreakdown
    };
  },

  getHeatmapData(
    weeksCount = 52,
    externalCalendar?: Record<string, number>
  ): { days: HeatmapDay[]; totalSubmissions: number; monthsHeader: { month: string; colIndex: number }[] } {
    const totalDays = weeksCount * 7;
    const days: HeatmapDay[] = [];
    const today = new Date();
    let totalSubmissions = 0;

    const questions = questionService.getQuestions();
    const solvedQuestions = questions.filter((q) => q.status === 'SOLVED');

    const activityCounts: { [dateStr: string]: number } = {};
    solvedQuestions.forEach((q) => {
      if (q.solvedAt) {
        const dateStr = q.solvedAt.split('T')[0];
        activityCounts[dateStr] = (activityCounts[dateStr] || 0) + 1;
      }
    });

    if (externalCalendar) {
      for (const [dateStr, count] of Object.entries(externalCalendar)) {
        activityCounts[dateStr] = (activityCounts[dateStr] || 0) + count;
      }
    }

    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - totalDays);
    const dayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - dayOfWeek);

    const monthsHeader: { month: string; colIndex: number }[] = [];
    let lastMonth = -1;

    for (let i = 0; i < weeksCount * 7; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];

      const colIndex = Math.floor(i / 7);
      const currentMonth = d.getMonth();

      if (currentMonth !== lastMonth && i % 7 === 0) {
        const monthName = d.toLocaleString('en-US', { month: 'short' });
        monthsHeader.push({ month: monthName, colIndex });
        lastMonth = currentMonth;
      }

      const count = activityCounts[dateStr] || 0;
      totalSubmissions += count;

      let level = 0;
      if (count === 1 || count === 2) level = 1;
      else if (count === 3 || count === 4) level = 2;
      else if (count === 5 || count === 6) level = 3;
      else if (count >= 7) level = 4;

      days.push({ date: dateStr, count, level });
    }

    return { days, totalSubmissions, monthsHeader };
  },

  getRecentActivities(): Activity[] {
    const questions = questionService.getQuestions();
    return questions
      .filter((q) => q.status === 'SOLVED')
      .map((q, idx) => ({
        id: `act_${idx}`,
        userId: 'u1',
        questionId: q.id,
        questionTitle: q.title,
        platform: q.platform,
        action: 'SOLVED',
        timestamp: q.solvedAt ? new Date(q.solvedAt).toLocaleDateString() : 'Recently',
        difficulty: q.difficulty
      }));
  }
};
