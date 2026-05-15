import { useState, useEffect, useCallback } from "react";
import { Plus, Calendar, X } from "lucide-react";

const STAGE_CONFIG = {
  Awakening: {
    color: "#60A5FA",
    bg: "rgba(96,165,250,0.08)",
    border: "rgba(96,165,250,0.25)",
    emoji: "🌅",
  },
  Growth: {
    color: "#34D399",
    bg: "rgba(52,211,153,0.08)",
    border: "rgba(52,211,153,0.25)",
    emoji: "🌿",
  },
  Crisis: {
    color: "#F87171",
    bg: "rgba(248,113,113,0.08)",
    border: "rgba(248,113,113,0.25)",
    emoji: "⛈️",
  },
  Integration: {
    color: "#A78BFA",
    bg: "rgba(167,139,250,0.08)",
    border: "rgba(167,139,250,0.25)",
    emoji: "🧭",
  },
  Mastery: {
    color: "#FBBF24",
    bg: "rgba(251,191,36,0.08)",
    border: "rgba(251,191,36,0.25)",
    emoji: "👑",
  },
};

const STAGE_ORDER = ["Awakening", "Growth", "Crisis", "Integration", "Mastery"];

const CATEGORY_CONFIG = {
  personal: { label: "Personal", emoji: "🫀", color: "#F472B6" },
  career: { label: "Career", emoji: "💼", color: "#60A5FA" },
  relationship: { label: "Relationship", emoji: "💕", color: "#F87171" },
  spiritual: { label: "Spiritual", emoji: "🕊️", color: "#A78BFA" },
  health: { label: "Health", emoji: "🌿", color: "#34D399" },
  creative: { label: "Creative", emoji: "🎨", color: "#FBBF24" },
  tarot_reading: { label: "Tarot", emoji: "🎴", color: "#818CF8" },
  dream: { label: "Dream", emoji: "😴", color: "#C084FC" },
  moon_phase: { label: "Moon", emoji: "🌙", color: "#FDE68A" },
  "i-ching": { label: "I‑Ching", emoji: "☯️", color: "#6EE7B7" },
  mood_log: { label: "Mood", emoji: "💭", color: "#93C5FD" },
  intention: { label: "Intention", emoji: "✨", color: "#FCD34D" },
  life_event: { label: "Life Event", emoji: "📍", color: "#F9A8D4" },
};

function StageArcBar({ stageArc }) {
  if (!stageArc || stageArc.length === 0) return null;
  return (
    <div
      style={{
        display: "flex",
        gap: 2,
        height: 28,
        borderRadius: 6,
        overflow: "hidden",
        marginBottom: 16,
      }}
    >
      {stageArc.map((w, i) => {
        const cfg = STAGE_CONFIG[w.stage];
        return (
          <div
            key={i}
            title={`${w.week}: ${w.stage}`}
            style={{
              flex: 1,
              background: cfg?.color || "#4B5563",
              opacity: 0.7,
              position: "relative",
              minWidth: 3,
            }}
          >
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: `${Math.min(w.count * 25, 100)}%`,
                background: cfg?.color || "#4B5563",
                borderRadius: 2,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

function AddEventModal({ symbols, onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [category, setCategory] = useState("personal");
  const [intensity, setIntensity] = useState(5);
  const [selectedSymbol, setSelectedSymbol] = useState(null);
  const [saving, setSaving] = useState(false);

  const categories = [
    "personal",
    "career",
    "relationship",
    "spiritual",
    "health",
    "creative",
  ];

  const grouped = STAGE_ORDER.reduce((acc, stage) => {
    acc[stage] = symbols.filter((s) => s.stage === stage);
    return acc;
  }, {});

  const handleSave = async () => {
    if (!title.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/symbolpath/timeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "anonymous",
          title: title.trim(),
          description: description.trim() || null,
          eventDate,
          category,
          intensity,
          symbolId: selectedSymbol?.id || null,
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
          maxWidth: 540,
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                color: "#E9D5FF",
                fontSize: 20,
                fontWeight: 700,
              }}
            >
              Add Life Event
            </h2>
            <p style={{ margin: "4px 0 0", color: "#9B7FD4", fontSize: 13 }}>
              Mark a meaningful moment on your timeline.
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 4,
            }}
          >
            <X size={20} color="#9B7FD4" />
          </button>
        </div>

        {/* Title */}
        <div style={{ marginBottom: 16 }}>
          <label
            style={{
              fontSize: 11,
              color: "#9B7FD4",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            What happened?
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Left my old job"
            style={{
              width: "100%",
              marginTop: 6,
              padding: "10px 14px",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(139,92,246,0.25)",
              borderRadius: 10,
              color: "#E9D5FF",
              fontSize: 15,
              outline: "none",
              fontFamily: "inherit",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Date + Intensity */}
        <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          <div style={{ flex: 1 }}>
            <label
              style={{
                fontSize: 11,
                color: "#9B7FD4",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              When
            </label>
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              style={{
                width: "100%",
                marginTop: 6,
                padding: "10px 14px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(139,92,246,0.25)",
                borderRadius: 10,
                color: "#E9D5FF",
                fontSize: 14,
                outline: "none",
                fontFamily: "inherit",
                boxSizing: "border-box",
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label
              style={{
                fontSize: 11,
                color: "#9B7FD4",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Intensity ({intensity}/10)
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={intensity}
              onChange={(e) => setIntensity(parseInt(e.target.value))}
              style={{ width: "100%", marginTop: 12, accentColor: "#7C3AED" }}
            />
          </div>
        </div>

        {/* Category */}
        <div style={{ marginBottom: 16 }}>
          <label
            style={{
              fontSize: 11,
              color: "#9B7FD4",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Category
          </label>
          <div
            style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}
          >
            {categories.map((cat) => {
              const c = CATEGORY_CONFIG[cat];
              const active = category === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "7px 14px",
                    borderRadius: 20,
                    background: active
                      ? "rgba(124,58,237,0.3)"
                      : "rgba(255,255,255,0.02)",
                    border: `1px solid ${active ? "#7C3AED" : "rgba(139,92,246,0.15)"}`,
                    color: active ? "#C4B5FD" : "#9B7FD4",
                    cursor: "pointer",
                    fontSize: 13,
                  }}
                >
                  {c.emoji} {c.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Symbol (optional) */}
        <div style={{ marginBottom: 16 }}>
          <label
            style={{
              fontSize: 11,
              color: "#9B7FD4",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Symbol (optional)
          </label>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              marginTop: 8,
              maxHeight: 140,
              overflowY: "auto",
            }}
          >
            {STAGE_ORDER.map((stage) => {
              const stageSyms = grouped[stage] || [];
              if (!stageSyms.length) return null;
              const sc = STAGE_CONFIG[stage];
              return (
                <div key={stage}>
                  <p
                    style={{
                      margin: "0 0 4px",
                      fontSize: 9,
                      color: sc.color,
                      fontWeight: 700,
                      textTransform: "uppercase",
                    }}
                  >
                    {sc.emoji} {stage}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {stageSyms.map((sym) => (
                      <button
                        key={sym.id}
                        onClick={() =>
                          setSelectedSymbol(
                            selectedSymbol?.id === sym.id ? null : sym,
                          )
                        }
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          padding: "4px 10px",
                          borderRadius: 8,
                          cursor: "pointer",
                          background:
                            selectedSymbol?.id === sym.id
                              ? sc.bg
                              : "rgba(255,255,255,0.02)",
                          border: `1px solid ${selectedSymbol?.id === sym.id ? sc.color : "rgba(139,92,246,0.1)"}`,
                          color:
                            selectedSymbol?.id === sym.id
                              ? sc.color
                              : "#6B7280",
                          fontSize: 12,
                        }}
                      >
                        <span>{sym.visual}</span> {sym.symbol}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Description */}
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
            Description (optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What did this moment mean to you?"
            style={{
              width: "100%",
              marginTop: 6,
              padding: 12,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(139,92,246,0.25)",
              borderRadius: 10,
              color: "#E9D5FF",
              fontSize: 14,
              lineHeight: 1.6,
              resize: "vertical",
              minHeight: 60,
              outline: "none",
              fontFamily: "inherit",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: 12,
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
            disabled={!title.trim() || saving}
            style={{
              flex: 2,
              padding: 12,
              background: title.trim()
                ? "linear-gradient(135deg,#4F46E5,#7C3AED)"
                : "rgba(124,58,237,0.2)",
              color: title.trim() ? "#fff" : "#6B7280",
              border: "none",
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 700,
              cursor: title.trim() ? "pointer" : "not-allowed",
            }}
          >
            {saving ? "Saving…" : "Add to Timeline"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LifeTimeline({ symbols }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/symbolpath/timeline?userId=anonymous");
      if (res.ok) setData(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: 60, color: "#9B7FD4" }}>
        Loading timeline…
      </div>
    );

  const months = data?.months || {};
  const monthKeys = Object.keys(months).sort().reverse();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div
        style={{
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
            Life Timeline
          </h2>
          <p style={{ margin: "4px 0 0", color: "#9B7FD4", fontSize: 13 }}>
            {data?.lifeEventsCount || 0} life events ·{" "}
            {data?.symbolEventsCount || 0} symbol events
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "10px 16px",
            borderRadius: 12,
            background: "linear-gradient(135deg,#4F46E5,#7C3AED)",
            color: "#fff",
            border: "none",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          <Plus size={14} /> Add Event
        </button>
      </div>

      {/* Stage arc visualization */}
      {data?.stageArc?.length > 0 && (
        <div
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(139,92,246,0.2)",
            borderRadius: 16,
            padding: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 12,
            }}
          >
            <Calendar size={15} style={{ color: "#A78BFA" }} />
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#C4B5FD",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Stage Arc Over Time
            </span>
          </div>
          <StageArcBar stageArc={data.stageArc} />
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            {STAGE_ORDER.map((s) => {
              const cfg = STAGE_CONFIG[s];
              return (
                <div
                  key={s}
                  style={{ display: "flex", alignItems: "center", gap: 4 }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: cfg.color,
                    }}
                  />
                  <span style={{ fontSize: 10, color: "#6B7280" }}>
                    {s.slice(0, 3)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Monthly timeline */}
      {monthKeys.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, color: "#9B7FD4" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📅</div>
          <p style={{ fontSize: 14 }}>
            No timeline events yet. Add your first life event above.
          </p>
        </div>
      ) : (
        monthKeys.map((key) => {
          const month = months[key];
          return (
            <div key={key}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    height: 1,
                    flex: 1,
                    background: "rgba(139,92,246,0.15)",
                  }}
                />
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#C4B5FD",
                    letterSpacing: "0.05em",
                  }}
                >
                  {month.label}
                </span>
                <div
                  style={{
                    height: 1,
                    flex: 1,
                    background: "rgba(139,92,246,0.15)",
                  }}
                />
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {month.items.map((item, i) => {
                  const cfg =
                    STAGE_CONFIG[item.stage] || STAGE_CONFIG.Integration;
                  const cat = CATEGORY_CONFIG[item.category] ||
                    CATEGORY_CONFIG[item.sourceType] || {
                      emoji: "●",
                      color: "#6B7280",
                    };
                  const d = new Date(item.date);
                  const dateStr = isNaN(d)
                    ? ""
                    : d.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                  const isLifeEvent = item.type === "life_event";

                  return (
                    <div
                      key={item.id || i}
                      style={{
                        background: isLifeEvent
                          ? cfg.bg
                          : "rgba(255,255,255,0.02)",
                        border: `1px solid ${isLifeEvent ? cfg.border : "rgba(139,92,246,0.12)"}`,
                        borderRadius: 14,
                        padding: "14px 18px",
                        borderLeft: isLifeEvent
                          ? `4px solid ${cfg.color}`
                          : undefined,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          justifyContent: "space-between",
                          gap: 12,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            flex: 1,
                          }}
                        >
                          {item.visual && (
                            <span style={{ fontSize: isLifeEvent ? 26 : 18 }}>
                              {item.visual}
                            </span>
                          )}
                          <div style={{ flex: 1 }}>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                flexWrap: "wrap",
                              }}
                            >
                              <span
                                style={{
                                  fontSize: isLifeEvent ? 15 : 13,
                                  fontWeight: isLifeEvent ? 700 : 500,
                                  color: isLifeEvent ? "#E9D5FF" : cfg.color,
                                }}
                              >
                                {item.title}
                              </span>
                              {item.stage && (
                                <span
                                  style={{
                                    fontSize: 10,
                                    color: cfg.color,
                                    background: cfg.bg,
                                    padding: "2px 8px",
                                    borderRadius: 6,
                                    border: `1px solid ${cfg.border}`,
                                  }}
                                >
                                  {item.stage}
                                </span>
                              )}
                            </div>
                            {item.description && (
                              <p
                                style={{
                                  margin: "4px 0 0",
                                  fontSize: 12,
                                  color: "#9B7FD4",
                                  lineHeight: 1.5,
                                  fontStyle: isLifeEvent ? "normal" : "italic",
                                }}
                              >
                                {item.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-end",
                            gap: 4,
                            flexShrink: 0,
                          }}
                        >
                          <span style={{ fontSize: 12, color: "#6B7280" }}>
                            {dateStr}
                          </span>
                          <span style={{ fontSize: 12 }}>{cat.emoji}</span>
                          {isLifeEvent && item.intensity && (
                            <div style={{ display: "flex", gap: 1 }}>
                              {Array.from({ length: 10 }, (_, j) => (
                                <div
                                  key={j}
                                  style={{
                                    width: 3,
                                    height: 8,
                                    borderRadius: 1,
                                    background:
                                      j < item.intensity
                                        ? cfg.color
                                        : "rgba(255,255,255,0.06)",
                                  }}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })
      )}

      {showAdd && (
        <AddEventModal
          symbols={symbols}
          onClose={() => setShowAdd(false)}
          onSave={() => {
            setShowAdd(false);
            load();
          }}
        />
      )}
    </div>
  );
}
