import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Text, Chip, useTheme } from 'react-native-paper';
import { ACTIVITIES } from '../constants/Moods';
import { Activity } from '../lib/types';

interface ActivityPickerProps {
  selectedActivities: string[];
  onActivityToggle: (activityId: string) => void;
}

export const ActivityPicker: React.FC<ActivityPickerProps> = ({ 
  selectedActivities, 
  onActivityToggle 
}) => {
  const theme = useTheme();

  const groupedActivities = ACTIVITIES.reduce((acc, activity) => {
    if (!acc[activity.category]) {
      acc[activity.category] = [];
    }
    acc[activity.category].push(activity);
    return acc;
  }, {} as Record<string, Activity[]>);

  const categoryNames = {
    work: '💼 Pekerjaan',
    health: '🏃‍♂️ Kesehatan',
    social: '👥 Sosial',
    hobby: '🎨 Hobi',
    other: '🌟 Lainnya'
  };

  return (
    <View style={styles.container}>
      <Text variant="titleMedium" style={[styles.title, { color: theme.colors.onSurface }]}>
        Apa yang kamu lakukan hari ini?
      </Text>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {Object.entries(groupedActivities).map(([category, activities]) => (
          <View key={category} style={styles.categoryContainer}>
            <Text 
              variant="titleSmall" 
              style={[styles.categoryTitle, { color: theme.colors.primary }]}
            >
              {categoryNames[category as keyof typeof categoryNames]}
            </Text>
            
            <View style={styles.activitiesContainer}>
              {activities.map((activity) => {
                const isSelected = selectedActivities.includes(activity.id);
                
                return (
                  <Chip
                    key={activity.id}
                    selected={isSelected}
                    onPress={() => onActivityToggle(activity.id)}
                    style={[
                      styles.activityChip,
                      {
                        backgroundColor: isSelected 
                          ? theme.colors.primaryContainer 
                          : theme.colors.surface
                      }
                    ]}
                    textStyle={styles.chipText}
                    icon={() => (
                      <Text style={styles.activityEmoji}>{activity.emoji}</Text>
                    )}
                  >
                    {activity.name}
                  </Chip>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    flex: 1,
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
  },
  scrollView: {
    maxHeight: 300,
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryTitle: {
    marginBottom: 10,
    fontWeight: '600',
  },
  activitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  activityChip: {
    marginBottom: 8,
  },
  chipText: {
    fontSize: 12,
  },
  activityEmoji: {
    fontSize: 14,
  },
});