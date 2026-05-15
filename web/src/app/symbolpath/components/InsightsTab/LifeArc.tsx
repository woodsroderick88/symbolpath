import { STAGE_CONFIG } from "../../config/stageConfig";

export function LifeArc({ stageJourney }) {
  if (!stageJourney) return null;

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(139,92,246,0.2)",
        borderRadius: 16,
        padding: 20,
      }}
    >
      <span
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: "#C4B5FD",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        Your Life Arc
      </span>
      <p style={{ margin: "4px 0 16px", fontSize: 12, color: "#6B7280" }}>
        All-time stage distribution.
      </p>
      {stageJourney.map(({ stage: s, count, percentage }) => {
        const sc = STAGE_CONFIG[s];
        return (
          <div key={s} style={{ marginBottom: 10 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 4,
              }}
            >
              <span style={{ fontSize: 13, color: "#D1D5DB" }}>
                {sc.emoji} {s}
              </span>
              <span style={{ fontSize: 12, color: sc.color }}>
                {count} event{count !== 1 ? "s" : ""}
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
                  background: sc.color,
                  width: `${percentage || 0}%`,
                  transition: "width 1s ease",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
