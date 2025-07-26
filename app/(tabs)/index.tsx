import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Alert } from 'react-native';
import { Appbar, Text, TextInput, Button, useTheme, FAB } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MoodPicker } from '../../components/MoodPicker';
import { ActivityPicker } from '../../components/ActivityPicker';
import { MoodEntry } from '../../components/MoodEntry';
import { databaseService } from '../../lib/database';
import { formatDate } from '../../lib/utils';
import { MoodEntry as MoodEntryType } from '../../lib/types';
import { ACTIVITIES } from '../../constants/Moods';

export default function HomeScreen() {
  const theme = useTheme();
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [selectedMoodEmoji, setSelectedMoodEmoji] = useState<string>('');
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [todayEntry, setTodayEntry] = useState<MoodEntryType | null>(null);
  const [recentEntries, setRecentEntries] = useState<MoodEntryType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const today = formatDate(new Date());

  useEffect(() => {
    loadTodayEntry();
    loadRecentEntries();
  }, []);

  const loadTodayEntry = async () => {
    try {
      const entry = await databaseService.getMoodEntry(today);
      if (entry) {
        setTodayEntry(entry);
        setSelectedMood(entry.mood);
        setSelectedMoodEmoji(entry.moodEmoji);
        setSelectedActivities(JSON.parse(entry.activities));
        setNotes(entry.notes || '');
      }
    } catch (error) {
      console.error('Error loading today entry:', error);
    }
  };

  const loadRecentEntries = async () => {
    try {
      const entries = await databaseService.getMoodEntries(7);
      // Filter out today's entry from recent entries
      const filteredEntries = entries.filter(entry => entry.date !== today);
      setRecentEntries(filteredEntries);
    } catch (error) {
      console.error('Error loading recent entries:', error);
    }
  };

  const handleMoodSelect = (mood: number, emoji: string) => {
    setSelectedMood(mood);
    setSelectedMoodEmoji(emoji);
  };

  const handleActivityToggle = (activityId: string) => {
    setSelectedActivities(prev => 
      prev.includes(activityId)
        ? prev.filter(id => id !== activityId)
        : [...prev, activityId]
    );
  };

  const handleSave = async () => {
    if (!selectedMood) {
      Alert.alert('Mood Belum Dipilih', 'Silakan pilih mood terlebih dahulu.');
      return;
    }

    setIsLoading(true);
    try {
      const entry = {
        date: today,
        mood: selectedMood,
        moodEmoji: selectedMoodEmoji,
        activities: JSON.stringify(selectedActivities),
        notes: notes.trim(),
        createdAt: new Date().toISOString()
      };

      await databaseService.addMoodEntry(entry);
      
      Alert.alert(
        'Berhasil Disimpan!', 
        todayEntry ? 'Catatan mood hari ini telah diperbarui.' : 'Catatan mood hari ini telah disimpan.',
        [{ text: 'OK', onPress: () => {
          loadTodayEntry();
          loadRecentEntries();
        }}]
      );
    } catch (error) {
      console.error('Error saving mood entry:', error);
      Alert.alert('Error', 'Gagal menyimpan catatan mood. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    Alert.alert(
      'Hapus Catatan',
      'Apakah Anda yakin ingin menghapus catatan mood hari ini?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              await databaseService.deleteMoodEntry(today);
              setSelectedMood(null);
              setSelectedMoodEmoji('');
              setSelectedActivities([]);
              setNotes('');
              setTodayEntry(null);
              loadRecentEntries();
            } catch (error) {
              console.error('Error deleting entry:', error);
              Alert.alert('Error', 'Gagal menghapus catatan mood.');
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header>
        <Appbar.Content title="📖 Mood Diary" titleStyle={styles.headerTitle} />
      </Appbar.Header>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text variant="headlineSmall" style={[styles.welcomeText, { color: theme.colors.onBackground }]}>
            Halo! Bagaimana harimu?
          </Text>
          
          <MoodPicker 
            selectedMood={selectedMood}
            onMoodSelect={handleMoodSelect}
          />

          <ActivityPicker
            selectedActivities={selectedActivities}
            onActivityToggle={handleActivityToggle}
          />

          <View style={styles.notesContainer}>
            <Text variant="titleMedium" style={[styles.notesTitle, { color: theme.colors.onBackground }]}>
              Catatan (Opsional)
            </Text>
            <TextInput
              mode="outlined"
              placeholder="Tulis catatan tentang harimu..."
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
              style={styles.notesInput}
            />
          </View>

          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={handleSave}
              loading={isLoading}
              disabled={!selectedMood || isLoading}
              style={styles.saveButton}
              icon="content-save"
            >
              {todayEntry ? 'Perbarui Catatan' : 'Simpan Catatan'}
            </Button>

            {todayEntry && (
              <Button
                mode="outlined"
                onPress={handleClear}
                style={styles.clearButton}
                icon="delete"
                textColor={theme.colors.error}
              >
                Hapus Catatan Hari Ini
              </Button>
            )}
          </View>

          {recentEntries.length > 0 && (
            <View style={styles.recentSection}>
              <Text variant="titleMedium" style={[styles.recentTitle, { color: theme.colors.onBackground }]}>
                Catatan Terbaru
              </Text>
              {recentEntries.map((entry) => (
                <MoodEntry key={entry.id} entry={entry} />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerTitle: {
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  welcomeText: {
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 8,
  },
  notesContainer: {
    marginVertical: 20,
  },
  notesTitle: {
    marginBottom: 8,
    fontWeight: '600',
  },
  notesInput: {
    backgroundColor: 'transparent',
  },
  buttonContainer: {
    gap: 12,
    marginVertical: 20,
  },
  saveButton: {
    paddingVertical: 4,
  },
  clearButton: {
    paddingVertical: 4,
  },
  recentSection: {
    marginTop: 32,
  },
  recentTitle: {
    marginBottom: 16,
    fontWeight: '600',
  },
});