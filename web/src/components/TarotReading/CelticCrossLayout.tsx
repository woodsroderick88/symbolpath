import { FlipCard } from "./FlipCard";
import { CELTIC_CROSS_POSITIONS } from "@/data/celtic-cross-layout";

export function CelticCrossLayout({ drawnCards, spread }) {
  return (
    <div style={{ overflowX: "auto", paddingBottom: 8 }}>
      <div
        style={{
          position: "relative",
          width: 570,
          height: 510,
          margin: "0 auto",
          flexShrink: 0,
        }}
      >
        {drawnCards.map((drawn, i) => {
          const pos = CELTIC_CROSS_POSITIONS[i];
          return (
            <div
              key={i}
              style={{ position: "absolute", left: pos.left, top: pos.top }}
            >
              <FlipCard
                card={drawn.card}
                isReversed={drawn.isReversed}
                position={spread.positions[i]}
                size="sm"
                extraRotate={pos.rotate}
              />
            </div>
          );
        })}
        {/* Cross dividers */}
        <div
          style={{
            position: "absolute",
            left: 118,
            top: 245,
            width: 165,
            height: 1,
            background: "rgba(139,92,246,0.25)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 237,
            top: 90,
            width: 1,
            height: 310,
            background: "rgba(139,92,246,0.25)",
            pointerEvents: "none",
          }}
        />
        {/* Staff divider */}
        <div
          style={{
            position: "absolute",
            left: 447,
            top: 0,
            width: 1,
            height: 490,
            background: "rgba(139,92,246,0.2)",
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
}
