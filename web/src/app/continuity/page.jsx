import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronLeft,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  BookOpen,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Visual Constants (consistent with identity page)
// ─────────────────────────────────────────────────────────────────────────────
const STAGE = {
  Awakening: {
    color: "#60A5FA",
    bg: "rgba(96,165,250,0.08)",
    border: "rgba(96,165,250,0.25)",
    emoji: "🌅",
  },
  Growth: {
    color: "#34D399",
    bg: "rgba(52,211,153,0.08)",
    border: "rgba(52,211,153,0.25)",
    emoji: "🌿",
  },
  Crisis: {
    color: "#F87171",
    bg: "rgba(248,113,113,0.08)",
    border: "rgba(248,113,113,0.25)",
    emoji: "⛈️",
  },
  Integration: {
    color: "#A78BFA",
    bg: "rgba(167,139,250,0.08)",
    border: "rgba(167,139,250,0.25)",
    emoji: "🧭",
  },
  Mastery: {
    color: "#FBBF24",
    bg: "rgba(251,191,36,0.08)",
    border: "rgba(251,191,36,0.25)",
    emoji: "👑",
  },
  Threshold: {
    color: "#818CF8",
    bg: "rgba(129,140,248,0.08)",
    border: "rgba(129,140,248,0.25)",
    emoji: "🚪",
  },
  Mixed: {
    color: "#9CA3AF",
    bg: "rgba(156,163,175,0.08)",
    border: "rgba(156,163,175,0.25)",
    emoji: "🌀",
  },
};
const stg = (s) => STAGE[s] || STAGE.Mixed;

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────
export default function MythicContinuityPage() {
  const {
    data: mc,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["symbolpath-continuity"],
    queryFn: async () => {
      const res = await fetch("/api/symbolpath/continuity");
      if (!res.ok) throw new Error("Failed to load mythic continuity");
      return res.json();
    },
  });

  const loading = isLoading;
  const ready = mc?.ready;

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
        {/* Back */}
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

        {/* Header */}
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
                Mythic Continuity
              </h1>
              <p
                style={{
                  margin: 0,
                  fontSize: 14,
                  color: "#7C6FA0",
                  lineHeight: 1.6,
                }}
              >
                The story your symbolic life is telling.
              </p>
            </div>
            <button
              onClick={() => refetch()}
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

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📖</div>
            <p style={{ color: "#9B7FD4", fontSize: 15 }}>
              Reading the chapters of your symbolic life…
            </p>
          </div>
        )}

        {/* Not ready */}
        {!loading && !ready && mc && (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <BookOpen
              size={48}
              style={{ color: "#4B5563", marginBottom: 16 }}
            />
            <h2 style={{ color: "#E9D5FF", fontSize: 22, marginBottom: 8 }}>
              The story is still forming
            </h2>
            <p
              style={{
                color: "#9B7FD4",
                maxWidth: 440,
                margin: "0 auto",
                lineHeight: 1.7,
                fontSize: 14,
              }}
            >
              {mc.message}
            </p>
            {mc.meta && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 24,
                  marginTop: 24,
                }}
              >
                <Metric label="Events" value={mc.meta.totalEvents} />
                <Metric label="Days" value={mc.meta.spanDays} />
                <Metric label="Weeks" value={mc.meta.distinctWeeks} />
              </div>
            )}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <p style={{ color: "#F87171", fontSize: 14 }}>
              Something went wrong loading your mythic continuity. Try
              refreshing.
            </p>
          </div>
        )}

        {/* Main Content */}
        {!loading && ready && mc && (
          <>
            {/* Summary */}
            {mc.summary && (
              <div
                style={{
                  marginBottom: 36,
                  padding: "24px",
                  borderRadius: 16,
                  background: "rgba(139,92,246,0.04)",
                  border: "1px solid rgba(139,92,246,0.12)",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: 14,
                    color: "#C4B5FD",
                    lineHeight: 1.85,
                    fontStyle: "italic",
                  }}
                >
                  {mc.summary}
                </p>
              </div>
            )}

            {/* 1. Symbolic Eras */}
            <ErasSection eras={mc.eras} />

            {/* 2. Chapter Transitions */}
            <TransitionsSection transitions={mc.chapterTransitions} />

            {/* 3. Atmosphere Migrations */}
            <MigrationsSection migrations={mc.atmosphereMigrations} />

            {/* 4. Recurring Initiations */}
            <InitiationsSection initiations={mc.initiations} />

            {/* 5. Unresolved Loops */}
            <LoopsSection loops={mc.loops} />

            {/* 6. Stabilization Events */}
            <StabilizationSection stabilization={mc.stabilization} />

            {/* 7. Identity Evolution */}
            <EvolutionSection evolution={mc.evolution} />

            {/* Footer */}
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
                {mc.meta.totalEvents} events · {mc.meta.spanDays} days ·{" "}
                {mc.meta.distinctWeeks} weeks
              </p>
              <p style={{ fontSize: 11, color: "#4B5563", marginTop: 4 }}>
                Narratives emerge slowly through accumulated evidence.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 1. SYMBOLIC ERAS
// ═══════════════════════════════════════════════════════════════════════════════
function ErasSection({ eras }) {
  const [expanded, setExpanded] = useState(true);
  if (!eras || eras.length === 0) return null;

  return (
    <CollapsibleSection
      title="Symbolic Eras"
      emoji="📜"
      subtitle="Named chapters of your transformational arc"
      count={eras.length}
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
    >
      {expanded && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {eras.map((era, i) => (
            <EraCard key={i} era={era} />
          ))}
        </div>
      )}
    </CollapsibleSection>
  );
}

function EraCard({ era }) {
  const [open, setOpen] = useState(false);
  const sv = stg(era.character);

  return (
    <div
      onClick={() => setOpen(!open)}
      style={{
        background: sv.bg,
        border: `1px solid ${sv.border}`,
        borderRadius: 16,
        padding: "22px 24px",
        cursor: "pointer",
        position: "relative",
      }}
    >
      {era.isCurrent && (
        <span
          style={{
            position: "absolute",
            top: 14,
            right: 16,
            fontSize: 9,
            fontWeight: 700,
            padding: "2px 8px",
            borderRadius: 6,
            background: "rgba(52,211,153,0.15)",
            color: "#34D399",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          Current
        </span>
      )}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 10,
        }}
      >
        <span style={{ fontSize: 28 }}>{sv.emoji}</span>
        <div>
          <h3
            style={{
              margin: "0 0 4px",
              fontSize: 18,
              fontWeight: 700,
              color: "#E9D5FF",
            }}
          >
            "{era.name}"
          </h3>
          <p style={{ margin: 0, fontSize: 12, color: "#7C6FA0" }}>
            {era.startDate} → {era.endDate} · {era.durationWeeks} weeks ·{" "}
            {era.dominantStage} ({era.dominantPercentage}%)
          </p>
        </div>
      </div>

      <p
        style={{
          margin: 0,
          fontSize: 13,
          color: "#C4B5FD",
          lineHeight: 1.8,
          fontStyle: "italic",
        }}
      >
        {era.narrative}
      </p>

      {open && (
        <div
          style={{
            marginTop: 16,
            paddingTop: 16,
            borderTop: `1px solid ${sv.border}`,
          }}
        >
          {/* Top Symbols */}
          {era.topSymbols?.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <p
                style={{
                  margin: "0 0 8px",
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#7C6FA0",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Era Signatures
              </p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {era.topSymbols.map((s, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: 12,
                      padding: "4px 12px",
                      borderRadius: 20,
                      background: "rgba(255,255,255,0.05)",
                      color: "#C4B5FD",
                      border: `1px solid ${sv.border}`,
                    }}
                  >
                    {s.visual} {s.symbol}{" "}
                    <span style={{ color: "#6B7280", fontSize: 10 }}>
                      ({s.weekCount}w)
                    </span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Stage Distribution */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {Object.entries(era.stageDistribution)
              .sort((a, b) => b[1] - a[1])
              .map(([stage, count]) => {
                const pct = Math.round((count / era.totalEvents) * 100);
                return (
                  <div key={stage} style={{ textAlign: "center" }}>
                    <span style={{ fontSize: 14 }}>{stg(stage).emoji}</span>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 12,
                        fontWeight: 700,
                        color: stg(stage).color,
                      }}
                    >
                      {pct}%
                    </p>
                    <p style={{ margin: 0, fontSize: 9, color: "#6B7280" }}>
                      {stage}
                    </p>
                  </div>
                );
              })}
          </div>

          {era.dominantAtmosphere && (
            <p style={{ margin: "12px 0 0", fontSize: 11, color: "#7C6FA0" }}>
              Atmosphere: {era.dominantAtmosphere}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 2. CHAPTER TRANSITIONS
// ═══════════════════════════════════════════════════════════════════════════════
function TransitionsSection({ transitions }) {
  const [expanded, setExpanded] = useState(true);
  if (!transitions || transitions.length === 0) return null;

  return (
    <CollapsibleSection
      title="Chapter Transitions"
      emoji="⚡"
      subtitle="The boundary moments between eras"
      count={transitions.length}
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
    >
      {expanded && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {transitions.map((t, i) => (
            <TransitionCard key={i} transition={t} />
          ))}
        </div>
      )}
    </CollapsibleSection>
  );
}

function TransitionCard({ transition }) {
  const [open, setOpen] = useState(false);
  const typeColors = {
    rebirth: "#34D399",
    collapse: "#F87171",
    culmination: "#FBBF24",
    emergence: "#60A5FA",
    dissolution: "#818CF8",
    ascending: "#34D399",
    descending: "#F87171",
    lateral: "#9CA3AF",
  };
  const tc = typeColors[transition.type] || "#9CA3AF";

  return (
    <div
      onClick={() => setOpen(!open)}
      style={{
        background: `${tc}08`,
        borderRadius: 14,
        padding: "18px 20px",
        border: `1px solid ${tc}25`,
        cursor: "pointer",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 8,
        }}
      >
        <span style={{ fontSize: 16, fontWeight: 700, color: tc }}>
          {transition.name}
        </span>
        <span
          style={{
            fontSize: 9,
            fontWeight: 700,
            padding: "2px 8px",
            borderRadius: 6,
            background: `${tc}15`,
            color: tc,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          {transition.type}
        </span>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 10,
        }}
      >
        <span
          style={{
            fontSize: 12,
            color: stg(transition.from.character).color,
            fontWeight: 600,
          }}
        >
          {transition.from.era}
        </span>
        <span style={{ fontSize: 14, color: tc }}>→</span>
        <span
          style={{
            fontSize: 12,
            color: stg(transition.to.character).color,
            fontWeight: 600,
          }}
        >
          {transition.to.era}
        </span>
      </div>

      <p
        style={{
          margin: 0,
          fontSize: 12,
          color: "#C4B5FD",
          lineHeight: 1.7,
          fontStyle: "italic",
        }}
      >
        {transition.narrative}
      </p>

      {open && (
        <div
          style={{
            marginTop: 14,
            paddingTop: 14,
            borderTop: `1px solid ${tc}20`,
          }}
        >
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            {transition.bridgeSymbols?.length > 0 && (
              <div>
                <p
                  style={{
                    margin: "0 0 4px",
                    fontSize: 9,
                    fontWeight: 700,
                    color: "#7C6FA0",
                    textTransform: "uppercase",
                  }}
                >
                  Bridge
                </p>
                <p style={{ margin: 0, fontSize: 12, color: "#34D399" }}>
                  {transition.bridgeSymbols.join(", ")}
                </p>
              </div>
            )}
            {transition.departingSymbols?.length > 0 && (
              <div>
                <p
                  style={{
                    margin: "0 0 4px",
                    fontSize: 9,
                    fontWeight: 700,
                    color: "#7C6FA0",
                    textTransform: "uppercase",
                  }}
                >
                  Departed
                </p>
                <p style={{ margin: 0, fontSize: 12, color: "#F87171" }}>
                  {transition.departingSymbols.join(", ")}
                </p>
              </div>
            )}
            {transition.arrivingSymbols?.length > 0 && (
              <div>
                <p
                  style={{
                    margin: "0 0 4px",
                    fontSize: 9,
                    fontWeight: 700,
                    color: "#7C6FA0",
                    textTransform: "uppercase",
                  }}
                >
                  Arriving
                </p>
                <p style={{ margin: 0, fontSize: 12, color: "#60A5FA" }}>
                  {transition.arrivingSymbols.join(", ")}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. ATMOSPHERE MIGRATIONS
// ═══════════════════════════════════════════════════════════════════════════════
function MigrationsSection({ migrations }) {
  const [expanded, setExpanded] = useState(true);
  if (!migrations) return null;
  const hasDrift = migrations.drift?.shifted;
  const hasMigrations = migrations.migrations?.length > 0;
  if (!hasDrift && !hasMigrations) return null;

  return (
    <CollapsibleSection
      title="Atmosphere Migrations"
      emoji="🌊"
      subtitle="Long-term drift of emotional climate"
      count={migrations.migrations?.length || 0}
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
    >
      {expanded && (
        <div>
          {/* Overall drift */}
          {migrations.drift && (
            <div
              style={{
                background: "rgba(99,102,241,0.06)",
                borderRadius: 16,
                padding: "22px 24px",
                border: "1px solid rgba(99,102,241,0.15)",
                marginBottom: 16,
              }}
            >
              <p
                style={{
                  margin: "0 0 4px",
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#7C6FA0",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                Continental Drift
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 14,
                }}
              >
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#818CF8",
                    textTransform: "capitalize",
                  }}
                >
                  {migrations.drift.fromAtmosphere}
                </span>
                <span style={{ fontSize: 14, color: "#6B7280" }}>→</span>
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#A78BFA",
                    textTransform: "capitalize",
                  }}
                >
                  {migrations.drift.toAtmosphere}
                </span>
                <span style={{ fontSize: 11, color: "#6B7280" }}>
                  ({migrations.drift.months} months)
                </span>
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  color: "#C4B5FD",
                  lineHeight: 1.8,
                  fontStyle: "italic",
                }}
              >
                {migrations.drift.narrative}
              </p>
            </div>
          )}

          {/* Monthly shifts */}
          {hasMigrations && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {migrations.migrations.map((m, i) => (
                <div
                  key={i}
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    borderRadius: 10,
                    padding: "12px 16px",
                    border: "1px solid rgba(139,92,246,0.06)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 4,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        color: "#7C6FA0",
                        fontWeight: 600,
                      }}
                    >
                      {m.from.month}
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#818CF8",
                        textTransform: "capitalize",
                      }}
                    >
                      {m.from.atmosphere}
                    </span>
                    <span style={{ fontSize: 12, color: "#6B7280" }}>→</span>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#A78BFA",
                        textTransform: "capitalize",
                      }}
                    >
                      {m.to.atmosphere}
                    </span>
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 11,
                      color: "#9B7FD4",
                      lineHeight: 1.5,
                    }}
                  >
                    {m.from.stage} → {m.to.stage}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </CollapsibleSection>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 4. RECURRING INITIATIONS
// ═══════════════════════════════════════════════════════════════════════════════
function InitiationsSection({ initiations }) {
  const [expanded, setExpanded] = useState(true);
  if (!initiations || initiations.length === 0) return null;

  return (
    <CollapsibleSection
      title="Recurring Initiations"
      emoji="🔑"
      subtitle="Threshold patterns that repeat across your timeline"
      count={initiations.length}
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
    >
      {expanded && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {initiations.map((init, i) => {
            const isForge = init.type === "forge_initiation";
            const color = isForge ? "#FBBF24" : "#60A5FA";
            return (
              <div
                key={i}
                style={{
                  background: `${color}08`,
                  borderRadius: 14,
                  padding: "18px 20px",
                  border: `1px solid ${color}20`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 8,
                  }}
                >
                  <span style={{ fontSize: 16 }}>{isForge ? "🔨" : "🚪"}</span>
                  <span
                    style={{ fontSize: 15, fontWeight: 700, color: "#E9D5FF" }}
                  >
                    {init.pattern}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color,
                      background: `${color}15`,
                      padding: "2px 8px",
                      borderRadius: 6,
                    }}
                  >
                    {init.count}×
                  </span>
                </div>
                <p
                  style={{
                    margin: "0 0 10px",
                    fontSize: 13,
                    color: "#C4B5FD",
                    lineHeight: 1.8,
                    fontStyle: "italic",
                  }}
                >
                  {init.narrative}
                </p>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {init.symbols.slice(0, 6).map((s, j) => (
                    <span
                      key={j}
                      style={{
                        fontSize: 11,
                        padding: "2px 10px",
                        borderRadius: 12,
                        background: "rgba(255,255,255,0.04)",
                        color: "#9B7FD4",
                        border: `1px solid ${color}15`,
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </CollapsibleSection>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 5. UNRESOLVED LOOPS
// ═══════════════════════════════════════════════════════════════════════════════
function LoopsSection({ loops }) {
  const [expanded, setExpanded] = useState(true);
  if (!loops?.hasLoops) return null;

  const stageLoops = loops.stageLoops || [];
  const symbolLoops = loops.symbolLoops || [];
  const total = stageLoops.length + symbolLoops.length;

  return (
    <CollapsibleSection
      title="Unresolved Loops"
      emoji="🔄"
      subtitle="Patterns that keep returning without breakthrough"
      count={total}
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
    >
      {expanded && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {/* Stage loops */}
          {stageLoops.map((loop, i) => (
            <div
              key={`s${i}`}
              style={{
                background: "rgba(248,113,113,0.04)",
                borderRadius: 12,
                padding: "16px 18px",
                border: "1px solid rgba(248,113,113,0.12)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 8,
                }}
              >
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: stg(loop.anchor).color,
                  }}
                >
                  {loop.anchor}
                </span>
                <span style={{ fontSize: 13, color: "#F87171" }}>⟲</span>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: stg(loop.oscillation).color,
                  }}
                >
                  {loop.oscillation}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#F87171",
                    background: "rgba(248,113,113,0.1)",
                    padding: "2px 8px",
                    borderRadius: 6,
                  }}
                >
                  {loop.count}×
                </span>
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: 12,
                  color: "#C4B5FD",
                  lineHeight: 1.7,
                  fontStyle: "italic",
                }}
              >
                {loop.narrative}
              </p>
            </div>
          ))}

          {/* Symbol loops */}
          {symbolLoops.map((loop, i) => {
            const isCrisis = loop.type === "symbol_crisis_loop";
            const color = isCrisis ? "#F87171" : "#60A5FA";
            return (
              <div
                key={`sym${i}`}
                style={{
                  background: `${color}06`,
                  borderRadius: 12,
                  padding: "16px 18px",
                  border: `1px solid ${color}15`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 8,
                  }}
                >
                  <span style={{ fontSize: 14 }}>{isCrisis ? "🩹" : "🌱"}</span>
                  <span
                    style={{ fontSize: 14, fontWeight: 700, color: "#E9D5FF" }}
                  >
                    {loop.symbol}
                  </span>
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      color,
                      textTransform: "uppercase",
                    }}
                  >
                    {isCrisis ? "Unresolved Wound" : "Unrooted Awakening"}
                  </span>
                  <span style={{ fontSize: 11, color: "#6B7280" }}>
                    {loop.count}× / {loop.months}mo
                  </span>
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 12,
                    color: "#C4B5FD",
                    lineHeight: 1.7,
                    fontStyle: "italic",
                  }}
                >
                  {loop.narrative}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </CollapsibleSection>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 6. STABILIZATION EVENTS
// ═══════════════════════════════════════════════════════════════════════════════
function StabilizationSection({ stabilization }) {
  const [expanded, setExpanded] = useState(true);
  if (!stabilization?.hasEvents) return null;

  const stabilized = stabilization.stabilized || [];
  const approaching = stabilization.approaching || [];
  const total = stabilized.length + approaching.length;

  return (
    <CollapsibleSection
      title="Stabilization Events"
      emoji="⚓"
      subtitle="Symbols that have permanently anchored into your identity"
      count={total}
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
    >
      {expanded && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {stabilized.map((s, i) => (
            <div
              key={`a${i}`}
              style={{
                background: "rgba(52,211,153,0.04)",
                borderRadius: 14,
                padding: "18px 20px",
                border: "1px solid rgba(52,211,153,0.15)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 8,
                }}
              >
                <span style={{ fontSize: 24 }}>{s.visual}</span>
                <div>
                  <span
                    style={{ fontSize: 15, fontWeight: 700, color: "#E9D5FF" }}
                  >
                    {s.symbol}
                  </span>
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: 6,
                      background: "rgba(52,211,153,0.15)",
                      color: "#34D399",
                      textTransform: "uppercase",
                      marginLeft: 8,
                    }}
                  >
                    Anchored
                  </span>
                </div>
              </div>
              <p
                style={{
                  margin: "0 0 10px",
                  fontSize: 13,
                  color: "#C4B5FD",
                  lineHeight: 1.8,
                  fontStyle: "italic",
                }}
              >
                {s.narrative}
              </p>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <MiniMetric label="Weight" value={s.weight.toFixed(1)} />
                <MiniMetric label="Peak" value={s.peakWeight.toFixed(1)} />
                <MiniMetric label="Events" value={s.totalEvents} />
              </div>
            </div>
          ))}

          {approaching.map((s, i) => (
            <div
              key={`app${i}`}
              style={{
                background: "rgba(251,191,36,0.04)",
                borderRadius: 14,
                padding: "18px 20px",
                border: "1px solid rgba(251,191,36,0.12)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 8,
                }}
              >
                <span style={{ fontSize: 24 }}>{s.visual}</span>
                <div>
                  <span
                    style={{ fontSize: 15, fontWeight: 700, color: "#E9D5FF" }}
                  >
                    {s.symbol}
                  </span>
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: 6,
                      background: "rgba(251,191,36,0.1)",
                      color: "#FBBF24",
                      textTransform: "uppercase",
                      marginLeft: 8,
                    }}
                  >
                    Approaching
                  </span>
                </div>
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: 12,
                  color: "#C4B5FD",
                  lineHeight: 1.7,
                  fontStyle: "italic",
                }}
              >
                {s.narrative}
              </p>
            </div>
          ))}
        </div>
      )}
    </CollapsibleSection>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 7. IDENTITY EVOLUTION
// ═══════════════════════════════════════════════════════════════════════════════
function EvolutionSection({ evolution }) {
  const [expanded, setExpanded] = useState(true);
  if (!evolution?.snapshots || evolution.snapshots.length === 0) return null;

  const snapshots = evolution.snapshots;
  const arc = evolution.arc;

  return (
    <CollapsibleSection
      title="Identity Evolution"
      emoji="🦋"
      subtitle="How your symbolic signatures have shifted over time"
      count={snapshots.length}
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
    >
      {expanded && (
        <div>
          {/* Evolution Arc Narrative */}
          {arc && (
            <div
              style={{
                background: "rgba(139,92,246,0.06)",
                borderRadius: 16,
                padding: "22px 24px",
                border: "1px solid rgba(139,92,246,0.15)",
                marginBottom: 20,
              }}
            >
              <p
                style={{
                  margin: "0 0 16px",
                  fontSize: 13,
                  color: "#C4B5FD",
                  lineHeight: 1.8,
                  fontStyle: "italic",
                }}
              >
                {arc.narrative}
              </p>

              <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                {arc.persisted?.length > 0 && (
                  <div>
                    <p
                      style={{
                        margin: "0 0 4px",
                        fontSize: 9,
                        fontWeight: 700,
                        color: "#7C6FA0",
                        textTransform: "uppercase",
                      }}
                    >
                      Persisted
                    </p>
                    <div style={{ display: "flex", gap: 4 }}>
                      {arc.persisted.map((s, i) => (
                        <span
                          key={i}
                          style={{
                            fontSize: 13,
                            padding: "2px 8px",
                            borderRadius: 10,
                            background: "rgba(52,211,153,0.1)",
                            color: "#34D399",
                            fontWeight: 600,
                          }}
                        >
                          {s.visual} {s.symbol}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {arc.departed?.length > 0 && (
                  <div>
                    <p
                      style={{
                        margin: "0 0 4px",
                        fontSize: 9,
                        fontWeight: 700,
                        color: "#7C6FA0",
                        textTransform: "uppercase",
                      }}
                    >
                      Departed
                    </p>
                    <div style={{ display: "flex", gap: 4 }}>
                      {arc.departed.map((s, i) => (
                        <span
                          key={i}
                          style={{
                            fontSize: 13,
                            padding: "2px 8px",
                            borderRadius: 10,
                            background: "rgba(248,113,113,0.1)",
                            color: "#F87171",
                            fontWeight: 600,
                          }}
                        >
                          {s.visual} {s.symbol}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {arc.emerged?.length > 0 && (
                  <div>
                    <p
                      style={{
                        margin: "0 0 4px",
                        fontSize: 9,
                        fontWeight: 700,
                        color: "#7C6FA0",
                        textTransform: "uppercase",
                      }}
                    >
                      Emerged
                    </p>
                    <div style={{ display: "flex", gap: 4 }}>
                      {arc.emerged.map((s, i) => (
                        <span
                          key={i}
                          style={{
                            fontSize: 13,
                            padding: "2px 8px",
                            borderRadius: 10,
                            background: "rgba(96,165,250,0.1)",
                            color: "#60A5FA",
                            fontWeight: 600,
                          }}
                        >
                          {s.visual} {s.symbol}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Temporal Snapshots */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {snapshots.map((snap, i) => {
              const labelColors = {
                Early: "#6B7280",
                Middle: "#818CF8",
                Recent: "#FBBF24",
              };
              const lc = labelColors[snap.label] || "#6B7280";
              return (
                <div
                  key={i}
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    borderRadius: 12,
                    padding: "14px 18px",
                    border: `1px solid ${lc}20`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 10,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: lc,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      {snap.label}
                    </span>
                    <span style={{ fontSize: 10, color: "#6B7280" }}>
                      {snap.periodStart} → {snap.periodEnd}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {snap.topSymbols.map((s, j) => (
                      <span
                        key={j}
                        style={{
                          fontSize: 12,
                          padding: "4px 12px",
                          borderRadius: 20,
                          background: stg(s.stage).bg,
                          border: `1px solid ${stg(s.stage).border}`,
                          color: stg(s.stage).color,
                          fontWeight: 600,
                        }}
                      >
                        {s.visual} {s.symbol}{" "}
                        <span style={{ color: "#6B7280", fontSize: 10 }}>
                          ({s.count})
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </CollapsibleSection>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SHARED COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════
function CollapsibleSection({
  title,
  emoji,
  subtitle,
  count,
  expanded,
  onToggle,
  children,
}) {
  return (
    <div style={{ marginBottom: 32 }}>
      <button
        onClick={onToggle}
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
              <span style={{ fontSize: 11, color: "#6B7280" }}>{count}</span>
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
      {expanded && <div style={{ paddingTop: 20 }}>{children}</div>}
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#E9D5FF" }}>
        {value}
      </p>
      <p
        style={{
          margin: "2px 0 0",
          fontSize: 10,
          color: "#7C6FA0",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        {label}
      </p>
    </div>
  );
}

function MiniMetric({ label, value }) {
  return (
    <div>
      <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#E9D5FF" }}>
        {value}
      </p>
      <p
        style={{
          margin: "1px 0 0",
          fontSize: 9,
          color: "#7C6FA0",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
        }}
      >
        {label}
      </p>
    </div>
  );
}
