export type QuestionStatus = "NOT_STARTED" | "IN_PROGRESS" | "SOLVED";

export type VerificationType = "VERIFIED" | "MANUAL" | "NOT_VERIFIED";

export type PlatformId = "LeetCode" | "GeeksforGeeks" | "HackerRank" | "Codeforces";

export type Difficulty = "Easy" | "Medium" | "Hard";

export type Role = "USER" | "ADMIN";

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: Role;
  joinedDate: string;
  avatar: string;
  bio?: string;
  points: number;
  streak: number;
  totalSolved: number;
  joinedCourseIds: string[];
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  difficulty: Difficulty;
  questionIds: string[];
  enrolledUsersCount: number;
  published: boolean;
  thumbnail?: string;
}

export interface Question {
  id: string;
  title: string;
  platform: PlatformId;
  externalUrl: string;
  difficulty: Difficulty;
  topic: string;
  tags: string[];
  courseId?: string;
  status: QuestionStatus;
  verification: VerificationType;
  solvedAt?: string;
  description?: string;
  displayOrder?: number;
}

export interface Activity {
  id: string;
  userId: string;
  questionId?: string;
  questionTitle: string;
  platform: PlatformId;
  action: string;
  timestamp: string;
  difficulty: Difficulty;
}

export interface CodingProfile {
  platform: PlatformId;
  username?: string;
  connected: boolean;
  lastSynced?: string;
  problemsChecked?: number;
  problemsUpdated?: number;
  syncStatus: "idle" | "syncing" | "success" | "error";
  errorMessage?: string;
  solvedCount?: number;
  easySolved?: number;
  mediumSolved?: number;
  hardSolved?: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: string;
  category: "solves" | "streak" | "course" | "mastery";
  unlocked: boolean;
  progress: number;
  target: number;
  unlockedAt?: string;
}

export interface LeaderboardUser {
  rank: number;
  id: string;
  name: string;
  username: string;
  avatar: string;
  solvedCount: number;
  points: number;
  streak: number;
  role: Role;
}

export interface PlatformConfig {
  id: PlatformId;
  name: string;
  baseUrl: string;
  logoUrl?: string;
  color: string;
  active: boolean;
  totalQuestionsOnPlatform: number;
}
