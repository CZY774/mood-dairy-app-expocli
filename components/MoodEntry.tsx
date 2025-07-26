import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, useTheme, IconButton } from 'react-native-paper';
import { MoodEntry as MoodEntryType } from '../lib/types';
import { formatDisplayDate, getMoodColor } from '../lib/utils';
import { ACTIVITIES } from '../constants/Moods';

interface MoodEntryProps {
  entry: MoodEntryType;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}

export const MoodEntry: React.FC<MoodEntryProps> = ({
  entry,
  onEdit,
  onDelete,
  showActions = false
}) => {
  const theme = useTheme();
  const moodColor = getMoodColor(entry.mood);

  const getActivityNames = (activityIds: string[]): string[] => {
    return activityIds
      .map(id => ACTIVITIES.find(activity => activity.id === id))
      .filter(Boolean)
      .map(activity => `${activity!.emoji} ${activity!.name}`);
  };

  const activities = JSON.parse(entry.activities);
  const activityNames = getActivityNames(activities);

  return (
    <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      <Card.Content>
        <View style={styles.header}>
          <View style={styles.dateContainer}>
            <Text variant="bodyMedium" style={[styles.date, { color: theme.colors.onSurface }]}>
              {formatDisplayDate(entry.date)}
            </Text>
          </View>

          {showActions && (
            <View style={styles.actions}>
              {onEdit && (
                <IconButton
                  icon="pencil"
                  size={20}
                  onPress={onEdit}
                  iconColor={theme.colors.primary}
                />
              )}
              {onDelete && (
                <IconButton
                  icon="delete"
                  size={20}
                  onPress={onDelete}
                  iconColor={theme.colors.error}
                />
              )}
            </View>
          )}
        </View>

        <View style={styles.moodContainer}>
          <View style={[styles.moodIndicator, { backgroundColor: moodColor }]}>
            <Text style={styles.moodEmoji}>{entry.moodEmoji}</Text>
          </View>
          <View style={styles.moodInfo}>
            <Text variant="titleMedium" style={[styles.moodText, { color: theme.colors.onSurface }]}>
              Mood: {entry.mood}/5
            </Text>
            <Text variant="bodySmall" style={[styles.moodDescription, { color: theme.colors.onSurfaceVariant }]}>
              {entry.mood === 5 ? 'Sangat Senang' :
                entry.mood === 4 ? 'Senang' :
                  entry.mood === 3 ? 'Biasa' :
                    entry.mood === 2 ? 'Sedih' : 'Sangat Sedih'}
            </Text>
          </View>
        </View>

        {activityNames.length > 0 && (
          <View style={styles.activitiesContainer}>
            <Text variant="bodySmall" style={[styles.activitiesLabel, { color: theme.colors.onSurfaceVariant }]}>
              Aktivitas:
            </Text>
            <Text variant="bodyMedium" style={[styles.activitiesText, { color: theme.colors.onSurface }]}>
              {activityNames.join(', ')}
            </Text>
          </View>
        )}

        {entry.notes && (
          <View style={styles.notesContainer}>
            <Text variant="bodySmall" style={[styles.notesLabel, { color: theme.colors.onSurfaceVariant }]}>
              Catatan:
            </Text>
            <Text variant="bodyMedium" style={[styles.notesText, { color: theme.colors.onSurface }]}>
              &quot;{entry.notes}&quot;
            </Text>
          </View>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateContainer: {
    flex: 1,
  },
  date: {
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
  },
  moodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  moodIndicator: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  moodEmoji: {
    fontSize: 24,
  },
  moodInfo: {
    flex: 1,
  },
  moodText: {
    fontWeight: '600',
  },
  moodDescription: {
    marginTop: 2,
  },
  activitiesContainer: {
    marginBottom: 8,
  },
  activitiesLabel: {
    fontWeight: '600',
    marginBottom: 4,
  },
  activitiesText: {
    lineHeight: 20,
  },
  notesContainer: {
    marginTop: 8,
  },
  notesLabel: {
    fontWeight: '600',
    marginBottom: 4,
  },
  notesText: {
    fontStyle: 'italic',
    lineHeight: 20,
  },
});