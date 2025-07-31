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

  // Validate and filter data
  const validData = stats.weeklyData.filter(
    (item) =>
      item &&
      typeof item.mood === "number" &&
      !isNaN(item.mood) &&
      item.mood >= 1 &&
      item.mood <= 5
  );

  if (validData.length === 0) {
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
            Data tidak valid untuk ditampilkan
          </Text>
        </Card.Content>
      </Card>
    );
  }

  // Calculate chart dimensions
  const innerWidth = Math.max(chartWidth - padding.left - padding.right, 100);
  const innerHeight = Math.max(chartHeight - padding.top - padding.bottom, 100);

  // Safe scale functions with validation
  const xScale = (index: number) => {
    if (validData.length <= 1) return innerWidth / 2;
    const scale = (index / (validData.length - 1)) * innerWidth;
    return isNaN(scale) ? 0 : scale;
  };

  const yScale = (mood: number) => {
    if (isNaN(mood) || mood < 1 || mood > 5) return innerHeight;
    const scale = innerHeight - ((mood - 1) / 4) * innerHeight;
    return isNaN(scale) ? innerHeight : scale;
  };

  // Generate path for the area chart with validation
  const generatePath = () => {
    if (validData.length === 0) return "";

    const startX = padding.left;
    const startY = padding.top + yScale(validData[0].mood);

    if (isNaN(startX) || isNaN(startY)) return "";

    let path = `M ${startX} ${startY}`;

    validData.forEach((item, index) => {
      if (index > 0) {
        const x = padding.left + xScale(index);
        const y = padding.top + yScale(item.mood);

        if (!isNaN(x) && !isNaN(y)) {
          path += ` L ${x} ${y}`;
        }
      }
    });

    // Close the area by going to the bottom
    const lastX = padding.left + xScale(validData.length - 1);
    const bottomY = padding.top + innerHeight;

    if (!isNaN(lastX) && !isNaN(bottomY)) {
      path += ` L ${lastX} ${bottomY}`;
      path += ` L ${startX} ${bottomY} Z`;
    }

    return path;
  };

  // Generate line path with validation
  const generateLinePath = () => {
    if (validData.length === 0) return "";

    const startX = padding.left;
    const startY = padding.top + yScale(validData[0].mood);

    if (isNaN(startX) || isNaN(startY)) return "";

    let path = `M ${startX} ${startY}`;

    validData.forEach((item, index) => {
      if (index > 0) {
        const x = padding.left + xScale(index);
        const y = padding.top + yScale(item.mood);

        if (!isNaN(x) && !isNaN(y)) {
          path += ` L ${x} ${y}`;
        }
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
              {isNaN(stats.averageMood) ? "0" : stats.averageMood}/5
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
              {stats.totalEntries || 0}
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
              {isNaN(stats.mostCommonMood) ? "0" : stats.mostCommonMood}/5
            </Text>
          </View>
        </View>

        <View style={styles.chartContainer}>
          <Svg width={chartWidth} height={chartHeight}>
            {/* Grid lines */}
            {[1, 2, 3, 4, 5].map((value) => {
              const y = padding.top + yScale(value);
              if (isNaN(y)) return null;

              return (
                <Line
                  key={value}
                  x1={padding.left}
                  y1={y}
                  x2={padding.left + innerWidth}
                  y2={y}
                  stroke={theme.colors.outline}
                  strokeWidth={0.5}
                  strokeOpacity={0.3}
                />
              );
            })}

            {/* Vertical grid lines */}
            {validData.map((_, index) => {
              const x = padding.left + xScale(index);
              if (isNaN(x)) return null;

              return (
                <Line
                  key={index}
                  x1={x}
                  y1={padding.top}
                  x2={x}
                  y2={padding.top + innerHeight}
                  stroke={theme.colors.outline}
                  strokeWidth={0.5}
                  strokeOpacity={0.2}
                />
              );
            })}

            {/* Area fill */}
            {pathData && (
              <Path
                d={pathData}
                fill={theme.colors.primaryContainer}
                fillOpacity={0.3}
              />
            )}

            {/* Line */}
            {lineData && (
              <Path
                d={lineData}
                fill="none"
                stroke={theme.colors.primary}
                strokeWidth={2}
              />
            )}

            {/* Data points */}
            {validData.map((item, index) => {
              const cx = padding.left + xScale(index);
              const cy = padding.top + yScale(item.mood);

              if (isNaN(cx) || isNaN(cy)) return null;

              return (
                <Circle
                  key={index}
                  cx={cx}
                  cy={cy}
                  r={4}
                  fill={theme.colors.primary}
                  stroke={theme.colors.surface}
                  strokeWidth={2}
                />
              );
            })}

            {/* Y-axis labels */}
            {[1, 2, 3, 4, 5].map((value) => {
              const y = padding.top + yScale(value) + 4;
              if (isNaN(y)) return null;

              return (
                <SvgText
                  key={value}
                  x={padding.left - 10}
                  y={y}
                  fontSize="12"
                  fill={theme.colors.onSurfaceVariant}
                  textAnchor="end"
                >
                  {value}
                </SvgText>
              );
            })}

            {/* X-axis labels */}
            {validData.map((item, index) => {
              const x = padding.left + xScale(index);
              if (isNaN(x)) return null;

              try {
                const date = new Date(item.date);
                const label = date.toLocaleDateString("id-ID", {
                  month: "short",
                  day: "numeric",
                });

                return (
                  <SvgText
                    key={index}
                    x={x}
                    y={padding.top + innerHeight + 20}
                    fontSize="10"
                    fill={theme.colors.onSurfaceVariant}
                    textAnchor="middle"
                  >
                    {label}
                  </SvgText>
                );
              } catch (error) {
                return null;
              }
            })}
          </Svg>
        </View>

        {stats.moodDistribution && stats.moodDistribution.length > 0 && (
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
              {stats.moodDistribution.map((item) => {
                if (!item || isNaN(item.mood) || isNaN(item.count)) return null;

                const height = Math.max(
                  (item.count / (stats.totalEntries || 1)) * 60,
                  8
                );

                return (
                  <View key={item.mood} style={styles.distributionItem}>
                    <View
                      style={[
                        styles.distributionBar,
                        {
                          backgroundColor: getMoodColor(item.mood),
                          height: isNaN(height) ? 8 : height,
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
                );
              })}
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
