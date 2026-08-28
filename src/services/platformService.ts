import { CodingProfile, PlatformId, PlatformConfig } from '../types';
import { MOCK_PLATFORMS } from '../data/mockData';
import { supabase } from '../lib/supabase';
import { codingStatsService } from './codingStatsService';

const ALL_PLATFORMS: PlatformId[] = ['LeetCode', 'GeeksforGeeks', 'HackerRank', 'Codeforces'];

function emptyProfile(platform: PlatformId): CodingProfile {
  return {
    platform,
    username: '',
    connected: false,
    syncStatus: 'idle'
  };
}

function rowToProfile(row: Record<string, any>): CodingProfile {
  return {
    platform: row.platform,
    username: row.handle,
    connected: Boolean(row.connected),
    lastSynced: row.updated_at ? new Date(row.updated_at).toLocaleString() : undefined,
    syncStatus: 'idle',
    solvedCount: row.solved_count ?? 0
  };
}

async function upsertProfileRow(userId: string, platform: PlatformId, username: string, solvedCount: number) {
  const { data: existing } = await supabase
    .from('coding_profiles')
    .select('id')
    .eq('user_id', userId)
    .eq('platform', platform)
    .maybeSingle();

  const payload = {
    user_id: userId,
    platform,
    handle: username.trim().replace(/^@/, ''),
    connected: true,
    solved_count: solvedCount,
    updated_at: new Date().toISOString()
  };

  if (existing) {
    const { error } = await supabase.from('coding_profiles').update(payload).eq('id', existing.id);
    if (error) throw new Error(`Failed to save ${platform} connection: ${error.message}`);
  } else {
    const { error } = await supabase.from('coding_profiles').insert(payload);
    if (error) throw new Error(`Failed to save ${platform} connection: ${error.message}`);
  }
}

/**
 * Recomputes the user's combined real solved count across every connected
 * platform and writes it to profiles.total_solved, so the leaderboard ranks
 * on genuine synced data instead of a stale/fake number.
 */
async function refreshTotalSolved(userId: string): Promise<void> {
  const { data, error } = await supabase.from('coding_profiles').select('solved_count').eq('user_id', userId);
  if (error) {
    console.error('Failed to recompute total solved:', error.message);
    return;
  }
  const total = (data || []).reduce((sum, row) => sum + (row.solved_count || 0), 0);
  const { error: updateError } = await supabase.from('profiles').update({ total_solved: total }).eq('id', userId);
  if (updateError) console.error('Failed to save total_solved to profile:', updateError.message);
}

export const platformService = {
  getPlatforms(): PlatformConfig[] {
    return MOCK_PLATFORMS;
  },

  async getProfiles(userId: string): Promise<CodingProfile[]> {
    const { data, error } = await supabase.from('coding_profiles').select('*').eq('user_id', userId);
    if (error) {
      console.error('Failed to load coding profiles from Supabase:', error.message);
    }

    const byPlatform = new Map<PlatformId, CodingProfile>();
    (data || []).forEach((row) => byPlatform.set(row.platform, rowToProfile(row)));

    return ALL_PLATFORMS.map((platform) => byPlatform.get(platform) || emptyProfile(platform));
  },

  /**
   * Connects a platform handle. Fetches the real public solved-problem count
   * before saving (LeetCode, GeeksforGeeks, Codeforces, HackerRank all have
   * a working free stats source) — an invalid username throws instead of
   * silently "connecting" with no data.
   */
  async connectAccount(userId: string, platform: PlatformId, username: string): Promise<CodingProfile[]> {
    let solvedCount = 0;

    if (codingStatsService.isAutoSyncSupported(platform)) {
      const stats = await codingStatsService.fetchStats(platform, username);
      solvedCount = stats.totalSolved;
    }

    await upsertProfileRow(userId, platform, username, solvedCount);
    await refreshTotalSolved(userId);
    return this.getProfiles(userId);
  },

  /** Re-fetches the real solved count for an already-connected platform. */
  async syncAccount(userId: string, platform: PlatformId, username: string): Promise<CodingProfile[]> {
    if (!codingStatsService.isAutoSyncSupported(platform)) {
      throw new Error(`Automatic sync for ${platform} isn't available yet.`);
    }
    const stats = await codingStatsService.fetchStats(platform, username);
    await upsertProfileRow(userId, platform, username, stats.totalSolved);
    await refreshTotalSolved(userId);
    return this.getProfiles(userId);
  },

  async disconnectAccount(userId: string, platform: PlatformId): Promise<CodingProfile[]> {
    const { error } = await supabase.from('coding_profiles').delete().eq('user_id', userId).eq('platform', platform);
    if (error) console.error('Failed to disconnect platform:', error.message);
    await refreshTotalSolved(userId);
    return this.getProfiles(userId);
  },

  /**
   * Live-fetches and merges the real daily submission history from every
   * connected platform that exposes one (LeetCode, Codeforces, HackerRank),
   * for the activity heatmap. Returns "YYYY-MM-DD" -> submission count.
   */
  async getActivityCalendar(userId: string): Promise<Record<string, number>> {
    const profiles = await this.getProfiles(userId);
    const merged: Record<string, number> = {};

    await Promise.all(
      profiles
        .filter((p) => p.connected && p.username && codingStatsService.isAutoSyncSupported(p.platform))
        .map(async (p) => {
          try {
            const stats = await codingStatsService.fetchStats(p.platform, p.username!);
            if (stats.submissionCalendar) {
              for (const [date, count] of Object.entries(stats.submissionCalendar)) {
                merged[date] = (merged[date] || 0) + count;
              }
            }
          } catch (err) {
            console.warn(`Failed to fetch ${p.platform} activity calendar:`, err);
          }
        })
    );

    return merged;
  },

  detectPlatformFromUrl(url: string): PlatformId | null {
    if (!url) return null;
    const lower = url.toLowerCase();
    if (lower.includes('leetcode.com')) return 'LeetCode';
    if (lower.includes('geeksforgeeks.org')) return 'GeeksforGeeks';
    if (lower.includes('hackerrank.com')) return 'HackerRank';
    if (lower.includes('codeforces.com')) return 'Codeforces';
    return null;
  }
};
