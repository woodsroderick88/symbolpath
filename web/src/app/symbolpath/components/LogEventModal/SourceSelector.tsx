export function SourceSelector({ sourceType, setSourceType }) {
  const sourceOptions = [
    { value: "dream", label: "Dream", emoji: "😴" },
    { value: "life_event", label: "Life Event", emoji: "📍" },
    { value: "i-ching", label: "I‑Ching", emoji: "☯️" },
    { value: "mood_log", label: "Mood", emoji: "💭" },
    { value: "intention", label: "Intention", emoji: "✨" },
    { value: "ritual", label: "Ritual", emoji: "🕯️" },
    { value: "oracle_draw", label: "Oracle", emoji: "🔮" },
    { value: "astrology_transit", label: "Transit", emoji: "🪐" },
  ];

  return (
    <div style={{ marginBottom: 20 }}>
      <label
        style={{
          fontSize: 11,
          color: "#9B7FD4",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        Source
      </label>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
        {sourceOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setSourceType(opt.value)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 14px",
              borderRadius: 20,
              background:
                sourceType === opt.value
                  ? "rgba(124,58,237,0.3)"
                  : "rgba(255,255,255,0.03)",
              border: `1px solid ${sourceType === opt.value ? "#7C3AED" : "rgba(139,92,246,0.2)"}`,
              color: sourceType === opt.value ? "#C4B5FD" : "#9B7FD4",
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            {opt.emoji} {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
