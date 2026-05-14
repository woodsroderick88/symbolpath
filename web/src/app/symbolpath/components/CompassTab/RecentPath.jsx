import { Activity, ChevronRight } from "lucide-react";
import { STAGE_CONFIG } from "../../config/stageConfig";

export function RecentPath({ symbolPath }) {
  if (!symbolPath || symbolPath.length === 0) return null;

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
          Recent Path
        </span>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        {symbolPath.map((s, i) => {
          const sc = STAGE_CONFIG[s.stage] || STAGE_CONFIG.Integration;
          return (
            <div
              key={i}
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 3,
                  padding: "8px 12px",
                  borderRadius: 10,
                  background: sc.bg,
                  border: `1px solid ${sc.border}`,
                  minWidth: 52,
                }}
              >
                <span style={{ fontSize: 18 }}>{s.visual}</span>
                <span
                  style={{ fontSize: 10, color: sc.color, fontWeight: 600 }}
                >
                  {s.symbol}
                </span>
              </div>
              {i < symbolPath.length - 1 && (
                <ChevronRight
                  size={13}
                  style={{ color: "#374151", flexShrink: 0 }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
