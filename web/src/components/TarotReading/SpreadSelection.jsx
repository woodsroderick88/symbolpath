import { ChevronLeft, Sparkles, Layers, Users, RotateCcw } from "lucide-react";
import { SPREAD_TYPES, SPREAD_CATEGORIES } from "@/data/spreads";

export function SpreadSelection({
  onSelectSpread,
  onSwitchToOracle,
  spreadFilter,
  setSpreadFilter,
  filteredSpreads,
  communitySpread,
  allowReversals,
  setAllowReversals,
}) {
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
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: 16,
            }}
          >
            <button
              onClick={onSwitchToOracle}
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
              <Layers size={14} /> Oracle Decks
            </button>
          </div>
          <h1
            style={{
              fontSize: 36,
              fontWeight: 700,
              color: "#E9D5FF",
              marginBottom: 8,
            }}
          >
            Tarot Reading
          </h1>
          <p style={{ color: "#9B7FD4", marginBottom: 24 }}>
            Choose a spread to begin your reading
          </p>

          {/* Reversals Toggle */}
          {typeof allowReversals !== "undefined" && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 18px",
                marginBottom: 16,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(139,92,246,0.25)",
                borderRadius: 12,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <RotateCcw
                  size={16}
                  style={{ color: allowReversals ? "#A78BFA" : "#6B7280" }}
                />
                <div>
                  <span
                    style={{ fontSize: 14, fontWeight: 600, color: "#E9D5FF" }}
                  >
                    Reversed Cards
                  </span>
                  <p
                    style={{
                      margin: "2px 0 0",
                      fontSize: 12,
                      color: "#9B7FD4",
                    }}
                  >
                    {allowReversals
                      ? "Cards can appear upside-down with reversed meanings"
                      : "All cards will appear upright only"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setAllowReversals(!allowReversals)}
                style={{
                  width: 48,
                  height: 26,
                  borderRadius: 13,
                  padding: 2,
                  background: allowReversals ? "#7C3AED" : "#374151",
                  border: "none",
                  cursor: "pointer",
                  transition: "background 0.2s",
                  position: "relative",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: "#fff",
                    transition: "transform 0.2s",
                    transform: allowReversals
                      ? "translateX(22px)"
                      : "translateX(0)",
                  }}
                />
              </button>
            </div>
          )}

          {/* Community spread banner */}
          {communitySpread && (
            <div style={{ marginBottom: 8 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 10,
                }}
              >
                <Users size={14} style={{ color: "#A78BFA" }} />
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#A78BFA",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}
                >
                  From Community
                </span>
              </div>
              <button
                onClick={() => onSelectSpread(communitySpread.id)}
                style={{
                  width: "100%",
                  background: "rgba(124,58,237,0.12)",
                  border: "2px solid #7C3AED",
                  borderRadius: 16,
                  padding: 24,
                  textAlign: "left",
                  cursor: "pointer",
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
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 4,
                      }}
                    >
                      <h3
                        style={{
                          margin: 0,
                          fontSize: 17,
                          fontWeight: 700,
                          color: "#C4B5FD",
                        }}
                      >
                        {communitySpread.name}
                      </h3>
                      <span
                        style={{
                          fontSize: 10,
                          padding: "2px 8px",
                          borderRadius: 20,
                          background: "rgba(124,58,237,0.3)",
                          color: "#C4B5FD",
                          fontWeight: 700,
                        }}
                      >
                        ✦ Community
                      </span>
                    </div>
                    {communitySpread.description && (
                      <p
                        style={{
                          margin: "0 0 10px",
                          fontSize: 13,
                          color: "#9B7FD4",
                        }}
                      >
                        {communitySpread.description}
                      </p>
                    )}
                    <p style={{ margin: 0, fontSize: 11, color: "#6B7280" }}>
                      {communitySpread.positions.length} cards
                    </p>
                  </div>
                  <Sparkles
                    size={20}
                    style={{ color: "#7C3AED", flexShrink: 0 }}
                  />
                </div>
              </button>
              <div
                style={{
                  height: 1,
                  background: "rgba(139,92,246,0.2)",
                  margin: "20px 0",
                }}
              />
            </div>
          )}

          {/* Category Filters */}
          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              marginBottom: 24,
            }}
          >
            {SPREAD_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSpreadFilter(cat.id)}
                style={{
                  padding: "8px 18px",
                  borderRadius: 20,
                  border: "none",
                  fontSize: 13,
                  fontWeight: spreadFilter === cat.id ? 700 : 500,
                  cursor: "pointer",
                  background:
                    spreadFilter === cat.id
                      ? "linear-gradient(135deg,#4F46E5,#7C3AED)"
                      : "rgba(139,92,246,0.1)",
                  color: spreadFilter === cat.id ? "#fff" : "#9B7FD4",
                  transition: "all 0.2s ease",
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {filteredSpreads
              .filter((s) => !communitySpread || s.id !== communitySpread.id)
              .map((spread) => (
                <button
                  key={spread.id}
                  onClick={() => onSelectSpread(spread.id)}
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
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <h3
                          style={{
                            margin: 0,
                            fontSize: 17,
                            fontWeight: 700,
                            color: "#C4B5FD",
                          }}
                        >
                          {spread.name}
                        </h3>
                        {spread.category === "lunar" && <span>🌙</span>}
                        {spread.category === "spiritual" && <span>✨</span>}
                      </div>
                      <p
                        style={{
                          margin: "6px 0 10px",
                          fontSize: 13,
                          color: "#9B7FD4",
                        }}
                      >
                        {spread.description}
                      </p>
                      <p style={{ margin: 0, fontSize: 11, color: "#6B7280" }}>
                        {spread.positions.length} card
                        {spread.positions.length > 1 ? "s" : ""} ·{" "}
                        {spread.category}
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
    </div>
  );
}
