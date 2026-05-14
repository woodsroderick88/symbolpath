import { useState, useCallback, useRef, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  Play,
  Check,
  Sparkles,
  Eye,
} from "lucide-react";
import {
  DEMO_CHAPTERS,
  DEMO_IDENTITY_PREVIEW,
} from "../../data/demo-walkthrough";

const STAGE_COLORS = {
  Growth: {
    color: "#34D399",
    bg: "rgba(52,211,153,0.08)",
    border: "rgba(52,211,153,0.25)",
  },
  Crisis: {
    color: "#F87171",
    bg: "rgba(248,113,113,0.08)",
    border: "rgba(248,113,113,0.25)",
  },
  Integration: {
    color: "#A78BFA",
    bg: "rgba(167,139,250,0.08)",
    border: "rgba(167,139,250,0.25)",
  },
  Mastery: {
    color: "#FBBF24",
    bg: "rgba(251,191,36,0.08)",
    border: "rgba(251,191,36,0.25)",
  },
  Awakening: {
    color: "#60A5FA",
    bg: "rgba(96,165,250,0.08)",
    border: "rgba(96,165,250,0.25)",
  },
};

export default function DemoPage() {
  const [step, setStep] = useState(-1); // -1 = intro
  const [seeded, setSeeded] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  const seedMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/demo/seed", { method: "POST" });
      if (!res.ok) throw new Error("Failed to seed");
      return res.json();
    },
    onSuccess: () => setSeeded(true),
  });

  // Live engine query — fires after walkthrough completes
  const { data: liveEngine } = useQuery({
    queryKey: ["demo-live-engine"],
    queryFn: async () => {
      const res = await fetch(
        "/api/symbolpath/engine?userId=demo-user&limit=50",
      );
      if (!res.ok) return null;
      return res.json();
    },
    enabled: seeded && step >= DEMO_CHAPTERS.length,
  });

  const handleSeed = useCallback(() => {
    seedMutation.mutate();
  }, [seedMutation]);

  const goTo = useCallback((nextStep) => {
    setTransitioning(true);
    setTimeout(() => {
      setStep(nextStep);
      setTransitioning(false);
    }, 250);
  }, []);

  const chapter =
    step >= 0 && step < DEMO_CHAPTERS.length ? DEMO_CHAPTERS[step] : null;
  const isIdentity = step === DEMO_CHAPTERS.length;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0F0A1F",
        fontFamily: "sans-serif",
      }}
    >
      <Nav />
      <main
        style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px 100px" }}
      >
        <div
          style={{
            opacity: transitioning ? 0 : 1,
            transform: transitioning ? "translateY(8px)" : "translateY(0)",
            transition: "opacity 0.25s ease, transform 0.25s ease",
          }}
        >
          {step === -1 && (
            <IntroScreen
              onStart={() => goTo(0)}
              onSeed={handleSeed}
              seeded={seeded}
              seeding={seedMutation.isPending}
            />
          )}
          {chapter && (
            <ChapterScreen
              chapter={chapter}
              step={step}
              total={DEMO_CHAPTERS.length}
              onNext={() => goTo(step + 1)}
              onBack={() => goTo(step - 1)}
            />
          )}
          {isIdentity && (
            <IdentityScreen
              onBack={() => goTo(step - 1)}
              liveEngine={liveEngine}
            />
          )}
        </div>
      </main>
    </div>
  );
}

function Nav() {
  return (
    <nav
      style={{
        background: "rgba(28,19,50,0.85)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(139,92,246,0.15)",
        position: "sticky",
        top: 0,
        zIndex: 40,
      }}
    >
      <div
        style={{
          maxWidth: 720,
          margin: "0 auto",
          padding: "12px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <a
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            textDecoration: "none",
          }}
        >
          <Compass size={18} color="#A78BFA" />
          <span style={{ fontWeight: 700, color: "#fff", fontSize: 13 }}>
            SymbolPath
          </span>
          <span style={{ fontSize: 11, color: "#7C6FA0", marginLeft: 4 }}>
            Demo
          </span>
        </a>
        <a
          href="/"
          style={{ fontSize: 12, color: "#9CA3AF", textDecoration: "none" }}
        >
          ← Back
        </a>
      </div>
    </nav>
  );
}

function IntroScreen({ onStart, onSeed, seeded, seeding }) {
  return (
    <div style={{ textAlign: "center", paddingTop: 60 }}>
      <span style={{ fontSize: 48, display: "block", marginBottom: 16 }}>
        🧭
      </span>
      <h1
        style={{
          margin: "0 0 12px",
          fontSize: 32,
          fontWeight: 700,
          color: "#E9D5FF",
        }}
      >
        Experience the Journey
      </h1>
      <p
        style={{
          margin: "0 auto 32px",
          fontSize: 15,
          color: "#9B7FD4",
          maxWidth: 480,
          lineHeight: 1.8,
        }}
      >
        Follow a complete symbolic life through 12 weeks — from Growth through
        Crisis, Integration, and Mastery. See how SymbolPath transforms isolated
        events into a unified transformation story.
      </p>

      {/* Mini arc preview */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 8,
          marginBottom: 32,
          flexWrap: "wrap",
        }}
      >
        {DEMO_CHAPTERS.map((ch, i) => {
          const sc = STAGE_COLORS[ch.stage] || STAGE_COLORS.Growth;
          return (
            <div
              key={i}
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 12px",
                  borderRadius: 10,
                  background: sc.bg,
                  border: `1px solid ${sc.border}`,
                }}
              >
                <span style={{ fontSize: 16 }}>{ch.emoji}</span>
                <span
                  style={{ fontSize: 11, fontWeight: 600, color: sc.color }}
                >
                  {ch.stage}
                </span>
              </div>
              {i < DEMO_CHAPTERS.length - 1 && (
                <ArrowRight size={12} color="#4B5563" />
              )}
            </div>
          );
        })}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          alignItems: "center",
        }}
      >
        <button
          onClick={onStart}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "14px 32px",
            fontSize: 15,
            fontWeight: 600,
            background: "linear-gradient(135deg, #7C3AED, #6D28D9)",
            color: "#fff",
            border: "none",
            borderRadius: 12,
            cursor: "pointer",
            boxShadow: "0 8px 32px rgba(124,58,237,0.3)",
          }}
        >
          <Play size={18} /> Start Walkthrough
        </button>
        {!seeded && (
          <button
            onClick={onSeed}
            disabled={seeding}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "10px 20px",
              fontSize: 12,
              fontWeight: 600,
              background: "transparent",
              color: "#7C6FA0",
              border: "1px solid rgba(139,92,246,0.2)",
              borderRadius: 10,
              cursor: seeding ? "wait" : "pointer",
            }}
          >
            <Sparkles size={14} />{" "}
            {seeding ? "Seeding..." : "Seed demo data into system"}
          </button>
        )}
        {seeded && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              color: "#34D399",
            }}
          >
            <Check size={14} /> Demo data seeded — explore the full system at{" "}
            <a
              href="/symbolpath?userId=demo-user"
              style={{ color: "#34D399", marginLeft: 4 }}
            >
              Compass
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

function ChapterScreen({ chapter, step, total, onNext, onBack }) {
  const st = STAGE_COLORS[chapter.stage] || STAGE_COLORS.Growth;
  const [revealCount, setRevealCount] = useState(0);

  useEffect(() => {
    setRevealCount(0);
    const timer = setInterval(() => {
      setRevealCount((c) => {
        if (c >= chapter.events.length) {
          clearInterval(timer);
          return c;
        }
        return c + 1;
      });
    }, 300);
    return () => clearInterval(timer);
  }, [chapter, step]);

  return (
    <div>
      {/* Progress */}
      <div style={{ display: "flex", gap: 4, marginBottom: 32 }}>
        {DEMO_CHAPTERS.map((c, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 4,
              borderRadius: 2,
              background:
                i <= step
                  ? STAGE_COLORS[c.stage]?.color || "#A78BFA"
                  : "rgba(139,92,246,0.1)",
              transition: "background 0.4s ease",
            }}
          />
        ))}
        <div
          style={{
            flex: 0.5,
            height: 4,
            borderRadius: 2,
            background: "rgba(139,92,246,0.05)",
          }}
        />
      </div>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 8,
          }}
        >
          <span style={{ fontSize: 28 }}>{chapter.emoji}</span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: st.color,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            {chapter.subtitle}
          </span>
        </div>
        <h2
          style={{
            margin: "0 0 8px",
            fontSize: 28,
            fontWeight: 700,
            color: "#E9D5FF",
          }}
        >
          {chapter.title}
        </h2>
        <p
          style={{ margin: 0, fontSize: 14, color: "#9B7FD4", lineHeight: 1.8 }}
        >
          {chapter.narrative}
        </p>
      </div>

      {/* Symbol Stream — staggered reveal */}
      <div
        style={{
          marginBottom: 20,
          padding: "20px",
          borderRadius: 14,
          background: st.bg,
          border: `1px solid ${st.border}`,
        }}
      >
        <p
          style={{
            margin: "0 0 12px",
            fontSize: 10,
            fontWeight: 700,
            color: st.color,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Symbol Stream
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {chapter.events.map((ev, i) => {
            const visible = i < revealCount;
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateX(0)" : "translateX(-12px)",
                  transition: `opacity 0.4s ease ${i * 0.05}s, transform 0.4s ease ${i * 0.05}s`,
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    color: "#7C6FA0",
                    width: 80,
                    flexShrink: 0,
                  }}
                >
                  {ev.source}
                </span>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#E9D5FF",
                    width: 100,
                    flexShrink: 0,
                  }}
                >
                  {ev.symbol}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    color: "#7C6FA0",
                    fontStyle: "italic",
                  }}
                >
                  {ev.note}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Engine Insight */}
      <div
        style={{
          marginBottom: 28,
          padding: "16px 20px",
          borderRadius: 12,
          background: "rgba(139,92,246,0.04)",
          border: "1px solid rgba(139,92,246,0.1)",
        }}
      >
        <p
          style={{
            margin: "0 0 4px",
            fontSize: 10,
            fontWeight: 700,
            color: "#A78BFA",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          What the Engine Sees
        </p>
        <p
          style={{ margin: 0, fontSize: 13, color: "#C4B5FD", lineHeight: 1.7 }}
        >
          {chapter.insight}
        </p>
      </div>

      {/* Key Symbols */}
      <div
        style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 32 }}
      >
        {chapter.keySymbols.map((s) => (
          <span
            key={s}
            style={{
              fontSize: 12,
              padding: "4px 12px",
              borderRadius: 20,
              background: st.bg,
              border: `1px solid ${st.border}`,
              color: st.color,
              fontWeight: 600,
            }}
          >
            {s}
          </span>
        ))}
      </div>

      {/* Navigation */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button
          onClick={onBack}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "10px 16px",
            fontSize: 13,
            background: "transparent",
            border: "1px solid rgba(139,92,246,0.15)",
            color: "#9B7FD4",
            borderRadius: 10,
            cursor: "pointer",
          }}
        >
          <ArrowLeft size={14} /> Back
        </button>
        <button
          onClick={onNext}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "10px 20px",
            fontSize: 13,
            fontWeight: 600,
            background: st.color,
            color: "#0F0A1F",
            border: "none",
            borderRadius: 10,
            cursor: "pointer",
          }}
        >
          {step < total - 1 ? "Next Chapter" : "View Identity"}{" "}
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}

function IdentityScreen({ onBack, liveEngine }) {
  const id = DEMO_IDENTITY_PREVIEW;
  const livePatterns = liveEngine?.patterns;

  // Auto-redirect countdown
  const [countdown, setCountdown] = useState(8);
  const [redirectPaused, setRedirectPaused] = useState(false);

  useEffect(() => {
    if (redirectPaused) return;
    if (countdown <= 0) {
      window.location.href = "/symbolpath?userId=demo-user";
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, redirectPaused]);

  return (
    <div>
      <div style={{ display: "flex", gap: 4, marginBottom: 32 }}>
        {DEMO_CHAPTERS.map((c, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 4,
              borderRadius: 2,
              background: STAGE_COLORS[c.stage]?.color || "#A78BFA",
            }}
          />
        ))}
        <div
          style={{
            flex: 0.5,
            height: 4,
            borderRadius: 2,
            background: "#A78BFA",
          }}
        />
      </div>

      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <span style={{ fontSize: 36, display: "block", marginBottom: 8 }}>
          🧬
        </span>
        <h2
          style={{
            margin: "0 0 8px",
            fontSize: 28,
            fontWeight: 700,
            color: "#E9D5FF",
          }}
        >
          Symbolic Identity Emerges
        </h2>
        <p
          style={{
            margin: "0 auto",
            fontSize: 14,
            color: "#9B7FD4",
            maxWidth: 500,
            lineHeight: 1.8,
          }}
        >
          After 12 weeks and 42 events, the system has enough data to form a
          symbolic identity. Here's what emerged.
        </p>
      </div>

      {/* Live Engine Stats (if seeded) */}
      {livePatterns && (
        <div
          style={{
            marginBottom: 20,
            padding: "16px 20px",
            borderRadius: 12,
            background: "rgba(52,211,153,0.06)",
            border: "1px solid rgba(52,211,153,0.15)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 8,
            }}
          >
            <Eye size={14} color="#34D399" />
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "#34D399",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Live Engine Output
            </span>
          </div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {livePatterns.topSymbols?.slice(0, 4).map((sym) => {
              const sc = STAGE_COLORS[sym.stage] || STAGE_COLORS.Growth;
              return (
                <div
                  key={sym.symbol}
                  style={{ display: "flex", alignItems: "center", gap: 6 }}
                >
                  <span style={{ fontSize: 18 }}>{sym.visual}</span>
                  <div>
                    <span
                      style={{ fontSize: 12, fontWeight: 700, color: sc.color }}
                    >
                      {sym.symbol}
                    </span>
                    <span
                      style={{ fontSize: 10, color: "#7C6FA0", marginLeft: 4 }}
                    >
                      {sym.count}×
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          <p
            style={{
              margin: "10px 0 0",
              fontSize: 11,
              color: "#6B7280",
              fontStyle: "italic",
            }}
          >
            Computed in real-time from the seeded 42-event stream.
          </p>
        </div>
      )}

      {/* Signatures */}
      <div
        style={{
          marginBottom: 20,
          padding: "20px",
          borderRadius: 14,
          background: "rgba(139,92,246,0.04)",
          border: "1px solid rgba(139,92,246,0.1)",
        }}
      >
        <p
          style={{
            margin: "0 0 12px",
            fontSize: 10,
            fontWeight: 700,
            color: "#A78BFA",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Archetypal Signatures
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {id.signatures.map((s) => {
            const st = STAGE_COLORS[s.stage] || STAGE_COLORS.Growth;
            return (
              <div
                key={s.symbol}
                style={{
                  padding: "10px 14px",
                  borderRadius: 12,
                  background: st.bg,
                  border: `1px solid ${st.border}`,
                }}
              >
                <span style={{ fontSize: 18, marginRight: 6 }}>{s.visual}</span>
                <span
                  style={{ fontSize: 13, fontWeight: 600, color: "#E9D5FF" }}
                >
                  {s.symbol}
                </span>
                <span style={{ fontSize: 10, marginLeft: 6, color: st.color }}>
                  {s.confidence}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Constellations */}
      <div
        style={{
          marginBottom: 20,
          padding: "20px",
          borderRadius: 14,
          background: "rgba(139,92,246,0.04)",
          border: "1px solid rgba(139,92,246,0.1)",
        }}
      >
        <p
          style={{
            margin: "0 0 12px",
            fontSize: 10,
            fontWeight: 700,
            color: "#A78BFA",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Constellations
        </p>
        {id.constellations.map((c) => (
          <div key={c.name} style={{ marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#E9D5FF" }}>
              {c.name}
            </span>
            <span style={{ fontSize: 12, color: "#7C6FA0", marginLeft: 8 }}>
              {c.members.join(" · ")}
            </span>
            <span style={{ fontSize: 10, color: "#4B5563", marginLeft: 8 }}>
              ({c.atmosphere})
            </span>
          </div>
        ))}
      </div>

      {/* Mythology */}
      <div
        style={{
          marginBottom: 20,
          padding: "20px",
          borderRadius: 14,
          background: "rgba(139,92,246,0.04)",
          border: "1px solid rgba(139,92,246,0.1)",
        }}
      >
        <p
          style={{
            margin: "0 0 12px",
            fontSize: 10,
            fontWeight: 700,
            color: "#A78BFA",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Mythology Chapters
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {id.mythology.chapters.map((ch, i) => (
            <div
              key={i}
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              <span
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 6,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  background: "rgba(139,92,246,0.08)",
                  color: "#A78BFA",
                  fontWeight: 700,
                }}
              >
                {i + 1}
              </span>
              <span style={{ fontSize: 13, color: "#D4BFFF" }}>{ch}</span>
            </div>
          ))}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginTop: 4,
            }}
          >
            <span
              style={{
                width: 20,
                height: 20,
                borderRadius: 6,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 10,
                background: "rgba(96,165,250,0.12)",
                color: "#60A5FA",
                fontWeight: 700,
              }}
            >
              →
            </span>
            <span style={{ fontSize: 13, color: "#60A5FA", fontWeight: 600 }}>
              {id.mythology.currentChapter}
            </span>
          </div>
        </div>
      </div>

      {/* Wounds */}
      <div
        style={{
          marginBottom: 32,
          padding: "16px 20px",
          borderRadius: 12,
          background: "rgba(248,113,113,0.04)",
          border: "1px solid rgba(248,113,113,0.1)",
        }}
      >
        <p
          style={{
            margin: "0 0 8px",
            fontSize: 10,
            fontWeight: 700,
            color: "#F87171",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Recurring Wound
        </p>
        <p style={{ margin: 0, fontSize: 13, color: "#FCA5A5" }}>
          {id.wounds[0].title}:{" "}
          <span style={{ color: "#9B7FD4" }}>
            {id.wounds[0].pattern} — this stage oscillation has appeared before
            and will likely appear again. The system watches for it.
          </span>
        </p>
      </div>

      {/* CTA — with auto-redirect */}
      <div style={{ textAlign: "center", padding: "32px 0" }}>
        <p style={{ margin: "0 0 16px", fontSize: 14, color: "#7C6FA0" }}>
          This is what 12 weeks of unified symbolic tracking produces.
        </p>

        {/* Auto-redirect notice */}
        <div
          style={{
            margin: "0 auto 20px",
            padding: "14px 20px",
            borderRadius: 12,
            background: "rgba(96,165,250,0.06)",
            border: "1px solid rgba(96,165,250,0.15)",
            maxWidth: 400,
          }}
        >
          <p style={{ margin: "0 0 6px", fontSize: 13, color: "#93C5FD" }}>
            {redirectPaused
              ? "Redirect paused"
              : `Entering your live compass in ${countdown}s...`}
          </p>
          <button
            onClick={() => setRedirectPaused(!redirectPaused)}
            style={{
              fontSize: 11,
              color: "#60A5FA",
              background: "none",
              border: "none",
              cursor: "pointer",
              textDecoration: "underline",
              padding: 0,
            }}
          >
            {redirectPaused
              ? "Resume auto-redirect"
              : "Pause — I'm still reading"}
          </button>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <a
            href="/symbolpath?userId=demo-user"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "12px 24px",
              fontSize: 13,
              fontWeight: 600,
              background: "#7C3AED",
              color: "#fff",
              borderRadius: 10,
              textDecoration: "none",
            }}
          >
            Enter Compass Now <ArrowRight size={14} />
          </a>
          <a
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "12px 24px",
              fontSize: 13,
              fontWeight: 600,
              background: "transparent",
              color: "#A78BFA",
              border: "1px solid rgba(139,92,246,0.2)",
              borderRadius: 10,
              textDecoration: "none",
            }}
          >
            Back to Home
          </a>
        </div>
      </div>

      <div
        style={{ display: "flex", justifyContent: "flex-start", marginTop: 16 }}
      >
        <button
          onClick={onBack}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "10px 16px",
            fontSize: 13,
            background: "transparent",
            border: "1px solid rgba(139,92,246,0.15)",
            color: "#9B7FD4",
            borderRadius: 10,
            cursor: "pointer",
          }}
        >
          <ArrowLeft size={14} /> Previous
        </button>
      </div>
    </div>
  );
}
