import { ArrowRight } from "lucide-react";
import { STAGE_CONFIG } from "../../config/stageConfig";

export function NarrativeArcs({ topPaths }) {
  if (!topPaths || topPaths.length === 0) return null;

  return (
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
          marginBottom: 6,
        }}
      >
        <ArrowRight size={15} style={{ color: "#60A5FA" }} />
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: "#C4B5FD",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          Narrative Arcs
        </span>
      </div>
      <p style={{ margin: "0 0 16px", fontSize: 12, color: "#6B7280" }}>
        Recurring 3-symbol story arcs your psyche keeps returning to.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {topPaths.map((arc, i) => {
          const arcSymbols = arc.symbols || arc.path.split(" → ");
          const arcStages = arc.stages || [];
          const arcVisuals = arc.visuals || [];
          const arcName = arc.name || arc.path;
          const arcNarrative = arc.narrative || "";
          const arcEmoji = arc.emoji || "🔮";
          const arcArchetype = arc.archetype || "";
          const arcDirection = arc.direction || "lateral";
          const arcIntensity = arc.intensity || "emerging";
          const directionIcon =
            arcDirection === "ascending"
              ? "↗"
              : arcDirection === "descending"
                ? "↘"
                : "↔";
          const intensityColor =
            arcIntensity === "dominant"
              ? "#FBBF24"
              : arcIntensity === "strong"
                ? "#60A5FA"
                : "#6B7280";
          return (
            <div
              key={i}
              style={{
                borderRadius: 16,
                background:
                  "linear-gradient(135deg, rgba(96,165,250,0.05), rgba(167,139,250,0.07))",
                border: "1px solid rgba(96,165,250,0.2)",
                overflow: "hidden",
              }}
            >
              {/* Arc header */}
              <div
                style={{
                  padding: "16px 18px 12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 22 }}>{arcEmoji}</span>
                  <div>
                    <span
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: "#E9D5FF",
                      }}
                    >
                      {arcName}
                    </span>
                    {arcArchetype && (
                      <span
                        style={{
                          fontSize: 11,
                          color: "#6B7280",
                          marginLeft: 8,
                        }}
                      >
                        · {arcArchetype}
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span
                    style={{
                      fontSize: 12,
                      color: intensityColor,
                      fontWeight: 600,
                      background: `${intensityColor}15`,
                      padding: "3px 8px",
                      borderRadius: 6,
                    }}
                  >
                    {arcIntensity}
                  </span>
                  <span
                    style={{ fontSize: 14, color: "#9B7FD4" }}
                    title={arcDirection}
                  >
                    {directionIcon}
                  </span>
                </div>
              </div>
              {/* Symbol flow */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 0,
                  padding: "4px 18px 14px",
                }}
              >
                {arcSymbols.map((sym, j) => {
                  const stage = arcStages[j];
                  const visual = arcVisuals[j];
                  const cfg = STAGE_CONFIG[stage] || STAGE_CONFIG.Integration;
                  return (
                    <div
                      key={j}
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 3,
                          padding: "8px 14px",
                          borderRadius: 10,
                          background: cfg.bg,
                          border: `1px solid ${cfg.border}`,
                          minWidth: 68,
                        }}
                      >
                        <span style={{ fontSize: 22 }}>
                          {visual || cfg.emoji}
                        </span>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: cfg.color,
                          }}
                        >
                          {sym}
                        </span>
                        <span
                          style={{
                            fontSize: 8,
                            color: "#6B7280",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                          }}
                        >
                          {stage}
                        </span>
                      </div>
                      {j < arcSymbols.length - 1 && (
                        <ArrowRight
                          size={13}
                          style={{
                            color: "#4B5563",
                            margin: "0 5px",
                            flexShrink: 0,
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
              {/* Arc insight */}
              <div style={{ padding: "0 18px 8px" }}>
                <p
                  style={{
                    margin: 0,
                    fontSize: 13,
                    color: "#93C5FD",
                    lineHeight: 1.6,
                  }}
                >
                  {arc.insight ||
                    `You often move from ${arcSymbols[0]} through ${arcSymbols[1]} into ${arcSymbols[2]}.`}
                </p>
              </div>
              {/* Narrative */}
              {arcNarrative && (
                <div style={{ padding: "0 18px 16px" }}>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 13,
                      color: "#C4B5FD",
                      lineHeight: 1.7,
                      fontStyle: "italic",
                    }}
                  >
                    {arcNarrative}
                  </p>
                </div>
              )}
              {/* Footer */}
              <div
                style={{
                  padding: "10px 18px",
                  borderTop: "1px solid rgba(139,92,246,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ fontSize: 11, color: "#6B7280" }}>
                  {arcStages.join(" → ")}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#60A5FA",
                    background: "rgba(96,165,250,0.1)",
                    padding: "3px 10px",
                    borderRadius: 8,
                  }}
                >
                  {arc.count}× repeated
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
