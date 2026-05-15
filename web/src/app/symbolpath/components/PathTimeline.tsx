import { ChevronRight } from "lucide-react";
import { STAGE_CONFIG } from "../config/stageConfig";
import { SOURCE_LABELS } from "../config/sourceLabels";

export function PathTimeline({ events }) {
  if (!events || events.length === 0)
    return (
      <div
        style={{
          textAlign: "center",
          padding: 40,
          color: "#9B7FD4",
          fontSize: 14,
        }}
      >
        No events yet. Log your first symbol above.
      </div>
    );

  const sorted = [...events].sort(
    (a, b) =>
      new Date(b.created_at || b.date) - new Date(a.created_at || a.date),
  );

  return (
    <div style={{ position: "relative", paddingLeft: 36 }}>
      <div
        style={{
          position: "absolute",
          left: 14,
          top: 8,
          bottom: 8,
          width: 2,
          background:
            "linear-gradient(180deg,rgba(167,139,250,0.6),rgba(167,139,250,0.05))",
        }}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {sorted.map((ev, i) => {
          const cfg = STAGE_CONFIG[ev.stage] || STAGE_CONFIG.Integration;
          const src = SOURCE_LABELS[ev.source_type] ||
            SOURCE_LABELS[ev.source] || { label: "Event", emoji: "●" };
          const d = new Date(ev.created_at || ev.date);
          const dateStr = isNaN(d)
            ? ""
            : d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
          return (
            <div key={i} style={{ position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  left: -28,
                  top: 14,
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  background: cfg.color,
                  boxShadow: `0 0 10px ${cfg.color}70`,
                  flexShrink: 0,
                }}
              />
              <div
                style={{
                  background: cfg.bg,
                  border: `1px solid ${cfg.border}`,
                  borderRadius: 12,
                  padding: "12px 16px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: ev.note ? 6 : 0,
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <span style={{ fontSize: 20 }}>{ev.visual}</span>
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: cfg.color,
                      }}
                    >
                      {ev.symbol}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        color: "#6B7280",
                        background: "rgba(255,255,255,0.04)",
                        padding: "2px 8px",
                        borderRadius: 6,
                      }}
                    >
                      {ev.stage}
                    </span>
                  </div>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <span style={{ fontSize: 13 }}>{src.emoji}</span>
                    <span style={{ fontSize: 11, color: "#6B7280" }}>
                      {dateStr}
                    </span>
                  </div>
                </div>
                {ev.note && (
                  <p
                    style={{
                      margin: 0,
                      fontSize: 12,
                      color: "#9B7FD4",
                      fontStyle: "italic",
                      lineHeight: 1.5,
                    }}
                  >
                    {ev.note}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
