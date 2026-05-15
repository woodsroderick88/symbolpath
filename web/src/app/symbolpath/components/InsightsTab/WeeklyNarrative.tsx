import { Eye, Zap } from "lucide-react";
import { STAGE_CONFIG } from "../../config/stageConfig";

export function WeeklyNarrative({ narrative, stage }) {
  const cfg = STAGE_CONFIG[stage] || STAGE_CONFIG.Integration;

  return (
    <div
      style={{
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        borderRadius: 20,
        padding: 28,
      }}
    >
      <p
        style={{
          margin: "0 0 6px",
          fontSize: 11,
          color: "#9B7FD4",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
        }}
      >
        This Week · {stage}
      </p>
      <h2
        style={{
          margin: "0 0 14px",
          fontSize: 20,
          fontWeight: 800,
          color: cfg.color,
        }}
      >
        {narrative.title}
      </h2>
      <p
        style={{
          margin: "0 0 20px",
          color: "#E9D5FF",
          fontSize: 14,
          lineHeight: 1.85,
          fontStyle: "italic",
        }}
      >
        {narrative.narrative}
      </p>
      <div
        style={{
          borderTop: `1px solid ${cfg.border}`,
          paddingTop: 16,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <Eye
            size={14}
            style={{ color: "#A78BFA", marginTop: 2, flexShrink: 0 }}
          />
          <p
            style={{
              margin: 0,
              color: "#D1D5DB",
              fontSize: 14,
              fontStyle: "italic",
            }}
          >
            {narrative.invitation}
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <Zap
            size={14}
            style={{ color: "#FBBF24", marginTop: 2, flexShrink: 0 }}
          />
          <p style={{ margin: 0, color: "#D1D5DB", fontSize: 14 }}>
            {narrative.practice}
          </p>
        </div>
      </div>
    </div>
  );
}
