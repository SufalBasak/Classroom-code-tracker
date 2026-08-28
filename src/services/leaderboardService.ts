import { LeaderboardUser, Role } from '../types';
import { supabase } from '../lib/supabase';

export type Timeframe = 'weekly' | 'monthly' | 'allTime';

export const leaderboardService = {
  /**
   * Ranks real registered users by their combined synced solved count
   * (profiles.total_solved, kept up to date by platformService whenever a
   * coding platform is connected/synced). There's no historical snapshot
   * data yet, so weekly/monthly currently show the same real all-time
   * ranking rather than a fabricated period-scoped number.
   */
  async getLeaderboard(_timeframe: Timeframe = 'allTime', limit = 50): Promise<LeaderboardUser[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, username, avatar, points, total_solved, role')
      .order('total_solved', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Failed to load leaderboard from Supabase:', error.message);
      return [];
    }

    return (data || []).map((row, idx) => ({
      rank: idx + 1,
      id: row.id,
      name: row.name,
      username: row.username,
      avatar: row.avatar,
      solvedCount: row.total_solved ?? 0,
      points: row.points ?? 0,
      streak: 0,
      role: (row.role as Role) || 'USER'
    }));
  }
};
