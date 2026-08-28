import { User, Course, Question, Activity, CodingProfile, Achievement, LeaderboardUser, PlatformConfig } from '../types';

export const INITIAL_USER: User = {
  id: 'u1',
  name: 'Developer',
  username: 'dev',
  email: 'dev@example.com',
  role: 'USER',
  joinedDate: 'Jan 2026',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  bio: 'Software developer practicing coding challenges.',
  points: 0,
  streak: 0,
  totalSolved: 0,
  joinedCourseIds: []
};

export const INITIAL_ADMIN_USER: User = {
  id: 'a1000000-0000-0000-0000-000000000001',
  name: 'Classroom Plus Admin',
  username: 'classroomplus_admin',
  email: 'classroomplus07@gmail.com',
  role: 'ADMIN',
  joinedDate: 'Dec 2023',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  bio: 'Platform administrator and curriculum designer.',
  points: 0,
  streak: 0,
  totalSolved: 0,
  joinedCourseIds: []
};

export const MOCK_COURSES: Course[] = [];

export const MOCK_QUESTIONS: Question[] = [];

export const MOCK_ACTIVITIES: Activity[] = [];

export const MOCK_CODING_PROFILES: CodingProfile[] = [
  {
    platform: 'LeetCode',
    username: '',
    connected: false,
    syncStatus: 'idle'
  },
  {
    platform: 'GeeksforGeeks',
    username: '',
    connected: false,
    syncStatus: 'idle'
  },
  {
    platform: 'HackerRank',
    username: '',
    connected: false,
    syncStatus: 'idle'
  },
  {
    platform: 'Codeforces',
    username: '',
    connected: false,
    syncStatus: 'idle'
  }
];

export const MOCK_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach1',
    title: 'First Problem Solved',
    description: 'Solve your first coding question on any platform',
    iconName: 'Award',
    category: 'solves',
    unlocked: false,
    progress: 0,
    target: 1
  },
  {
    id: 'ach2',
    title: '3-Day Streak',
    description: 'Maintain a coding practice streak for 3 consecutive days',
    iconName: 'Flame',
    category: 'streak',
    unlocked: false,
    progress: 0,
    target: 3
  },
  {
    id: 'ach3',
    title: '7-Day Streak',
    description: 'Maintain a coding practice streak for 7 consecutive days',
    iconName: 'Zap',
    category: 'streak',
    unlocked: false,
    progress: 0,
    target: 7
  },
  {
    id: 'ach4',
    title: 'SQL Veteran',
    description: 'Complete 25 SQL practice questions',
    iconName: 'Database',
    category: 'mastery',
    unlocked: false,
    progress: 0,
    target: 25
  },
  {
    id: 'ach5',
    title: 'Centurion',
    description: 'Solve 100 coding problems across all platforms',
    iconName: 'Trophy',
    category: 'solves',
    unlocked: false,
    progress: 0,
    target: 100
  }
];

export const MOCK_LEADERBOARD: LeaderboardUser[] = [];

export const MOCK_PLATFORMS: PlatformConfig[] = [
  {
    id: 'LeetCode',
    name: 'LeetCode',
    baseUrl: 'https://leetcode.com/problems/',
    color: '#F59E0B',
    active: true,
    totalQuestionsOnPlatform: 3000
  },
  {
    id: 'GeeksforGeeks',
    name: 'GeeksforGeeks',
    baseUrl: 'https://practice.geeksforgeeks.org/problems/',
    color: '#10B981',
    active: true,
    totalQuestionsOnPlatform: 2500
  },
  {
    id: 'HackerRank',
    name: 'HackerRank',
    baseUrl: 'https://www.hackerrank.com/challenges/',
    color: '#06B6D4',
    active: true,
    totalQuestionsOnPlatform: 1500
  },
  {
    id: 'Codeforces',
    name: 'Codeforces',
    baseUrl: 'https://codeforces.com/problemset/problem/',
    color: '#8B5CF6',
    active: true,
    totalQuestionsOnPlatform: 4000
  }
];

export const PLATFORM_CONFIGS: Record<string, PlatformConfig> = {
  LeetCode: MOCK_PLATFORMS[0],
  GeeksforGeeks: MOCK_PLATFORMS[1],
  HackerRank: MOCK_PLATFORMS[2],
  Codeforces: MOCK_PLATFORMS[3]
};
