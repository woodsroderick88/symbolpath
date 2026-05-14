import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Plus, Eye, Zap, Brain, X, Globe } from "lucide-react-native";
import KeyboardAvoidingAnimatedView from "@/components/KeyboardAvoidingAnimatedView";

const STAGE_CONFIG = {
  Awakening: {
    color: "#60A5FA",
    bg: "rgba(96,165,250,0.12)",
    border: "rgba(96,165,250,0.3)",
    emoji: "🌅",
  },
  Growth: {
    color: "#34D399",
    bg: "rgba(52,211,153,0.12)",
    border: "rgba(52,211,153,0.3)",
    emoji: "🌿",
  },
  Crisis: {
    color: "#F87171",
    bg: "rgba(248,113,113,0.12)",
    border: "rgba(248,113,113,0.3)",
    emoji: "⛈️",
  },
  Integration: {
    color: "#A78BFA",
    bg: "rgba(167,139,250,0.12)",
    border: "rgba(167,139,250,0.3)",
    emoji: "🧭",
  },
  Mastery: {
    color: "#FBBF24",
    bg: "rgba(251,191,36,0.12)",
    border: "rgba(251,191,36,0.3)",
    emoji: "👑",
  },
};
const STAGE_ORDER = ["Awakening", "Growth", "Crisis", "Integration", "Mastery"];
const SOURCE_LABELS = {
  tarot_reading: { emoji: "🎴" },
  oracle_draw: { emoji: "🔮" },
  dream: { emoji: "😴" },
  life_event: { emoji: "📍" },
  "i-ching": { emoji: "☯️" },
  mood_log: { emoji: "💭" },
  mood: { emoji: "💭" },
  intention: { emoji: "✨" },
  ritual: { emoji: "🕯️" },
  moon_phase: { emoji: "🌙" },
  decision: { emoji: "⚖️" },
  astrology_transit: { emoji: "🪐" },
};

export default function InsightsScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState("compass");
  const [compass, setCompass] = useState(null);
  const [patterns, setPatterns] = useState(null);
  const [events, setEvents] = useState([]);
  const [symbols, setSymbols] = useState([]);
  const [insights, setInsights] = useState(null);
  const [traditions, setTraditions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [needsMore, setNeedsMore] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [compassRes, engineRes, insightsRes, symbolsRes, traditionsRes] =
        await Promise.all([
          fetch("/api/symbolpath/compass?userId=anonymous"),
          fetch("/api/symbolpath/engine?userId=anonymous&limit=30"),
          fetch("/api/symbolpath/insights?userId=anonymous"),
          fetch("/api/archetypes"),
          fetch("/api/traditions?userId=anonymous"),
        ]);
      const [
        compassData,
        engineData,
        insightsData,
        symbolsData,
        traditionsData,
      ] = await Promise.all([
        compassRes.json(),
        engineRes.json(),
        insightsRes.json(),
        symbolsRes.json(),
        traditionsRes.json(),
      ]);
      setCompass(compassData.compass);
      setNeedsMore(compassData.needsMore || engineData.needsMore);
      setPatterns(engineData.patterns);
      setEvents(engineData.events || []);
      setInsights(insightsData.insights);
      setTraditions(traditionsData.traditions || []);
      const raw = Array.isArray(symbolsData)
        ? symbolsData
        : symbolsData?.archetypes || [];
      setSymbols(raw);
    } catch (e) {
      console.error("SymbolPath load error:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const TABS = ["Compass", "Path", "Patterns", "Insights", "Traditions"];

  // Determine ambient color based on compass stage
  const ambientColor =
    compass?.currentStage === "Awakening"
      ? "96,165,250"
      : compass?.currentStage === "Growth"
        ? "52,211,153"
        : compass?.currentStage === "Crisis"
          ? "248,113,113"
          : compass?.currentStage === "Mastery"
            ? "251,191,36"
            : "139,92,246";

  return (
    <View
      style={{ flex: 1, backgroundColor: "#0A0614", paddingTop: insets.top }}
    >
      <StatusBar style="light" />
      {/* Subtle atmospheric glow — stage-responsive */}
      {!loading && compass?.currentStage && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 220,
            backgroundColor: `rgba(${ambientColor},0.035)`,
            borderBottomLeftRadius: 300,
            borderBottomRightRadius: 300,
          }}
          pointerEvents="none"
        />
      )}
      <View
        style={{
          backgroundColor: "#1C1332",
          borderBottomWidth: 1,
          borderBottomColor: "rgba(139,92,246,0.2)",
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: 0,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 14,
          }}
        >
          <View>
            <Text style={{ fontSize: 22, fontWeight: "800", color: "#E9D5FF" }}>
              🧭 SymbolPath
            </Text>
            <Text style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>
              A mirror, not a prophet.
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setShowModal(true)}
            activeOpacity={0.8}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              backgroundColor: "#7C3AED",
              borderRadius: 12,
              paddingHorizontal: 14,
              paddingVertical: 10,
            }}
          >
            <Plus size={14} color="#fff" />
            <Text style={{ color: "#fff", fontSize: 13, fontWeight: "700" }}>
              Log
            </Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ flexGrow: 0 }}
        >
          {TABS.map((tab) => {
            const active = activeTab === tab.toLowerCase();
            return (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab.toLowerCase())}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  marginRight: 4,
                  borderBottomWidth: 2,
                  borderBottomColor: active ? "#7C3AED" : "transparent",
                }}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: active ? "700" : "400",
                    color: active ? "#C4B5FD" : "#6B7280",
                  }}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {loading ? (
        <View style={{ flex: 1, padding: 20 }}>
          {/* Skeleton loading state */}
          <View
            style={{
              backgroundColor: "rgba(139,92,246,0.05)",
              borderWidth: 1,
              borderColor: "rgba(139,92,246,0.1)",
              borderRadius: 20,
              padding: 28,
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: "rgba(139,92,246,0.08)",
                marginBottom: 12,
              }}
            />
            <View
              style={{
                width: 120,
                height: 20,
                borderRadius: 8,
                backgroundColor: "rgba(139,92,246,0.08)",
                marginBottom: 8,
              }}
            />
            <View
              style={{
                width: 80,
                height: 12,
                borderRadius: 6,
                backgroundColor: "rgba(139,92,246,0.06)",
              }}
            />
          </View>
          <View
            style={{
              backgroundColor: "rgba(139,92,246,0.03)",
              borderWidth: 1,
              borderColor: "rgba(139,92,246,0.08)",
              borderRadius: 16,
              padding: 18,
              marginBottom: 12,
            }}
          >
            <View
              style={{
                width: 100,
                height: 10,
                borderRadius: 5,
                backgroundColor: "rgba(139,92,246,0.08)",
                marginBottom: 14,
              }}
            />
            <View
              style={{
                width: "90%",
                height: 12,
                borderRadius: 6,
                backgroundColor: "rgba(139,92,246,0.06)",
                marginBottom: 8,
              }}
            />
            <View
              style={{
                width: "70%",
                height: 12,
                borderRadius: 6,
                backgroundColor: "rgba(139,92,246,0.05)",
              }}
            />
          </View>
          <View
            style={{
              backgroundColor: "rgba(139,92,246,0.03)",
              borderWidth: 1,
              borderColor: "rgba(139,92,246,0.08)",
              borderRadius: 16,
              padding: 18,
            }}
          >
            <View
              style={{
                width: 100,
                height: 10,
                borderRadius: 5,
                backgroundColor: "rgba(139,92,246,0.08)",
                marginBottom: 14,
              }}
            />
            <View
              style={{
                width: "80%",
                height: 12,
                borderRadius: 6,
                backgroundColor: "rgba(139,92,246,0.06)",
                marginBottom: 8,
              }}
            />
            <View
              style={{
                width: "60%",
                height: 12,
                borderRadius: 6,
                backgroundColor: "rgba(139,92,246,0.05)",
              }}
            />
          </View>
        </View>
      ) : needsMore &&
        activeTab !== "path" &&
        activeTab !== "insights" &&
        activeTab !== "traditions" ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 32,
          }}
        >
          <Text style={{ fontSize: 56, marginBottom: 16 }}>🌱</Text>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "700",
              color: "#E9D5FF",
              textAlign: "center",
              marginBottom: 8,
            }}
          >
            Your journey begins
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: "#9B7FD4",
              textAlign: "center",
              lineHeight: 22,
              marginBottom: 24,
            }}
          >
            Complete a tarot reading or log a symbol to start your SymbolPath.
          </Text>
          <TouchableOpacity
            onPress={() => setShowModal(true)}
            activeOpacity={0.8}
            style={{
              backgroundColor: "#7C3AED",
              borderRadius: 12,
              paddingHorizontal: 24,
              paddingVertical: 14,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>
              Log First Symbol
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            padding: 20,
            paddingBottom: insets.bottom + 80,
          }}
          showsVerticalScrollIndicator={false}
        >
          {activeTab === "compass" && compass && (
            <CompassSection compass={compass} />
          )}
          {activeTab === "path" && <PathSection events={events} />}
          {activeTab === "patterns" && patterns && (
            <PatternsSection patterns={patterns} />
          )}
          {activeTab === "insights" && <InsightsSection insights={insights} />}
          {activeTab === "traditions" && (
            <TraditionsSection traditions={traditions} />
          )}
        </ScrollView>
      )}

      <LogModal
        symbols={symbols}
        visible={showModal}
        onClose={() => setShowModal(false)}
        onSave={() => {
          setShowModal(false);
          loadAll();
        }}
      />
    </View>
  );
}

function CompassSection({ compass }) {
  const sym = compass.currentSymbol;
  const cfg = STAGE_CONFIG[compass.currentStage] || STAGE_CONFIG.Integration;
  const stageIdx = STAGE_ORDER.indexOf(compass.currentStage);
  return (
    <View style={{ gap: 16 }}>
      <View
        style={{
          backgroundColor: cfg.bg,
          borderWidth: 1,
          borderColor: cfg.border,
          borderRadius: 20,
          padding: 28,
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 60, marginBottom: 8 }}>{sym.visual}</Text>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "800",
            color: cfg.color,
            marginBottom: 4,
          }}
        >
          {sym.symbol}
        </Text>
        <Text
          style={{
            fontSize: 12,
            color: "#9B7FD4",
            textTransform: "uppercase",
            letterSpacing: 1,
            marginBottom: 20,
          }}
        >
          {compass.currentStage} · {sym.theme}
        </Text>
        <View style={{ flexDirection: "row", gap: 10 }}>
          {STAGE_ORDER.map((s, i) => {
            const sc = STAGE_CONFIG[s];
            const active = s === compass.currentStage;
            return (
              <View key={s} style={{ alignItems: "center", gap: 3 }}>
                <View
                  style={{
                    width: active ? 14 : 8,
                    height: active ? 14 : 8,
                    borderRadius: 7,
                    backgroundColor:
                      i <= stageIdx ? sc.color : "rgba(255,255,255,0.08)",
                  }}
                />
                <Text
                  style={{
                    fontSize: 8,
                    color: active ? sc.color : "#374151",
                    fontWeight: active ? "700" : "400",
                  }}
                >
                  {s.slice(0, 3).toUpperCase()}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
      {sym.reflection_prompts?.length > 0 && (
        <View
          style={{
            backgroundColor: "rgba(255,255,255,0.03)",
            borderWidth: 1,
            borderColor: "rgba(139,92,246,0.2)",
            borderRadius: 16,
            padding: 18,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              marginBottom: 12,
            }}
          >
            <Eye size={14} color="#A78BFA" />
            <Text
              style={{
                fontSize: 11,
                fontWeight: "700",
                color: "#C4B5FD",
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              Mirror Prompts
            </Text>
          </View>
          {sym.reflection_prompts.map((p, i) => (
            <View
              key={i}
              style={{
                padding: 12,
                backgroundColor: "rgba(167,139,250,0.06)",
                borderRadius: 10,
                borderLeftWidth: 3,
                borderLeftColor: "#7C3AED",
                marginBottom: 8,
              }}
            >
              <Text
                style={{
                  color: "#E9D5FF",
                  fontSize: 14,
                  lineHeight: 22,
                  fontStyle: "italic",
                }}
              >
                {p}
              </Text>
            </View>
          ))}
        </View>
      )}
      {sym.action_prompts?.length > 0 && (
        <View
          style={{
            backgroundColor: "rgba(255,255,255,0.03)",
            borderWidth: 1,
            borderColor: "rgba(139,92,246,0.2)",
            borderRadius: 16,
            padding: 18,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              marginBottom: 12,
            }}
          >
            <Zap size={14} color="#FBBF24" />
            <Text
              style={{
                fontSize: 11,
                fontWeight: "700",
                color: "#FBBF24",
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              Invitations
            </Text>
          </View>
          {sym.action_prompts.map((a, i) => (
            <View
              key={i}
              style={{ flexDirection: "row", gap: 8, marginBottom: 8 }}
            >
              <Text style={{ color: "#FBBF24", fontSize: 14 }}>→</Text>
              <Text
                style={{
                  color: "#D1D5DB",
                  fontSize: 14,
                  lineHeight: 22,
                  flex: 1,
                }}
              >
                {a}
              </Text>
            </View>
          ))}
        </View>
      )}
      {sym.emotion_themes?.length > 0 && (
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {sym.emotion_themes.map((e, i) => (
            <View
              key={i}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 7,
                borderRadius: 20,
                backgroundColor: cfg.bg,
                borderWidth: 1,
                borderColor: cfg.border,
              }}
            >
              <Text style={{ color: cfg.color, fontSize: 13 }}>{e}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

function PathSection({ events }) {
  const sorted = [...events].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at),
  );
  return (
    <View>
      <Text
        style={{
          fontSize: 16,
          fontWeight: "700",
          color: "#E9D5FF",
          marginBottom: 4,
        }}
      >
        Symbol Stream
      </Text>
      <Text style={{ fontSize: 12, color: "#9B7FD4", marginBottom: 20 }}>
        {sorted.length} events recorded
      </Text>
      {sorted.length === 0 ? (
        <Text style={{ color: "#6B7280", textAlign: "center", padding: 40 }}>
          No events yet.
        </Text>
      ) : (
        <View style={{ gap: 10 }}>
          {sorted.map((ev, i) => {
            const cfg = STAGE_CONFIG[ev.stage] || STAGE_CONFIG.Integration;
            const src = SOURCE_LABELS[ev.source_type] || { emoji: "●" };
            const d = new Date(ev.created_at);
            const dateStr = isNaN(d)
              ? ""
              : d.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
            return (
              <View
                key={i}
                style={{
                  backgroundColor: cfg.bg,
                  borderWidth: 1,
                  borderColor: cfg.border,
                  borderRadius: 14,
                  padding: 14,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: ev.note ? 6 : 0,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <Text style={{ fontSize: 22 }}>{ev.visual}</Text>
                    <View>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: "700",
                          color: cfg.color,
                        }}
                      >
                        {ev.symbol}
                      </Text>
                      <Text style={{ fontSize: 11, color: "#6B7280" }}>
                        {ev.stage}
                      </Text>
                    </View>
                  </View>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text style={{ fontSize: 14 }}>{src.emoji}</Text>
                    <Text style={{ fontSize: 11, color: "#6B7280" }}>
                      {dateStr}
                    </Text>
                  </View>
                </View>
                {ev.note && (
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#9B7FD4",
                      fontStyle: "italic",
                      lineHeight: 18,
                    }}
                  >
                    {ev.note}
                  </Text>
                )}
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

function PatternsSection({ patterns }) {
  const total =
    Object.values(patterns.stageCounts || {}).reduce((a, b) => a + b, 0) || 1;
  return (
    <View style={{ gap: 16 }}>
      <View
        style={{
          backgroundColor: "rgba(167,139,250,0.1)",
          borderWidth: 1,
          borderColor: "rgba(167,139,250,0.3)",
          borderRadius: 16,
          padding: 20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            marginBottom: 10,
          }}
        >
          <Brain size={16} color="#A78BFA" />
          <Text
            style={{
              fontSize: 11,
              fontWeight: "700",
              color: "#C4B5FD",
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            Dominant Stage
          </Text>
        </View>
        <Text
          style={{
            fontSize: 22,
            fontWeight: "800",
            color: "#E9D5FF",
            marginBottom: 8,
          }}
        >
          {STAGE_CONFIG[patterns.dominantStage?.stage]?.emoji}{" "}
          {patterns.dominantStage?.stage}
        </Text>
        <Text
          style={{
            color: "#D1D5DB",
            fontSize: 13,
            lineHeight: 22,
            fontStyle: "italic",
          }}
        >
          {patterns.dominantStage?.insight}
        </Text>
      </View>
      {patterns.topSymbols?.length > 0 && (
        <View
          style={{
            backgroundColor: "rgba(255,255,255,0.03)",
            borderWidth: 1,
            borderColor: "rgba(139,92,246,0.2)",
            borderRadius: 16,
            padding: 16,
          }}
        >
          <Text
            style={{
              fontSize: 11,
              fontWeight: "700",
              color: "#C4B5FD",
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 12,
            }}
          >
            Recurring Symbols
          </Text>
          {patterns.topSymbols.map((sym, i) => {
            const cfg = STAGE_CONFIG[sym.stage] || STAGE_CONFIG.Integration;
            return (
              <View
                key={i}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                  padding: 10,
                  backgroundColor: cfg.bg,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: cfg.border,
                  marginBottom: 8,
                }}
              >
                <Text style={{ fontSize: 22 }}>{sym.visual}</Text>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "700",
                      color: cfg.color,
                    }}
                  >
                    {sym.symbol}
                  </Text>
                  <Text style={{ fontSize: 11, color: "#6B7280" }}>
                    {sym.stage}
                  </Text>
                </View>
                <Text
                  style={{ fontSize: 18, fontWeight: "800", color: cfg.color }}
                >
                  {sym.count}×
                </Text>
              </View>
            );
          })}
        </View>
      )}

      {/* Recurring Sequences */}
      {patterns.topPaths?.length > 0 && (
        <View
          style={{
            backgroundColor: "rgba(255,255,255,0.03)",
            borderWidth: 1,
            borderColor: "rgba(139,92,246,0.2)",
            borderRadius: 16,
            padding: 16,
          }}
        >
          <Text
            style={{
              fontSize: 11,
              fontWeight: "700",
              color: "#C4B5FD",
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 6,
            }}
          >
            Recurring Sequences
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: "#6B7280",
              marginBottom: 14,
              lineHeight: 18,
            }}
          >
            3-symbol arcs that repeat in your stream.
          </Text>
          {patterns.topPaths.map((seq, i) => {
            const symbolsList =
              seq.symbols || (seq.path ? seq.path.split(" → ") : []);
            const stagesList = seq.stages || [];
            const visualsList = seq.visuals || [];
            const arcLabel =
              stagesList.length === 3
                ? `${stagesList[0]} → ${stagesList[1]} → ${stagesList[2]}`
                : seq.path;
            return (
              <View
                key={i}
                style={{
                  padding: 14,
                  borderRadius: 14,
                  backgroundColor: "rgba(96,165,250,0.06)",
                  borderWidth: 1,
                  borderColor: "rgba(96,165,250,0.2)",
                  marginBottom: 10,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 10,
                  }}
                >
                  {symbolsList.map((sym, j) => {
                    const stage = stagesList[j];
                    const visual = visualsList[j];
                    const cfg = STAGE_CONFIG[stage] || STAGE_CONFIG.Integration;
                    return (
                      <View
                        key={j}
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <View
                          style={{
                            alignItems: "center",
                            gap: 3,
                            paddingVertical: 8,
                            paddingHorizontal: 12,
                            borderRadius: 10,
                            backgroundColor: cfg.bg,
                            borderWidth: 1,
                            borderColor: cfg.border,
                            minWidth: 60,
                          }}
                        >
                          <Text style={{ fontSize: 20 }}>
                            {visual || cfg.emoji}
                          </Text>
                          <Text
                            style={{
                              fontSize: 11,
                              fontWeight: "700",
                              color: cfg.color,
                            }}
                          >
                            {sym}
                          </Text>
                          <Text
                            style={{
                              fontSize: 8,
                              color: "#6B7280",
                              textTransform: "uppercase",
                            }}
                          >
                            {stage}
                          </Text>
                        </View>
                        {j < symbolsList.length - 1 && (
                          <Text
                            style={{
                              color: "#4B5563",
                              fontSize: 14,
                              marginHorizontal: 4,
                            }}
                          >
                            →
                          </Text>
                        )}
                      </View>
                    );
                  })}
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      color: "#9B7FD4",
                      fontStyle: "italic",
                    }}
                  >
                    {arcLabel}
                  </Text>
                  <View
                    style={{
                      backgroundColor: "rgba(96,165,250,0.1)",
                      paddingHorizontal: 8,
                      paddingVertical: 3,
                      borderRadius: 6,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 11,
                        fontWeight: "700",
                        color: "#60A5FA",
                      }}
                    >
                      {seq.count}× repeated
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      )}

      <View
        style={{
          backgroundColor: "rgba(255,255,255,0.03)",
          borderWidth: 1,
          borderColor: "rgba(139,92,246,0.2)",
          borderRadius: 16,
          padding: 16,
        }}
      >
        <Text
          style={{
            fontSize: 11,
            fontWeight: "700",
            color: "#C4B5FD",
            textTransform: "uppercase",
            letterSpacing: 1,
            marginBottom: 14,
          }}
        >
          Stage Distribution
        </Text>
        {STAGE_ORDER.map((stage) => {
          const count = patterns.stageCounts?.[stage] || 0;
          const pct = Math.round((count / total) * 100);
          const cfg = STAGE_CONFIG[stage];
          return (
            <View key={stage} style={{ marginBottom: 12 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 4,
                }}
              >
                <Text style={{ fontSize: 13, color: "#D1D5DB" }}>
                  {cfg.emoji} {stage}
                </Text>
                <Text
                  style={{ fontSize: 13, color: cfg.color, fontWeight: "600" }}
                >
                  {pct}%
                </Text>
              </View>
              <View
                style={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: "rgba(255,255,255,0.06)",
                }}
              >
                <View
                  style={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: cfg.color,
                    width: `${pct}%`,
                  }}
                />
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

function InsightsSection({ insights }) {
  const narrative = insights?.weeklyNarrative || {
    title: "Your Week in Symbols",
    narrative: "Log more events to reveal your weekly pattern.",
    invitation: "What symbol feels most alive right now?",
    practice: "Sit with one symbol for five minutes.",
  };
  const stage = insights?.weeklyDominantStage || "Integration";
  const cfg = STAGE_CONFIG[stage] || STAGE_CONFIG.Integration;
  return (
    <View style={{ gap: 16 }}>
      <View
        style={{
          backgroundColor: cfg.bg,
          borderWidth: 1,
          borderColor: cfg.border,
          borderRadius: 20,
          padding: 24,
        }}
      >
        <Text
          style={{
            fontSize: 11,
            color: "#9B7FD4",
            textTransform: "uppercase",
            letterSpacing: 1,
            marginBottom: 6,
          }}
        >
          This Week · {stage}
        </Text>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "800",
            color: cfg.color,
            marginBottom: 12,
          }}
        >
          {narrative.title}
        </Text>
        <Text
          style={{
            color: "#E9D5FF",
            fontSize: 14,
            lineHeight: 24,
            fontStyle: "italic",
            marginBottom: 16,
          }}
        >
          {narrative.narrative}
        </Text>
        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: cfg.border,
            paddingTop: 14,
            gap: 10,
          }}
        >
          <View style={{ flexDirection: "row", gap: 8 }}>
            <Eye size={14} color="#A78BFA" />
            <Text
              style={{
                color: "#D1D5DB",
                fontSize: 13,
                flex: 1,
                lineHeight: 20,
                fontStyle: "italic",
              }}
            >
              {narrative.invitation}
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <Zap size={14} color="#FBBF24" />
            <Text
              style={{
                color: "#D1D5DB",
                fontSize: 13,
                flex: 1,
                lineHeight: 20,
              }}
            >
              {narrative.practice}
            </Text>
          </View>
        </View>
      </View>
      {insights?.stageShift && (
        <View
          style={{
            backgroundColor: "rgba(251,191,36,0.08)",
            borderWidth: 1,
            borderColor: "rgba(251,191,36,0.25)",
            borderRadius: 14,
            padding: 16,
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Text style={{ fontSize: 22 }}>🔄</Text>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 13, fontWeight: "700", color: "#FBBF24" }}>
              Stage Shift Detected
            </Text>
            <Text style={{ fontSize: 13, color: "#D1D5DB", marginTop: 2 }}>
              {insights.stageShift.from} → {insights.stageShift.to}
            </Text>
          </View>
        </View>
      )}
      {insights?.topWeeklySymbols?.length > 0 && (
        <View
          style={{
            backgroundColor: "rgba(255,255,255,0.03)",
            borderWidth: 1,
            borderColor: "rgba(139,92,246,0.2)",
            borderRadius: 16,
            padding: 16,
          }}
        >
          <Text
            style={{
              fontSize: 11,
              fontWeight: "700",
              color: "#C4B5FD",
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 12,
            }}
          >
            Symbols This Week
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
            {insights.topWeeklySymbols.map((s, i) => {
              const sc = STAGE_CONFIG[s.stage] || STAGE_CONFIG.Integration;
              return (
                <View
                  key={i}
                  style={{
                    alignItems: "center",
                    gap: 4,
                    padding: 12,
                    borderRadius: 12,
                    backgroundColor: sc.bg,
                    borderWidth: 1,
                    borderColor: sc.border,
                  }}
                >
                  <Text style={{ fontSize: 22 }}>{s.visual}</Text>
                  <Text
                    style={{ fontSize: 11, fontWeight: "700", color: sc.color }}
                  >
                    {s.symbol}
                  </Text>
                  <Text style={{ fontSize: 10, color: "#6B7280" }}>
                    {s.count}×
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
}

function TraditionsSection({ traditions }) {
  const [selectedTradition, setSelectedTradition] = useState(null);

  useEffect(() => {
    if (traditions.length > 0 && !selectedTradition) {
      setSelectedTradition(traditions[0]);
    }
  }, [traditions, selectedTradition]);

  if (traditions.length === 0) {
    return (
      <View style={{ alignItems: "center", paddingVertical: 40 }}>
        <Text style={{ fontSize: 48, marginBottom: 16 }}>🌍</Text>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "700",
            color: "#E9D5FF",
            marginBottom: 8,
          }}
        >
          Traditions Loading...
        </Text>
        <Text style={{ fontSize: 13, color: "#9B7FD4", textAlign: "center" }}>
          Interpreting your journey through multiple wisdom lenses.
        </Text>
      </View>
    );
  }

  const getTraditionIcon = (slug) => {
    const icons = {
      western: "✨",
      ubuntu: "❤️",
      medicine_wheel: "🧭",
      neidan: "💧",
      sufi_nafs: "🌍",
    };
    return icons[slug] || "✨";
  };

  return (
    <View style={{ gap: 16 }}>
      {/* Tradition Selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ flexGrow: 0 }}
      >
        {traditions.map((tradition) => {
          const isSelected = selectedTradition?.id === tradition.id;
          const hasData = tradition.userPosition.totalEvents > 0;
          return (
            <TouchableOpacity
              key={tradition.id}
              onPress={() => setSelectedTradition(tradition)}
              activeOpacity={0.7}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderRadius: 14,
                marginRight: 10,
                backgroundColor: isSelected
                  ? "rgba(124,58,237,0.3)"
                  : "rgba(255,255,255,0.03)",
                borderWidth: 1,
                borderColor: isSelected ? "#7C3AED" : "rgba(139,92,246,0.2)",
                minWidth: 100,
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 24, marginBottom: 4 }}>
                {getTraditionIcon(tradition.slug)}
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: isSelected ? "700" : "400",
                  color: isSelected ? "#C4B5FD" : "#9B7FD4",
                  textAlign: "center",
                }}
              >
                {tradition.name
                  .replace(" Relational Pulse", "")
                  .replace(" Progression", "")
                  .replace(" Ladder", "")}
              </Text>
              {hasData && (
                <Text style={{ fontSize: 9, color: "#7C3AED", marginTop: 2 }}>
                  {tradition.userPosition.totalEvents} events
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Selected Tradition Detail */}
      {selectedTradition && (
        <View>
          {/* Tradition Header */}
          <View
            style={{
              backgroundColor: "rgba(124,58,237,0.15)",
              borderWidth: 1,
              borderColor: "rgba(124,58,237,0.3)",
              borderRadius: 16,
              padding: 20,
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "800",
                color: "#E9D5FF",
                marginBottom: 8,
              }}
            >
              {selectedTradition.name}
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: "#D1D5DB",
                lineHeight: 20,
                marginBottom: 12,
              }}
            >
              {selectedTradition.description}
            </Text>
            {selectedTradition.metadata?.origin && (
              <Text style={{ fontSize: 11, color: "#9B7FD4" }}>
                Origin: {selectedTradition.metadata.origin}
              </Text>
            )}
            {selectedTradition.userPosition.dominantStageData && (
              <View
                style={{
                  marginTop: 14,
                  paddingTop: 14,
                  borderTopWidth: 1,
                  borderTopColor: "rgba(139,92,246,0.3)",
                }}
              >
                <Text
                  style={{ fontSize: 10, color: "#9B7FD4", marginBottom: 4 }}
                >
                  YOUR CURRENT POSITION
                </Text>
                <Text
                  style={{ fontSize: 16, fontWeight: "800", color: "#C4B5FD" }}
                >
                  {selectedTradition.userPosition.dominantStageData.name}
                </Text>
                <Text style={{ fontSize: 12, color: "#D1D5DB", marginTop: 2 }}>
                  {selectedTradition.userPosition.dominantStageData.description}
                </Text>
              </View>
            )}
          </View>

          {/* Stage Journey */}
          {selectedTradition.userPosition.totalEvents === 0 ? (
            <View style={{ alignItems: "center", paddingVertical: 32 }}>
              <Text style={{ fontSize: 48, marginBottom: 12 }}>🌱</Text>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "700",
                  color: "#E9D5FF",
                  marginBottom: 6,
                }}
              >
                No Journey Data Yet
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  color: "#9B7FD4",
                  textAlign: "center",
                  paddingHorizontal: 20,
                }}
              >
                Complete readings or log symbols to see your position in this
                tradition.
              </Text>
            </View>
          ) : (
            <View style={{ gap: 10 }}>
              {selectedTradition.stages.map((stage) => {
                const distribution =
                  selectedTradition.userPosition.stageDistribution[stage.key];
                const count = distribution?.count || 0;
                const percentage = distribution?.percentage || 0;
                const isActive = count > 0;
                const isDominant =
                  selectedTradition.userPosition.dominantStage === stage.key;

                return (
                  <View
                    key={stage.key}
                    style={{
                      backgroundColor: isDominant
                        ? "rgba(124,58,237,0.15)"
                        : isActive
                          ? "rgba(255,255,255,0.03)"
                          : "rgba(0,0,0,0.2)",
                      borderWidth: 1,
                      borderColor: isDominant
                        ? "#7C3AED"
                        : isActive
                          ? "rgba(139,92,246,0.2)"
                          : "rgba(107,114,128,0.2)",
                      borderRadius: 12,
                      padding: 14,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginBottom: 8,
                      }}
                    >
                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "700",
                            color: stage.color || "#E9D5FF",
                          }}
                        >
                          {stage.name}
                        </Text>
                        <Text
                          style={{
                            fontSize: 11,
                            color: "#9B7FD4",
                            marginTop: 2,
                          }}
                        >
                          {stage.description}
                        </Text>
                      </View>
                      {isActive && (
                        <View style={{ alignItems: "flex-end" }}>
                          <Text
                            style={{
                              fontSize: 18,
                              fontWeight: "800",
                              color: "#7C3AED",
                            }}
                          >
                            {percentage}%
                          </Text>
                          <Text style={{ fontSize: 10, color: "#6B7280" }}>
                            {count} symbols
                          </Text>
                        </View>
                      )}
                    </View>
                    {isActive && (
                      <View
                        style={{
                          height: 4,
                          backgroundColor: "rgba(255,255,255,0.08)",
                          borderRadius: 2,
                        }}
                      >
                        <View
                          style={{
                            height: 4,
                            backgroundColor: stage.color || "#7C3AED",
                            borderRadius: 2,
                            width: `${percentage}%`,
                          }}
                        />
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          )}
        </View>
      )}
    </View>
  );
}

function LogModal({ symbols, visible, onClose, onSave }) {
  const insets = useSafeAreaInsets();
  const [sourceType, setSourceType] = useState("dream");
  const [selectedSymbol, setSelectedSymbol] = useState(null);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const grouped = STAGE_ORDER.reduce((acc, stage) => {
    acc[stage] = symbols.filter((s) => s.stage === stage);
    return acc;
  }, {});

  const sourceOpts = [
    { value: "dream", label: "Dream", emoji: "😴" },
    { value: "life_event", label: "Life Event", emoji: "📍" },
    { value: "i-ching", label: "I‑Ching", emoji: "☯️" },
    { value: "mood_log", label: "Mood", emoji: "💭" },
    { value: "intention", label: "Intention", emoji: "✨" },
    { value: "ritual", label: "Ritual", emoji: "🕯️" },
    { value: "oracle_draw", label: "Oracle", emoji: "🔮" },
    { value: "astrology_transit", label: "Transit", emoji: "🪐" },
  ];

  const handleSave = async () => {
    if (!selectedSymbol) return;
    setSaving(true);
    try {
      const res = await fetch("/api/symbolpath/engine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "anonymous",
          sourceType,
          symbolId: selectedSymbol.id,
          note: note.trim() || null,
        }),
      });
      if (res.ok) {
        onSave();
        setSelectedSymbol(null);
        setNote("");
      } else Alert.alert("Error", "Could not save.");
    } catch {
      Alert.alert("Error", "Could not save.");
    }
    setSaving(false);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          backgroundColor: "rgba(0,0,0,0.7)",
        }}
      >
        <KeyboardAvoidingAnimatedView behavior="padding">
          <View
            style={{
              backgroundColor: "#1C1332",
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: 24,
              paddingBottom: insets.bottom + 24,
              borderWidth: 1,
              borderColor: "rgba(139,92,246,0.3)",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 4,
              }}
            >
              <Text
                style={{ fontSize: 18, fontWeight: "800", color: "#E9D5FF" }}
              >
                Log a Symbol
              </Text>
              <TouchableOpacity onPress={onClose}>
                <X size={20} color="#9B7FD4" />
              </TouchableOpacity>
            </View>
            <Text style={{ fontSize: 13, color: "#9B7FD4", marginBottom: 20 }}>
              Capture a symbol from a dream, event, or feeling.
            </Text>

            <Text
              style={{
                fontSize: 10,
                color: "#9B7FD4",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: 1,
                marginBottom: 8,
              }}
            >
              Source
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ flexGrow: 0, marginBottom: 20 }}
            >
              {sourceOpts.map((opt) => (
                <TouchableOpacity
                  key={opt.value}
                  onPress={() => setSourceType(opt.value)}
                  activeOpacity={0.7}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                    borderRadius: 20,
                    marginRight: 8,
                    backgroundColor:
                      sourceType === opt.value
                        ? "rgba(124,58,237,0.3)"
                        : "rgba(255,255,255,0.03)",
                    borderWidth: 1,
                    borderColor:
                      sourceType === opt.value
                        ? "#7C3AED"
                        : "rgba(139,92,246,0.2)",
                  }}
                >
                  <Text style={{ fontSize: 14 }}>{opt.emoji}</Text>
                  <Text
                    style={{
                      fontSize: 13,
                      color: sourceType === opt.value ? "#C4B5FD" : "#9B7FD4",
                      fontWeight: sourceType === opt.value ? "700" : "400",
                    }}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text
              style={{
                fontSize: 10,
                color: "#9B7FD4",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: 1,
                marginBottom: 10,
              }}
            >
              Symbol
            </Text>
            <ScrollView
              style={{ maxHeight: 180, marginBottom: 14 }}
              showsVerticalScrollIndicator={false}
            >
              {STAGE_ORDER.map((stage) => {
                const stageSyms = grouped[stage] || [];
                if (!stageSyms.length) return null;
                const sc = STAGE_CONFIG[stage];
                return (
                  <View key={stage} style={{ marginBottom: 10 }}>
                    <Text
                      style={{
                        fontSize: 9,
                        color: sc.color,
                        fontWeight: "700",
                        textTransform: "uppercase",
                        marginBottom: 6,
                      }}
                    >
                      {sc.emoji} {stage}
                    </Text>
                    <View
                      style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}
                    >
                      {stageSyms.map((sym) => (
                        <TouchableOpacity
                          key={sym.id}
                          onPress={() => setSelectedSymbol(sym)}
                          activeOpacity={0.7}
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 4,
                            paddingHorizontal: 10,
                            paddingVertical: 6,
                            borderRadius: 10,
                            backgroundColor:
                              selectedSymbol?.id === sym.id
                                ? sc.bg
                                : "rgba(255,255,255,0.02)",
                            borderWidth: 1,
                            borderColor:
                              selectedSymbol?.id === sym.id
                                ? sc.color
                                : "rgba(139,92,246,0.15)",
                          }}
                        >
                          <Text style={{ fontSize: 13 }}>{sym.visual}</Text>
                          <Text
                            style={{
                              fontSize: 12,
                              color:
                                selectedSymbol?.id === sym.id
                                  ? sc.color
                                  : "#9B7FD4",
                              fontWeight:
                                selectedSymbol?.id === sym.id ? "700" : "400",
                            }}
                          >
                            {sym.symbol}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                );
              })}
            </ScrollView>

            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder="Optional note…"
              placeholderTextColor="#4B5563"
              multiline
              style={{
                backgroundColor: "rgba(255,255,255,0.03)",
                borderWidth: 1,
                borderColor: "rgba(139,92,246,0.25)",
                borderRadius: 10,
                color: "#E9D5FF",
                fontSize: 14,
                padding: 12,
                minHeight: 56,
                marginBottom: 18,
                lineHeight: 20,
              }}
            />

            <TouchableOpacity
              onPress={handleSave}
              disabled={!selectedSymbol || saving}
              activeOpacity={0.8}
              style={{
                padding: 14,
                borderRadius: 14,
                backgroundColor: selectedSymbol
                  ? "#7C3AED"
                  : "rgba(124,58,237,0.2)",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: selectedSymbol ? "#fff" : "#6B7280",
                  fontWeight: "700",
                  fontSize: 15,
                }}
              >
                {saving ? "Saving…" : "Log Symbol"}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingAnimatedView>
      </View>
    </Modal>
  );
}
