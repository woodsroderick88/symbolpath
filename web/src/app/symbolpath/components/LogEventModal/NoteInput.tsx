export function NoteInput({ note, setNote }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <label
        style={{
          fontSize: 11,
          color: "#9B7FD4",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        Note (optional)
      </label>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="What brought this symbol to you?"
        style={{
          width: "100%",
          marginTop: 8,
          padding: 12,
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(139,92,246,0.25)",
          borderRadius: 10,
          color: "#E9D5FF",
          fontSize: 14,
          lineHeight: 1.6,
          resize: "vertical",
          minHeight: 70,
          outline: "none",
          fontFamily: "inherit",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}
