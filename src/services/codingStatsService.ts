import { PlatformId } from '../types';

export interface PlatformStats {
  totalSolved: number;
  easySolved?: number;
  mediumSolved?: number;
  hardSolved?: number;
  /** Map of "YYYY-MM-DD" -> submission count, when the platform exposes daily history. */
  submissionCalendar?: Record<string, number>;
}

const STATS_REQUEST_TIMEOUT_MS = 15000;

function withTimeout(ms: number): AbortSignal {
  return AbortSignal.timeout(ms);
}

// Users sometimes type their handle with a leading "@" — every platform API
// here expects the bare username.
function normalizeUsername(username: string): string {
  return username.trim().replace(/^@/, '');
}

async function fetchLeetCodeStats(username: string): Promise<PlatformStats> {
  const resp = await fetch(`https://leetcode-stats-api.vercel.app/${encodeURIComponent(username)}`, {
    signal: withTimeout(STATS_REQUEST_TIMEOUT_MS)
  });
  const data = await resp.json().catch(() => null);

  if (!resp.ok || !data || data.status === 'error') {
    throw new Error(`LeetCode user "${username}" was not found. Double-check the username and try again.`);
  }

  let submissionCalendar: Record<string, number> | undefined;
  if (data.submissionCalendar && typeof data.submissionCalendar === 'object') {
    submissionCalendar = {};
    for (const [unixSeconds, count] of Object.entries(data.submissionCalendar)) {
      const dateStr = new Date(Number(unixSeconds) * 1000).toISOString().split('T')[0];
      submissionCalendar[dateStr] = (submissionCalendar[dateStr] || 0) + Number(count);
    }
  }

  return {
    totalSolved: data.totalSolved ?? 0,
    easySolved: data.easySolved ?? 0,
    mediumSolved: data.mediumSolved ?? 0,
    hardSolved: data.hardSolved ?? 0,
    submissionCalendar
  };
}

async function fetchGfgStats(username: string): Promise<PlatformStats> {
  const resp = await fetch(`https://gfg-stats-api.vercel.app/${encodeURIComponent(username)}`, {
    signal: withTimeout(STATS_REQUEST_TIMEOUT_MS)
  });
  const data = await resp.json().catch(() => null);

  if (!resp.ok || !data || data.error) {
    throw new Error(`GeeksforGeeks user "${username}" was not found. Double-check the username and try again.`);
  }

  return {
    totalSolved: data.totalProblemsSolved ?? data.data?.totalSolved ?? 0
  };
}

/**
 * Codeforces has a real official public API (CORS-enabled, no key needed):
 * https://codeforces.com/apiHelp — we walk a handle's submission history and
 * dedupe accepted ("OK") verdicts by problem to get a genuine solved count.
 */
async function fetchCodeforcesStats(username: string): Promise<PlatformStats> {
  const resp = await fetch(
    `https://codeforces.com/api/user.status?handle=${encodeURIComponent(username)}&from=1&count=10000`,
    { signal: withTimeout(STATS_REQUEST_TIMEOUT_MS) }
  );
  const data = await resp.json().catch(() => null);

  if (!resp.ok || !data || data.status !== 'OK') {
    throw new Error(`Codeforces handle "${username}" was not found. Double-check the handle and try again.`);
  }

  const solvedProblems = new Set<string>();
  const submissionCalendar: Record<string, number> = {};

  for (const submission of data.result as any[]) {
    if (submission.verdict !== 'OK') continue;

    const problem = submission.problem || {};
    const problemKey = problem.contestId != null ? `${problem.contestId}${problem.index}` : problem.name;
    solvedProblems.add(problemKey);

    const dateStr = new Date(submission.creationTimeSeconds * 1000).toISOString().split('T')[0];
    submissionCalendar[dateStr] = (submissionCalendar[dateStr] || 0) + 1;
  }

  return {
    totalSolved: solvedProblems.size,
    submissionCalendar
  };
}

async function fetchHackerRankStats(username: string): Promise<PlatformStats> {
  const resp = await fetch(`https://hackerrank-stats-api.vercel.app/${encodeURIComponent(username)}`, {
    signal: withTimeout(STATS_REQUEST_TIMEOUT_MS)
  });
  const data = await resp.json().catch(() => null);

  if (!resp.ok || !data || data.status === 'error') {
    throw new Error(`HackerRank user "${username}" was not found. Double-check the username and try again.`);
  }

  return {
    totalSolved: data.totalSolved ?? 0,
    submissionCalendar: data.submissionCalendar && typeof data.submissionCalendar === 'object' ? data.submissionCalendar : undefined
  };
}

export const codingStatsService = {
  isAutoSyncSupported(platform: PlatformId): boolean {
    return platform === 'LeetCode' || platform === 'GeeksforGeeks' || platform === 'Codeforces' || platform === 'HackerRank';
  },

  async fetchStats(platform: PlatformId, username: string): Promise<PlatformStats> {
    const handle = normalizeUsername(username);
    switch (platform) {
      case 'LeetCode':
        return fetchLeetCodeStats(handle);
      case 'GeeksforGeeks':
        return fetchGfgStats(handle);
      case 'Codeforces':
        return fetchCodeforcesStats(handle);
      case 'HackerRank':
        return fetchHackerRankStats(handle);
    }
  }
};
