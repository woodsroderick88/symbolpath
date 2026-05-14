import { useState, useEffect, useCallback } from "react";
import { Map, Eye } from "lucide-react";

const STAGE_CONFIG = {
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
const STAGE_ORDER = ["Awakening", "Growth", "Crisis", "Integration", "Mastery"];

export default function SymbolMap() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSym, setSelectedSym] = useState(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/symbolpath/symbolmap?userId=anonymous");
      if (res.ok) setData(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 60, color: "#9B7FD4" }}>
        Loading symbol map...
      </div>
    );
  }
  if (!data) {
    return (
      <div style={{ textAlign: "center", padding: 60, color: "#9B7FD4" }}>
        Failed to load map.
      </div>
    );
  }

  const { nodes, connections, stats } = data;
  const selectedConnections = selectedSym
    ? connections.filter(
        (c) => c.fromId === selectedSym.id || c.toId === selectedSym.id,
      )
    : [];

  const connectedIds = new Set();
  for (const c of selectedConnections) {
    connectedIds.add(c.fromId);
    connectedIds.add(c.toId);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header + Stats */}
      <div>
        <h2
          style={{ margin: 0, color: "#E9D5FF", fontSize: 18, fontWeight: 700 }}
        >
          Symbol Map
        </h2>
        <p style={{ margin: "4px 0 0", color: "#9B7FD4", fontSize: 13 }}>
          {stats.totalEncountered} of {stats.totalSymbols} symbols discovered (
          {stats.completionPct}%)
        </p>
      </div>

      {/* Completion bar */}
      <div
        style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(139,92,246,0.2)",
          borderRadius: 16,
          padding: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 14,
          }}
        >
          <Map size={15} style={{ color: "#A78BFA" }} />
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#C4B5FD",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Discovery Progress
          </span>
        </div>
        {stats.stageCompletion.map((sc) => {
          const cfg = STAGE_CONFIG[sc.stage];
          return (
            <div key={sc.stage} style={{ marginBottom: 10 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 4,
                }}
              >
                <span style={{ fontSize: 13, color: "#D1D5DB" }}>
                  {cfg.emoji} {sc.stage}
                </span>
                <span
                  style={{ fontSize: 12, color: cfg.color, fontWeight: 600 }}
                >
                  {sc.encountered}/{sc.total}
                </span>
              </div>
              <div
                style={{
                  height: 6,
                  borderRadius: 3,
                  background: "rgba(255,255,255,0.05)",
                }}
              >
                <div
                  style={{
                    height: 6,
                    borderRadius: 3,
                    background: cfg.color,
                    width: sc.pct + "%",
                    transition: "width 0.8s",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Symbol grid by stage */}
      {nodes.map((stageGroup) => {
        const cfg = STAGE_CONFIG[stageGroup.stage];
        return (
          <div
            key={stageGroup.stage}
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(139,92,246,0.15)",
              borderRadius: 16,
              padding: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 14,
              }}
            >
              <span style={{ fontSize: 18 }}>{cfg.emoji}</span>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: cfg.color,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                {stageGroup.stage}
              </span>
              <span style={{ fontSize: 11, color: "#6B7280" }}>
                · {stageGroup.symbols.filter((s) => s.encountered).length}/
                {stageGroup.symbols.length}
              </span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {stageGroup.symbols.map((sym) => {
                const isSelected = selectedSym?.id === sym.id;
                const isConnected =
                  connectedIds.has(sym.id) && selectedSym && !isSelected;
                const encountered = sym.encountered;
                const borderColor = isSelected
                  ? cfg.color
                  : isConnected
                    ? "#FBBF24"
                    : encountered
                      ? cfg.border
                      : "rgba(255,255,255,0.06)";
                const bgColor = isSelected
                  ? cfg.bg
                  : isConnected
                    ? "rgba(251,191,36,0.06)"
                    : encountered
                      ? "rgba(255,255,255,0.02)"
                      : "rgba(255,255,255,0.01)";

                return (
                  <div
                    key={sym.id}
                    onClick={() => setSelectedSym(isSelected ? null : sym)}
                    style={{
                      width: 80,
                      padding: "12px 6px",
                      borderRadius: 14,
                      cursor: "pointer",
                      background: bgColor,
                      border: "2px solid " + borderColor,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 4,
                      opacity: encountered ? 1 : 0.35,
                      transition: "all 0.2s",
                      position: "relative",
                      boxShadow: isSelected
                        ? "0 0 16px " + cfg.color + "40"
                        : isConnected
                          ? "0 0 10px rgba(251,191,36,0.2)"
                          : "none",
                    }}
                  >
                    <span style={{ fontSize: 28 }}>{sym.visual}</span>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: encountered ? cfg.color : "#4B5563",
                        textAlign: "center",
                      }}
                    >
                      {sym.symbol}
                    </span>
                    {encountered && (
                      <span style={{ fontSize: 9, color: "#6B7280" }}>
                        {sym.encounterCount}×
                      </span>
                    )}
                    {!encountered && (
                      <span
                        style={{
                          fontSize: 8,
                          color: "#374151",
                          fontStyle: "italic",
                        }}
                      >
                        undiscovered
                      </span>
                    )}
                    {isConnected && (
                      <div
                        style={{
                          position: "absolute",
                          top: -4,
                          right: -4,
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          background: "#FBBF24",
                          border: "2px solid #1C1332",
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Selected symbol detail + connections */}
      {selectedSym && (
        <div
          style={{
            background:
              STAGE_CONFIG[selectedSym.stage]?.bg || "rgba(167,139,250,0.08)",
            border:
              "1px solid " +
              (STAGE_CONFIG[selectedSym.stage]?.border ||
                "rgba(167,139,250,0.25)"),
            borderRadius: 18,
            padding: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginBottom: 16,
            }}
          >
            <span style={{ fontSize: 48 }}>{selectedSym.visual}</span>
            <div>
              <h3
                style={{
                  margin: 0,
                  fontSize: 22,
                  fontWeight: 800,
                  color: STAGE_CONFIG[selectedSym.stage]?.color || "#A78BFA",
                }}
              >
                {selectedSym.symbol}
              </h3>
              <p style={{ margin: "2px 0 0", fontSize: 13, color: "#9B7FD4" }}>
                {selectedSym.stage} · {selectedSym.theme}
              </p>
              {selectedSym.encountered && (
                <p
                  style={{ margin: "4px 0 0", fontSize: 12, color: "#6B7280" }}
                >
                  Seen {selectedSym.encounterCount} time
                  {selectedSym.encounterCount !== 1 ? "s" : ""}
                  {selectedSym.lastSeen &&
                    " · Last: " +
                      new Date(selectedSym.lastSeen).toLocaleDateString(
                        "en-US",
                        { month: "short", day: "numeric" },
                      )}
                </p>
              )}
            </div>
          </div>

          {/* Emotion themes */}
          {selectedSym.emotionThemes?.length > 0 && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 6,
                marginBottom: 14,
              }}
            >
              {selectedSym.emotionThemes.map((t, i) => (
                <span
                  key={i}
                  style={{
                    padding: "4px 12px",
                    borderRadius: 16,
                    fontSize: 12,
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(139,92,246,0.2)",
                    color: "#C4B5FD",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          {/* Reflection prompts */}
          {selectedSym.reflectionPrompts?.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginBottom: 8,
                }}
              >
                <Eye size={13} style={{ color: "#A78BFA" }} />
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#C4B5FD",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  Reflections
                </span>
              </div>
              {selectedSym.reflectionPrompts.map((p, i) => (
                <div
                  key={i}
                  style={{
                    padding: "10px 14px",
                    background: "rgba(167,139,250,0.06)",
                    borderRadius: 8,
                    borderLeft: "3px solid #7C3AED",
                    marginBottom: 6,
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      color: "#E9D5FF",
                      fontSize: 13,
                      lineHeight: 1.6,
                      fontStyle: "italic",
                    }}
                  >
                    {p}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Connections */}
          {selectedConnections.length > 0 && (
            <div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#FBBF24",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Connected Symbols ({selectedConnections.length})
              </span>
              <p
                style={{ margin: "4px 0 10px", fontSize: 11, color: "#6B7280" }}
              >
                Symbols that appeared within 48 hours of {selectedSym.symbol}.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {selectedConnections.map((c, i) => {
                  const other = c.fromId === selectedSym.id ? c.to : c.from;
                  return (
                    <div
                      key={i}
                      style={{
                        padding: "6px 12px",
                        borderRadius: 10,
                        background: "rgba(251,191,36,0.06)",
                        border: "1px solid rgba(251,191,36,0.2)",
                        color: "#FCD34D",
                        fontSize: 13,
                        fontWeight: 600,
                      }}
                    >
                      {other}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
