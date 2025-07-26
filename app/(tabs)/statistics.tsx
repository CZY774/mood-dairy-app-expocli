import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, View, RefreshControl } from "react-native";
import {
  Appbar,
  Text,
  useTheme,
  SegmentedButtons,
  Card,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatisticsChart } from "../../components/StatisticsChart";
import { MoodEntry } from "../../components/MoodEntry";
import { databaseService } from "../../lib/database";
import { MoodStats, MoodEntry as MoodEntryType } from "../../lib/types";
import { ACTIVITIES } from "../../constants/Moods";

export default function StatisticsScreen() {
  const theme = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const [stats, setStats] = useState<MoodStats | null>(null);
  const [allEntries, setAllEntries] = useState<MoodEntryType[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadStatistics();
    loadAllEntries();
  }, [selectedPeriod]);

  const loadStatistics = async () => {
    try {
      const days =
        selectedPeriod === "week" ? 7 : selectedPeriod === "month" ? 30 : 90;
      const moodStats = await databaseService.getMoodStats(days);
      setStats(moodStats);
    } catch (error) {
      console.error("Error loading statistics:", error);
    }
  };

  const loadAllEntries = async () => {
    try {
      const entries = await databaseService.getMoodEntries(50);
      setAllEntries(entries);
    } catch (error) {
      console.error("Error loading entries:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadStatistics(), loadAllEntries()]);
    setRefreshing(false);
  };

  const getTopActivities = () => {
    if (allEntries.length === 0) return [];

    const activityCount: { [key: string]: number } = {};

    allEntries.forEach((entry) => {
      const activities = JSON.parse(entry.activities);
      activities.forEach((activityId: string) => {
        activityCount[activityId] = (activityCount[activityId] || 0) + 1;
      });
    });

    return Object.entries(activityCount)
      .map(([activityId, count]) => {
        const activity = ACTIVITIES.find((a) => a.id === activityId);
        return activity ? { activity, count } : null;
      })
      .filter(Boolean)
      .sort((a, b) => b!.count - a!.count)
      .slice(0, 5);
  };

  const topActivities = getTopActivities();

  const periodOptions = [
    { value: "week", label: "7 Hari" },
    { value: "month", label: "30 Hari" },
    { value: "quarter", label: "90 Hari" },
  ];

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Appbar.Header>
        <Appbar.Content
          title="📊 Statistik Mood"
          titleStyle={styles.headerTitle}
        />
      </Appbar.Header>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.content}>
          <SegmentedButtons
            value={selectedPeriod}
            onValueChange={setSelectedPeriod}
            buttons={periodOptions}
            style={styles.segmentedButtons}
          />

          {stats && (
            <StatisticsChart
              stats={stats}
              title={`Grafik Mood ${
                selectedPeriod === "week"
                  ? "7 Hari Terakhir"
                  : selectedPeriod === "month"
                  ? "30 Hari Terakhir"
                  : "90 Hari Terakhir"
              }`}
            />
          )}

          {topActivities.length > 0 && (
            <Card
              style={[
                styles.activitiesCard,
                { backgroundColor: theme.colors.surface },
              ]}
            >
              <Card.Content>
                <Text
                  variant="titleMedium"
                  style={[styles.cardTitle, { color: theme.colors.onSurface }]}
                >
                  🎯 Aktivitas Terpopuler
                </Text>
                {topActivities.map((item, index) => (
                  <View key={item!.activity.id} style={styles.activityItem}>
                    <View style={styles.activityInfo}>
                      <Text style={styles.activityEmoji}>
                        {item!.activity.emoji}
                      </Text>
                      <Text
                        variant="bodyMedium"
                        style={[
                          styles.activityName,
                          { color: theme.colors.onSurface },
                        ]}
                      >
                        {item!.activity.name}
                      </Text>
                    </View>
                    <View style={styles.activityCount}>
                      <Text
                        variant="bodyMedium"
                        style={[
                          styles.countText,
                          { color: theme.colors.primary },
                        ]}
                      >
                        {item!.count}x
                      </Text>
                    </View>
                  </View>
                ))}
              </Card.Content>
            </Card>
          )}

          {stats && stats.totalEntries > 0 && (
            <Card
              style={[
                styles.insightsCard,
                { backgroundColor: theme.colors.surface },
              ]}
            >
              <Card.Content>
                <Text
                  variant="titleMedium"
                  style={[styles.cardTitle, { color: theme.colors.onSurface }]}
                >
                  💡 Insight
                </Text>

                <View style={styles.insightItem}>
                  <Text
                    variant="bodyMedium"
                    style={[
                      styles.insightText,
                      { color: theme.colors.onSurface },
                    ]}
                  >
                    Rata-rata mood kamu dalam periode ini adalah{" "}
                    <Text
                      style={[
                        styles.highlightText,
                        { color: theme.colors.primary },
                      ]}
                    >
                      {stats.averageMood}/5
                    </Text>
                    {stats.averageMood >= 4
                      ? " - Kamu terlihat bahagia! 😊"
                      : stats.averageMood >= 3
                      ? " - Mood kamu cukup stabil 😌"
                      : " - Semoga harimu akan lebih baik 💪"}
                  </Text>
                </View>

                <View style={styles.insightItem}>
                  <Text
                    variant="bodyMedium"
                    style={[
                      styles.insightText,
                      { color: theme.colors.onSurface },
                    ]}
                  >
                    Kamu telah mencatat mood sebanyak{" "}
                    <Text
                      style={[
                        styles.highlightText,
                        { color: theme.colors.primary },
                      ]}
                    >
                      {stats.totalEntries} hari
                    </Text>
                    . Konsistensi yang baik untuk tracking mood!
                  </Text>
                </View>

                {stats.mostCommonMood && (
                  <View style={styles.insightItem}>
                    <Text
                      variant="bodyMedium"
                      style={[
                        styles.insightText,
                        { color: theme.colors.onSurface },
                      ]}
                    >
                      Mood yang paling sering kamu rasakan adalah{" "}
                      <Text
                        style={[
                          styles.highlightText,
                          { color: theme.colors.primary },
                        ]}
                      >
                        {stats.mostCommonMood}/5
                      </Text>
                    </Text>
                  </View>
                )}
              </Card.Content>
            </Card>
          )}

          {allEntries.length > 0 && (
            <View style={styles.entriesSection}>
              <Text
                variant="titleMedium"
                style={[
                  styles.sectionTitle,
                  { color: theme.colors.onBackground },
                ]}
              >
                📝 Semua Catatan
              </Text>
              {allEntries.map((entry) => (
                <MoodEntry key={entry.id} entry={entry} />
              ))}
            </View>
          )}

          {allEntries.length === 0 && (
            <Card
              style={[
                styles.emptyCard,
                { backgroundColor: theme.colors.surface },
              ]}
            >
              <Card.Content>
                <Text
                  variant="bodyLarge"
                  style={[
                    styles.emptyText,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  📊 Belum ada data statistik
                </Text>
                <Text
                  variant="bodyMedium"
                  style={[
                    styles.emptySubText,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  Mulai catat mood harianmu untuk melihat statistik dan insight
                  menarik!
                </Text>
              </Card.Content>
            </Card>
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
    fontWeight: "bold",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  activitiesCard: {
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    textAlign: "center",
    marginBottom: 16,
    fontWeight: "600",
  },
  activityItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  activityInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  activityEmoji: {
    fontSize: 18,
    marginRight: 12,
  },
  activityName: {
    flex: 1,
  },
  activityCount: {
    minWidth: 40,
    alignItems: "flex-end",
  },
  countText: {
    fontWeight: "600",
  },
  insightsCard: {
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  insightItem: {
    marginBottom: 12,
  },
  insightText: {
    lineHeight: 22,
  },
  highlightText: {
    fontWeight: "600",
  },
  entriesSection: {
    marginTop: 32,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: "600",
  },
  emptyCard: {
    marginTop: 32,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  emptyText: {
    textAlign: "center",
    marginBottom: 8,
    fontWeight: "600",
  },
  emptySubText: {
    textAlign: "center",
    lineHeight: 20,
  },
});
