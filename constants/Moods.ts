import { Activity } from "../lib/types";

export const MOODS = [
  { value: 1, emoji: "😢", label: "Sangat Sedih", color: "#FF6B6B" },
  { value: 2, emoji: "😔", label: "Sedih", color: "#FFA07A" },
  { value: 3, emoji: "😐", label: "Biasa", color: "#FFD93D" },
  { value: 4, emoji: "😊", label: "Senang", color: "#6BCF7F" },
  { value: 5, emoji: "😄", label: "Sangat Senang", color: "#4ECDC4" },
];

export const ACTIVITIES: Activity[] = [
  { id: "work1", name: "Bekerja", emoji: "💼", category: "work" },
  { id: "work2", name: "Meeting", emoji: "🤝", category: "work" },
  { id: "work3", name: "Belajar", emoji: "📚", category: "work" },

  { id: "health1", name: "Olahraga", emoji: "🏃‍♂️", category: "health" },
  { id: "health2", name: "Meditasi", emoji: "🧘‍♀️", category: "health" },
  { id: "health3", name: "Tidur Cukup", emoji: "😴", category: "health" },
  { id: "health4", name: "Makan Sehat", emoji: "🥗", category: "health" },

  { id: "social1", name: "Berkumpul Teman", emoji: "👥", category: "social" },
  { id: "social2", name: "Video Call", emoji: "📱", category: "social" },
  { id: "social3", name: "Keluarga", emoji: "👨‍👩‍👧‍👦", category: "social" },

  { id: "hobby1", name: "Menonton Film", emoji: "🎬", category: "hobby" },
  { id: "hobby2", name: "Membaca", emoji: "📖", category: "hobby" },
  { id: "hobby3", name: "Musik", emoji: "🎵", category: "hobby" },
  { id: "hobby4", name: "Gaming", emoji: "🎮", category: "hobby" },
  { id: "hobby5", name: "Memasak", emoji: "👨‍🍳", category: "hobby" },

  { id: "other1", name: "Belanja", emoji: "🛒", category: "other" },
  { id: "other2", name: "Jalan-jalan", emoji: "🚶‍♂️", category: "other" },
  { id: "other3", name: "Istirahat", emoji: "😌", category: "other" },
];
