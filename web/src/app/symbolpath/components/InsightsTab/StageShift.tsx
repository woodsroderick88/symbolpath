import { STAGE_CONFIG } from "../../config/stageConfig";

export function StageShift({ stageShift }) {
  if (!stageShift) return null;

  return (
    <div
      style={{
        background: "rgba(251,191,36,0.06)",
        border: "1px solid rgba(251,191,36,0.2)",
        borderRadius: 14,
        padding: 16,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 20 }}>🔄</span>
        <div>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#FBBF24" }}>
            Stage Shift Detected
          </span>
          <p style={{ margin: "2px 0 0", fontSize: 13, color: "#D1D5DB" }}>
            Moved from{" "}
            <strong
              style={{
                color: STAGE_CONFIG[stageShift.from]?.color,
              }}
            >
              {stageShift.from}
            </strong>
            {" → "}
            <strong style={{ color: STAGE_CONFIG[stageShift.to]?.color }}>
              {stageShift.to}
            </strong>
          </p>
        </div>
      </div>
    </div>
  );
}
