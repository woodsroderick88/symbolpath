"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Flame,
  BookOpen,
  Trophy,
  Star,
  TrendingUp,
  BarChart3,
  Brain,
  Repeat,
  Sparkles,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const SUIT_EMOJI = {
  cups: "💧",
  wands: "🔥",
  swords: "⚔️",
  pentacles: "🪙",
  major: "✨",
};

export default function ProgressPage() {
  const [stats, setStats] = useState(null);
  const [cardMastery, setCardMastery] = useState([]);
  const [readings, setReadings] = useState([]);
  const [patterns, setPatterns] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    setLoading(true);
    try {
      const [statsRes, masteryRes, readingsRes, patternsRes] =
        await Promise.all([
          fetch("/api/stats?userId=anonymous"),
          fetch("/api/card-mastery?userId=anonymous"),
          fetch("/api/readings"),
          fetch("/api/readings/patterns"),
        ]);

      const statsData = await statsRes.json();
      const masteryData = await masteryRes.json();
      const readingsData = await readingsRes.json();
      const patternsData = await patternsRes.json();

      setStats(statsData);
      setCardMastery(masteryData);
      setReadings(Array.isArray(readingsData) ? readingsData : []);
      setPatterns(patternsData);
    } catch (error) {
      console.error("Error loading progress:", error);
    } finally {
      setLoading(false);
    }
  };

  // Compute weekly reading counts for the chart (last 12 weeks)
  const weeklyData = useMemo(() => {
    const weeks = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
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
      weeks.push({ week: weekLabel, readings: readingsCount });
    }
    return weeks;
  }, [readings]);

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
    <div className="min-h-screen bg-[#0a0a0f]">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Your Progress</h1>
          <p className="text-gray-400">Track your journey through the cards</p>
        </div>

        {stats && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="bg-[#1a1a2e] rounded-xl p-6 border border-purple-600 text-center">
                <Flame size={48} className="mx-auto text-orange-500 mb-3" />
                <div className="text-5xl font-bold text-white mb-2">
                  {stats.daily_streak}
                </div>
                <div className="text-gray-400">Day Streak</div>
              </div>

              <div className="bg-[#1a1a2e] rounded-xl p-6 border border-[#2a2a4e] text-center">
                <BookOpen size={48} className="mx-auto text-purple-400 mb-3" />
                <div className="text-5xl font-bold text-white mb-2">
                  {stats.total_readings}
                </div>
                <div className="text-gray-400">Total Readings</div>
              </div>
            </div>

            {/* Reading History Chart */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <BarChart3 size={28} className="text-indigo-400" />
                <h2 className="text-2xl font-semibold text-white">
                  Reading History
                </h2>
              </div>
              <div className="bg-[#1a1a2e] rounded-xl p-6 border border-[#2a2a4e]">
                {readings.length > 0 ? (
                  <ResponsiveContainer width="100%" height={240}>
                    <AreaChart
                      data={weeklyData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="colorReadings"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#7C3AED"
                            stopOpacity={0.4}
                          />
                          <stop
                            offset="95%"
                            stopColor="#7C3AED"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2a2a4e" />
                      <XAxis
                        dataKey="week"
                        stroke="#6b7280"
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis
                        stroke="#6b7280"
                        tick={{ fontSize: 12 }}
                        allowDecimals={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1a1a2e",
                          border: "1px solid #4a1d96",
                          borderRadius: 8,
                          color: "#fff",
                        }}
                        labelStyle={{ color: "#a78bfa" }}
                      />
                      <Area
                        type="monotone"
                        dataKey="readings"
                        stroke="#7C3AED"
                        strokeWidth={2}
                        fill="url(#colorReadings)"
                        dot={{ fill: "#7C3AED", r: 4 }}
                        activeDot={{ r: 6, stroke: "#C4B5FD", strokeWidth: 2 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-12">
                    <BarChart3
                      size={48}
                      className="mx-auto text-gray-600 mb-3"
                    />
                    <p className="text-gray-500">
                      Complete readings to see your activity chart
                    </p>
                  </div>
                )}
                <p className="text-gray-500 text-xs mt-3 text-center">
                  Readings per week — last 12 weeks
                </p>
              </div>
            </div>

            {/* AI Pattern Detection */}
            {patterns && !patterns.needsMore && patterns.patterns && (
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <Brain size={28} className="text-purple-400" />
                  <h2 className="text-2xl font-semibold text-white">
                    Pattern Analysis
                  </h2>
                </div>

                {/* Dominant Theme */}
                <div className="bg-[#1a1a2e] rounded-xl p-6 border border-purple-600 mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">
                      {patterns.patterns.dominantSuit.emoji}
                    </span>
                    <div>
                      <h3 className="text-white font-bold text-lg">
                        {patterns.patterns.dominantSuit.theme}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {patterns.patterns.dominantSuit.suit} dominant —{" "}
                        {patterns.patterns.dominantSuit.percentage}% of all
                        cards
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm italic leading-relaxed">
                    {patterns.patterns.dominantSuit.insight}
                  </p>
                </div>

                {/* Suit Breakdown */}
                <div className="bg-[#1a1a2e] rounded-xl p-6 border border-[#2a2a4e] mb-4">
                  <h3 className="text-white font-semibold mb-4">
                    Suit Breakdown
                  </h3>
                  <div className="space-y-3">
                    {patterns.patterns.suitBreakdown.map((s) => {
                      const suitName =
                        s.suit.charAt(0).toUpperCase() + s.suit.slice(1);
                      return (
                        <div key={s.suit}>
                          <div className="flex justify-between mb-1">
                            <span className="text-gray-300 text-sm">
                              {SUIT_EMOJI[s.suit] || "✨"} {suitName}
                            </span>
                            <span className="text-purple-400 text-sm font-semibold">
                              {s.percentage}%
                            </span>
                          </div>
                          <div className="w-full bg-[#2a2a4e] rounded-full h-2">
                            <div
                              className="h-2 rounded-full"
                              style={{
                                width: `${s.percentage}%`,
                                background:
                                  "linear-gradient(90deg,#4F46E5,#7C3AED)",
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Top Recurring Cards */}
                  <div className="bg-[#1a1a2e] rounded-xl p-6 border border-[#2a2a4e]">
                    <div className="flex items-center gap-2 mb-3">
                      <Repeat size={16} className="text-purple-400" />
                      <h3 className="text-white font-semibold text-sm">
                        Most Frequent Cards
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {patterns.patterns.topCards.slice(0, 5).map((c, i) => (
                        <div
                          key={c.name}
                          className="flex justify-between items-center"
                        >
                          <span className="text-gray-300 text-sm">
                            <span className="text-purple-400 font-semibold mr-2">
                              #{i + 1}
                            </span>
                            {c.name}
                          </span>
                          <span className="text-gray-500 text-xs">
                            {c.count}× ({c.percentage}%)
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="bg-[#1a1a2e] rounded-xl p-6 border border-[#2a2a4e]">
                    <h3 className="text-white font-semibold text-sm mb-3">
                      Reading Insights
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">
                          Reversal Rate
                        </span>
                        <span className="text-purple-400 font-semibold">
                          {patterns.patterns.reversals.percentage}%
                        </span>
                      </div>
                      {patterns.patterns.favoriteSpread && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">
                            Favorite Spread
                          </span>
                          <span className="text-purple-400 font-semibold text-sm">
                            {patterns.patterns.favoriteSpread.name}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">
                          Most Active Day
                        </span>
                        <span className="text-purple-400 font-semibold">
                          {patterns.patterns.favoriteDay}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">
                          Last 30 Days
                        </span>
                        <span className="text-purple-400 font-semibold">
                          {patterns.patterns.recentActivity.last30Days} readings
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Position-specific patterns */}
                {patterns.patterns.recurringInPositions.length > 0 && (
                  <div className="bg-[#1a1a2e] rounded-xl p-6 border border-[#2a2a4e]">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles size={16} className="text-yellow-400" />
                      <h3 className="text-white font-semibold text-sm">
                        Recurring Position Patterns
                      </h3>
                    </div>
                    <p className="text-gray-500 text-xs mb-3">
                      These cards keep showing up in the same positions — the
                      universe might be emphasizing a message.
                    </p>
                    <div className="space-y-2">
                      {patterns.patterns.recurringInPositions.map((p, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-3 bg-[#0a0a1a] rounded-lg"
                        >
                          <span className="text-gray-300 text-sm">
                            <span className="text-yellow-400 font-semibold">
                              {p.card}
                            </span>
                            <span className="text-gray-500"> in </span>
                            <span className="text-purple-400">
                              {p.position}
                            </span>
                          </span>
                          <span className="text-gray-500 text-xs">
                            {p.count} times
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {patterns && patterns.needsMore && (
              <div className="mb-8 bg-[#1a1a2e] rounded-xl p-6 border border-[#2a2a4e] text-center">
                <Brain size={40} className="mx-auto text-gray-600 mb-3" />
                <p className="text-gray-400">{patterns.message}</p>
              </div>
            )}

            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Trophy size={28} className="text-yellow-500" />
                <h2 className="text-2xl font-semibold text-white">Badges</h2>
              </div>

              <div className="flex flex-wrap gap-3">
                {getBadges().map((badge, index) => (
                  <div
                    key={index}
                    className="bg-[#1a1a2e] rounded-xl px-4 py-3 border border-purple-600 flex items-center gap-3"
                  >
                    <span className="text-3xl">{badge.icon}</span>
                    <span className="text-white font-semibold">
                      {badge.name}
                    </span>
                  </div>
                ))}

                {getBadges().length === 0 && (
                  <p className="text-gray-500 italic">
                    Complete readings to earn badges
                  </p>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <Star size={28} className="text-purple-400" />
                <h2 className="text-2xl font-semibold text-white">
                  Card Mastery
                </h2>
              </div>

              <div className="space-y-3">
                {cardMastery.slice(0, 15).map((card) => (
                  <div
                    key={card.id}
                    className="bg-[#1a1a2e] rounded-xl p-4 border border-[#2a2a4e] flex justify-between items-center hover:border-purple-600 transition"
                  >
                    <div>
                      <h3 className="text-white font-semibold text-lg mb-1">
                        {card.card_name}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        Appeared {card.appearance_count} times
                      </p>
                    </div>

                    <div className="text-center">
                      <div
                        className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-1"
                        style={{
                          backgroundColor:
                            getMasteryColor(card.mastery_level) + "20",
                          border: `2px solid ${getMasteryColor(card.mastery_level)}`,
                          color: getMasteryColor(card.mastery_level),
                        }}
                      >
                        {card.mastery_level}
                      </div>
                      <div className="text-gray-500 text-xs">Level</div>
                    </div>
                  </div>
                ))}

                {cardMastery.length === 0 && (
                  <div className="text-center py-16">
                    <TrendingUp
                      size={64}
                      className="mx-auto text-gray-600 mb-4"
                    />
                    <p className="text-gray-400 text-lg">
                      Do your first reading to start tracking card mastery
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
