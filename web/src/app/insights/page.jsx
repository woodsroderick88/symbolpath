import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronLeft,
  RefreshCw,
  Eye,
  Layers,
  Wind,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Visual Language Constants (from stageConfig)
// ─────────────────────────────────────────────────────────────────────────────
const STAGE = {
  Awakening: {
    color: "#60A5FA",
    bg: "rgba(96,165,250,0.08)",
    border: "rgba(96,165,250,0.25)",
    emoji: "🌅",
    tagline: "The first light",
  },
  Growth: {
    color: "#34D399",
    bg: "rgba(52,211,153,0.08)",
    border: "rgba(52,211,153,0.25)",
    emoji: "🌿",
    tagline: "Roots deepening",
  },
  Crisis: {
    color: "#F87171",
    bg: "rgba(248,113,113,0.08)",
    border: "rgba(248,113,113,0.25)",
    emoji: "⛈️",
    tagline: "The storm",
  },
  Integration: {
    color: "#A78BFA",
    bg: "rgba(167,139,250,0.08)",
    border: "rgba(167,139,250,0.25)",
    emoji: "🧭",
    tagline: "Weaving meaning",
  },
  Mastery: {
    color: "#FBBF24",
    bg: "rgba(251,191,36,0.08)",
    border: "rgba(251,191,36,0.25)",
    emoji: "👑",
    tagline: "The crown",
  },
};

const OBS_VISUAL = {
  convergence: { emoji: "🎯", color: "#F59E0B", label: "Convergence" },
  shadow_growth: { emoji: "🌗", color: "#8B5CF6", label: "Shadow / Growth" },
  shadow_summary: { emoji: "🌑", color: "#6B21A8", label: "Shadow Field" },
  growth_summary: { emoji: "🌕", color: "#059669", label: "Growth Field" },
  threshold: { emoji: "⚡", color: "#EF4444", label: "Threshold" },
  momentum: { emoji: "🚀", color: "#3B82F6", label: "Momentum" },
  regression_context: { emoji: "🌀", color: "#EC4899", label: "Regression" },
  constellation: { emoji: "✨", color: "#6366F1", label: "Constellation" },
  transition: { emoji: "🔄", color: "#14B8A6", label: "Transition" },
  absence: { emoji: "🌑", color: "#6B7280", label: "Absence" },
};

const WEATHER_VIS = {
  Stormy: {
    emoji: "⛈️",
    gradient: "linear-gradient(135deg, #FEE2E2, #FECACA)",
    color: "#DC2626",
  },
  Dawning: {
    emoji: "🌅",
    gradient: "linear-gradient(135deg, #DBEAFE, #BFDBFE)",
    color: "#2563EB",
  },
  Growing: {
    emoji: "🌿",
    gradient: "linear-gradient(135deg, #D1FAE5, #A7F3D0)",
    color: "#059669",
  },
  Clearing: {
    emoji: "🌈",
    gradient: "linear-gradient(135deg, #EDE9FE, #DDD6FE)",
    color: "#7C3AED",
  },
  Radiant: {
    emoji: "☀️",
    gradient: "linear-gradient(135deg, #FEF3C7, #FDE68A)",
    color: "#D97706",
  },
  Shifting: {
    emoji: "🌊",
    gradient: "linear-gradient(135deg, #E0E7FF, #C7D2FE)",
    color: "#4F46E5",
  },
  Building: {
    emoji: "🌤️",
    gradient: "linear-gradient(135deg, #FEF3C7, #FDE68A)",
    color: "#B45309",
  },
  Turbulent: {
    emoji: "🌪️",
    gradient: "linear-gradient(135deg, #F3F4F6, #D1D5DB)",
    color: "#4B5563",
  },
  Still: {
    emoji: "🌫️",
    gradient: "linear-gradient(135deg, #F9FAFB, #F3F4F6)",
    color: "#9CA3AF",
  },
  Mixed: {
    emoji: "🌤️",
    gradient: "linear-gradient(135deg, #EFF6FF, #ECFDF5)",
    color: "#6B7280",
  },
};

const stg = (stage) => STAGE[stage] || STAGE.Growth;
const obsV = (type) =>
  OBS_VISUAL[type] || { emoji: "•", color: "#6B7280", label: type };
const weaV = (cond) => WEATHER_VIS[cond] || WEATHER_VIS.Mixed;

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────
export default function SymbolicMirrorPage() {
  const [expandedForces, setExpandedForces] = useState(true);
  const [expandedPatterns, setExpandedPatterns] = useState(false);

  // Fetch reasoning data — API routes handle auth internally
  const {
    data: reasoning,
    isLoading: loadingR,
    refetch: refetchR,
  } = useQuery({
    queryKey: ["symbolpath-reasoning"],
    queryFn: async () => {
      const res = await fetch("/api/symbolpath/reasoning?limit=30");
      if (!res.ok) throw new Error("Failed to load reasoning");
      return res.json();
    },
  });

  // Fetch longitudinal data
  const { data: longitudinal, isLoading: loadingL } = useQuery({
    queryKey: ["symbolpath-longitudinal"],
    queryFn: async () => {
      const res = await fetch("/api/symbolpath/longitudinal");
      if (!res.ok) throw new Error("Failed to load longitudinal");
      return res.json();
    },
  });

  const loading = loadingR || loadingL;

  // ── Categorize observations into temporal layers ──
  const layers = useMemo(() => {
    if (!reasoning?.observations)
      return {
        currentWeather: [],
        activePatterns: [],
        longCycles: [],
        deepArchetypes: [],
      };

    const obs = reasoning.observations;

    // LAYER 1: Current Weather — temporary conditions happening right now
    // Includes: convergences (permanence=weather), current shadow/growth expressions (permanence=weather)
    const currentWeather = obs.filter(
      (o) =>
        o.permanence === "weather" ||
        o.type === "convergence" ||
        (o.type === "shadow_growth" &&
          !o.anchored &&
          o.permanence === "weather"),
    );

    // LAYER 2: Active Patterns — recurring dynamics currently active
    // Includes: transitions (permanence=pattern), momentum (permanence=pattern), thresholds (permanence=threshold), regressions (permanence=threshold)
    const activePatterns = obs.filter(
      (o) => o.permanence === "pattern" || o.permanence === "threshold",
    );

    // LAYER 3: Long Cycles — from longitudinal engine
    // This comes from the longitudinal API response, not reasoning observations
    const longCycles = [];
    if (longitudinal?.cycles) {
      longCycles.push(...longitudinal.cycles.slice(0, 3));
    }
    if (longitudinal?.suppressions) {
      longCycles.push(...longitudinal.suppressions.slice(0, 2));
    }

    // LAYER 4: Deep Archetypes — stabilizing and defining forces
    // Includes: anchors (permanence=anchor), scars (permanence=scar), constellations (permanence=constellation)
    const deepArchetypes = obs.filter(
      (o) =>
        o.permanence === "anchor" ||
        o.permanence === "scar" ||
        o.permanence === "constellation",
    );

    return { currentWeather, activePatterns, longCycles, deepArchetypes };
  }, [reasoning, longitudinal]);

  const coex = reasoning?.coexistence;
  const weather = longitudinal?.weather;
  const cycles = longitudinal?.cycles;
  const suppressions = longitudinal?.suppressions;

  const isEmpty = !reasoning || reasoning.needsMore;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0F0A1E",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px 100px" }}
      >
        {/* ── Back ── */}
        <a
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontSize: 13,
            color: "#9B7FD4",
            textDecoration: "none",
            marginBottom: 32,
          }}
        >
          <ChevronLeft size={15} /> Back
        </a>

        {/* ── Header ── */}
        <div style={{ marginBottom: 40 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <h1
                style={{
                  margin: "0 0 6px",
                  fontSize: 28,
                  fontWeight: 700,
                  color: "#E9D5FF",
                }}
              >
                Symbolic Mirror
              </h1>
              <p
                style={{
                  margin: 0,
                  fontSize: 14,
                  color: "#7C6FA0",
                  lineHeight: 1.6,
                }}
              >
                Your symbolic field, organized by temporal weight.
              </p>
            </div>
            <button
              onClick={() => refetchR()}
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                border: "1px solid rgba(139,92,246,0.2)",
                background: "transparent",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#9B7FD4",
              }}
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>

        {/* ── Loading ── */}
        {loading && (
          <div style={{ padding: "40px 0" }}>
            {/* Skeleton: Weather banner */}
            <div
              style={{
                borderRadius: 16,
                padding: "24px",
                background:
                  "linear-gradient(135deg, rgba(139,92,246,0.04), rgba(96,165,250,0.03))",
                marginBottom: 20,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: "rgba(139,92,246,0.08)",
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      width: 120,
                      height: 16,
                      borderRadius: 8,
                      background: "rgba(139,92,246,0.08)",
                      marginBottom: 8,
                    }}
                  />
                  <div
                    style={{
                      width: "80%",
                      height: 12,
                      borderRadius: 6,
                      background: "rgba(139,92,246,0.05)",
                    }}
                  />
                </div>
              </div>
            </div>
            {/* Skeleton: Observation cards */}
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  borderRadius: 14,
                  padding: "18px 22px",
                  marginBottom: 12,
                  background: "rgba(139,92,246,0.02)",
                  border: "1px solid rgba(139,92,246,0.06)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 10,
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: "rgba(139,92,246,0.08)",
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        width: 160,
                        height: 14,
                        borderRadius: 7,
                        background: "rgba(139,92,246,0.07)",
                        marginBottom: 6,
                      }}
                    />
                    <div
                      style={{
                        width: "70%",
                        height: 10,
                        borderRadius: 5,
                        background: "rgba(139,92,246,0.04)",
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
            {/* Skeleton: Stage dynamics */}
            <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
              <div
                style={{
                  flex: 1,
                  borderRadius: 14,
                  padding: "20px",
                  background: "rgba(139,92,246,0.02)",
                  border: "1px solid rgba(139,92,246,0.06)",
                }}
              >
                <div
                  style={{
                    width: 80,
                    height: 10,
                    borderRadius: 5,
                    background: "rgba(139,92,246,0.06)",
                    marginBottom: 12,
                  }}
                />
                <div
                  style={{
                    width: 60,
                    height: 24,
                    borderRadius: 8,
                    background: "rgba(139,92,246,0.08)",
                    marginBottom: 8,
                  }}
                />
                <div
                  style={{
                    width: "100%",
                    height: 10,
                    borderRadius: 5,
                    background: "rgba(139,92,246,0.04)",
                  }}
                />
              </div>
              <div
                style={{
                  flex: 1,
                  borderRadius: 14,
                  padding: "20px",
                  background: "rgba(139,92,246,0.02)",
                  border: "1px solid rgba(139,92,246,0.06)",
                }}
              >
                <div
                  style={{
                    width: 80,
                    height: 10,
                    borderRadius: 5,
                    background: "rgba(139,92,246,0.06)",
                    marginBottom: 12,
                  }}
                />
                <div
                  style={{
                    width: 60,
                    height: 24,
                    borderRadius: 8,
                    background: "rgba(139,92,246,0.08)",
                    marginBottom: 8,
                  }}
                />
                <div
                  style={{
                    width: "100%",
                    height: 10,
                    borderRadius: 5,
                    background: "rgba(139,92,246,0.04)",
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* ── Empty state ── */}
        {!loading && isEmpty && (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <Eye size={48} style={{ color: "#4B5563", marginBottom: 16 }} />
            <h2 style={{ color: "#E9D5FF", fontSize: 22, marginBottom: 8 }}>
              The mirror is waiting
            </h2>
            <p
              style={{
                color: "#9B7FD4",
                maxWidth: 440,
                margin: "0 auto",
                lineHeight: 1.7,
              }}
            >
              Record readings, dreams, moods, or life events. The reasoning
              engine activates once it has enough symbolic material to work
              with.
            </p>
          </div>
        )}

        {!loading && !isEmpty && (
          <>
            {/* ═══════════════════════════════════════════════════════════════
                LAYER 1 — CURRENT WEATHER
                What's happening right now. Temporary conditions.
               ═══════════════════════════════════════════════════════════════ */}
            {(layers.currentWeather.length > 0 || weather?.current) && (
              <TemporalLayer
                title="Current Weather"
                emoji="🌤️"
                subtitle="What's happening right now"
                description="Temporary conditions active in this moment. These are the immediate signals — convergences, current states, this week's atmosphere."
                observations={layers.currentWeather}
                weather={weather}
              />
            )}

            {/* ═══════════════════════════════════════════════════════════════
                LAYER 2 — ACTIVE PATTERNS
                Recurring dynamics currently in motion.
               ═══════════════════════════════════════════════════════════════ */}
            {layers.activePatterns.length > 0 && (
              <TemporalLayer
                title="Active Patterns"
                emoji="🔄"
                subtitle="Recurring dynamics in motion"
                description="Transitions, momentum shifts, thresholds crossing. These patterns are active right now and carry forward motion."
                observations={layers.activePatterns}
              />
            )}

            {/* ═══════════════════════════════════════════════════════════════
                LAYER 3 — LONG CYCLES
                Patterns spanning weeks and months.
               ═══════════════════════════════════════════════════════════════ */}
            {layers.longCycles.length > 0 && (
              <LongCyclesLayer cycles={layers.longCycles} />
            )}

            {/* ═══════════════════════════════════════════════════════════════
                LAYER 4 — DEEP ARCHETYPES
                The stabilizing and defining forces.
                Always shown — even when empty — to prime users for depth.
               ═══════════════════════════════════════════════════════════════ */}
            {layers.deepArchetypes.length > 0 ? (
              <TemporalLayer
                title="Deep Archetypes"
                emoji="⚓"
                subtitle="Stabilizing and defining forces"
                description="Anchored symbols, persistent scars, and constellations. These are the enduring patterns that shape your symbolic identity."
                observations={layers.deepArchetypes}
              />
            ) : (
              <DeepArchetypesEmpty />
            )}

            {/* ── Stage Dynamics (optional, can remain) ── */}
            {coex && <StageDynamics coexistence={coex} />}

            {/* ── Tone footer ── */}
            {reasoning?.summary && (
              <div
                style={{
                  textAlign: "center",
                  marginTop: 40,
                  paddingTop: 24,
                  borderTop: "1px solid rgba(139,92,246,0.1)",
                }}
              >
                <p
                  style={{
                    fontSize: 12,
                    color: "#6B7280",
                    letterSpacing: "0.05em",
                  }}
                >
                  {reasoning.summary.total} observations · Field tone:{" "}
                  <span
                    style={{
                      color:
                        reasoning.summary.overallTone === "urgent"
                          ? "#F87171"
                          : reasoning.summary.overallTone === "active"
                            ? "#FBBF24"
                            : reasoning.summary.overallTone === "contemplative"
                              ? "#A78BFA"
                              : "#34D399",
                    }}
                  >
                    {reasoning.summary.overallTone}
                  </span>
                  {reasoning.temporal && (
                    <span>
                      {" "}
                      · Confidence:{" "}
                      <span
                        style={{
                          color:
                            reasoning.temporal.confidence === "high"
                              ? "#34D399"
                              : reasoning.temporal.confidence === "medium"
                                ? "#FBBF24"
                                : "#9CA3AF",
                        }}
                      >
                        {reasoning.temporal.confidence}
                      </span>{" "}
                      ({reasoning.temporal.ageDays}d /{" "}
                      {reasoning.temporal.distinctDays} days)
                    </span>
                  )}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      <style jsx global>{`
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(139,92,246,0.15); }
          50% { box-shadow: 0 0 40px rgba(139,92,246,0.3); }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEMPORAL LAYER
//
// A collapsible section representing one temporal layer.
// Contains observations of similar permanence/temporal weight.
// ═══════════════════════════════════════════════════════════════════════════════
function TemporalLayer({
  title,
  emoji,
  subtitle,
  description,
  observations,
  weather,
}) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div style={{ marginBottom: 32 }}>
      {/* Layer header */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 0",
          background: "none",
          border: "none",
          borderBottom: "1px solid rgba(139,92,246,0.15)",
          cursor: "pointer",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 24 }}>{emoji}</span>
          <div style={{ textAlign: "left" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <h2
                style={{
                  margin: 0,
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#E9D5FF",
                  letterSpacing: "-0.01em",
                }}
              >
                {title}
              </h2>
              <span
                style={{
                  fontSize: 11,
                  color: "#6B7280",
                  fontWeight: 400,
                }}
              >
                {observations?.length || 0} signal
                {observations?.length !== 1 ? "s" : ""}
              </span>
            </div>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: "#7C6FA0" }}>
              {subtitle}
            </p>
          </div>
        </div>
        {expanded ? (
          <ChevronUp size={18} color="#9B7FD4" />
        ) : (
          <ChevronDown size={18} color="#9B7FD4" />
        )}
      </button>

      {expanded && (
        <div style={{ paddingTop: 20 }}>
          {/* Layer description */}
          <p
            style={{
              margin: "0 0 20px",
              fontSize: 13,
              color: "#9B7FD4",
              lineHeight: 1.7,
              fontStyle: "italic",
            }}
          >
            {description}
          </p>

          {/* Weather banner (if provided) */}
          {weather?.current && <WeatherBanner weather={weather} />}

          {/* Observations */}
          {observations && observations.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {observations.map((obs, i) => (
                <ObservationCard key={i} observation={obs} />
              ))}
            </div>
          )}

          {observations && observations.length === 0 && !weather && (
            <p style={{ fontSize: 13, color: "#6B7280", fontStyle: "italic" }}>
              No active signals in this layer.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// LONG CYCLES LAYER
//
// Special layer for longitudinal patterns (cycles and suppressions).
// ═══════════════════════════════════════════════════════════════════════════════
function LongCyclesLayer({ cycles }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div style={{ marginBottom: 32 }}>
      {/* Layer header */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 0",
          background: "none",
          border: "none",
          borderBottom: "1px solid rgba(139,92,246,0.15)",
          cursor: "pointer",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 24 }}>♾️</span>
          <div style={{ textAlign: "left" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <h2
                style={{
                  margin: 0,
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#E9D5FF",
                  letterSpacing: "-0.01em",
                }}
              >
                Long Cycles
              </h2>
              <span
                style={{
                  fontSize: 11,
                  color: "#6B7280",
                  fontWeight: 400,
                }}
              >
                {cycles.length} pattern{cycles.length !== 1 ? "s" : ""}
              </span>
            </div>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: "#7C6FA0" }}>
              Patterns spanning weeks and months
            </p>
          </div>
        </div>
        {expanded ? (
          <ChevronUp size={18} color="#9B7FD4" />
        ) : (
          <ChevronDown size={18} color="#9B7FD4" />
        )}
      </button>

      {expanded && (
        <div style={{ paddingTop: 20 }}>
          <p
            style={{
              margin: "0 0 20px",
              fontSize: 13,
              color: "#9B7FD4",
              lineHeight: 1.7,
              fontStyle: "italic",
            }}
          >
            Recurring cycles, suppression patterns, and long-term rhythms
            detected by the longitudinal engine. These patterns repeat over time
            and reveal the deeper structure of your symbolic journey.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {cycles.map((c, i) => (
              <LongCycleCard key={i} cycle={c} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// LONG CYCLE CARD
// ═══════════════════════════════════════════════════════════════════════════════
function LongCycleCard({ cycle }) {
  const isSuppression = cycle.type === "suppression" || cycle.suppressedSymbol;
  const emoji = isSuppression ? "⚠️" : "♾️";
  const color = isSuppression ? "#F87171" : "#FBBF24";
  const bg = isSuppression ? "rgba(248,113,113,0.05)" : "rgba(251,191,36,0.05)";
  const border = isSuppression
    ? "rgba(248,113,113,0.15)"
    : "rgba(251,191,36,0.15)";

  return (
    <div
      style={{
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: 14,
        padding: "16px 20px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 10,
        }}
      >
        <span style={{ fontSize: 20 }}>{emoji}</span>
        <span style={{ fontSize: 14, fontWeight: 700, color: color }}>
          {isSuppression ? "Suppression Pattern" : "Recurring Cycle"}
        </span>
        {cycle.count && (
          <span style={{ fontSize: 11, color: "#6B7280" }}>
            {cycle.count}× occurrences
          </span>
        )}
      </div>
      <p
        style={{
          margin: 0,
          fontSize: 14,
          color: "#C4B5FD",
          lineHeight: 1.8,
          fontStyle: "italic",
        }}
      >
        {cycle.narrative}
      </p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PRIMARY INSIGHT CARD
//
// The single most important observation — the emotional center of the page.
// Presented as a large, immersive card with narrative text.
// ═══════════════════════════════════════════════════════════════════════════════
function PrimaryInsightCard({ observation }) {
  const vis = obsV(observation.type);
  const stage = observation.stage || observation.to || null;
  const stageStyle = stage ? stg(stage) : null;
  const borderColor = stageStyle?.color || vis.color;

  return (
    <div
      style={{
        background: `linear-gradient(135deg, ${stageStyle?.bg || "rgba(139,92,246,0.06)"}, rgba(15,10,30,0.95))`,
        border: `1px solid ${borderColor}40`,
        borderLeft: `4px solid ${borderColor}`,
        borderRadius: 20,
        padding: "36px 32px",
        marginBottom: 28,
        animation: "fadeSlideIn 0.5s ease-out",
      }}
    >
      {/* Type badge */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 20,
        }}
      >
        <span style={{ fontSize: 20 }}>{vis.emoji}</span>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: vis.color,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          {vis.label}
        </span>
        {observation.priority === 1 && (
          <span
            style={{
              fontSize: 9,
              fontWeight: 700,
              padding: "2px 8px",
              borderRadius: 6,
              background: "rgba(220,38,38,0.15)",
              color: "#F87171",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Urgent
          </span>
        )}
      </div>

      {/* Title */}
      <h2
        style={{
          margin: "0 0 16px",
          fontSize: 24,
          fontWeight: 700,
          color: "#E9D5FF",
          lineHeight: 1.3,
        }}
      >
        {observation.title}
      </h2>

      {/* Narrative */}
      <p
        style={{
          margin: "0 0 20px",
          fontSize: 15,
          color: "#C4B5FD",
          lineHeight: 1.85,
          fontStyle: "italic",
        }}
      >
        {observation.narrative}
      </p>

      {/* Guidance */}
      {observation.guidance && (
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            borderRadius: 12,
            padding: "14px 18px",
            border: "1px solid rgba(139,92,246,0.12)",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 13,
              color: "#9B7FD4",
              lineHeight: 1.7,
            }}
          >
            <span style={{ fontWeight: 700, color: "#C4B5FD" }}>
              Reflection:{" "}
            </span>
            {observation.guidance}
          </p>
        </div>
      )}

      {/* Drivers (for regression) */}
      {observation.drivers && observation.drivers.length > 0 && (
        <div
          style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}
        >
          {observation.drivers.map((d) => (
            <span
              key={d}
              style={{
                fontSize: 12,
                fontWeight: 600,
                padding: "4px 12px",
                borderRadius: 20,
                background: "rgba(248,113,113,0.1)",
                color: "#FCA5A5",
                border: "1px solid rgba(248,113,113,0.2)",
              }}
            >
              {d}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// WEATHER BANNER
//
// The emotional climate — how the symbolic field feels this week.
// Compact horizontal banner below the primary insight.
// ═══════════════════════════════════════════════════════════════════════════════
function WeatherBanner({ weather }) {
  const current = weather.current;
  if (!current) return null;

  const wv = weaV(current.condition);

  return (
    <div
      style={{
        background: wv.gradient,
        borderRadius: 16,
        padding: "20px 24px",
        marginBottom: 28,
        display: "flex",
        alignItems: "center",
        gap: 16,
      }}
    >
      <div style={{ fontSize: 36, flexShrink: 0 }}>{wv.emoji}</div>
      <div style={{ flex: 1 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 4,
          }}
        >
          <span style={{ fontSize: 15, fontWeight: 700, color: wv.color }}>
            {current.condition}
          </span>
          {current.streakWeeks > 1 && (
            <span style={{ fontSize: 11, color: wv.color, opacity: 0.7 }}>
              {current.streakWeeks} weeks
            </span>
          )}
        </div>
        <p
          style={{
            margin: 0,
            fontSize: 13,
            color: wv.color,
            opacity: 0.85,
            lineHeight: 1.6,
          }}
        >
          {current.description}
        </p>
      </div>

      {/* Forecast hint */}
      {weather.forecast && (
        <div style={{ flexShrink: 0, textAlign: "right" }}>
          <p
            style={{
              margin: 0,
              fontSize: 10,
              fontWeight: 700,
              color: wv.color,
              opacity: 0.6,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Forecast
          </p>
          <p style={{ margin: 0, fontSize: 12, color: wv.color, opacity: 0.8 }}>
            {weather.forecast.prediction === "continuation"
              ? "Holding steady"
              : weather.forecast.prediction === "ascending"
                ? "Rising"
                : weather.forecast.prediction === "descending"
                  ? "Deepening"
                  : "Uncertain"}
          </p>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// OBSERVATION CARD
//
// Used for Tier 2 (Active Symbolic Forces).
// Each observation gets a compact card with narrative + guidance.
// ═══════════════════════════════════════════════════════════════════════════════
function ObservationCard({ observation }) {
  const [expanded, setExpanded] = useState(false);
  const vis = obsV(observation.type);
  const stage = observation.stage || null;
  const stageStyle = stage ? stg(stage) : null;

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      style={{
        background: "rgba(255,255,255,0.02)",
        border: `1px solid ${stageStyle?.border || "rgba(139,92,246,0.15)"}`,
        borderRadius: 14,
        padding: "16px 20px",
        cursor: "pointer",
        transition: "border-color 0.2s",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 20, flexShrink: 0 }}>{vis.emoji}</span>
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 2,
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 600, color: "#E9D5FF" }}>
              {observation.title}
            </span>
          </div>
          {!expanded && (
            <p
              style={{
                margin: 0,
                fontSize: 12,
                color: "#7C6FA0",
                lineHeight: 1.5,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                maxWidth: 500,
              }}
            >
              {observation.narrative?.slice(0, 100)}…
            </p>
          )}
        </div>
        <span
          style={{
            fontSize: 9,
            fontWeight: 700,
            padding: "2px 8px",
            borderRadius: 6,
            background: `${vis.color}15`,
            color: vis.color,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            flexShrink: 0,
          }}
        >
          {vis.label}
        </span>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div
          style={{
            marginTop: 14,
            paddingTop: 14,
            borderTop: "1px solid rgba(139,92,246,0.08)",
          }}
        >
          <p
            style={{
              margin: "0 0 12px",
              fontSize: 14,
              color: "#C4B5FD",
              lineHeight: 1.8,
              fontStyle: "italic",
            }}
          >
            {observation.narrative}
          </p>
          {observation.guidance && (
            <div
              style={{
                background: "rgba(255,255,255,0.02)",
                borderRadius: 10,
                padding: "12px 16px",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: 12,
                  color: "#9B7FD4",
                  lineHeight: 1.7,
                }}
              >
                <span style={{ fontWeight: 700, color: "#C4B5FD" }}>
                  Reflection:{" "}
                </span>
                {observation.guidance}
              </p>
            </div>
          )}
          {/* Symbol pills for constellation or summary types */}
          {observation.symbols && (
            <div
              style={{
                display: "flex",
                gap: 8,
                marginTop: 12,
                flexWrap: "wrap",
              }}
            >
              {(Array.isArray(observation.symbols)
                ? observation.symbols
                : []
              ).map((s, idx) => {
                const label =
                  typeof s === "string" ? s : `${s.visual || ""} ${s.symbol}`;
                const pillStage = typeof s === "string" ? null : s.stage;
                const pillColor = pillStage ? stg(pillStage).color : vis.color;
                return (
                  <span
                    key={idx}
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      padding: "4px 12px",
                      borderRadius: 20,
                      background: `${pillColor}15`,
                      color: pillColor,
                      border: `1px solid ${pillColor}30`,
                    }}
                  >
                    {label}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STAGE DYNAMICS
//
// Tier 3: The coexistence model, entropy, dominant/secondary stages.
// This is where the 0.98 coexistence ratio becomes visible.
// ═══════════════════════════════════════════════════════════════════════════════
function StageDynamics({ coexistence, cycles, suppressions }) {
  if (!coexistence?.dominant) return null;

  const entropyLabel =
    coexistence.coexistenceRatio >= 0.7
      ? "Fragmented"
      : coexistence.coexistenceRatio >= 0.3
        ? "Blended"
        : "Focused";
  const entropyColor =
    coexistence.coexistenceRatio >= 0.7
      ? "#F87171"
      : coexistence.coexistenceRatio >= 0.3
        ? "#FBBF24"
        : "#34D399";

  // Top 2 cycles
  const topCycles = (cycles || []).slice(0, 2);
  // Suppressions
  const topSuppressions = (suppressions || []).slice(0, 1);

  return (
    <div style={{ marginBottom: 28 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 16,
          padding: "12px 0",
        }}
      >
        <Eye size={16} color="#9B7FD4" />
        <span
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: "#C4B5FD",
            letterSpacing: "0.02em",
          }}
        >
          Stage Dynamics
        </span>
      </div>

      {/* Entropy + Dominant Stage */}
      <div
        style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}
      >
        {/* Entropy card */}
        <div
          style={{
            flex: "1 1 200px",
            background: "rgba(255,255,255,0.02)",
            borderRadius: 14,
            padding: "20px",
            border: "1px solid rgba(139,92,246,0.12)",
          }}
        >
          <p
            style={{
              margin: "0 0 6px",
              fontSize: 10,
              fontWeight: 700,
              color: "#7C6FA0",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Symbolic Field
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 8,
              marginBottom: 8,
            }}
          >
            <span
              style={{ fontSize: 28, fontWeight: 800, color: entropyColor }}
            >
              {(coexistence.coexistenceRatio * 100).toFixed(0)}%
            </span>
            <span
              style={{ fontSize: 13, fontWeight: 600, color: entropyColor }}
            >
              {entropyLabel}
            </span>
          </div>
          <p
            style={{
              margin: 0,
              fontSize: 12,
              color: "#7C6FA0",
              lineHeight: 1.6,
            }}
          >
            {coexistence.coexistenceRatio >= 0.7
              ? "Energy is distributed across many stages. The field is in transition — multiple forces are active simultaneously."
              : coexistence.coexistenceRatio >= 0.3
                ? "Two or three stages share dominance. You're between chapters."
                : "One clear dominant energy. The symbolic field is focused."}
          </p>
        </div>

        {/* Dominant stage card */}
        <div
          style={{
            flex: "1 1 200px",
            background: stg(coexistence.dominant.stage).bg,
            borderRadius: 14,
            padding: "20px",
            border: `1px solid ${stg(coexistence.dominant.stage).border}`,
          }}
        >
          <p
            style={{
              margin: "0 0 6px",
              fontSize: 10,
              fontWeight: 700,
              color: "#7C6FA0",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Dominant Energy
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 8,
            }}
          >
            <span style={{ fontSize: 28 }}>
              {stg(coexistence.dominant.stage).emoji}
            </span>
            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: 20,
                  fontWeight: 700,
                  color: stg(coexistence.dominant.stage).color,
                }}
              >
                {coexistence.dominant.stage}
              </p>
              <p style={{ margin: 0, fontSize: 12, color: "#7C6FA0" }}>
                {coexistence.dominant.percentage}% of gravity
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stage bars */}
      <div
        style={{
          background: "rgba(255,255,255,0.02)",
          borderRadius: 14,
          padding: "16px 20px",
          border: "1px solid rgba(139,92,246,0.08)",
          marginBottom: 16,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {coexistence.all.map((s) => {
            const sc = stg(s.stage);
            const isSecondary = coexistence.secondary.some(
              (sec) => sec.stage === s.stage,
            );
            return (
              <div key={s.stage}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 4,
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <span style={{ fontSize: 14 }}>{sc.emoji}</span>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: "#D1D5DB",
                      }}
                    >
                      {s.stage}
                    </span>
                    {isSecondary && (
                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 700,
                          padding: "1px 6px",
                          borderRadius: 4,
                          background: `${sc.color}15`,
                          color: sc.color,
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                        }}
                      >
                        Active
                      </span>
                    )}
                  </div>
                  <span
                    style={{ fontSize: 12, fontWeight: 600, color: sc.color }}
                  >
                    {s.percentage}%
                  </span>
                </div>
                <div
                  style={{
                    width: "100%",
                    height: 6,
                    background: "rgba(255,255,255,0.04)",
                    borderRadius: 3,
                  }}
                >
                  <div
                    style={{
                      height: 6,
                      borderRadius: 3,
                      width: `${s.percentage}%`,
                      background: `linear-gradient(90deg, ${sc.color}, ${sc.color}88)`,
                      transition: "width 0.6s ease",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Longitudinal: cycles and suppressions */}
      {(topCycles.length > 0 || topSuppressions.length > 0) && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {topCycles.map((c, i) => (
            <div
              key={i}
              style={{
                background: "rgba(255,255,255,0.02)",
                borderRadius: 12,
                padding: "14px 18px",
                border: "1px solid rgba(139,92,246,0.08)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 6,
                }}
              >
                <span style={{ fontSize: 14 }}>♾️</span>
                <span
                  style={{ fontSize: 12, fontWeight: 700, color: "#C4B5FD" }}
                >
                  Recurring Cycle
                </span>
                <span
                  style={{
                    fontSize: 10,
                    color: c.intensity === "dominant" ? "#FBBF24" : "#9B7FD4",
                    fontWeight: 600,
                  }}
                >
                  {c.count}×
                </span>
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  color: "#9B7FD4",
                  lineHeight: 1.7,
                }}
              >
                {c.narrative}
              </p>
            </div>
          ))}
          {topSuppressions.map((s, i) => (
            <div
              key={i}
              style={{
                background: "rgba(248,113,113,0.04)",
                borderRadius: 12,
                padding: "14px 18px",
                border: "1px solid rgba(248,113,113,0.1)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 6,
                }}
              >
                <span style={{ fontSize: 14 }}>⚠️</span>
                <span
                  style={{ fontSize: 12, fontWeight: 700, color: "#FCA5A5" }}
                >
                  Suppression Pattern
                </span>
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  color: "#9B7FD4",
                  lineHeight: 1.7,
                }}
              >
                {s.narrative}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// EMERGING CARD
//
// Tier 4: Compact cards for lower-priority patterns.
// ═══════════════════════════════════════════════════════════════════════════════
function EmergingCard({ observation }) {
  const [expanded, setExpanded] = useState(false);
  const vis = obsV(observation.type);

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      style={{
        background: "rgba(255,255,255,0.015)",
        borderRadius: 12,
        padding: "12px 16px",
        cursor: "pointer",
        border: "1px solid rgba(139,92,246,0.06)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 16, flexShrink: 0 }}>{vis.emoji}</span>
        <span
          style={{ fontSize: 13, fontWeight: 500, color: "#D1D5DB", flex: 1 }}
        >
          {observation.title}
        </span>
        <span
          style={{
            fontSize: 9,
            fontWeight: 600,
            color: "#6B7280",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
          }}
        >
          {observation.direction || vis.label}
        </span>
      </div>
      {expanded && (
        <div
          style={{
            marginTop: 12,
            paddingTop: 12,
            borderTop: "1px solid rgba(139,92,246,0.06)",
          }}
        >
          <p
            style={{
              margin: "0 0 8px",
              fontSize: 13,
              color: "#9B7FD4",
              lineHeight: 1.7,
              fontStyle: "italic",
            }}
          >
            {observation.narrative}
          </p>
          {observation.guidance && (
            <p
              style={{
                margin: 0,
                fontSize: 12,
                color: "#7C6FA0",
                lineHeight: 1.6,
              }}
            >
              {observation.guidance}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// DEEP ARCHETYPES EMPTY STATE
//
// Shown when no symbols have anchored yet. Primes users for the deepest
// layer's arrival with explanation, anticipation, and symbolic foreshadowing.
// ═══════════════════════════════════════════════════════════════════════════════
function DeepArchetypesEmpty() {
  return (
    <div style={{ marginBottom: 32 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "16px 0",
          borderBottom: "1px solid rgba(139,92,246,0.15)",
        }}
      >
        <span style={{ fontSize: 24 }}>⚓</span>
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 700,
              color: "#E9D5FF",
              opacity: 0.5,
              letterSpacing: "-0.01em",
            }}
          >
            Deep Archetypes
          </h2>
          <p
            style={{
              margin: "2px 0 0",
              fontSize: 12,
              color: "#7C6FA0",
              opacity: 0.6,
            }}
          >
            Stabilizing and defining forces
          </p>
        </div>
      </div>
      <div
        style={{
          marginTop: 20,
          padding: "28px 24px",
          borderRadius: 16,
          background: "rgba(139,92,246,0.03)",
          border: "1px dashed rgba(139,92,246,0.15)",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 32, marginBottom: 12, opacity: 0.4 }}>⚓</div>
        <h3
          style={{
            margin: "0 0 10px",
            fontSize: 16,
            fontWeight: 600,
            color: "#C4B5FD",
            opacity: 0.7,
          }}
        >
          No symbols have become permanent yet
        </h3>
        <p
          style={{
            margin: "0 auto",
            fontSize: 13,
            color: "#9B7FD4",
            opacity: 0.6,
            lineHeight: 1.8,
            maxWidth: 400,
          }}
        >
          As you continue, some symbols will anchor into your identity — they'll
          become the stabilizing forces, the scars, and the constellations that
          define your symbolic story. This layer fills with time and lived
          experience. It cannot be rushed.
        </p>
      </div>
    </div>
  );
}
