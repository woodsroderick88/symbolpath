import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronLeft,
  Search,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Clock,
  GitCompare,
  Compass,
  Repeat,
  Layers,
  Sparkles,
} from "lucide-react";

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
};
const stg = (s) =>
  STAGE[s] || {
    color: "#9CA3AF",
    bg: "rgba(156,163,175,0.08)",
    border: "rgba(156,163,175,0.25)",
    emoji: "🌀",
  };

const TABS = [
  { id: "search", label: "Search", icon: Search, emoji: "🔍" },
  { id: "timeline", label: "Timeline", icon: Layers, emoji: "📅" },
  { id: "climates", label: "Climates", icon: Sparkles, emoji: "🌤️" },
  { id: "compare", label: "Compare", icon: GitCompare, emoji: "⚖️" },
  { id: "constellation", label: "Constellations", icon: Compass, emoji: "✨" },
  { id: "thresholds", label: "Thresholds", icon: Repeat, emoji: "🚪" },
];

export default function SymbolicMemoryPage() {
  const [activeTab, setActiveTab] = useState("search");

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

        <div style={{ marginBottom: 32 }}>
          <h1
            style={{
              margin: "0 0 6px",
              fontSize: 28,
              fontWeight: 700,
              color: "#E9D5FF",
            }}
          >
            Symbolic Memory
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: 14,
              color: "#7C6FA0",
              lineHeight: 1.6,
            }}
          >
            When have you been here before?
          </p>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            display: "flex",
            gap: 6,
            marginBottom: 32,
            overflowX: "auto",
            paddingBottom: 4,
          }}
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: "8px 16px",
                  borderRadius: 10,
                  border: `1px solid ${isActive ? "rgba(139,92,246,0.4)" : "rgba(139,92,246,0.1)"}`,
                  background: isActive
                    ? "rgba(139,92,246,0.12)"
                    : "transparent",
                  color: isActive ? "#E9D5FF" : "#7C6FA0",
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 400,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span style={{ fontSize: 14 }}>{tab.emoji}</span> {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab === "search" && <SearchTab />}
        {activeTab === "timeline" && <TimelineTab />}
        {activeTab === "climates" && <ClimatesTab />}
        {activeTab === "compare" && <CompareTab />}
        {activeTab === "constellation" && <ConstellationTab />}
        {activeTab === "thresholds" && <ThresholdsTab />}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SEARCH TAB
// ═══════════════════════════════════════════════════════════════════════════════
function SearchTab() {
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["memory-search", searchTerm],
    queryFn: async () => {
      if (!searchTerm) return null;
      const res = await fetch(
        `/api/symbolpath/memory?action=search&q=${encodeURIComponent(searchTerm)}`,
      );
      if (!res.ok) throw new Error("Search failed");
      return res.json();
    },
    enabled: !!searchTerm,
  });

  const handleSearch = useCallback(() => {
    if (query.trim()) setSearchTerm(query.trim());
  }, [query]);

  const suggestions = [
    "Storm",
    "Crisis",
    "Mirror",
    "turbulent",
    "Crisis to Growth",
    "last 4 weeks",
    "luminous",
  ];

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Search symbolic memory…"
          style={{
            flex: 1,
            padding: "12px 16px",
            borderRadius: 12,
            border: "1px solid rgba(139,92,246,0.2)",
            background: "rgba(255,255,255,0.03)",
            color: "#E9D5FF",
            fontSize: 14,
            outline: "none",
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: "12px 20px",
            borderRadius: 12,
            border: "1px solid rgba(139,92,246,0.3)",
            background: "rgba(139,92,246,0.1)",
            color: "#C4B5FD",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 13,
          }}
        >
          <Search size={14} /> Search
        </button>
      </div>

      {/* Suggestions */}
      {!searchTerm && (
        <div style={{ marginBottom: 24 }}>
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
            Try searching for
          </p>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setQuery(s);
                  setSearchTerm(s);
                }}
                style={{
                  padding: "6px 14px",
                  borderRadius: 20,
                  border: "1px solid rgba(139,92,246,0.12)",
                  background: "rgba(255,255,255,0.02)",
                  color: "#9B7FD4",
                  fontSize: 12,
                  cursor: "pointer",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {isLoading && <LoadingState text="Searching symbolic memory…" />}
      {error && (
        <p style={{ color: "#F87171", fontSize: 13 }}>
          Search failed. Try again.
        </p>
      )}
      {data && <SearchResults data={data} />}
    </div>
  );
}

function SearchResults({ data }) {
  if (!data || data.total === 0) {
    return (
      <p
        style={{
          color: "#7C6FA0",
          fontSize: 14,
          textAlign: "center",
          padding: "40px 0",
        }}
      >
        No memories found. Try a different search.
      </p>
    );
  }

  return (
    <div>
      <p
        style={{
          margin: "0 0 16px",
          fontSize: 12,
          color: "#7C6FA0",
          fontStyle: "italic",
        }}
      >
        {data.interpretation}
      </p>
      {data.results.map((r, i) => (
        <SearchResultCard key={i} result={r} />
      ))}
    </div>
  );
}

function SearchResultCard({ result }) {
  const [open, setOpen] = useState(true);

  if (result.type === "symbol_history") {
    const sv = stg(result.stage);
    return (
      <div
        style={{
          background: sv.bg,
          border: `1px solid ${sv.border}`,
          borderRadius: 14,
          padding: "20px 22px",
          marginBottom: 12,
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
          <span style={{ fontSize: 28 }}>{result.visual}</span>
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: 18,
                fontWeight: 700,
                color: "#E9D5FF",
              }}
            >
              {result.symbol}
            </h3>
            <p style={{ margin: 0, fontSize: 12, color: "#7C6FA0" }}>
              {result.totalAppearances} appearances · {result.stage}
            </p>
          </div>
          {result.gravity?.anchored && (
            <span
              style={{
                fontSize: 9,
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: 6,
                background: "rgba(52,211,153,0.15)",
                color: "#34D399",
                textTransform: "uppercase",
              }}
            >
              Anchored
            </span>
          )}
        </div>
        <p
          style={{
            margin: "0 0 12px",
            fontSize: 13,
            color: "#C4B5FD",
            lineHeight: 1.7,
            fontStyle: "italic",
          }}
        >
          {result.narrative}
        </p>
        {/* Stage distribution */}
        <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
          {Object.entries(result.stageDistribution)
            .sort((a, b) => b[1] - a[1])
            .map(([stage, count]) => (
              <div key={stage} style={{ textAlign: "center" }}>
                <p
                  style={{
                    margin: 0,
                    fontSize: 14,
                    fontWeight: 700,
                    color: stg(stage).color,
                  }}
                >
                  {count}
                </p>
                <p style={{ margin: 0, fontSize: 9, color: "#6B7280" }}>
                  {stage}
                </p>
              </div>
            ))}
        </div>
        {result.gravity && (
          <div
            style={{
              display: "flex",
              gap: 16,
              paddingTop: 10,
              borderTop: `1px solid ${sv.border}`,
            }}
          >
            <MiniMetric
              label="Weight"
              value={result.gravity.currentWeight.toFixed(1)}
            />
            <MiniMetric
              label="Peak"
              value={result.gravity.peakWeight.toFixed(1)}
            />
          </div>
        )}
        {/* Recent appearances */}
        <button
          onClick={() => setOpen(!open)}
          style={{
            marginTop: 10,
            background: "none",
            border: "none",
            color: "#7C6FA0",
            fontSize: 11,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          {open ? <ChevronUp size={12} /> : <ChevronDown size={12} />} Recent
          appearances
        </button>
        {open && result.recentAppearances && (
          <div
            style={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            {result.recentAppearances.map((a, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                  fontSize: 11,
                  color: "#9B7FD4",
                }}
              >
                <span
                  style={{
                    color: "#6B7280",
                    fontFamily: "monospace",
                    fontSize: 10,
                  }}
                >
                  {new Date(a.date).toLocaleDateString()}
                </span>
                <span style={{ color: stg(a.stage).color }}>{a.stage}</span>
                <span style={{ color: "#4B5563" }}>{a.source}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (result.type === "stage_history") {
    const sv = stg(result.stage);
    return (
      <div
        style={{
          background: sv.bg,
          border: `1px solid ${sv.border}`,
          borderRadius: 14,
          padding: "20px 22px",
          marginBottom: 12,
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
          <span style={{ fontSize: 24 }}>{sv.emoji}</span>
          <h3
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 700,
              color: "#E9D5FF",
            }}
          >
            {result.stage} History
          </h3>
          <span style={{ fontSize: 12, color: "#6B7280" }}>
            {result.totalWeeks} weeks
          </span>
        </div>
        <p
          style={{
            margin: "0 0 12px",
            fontSize: 13,
            color: "#C4B5FD",
            lineHeight: 1.7,
            fontStyle: "italic",
          }}
        >
          {result.narrative}
        </p>
        {result.recentWeeks?.slice(0, 8).map((w, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              padding: "6px 0",
              borderBottom: "1px solid rgba(139,92,246,0.06)",
              fontSize: 12,
            }}
          >
            <span
              style={{
                color: "#6B7280",
                fontFamily: "monospace",
                fontSize: 10,
                minWidth: 80,
              }}
            >
              {w.week}
            </span>
            <span style={{ color: sv.color, fontWeight: 600 }}>
              {w.totalEvents} events
            </span>
            <span style={{ color: "#7C6FA0" }}>
              {w.symbols.map((s) => s.symbol).join(", ")}
            </span>
          </div>
        ))}
      </div>
    );
  }

  if (result.type === "threshold_history") {
    return (
      <div
        style={{
          background: "rgba(251,191,36,0.04)",
          border: "1px solid rgba(251,191,36,0.15)",
          borderRadius: 14,
          padding: "20px 22px",
          marginBottom: 12,
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
          <span style={{ fontSize: 20 }}>🚪</span>
          <h3
            style={{
              margin: 0,
              fontSize: 16,
              fontWeight: 700,
              color: "#E9D5FF",
            }}
          >
            {result.pattern}
          </h3>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#FBBF24",
              background: "rgba(251,191,36,0.1)",
              padding: "2px 8px",
              borderRadius: 6,
            }}
          >
            {result.count}×
          </span>
        </div>
        <p
          style={{
            margin: "0 0 12px",
            fontSize: 13,
            color: "#C4B5FD",
            lineHeight: 1.7,
            fontStyle: "italic",
          }}
        >
          {result.narrative}
        </p>
        {result.occurrences?.slice(0, 6).map((o, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              padding: "4px 0",
              fontSize: 12,
            }}
          >
            <span
              style={{
                color: "#6B7280",
                fontFamily: "monospace",
                fontSize: 10,
              }}
            >
              {new Date(o.date).toLocaleDateString()}
            </span>
            <span>
              {o.prevVisual} {o.prevSymbol} → {o.visual} {o.symbol}
            </span>
          </div>
        ))}
      </div>
    );
  }

  // Generic fallback
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.02)",
        borderRadius: 14,
        padding: "20px 22px",
        border: "1px solid rgba(139,92,246,0.1)",
        marginBottom: 12,
      }}
    >
      <p style={{ margin: 0, fontSize: 13, color: "#C4B5FD", lineHeight: 1.7 }}>
        {result.narrative}
      </p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TIMELINE TAB
// ═══════════════════════════════════════════════════════════════════════════════
function TimelineTab() {
  const { data, isLoading } = useQuery({
    queryKey: ["memory-timeline"],
    queryFn: async () => {
      const res = await fetch("/api/symbolpath/memory?action=timeline");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  if (isLoading) return <LoadingState text="Compressing timeline…" />;
  if (!data) return null;

  return (
    <div>
      {/* Full Arc */}
      {data.fullArc && (
        <div
          style={{
            background: "rgba(139,92,246,0.06)",
            borderRadius: 16,
            padding: "22px 24px",
            border: "1px solid rgba(139,92,246,0.15)",
            marginBottom: 24,
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
            Full Arc
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 14,
            }}
          >
            <div style={{ textAlign: "center" }}>
              <span style={{ fontSize: 22 }}>
                {data.fullArc.from.topSymbol?.visual}
              </span>
              <p
                style={{
                  margin: 0,
                  fontSize: 11,
                  color: stg(data.fullArc.from.stage).color,
                  fontWeight: 600,
                }}
              >
                {data.fullArc.from.stage}
              </p>
              <p style={{ margin: 0, fontSize: 9, color: "#6B7280" }}>
                {data.fullArc.from.month}
              </p>
            </div>
            <div
              style={{
                flex: 1,
                height: 2,
                background:
                  "linear-gradient(90deg, rgba(248,113,113,0.3), rgba(251,191,36,0.3))",
                borderRadius: 1,
              }}
            />
            <div style={{ textAlign: "center" }}>
              <span style={{ fontSize: 22 }}>
                {data.fullArc.to.topSymbol?.visual}
              </span>
              <p
                style={{
                  margin: 0,
                  fontSize: 11,
                  color: stg(data.fullArc.to.stage).color,
                  fontWeight: 600,
                }}
              >
                {data.fullArc.to.stage}
              </p>
              <p style={{ margin: 0, fontSize: 9, color: "#6B7280" }}>
                {data.fullArc.to.month}
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
            {data.fullArc.narrative}
          </p>
        </div>
      )}

      {/* Monthly Timeline */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {data.months?.map((m, i) => {
          const sv = stg(m.dominantStage);
          return (
            <div
              key={i}
              style={{
                background: sv.bg,
                border: `1px solid ${sv.border}`,
                borderRadius: 14,
                padding: "16px 20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 10,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#E9D5FF",
                      fontFamily: "monospace",
                    }}
                  >
                    {m.month}
                  </span>
                  <span
                    style={{ fontSize: 12, fontWeight: 600, color: sv.color }}
                  >
                    {m.dominantStage} ({m.dominantPercentage}%)
                  </span>
                </div>
                <span style={{ fontSize: 11, color: "#6B7280" }}>
                  {m.totalEvents} events
                </span>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {m.topSymbols.map((s, j) => (
                  <span
                    key={j}
                    style={{
                      fontSize: 12,
                      padding: "3px 10px",
                      borderRadius: 16,
                      background: "rgba(255,255,255,0.04)",
                      color: "#C4B5FD",
                      border: `1px solid ${sv.border}`,
                    }}
                  >
                    {s.visual} {s.symbol}{" "}
                    <span style={{ color: "#6B7280", fontSize: 10 }}>
                      ({s.count})
                    </span>
                  </span>
                ))}
              </div>
              {m.dominantAtmosphere && (
                <p
                  style={{
                    margin: "8px 0 0",
                    fontSize: 10,
                    color: "#7C6FA0",
                    textTransform: "capitalize",
                  }}
                >
                  Atmosphere: {m.dominantAtmosphere}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CLIMATES TAB
// ═══════════════════════════════════════════════════════════════════════════════
function ClimatesTab() {
  const [climateFilter, setClimateFilter] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["memory-climates", climateFilter],
    queryFn: async () => {
      const params = climateFilter
        ? `&climate=${encodeURIComponent(climateFilter)}`
        : "";
      const res = await fetch(
        `/api/symbolpath/memory?action=climates${params}`,
      );
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  if (isLoading) return <LoadingState text="Retrieving climates…" />;
  if (!data) return null;

  return (
    <div>
      {/* Climate filters */}
      {data.allClimates && (
        <div style={{ marginBottom: 20 }}>
          <p
            style={{
              margin: "0 0 8px",
              fontSize: 10,
              fontWeight: 700,
              color: "#7C6FA0",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            Filter by climate
          </p>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <button
              onClick={() => setClimateFilter("")}
              style={{
                padding: "5px 12px",
                borderRadius: 16,
                border: `1px solid ${!climateFilter ? "rgba(139,92,246,0.4)" : "rgba(139,92,246,0.1)"}`,
                background: !climateFilter
                  ? "rgba(139,92,246,0.12)"
                  : "transparent",
                color: !climateFilter ? "#E9D5FF" : "#7C6FA0",
                fontSize: 11,
                cursor: "pointer",
              }}
            >
              All
            </button>
            {data.allClimates.map((c) => (
              <button
                key={c}
                onClick={() => setClimateFilter(c)}
                style={{
                  padding: "5px 12px",
                  borderRadius: 16,
                  border: `1px solid ${climateFilter === c ? "rgba(139,92,246,0.4)" : "rgba(139,92,246,0.1)"}`,
                  background:
                    climateFilter === c
                      ? "rgba(139,92,246,0.12)"
                      : "transparent",
                  color: climateFilter === c ? "#E9D5FF" : "#7C6FA0",
                  fontSize: 11,
                  cursor: "pointer",
                  textTransform: "capitalize",
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      <p style={{ margin: "0 0 16px", fontSize: 12, color: "#6B7280" }}>
        {data.total} period{data.total !== 1 ? "s" : ""} found
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {data.periods?.map((p, i) => (
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
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#E9D5FF",
                  textTransform: "capitalize",
                }}
              >
                {p.climate}
              </span>
              <span style={{ fontSize: 11, color: "#6B7280" }}>
                {p.durationWeeks}w · {p.totalEvents} events
              </span>
            </div>
            <p
              style={{
                margin: "0 0 6px",
                fontSize: 11,
                color: "#7C6FA0",
                fontFamily: "monospace",
              }}
            >
              {p.startDate} → {p.endDate}
            </p>
            <p
              style={{
                margin: 0,
                fontSize: 12,
                color: "#C4B5FD",
                lineHeight: 1.6,
                fontStyle: "italic",
              }}
            >
              {p.narrative}
            </p>
          </div>
        ))}
      </div>

      {data.periods?.length === 0 && (
        <p
          style={{
            color: "#7C6FA0",
            fontSize: 14,
            textAlign: "center",
            padding: "40px 0",
          }}
        >
          No climate periods found for this filter.
        </p>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPARE TAB
// ═══════════════════════════════════════════════════════════════════════════════
function CompareTab() {
  const [periodA, setPeriodA] = useState({
    start: "2026-03-01",
    end: "2026-03-31",
  });
  const [periodB, setPeriodB] = useState({
    start: "2026-05-01",
    end: "2026-05-13",
  });
  const [comparing, setComparing] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: [
      "memory-compare",
      periodA.start,
      periodA.end,
      periodB.start,
      periodB.end,
    ],
    queryFn: async () => {
      const res = await fetch(
        `/api/symbolpath/memory?action=compare&aStart=${periodA.start}&aEnd=${periodA.end}&bStart=${periodB.start}&bEnd=${periodB.end}`,
      );
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    enabled: comparing,
  });

  return (
    <div>
      <div
        style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" }}
      >
        <PeriodInput
          label="Period A"
          period={periodA}
          onChange={setPeriodA}
          color="#60A5FA"
        />
        <PeriodInput
          label="Period B"
          period={periodB}
          onChange={setPeriodB}
          color="#FBBF24"
        />
      </div>
      <button
        onClick={() => {
          setComparing(true);
          refetch();
        }}
        style={{
          padding: "10px 24px",
          borderRadius: 10,
          border: "1px solid rgba(139,92,246,0.3)",
          background: "rgba(139,92,246,0.1)",
          color: "#C4B5FD",
          fontSize: 13,
          cursor: "pointer",
          marginBottom: 24,
        }}
      >
        <GitCompare
          size={14}
          style={{ marginRight: 6, verticalAlign: "middle" }}
        />{" "}
        Compare
      </button>

      {isLoading && <LoadingState text="Comparing periods…" />}
      {data && <CompareResults data={data} />}
    </div>
  );
}

function PeriodInput({ label, period, onChange, color }) {
  return (
    <div style={{ flex: 1, minWidth: 200 }}>
      <p
        style={{
          margin: "0 0 6px",
          fontSize: 10,
          fontWeight: 700,
          color,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </p>
      <div style={{ display: "flex", gap: 6 }}>
        <input
          type="date"
          value={period.start}
          onChange={(e) => onChange({ ...period, start: e.target.value })}
          style={{
            flex: 1,
            padding: "8px 10px",
            borderRadius: 8,
            border: "1px solid rgba(139,92,246,0.15)",
            background: "rgba(255,255,255,0.03)",
            color: "#C4B5FD",
            fontSize: 12,
          }}
        />
        <input
          type="date"
          value={period.end}
          onChange={(e) => onChange({ ...period, end: e.target.value })}
          style={{
            flex: 1,
            padding: "8px 10px",
            borderRadius: 8,
            border: "1px solid rgba(139,92,246,0.15)",
            background: "rgba(255,255,255,0.03)",
            color: "#C4B5FD",
            fontSize: 12,
          }}
        />
      </div>
    </div>
  );
}

function CompareResults({ data }) {
  const { periodA: a, periodB: b, comparison: c } = data;
  return (
    <div>
      {/* Narrative */}
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
            margin: 0,
            fontSize: 13,
            color: "#C4B5FD",
            lineHeight: 1.8,
            fontStyle: "italic",
          }}
        >
          {c.narrative}
        </p>
      </div>

      {/* Side by side */}
      <div
        style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}
      >
        <PeriodSummary period={a} label="Period A" color="#60A5FA" />
        <PeriodSummary period={b} label="Period B" color="#FBBF24" />
      </div>

      {/* Symbol comparison */}
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        {c.sharedSymbols?.length > 0 && (
          <SymbolGroup
            label="Shared"
            symbols={c.sharedSymbols}
            color="#34D399"
          />
        )}
        {c.onlyInA?.length > 0 && (
          <SymbolGroup label="Only in A" symbols={c.onlyInA} color="#60A5FA" />
        )}
        {c.onlyInB?.length > 0 && (
          <SymbolGroup label="Only in B" symbols={c.onlyInB} color="#FBBF24" />
        )}
      </div>
    </div>
  );
}

function PeriodSummary({ period, label, color }) {
  const sv = stg(period.dominantStage);
  return (
    <div
      style={{
        flex: 1,
        minWidth: 200,
        background: sv.bg,
        border: `1px solid ${sv.border}`,
        borderRadius: 14,
        padding: "16px 18px",
      }}
    >
      <p
        style={{
          margin: "0 0 8px",
          fontSize: 10,
          fontWeight: 700,
          color,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </p>
      <p
        style={{
          margin: 0,
          fontSize: 11,
          color: "#7C6FA0",
          fontFamily: "monospace",
        }}
      >
        {period.startDate} → {period.endDate}
      </p>
      <p
        style={{
          margin: "6px 0 0",
          fontSize: 14,
          fontWeight: 700,
          color: sv.color,
        }}
      >
        {period.dominantStage} ({period.dominantPercentage}%)
      </p>
      <p style={{ margin: "4px 0 0", fontSize: 11, color: "#7C6FA0" }}>
        {period.totalEvents} events · {period.symbolCount} symbols
      </p>
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 10 }}>
        {period.topSymbols?.slice(0, 5).map((s, i) => (
          <span
            key={i}
            style={{
              fontSize: 11,
              padding: "2px 8px",
              borderRadius: 12,
              background: "rgba(255,255,255,0.04)",
              color: "#C4B5FD",
            }}
          >
            {s.visual} {s.symbol}
          </span>
        ))}
      </div>
    </div>
  );
}

function SymbolGroup({ label, symbols, color }) {
  return (
    <div>
      <p
        style={{
          margin: "0 0 6px",
          fontSize: 9,
          fontWeight: 700,
          color,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        {label}
      </p>
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        {symbols.map((s, i) => (
          <span
            key={i}
            style={{
              fontSize: 13,
              padding: "3px 10px",
              borderRadius: 12,
              background: `${color}15`,
              color,
              fontWeight: 600,
            }}
          >
            {s.visual} {s.symbol}
          </span>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTELLATION TAB
// ═══════════════════════════════════════════════════════════════════════════════
function ConstellationTab() {
  const [symbolInput, setSymbolInput] = useState("Storm, Mirror");
  const [searchSymbols, setSearchSymbols] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["memory-constellation", searchSymbols],
    queryFn: async () => {
      const res = await fetch(
        `/api/symbolpath/memory?action=constellation&symbols=${encodeURIComponent(searchSymbols)}`,
      );
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    enabled: !!searchSymbols,
  });

  return (
    <div>
      <p
        style={{
          margin: "0 0 12px",
          fontSize: 13,
          color: "#7C6FA0",
          lineHeight: 1.6,
        }}
      >
        Find past moments where specific symbols co-occurred.
      </p>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <input
          value={symbolInput}
          onChange={(e) => setSymbolInput(e.target.value)}
          placeholder="e.g. Storm, Mirror, Flame"
          style={{
            flex: 1,
            padding: "12px 16px",
            borderRadius: 12,
            border: "1px solid rgba(139,92,246,0.2)",
            background: "rgba(255,255,255,0.03)",
            color: "#E9D5FF",
            fontSize: 14,
            outline: "none",
          }}
        />
        <button
          onClick={() => setSearchSymbols(symbolInput)}
          style={{
            padding: "12px 20px",
            borderRadius: 12,
            border: "1px solid rgba(139,92,246,0.3)",
            background: "rgba(139,92,246,0.1)",
            color: "#C4B5FD",
            cursor: "pointer",
            fontSize: 13,
          }}
        >
          Find
        </button>
      </div>

      {isLoading && <LoadingState text="Revisiting constellations…" />}
      {data && (
        <div>
          <p style={{ margin: "0 0 16px", fontSize: 12, color: "#6B7280" }}>
            {data.total} window{data.total !== 1 ? "s" : ""} where{" "}
            {data.searchedFor?.join(" + ")} co-occurred
            {data.partial ? " (partial overlap)" : ""}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {data.windows?.map((w, i) => {
              const domSv = stg(w.dominantStage);
              return (
                <div
                  key={i}
                  style={{
                    background: domSv.bg,
                    border: `1px solid ${domSv.border}`,
                    borderRadius: 12,
                    padding: "14px 18px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 6,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#E9D5FF",
                        fontFamily: "monospace",
                      }}
                    >
                      {w.weekStart}
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: domSv.color,
                      }}
                    >
                      {w.dominantStage} · {w.totalEvents} events
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {w.presentSymbols?.map((s, j) => (
                      <span
                        key={j}
                        style={{
                          fontSize: 12,
                          padding: "2px 8px",
                          borderRadius: 12,
                          background: "rgba(255,255,255,0.04)",
                          color: "#C4B5FD",
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
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// THRESHOLDS TAB
// ═══════════════════════════════════════════════════════════════════════════════
function ThresholdsTab() {
  const [fromStage, setFromStage] = useState("");
  const [toStage, setToStage] = useState("");
  const [searching, setSearching] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["memory-thresholds", fromStage, toStage],
    queryFn: async () => {
      const params = [];
      if (fromStage) params.push(`from=${fromStage}`);
      if (toStage) params.push(`to=${toStage}`);
      const qs = params.length > 0 ? `&${params.join("&")}` : "";
      const res = await fetch(`/api/symbolpath/memory?action=thresholds${qs}`);
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    enabled: searching,
  });

  const stages = [
    "",
    "Awakening",
    "Growth",
    "Crisis",
    "Integration",
    "Mastery",
  ];

  return (
    <div>
      <p
        style={{
          margin: "0 0 12px",
          fontSize: 13,
          color: "#7C6FA0",
          lineHeight: 1.6,
        }}
      >
        Find repeated stage transitions across your history.
      </p>
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "flex-end",
          marginBottom: 20,
          flexWrap: "wrap",
        }}
      >
        <div>
          <p
            style={{
              margin: "0 0 4px",
              fontSize: 10,
              fontWeight: 700,
              color: "#7C6FA0",
              textTransform: "uppercase",
            }}
          >
            From Stage
          </p>
          <select
            value={fromStage}
            onChange={(e) => setFromStage(e.target.value)}
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid rgba(139,92,246,0.2)",
              background: "#1a1030",
              color: "#E9D5FF",
              fontSize: 13,
            }}
          >
            {stages.map((s) => (
              <option key={s} value={s}>
                {s || "Any"}
              </option>
            ))}
          </select>
        </div>
        <span style={{ fontSize: 18, color: "#6B7280", paddingBottom: 10 }}>
          →
        </span>
        <div>
          <p
            style={{
              margin: "0 0 4px",
              fontSize: 10,
              fontWeight: 700,
              color: "#7C6FA0",
              textTransform: "uppercase",
            }}
          >
            To Stage
          </p>
          <select
            value={toStage}
            onChange={(e) => setToStage(e.target.value)}
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid rgba(139,92,246,0.2)",
              background: "#1a1030",
              color: "#E9D5FF",
              fontSize: 13,
            }}
          >
            {stages.map((s) => (
              <option key={s} value={s}>
                {s || "Any"}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={() => {
            setSearching(true);
            refetch();
          }}
          style={{
            padding: "10px 20px",
            borderRadius: 10,
            border: "1px solid rgba(139,92,246,0.3)",
            background: "rgba(139,92,246,0.1)",
            color: "#C4B5FD",
            cursor: "pointer",
            fontSize: 13,
          }}
        >
          Find Thresholds
        </button>
      </div>

      {isLoading && <LoadingState text="Searching thresholds…" />}
      {data && (
        <div>
          <p style={{ margin: "0 0 16px", fontSize: 12, color: "#6B7280" }}>
            {data.total} threshold type{data.total !== 1 ? "s" : ""} found
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {data.thresholds?.map((t, i) => {
              const fromSv = stg(t.from);
              const toSv = stg(t.to);
              return (
                <div
                  key={i}
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    borderRadius: 14,
                    padding: "18px 20px",
                    border: "1px solid rgba(139,92,246,0.1)",
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
                        color: fromSv.color,
                      }}
                    >
                      {t.from}
                    </span>
                    <span style={{ fontSize: 14, color: "#6B7280" }}>→</span>
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: toSv.color,
                      }}
                    >
                      {t.to}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#FBBF24",
                        background: "rgba(251,191,36,0.1)",
                        padding: "2px 8px",
                        borderRadius: 6,
                      }}
                    >
                      {t.count}×
                    </span>
                  </div>
                  <p
                    style={{
                      margin: "0 0 10px",
                      fontSize: 12,
                      color: "#C4B5FD",
                      lineHeight: 1.7,
                      fontStyle: "italic",
                    }}
                  >
                    {t.narrative}
                  </p>
                  {t.occurrences?.slice(0, 5).map((o, j) => (
                    <div
                      key={j}
                      style={{
                        display: "flex",
                        gap: 8,
                        alignItems: "center",
                        padding: "4px 0",
                        fontSize: 11,
                        color: "#9B7FD4",
                        borderBottom: "1px solid rgba(139,92,246,0.04)",
                      }}
                    >
                      <span
                        style={{
                          color: "#6B7280",
                          fontFamily: "monospace",
                          fontSize: 10,
                          minWidth: 80,
                        }}
                      >
                        {new Date(o.date).toLocaleDateString()}
                      </span>
                      <span>
                        {o.prevVisual} {o.prevSymbol}
                      </span>
                      <span style={{ color: "#6B7280" }}>→</span>
                      <span>
                        {o.visual} {o.symbol}
                      </span>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SHARED
// ═══════════════════════════════════════════════════════════════════════════════
function LoadingState({ text }) {
  return (
    <div style={{ textAlign: "center", padding: "50px 0" }}>
      <div style={{ fontSize: 36, marginBottom: 12 }}>🔮</div>
      <p style={{ color: "#9B7FD4", fontSize: 14 }}>{text}</p>
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
