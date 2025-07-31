import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Card, Text, useTheme } from "react-native-paper";
import Svg, { Path, Circle, Line, Text as SvgText } from "react-native-svg";
import { MoodStats } from "../lib/types";
import { getMoodColor } from "../lib/utils";

interface StatisticsChartProps {
  stats: MoodStats;
  title: string;
}

const { width: screenWidth } = Dimensions.get("window");
const chartWidth = screenWidth - 64;
const chartHeight = 180;
const padding = { top: 20, right: 30, bottom: 40, left: 40 };

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

  // Calculate chart dimensions
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  // Scale functions
  const xScale = (index: number) =>
    (index / (stats.weeklyData.length - 1)) * innerWidth;
  const yScale = (mood: number) => innerHeight - ((mood - 1) / 4) * innerHeight;

  // Generate path for the area chart
  const generatePath = () => {
    if (stats.weeklyData.length === 0) return "";

    let path = `M ${padding.left} ${
      padding.top + yScale(stats.weeklyData[0].mood)
    }`;

    stats.weeklyData.forEach((item, index) => {
      if (index > 0) {
        const x = padding.left + xScale(index);
        const y = padding.top + yScale(item.mood);
        path += ` L ${x} ${y}`;
      }
    });

    // Close the area by going to the bottom
    path += ` L ${padding.left + xScale(stats.weeklyData.length - 1)} ${
      padding.top + innerHeight
    }`;
    path += ` L ${padding.left} ${padding.top + innerHeight} Z`;

    return path;
  };

  // Generate line path
  const generateLinePath = () => {
    if (stats.weeklyData.length === 0) return "";

    let path = `M ${padding.left} ${
      padding.top + yScale(stats.weeklyData[0].mood)
    }`;

    stats.weeklyData.forEach((item, index) => {
      if (index > 0) {
        const x = padding.left + xScale(index);
        const y = padding.top + yScale(item.mood);
        path += ` L ${x} ${y}`;
      }
    });

    return path;
  };

  const pathData = generatePath();
  const lineData = generateLinePath();

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
          <Svg width={chartWidth} height={chartHeight}>
            {/* Grid lines */}
            {[1, 2, 3, 4, 5].map((value) => (
              <Line
                key={value}
                x1={padding.left}
                y1={padding.top + yScale(value)}
                x2={padding.left + innerWidth}
                y2={padding.top + yScale(value)}
                stroke={theme.colors.outline}
                strokeWidth={0.5}
                strokeOpacity={0.3}
              />
            ))}

            {/* Vertical grid lines */}
            {stats.weeklyData.map((_, index) => (
              <Line
                key={index}
                x1={padding.left + xScale(index)}
                y1={padding.top}
                x2={padding.left + xScale(index)}
                y2={padding.top + innerHeight}
                stroke={theme.colors.outline}
                strokeWidth={0.5}
                strokeOpacity={0.2}
              />
            ))}

            {/* Area fill */}
            <Path
              d={pathData}
              fill={theme.colors.primaryContainer}
              fillOpacity={0.3}
            />

            {/* Line */}
            <Path
              d={lineData}
              fill="none"
              stroke={theme.colors.primary}
              strokeWidth={2}
            />

            {/* Data points */}
            {stats.weeklyData.map((item, index) => (
              <Circle
                key={index}
                cx={padding.left + xScale(index)}
                cy={padding.top + yScale(item.mood)}
                r={4}
                fill={theme.colors.primary}
                stroke={theme.colors.surface}
                strokeWidth={2}
              />
            ))}

            {/* Y-axis labels */}
            {[1, 2, 3, 4, 5].map((value) => (
              <SvgText
                key={value}
                x={padding.left - 10}
                y={padding.top + yScale(value) + 4}
                fontSize="12"
                fill={theme.colors.onSurfaceVariant}
                textAnchor="end"
              >
                {value}
              </SvgText>
            ))}

            {/* X-axis labels */}
            {stats.weeklyData.map((item, index) => {
              const date = new Date(item.date);
              const label = date.toLocaleDateString("id-ID", {
                month: "short",
                day: "numeric",
              });
              return (
                <SvgText
                  key={index}
                  x={padding.left + xScale(index)}
                  y={padding.top + innerHeight + 20}
                  fontSize="10"
                  fill={theme.colors.onSurfaceVariant}
                  textAnchor="middle"
                >
                  {label}
                </SvgText>
              );
            })}
          </Svg>
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
