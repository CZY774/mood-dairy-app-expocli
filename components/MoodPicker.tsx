import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Animated, { useAnimatedStyle, withSpring, useSharedValue, withTiming } from 'react-native-reanimated';
import { MOODS } from '../constants/Moods';

interface MoodPickerProps {
  selectedMood: number | null;
  onMoodSelect: (mood: number, emoji: string) => void;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const MoodPicker: React.FC<MoodPickerProps> = ({ selectedMood, onMoodSelect }) => {
  const theme = useTheme();
  const scaleValues = MOODS.map(() => useSharedValue(1));

  const handleMoodPress = (mood: any, index: number) => {
    scaleValues[index].value = withSpring(0.9, {}, () => {
      scaleValues[index].value = withSpring(1);
    });
    onMoodSelect(mood.value, mood.emoji);
  };

  return (
    <View style={styles.container}>
      <Text variant="titleMedium" style={[styles.title, { color: theme.colors.onSurface }]}>
        Bagaimana perasaanmu hari ini?
      </Text>
      
      <View style={styles.moodContainer}>
        {MOODS.map((mood, index) => {
          const animatedStyle = useAnimatedStyle(() => ({
            transform: [{ scale: scaleValues[index].value }],
          }));

          const isSelected = selectedMood === mood.value;
          
          return (
            <AnimatedTouchable
              key={mood.value}
              style={[
                animatedStyle,
                styles.moodButton,
                {
                  backgroundColor: isSelected ? mood.color : theme.colors.surface,
                  borderColor: isSelected ? mood.color : theme.colors.outline,
                }
              ]}
              onPress={() => handleMoodPress(mood, index)}
              activeOpacity={0.8}
            >
              <Text style={styles.moodEmoji}>{mood.emoji}</Text>
              <Text 
                variant="bodySmall" 
                style={[
                  styles.moodLabel,
                  { color: isSelected ? '#fff' : theme.colors.onSurface }
                ]}
              >
                {mood.label}
              </Text>
            </AnimatedTouchable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
  },
  moodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    gap: 10,
  },
  moodButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 65,
    height: 65,
    borderRadius: 32.5,
    borderWidth: 2,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  moodEmoji: {
    fontSize: 20,
    marginBottom: 2,
  },
  moodLabel: {
    fontSize: 9,
    textAlign: 'center',
    fontWeight: '500',
  },
});