export interface MoodEntry {
  id: number;
  date: string;
  mood: number; // 1-5 scale
  moodEmoji: string;
  activities: string; // JSON string of activities array
  notes?: string;
  createdAt: string;
}

export interface Activity {
  id: string;
  name: string;
  emoji: string;
  category: 'work' | 'health' | 'social' | 'hobby' | 'other';
}

export interface MoodStats {
  averageMood: number;
  totalEntries: number;
  mostCommonMood: number;
  moodDistribution: { mood: number; count: number }[];
  weeklyData: { date: string; mood: number }[];
}

export interface WeeklyMoodData {
  x: string;
  y: number;
}