import { ChevronLeft, Sparkles, Layers } from "lucide-react";
import { oracleDecks } from "@/data/oracle-decks";

export function OracleDeckSelection({ onSelectDeck, onSwitchToTarot }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0F0A1E",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "48px 24px" }}>
        <a
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontSize: 13,
            color: "#9B7FD4",
            textDecoration: "none",
            marginBottom: 32,
          }}
        >
          <ChevronLeft size={15} /> Back to Archive
        </a>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 24,
          }}
        >
          <div>
            <h1
              style={{
                fontSize: 36,
                fontWeight: 700,
                color: "#E9D5FF",
                marginBottom: 8,
              }}
            >
              Oracle Reading
            </h1>
            <p style={{ color: "#9B7FD4" }}>
              Choose an oracle deck for guidance
            </p>
          </div>
          <button
            onClick={onSwitchToTarot}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "10px 18px",
              background: "rgba(139,92,246,0.1)",
              color: "#C4B5FD",
              border: "1px solid rgba(139,92,246,0.3)",
              borderRadius: 12,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <Layers size={14} /> Tarot Spreads
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {oracleDecks.map((deck) => (
            <button
              key={deck.id}
              onClick={() => onSelectDeck(deck.id)}
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(139,92,246,0.25)",
                borderRadius: 16,
                padding: 24,
                textAlign: "left",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#7C3AED";
                e.currentTarget.style.background = "rgba(124,58,237,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(139,92,246,0.25)";
                e.currentTarget.style.background = "rgba(255,255,255,0.03)";
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: 17,
                      fontWeight: 700,
                      color: "#C4B5FD",
                    }}
                  >
                    {deck.name}
                  </h3>
                  <p
                    style={{
                      margin: "6px 0 10px",
                      fontSize: 13,
                      color: "#9B7FD4",
                    }}
                  >
                    {deck.description}
                  </p>
                  <p style={{ margin: 0, fontSize: 11, color: "#6B7280" }}>
                    {deck.cards.length} cards · {deck.theme}
                  </p>
                </div>
                <Sparkles
                  size={20}
                  style={{ color: "#7C3AED", flexShrink: 0 }}
                />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
