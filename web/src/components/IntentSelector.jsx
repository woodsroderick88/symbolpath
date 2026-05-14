import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Sparkles, Check } from "lucide-react";

const INTENTS = [
  { key: "clarity", emoji: "🏮", label: "Clarity", color: "#A78BFA" },
  { key: "courage", emoji: "🔥", label: "Courage", color: "#F87171" },
  { key: "healing", emoji: "🌿", label: "Healing", color: "#34D399" },
  { key: "connection", emoji: "🌉", label: "Connection", color: "#60A5FA" },
  { key: "creativity", emoji: "🌱", label: "Creativity", color: "#FBBF24" },
  { key: "release", emoji: "⛈️", label: "Release", color: "#F87171" },
  { key: "rest", emoji: "🪴", label: "Rest", color: "#34D399" },
  { key: "purpose", emoji: "🧭", label: "Purpose", color: "#C084FC" },
  { key: "truth", emoji: "🪞", label: "Truth", color: "#A78BFA" },
  { key: "focus", emoji: "🎯", label: "Focus", color: "#60A5FA" },
];

function getTodayKey() {
  return new Date().toISOString().split("T")[0];
}

export default function IntentSelector({
  userId = "anonymous",
  onIntentLogged,
}) {
  const [selected, setSelected] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("symbolpath_intent");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.date === getTodayKey()) {
          setSelected(parsed.intent);
        }
      }
    } catch {}
  }, []);

  const mutation = useMutation({
    mutationFn: async (intent) => {
      const res = await fetch("/api/intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, intent }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to log intent");
      }
      return res.json();
    },
    onMutate: (intent) => {
      setSelected(intent);
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "symbolpath_intent",
          JSON.stringify({ date: getTodayKey(), intent }),
        );
      }
    },
    onSuccess: (_data, intent) => {
      queryClient.invalidateQueries({ queryKey: ["symbolpath"] });
      if (onIntentLogged) onIntentLogged(intent);
    },
    onError: () => {
      setSelected(null);
      if (typeof window !== "undefined") {
        localStorage.removeItem("symbolpath_intent");
      }
    },
  });

  const handleSelect = (intent) => {
    if (mutation.isPending || selected) return;
    mutation.mutate(intent);
  };

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(139,92,246,0.2)",
        borderRadius: 20,
        padding: 24,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 6,
        }}
      >
        <Sparkles size={16} style={{ color: "#C4B5FD" }} />
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: "#C4B5FD",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          Today's Focus
        </span>
      </div>
      <p style={{ margin: "0 0 16px", fontSize: 13, color: "#9B7FD4" }}>
        Set an intention and a symbol will be added to your path.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
          gap: 10,
        }}
      >
        {INTENTS.map((intent) => {
          const isSelected = selected === intent.key;
          const isLoading =
            mutation.isPending && mutation.variables === intent.key;

          return (
            <button
              key={intent.key}
              onClick={() => handleSelect(intent.key)}
              disabled={mutation.isPending || !!selected}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
                padding: "14px 10px",
                borderRadius: 14,
                background: isSelected
                  ? `${intent.color}18`
                  : "rgba(255,255,255,0.02)",
                border: `1px solid ${isSelected ? intent.color : "rgba(139,92,246,0.15)"}`,
                color: isSelected ? intent.color : "#9B7FD4",
                cursor: selected ? "default" : "pointer",
                transition: "all 0.2s",
                opacity: selected && !isSelected ? 0.4 : 1,
                position: "relative",
              }}
            >
              {isLoading && !isSelected && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 14,
                    background: "rgba(124,58,237,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span style={{ fontSize: 14, color: "#C4B5FD" }}>…</span>
                </div>
              )}
              {isSelected && (
                <div style={{ position: "absolute", top: 6, right: 6 }}>
                  <Check size={12} style={{ color: intent.color }} />
                </div>
              )}
              <span style={{ fontSize: 24 }}>{intent.emoji}</span>
              <span
                style={{ fontSize: 13, fontWeight: isSelected ? 700 : 500 }}
              >
                {intent.label}
              </span>
            </button>
          );
        })}
      </div>

      {selected && (
        <p
          style={{
            margin: "16px 0 0",
            fontSize: 13,
            color: "#34D399",
            textAlign: "center",
            fontStyle: "italic",
          }}
        >
          ✓ Intent logged — symbol added to your path
        </p>
      )}

      {mutation.isError && !selected && (
        <p
          style={{
            margin: "16px 0 0",
            fontSize: 13,
            color: "#F87171",
            textAlign: "center",
          }}
        >
          Something went wrong. Try again.
        </p>
      )}
    </div>
  );
}
