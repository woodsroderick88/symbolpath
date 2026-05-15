import { Brain } from "lucide-react";
import { STAGE_CONFIG } from "../../config/stageConfig";

export function DominantStage({ dominantStage }) {
  if (!dominantStage) return null;

  return (
    <div
      style={{
        background: "rgba(167,139,250,0.08)",
        border: "1px solid rgba(167,139,250,0.25)",
        borderRadius: 16,
        padding: 24,
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
        <Brain size={18} style={{ color: "#A78BFA" }} />
        <span
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "#C4B5FD",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          Dominant Stage
        </span>
      </div>
      <h3
        style={{
          margin: "0 0 10px",
          fontSize: 22,
          fontWeight: 800,
          color: "#E9D5FF",
        }}
      >
        {STAGE_CONFIG[dominantStage.stage]?.emoji} {dominantStage.stage}
      </h3>
      <p
        style={{
          margin: 0,
          color: "#D1D5DB",
          fontSize: 14,
          lineHeight: 1.8,
          fontStyle: "italic",
        }}
      >
        {dominantStage.insight}
      </p>
    </div>
  );
}
