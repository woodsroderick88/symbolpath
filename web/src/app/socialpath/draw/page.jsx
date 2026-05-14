import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Sparkles,
  ArrowLeft,
  Shuffle,
  Search,
  X,
  Send,
  ChevronDown,
  ChevronUp,
  RotateCcw,
} from "lucide-react";

const STAGE_COLORS = {
  Awakening: {
    bg: "rgba(59,130,246,0.15)",
    border: "rgba(59,130,246,0.4)",
    text: "#93C5FD",
    glow: "rgba(59,130,246,0.3)",
  },
  Growth: {
    bg: "rgba(34,197,94,0.15)",
    border: "rgba(34,197,94,0.4)",
    text: "#86EFAC",
    glow: "rgba(34,197,94,0.3)",
  },
  Crisis: {
    bg: "rgba(239,68,68,0.15)",
    border: "rgba(239,68,68,0.4)",
    text: "#FCA5A5",
    glow: "rgba(239,68,68,0.3)",
  },
  Integration: {
    bg: "rgba(168,85,247,0.15)",
    border: "rgba(168,85,247,0.4)",
    text: "#D8B4FE",
    glow: "rgba(168,85,247,0.3)",
  },
  Mastery: {
    bg: "rgba(234,179,8,0.15)",
    border: "rgba(234,179,8,0.4)",
    text: "#FDE68A",
    glow: "rgba(234,179,8,0.3)",
  },
};

const STAGE_INSIGHTS = {
  Awakening:
    "A season of fresh beginnings. New possibilities are emerging — trust the seeds you're planting.",
  Growth:
    "You are building and expanding. The work you're doing now is creating roots that will hold you steady.",
  Crisis:
    "You are moving through intensity and disruption. Crisis always precedes transformation — you are not lost.",
  Integration:
    "You are weaving threads together. The lessons are landing. This is the sacred work of making meaning.",
  Mastery:
    "You have moved through the full arc. What you've learned is now yours to carry forward and share.",
};

export default function SocialPathDrawPage() {
  const queryClient = useQueryClient();
  const [drawnSymbol, setDrawnSymbol] = useState(null);
  const [showManualPick, setShowManualPick] = useState(false);
  const [manualSearch, setManualSearch] = useState("");
  const [reflection, setReflection] = useState("");
  const [saved, setSaved] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);
  const [showPrompts, setShowPrompts] = useState(false);

  const { data: archetypesData, isLoading } = useQuery({
    queryKey: ["archetypes"],
    queryFn: async () => {
      const res = await fetch("/api/archetypes");
      if (!res.ok) throw new Error("Failed to load symbols");
      return res.json();
    },
  });

  const archetypes = archetypesData?.archetypes || [];

  const filteredArchetypes = useMemo(() => {
    if (!manualSearch) return archetypes;
    const lower = manualSearch.toLowerCase();
    return archetypes.filter(
      (a) =>
        a.symbol.toLowerCase().includes(lower) ||
        a.stage.toLowerCase().includes(lower) ||
        a.theme.toLowerCase().includes(lower),
    );
  }, [archetypes, manualSearch]);

  const groupedByStage = useMemo(() => {
    const groups = {};
    for (const a of filteredArchetypes) {
      if (!groups[a.stage]) groups[a.stage] = [];
      groups[a.stage].push(a);
    }
    return groups;
  }, [filteredArchetypes]);

  const saveMutation = useMutation({
    mutationFn: async ({ symbolId, note }) => {
      const res = await fetch("/api/symbolpath/engine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "anonymous",
          sourceType: "socialpath",
          sourceId: `draw-${Date.now()}`,
          symbolId,
          note: note || null,
        }),
      });
      if (!res.ok) throw new Error("Failed to save");
      return res.json();
    },
    onSuccess: () => {
      setSaved(true);
      queryClient.invalidateQueries({ queryKey: ["symbolpath"] });
    },
  });

  const drawRandom = useCallback(() => {
    if (archetypes.length === 0) return;
    setIsRevealing(true);
    setSaved(false);
    setReflection("");
    setShowPrompts(false);

    let count = 0;
    const maxFlips = 12;
    const interval = setInterval(() => {
      const idx = Math.floor(Math.random() * archetypes.length);
      setDrawnSymbol(archetypes[idx]);
      count++;
      if (count >= maxFlips) {
        clearInterval(interval);
        const finalIdx = Math.floor(Math.random() * archetypes.length);
        setDrawnSymbol(archetypes[finalIdx]);
        setIsRevealing(false);
      }
    }, 120);
  }, [archetypes]);

  const selectManual = useCallback((symbol) => {
    setDrawnSymbol(symbol);
    setShowManualPick(false);
    setSaved(false);
    setReflection("");
    setShowPrompts(false);
    setIsRevealing(false);
  }, []);

  const handleSave = useCallback(() => {
    if (!drawnSymbol) return;
    saveMutation.mutate({ symbolId: drawnSymbol.id, note: reflection });
  }, [drawnSymbol, reflection, saveMutation]);

  const resetDraw = useCallback(() => {
    setDrawnSymbol(null);
    setSaved(false);
    setReflection("");
    setShowPrompts(false);
    setIsRevealing(false);
  }, []);

  const stageColor = drawnSymbol
    ? STAGE_COLORS[drawnSymbol.stage] || STAGE_COLORS.Growth
    : null;

  const reflectionPrompts = useMemo(() => {
    if (!drawnSymbol?.reflection_prompts) return [];
    try {
      const parsed =
        typeof drawnSymbol.reflection_prompts === "string"
          ? JSON.parse(drawnSymbol.reflection_prompts)
          : drawnSymbol.reflection_prompts;
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [drawnSymbol]);

  const actionPrompts = useMemo(() => {
    if (!drawnSymbol?.action_prompts) return [];
    try {
      const parsed =
        typeof drawnSymbol.action_prompts === "string"
          ? JSON.parse(drawnSymbol.action_prompts)
          : drawnSymbol.action_prompts;
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [drawnSymbol]);

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0A0614",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🌀</div>
          <p style={{ color: "#9B7FD4", fontSize: 14 }}>
            Gathering the symbols…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0A0614",
        fontFamily: "sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          background:
            "linear-gradient(180deg, rgba(76,29,149,0.45), transparent)",
          borderBottom: "1px solid rgba(139,92,246,0.15)",
          padding: "0 24px",
          position: "sticky",
          top: 0,
          zIndex: 50,
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        <div
          style={{
            maxWidth: 680,
            margin: "0 auto",
            padding: "20px 0 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <a
              href="/"
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                border: "1px solid rgba(139,92,246,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#C4B5FD",
                textDecoration: "none",
                background: "rgba(139,92,246,0.08)",
              }}
            >
              <ArrowLeft size={18} />
            </a>
            <div>
              <h1
                style={{
                  margin: 0,
                  color: "#E9D5FF",
                  fontSize: 20,
                  fontWeight: 700,
                }}
              >
                Draw a Symbol
              </h1>
              <p style={{ margin: 0, color: "#9B7FD4", fontSize: 13 }}>
                Listen for what the path reveals
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div
        style={{ maxWidth: 680, margin: "0 auto", padding: "32px 24px 80px" }}
      >
        {/* No symbol drawn yet */}
        {!drawnSymbol && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 32,
              paddingTop: 40,
            }}
          >
            <div style={{ fontSize: 72, lineHeight: 1 }}>🔮</div>
            <div style={{ textAlign: "center" }}>
              <h2
                style={{
                  color: "#E9D5FF",
                  fontSize: 22,
                  fontWeight: 700,
                  margin: "0 0 8px",
                }}
              >
                What symbol finds you today?
              </h2>
              <p
                style={{
                  color: "#9B7FD4",
                  fontSize: 14,
                  margin: 0,
                  maxWidth: 400,
                }}
              >
                Draw a random symbol from the 24 archetypes, or choose one that
                resonates with your current moment.
              </p>
            </div>
            <div
              style={{
                display: "flex",
                gap: 16,
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <button
                onClick={drawRandom}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "14px 28px",
                  borderRadius: 14,
                  background: "linear-gradient(135deg, #7C3AED, #6D28D9)",
                  border: "1px solid rgba(139,92,246,0.5)",
                  color: "#fff",
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                <Shuffle size={18} /> Random Draw
              </button>
              <button
                onClick={() => setShowManualPick(true)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "14px 28px",
                  borderRadius: 14,
                  background: "rgba(139,92,246,0.08)",
                  border: "1px solid rgba(139,92,246,0.25)",
                  color: "#C4B5FD",
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                <Search size={18} /> Choose Manually
              </button>
            </div>
            <div style={{ width: "100%", marginTop: 16 }}>
              <p
                style={{
                  color: "#7C6FAA",
                  fontSize: 12,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  marginBottom: 12,
                  textAlign: "center",
                }}
              >
                24 Symbol Archetypes
              </p>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                  justifyContent: "center",
                }}
              >
                {archetypes.map((a) => {
                  const sc = STAGE_COLORS[a.stage] || STAGE_COLORS.Growth;
                  return (
                    <div
                      key={a.id}
                      title={`${a.symbol} — ${a.stage}`}
                      style={{
                        padding: "6px 12px",
                        borderRadius: 20,
                        background: sc.bg,
                        border: `1px solid ${sc.border}`,
                        color: sc.text,
                        fontSize: 12,
                        fontWeight: 500,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                      }}
                      onClick={() => selectManual(a)}
                    >
                      <span>{a.visual}</span> {a.symbol}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Symbol Revealed */}
        {drawnSymbol && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div
              style={{
                background: `linear-gradient(135deg, ${stageColor.bg}, rgba(15,6,20,0.9))`,
                border: `1px solid ${stageColor.border}`,
                borderRadius: 20,
                padding: 32,
                textAlign: "center",
                boxShadow: `0 0 60px ${stageColor.glow}`,
                opacity: isRevealing ? 0.7 : 1,
                transform: isRevealing ? "scale(0.97)" : "scale(1)",
                transition: "all 0.5s ease",
              }}
            >
              <div
                style={{
                  fontSize: 72,
                  lineHeight: 1,
                  marginBottom: 16,
                  filter: isRevealing ? "blur(2px)" : "none",
                  transition: "filter 0.3s",
                }}
              >
                {drawnSymbol.visual}
              </div>
              <h2
                style={{
                  color: "#E9D5FF",
                  fontSize: 28,
                  fontWeight: 800,
                  margin: "0 0 6px",
                  letterSpacing: "-0.5px",
                }}
              >
                {drawnSymbol.symbol}
              </h2>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  marginBottom: 16,
                }}
              >
                <span
                  style={{
                    padding: "4px 14px",
                    borderRadius: 20,
                    background: stageColor.bg,
                    border: `1px solid ${stageColor.border}`,
                    color: stageColor.text,
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  {drawnSymbol.stage}
                </span>
                <span style={{ color: "#9B7FD4", fontSize: 13 }}>·</span>
                <span
                  style={{
                    color: "#9B7FD4",
                    fontSize: 13,
                    fontStyle: "italic",
                  }}
                >
                  {drawnSymbol.theme}
                </span>
              </div>
              <p
                style={{
                  color: "#C4B5FD",
                  fontSize: 14,
                  lineHeight: 1.7,
                  margin: 0,
                  maxWidth: 480,
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                {STAGE_INSIGHTS[drawnSymbol.stage]}
              </p>
            </div>

            {/* Reflection Prompts */}
            {(reflectionPrompts.length > 0 || actionPrompts.length > 0) && (
              <div
                style={{
                  background: "rgba(139,92,246,0.06)",
                  border: "1px solid rgba(139,92,246,0.15)",
                  borderRadius: 16,
                  overflow: "hidden",
                }}
              >
                <button
                  onClick={() => setShowPrompts(!showPrompts)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "14px 20px",
                    background: "transparent",
                    border: "none",
                    color: "#C4B5FD",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  <span
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <Sparkles size={16} /> Reflection Prompts
                  </span>
                  {showPrompts ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </button>
                {showPrompts && (
                  <div style={{ padding: "0 20px 20px" }}>
                    {reflectionPrompts.length > 0 && (
                      <div
                        style={{
                          marginBottom: actionPrompts.length > 0 ? 16 : 0,
                        }}
                      >
                        <p
                          style={{
                            color: "#9B7FD4",
                            fontSize: 11,
                            textTransform: "uppercase",
                            letterSpacing: 1,
                            marginBottom: 10,
                          }}
                        >
                          Reflect
                        </p>
                        {reflectionPrompts.map((p, i) => (
                          <p
                            key={i}
                            style={{
                              color: "#D1D5DB",
                              fontSize: 13,
                              lineHeight: 1.6,
                              margin: "0 0 8px",
                              paddingLeft: 12,
                              borderLeft: `2px solid ${stageColor.border}`,
                            }}
                          >
                            {p}
                          </p>
                        ))}
                      </div>
                    )}
                    {actionPrompts.length > 0 && (
                      <div>
                        <p
                          style={{
                            color: "#9B7FD4",
                            fontSize: 11,
                            textTransform: "uppercase",
                            letterSpacing: 1,
                            marginBottom: 10,
                          }}
                        >
                          Act
                        </p>
                        {actionPrompts.map((p, i) => (
                          <p
                            key={i}
                            style={{
                              color: "#D1D5DB",
                              fontSize: 13,
                              lineHeight: 1.6,
                              margin: "0 0 8px",
                              paddingLeft: 12,
                              borderLeft: `2px solid ${stageColor.border}`,
                            }}
                          >
                            {p}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Reflection Input */}
            {!saved ? (
              <div
                style={{
                  background: "rgba(139,92,246,0.06)",
                  border: "1px solid rgba(139,92,246,0.15)",
                  borderRadius: 16,
                  padding: 20,
                }}
              >
                <label
                  style={{
                    color: "#C4B5FD",
                    fontSize: 14,
                    fontWeight: 600,
                    marginBottom: 10,
                    display: "block",
                  }}
                >
                  Your Reflection
                </label>
                <textarea
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  placeholder="What does this symbol mean to you right now? What is it reflecting back?"
                  rows={4}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: 12,
                    background: "rgba(15,6,20,0.6)",
                    border: "1px solid rgba(139,92,246,0.2)",
                    color: "#E9D5FF",
                    fontSize: 14,
                    resize: "vertical",
                    outline: "none",
                    lineHeight: 1.6,
                    fontFamily: "inherit",
                    boxSizing: "border-box",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    marginTop: 14,
                    justifyContent: "flex-end",
                  }}
                >
                  <button
                    onClick={resetDraw}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "10px 20px",
                      borderRadius: 10,
                      background: "rgba(139,92,246,0.08)",
                      border: "1px solid rgba(139,92,246,0.2)",
                      color: "#9B7FD4",
                      fontSize: 13,
                      fontWeight: 500,
                      cursor: "pointer",
                    }}
                  >
                    <RotateCcw size={14} /> Draw Again
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saveMutation.isPending}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "10px 24px",
                      borderRadius: 10,
                      background: "linear-gradient(135deg, #7C3AED, #6D28D9)",
                      border: "1px solid rgba(139,92,246,0.5)",
                      color: "#fff",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: saveMutation.isPending
                        ? "not-allowed"
                        : "pointer",
                      opacity: saveMutation.isPending ? 0.6 : 1,
                    }}
                  >
                    <Send size={14} />{" "}
                    {saveMutation.isPending ? "Saving…" : "Save Reflection"}
                  </button>
                </div>
                {saveMutation.isError && (
                  <p style={{ color: "#FCA5A5", fontSize: 13, marginTop: 10 }}>
                    Something went wrong. Please try again.
                  </p>
                )}
              </div>
            ) : (
              <div
                style={{
                  background: "rgba(34,197,94,0.08)",
                  border: "1px solid rgba(34,197,94,0.25)",
                  borderRadius: 16,
                  padding: 24,
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 8 }}>✨</div>
                <p
                  style={{
                    color: "#86EFAC",
                    fontSize: 16,
                    fontWeight: 600,
                    margin: "0 0 6px",
                  }}
                >
                  Reflection Saved
                </p>
                <p
                  style={{ color: "#9B7FD4", fontSize: 13, margin: "0 0 20px" }}
                >
                  Your {drawnSymbol.symbol} draw has been added to your symbol
                  stream.
                </p>
                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    justifyContent: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    onClick={resetDraw}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "10px 20px",
                      borderRadius: 10,
                      background: "rgba(139,92,246,0.08)",
                      border: "1px solid rgba(139,92,246,0.2)",
                      color: "#C4B5FD",
                      fontSize: 13,
                      fontWeight: 500,
                      cursor: "pointer",
                    }}
                  >
                    <RotateCcw size={14} /> Draw Another
                  </button>
                  <a
                    href="/"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "10px 20px",
                      borderRadius: 10,
                      background: "linear-gradient(135deg, #7C3AED, #6D28D9)",
                      border: "1px solid rgba(139,92,246,0.5)",
                      color: "#fff",
                      fontSize: 13,
                      fontWeight: 600,
                      textDecoration: "none",
                    }}
                  >
                    View SymbolPath →
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Manual Pick Modal */}
      {showManualPick && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 560,
              maxHeight: "80vh",
              background: "#1C1332",
              borderRadius: 20,
              border: "1px solid rgba(139,92,246,0.25)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "20px 24px 0",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  color: "#E9D5FF",
                  fontSize: 18,
                  fontWeight: 700,
                }}
              >
                Choose a Symbol
              </h3>
              <button
                onClick={() => setShowManualPick(false)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: "rgba(139,92,246,0.1)",
                  border: "1px solid rgba(139,92,246,0.2)",
                  color: "#9B7FD4",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <X size={16} />
              </button>
            </div>
            <div style={{ padding: "16px 24px" }}>
              <div style={{ position: "relative" }}>
                <Search
                  size={16}
                  style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#7C6FAA",
                  }}
                />
                <input
                  type="text"
                  value={manualSearch}
                  onChange={(e) => setManualSearch(e.target.value)}
                  placeholder="Search symbols, stages, themes…"
                  style={{
                    width: "100%",
                    padding: "10px 14px 10px 38px",
                    borderRadius: 10,
                    background: "rgba(15,6,20,0.6)",
                    border: "1px solid rgba(139,92,246,0.2)",
                    color: "#E9D5FF",
                    fontSize: 14,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "0 24px 24px" }}>
              {Object.entries(groupedByStage).map(([stage, symbols]) => {
                const sc = STAGE_COLORS[stage] || STAGE_COLORS.Growth;
                return (
                  <div key={stage} style={{ marginBottom: 20 }}>
                    <p
                      style={{
                        color: sc.text,
                        fontSize: 11,
                        textTransform: "uppercase",
                        letterSpacing: 1.5,
                        fontWeight: 700,
                        marginBottom: 10,
                      }}
                    >
                      {stage}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                      }}
                    >
                      {symbols.map((sym) => (
                        <button
                          key={sym.id}
                          onClick={() => selectManual(sym)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            padding: "12px 16px",
                            borderRadius: 12,
                            background: sc.bg,
                            border: `1px solid ${sc.border}`,
                            color: "#E9D5FF",
                            fontSize: 14,
                            fontWeight: 500,
                            cursor: "pointer",
                            textAlign: "left",
                            width: "100%",
                          }}
                        >
                          <span style={{ fontSize: 24 }}>{sym.visual}</span>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600 }}>{sym.symbol}</div>
                            <div
                              style={{
                                color: "#9B7FD4",
                                fontSize: 12,
                                marginTop: 2,
                              }}
                            >
                              {sym.theme}
                            </div>
                          </div>
                          <ArrowLeft
                            size={14}
                            style={{
                              color: "#7C6FAA",
                              transform: "rotate(180deg)",
                            }}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
              {filteredArchetypes.length === 0 && (
                <p
                  style={{
                    color: "#7C6FAA",
                    fontSize: 14,
                    textAlign: "center",
                    padding: "40px 0",
                  }}
                >
                  No symbols match "{manualSearch}"
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.3); border-radius: 4px; }
        textarea::placeholder { color: #7C6FAA; }
        input::placeholder { color: #7C6FAA; }
      `}</style>
    </div>
  );
}
