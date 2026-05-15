import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Repeat,
  Zap,
  Layers,
  Sparkles,
  AlertTriangle,
} from "lucide-react";

const STAGE_COLORS = {
  Awakening: {
    color: "#60A5FA",
    bg: "rgba(96,165,250,0.08)",
    border: "rgba(96,165,250,0.2)",
  },
  Growth: {
    color: "#34D399",
    bg: "rgba(52,211,153,0.08)",
    border: "rgba(52,211,153,0.2)",
  },
  Crisis: {
    color: "#F87171",
    bg: "rgba(248,113,113,0.08)",
    border: "rgba(248,113,113,0.2)",
  },
  Integration: {
    color: "#A78BFA",
    bg: "rgba(167,139,250,0.08)",
    border: "rgba(167,139,250,0.2)",
  },
  Mastery: {
    color: "#FBBF24",
    bg: "rgba(251,191,36,0.08)",
    border: "rgba(251,191,36,0.2)",
  },
  Threshold: {
    color: "#FB923C",
    bg: "rgba(251,146,60,0.08)",
    border: "rgba(251,146,60,0.2)",
  },
  Mixed: {
    color: "#9CA3AF",
    bg: "rgba(156,163,175,0.06)",
    border: "rgba(156,163,175,0.15)",
  },
};
const stg = (s) => STAGE_COLORS[s] || STAGE_COLORS.Mixed;

const SECTION_ICONS = {
  chapters: "📖",
  wounds: "🔄",
  initiations: "⚡",
  themes: "🌌",
  synthesis: "✨",
};

export default function MythologyPage() {
  const [activeTab, setActiveTab] = useState("autobiography");
  const { data, isLoading, error } = useQuery({
    queryKey: ["mythology"],
    queryFn: async () => {
      const res = await fetch("/api/symbolpath/mythology");
      if (!res.ok) throw new Error("Failed to load mythology");
      return res.json();
    },
  });

  if (isLoading) return <LoadingScreen />;
  if (error) return <ErrorScreen />;
  if (!data?.ready) return <NotReadyScreen reason={data?.reason} />;

  const tabs = [
    { key: "autobiography", label: "Story", icon: "📖" },
    { key: "chapters", label: "Chapters", icon: "📚" },
    { key: "wounds", label: "Wounds", icon: "🔄" },
    { key: "initiations", label: "Initiations", icon: "⚡" },
    { key: "themes", label: "Themes", icon: "🌌" },
    { key: "synthesis", label: "Synthesis", icon: "✨" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0F0A1E",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{ maxWidth: 760, margin: "0 auto", padding: "40px 24px 100px" }}
      >
        <a
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontSize: 13,
            color: "#9B7FD4",
            textDecoration: "none",
            marginBottom: 24,
          }}
        >
          <ChevronLeft size={15} /> Back
        </a>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1
            style={{
              margin: "0 0 6px",
              fontSize: 28,
              fontWeight: 700,
              color: "#E9D5FF",
            }}
          >
            {data.autobiography?.title || "Your Mythology"}
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: 14,
              color: "#7C6FA0",
              lineHeight: 1.6,
            }}
          >
            A symbolic autobiography — told through what has actually happened
          </p>
        </div>

        {/* Disclaimer */}
        <div
          style={{
            background: "rgba(139,92,246,0.04)",
            border: "1px solid rgba(139,92,246,0.12)",
            borderRadius: 12,
            padding: "12px 16px",
            marginBottom: 24,
            display: "flex",
            gap: 10,
            alignItems: "flex-start",
          }}
        >
          <AlertTriangle
            size={14}
            style={{ color: "#A78BFA", marginTop: 2, flexShrink: 0 }}
          />
          <p
            style={{
              margin: 0,
              fontSize: 11,
              color: "#9B7FD4",
              lineHeight: 1.7,
            }}
          >
            This is reflective synthesis — not destiny, not prescription. Names
            like "The Long Threshold" describe observed patterns, not fixed
            truths.
          </p>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: 4,
            marginBottom: 28,
            overflowX: "auto",
            paddingBottom: 4,
          }}
        >
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              style={{
                padding: "8px 14px",
                borderRadius: 10,
                border: "1px solid",
                borderColor:
                  activeTab === t.key
                    ? "rgba(139,92,246,0.3)"
                    : "rgba(139,92,246,0.08)",
                background:
                  activeTab === t.key ? "rgba(139,92,246,0.12)" : "transparent",
                color: activeTab === t.key ? "#E9D5FF" : "#7C6FA0",
                fontSize: 12,
                fontWeight: 500,
                cursor: "pointer",
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span style={{ fontSize: 14 }}>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === "autobiography" && <AutobiographyTab data={data} />}
        {activeTab === "chapters" && <ChaptersTab chapters={data.chapters} />}
        {activeTab === "wounds" && <WoundsTab wounds={data.wounds} />}
        {activeTab === "initiations" && (
          <InitiationsTab initiations={data.initiations} />
        )}
        {activeTab === "themes" && <ThemesTab themes={data.longCycleThemes} />}
        {activeTab === "synthesis" && (
          <SynthesisTab synthesis={data.synthesis} />
        )}

        {/* Meta footer */}
        <div
          style={{
            marginTop: 48,
            paddingTop: 16,
            borderTop: "1px solid rgba(139,92,246,0.06)",
            textAlign: "center",
          }}
        >
          <p style={{ margin: 0, fontSize: 10, color: "#4B5563" }}>
            {data.meta.totalEvents} events · {data.meta.spanDays} days ·{" "}
            {data.meta.eraCount} era{data.meta.eraCount !== 1 ? "s" : ""} ·
            Maturity: {data.meta.maturityLevel}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── AUTOBIOGRAPHY TAB ───

function AutobiographyTab({ data }) {
  const auto = data.autobiography;
  if (!auto) return null;

  return (
    <div>
      {/* Prologue */}
      <div
        style={{
          background: "rgba(139,92,246,0.06)",
          borderRadius: 16,
          padding: "28px 26px",
          border: "1px solid rgba(139,92,246,0.12)",
          marginBottom: 24,
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
          Prologue
        </p>
        <p
          style={{
            margin: 0,
            fontSize: 15,
            color: "#D4BFFF",
            lineHeight: 2,
            fontStyle: "italic",
          }}
        >
          {auto.prologue}
        </p>
      </div>

      {/* Arc summary */}
      <div
        style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}
      >
        <StatCard label="Chapters" value={auto.chapterCount} />
        <StatCard label="Total Weeks" value={auto.totalWeeks} />
        <StatCard label="Arc" value={auto.arcType?.replace(/_/g, " ")} />
        <StatCard label="Maturity" value={auto.maturityLevel} />
      </div>

      {/* Chapter timeline mini */}
      {data.chapters && data.chapters.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <p
            style={{
              margin: "0 0 12px",
              fontSize: 10,
              fontWeight: 700,
              color: "#7C6FA0",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Chapter Arc
          </p>
          <div
            style={{
              display: "flex",
              gap: 2,
              height: 40,
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            {data.chapters.map((ch, i) => {
              const s = stg(ch.character);
              const widthPct = Math.max(
                15,
                (ch.durationWeeks /
                  data.chapters.reduce((a, c) => a + c.durationWeeks, 0)) *
                  100,
              );
              return (
                <div
                  key={i}
                  style={{
                    width: `${widthPct}%`,
                    background: s.bg,
                    border: `1px solid ${s.border}`,
                    borderRadius:
                      i === 0
                        ? "8px 0 0 8px"
                        : i === data.chapters.length - 1
                          ? "0 8px 8px 0"
                          : 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "2px 4px",
                    minWidth: 0,
                  }}
                  title={ch.title}
                >
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      color: s.color,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "100%",
                    }}
                  >
                    {ch.title}
                  </span>
                  <span style={{ fontSize: 8, color: "#6B7280" }}>
                    {ch.durationWeeks}w
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 12,
        }}
      >
        {data.wounds?.length > 0 && (
          <QuickInsightCard
            icon="🔄"
            title="Recurring Wounds"
            value={data.wounds.length}
            detail={data.wounds[0].title}
          />
        )}
        {data.initiations?.length > 0 && (
          <QuickInsightCard
            icon="⚡"
            title="Initiations"
            value={data.initiations.length}
            detail={data.initiations[0].name}
          />
        )}
        {data.longCycleThemes?.length > 0 && (
          <QuickInsightCard
            icon="🌌"
            title="Long-Cycle Themes"
            value={data.longCycleThemes.length}
            detail={data.longCycleThemes[0].title}
          />
        )}
      </div>
    </div>
  );
}

// ─── CHAPTERS TAB ───

function ChaptersTab({ chapters }) {
  if (!chapters || chapters.length === 0)
    return <EmptySection message="No chapters have formed yet." />;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {chapters.map((ch, i) => (
        <ChapterCard key={i} chapter={ch} isLast={i === chapters.length - 1} />
      ))}
    </div>
  );
}

function ChapterCard({ chapter, isLast }) {
  const [expanded, setExpanded] = useState(false);
  const s = stg(chapter.character);

  return (
    <div style={{ display: "flex", gap: 16 }}>
      {/* Timeline line */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: 28,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: s.color,
            border: chapter.isCurrent ? `2px solid ${s.color}` : "none",
            boxShadow: chapter.isCurrent ? `0 0 12px ${s.color}50` : "none",
          }}
        />
        {!isLast && (
          <div
            style={{
              width: 2,
              flex: 1,
              background: `linear-gradient(180deg, ${s.color}40, ${s.color}10)`,
            }}
          />
        )}
      </div>

      {/* Card */}
      <div style={{ flex: 1, marginBottom: 20 }}>
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            width: "100%",
            textAlign: "left",
            background: s.bg,
            border: `1px solid ${s.border}`,
            borderRadius: 14,
            padding: "18px 22px",
            cursor: "pointer",
            display: "block",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 4,
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#E9D5FF",
                  }}
                >
                  {chapter.title}
                </h3>
                {chapter.isCurrent && (
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: 6,
                      background: `${s.color}20`,
                      color: s.color,
                      textTransform: "uppercase",
                    }}
                  >
                    Current
                  </span>
                )}
              </div>
              <p style={{ margin: 0, fontSize: 11, color: "#7C6FA0" }}>
                {chapter.durationWeeks} weeks · {chapter.stage} ·{" "}
                {chapter.atmosphere || "mixed"} atmosphere
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ fontSize: 9, color: "#6B7280" }}>
                Ch. {chapter.index}
              </span>
              {expanded ? (
                <ChevronUp size={14} color="#6B7280" />
              ) : (
                <ChevronDown size={14} color="#6B7280" />
              )}
            </div>
          </div>

          {/* Symbols row */}
          <div
            style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}
          >
            {(chapter.topSymbols || []).map((sym, i) => (
              <span
                key={i}
                style={{
                  fontSize: 11,
                  padding: "2px 8px",
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.04)",
                  color: "#C4B5FD",
                }}
              >
                {sym.visual} {sym.symbol}
              </span>
            ))}
          </div>
        </button>

        {expanded && (
          <div
            style={{
              padding: "16px 22px",
              background: "rgba(255,255,255,0.01)",
              borderRadius: "0 0 14px 14px",
              border: `1px solid ${s.border}`,
              borderTop: "none",
              marginTop: -2,
            }}
          >
            <p
              style={{
                margin: "0 0 14px",
                fontSize: 13,
                color: "#C4B5FD",
                lineHeight: 1.9,
              }}
            >
              {chapter.narrative}
            </p>

            {/* Stage distribution */}
            <div style={{ marginBottom: 12 }}>
              <p
                style={{
                  margin: "0 0 6px",
                  fontSize: 9,
                  fontWeight: 700,
                  color: "#7C6FA0",
                  textTransform: "uppercase",
                }}
              >
                Stage Distribution
              </p>
              <div
                style={{
                  display: "flex",
                  gap: 3,
                  height: 6,
                  borderRadius: 3,
                  overflow: "hidden",
                }}
              >
                {Object.entries(chapter.stageDistribution || {})
                  .sort((a, b) => b[1] - a[1])
                  .map(([stage, count]) => {
                    const total = Object.values(
                      chapter.stageDistribution,
                    ).reduce((a, b) => a + b, 0);
                    return (
                      <div
                        key={stage}
                        style={{
                          width: `${(count / total) * 100}%`,
                          background: stg(stage).color,
                          borderRadius: 3,
                        }}
                        title={`${stage}: ${Math.round((count / total) * 100)}%`}
                      />
                    );
                  })}
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  marginTop: 4,
                  flexWrap: "wrap",
                }}
              >
                {Object.entries(chapter.stageDistribution || {})
                  .sort((a, b) => b[1] - a[1])
                  .map(([stage, count]) => {
                    const total = Object.values(
                      chapter.stageDistribution,
                    ).reduce((a, b) => a + b, 0);
                    return (
                      <span
                        key={stage}
                        style={{ fontSize: 9, color: stg(stage).color }}
                      >
                        {stage} {Math.round((count / total) * 100)}%
                      </span>
                    );
                  })}
              </div>
            </div>

            {/* Entry transition */}
            {chapter.entryTransition && (
              <div
                style={{
                  padding: "10px 14px",
                  background: "rgba(139,92,246,0.04)",
                  borderRadius: 10,
                  border: "1px solid rgba(139,92,246,0.08)",
                }}
              >
                <p style={{ margin: 0, fontSize: 10, color: "#7C6FA0" }}>
                  Entry:{" "}
                  <span style={{ color: "#C4B5FD" }}>
                    {chapter.entryTransition.name ||
                      chapter.entryTransition.type}
                  </span>
                  {chapter.entryTransition.bridgeSymbols?.length > 0 && (
                    <span>
                      {" "}
                      · Bridge:{" "}
                      {chapter.entryTransition.bridgeSymbols
                        .map((s) =>
                          typeof s === "string"
                            ? s
                            : `${s.visual || ""} ${s.symbol}`.trim(),
                        )
                        .join(", ")}
                    </span>
                  )}
                </p>
              </div>
            )}

            <p style={{ margin: "12px 0 0", fontSize: 10, color: "#4B5563" }}>
              {chapter.startDate} → {chapter.endDate} · {chapter.initiationType}{" "}
              initiation
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── WOUNDS TAB ───

function WoundsTab({ wounds }) {
  if (!wounds || wounds.length === 0)
    return (
      <EmptySection message="No recurring wounds detected — the field flows without obvious stuckness." />
    );

  const oscillations = wounds.filter((w) => w.type === "oscillation");
  const symbolLoops = wounds.filter((w) => w.type === "symbol_loop");
  const regressions = wounds.filter((w) => w.type === "regression");
  const tensions = wounds.filter((w) => w.type === "tension");

  return (
    <div>
      <p
        style={{
          margin: "0 0 20px",
          fontSize: 13,
          color: "#9B7FD4",
          lineHeight: 1.8,
        }}
      >
        Recurring wounds are not failures — they are places where the psyche
        keeps returning because something has not yet been fully met. Attention
        to these patterns is itself a form of healing.
      </p>

      {oscillations.length > 0 && (
        <WoundSection
          title="Stage Oscillations"
          icon="🔄"
          description="The field keeps swinging between these stages"
          wounds={oscillations}
        />
      )}
      {symbolLoops.length > 0 && (
        <WoundSection
          title="Symbol Loops"
          icon="🔁"
          description="Symbols stuck in the same stage"
          wounds={symbolLoops}
        />
      )}
      {regressions.length > 0 && (
        <WoundSection
          title="Regression Patterns"
          icon="↩️"
          description="Repeated movement backward"
          wounds={regressions}
        />
      )}
      {tensions.length > 0 && (
        <WoundSection
          title="Symbolic Tensions"
          icon="⚡"
          description="Counterbalancing forces both strongly present"
          wounds={tensions}
        />
      )}
    </div>
  );
}

function WoundSection({ title, icon, description, wounds }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 4,
        }}
      >
        <span style={{ fontSize: 16 }}>{icon}</span>
        <h3
          style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#E9D5FF" }}
        >
          {title}
        </h3>
      </div>
      <p style={{ margin: "0 0 12px", fontSize: 11, color: "#6B7280" }}>
        {description}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {wounds.map((w, i) => (
          <WoundCard key={i} wound={w} />
        ))}
      </div>
    </div>
  );
}

function WoundCard({ wound }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      style={{
        background: "rgba(248,113,113,0.04)",
        border: "1px solid rgba(248,113,113,0.1)",
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: "100%",
          padding: "14px 18px",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h4
            style={{
              margin: "0 0 2px",
              fontSize: 14,
              fontWeight: 600,
              color: "#FBBF24",
            }}
          >
            {wound.title}
          </h4>
          <p style={{ margin: 0, fontSize: 10, color: "#6B7280" }}>
            {wound.recurrences
              ? `${wound.recurrences} recurrences`
              : wound.occurrences
                ? `${wound.occurrences} occurrences`
                : wound.count
                  ? `${wound.count} times`
                  : ""}
          </p>
        </div>
        {expanded ? (
          <ChevronUp size={14} color="#6B7280" />
        ) : (
          <ChevronDown size={14} color="#6B7280" />
        )}
      </button>
      {expanded && (
        <div
          style={{
            padding: "0 18px 16px",
            borderTop: "1px solid rgba(248,113,113,0.06)",
          }}
        >
          <p
            style={{
              margin: "12px 0 0",
              fontSize: 13,
              color: "#D4A574",
              lineHeight: 1.9,
            }}
          >
            {wound.narrative}
          </p>
        </div>
      )}
    </div>
  );
}

// ─── INITIATIONS TAB ───

function InitiationsTab({ initiations }) {
  if (!initiations || initiations.length === 0)
    return (
      <EmptySection message="No major initiations detected yet. Initiations are threshold crossings that fundamentally change the field — they emerge through time." />
    );

  return (
    <div>
      <p
        style={{
          margin: "0 0 20px",
          fontSize: 13,
          color: "#9B7FD4",
          lineHeight: 1.8,
        }}
      >
        Initiations are the threshold moments — the crossings that change the
        shape of the field. Not every transition is an initiation, only the ones
        that left a mark.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {initiations.map((init, i) => (
          <InitiationCard key={i} initiation={init} />
        ))}
      </div>
    </div>
  );
}

function InitiationCard({ initiation }) {
  const [expanded, setExpanded] = useState(false);
  const isChapterCrossing = initiation.type === "chapter_crossing";
  const accentColor = isChapterCrossing
    ? "#60A5FA"
    : initiation.type === "forge_initiation"
      ? "#FBBF24"
      : "#A78BFA";

  return (
    <div
      style={{
        background: `${accentColor}08`,
        border: `1px solid ${accentColor}25`,
        borderRadius: 14,
        overflow: "hidden",
      }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: "100%",
          padding: "18px 22px",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <span style={{ fontSize: 24, lineHeight: 1 }}>⚡</span>
          <div>
            <h4
              style={{
                margin: "0 0 4px",
                fontSize: 15,
                fontWeight: 700,
                color: "#E9D5FF",
              }}
            >
              {initiation.name}
            </h4>
            <p style={{ margin: 0, fontSize: 11, color: "#7C6FA0" }}>
              {initiation.pattern || initiation.transitionType} ·{" "}
              {initiation.count
                ? `${initiation.count} occurrences`
                : initiation.direction || ""}
            </p>
          </div>
        </div>
        {expanded ? (
          <ChevronUp size={14} color="#6B7280" />
        ) : (
          <ChevronDown size={14} color="#6B7280" />
        )}
      </button>
      {expanded && (
        <div
          style={{
            padding: "0 22px 20px",
            borderTop: `1px solid ${accentColor}12`,
          }}
        >
          <p
            style={{
              margin: "14px 0",
              fontSize: 13,
              color: "#C4B5FD",
              lineHeight: 1.9,
            }}
          >
            {initiation.narrative}
          </p>

          {/* Symbols involved */}
          {initiation.symbols?.length > 0 && (
            <div>
              <p
                style={{
                  margin: "0 0 6px",
                  fontSize: 9,
                  fontWeight: 700,
                  color: "#7C6FA0",
                  textTransform: "uppercase",
                }}
              >
                Symbols involved
              </p>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {initiation.symbols.slice(0, 6).map((sym, i) => {
                  const name = typeof sym === "string" ? sym : sym.symbol;
                  const visual =
                    typeof sym === "string" ? "" : sym.visual || "";
                  return (
                    <span
                      key={i}
                      style={{
                        fontSize: 12,
                        padding: "3px 10px",
                        borderRadius: 10,
                        background: "rgba(255,255,255,0.04)",
                        color: "#C4B5FD",
                      }}
                    >
                      {visual} {name}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bridge / arriving / departing */}
          {initiation.bridgeSymbols?.length > 0 && (
            <SymbolRow
              label="Carried through"
              symbols={initiation.bridgeSymbols}
              color="#34D399"
            />
          )}
          {initiation.arrivingSymbols?.length > 0 && (
            <SymbolRow
              label="Emerged"
              symbols={initiation.arrivingSymbols}
              color="#60A5FA"
            />
          )}
          {initiation.departingSymbols?.length > 0 && (
            <SymbolRow
              label="Fell away"
              symbols={initiation.departingSymbols}
              color="#6B7280"
            />
          )}
        </div>
      )}
    </div>
  );
}

function SymbolRow({ label, symbols, color }) {
  return (
    <div style={{ marginTop: 10 }}>
      <p
        style={{
          margin: "0 0 4px",
          fontSize: 9,
          fontWeight: 700,
          color: "#7C6FA0",
          textTransform: "uppercase",
        }}
      >
        {label}
      </p>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {symbols.map((sym, i) => {
          const name = typeof sym === "string" ? sym : sym.symbol;
          const visual = typeof sym === "string" ? "" : sym.visual || "";
          return (
            <span
              key={i}
              style={{
                fontSize: 12,
                padding: "2px 8px",
                borderRadius: 8,
                border: `1px solid ${color}30`,
                color,
              }}
            >
              {visual} {name}
            </span>
          );
        })}
      </div>
    </div>
  );
}

// ─── THEMES TAB ───

function ThemesTab({ themes }) {
  if (!themes || themes.length === 0)
    return (
      <EmptySection message="No long-cycle themes detected yet. These emerge from sustained symbolic practice." />
    );

  return (
    <div>
      <p
        style={{
          margin: "0 0 20px",
          fontSize: 13,
          color: "#9B7FD4",
          lineHeight: 1.8,
        }}
      >
        Long-cycle themes are the deep structures — motifs that span the entire
        symbolic history. What persists. What defines.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {themes.map((theme, i) => (
          <ThemeCard key={i} theme={theme} />
        ))}
      </div>
    </div>
  );
}

function ThemeCard({ theme }) {
  const [expanded, setExpanded] = useState(true);
  const THEME_EMOJIS = {
    anchored_symbols: "⚓",
    persistent_constellations: "🌌",
    core_signatures: "🔑",
    atmospheric_drift: "🌊",
    dominant_stage: "🎵",
  };

  return (
    <div
      style={{
        background: "rgba(139,92,246,0.05)",
        border: "1px solid rgba(139,92,246,0.12)",
        borderRadius: 14,
        overflow: "hidden",
      }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: "100%",
          padding: "18px 22px",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <span style={{ fontSize: 22, lineHeight: 1 }}>
            {THEME_EMOJIS[theme.type] || "🌌"}
          </span>
          <div>
            <h4
              style={{
                margin: "0 0 2px",
                fontSize: 15,
                fontWeight: 700,
                color: "#E9D5FF",
              }}
            >
              {theme.title}
            </h4>
          </div>
        </div>
        {expanded ? (
          <ChevronUp size={14} color="#6B7280" />
        ) : (
          <ChevronDown size={14} color="#6B7280" />
        )}
      </button>
      {expanded && (
        <div
          style={{
            padding: "0 22px 20px",
            borderTop: "1px solid rgba(139,92,246,0.06)",
          }}
        >
          <p
            style={{
              margin: "12px 0 14px",
              fontSize: 13,
              color: "#C4B5FD",
              lineHeight: 1.9,
            }}
          >
            {theme.narrative}
          </p>

          {/* Type-specific content */}
          {theme.type === "anchored_symbols" && theme.symbols?.length > 0 && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {theme.symbols.map((sym, i) => (
                <div
                  key={i}
                  style={{
                    textAlign: "center",
                    padding: "8px 14px",
                    background: "rgba(255,255,255,0.03)",
                    borderRadius: 10,
                    border: "1px solid rgba(139,92,246,0.08)",
                  }}
                >
                  <span style={{ fontSize: 22 }}>{sym.visual}</span>
                  <p
                    style={{
                      margin: "4px 0 0",
                      fontSize: 11,
                      fontWeight: 600,
                      color: stg(sym.stage).color,
                    }}
                  >
                    {sym.symbol}
                  </p>
                  <p
                    style={{ margin: "1px 0 0", fontSize: 9, color: "#6B7280" }}
                  >
                    {sym.weight?.toFixed(1)}w
                  </p>
                </div>
              ))}
            </div>
          )}

          {theme.type === "persistent_constellations" &&
            theme.constellations?.length > 0 && (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {theme.constellations.map((c, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "12px 16px",
                      background: "rgba(192,132,252,0.04)",
                      borderRadius: 10,
                      border: "1px solid rgba(192,132,252,0.1)",
                    }}
                  >
                    <p
                      style={{
                        margin: "0 0 6px",
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#C084FC",
                      }}
                    >
                      {c.name}
                    </p>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {(c.members || []).map((m, j) => (
                        <span
                          key={j}
                          style={{
                            fontSize: 12,
                            padding: "2px 8px",
                            borderRadius: 8,
                            background: "rgba(255,255,255,0.04)",
                            color: "#C4B5FD",
                          }}
                        >
                          {m.visual} {m.symbol || m}
                        </span>
                      ))}
                    </div>
                    <p
                      style={{
                        margin: "6px 0 0",
                        fontSize: 9,
                        color: "#6B7280",
                        textTransform: "capitalize",
                      }}
                    >
                      {c.confidence} · {c.atmosphere || "mixed"} atmosphere
                    </p>
                  </div>
                ))}
              </div>
            )}

          {theme.type === "core_signatures" && theme.signatures?.length > 0 && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {theme.signatures.map((sig, i) => (
                <div
                  key={i}
                  style={{
                    padding: "8px 14px",
                    background: "rgba(255,255,255,0.03)",
                    borderRadius: 10,
                    border: `1px solid ${stg(sig.stage).border}`,
                    textAlign: "center",
                  }}
                >
                  <span style={{ fontSize: 20 }}>{sig.visual}</span>
                  <p
                    style={{
                      margin: "2px 0 0",
                      fontSize: 11,
                      fontWeight: 600,
                      color: stg(sig.stage).color,
                    }}
                  >
                    {sig.symbol}
                  </p>
                  <p
                    style={{
                      margin: "1px 0 0",
                      fontSize: 9,
                      color: "#6B7280",
                      textTransform: "capitalize",
                    }}
                  >
                    {sig.confidence}
                  </p>
                </div>
              ))}
            </div>
          )}

          {theme.type === "atmospheric_drift" && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "12px 18px",
                background: "rgba(139,92,246,0.04)",
                borderRadius: 10,
              }}
            >
              <div style={{ textAlign: "center" }}>
                <p
                  style={{
                    margin: 0,
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#FBBF24",
                    textTransform: "capitalize",
                  }}
                >
                  {theme.from}
                </p>
                <p style={{ margin: 0, fontSize: 9, color: "#6B7280" }}>
                  First
                </p>
              </div>
              <div
                style={{
                  flex: 1,
                  height: 2,
                  background: theme.shifted
                    ? "linear-gradient(90deg, #FBBF24, #A78BFA)"
                    : "#FBBF24",
                  borderRadius: 1,
                }}
              />
              <div style={{ textAlign: "center" }}>
                <p
                  style={{
                    margin: 0,
                    fontSize: 14,
                    fontWeight: 700,
                    color: theme.shifted ? "#A78BFA" : "#FBBF24",
                    textTransform: "capitalize",
                  }}
                >
                  {theme.to}
                </p>
                <p style={{ margin: 0, fontSize: 9, color: "#6B7280" }}>
                  Current
                </p>
              </div>
            </div>
          )}

          {theme.type === "dominant_stage" && theme.distribution && (
            <div>
              <div
                style={{
                  display: "flex",
                  gap: 3,
                  height: 8,
                  borderRadius: 4,
                  overflow: "hidden",
                  marginBottom: 6,
                }}
              >
                {Object.entries(theme.distribution)
                  .sort((a, b) => b[1] - a[1])
                  .map(([stage, pct]) => (
                    <div
                      key={stage}
                      style={{
                        width: `${pct}%`,
                        background: stg(stage).color,
                        borderRadius: 4,
                      }}
                      title={`${stage}: ${pct}%`}
                    />
                  ))}
              </div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {Object.entries(theme.distribution)
                  .sort((a, b) => b[1] - a[1])
                  .map(([stage, pct]) => (
                    <span
                      key={stage}
                      style={{ fontSize: 10, color: stg(stage).color }}
                    >
                      {stage} {pct}%
                    </span>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── SYNTHESIS TAB ───

function SynthesisTab({ synthesis }) {
  if (!synthesis)
    return <EmptySection message="Synthesis not yet available." />;

  return (
    <div>
      {/* Main narrative */}
      <div
        style={{
          background: "rgba(139,92,246,0.06)",
          borderRadius: 16,
          padding: "28px 26px",
          border: "1px solid rgba(139,92,246,0.12)",
          marginBottom: 24,
        }}
      >
        <p
          style={{
            margin: "0 0 8px",
            fontSize: 10,
            fontWeight: 700,
            color: "#7C6FA0",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Life-Era Synthesis
        </p>
        <p style={{ margin: 0, fontSize: 15, color: "#D4BFFF", lineHeight: 2 }}>
          {synthesis.narrative}
        </p>
      </div>

      {/* Current state */}
      {synthesis.currentChapter && (
        <div
          style={{
            background: stg(synthesis.currentChapter.stage).bg,
            border: `1px solid ${stg(synthesis.currentChapter.stage).border}`,
            borderRadius: 14,
            padding: "18px 22px",
            marginBottom: 16,
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
            Current Chapter
          </p>
          <h3
            style={{
              margin: "0 0 4px",
              fontSize: 18,
              fontWeight: 700,
              color: "#E9D5FF",
            }}
          >
            {synthesis.currentChapter.title}
          </h3>
          <p style={{ margin: 0, fontSize: 12, color: "#7C6FA0" }}>
            {synthesis.currentChapter.stage} ·{" "}
            {synthesis.currentChapter.atmosphere || "mixed"} atmosphere
          </p>
        </div>
      )}

      {/* Summary stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: 12,
        }}
      >
        <SynthStatCard
          label="Maturity"
          value={synthesis.maturityLevel}
          icon="🌳"
        />
        <SynthStatCard label="Wounds" value={synthesis.woundCount} icon="🔄" />
        <SynthStatCard
          label="Initiations"
          value={synthesis.initiationCount}
          icon="⚡"
        />
        <SynthStatCard label="Themes" value={synthesis.themeCount} icon="🌌" />
        <SynthStatCard
          label="Forecast Signals"
          value={synthesis.forecastSignals}
          icon="🔮"
        />
      </div>
    </div>
  );
}

function SynthStatCard({ label, value, icon }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(139,92,246,0.08)",
        borderRadius: 12,
        padding: "16px 18px",
        textAlign: "center",
      }}
    >
      <span style={{ fontSize: 22 }}>{icon}</span>
      <p
        style={{
          margin: "6px 0 2px",
          fontSize: 18,
          fontWeight: 700,
          color: "#E9D5FF",
          textTransform: "capitalize",
        }}
      >
        {value}
      </p>
      <p
        style={{
          margin: 0,
          fontSize: 10,
          color: "#6B7280",
          textTransform: "uppercase",
        }}
      >
        {label}
      </p>
    </div>
  );
}

// ─── SHARED COMPONENTS ───

function StatCard({ label, value }) {
  return (
    <div
      style={{
        flex: "1 1 120px",
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(139,92,246,0.08)",
        borderRadius: 10,
        padding: "12px 16px",
        textAlign: "center",
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: 16,
          fontWeight: 700,
          color: "#E9D5FF",
          textTransform: "capitalize",
        }}
      >
        {value}
      </p>
      <p
        style={{
          margin: "2px 0 0",
          fontSize: 9,
          color: "#6B7280",
          textTransform: "uppercase",
        }}
      >
        {label}
      </p>
    </div>
  );
}

function QuickInsightCard({ icon, title, value, detail }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(139,92,246,0.08)",
        borderRadius: 12,
        padding: "14px 18px",
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
        <span style={{ fontSize: 18 }}>{icon}</span>
        <span style={{ fontSize: 18, fontWeight: 700, color: "#E9D5FF" }}>
          {value}
        </span>
        <span style={{ fontSize: 12, color: "#7C6FA0" }}>{title}</span>
      </div>
      <p
        style={{
          margin: 0,
          fontSize: 11,
          color: "#9B7FD4",
          fontStyle: "italic",
        }}
      >
        {detail}
      </p>
    </div>
  );
}

function EmptySection({ message }) {
  return (
    <div style={{ textAlign: "center", padding: "60px 20px" }}>
      <div style={{ fontSize: 36, marginBottom: 12 }}>🌑</div>
      <p
        style={{
          fontSize: 14,
          color: "#7C6FA0",
          lineHeight: 1.7,
          maxWidth: 400,
          margin: "0 auto",
        }}
      >
        {message}
      </p>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0F0A1E",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📖</div>
        <p style={{ color: "#9B7FD4", fontSize: 14 }}>
          Composing your mythology…
        </p>
      </div>
    </div>
  );
}

function ErrorScreen() {
  return (
    <div style={{ minHeight: "100vh", background: "#0F0A1E", padding: 40 }}>
      <p style={{ color: "#F87171", textAlign: "center" }}>
        Failed to load mythology.
      </p>
    </div>
  );
}

function NotReadyScreen({ reason }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0F0A1E",
        padding: "80px 24px",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 48, marginBottom: 16 }}>📖</div>
      <h2 style={{ color: "#E9D5FF", marginBottom: 8 }}>
        The Mythology Awaits
      </h2>
      <p
        style={{
          color: "#7C6FA0",
          maxWidth: 440,
          margin: "0 auto",
          lineHeight: 1.7,
        }}
      >
        {reason}
      </p>
      <p style={{ color: "#6B7280", fontSize: 12, marginTop: 16 }}>
        A symbolic autobiography needs time and depth to take shape. Keep
        engaging with your practice.
      </p>
    </div>
  );
}
