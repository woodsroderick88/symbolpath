import { useState, useMemo } from "react";
import { tarotCards } from "@/data/tarot-cards";
import { Check } from "lucide-react";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "major", label: "Major Arcana" },
  { id: "wands", label: "Wands" },
  { id: "cups", label: "Cups" },
  { id: "swords", label: "Swords" },
  { id: "pentacles", label: "Pentacles" },
];

export function ManualPickModal({ spread, onConfirm, onClose }) {
  const [selected, setSelected] = useState([]);
  const [filter, setFilter] = useState("all");
  const limit = spread.positions.length;

  const filtered = useMemo(() => {
    if (filter === "all") return tarotCards;
    if (filter === "major")
      return tarotCards.filter((c) => c.arcana === "major");
    return tarotCards.filter((c) => c.suit === filter);
  }, [filter]);

  const toggleCard = (card) => {
    const exists = selected.find((c) => c.id === card.id);
    if (exists) setSelected(selected.filter((c) => c.id !== card.id));
    else if (selected.length < limit) setSelected([...selected, card]);
  };

  const handleConfirm = () => {
    if (selected.length !== limit) return;
    onConfirm(
      selected.map((card) => ({ card, isReversed: Math.random() > 0.5 })),
    );
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        background: "rgba(9,4,20,0.75)",
        backdropFilter: "blur(6px)",
      }}
    >
      <div
        style={{
          background: "#1C1332",
          width: "100%",
          maxWidth: 680,
          borderRadius: 20,
          boxShadow: "0 25px 60px rgba(0,0,0,0.7)",
          display: "flex",
          flexDirection: "column",
          maxHeight: "88vh",
          border: "1px solid rgba(139,92,246,0.3)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "18px 24px",
            borderBottom: "1px solid rgba(139,92,246,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                color: "#E9D5FF",
                fontSize: 18,
                fontWeight: 700,
              }}
            >
              Pick Your Cards
            </h2>
            <p style={{ margin: "4px 0 0", color: "#9B7FD4", fontSize: 12 }}>
              {selected.length} of {limit} selected
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ display: "flex", gap: 8 }}>
              {spread.positions.map((pos, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 3,
                  }}
                >
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: i < selected.length ? "#7C3AED" : "#2D1F5E",
                    }}
                  />
                  <span style={{ fontSize: 8, color: "#6B7280" }}>
                    {pos.name}
                  </span>
                </div>
              ))}
            </div>
            <button
              onClick={handleConfirm}
              disabled={selected.length !== limit}
              style={{
                background:
                  selected.length === limit
                    ? "linear-gradient(135deg,#4F46E5,#7C3AED)"
                    : "#2D1F5E",
                color: selected.length === limit ? "#fff" : "#4B5563",
                border: "none",
                borderRadius: 10,
                padding: "8px 16px",
                fontSize: 13,
                fontWeight: 600,
                cursor: selected.length === limit ? "pointer" : "not-allowed",
              }}
            >
              Reveal Reading
            </button>
            <button
              onClick={onClose}
              style={{
                background: "transparent",
                border: "none",
                color: "#9B7FD4",
                fontSize: 20,
                cursor: "pointer",
                padding: "2px 6px",
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Filters */}
        <div
          style={{
            padding: "12px 24px 8px",
            display: "flex",
            gap: 8,
            overflowX: "auto",
          }}
        >
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              style={{
                padding: "6px 14px",
                borderRadius: 20,
                border: "none",
                fontSize: 12,
                fontWeight: 500,
                whiteSpace: "nowrap",
                cursor: "pointer",
                background:
                  filter === f.id
                    ? "linear-gradient(135deg,#4F46E5,#7C3AED)"
                    : "#2D1F5E",
                color: filter === f.id ? "#fff" : "#9B7FD4",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 24px 24px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(96px,1fr))",
              gap: 8,
            }}
          >
            {filtered.map((card) => {
              const isSelected = !!selected.find((c) => c.id === card.id);
              const isDisabled = !isSelected && selected.length >= limit;
              return (
                <button
                  key={card.id}
                  onClick={() => toggleCard(card)}
                  disabled={isDisabled}
                  style={{
                    position: "relative",
                    padding: "10px 6px",
                    borderRadius: 10,
                    border: `2px solid ${isSelected ? "#7C3AED" : "rgba(139,92,246,0.2)"}`,
                    background: isSelected
                      ? "rgba(124,58,237,0.2)"
                      : "rgba(255,255,255,0.02)",
                    opacity: isDisabled ? 0.35 : 1,
                    cursor: isDisabled ? "not-allowed" : "pointer",
                    textAlign: "center",
                    transition: "all 0.15s ease",
                  }}
                >
                  {isSelected && (
                    <span
                      style={{
                        position: "absolute",
                        top: 5,
                        right: 5,
                        background: "#7C3AED",
                        borderRadius: "50%",
                        width: 16,
                        height: 16,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Check size={9} color="#fff" />
                    </span>
                  )}
                  <p
                    style={{
                      margin: 0,
                      fontSize: 11,
                      fontWeight: 600,
                      color: isSelected ? "#C4B5FD" : "#9CA3AF",
                      lineHeight: 1.3,
                    }}
                  >
                    {card.name}
                  </p>
                  <p
                    style={{ margin: "3px 0 0", fontSize: 9, color: "#6B7280" }}
                  >
                    {card.arcana === "major" ? "Major" : card.suit}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
