import { FlipCard } from "./FlipCard";

export function ThreeCardLayout({ drawnCards, spread }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 0,
        padding: "8px 0",
      }}
    >
      {drawnCards.map((drawn, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center" }}>
          <FlipCard
            card={drawn.card}
            isReversed={drawn.isReversed}
            position={spread.positions[i]}
            size="md"
          />
          {i < drawnCards.length - 1 && (
            <div
              style={{
                width: 48,
                height: 2,
                background:
                  "linear-gradient(90deg,rgba(139,92,246,0.8),rgba(167,139,250,1),rgba(139,92,246,0.8))",
                boxShadow: "0 0 8px 2px rgba(139,92,246,0.6)",
                borderRadius: 2,
                flexShrink: 0,
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
