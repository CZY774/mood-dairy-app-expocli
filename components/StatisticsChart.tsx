import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Card, Text, useTheme } from "react-native-paper";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts";
import { MoodStats } from "../lib/types";
import { getMoodColor } from "../lib/utils";

interface StatisticsChartProps {
  stats: MoodStats;
  title: string;
}

const { width: screenWidth } = Dimensions.get("window");
const chartWidth = screenWidth - 64;

export const StatisticsChart: React.FC<StatisticsChartProps> = ({
  stats,
  title,
}) => {
  const theme = useTheme();

  if (!stats.weeklyData.length) {
    return (
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Text
            variant="titleMedium"
            style={[styles.title, { color: theme.colors.onSurface }]}
          >
            {title}
          </Text>
          <Text
            variant="bodyMedium"
            style={[styles.noData, { color: theme.colors.onSurfaceVariant }]}
          >
            Belum ada data untuk ditampilkan
          </Text>
        </Card.Content>
      </Card>
    );
  }

  const chartData = stats.weeklyData.map((item, index) => ({
    day: index + 1,
    mood: item.mood,
    date: item.date,
    formattedDate: new Date(item.date).toLocaleDateString("id-ID", {
      month: "short",
      day: "numeric",
    }),
  }));

  return (
    <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      <Card.Content>
        <Text
          variant="titleMedium"
          style={[styles.title, { color: theme.colors.onSurface }]}
        >
          {title}
        </Text>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text
              variant="bodySmall"
              style={[
                styles.statLabel,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              Rata-rata Mood
            </Text>
            <Text
              variant="titleLarge"
              style={[styles.statValue, { color: theme.colors.primary }]}
            >
              {stats.averageMood}/5
            </Text>
          </View>

          <View style={styles.statItem}>
            <Text
              variant="bodySmall"
              style={[
                styles.statLabel,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              Total Entri
            </Text>
            <Text
              variant="titleLarge"
              style={[styles.statValue, { color: theme.colors.primary }]}
            >
              {stats.totalEntries}
            </Text>
          </View>

          <View style={styles.statItem}>
            <Text
              variant="bodySmall"
              style={[
                styles.statLabel,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              Mood Terbanyak
            </Text>
            <Text
              variant="titleLarge"
              style={[
                styles.statValue,
                { color: getMoodColor(stats.mostCommonMood) },
              ]}
            >
              {stats.mostCommonMood}/5
            </Text>
          </View>
        </View>

        <View style={styles.chartContainer}>
          <ResponsiveContainer width={chartWidth} height={200}>
            <AreaChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={theme.colors.outline}
                strokeOpacity={0.3}
              />
              <XAxis
                dataKey="formattedDate"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: theme.colors.onSurfaceVariant }}
              />
              <YAxis
                domain={[1, 5]}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: theme.colors.onSurfaceVariant }}
              />
              <Area
                type="monotone"
                dataKey="mood"
                stroke={theme.colors.primary}
                strokeWidth={2}
                fill={theme.colors.primaryContainer}
                fillOpacity={0.3}
                dot={{ fill: theme.colors.primary, strokeWidth: 2, r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </View>

        {stats.moodDistribution.length > 0 && (
          <View style={styles.distributionContainer}>
            <Text
              variant="titleSmall"
              style={[
                styles.distributionTitle,
                { color: theme.colors.onSurface },
              ]}
            >
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
                        height: Math.max(
                          (item.count / stats.totalEntries) * 60,
                          8
                        ),
                      },
                    ]}
                  />
                  <Text
                    variant="bodySmall"
                    style={[
                      styles.distributionLabel,
                      { color: theme.colors.onSurfaceVariant },
                    ]}
                  >
                    {item.mood}
                  </Text>
                  <Text
                    variant="bodySmall"
                    style={[
                      styles.distributionCount,
                      { color: theme.colors.onSurfaceVariant },
                    ]}
                  >
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    textAlign: "center",
    marginBottom: 16,
    fontWeight: "600",
  },
  noData: {
    textAlign: "center",
    paddingVertical: 40,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  statItem: {
    alignItems: "center",
  },
  statLabel: {
    textAlign: "center",
    marginBottom: 4,
  },
  statValue: {
    fontWeight: "bold",
  },
  chartContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  distributionContainer: {
    marginTop: 20,
  },
  distributionTitle: {
    textAlign: "center",
    marginBottom: 12,
    fontWeight: "600",
  },
  distributionBars: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    height: 80,
  },
  distributionItem: {
    alignItems: "center",
    flex: 1,
  },
  distributionBar: {
    width: 30,
    borderRadius: 4,
    marginBottom: 8,
  },
  distributionLabel: {
    fontSize: 12,
    fontWeight: "600",
  },
  distributionCount: {
    fontSize: 10,
  },
});
