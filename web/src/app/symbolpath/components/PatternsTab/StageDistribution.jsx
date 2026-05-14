import { Activity } from "lucide-react";
import { STAGE_CONFIG, STAGE_ORDER } from "../../config/stageConfig";

export function StageDistribution({ stageCounts }) {
  const total =
    Object.values(stageCounts || {}).reduce((a, b) => a + b, 0) || 1;

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
          marginBottom: 14,
        }}
      >
        <Activity size={15} style={{ color: "#A78BFA" }} />
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: "#C4B5FD",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          Stage Distribution
        </span>
      </div>
      {STAGE_ORDER.map((stage) => {
        const count = stageCounts?.[stage] || 0;
        const pct = Math.round((count / total) * 100);
        const cfg = STAGE_CONFIG[stage];
        return (
          <div key={stage} style={{ marginBottom: 12 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 4,
              }}
            >
              <span style={{ fontSize: 13, color: "#D1D5DB" }}>
                {cfg.emoji} {stage}
              </span>
              <span style={{ fontSize: 13, color: cfg.color, fontWeight: 600 }}>
                {pct}%
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
                  width: `${pct}%`,
                  transition: "width 0.8s ease",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
