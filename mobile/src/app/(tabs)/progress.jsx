import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useState, useEffect, useMemo } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  Flame,
  BookOpen,
  Trophy,
  Star,
  TrendingUp,
  BarChart3,
} from "lucide-react-native";

export default function ProgressScreen() {
  const insets = useSafeAreaInsets();
  const [stats, setStats] = useState(null);
  const [cardMastery, setCardMastery] = useState([]);
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    setLoading(true);
    try {
      const [statsRes, masteryRes, readingsRes] = await Promise.all([
        fetch("/api/stats?userId=anonymous"),
        fetch("/api/card-mastery?userId=anonymous"),
        fetch("/api/readings"),
      ]);

      const statsData = await statsRes.json();
      const masteryData = await masteryRes.json();
      const readingsData = await readingsRes.json();

      setStats(statsData);
      setCardMastery(masteryData);
      setReadings(Array.isArray(readingsData) ? readingsData : []);
    } catch (error) {
      console.error("Error loading progress:", error);
    } finally {
      setLoading(false);
    }
  };

  // Compute weekly reading counts (last 8 weeks for mobile)
  const weeklyData = useMemo(() => {
    const weeks = [];
    const now = new Date();
    for (let i = 7; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - i * 7);
      weekStart.setHours(0, 0, 0, 0);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);
      const weekLabel = `${weekStart.getMonth() + 1}/${weekStart.getDate()}`;
      const readingsCount = readings.filter((r) => {
        const d = new Date(r.created_at);
        return d >= weekStart && d < weekEnd;
      }).length;
      weeks.push({ week: weekLabel, count: readingsCount });
    }
    return weeks;
  }, [readings]);

  const maxReading = useMemo(() => {
    return Math.max(...weeklyData.map((w) => w.count), 1);
  }, [weeklyData]);

  const getBadges = () => {
    if (!stats) return [];

    const badges = [];
    if (stats.daily_streak >= 7)
      badges.push({ name: "7-Day Streak", icon: "🔥" });
    if (stats.daily_streak >= 30)
      badges.push({ name: "30-Day Streak", icon: "⚡" });
    if (stats.total_readings >= 10)
      badges.push({ name: "10 Readings", icon: "🎴" });
    if (stats.total_readings >= 50)
      badges.push({ name: "50 Readings", icon: "✨" });
    if (stats.total_readings >= 100)
      badges.push({ name: "100 Readings", icon: "🌟" });
    if (stats.total_journal_entries >= 20)
      badges.push({ name: "Journaling Pro", icon: "📔" });

    return badges;
  };

  const getMasteryColor = (level) => {
    if (level >= 10) return "#fbbf24";
    if (level >= 5) return "#a78bfa";
    return "#6b7280";
  };

  return (
    <View
      style={{ flex: 1, backgroundColor: "#0a0a0f", paddingTop: insets.top }}
    >
      <StatusBar style="light" />

      <View
        style={{ padding: 20, borderBottomWidth: 1, borderColor: "#1a1a2e" }}
      >
        <Text
          style={{
            fontSize: 32,
            fontWeight: "700",
            color: "#fff",
            marginBottom: 4,
          }}
        >
          Your Progress
        </Text>
        <Text style={{ fontSize: 14, color: "#6b7280" }}>
          Track your journey through the cards
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: 20,
          paddingBottom: insets.bottom + 80,
        }}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={loadProgress}
            tintColor="#a78bfa"
          />
        }
      >
        {stats && (
          <>
            <View style={{ flexDirection: "row", gap: 12, marginBottom: 24 }}>
              <View
                style={{
                  flex: 1,
                  backgroundColor: "#1a1a2e",
                  borderRadius: 16,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: "#4a1d96",
                  alignItems: "center",
                }}
              >
                <Flame size={32} color="#f59e0b" />
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 28,
                    fontWeight: "700",
                    marginTop: 8,
                  }}
                >
                  {stats.daily_streak}
                </Text>
                <Text style={{ color: "#6b7280", fontSize: 12 }}>
                  Day Streak
                </Text>
              </View>

              <View
                style={{
                  flex: 1,
                  backgroundColor: "#1a1a2e",
                  borderRadius: 16,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: "#2a2a4e",
                  alignItems: "center",
                }}
              >
                <BookOpen size={32} color="#a78bfa" />
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 28,
                    fontWeight: "700",
                    marginTop: 8,
                  }}
                >
                  {stats.total_readings}
                </Text>
                <Text style={{ color: "#6b7280", fontSize: 12 }}>
                  Total Readings
                </Text>
              </View>
            </View>

            {/* Reading History Chart */}
            <View style={{ marginBottom: 24 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <BarChart3 size={24} color="#818cf8" />
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "600",
                    color: "#fff",
                    marginLeft: 8,
                  }}
                >
                  Reading History
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: "#1a1a2e",
                  borderRadius: 16,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: "#2a2a4e",
                }}
              >
                {readings.length > 0 ? (
                  <>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "flex-end",
                        justifyContent: "space-between",
                        height: 120,
                        marginBottom: 8,
                      }}
                    >
                      {weeklyData.map((week, i) => {
                        const barHeight =
                          week.count > 0 ? (week.count / maxReading) * 100 : 4;
                        return (
                          <View
                            key={i}
                            style={{
                              flex: 1,
                              alignItems: "center",
                              justifyContent: "flex-end",
                              paddingHorizontal: 2,
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 10,
                                color: "#a78bfa",
                                marginBottom: 4,
                                fontWeight: "600",
                              }}
                            >
                              {week.count > 0 ? week.count : ""}
                            </Text>
                            <View
                              style={{
                                width: "80%",
                                height: barHeight,
                                backgroundColor:
                                  week.count > 0 ? "#7C3AED" : "#2a2a4e",
                                borderRadius: 4,
                                minHeight: 4,
                              }}
                            />
                          </View>
                        );
                      })}
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      {weeklyData.map((week, i) => (
                        <View key={i} style={{ flex: 1, alignItems: "center" }}>
                          <Text style={{ fontSize: 9, color: "#6b7280" }}>
                            {week.week}
                          </Text>
                        </View>
                      ))}
                    </View>
                    <Text
                      style={{
                        fontSize: 11,
                        color: "#6b7280",
                        textAlign: "center",
                        marginTop: 8,
                      }}
                    >
                      Readings per week — last 8 weeks
                    </Text>
                  </>
                ) : (
                  <View style={{ alignItems: "center", paddingVertical: 24 }}>
                    <BarChart3 size={36} color="#4b5563" />
                    <Text
                      style={{ color: "#6b7280", fontSize: 13, marginTop: 8 }}
                    >
                      Complete readings to see your chart
                    </Text>
                  </View>
                )}
              </View>
            </View>

            <View style={{ marginBottom: 24 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <Trophy size={24} color="#fbbf24" />
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "600",
                    color: "#fff",
                    marginLeft: 8,
                  }}
                >
                  Badges
                </Text>
              </View>

              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
                {getBadges().map((badge, index) => (
                  <View
                    key={index}
                    style={{
                      backgroundColor: "#1a1a2e",
                      borderRadius: 12,
                      padding: 12,
                      borderWidth: 1,
                      borderColor: "#4a1d96",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <Text style={{ fontSize: 24 }}>{badge.icon}</Text>
                    <Text
                      style={{ color: "#fff", fontSize: 14, fontWeight: "600" }}
                    >
                      {badge.name}
                    </Text>
                  </View>
                ))}

                {getBadges().length === 0 && (
                  <Text
                    style={{
                      color: "#6b7280",
                      fontSize: 14,
                      fontStyle: "italic",
                    }}
                  >
                    Complete readings to earn badges
                  </Text>
                )}
              </View>
            </View>

            <View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <Star size={24} color="#a78bfa" />
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "600",
                    color: "#fff",
                    marginLeft: 8,
                  }}
                >
                  Card Mastery
                </Text>
              </View>

              {cardMastery.slice(0, 10).map((card, index) => (
                <View
                  key={card.id}
                  style={{
                    backgroundColor: "#1a1a2e",
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 8,
                    borderWidth: 1,
                    borderColor: "#2a2a4e",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        color: "#fff",
                        fontSize: 16,
                        fontWeight: "600",
                        marginBottom: 4,
                      }}
                    >
                      {card.card_name}
                    </Text>
                    <Text style={{ color: "#6b7280", fontSize: 12 }}>
                      Appeared {card.appearance_count} times
                    </Text>
                  </View>

                  <View style={{ alignItems: "center" }}>
                    <View
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 24,
                        backgroundColor:
                          getMasteryColor(card.mastery_level) + "20",
                        borderWidth: 2,
                        borderColor: getMasteryColor(card.mastery_level),
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        style={{
                          color: getMasteryColor(card.mastery_level),
                          fontSize: 16,
                          fontWeight: "700",
                        }}
                      >
                        {card.mastery_level}
                      </Text>
                    </View>
                    <Text
                      style={{ color: "#6b7280", fontSize: 10, marginTop: 4 }}
                    >
                      Level
                    </Text>
                  </View>
                </View>
              ))}

              {cardMastery.length === 0 && (
                <View style={{ alignItems: "center", paddingVertical: 40 }}>
                  <TrendingUp size={48} color="#4b5563" />
                  <Text
                    style={{
                      color: "#6b7280",
                      fontSize: 14,
                      marginTop: 12,
                      textAlign: "center",
                    }}
                  >
                    Do your first reading to start tracking card mastery
                  </Text>
                </View>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}
