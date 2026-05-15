import { useState } from "react";
import { SourceSelector } from "./SourceSelector";
import { SymbolSelector } from "./SymbolSelector";
import { NoteInput } from "./NoteInput";

export function LogEventModal({ symbols, onClose, onSave }) {
  const [sourceType, setSourceType] = useState("dream");
  const [selectedSymbol, setSelectedSymbol] = useState(null);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!selectedSymbol) return;
    setSaving(true);
    try {
      const res = await fetch("/api/symbolpath/engine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "anonymous",
          sourceType,
          symbolId: selectedSymbol.id,
          note: note.trim() || null,
        }),
      });
      if (res.ok) onSave();
      else onClose();
    } catch {
      onClose();
    }
    setSaving(false);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.8)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: 20,
      }}
    >
      <div
        style={{
          background: "#1C1332",
          border: "1px solid rgba(139,92,246,0.35)",
          borderRadius: 20,
          padding: 28,
          width: "100%",
          maxWidth: 520,
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <h2
          style={{
            margin: "0 0 4px",
            color: "#E9D5FF",
            fontSize: 20,
            fontWeight: 700,
          }}
        >
          Log a Symbol Event
        </h2>
        <p style={{ margin: "0 0 24px", color: "#9B7FD4", fontSize: 13 }}>
          Capture a symbol from a dream, I‑Ching reading, life moment, or
          feeling.
        </p>

        <SourceSelector sourceType={sourceType} setSourceType={setSourceType} />
        <SymbolSelector
          symbols={symbols}
          selectedSymbol={selectedSymbol}
          setSelectedSymbol={setSelectedSymbol}
        />
        <NoteInput note={note} setNote={setNote} />

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "12px",
              background: "transparent",
              color: "#9B7FD4",
              border: "1px solid rgba(139,92,246,0.2)",
              borderRadius: 12,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!selectedSymbol || saving}
            style={{
              flex: 2,
              padding: "12px",
              background: selectedSymbol
                ? "linear-gradient(135deg,#4F46E5,#7C3AED)"
                : "rgba(124,58,237,0.2)",
              color: selectedSymbol ? "#fff" : "#6B7280",
              border: "none",
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 700,
              cursor: selectedSymbol ? "pointer" : "not-allowed",
            }}
          >
            {saving ? "Saving…" : "Log Symbol"}
          </button>
        </div>
      </div>
    </div>
  );
}
