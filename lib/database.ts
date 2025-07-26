import * as SQLite from 'expo-sqlite';
import { MoodEntry, MoodStats } from './types';

class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;

  async init() {
    if (this.db) return this.db;
    
    this.db = await SQLite.openDatabaseAsync('moodDiary.db');
    
    await this.db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS mood_entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL UNIQUE,
        mood INTEGER NOT NULL,
        moodEmoji TEXT NOT NULL,
        activities TEXT NOT NULL,
        notes TEXT,
        createdAt TEXT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_mood_entries_date ON mood_entries(date);
    `);
    
    return this.db;
  }

  async addMoodEntry(entry: Omit<MoodEntry, 'id'>): Promise<number> {
    const db = await this.init();
    
    const result = await db.runAsync(
      `INSERT OR REPLACE INTO mood_entries 
       (date, mood, moodEmoji, activities, notes, createdAt) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      entry.date,
      entry.mood,
      entry.moodEmoji,
      entry.activities,
      entry.notes || '',
      entry.createdAt
    );
    
    return result.lastInsertRowId!;
  }

  async getMoodEntry(date: string): Promise<MoodEntry | null> {
    const db = await this.init();
    
    const result = await db.getFirstAsync(
      'SELECT * FROM mood_entries WHERE date = ?',
      date
    ) as MoodEntry | null;
    
    return result;
  }

  async getMoodEntries(limit: number = 30): Promise<MoodEntry[]> {
    const db = await this.init();
    
    const results = await db.getAllAsync(
      'SELECT * FROM mood_entries ORDER BY date DESC LIMIT ?',
      limit
    ) as MoodEntry[];
    
    return results;
  }

  async getMoodEntriesInRange(startDate: string, endDate: string): Promise<MoodEntry[]> {
    const db = await this.init();
    
    const results = await db.getAllAsync(
      'SELECT * FROM mood_entries WHERE date >= ? AND date <= ? ORDER BY date ASC',
      startDate,
      endDate
    ) as MoodEntry[];
    
    return results;
  }

  async getMoodStats(days: number = 30): Promise<MoodStats> {
    const db = await this.init();
    
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
      .toISOString().split('T')[0];
    
    const entries = await this.getMoodEntriesInRange(startDate, endDate);
    
    if (entries.length === 0) {
      return {
        averageMood: 0,
        totalEntries: 0,
        mostCommonMood: 0,
        moodDistribution: [],
        weeklyData: []
      };
    }

    const totalMood = entries.reduce((sum, entry) => sum + entry.mood, 0);
    const averageMood = totalMood / entries.length;

    // Mood distribution
    const moodCounts: { [key: number]: number } = {};
    entries.forEach(entry => {
      moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
    });

    const moodDistribution = Object.entries(moodCounts)
      .map(([mood, count]) => ({ mood: parseInt(mood), count }))
      .sort((a, b) => a.mood - b.mood);

    const mostCommonMood = Object.entries(moodCounts)
      .reduce((a, b) => moodCounts[parseInt(a[0])] > moodCounts[parseInt(b[0])] ? a : b)[0];

    // Weekly data for chart
    const weeklyData = entries.map(entry => ({
      date: entry.date,
      mood: entry.mood
    }));

    return {
      averageMood: Math.round(averageMood * 100) / 100,
      totalEntries: entries.length,
      mostCommonMood: parseInt(mostCommonMood),
      moodDistribution,
      weeklyData
    };
  }

  async deleteMoodEntry(date: string): Promise<void> {
    const db = await this.init();
    await db.runAsync('DELETE FROM mood_entries WHERE date = ?', date);
  }

  async getAllMoodEntries(): Promise<MoodEntry[]> {
    const db = await this.init();
    const results = await db.getAllAsync(
      'SELECT * FROM mood_entries ORDER BY date DESC'
    ) as MoodEntry[];
    return results;
  }
}

export const databaseService = new DatabaseService();