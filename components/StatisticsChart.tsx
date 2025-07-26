import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { VictoryChart, VictoryLine, VictoryArea, VictoryAxis, VictoryTheme, VictoryScatter } from 'victory-native';
import { MoodStats } from '../lib/types';
import { getMoodColor } from '../lib/utils';

interface StatisticsChartProps {
  stats: MoodStats;
  title: string;
}

const { width: screenWidth } = Dimensions.get('window');
const chartWidth = screenWidth - 64;

export const StatisticsChart: React.FC<StatisticsChartProps> = ({ stats, title }) => {
  const theme = useTheme();

  if (!stats.weeklyData.length) {
    return (
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Text variant="titleMedium" style={[styles.title, { color: theme.colors.onSurface }]}>
            {title}
          </Text>
          <Text variant="bodyMedium" style={[styles.noData, { color: theme.colors.onSurfaceVariant }]}>
            Belum ada data untuk ditampilkan
          </Text>
        </Card.Content>
      </Card>
    );
  }

  const chartData = stats.weeklyData.map((item, index) => ({
    x: index + 1,
    y: item.mood,
    date: item.date
  }));

  return (
    <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      <Card.Content>
        <Text variant="titleMedium" style={[styles.title, { color: theme.colors.onSurface }]}>
          {title}
        </Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text variant="bodySmall" style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
              Rata-rata Mood
            </Text>
            <Text variant="titleLarge" style={[styles.statValue, { color: theme.colors.primary }]}>
              {stats.averageMood}/5
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Text variant="bodySmall" style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
              Total Entri
            </Text>
            <Text variant="titleLarge" style={[styles.statValue, { color: theme.colors.primary }]}>
              {stats.totalEntries}
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Text variant="bodySmall" style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
              Mood Terbanyak
            </Text>
            <Text variant="titleLarge" style={[styles.statValue, { color: getMoodColor(stats.mostCommonMood) }]}>
              {stats.mostCommonMood}/5
            </Text>
          </View>
        </View>

        <View style={styles.chartContainer}>
          <VictoryChart
            theme={VictoryTheme.material}
            width={chartWidth}
            height={200}
            padding={{ left: 50, top: 20, right: 50, bottom: 50 }}
          >
            <VictoryAxis
              dependentAxis
              domain={[1, 5]}
              tickCount={5}
              style={{
                axis: { stroke: theme.colors.outline },
                tickLabels: { fill: theme.colors.onSurfaceVariant, fontSize: 12 },
                grid: { stroke: theme.colors.outline, strokeOpacity: 0.3 }
              }}
            />
            
            <VictoryAxis
              style={{
                axis: { stroke: theme.colors.outline },
                tickLabels: { fill: theme.colors.onSurfaceVariant, fontSize: 10 },
                grid: { stroke: theme.colors.outline, strokeOpacity: 0.3 }
              }}
              tickFormat={() => ''}
            />

            <VictoryArea
              data={chartData}
              style={{
                data: { 
                  fill: theme.colors.primaryContainer, 
                  fillOpacity: 0.3,
                  stroke: theme.colors.primary,
                  strokeWidth: 2
                }
              }}
              animate={{
                duration: 1000,
                onLoad: { duration: 500 }
              }}
            />

            <VictoryScatter
              data={chartData}
              size={4}
              style={{
                data: { fill: theme.colors.primary }
              }}
            />
          </VictoryChart>
        </View>

        {stats.moodDistribution.length > 0 && (
          <View style={styles.distributionContainer}>
            <Text variant="titleSmall" style={[styles.distributionTitle, { color: theme.colors.onSurface }]}>
              Distribusi Mood
            </Text>
            <View style={styles.distributionBars}>
              {stats.moodDistribution.map((item) => (
                <View key={item.mood} style={styles.distributionItem}>
                  <View 
                    style={[
                      styles.distributionBar,
                      {
                        backgroundColor: getMoodColor(item.mood),
                        height: Math.max((item.count / stats.totalEntries) * 60, 8)
                      }
                    ]}
                  />
                  <Text variant="bodySmall" style={[styles.distributionLabel, { color: theme.colors.onSurfaceVariant }]}>
                    {item.mood}
                  </Text>
                  <Text variant="bodySmall" style={[styles.distributionCount, { color: theme.colors.onSurfaceVariant }]}>
                    {item.count}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '600',
  },
  noData: {
    textAlign: 'center',
    paddingVertical: 40,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    textAlign: 'center',
    marginBottom: 4,
  },
  statValue: {
    fontWeight: 'bold',
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  distributionContainer: {
    marginTop: 20,
  },
  distributionTitle: {
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '600',
  },
  distributionBars: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 80,
  },
  distributionItem: {
    alignItems: 'center',
    flex: 1,
  },
  distributionBar: {
    width: 30,
    borderRadius: 4,
    marginBottom: 8,
  },
  distributionLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  distributionCount: {
    fontSize: 10,
  },
});