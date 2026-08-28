import { Achievement } from '../types';
import { MOCK_ACHIEVEMENTS } from '../data/mockData';

const ACHIEVEMENTS_STORAGE_KEY = 'codesnap_mock_achievements';

export const achievementService = {
  getAchievements(): Achievement[] {
    const stored = localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse achievements', e);
      }
    }
    localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(MOCK_ACHIEVEMENTS));
    return MOCK_ACHIEVEMENTS;
  },

  evaluateAchievements(solvedCount: number, streak: number): Achievement[] {
    const achievements = this.getAchievements();
    let updated = false;

    achievements.forEach((ach) => {
      if (ach.category === 'solves') {
        ach.progress = Math.min(solvedCount, ach.target);
        if (solvedCount >= ach.target && !ach.unlocked) {
          ach.unlocked = true;
          ach.unlockedAt = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
          updated = true;
        }
      } else if (ach.category === 'streak') {
        ach.progress = Math.min(streak, ach.target);
        if (streak >= ach.target && !ach.unlocked) {
          ach.unlocked = true;
          ach.unlockedAt = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
          updated = true;
        }
      }
    });

    if (updated) {
      localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(achievements));
    }
    return achievements;
  }
};
