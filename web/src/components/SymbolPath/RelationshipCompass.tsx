import { useState, useEffect, useCallback } from "react";
import { Plus, Heart, ChevronRight, X, Users } from "lucide-react";

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

const REL_TYPES = {
  partner: { emoji: "💕", label: "Partner", color: "#F472B6" },
  friend: { emoji: "🤝", label: "Friend", color: "#60A5FA" },
  family: { emoji: "🏠", label: "Family", color: "#34D399" },
  mentor: { emoji: "🏮", label: "Mentor", color: "#FBBF24" },
  colleague: { emoji: "💼", label: "Colleague", color: "#A78BFA" },
};

function AddRelModal({ onClose, onSave }) {
  const [name, setName] = useState("");
  const [relType, setRelType] = useState("friend");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/symbolpath/relationships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create",
          userId: "anonymous",
          personName: name.trim(),
          relationshipType: relType,
          notes: notes.trim() || null,
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
          maxWidth: 440,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <h2
            style={{
              margin: 0,
              color: "#E9D5FF",
              fontSize: 20,
              fontWeight: 700,
            }}
          >
            Add Relationship
          </h2>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            <X size={20} color="#9B7FD4" />
          </button>
        </div>

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
            Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Who is this person?"
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
            Type
          </label>
          <div
            style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}
          >
            {Object.entries(REL_TYPES).map(([key, val]) => (
              <button
                key={key}
                onClick={() => setRelType(key)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "7px 14px",
                  borderRadius: 20,
                  cursor: "pointer",
                  background:
                    relType === key
                      ? "rgba(124,58,237,0.3)"
                      : "rgba(255,255,255,0.02)",
                  border: `1px solid ${relType === key ? "#7C3AED" : "rgba(139,92,246,0.15)"}`,
                  color: relType === key ? "#C4B5FD" : "#9B7FD4",
                  fontSize: 13,
                }}
              >
                {val.emoji} {val.label}
              </button>
            ))}
          </div>
        </div>

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
            Notes (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="What does this relationship mean to you?"
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
            disabled={!name.trim() || saving}
            style={{
              flex: 2,
              padding: 12,
              background: name.trim()
                ? "linear-gradient(135deg,#4F46E5,#7C3AED)"
                : "rgba(124,58,237,0.2)",
              color: name.trim() ? "#fff" : "#6B7280",
              border: "none",
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 700,
              cursor: name.trim() ? "pointer" : "not-allowed",
            }}
          >
            {saving ? "Saving…" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}

function AddEventModal({ relationship, symbols, onClose, onSave }) {
  const [selectedSymbol, setSelectedSymbol] = useState(null);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const grouped = STAGE_ORDER.reduce((acc, stage) => {
    acc[stage] = symbols.filter((s) => s.stage === stage);
    return acc;
  }, {});

  const handleSave = async () => {
    if (!selectedSymbol) return;
    setSaving(true);
    try {
      const res = await fetch("/api/symbolpath/relationships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add_event",
          userId: "anonymous",
          relationshipId: relationship.id,
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
          maxWidth: 480,
          maxHeight: "85vh",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 16,
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
              Log Symbol for {relationship.person_name}
            </h2>
            <p style={{ margin: "4px 0 0", color: "#9B7FD4", fontSize: 12 }}>
              What symbol describes this relationship moment?
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            <X size={18} color="#9B7FD4" />
          </button>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            marginBottom: 16,
            maxHeight: 200,
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
                      onClick={() => setSelectedSymbol(sym)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        padding: "5px 10px",
                        borderRadius: 8,
                        cursor: "pointer",
                        fontSize: 12,
                        background:
                          selectedSymbol?.id === sym.id
                            ? sc.bg
                            : "rgba(255,255,255,0.02)",
                        border: `1px solid ${selectedSymbol?.id === sym.id ? sc.color : "rgba(139,92,246,0.1)"}`,
                        color:
                          selectedSymbol?.id === sym.id ? sc.color : "#6B7280",
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

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="What happened?"
          style={{
            width: "100%",
            padding: 12,
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(139,92,246,0.25)",
            borderRadius: 10,
            color: "#E9D5FF",
            fontSize: 14,
            lineHeight: 1.5,
            resize: "vertical",
            minHeight: 56,
            outline: "none",
            fontFamily: "inherit",
            boxSizing: "border-box",
            marginBottom: 16,
          }}
        />

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
            disabled={!selectedSymbol || saving}
            style={{
              flex: 2,
              padding: 12,
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

export default function RelationshipCompass({ symbols }) {
  const [relationships, setRelationships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [addEventFor, setAddEventFor] = useState(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/symbolpath/relationships?userId=anonymous");
      if (res.ok) {
        const data = await res.json();
        setRelationships(data.relationships || []);
      }
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
        Loading relationships…
      </div>
    );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
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
            Relationship Compass
          </h2>
          <p style={{ margin: "4px 0 0", color: "#9B7FD4", fontSize: 13 }}>
            Track symbolic patterns within your key relationships.
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
          <Plus size={14} /> Add Person
        </button>
      </div>

      {relationships.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: 60,
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(139,92,246,0.2)",
            borderRadius: 20,
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 12 }}>💕</div>
          <h3 style={{ margin: "0 0 8px", color: "#E9D5FF", fontSize: 18 }}>
            No relationships yet
          </h3>
          <p style={{ margin: 0, color: "#9B7FD4", fontSize: 14 }}>
            Add a person to start tracking symbolic patterns in your
            relationships.
          </p>
        </div>
      ) : (
        relationships.map((rel) => {
          const relType = REL_TYPES[rel.relationship_type] || REL_TYPES.friend;
          const stage =
            rel.dominantStageComputed || rel.current_stage || "Growth";
          const cfg = STAGE_CONFIG[stage];
          const isOpen = expanded === rel.id;
          const stageIdx = STAGE_ORDER.indexOf(stage);

          return (
            <div
              key={rel.id}
              style={{
                background: cfg.bg,
                border: `1px solid ${cfg.border}`,
                borderRadius: 18,
                overflow: "hidden",
                transition: "all 0.2s",
              }}
            >
              {/* Main card */}
              <div
                onClick={() => setExpanded(isOpen ? null : rel.id)}
                style={{
                  padding: "18px 20px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: "50%",
                    background: cfg.border,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 24,
                    flexShrink: 0,
                  }}
                >
                  {rel.dominant_visual || relType.emoji}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 4,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 17,
                        fontWeight: 700,
                        color: "#E9D5FF",
                      }}
                    >
                      {rel.person_name}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        color: relType.color,
                        background: `${relType.color}20`,
                        padding: "2px 8px",
                        borderRadius: 6,
                        fontWeight: 600,
                      }}
                    >
                      {relType.emoji} {relType.label}
                    </span>
                  </div>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        color: cfg.color,
                        fontWeight: 600,
                      }}
                    >
                      {cfg.emoji} {stage}
                    </span>
                    <span style={{ fontSize: 11, color: "#6B7280" }}>
                      · {rel.events_count} event
                      {rel.events_count !== 1 ? "s" : ""}
                    </span>
                  </div>
                  {rel.notes && (
                    <p
                      style={{
                        margin: "6px 0 0",
                        fontSize: 12,
                        color: "#9B7FD4",
                        fontStyle: "italic",
                        lineHeight: 1.5,
                      }}
                    >
                      {rel.notes}
                    </p>
                  )}
                </div>
                <ChevronRight
                  size={18}
                  style={{
                    color: "#6B7280",
                    transform: isOpen ? "rotate(90deg)" : "none",
                    transition: "transform 0.2s",
                    flexShrink: 0,
                  }}
                />
              </div>

              {/* Expanded detail */}
              {isOpen && (
                <div
                  style={{
                    padding: "0 20px 20px",
                    borderTop: `1px solid ${cfg.border}`,
                  }}
                >
                  {/* Stage arc */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: 8,
                      padding: "16px 0",
                    }}
                  >
                    {STAGE_ORDER.map((s, i) => {
                      const sc = STAGE_CONFIG[s];
                      const count = rel.stageCounts?.[s] || 0;
                      const active = s === stage;
                      return (
                        <div
                          key={s}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <div
                            style={{
                              width: active ? 14 : count > 0 ? 10 : 6,
                              height: active ? 14 : count > 0 ? 10 : 6,
                              borderRadius: "50%",
                              background:
                                i <= stageIdx
                                  ? sc.color
                                  : "rgba(255,255,255,0.08)",
                              boxShadow: active
                                ? `0 0 10px ${sc.color}`
                                : "none",
                            }}
                          />
                          <span
                            style={{
                              fontSize: 9,
                              color: active ? sc.color : "#4B5563",
                              fontWeight: active ? 700 : 400,
                            }}
                          >
                            {s.slice(0, 3)}
                          </span>
                          {count > 0 && (
                            <span style={{ fontSize: 8, color: "#6B7280" }}>
                              {count}×
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Symbol path */}
                  {rel.symbolPath?.length > 0 && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        flexWrap: "wrap",
                        marginBottom: 16,
                      }}
                    >
                      {rel.symbolPath.map((s, i) => {
                        const sc =
                          STAGE_CONFIG[s.stage] || STAGE_CONFIG.Integration;
                        return (
                          <div
                            key={i}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: 2,
                                padding: "6px 10px",
                                borderRadius: 8,
                                background: sc.bg,
                                border: `1px solid ${sc.border}`,
                                minWidth: 44,
                              }}
                            >
                              <span style={{ fontSize: 16 }}>{s.visual}</span>
                              <span
                                style={{
                                  fontSize: 9,
                                  color: sc.color,
                                  fontWeight: 600,
                                }}
                              >
                                {s.symbol}
                              </span>
                            </div>
                            {i < rel.symbolPath.length - 1 && (
                              <ChevronRight
                                size={11}
                                style={{ color: "#374151" }}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Recent events */}
                  {rel.events?.length > 0 && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                        marginBottom: 16,
                      }}
                    >
                      {rel.events.map((ev, i) => {
                        const ec =
                          STAGE_CONFIG[ev.stage] || STAGE_CONFIG.Integration;
                        const d = new Date(ev.created_at);
                        const dateStr = isNaN(d)
                          ? ""
                          : d.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            });
                        return (
                          <div
                            key={i}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                              padding: "8px 12px",
                              borderRadius: 10,
                              background: "rgba(255,255,255,0.02)",
                              border: "1px solid rgba(139,92,246,0.1)",
                            }}
                          >
                            <span style={{ fontSize: 18 }}>{ev.visual}</span>
                            <div style={{ flex: 1 }}>
                              <span
                                style={{
                                  fontSize: 13,
                                  fontWeight: 600,
                                  color: ec.color,
                                }}
                              >
                                {ev.symbol}
                              </span>
                              {ev.note && (
                                <p
                                  style={{
                                    margin: "2px 0 0",
                                    fontSize: 11,
                                    color: "#9B7FD4",
                                    fontStyle: "italic",
                                  }}
                                >
                                  {ev.note}
                                </p>
                              )}
                            </div>
                            <span style={{ fontSize: 11, color: "#6B7280" }}>
                              {dateStr}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <button
                    onClick={() => setAddEventFor(rel)}
                    style={{
                      width: "100%",
                      padding: 12,
                      borderRadius: 12,
                      fontSize: 13,
                      fontWeight: 700,
                      background: "rgba(124,58,237,0.15)",
                      border: "1px solid rgba(139,92,246,0.3)",
                      color: "#C4B5FD",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                    }}
                  >
                    <Plus size={14} /> Log Symbol for {rel.person_name}
                  </button>
                </div>
              )}
            </div>
          );
        })
      )}

      {showAdd && (
        <AddRelModal
          onClose={() => setShowAdd(false)}
          onSave={() => {
            setShowAdd(false);
            load();
          }}
        />
      )}
      {addEventFor && (
        <AddEventModal
          relationship={addEventFor}
          symbols={symbols}
          onClose={() => setAddEventFor(null)}
          onSave={() => {
            setAddEventFor(null);
            load();
          }}
        />
      )}
    </div>
  );
}
