import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Compass,
  ChevronRight,
  ArrowRight,
  ArrowDown,
  Sparkles,
  BookOpen,
  Brain,
  TrendingUp,
  Fingerprint,
  Shuffle,
  Zap,
  Users,
  Moon as MoonIcon,
  Heart,
  Layers,
} from "lucide-react";
import {
  CANONICAL,
  PHILOSOPHY,
  WALKTHROUGH,
  ARCHITECTURE,
  GLOSSARY,
  IS_NOT,
  PRINCIPLES,
  WHY_IT_MATTERS,
  STAGES,
} from "../data/symbolpath-about";

// ──────────────────────────────────────────────────────────────
// SCROLL REVEAL — Minimal IntersectionObserver fade-in
// ──────────────────────────────────────────────────────────────

function ScrollReveal({ children, delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// STAGE COLORS (shared)
// ──────────────────────────────────────────────────────────────

const STAGE_COLORS = {
  Awakening: {
    color: "#60A5FA",
    bg: "rgba(96,165,250,0.12)",
    border: "rgba(96,165,250,0.35)",
    emoji: "🌅",
  },
  Growth: {
    color: "#34D399",
    bg: "rgba(52,211,153,0.12)",
    border: "rgba(52,211,153,0.35)",
    emoji: "🌱",
  },
  Crisis: {
    color: "#F87171",
    bg: "rgba(248,113,113,0.12)",
    border: "rgba(248,113,113,0.35)",
    emoji: "⚡",
  },
  Integration: {
    color: "#A78BFA",
    bg: "rgba(167,139,250,0.12)",
    border: "rgba(167,139,250,0.35)",
    emoji: "🔮",
  },
  Mastery: {
    color: "#FBBF24",
    bg: "rgba(251,191,36,0.12)",
    border: "rgba(251,191,36,0.35)",
    emoji: "🏆",
  },
};
const getStage = (s) =>
  STAGE_COLORS[s] || {
    color: "#9B7FD4",
    bg: "rgba(155,127,212,0.12)",
    border: "rgba(155,127,212,0.35)",
    emoji: "✨",
  };

// ──────────────────────────────────────────────────────────────
// MAIN PAGE
// ──────────────────────────────────────────────────────────────

export default function SymbolPathLandingPage() {
  const [view, setView] = useState("loading"); // loading | landing | dashboard
  const dashboardRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const visited = localStorage.getItem("symbolpath_returning");
    // Always show landing — returning users get a quick "jump to dashboard" option
    setView("landing");
  }, []);

  const scrollToDashboard = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("symbolpath_returning", "true");
    }
    if (dashboardRef.current) {
      dashboardRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  if (view === "loading") {
    return <div style={{ minHeight: "100vh", background: "#0F0A1F" }} />;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0F0A1F",
        fontFamily: "sans-serif",
      }}
    >
      {/* ─── STICKY NAV ─── */}
      <SiteNav onDashboard={scrollToDashboard} />

      {/* ─── LANDING CONTENT ─── */}
      <HeroSection onStart={scrollToDashboard} />
      <ScrollReveal>
        <SpineSection />
      </ScrollReveal>
      <ScrollReveal>
        <PhilosophySection />
      </ScrollReveal>
      <ScrollReveal>
        <WalkthroughSection />
      </ScrollReveal>
      <ScrollReveal>
        <ArchitectureSection />
      </ScrollReveal>
      <ScrollReveal>
        <StagesSection />
      </ScrollReveal>
      <ScrollReveal>
        <PrinciplesSection />
      </ScrollReveal>
      <ScrollReveal>
        <IsNotSection />
      </ScrollReveal>
      <ScrollReveal>
        <GlossarySection />
      </ScrollReveal>
      <ScrollReveal>
        <WhyItMattersSection />
      </ScrollReveal>
      <ScrollReveal>
        <CTASection onStart={scrollToDashboard} />
      </ScrollReveal>

      {/* ─── DASHBOARD ─── */}
      <div ref={dashboardRef}>
        <DashboardSection />
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// NAVIGATION
// ══════════════════════════════════════════════════════════════

function SiteNav({ onDashboard }) {
  const scrollTo = (id) => {
    if (typeof window === "undefined") return;
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

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
          maxWidth: 1100,
          margin: "0 auto",
          padding: "12px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Compass size={20} color="#A78BFA" />
          <span style={{ fontWeight: 700, color: "#fff", fontSize: 14 }}>
            SymbolPath
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button
            onClick={() => scrollTo("philosophy")}
            style={{
              fontSize: 12,
              color: "#9CA3AF",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            Philosophy
          </button>
          <button
            onClick={() => scrollTo("how-it-works")}
            style={{
              fontSize: 12,
              color: "#9CA3AF",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            How It Works
          </button>
          <button
            onClick={() => scrollTo("glossary")}
            style={{
              fontSize: 12,
              color: "#9CA3AF",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            Glossary
          </button>
          <a
            href="/symbolpath"
            style={{ fontSize: 12, color: "#9CA3AF", textDecoration: "none" }}
          >
            Compass
          </a>
          <a
            href="/demo"
            style={{ fontSize: 12, color: "#9CA3AF", textDecoration: "none" }}
          >
            Demo
          </a>
          <button
            onClick={onDashboard}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              padding: "6px 14px",
              background: "#7C3AED",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            <Sparkles size={12} /> Enter
          </button>
        </div>
      </div>
    </nav>
  );
}

// ══════════════════════════════════════════════════════════════
// 1. HERO — Canonical Definition
// ══════════════════════════════════════════════════════════════

function HeroSection({ onStart }) {
  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "100px 24px 80px",
        textAlign: "center",
      }}
    >
      {/* Glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.15) 0%, transparent 60%)",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 720,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 10,
            marginBottom: 20,
          }}
        >
          <Compass size={28} color="#A78BFA" />
          <span
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#A78BFA",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            SymbolPath
          </span>
        </div>

        <h1
          style={{
            margin: "0 0 16px",
            fontSize: 48,
            fontWeight: 800,
            color: "#fff",
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
          }}
        >
          Track your symbolic
          <br />
          <span
            style={{
              background: "linear-gradient(135deg, #C084FC, #818CF8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            transformation over time
          </span>
        </h1>

        <p
          style={{
            margin: "0 auto 32px",
            fontSize: 17,
            color: "#9CA3AF",
            lineHeight: 1.7,
            maxWidth: 560,
          }}
        >
          {CANONICAL.definition}
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 12,
            flexWrap: "wrap",
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
            <Sparkles size={18} /> Start Your Practice
          </button>
          <a
            href="/demo"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "14px 28px",
              fontSize: 15,
              fontWeight: 600,
              background: "transparent",
              color: "#C4B5FD",
              border: "1px solid rgba(139,92,246,0.3)",
              borderRadius: 12,
              textDecoration: "none",
            }}
          >
            See the Demo <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════
// CONCEPTUAL SPINE
// ══════════════════════════════════════════════════════════════

function SpineSection() {
  return (
    <section style={{ padding: "0 24px 80px" }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 0,
            background: "rgba(139,92,246,0.04)",
            borderRadius: 16,
            border: "1px solid rgba(139,92,246,0.1)",
            overflow: "hidden",
          }}
        >
          {CANONICAL.spine.map((step, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "16px 24px",
                borderBottom:
                  i < CANONICAL.spine.length - 1
                    ? "1px solid rgba(139,92,246,0.06)"
                    : "none",
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  flexShrink: 0,
                  background: `rgba(139,92,246,${0.06 + i * 0.04})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#A78BFA",
                }}
              >
                {i + 1}
              </div>
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    margin: 0,
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#E9D5FF",
                  }}
                >
                  {step.label}
                </p>
                <p
                  style={{ margin: "2px 0 0", fontSize: 12, color: "#7C6FA0" }}
                >
                  {step.detail}
                </p>
              </div>
              {i < CANONICAL.spine.length - 1 && (
                <ArrowDown size={14} color="#4B5563" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════
// 2. CORE PHILOSOPHY
// ══════════════════════════════════════════════════════════════

function PhilosophySection() {
  return (
    <section
      id="philosophy"
      style={{
        padding: "80px 24px",
        borderTop: "1px solid rgba(139,92,246,0.06)",
        scrollMarginTop: 80,
      }}
    >
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <SectionLabel text="Core Philosophy" />
        <h2
          style={{
            margin: "0 0 12px",
            fontSize: 28,
            fontWeight: 700,
            color: "#E9D5FF",
            textAlign: "center",
          }}
        >
          Why symbolic tracking exists
        </h2>
        <p
          style={{
            margin: "0 auto 40px",
            fontSize: 14,
            color: "#7C6FA0",
            textAlign: "center",
            maxWidth: 500,
          }}
        >
          Not mystical language. Not abstract theory. Clear philosophy.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 20,
          }}
        >
          {PHILOSOPHY.map((item, i) => (
            <div
              key={i}
              style={{
                padding: "28px 26px",
                borderRadius: 16,
                background: "rgba(139,92,246,0.04)",
                border: "1px solid rgba(139,92,246,0.1)",
              }}
            >
              <span
                style={{ fontSize: 28, display: "block", marginBottom: 12 }}
              >
                {item.icon}
              </span>
              <h3
                style={{
                  margin: "0 0 8px",
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#E9D5FF",
                }}
              >
                {item.title}
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  color: "#9B7FD4",
                  lineHeight: 1.8,
                }}
              >
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════
// 3. HOW IT WORKS WALKTHROUGH
// ══════════════════════════════════════════════════════════════

function WalkthroughSection() {
  return (
    <section
      id="how-it-works"
      style={{
        padding: "80px 24px",
        borderTop: "1px solid rgba(139,92,246,0.06)",
        scrollMarginTop: 60,
      }}
    >
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <SectionLabel text="How It Works" />
        <h2
          style={{
            margin: "0 0 6px",
            fontSize: 28,
            fontWeight: 700,
            color: "#E9D5FF",
            textAlign: "center",
          }}
        >
          {WALKTHROUGH.title}
        </h2>
        <p
          style={{
            margin: "0 0 8px",
            fontSize: 14,
            color: "#7C6FA0",
            textAlign: "center",
          }}
        >
          Scenario:{" "}
          <span style={{ color: "#C4B5FD" }}>{WALKTHROUGH.scenario}</span>
        </p>
        <p
          style={{
            margin: "0 auto 40px",
            fontSize: 12,
            color: "#4B5563",
            textAlign: "center",
            maxWidth: 400,
          }}
        >
          Follow one real event through the entire engine.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {WALKTHROUGH.steps.map((step, i) => (
            <div key={i} style={{ display: "flex", gap: 16 }}>
              {/* Timeline */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: 40,
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                    background: "rgba(139,92,246,0.08)",
                    border: "1px solid rgba(139,92,246,0.15)",
                  }}
                >
                  {step.icon}
                </div>
                {i < WALKTHROUGH.steps.length - 1 && (
                  <div
                    style={{
                      width: 2,
                      flex: 1,
                      minHeight: 20,
                      background: "rgba(139,92,246,0.1)",
                    }}
                  />
                )}
              </div>
              {/* Content */}
              <div
                style={{
                  flex: 1,
                  paddingBottom: i < WALKTHROUGH.steps.length - 1 ? 20 : 0,
                  paddingTop: 4,
                }}
              >
                <p
                  style={{
                    margin: "0 0 4px",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#E9D5FF",
                  }}
                >
                  {step.action}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: 12,
                    color: "#7C6FA0",
                    lineHeight: 1.7,
                  }}
                >
                  {step.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════
// 4. ARCHITECTURE
// ══════════════════════════════════════════════════════════════

function ArchitectureSection() {
  return (
    <section
      style={{
        padding: "80px 24px",
        borderTop: "1px solid rgba(139,92,246,0.06)",
      }}
    >
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <SectionLabel text="Architecture" />
        <h2
          style={{
            margin: "0 0 40px",
            fontSize: 28,
            fontWeight: 700,
            color: "#E9D5FF",
            textAlign: "center",
          }}
        >
          Five layers, one stream
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {ARCHITECTURE.map((layer, i) => (
            <div key={i}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "20px 24px",
                  borderRadius: 14,
                  background: `${layer.color}08`,
                  border: `1px solid ${layer.color}20`,
                }}
              >
                <span style={{ fontSize: 24 }}>{layer.icon}</span>
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 15,
                      fontWeight: 700,
                      color: layer.color,
                    }}
                  >
                    {layer.layer}
                  </p>
                  <p
                    style={{
                      margin: "2px 0 0",
                      fontSize: 12,
                      color: "#9B7FD4",
                    }}
                  >
                    {layer.purpose}
                  </p>
                </div>
              </div>
              {i < ARCHITECTURE.length - 1 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    padding: "4px 0",
                  }}
                >
                  <ArrowDown size={16} color="#4B5563" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════
// TRANSFORMATION STAGES
// ══════════════════════════════════════════════════════════════

function StagesSection() {
  return (
    <section
      style={{
        padding: "80px 24px",
        borderTop: "1px solid rgba(139,92,246,0.06)",
      }}
    >
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <SectionLabel text="The Five Stages" />
        <h2
          style={{
            margin: "0 0 12px",
            fontSize: 28,
            fontWeight: 700,
            color: "#E9D5FF",
            textAlign: "center",
          }}
        >
          The backbone of transformation
        </h2>
        <p
          style={{
            margin: "0 auto 40px",
            fontSize: 13,
            color: "#7C6FA0",
            textAlign: "center",
            maxWidth: 480,
          }}
        >
          Every symbol belongs to one stage. Users cycle through them — the
          system tracks direction, not just position.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
            gap: 12,
          }}
        >
          {STAGES.map((stage, i) => (
            <div
              key={i}
              style={{
                textAlign: "center",
                padding: "20px 12px",
                borderRadius: 14,
                background: `${stage.color}0A`,
                border: `1px solid ${stage.color}25`,
              }}
            >
              <span style={{ fontSize: 28, display: "block", marginBottom: 6 }}>
                {stage.emoji}
              </span>
              <p
                style={{
                  margin: "0 0 2px",
                  fontSize: 13,
                  fontWeight: 700,
                  color: stage.color,
                }}
              >
                {stage.name}
              </p>
              <p style={{ margin: 0, fontSize: 10, color: "#7C6FA0" }}>
                {stage.description}
              </p>
            </div>
          ))}
        </div>

        {/* Flow indicator */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: 16,
            gap: 6,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {STAGES.map((stage, i) => (
            <span
              key={i}
              style={{ display: "flex", alignItems: "center", gap: 6 }}
            >
              <span
                style={{ fontSize: 11, fontWeight: 600, color: stage.color }}
              >
                {stage.emoji} {stage.name}
              </span>
              {i < STAGES.length - 1 && (
                <ArrowRight size={12} color="#4B5563" />
              )}
            </span>
          ))}
        </div>

        <p
          style={{
            margin: "16px auto 0",
            fontSize: 11,
            color: "#4B5563",
            textAlign: "center",
            maxWidth: 400,
          }}
        >
          These stages are not linear. People move forward and backward. The
          system tracks the full spiral.
        </p>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════
// 7. DESIGN PRINCIPLES
// ══════════════════════════════════════════════════════════════

function PrinciplesSection() {
  return (
    <section
      style={{
        padding: "80px 24px",
        borderTop: "1px solid rgba(139,92,246,0.06)",
      }}
    >
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <SectionLabel text="Design Principles" />
        <h2
          style={{
            margin: "0 0 40px",
            fontSize: 28,
            fontWeight: 700,
            color: "#E9D5FF",
            textAlign: "center",
          }}
        >
          Product guardrails and philosophical anchors
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 16,
          }}
        >
          {PRINCIPLES.map((p, i) => (
            <div
              key={i}
              style={{
                padding: "22px 24px",
                borderRadius: 14,
                background: "rgba(139,92,246,0.03)",
                border: "1px solid rgba(139,92,246,0.08)",
                display: "flex",
                gap: 14,
                alignItems: "flex-start",
              }}
            >
              <span style={{ fontSize: 22, flexShrink: 0, marginTop: 2 }}>
                {p.icon}
              </span>
              <div>
                <p
                  style={{
                    margin: "0 0 4px",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#E9D5FF",
                  }}
                >
                  {p.principle}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: 12,
                    color: "#7C6FA0",
                    lineHeight: 1.7,
                  }}
                >
                  {p.meaning}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════
// 6. WHAT SYMBOLPATH IS NOT
// ══════════════════════════════════════════════════════════════

function IsNotSection() {
  return (
    <section
      style={{
        padding: "80px 24px",
        borderTop: "1px solid rgba(139,92,246,0.06)",
      }}
    >
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <SectionLabel text="What SymbolPath Is Not" />
        <h2
          style={{
            margin: "0 0 12px",
            fontSize: 28,
            fontWeight: 700,
            color: "#E9D5FF",
            textAlign: "center",
          }}
        >
          Clear boundaries
        </h2>
        <p
          style={{
            margin: "0 auto 36px",
            fontSize: 13,
            color: "#7C6FA0",
            textAlign: "center",
            maxWidth: 440,
          }}
        >
          SymbolPath is a reflective symbolic continuity system. It is not any
          of these things.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {IS_NOT.map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 16,
                padding: "16px 22px",
                borderRadius: 12,
                background: "rgba(248,113,113,0.03)",
                border: "1px solid rgba(248,113,113,0.08)",
                alignItems: "flex-start",
              }}
            >
              <span
                style={{
                  fontSize: 16,
                  color: "#F87171",
                  fontWeight: 700,
                  marginTop: 1,
                }}
              >
                ✕
              </span>
              <div>
                <p
                  style={{
                    margin: "0 0 2px",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#FCA5A5",
                  }}
                >
                  Not {item.claim}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: 12,
                    color: "#9B7FD4",
                    lineHeight: 1.7,
                  }}
                >
                  {item.clarification}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: 24,
            padding: "16px 22px",
            borderRadius: 12,
            background: "rgba(52,211,153,0.04)",
            border: "1px solid rgba(52,211,153,0.12)",
            textAlign: "center",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 13,
              color: "#34D399",
              fontWeight: 600,
            }}
          >
            Instead: a reflective symbolic continuity system that observes
            recurrence, atmosphere, and transformation.
          </p>
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════
// 5. GLOSSARY
// ══════════════════════════════════════════════════════════════

function GlossarySection() {
  const [expanded, setExpanded] = useState(null);

  return (
    <section
      id="glossary"
      style={{
        padding: "80px 24px",
        borderTop: "1px solid rgba(139,92,246,0.06)",
        scrollMarginTop: 60,
      }}
    >
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <SectionLabel text="Terminology" />
        <h2
          style={{
            margin: "0 0 12px",
            fontSize: 28,
            fontWeight: 700,
            color: "#E9D5FF",
            textAlign: "center",
          }}
        >
          The symbolic vocabulary
        </h2>
        <p
          style={{
            margin: "0 auto 36px",
            fontSize: 13,
            color: "#7C6FA0",
            textAlign: "center",
            maxWidth: 440,
          }}
        >
          SymbolPath has developed its own precise language. Here's what each
          term means.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {GLOSSARY.map((item, i) => {
            const isOpen = expanded === i;
            return (
              <div
                key={i}
                style={{
                  borderRadius: 12,
                  overflow: "hidden",
                  border: "1px solid rgba(139,92,246,0.08)",
                  background: isOpen
                    ? "rgba(139,92,246,0.04)"
                    : "rgba(139,92,246,0.02)",
                }}
              >
                <button
                  onClick={() => setExpanded(isOpen ? null : i)}
                  style={{
                    width: "100%",
                    padding: "14px 20px",
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    textAlign: "left",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{ fontSize: 14, fontWeight: 700, color: "#E9D5FF" }}
                  >
                    {item.term}
                  </span>
                  <ChevronRight
                    size={14}
                    color="#6B7280"
                    style={{
                      transform: isOpen ? "rotate(90deg)" : "none",
                      transition: "transform 0.15s",
                    }}
                  />
                </button>
                {isOpen && (
                  <div style={{ padding: "0 20px 16px" }}>
                    <p
                      style={{
                        margin: "0 0 8px",
                        fontSize: 13,
                        color: "#C4B5FD",
                        lineHeight: 1.8,
                      }}
                    >
                      {item.definition}
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 11,
                        color: "#7C6FA0",
                        fontStyle: "italic",
                      }}
                    >
                      e.g. {item.example}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════
// 8. WHY IT MATTERS
// ══════════════════════════════════════════════════════════════

function WhyItMattersSection() {
  return (
    <section
      style={{
        padding: "80px 24px",
        borderTop: "1px solid rgba(139,92,246,0.06)",
      }}
    >
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <SectionLabel text="Why It Matters" />
        <h2
          style={{
            margin: "0 0 8px",
            fontSize: 24,
            fontWeight: 700,
            color: "#E9D5FF",
            textAlign: "center",
          }}
        >
          {WHY_IT_MATTERS.headline}
        </h2>
        <p
          style={{
            margin: "0 auto 40px",
            fontSize: 13,
            color: "#7C6FA0",
            textAlign: "center",
            maxWidth: 500,
            lineHeight: 1.7,
          }}
        >
          We have sophisticated tools for tracking work, habits, and health.
          Inner life deserves the same structural attention.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {WHY_IT_MATTERS.points.map((point, i) => (
            <div
              key={i}
              style={{
                padding: "20px 24px",
                borderRadius: 14,
                background: "rgba(139,92,246,0.04)",
                border: "1px solid rgba(139,92,246,0.08)",
              }}
            >
              <p
                style={{
                  margin: "0 0 6px",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#E9D5FF",
                }}
              >
                {point.title}
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  color: "#9B7FD4",
                  lineHeight: 1.7,
                }}
              >
                {point.detail}
              </p>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: 32,
            padding: "24px 28px",
            borderRadius: 16,
            background:
              "linear-gradient(135deg, rgba(124,58,237,0.08), rgba(99,102,241,0.06))",
            border: "1px solid rgba(139,92,246,0.15)",
            textAlign: "center",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 15,
              color: "#D4BFFF",
              lineHeight: 1.8,
              fontStyle: "italic",
            }}
          >
            {WHY_IT_MATTERS.closing}
          </p>
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════
// CTA
// ══════════════════════════════════════════════════════════════

function CTASection({ onStart }) {
  return (
    <section style={{ padding: "80px 24px 40px", textAlign: "center" }}>
      <div style={{ maxWidth: 500, margin: "0 auto" }}>
        <h2
          style={{
            margin: "0 0 12px",
            fontSize: 28,
            fontWeight: 700,
            color: "#E9D5FF",
          }}
        >
          Begin your symbolic practice
        </h2>
        <p style={{ margin: "0 0 28px", fontSize: 14, color: "#7C6FA0" }}>
          Draw a symbol. Log a reflection. Over time, discover the deeper story
          your journey is telling.
        </p>
        <button
          onClick={onStart}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "16px 36px",
            fontSize: 16,
            fontWeight: 600,
            background: "linear-gradient(135deg, #7C3AED, #6D28D9)",
            color: "#fff",
            border: "none",
            borderRadius: 14,
            cursor: "pointer",
            boxShadow: "0 8px 32px rgba(124,58,237,0.3)",
          }}
        >
          <Sparkles size={20} /> Start Now
        </button>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════
// DASHBOARD (preserved from original — appears below landing)
// ══════════════════════════════════════════════════════════════

function DashboardSection() {
  const queryClient = useQueryClient();
  const [todaySymbol, setTodaySymbol] = useState(null);

  const { data: compassData, isLoading: compassLoading } = useQuery({
    queryKey: ["symbolpath-compass"],
    queryFn: async () => {
      const res = await fetch("/api/symbolpath/compass?userId=anonymous");
      if (!res.ok) throw new Error("Failed to load compass");
      return res.json();
    },
  });

  const { data: engineData } = useQuery({
    queryKey: ["symbolpath-engine"],
    queryFn: async () => {
      const res = await fetch("/api/symbolpath/engine?userId=anonymous");
      if (!res.ok) throw new Error("Failed to load engine");
      return res.json();
    },
  });

  const { data: archetypesData } = useQuery({
    queryKey: ["archetypes"],
    queryFn: async () => {
      const res = await fetch("/api/archetypes");
      if (!res.ok) throw new Error("Failed to load archetypes");
      return res.json();
    },
  });

  const archetypes = archetypesData?.archetypes || [];

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("sp_today_symbol");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const today = new Date().toISOString().split("T")[0];
        if (parsed.date === today && parsed.symbol)
          setTodaySymbol(parsed.symbol);
      } catch {
        /* ignore */
      }
    }
  }, []);

  const drawSymbol = useCallback(() => {
    if (archetypes.length === 0) return;
    const idx = Math.floor(Math.random() * archetypes.length);
    const sym = archetypes[idx];
    setTodaySymbol(sym);
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "sp_today_symbol",
        JSON.stringify({
          date: new Date().toISOString().split("T")[0],
          symbol: sym,
        }),
      );
    }
    fetch("/api/symbolpath/engine", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: "anonymous",
        sourceType: "daily_draw",
        sourceId: `draw-${Date.now()}`,
        symbolId: sym.id,
        note: "Daily symbol draw",
      }),
    })
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ["symbolpath-compass"] });
        queryClient.invalidateQueries({ queryKey: ["symbolpath-engine"] });
      })
      .catch((e) => console.error("Save draw error:", e));
  }, [archetypes, queryClient]);

  const compass = compassData?.compass;
  const needsMore = compassData?.needsMore;
  const patterns = engineData?.patterns;
  const recentPath = compass?.symbolPath?.slice(-5) || [];
  const topSymbols = patterns?.topSymbols?.slice(0, 3) || [];

  return (
    <section
      style={{
        padding: "60px 24px 100px",
        borderTop: "1px solid rgba(139,92,246,0.12)",
        background:
          "linear-gradient(180deg, rgba(139,92,246,0.03), transparent)",
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <SectionLabel text="Your Dashboard" />
          <h2
            style={{
              margin: "0 0 8px",
              fontSize: 24,
              fontWeight: 700,
              color: "#E9D5FF",
            }}
          >
            Your Symbolic Practice
          </h2>
          <p style={{ margin: 0, fontSize: 13, color: "#7C6FA0" }}>
            Draw, reflect, and explore your transformation.
          </p>
        </div>

        {/* Today's Symbol */}
        <div style={{ marginBottom: 24 }}>
          {todaySymbol ? (
            <TodaySymbolCard symbol={todaySymbol} onRedraw={drawSymbol} />
          ) : (
            <div
              onClick={drawSymbol}
              style={{
                padding: "36px 24px",
                borderRadius: 20,
                textAlign: "center",
                cursor: "pointer",
                background: "#1C1332",
                border: "1px solid rgba(139,92,246,0.2)",
              }}
            >
              <div style={{ fontSize: 48, marginBottom: 12 }}>🔮</div>
              <p
                style={{
                  margin: "0 0 4px",
                  fontSize: 16,
                  fontWeight: 600,
                  color: "#fff",
                }}
              >
                Draw Today's Symbol
              </p>
              <p style={{ margin: "0 0 16px", fontSize: 13, color: "#7C6FA0" }}>
                Click to draw your first symbol of the day
              </p>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "10px 20px",
                  background: "#7C3AED",
                  color: "#fff",
                  borderRadius: 12,
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                <Shuffle size={14} /> Draw Now
              </span>
            </div>
          )}
        </div>

        {/* Journey cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <CurrentStageCard
            compass={compass}
            needsMore={needsMore}
            loading={compassLoading}
          />
          <RecentMovementCard
            recentPath={recentPath}
            loading={compassLoading}
          />
        </div>

        {/* Explore */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 12,
            marginBottom: 24,
          }}
        >
          <ExploreCard
            href="/journal"
            icon={<BookOpen size={20} color="#A78BFA" />}
            label="Reflect"
            sublabel="Journal"
          />
          <ExploreCard
            href="/insights"
            icon={<Brain size={20} color="#A78BFA" />}
            label="Understand"
            sublabel="Insights"
          />
          <ExploreCard
            href="/identity"
            icon={<Fingerprint size={20} color="#A78BFA" />}
            label="Identity"
            sublabel="Who You Are"
          />
          <ExploreCard
            href="/symbolpath"
            icon={<TrendingUp size={20} color="#A78BFA" />}
            label="Track"
            sublabel="Compass"
          />
          <ExploreCard
            href="/mythology"
            icon={<BookOpen size={20} color="#A78BFA" />}
            label="Mythology"
            sublabel="Your Story"
          />
          <ExploreCard
            href="/continuity"
            icon={<Layers size={20} color="#A78BFA" />}
            label="Continuity"
            sublabel="Chapters"
          />
        </div>

        {/* Living path */}
        {topSymbols.length > 0 && (
          <div
            style={{
              padding: "20px 24px",
              borderRadius: 16,
              background: "#1C1332",
              border: "1px solid rgba(139,92,246,0.15)",
              marginBottom: 24,
            }}
          >
            <p
              style={{
                margin: "0 0 12px",
                fontSize: 10,
                fontWeight: 700,
                color: "#7C6FA0",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Living Path
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                flexWrap: "wrap",
              }}
            >
              {topSymbols.map((sym, i) => {
                const st = getStage(sym.stage);
                return (
                  <div
                    key={sym.symbol}
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "8px 14px",
                        borderRadius: 12,
                        background: st.bg,
                        border: `1px solid ${st.border}`,
                      }}
                    >
                      <span style={{ fontSize: 20 }}>
                        {sym.visual || st.emoji}
                      </span>
                      <div>
                        <p
                          style={{
                            margin: 0,
                            fontSize: 13,
                            fontWeight: 600,
                            color: "#fff",
                          }}
                        >
                          {sym.symbol}
                        </p>
                        <p style={{ margin: 0, fontSize: 10, color: st.color }}>
                          {sym.stage} · ×{sym.count}
                        </p>
                      </div>
                    </div>
                    {i < topSymbols.length - 1 && (
                      <ArrowRight size={12} color="#4B5563" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Quick links */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 8,
          }}
        >
          <QuickLink
            href="/reading"
            icon={<Sparkles size={14} />}
            label="Start Reading"
          />
          <QuickLink
            href="/decision-mirror"
            icon={<Zap size={14} />}
            label="Decision Mirror"
          />
          <QuickLink
            href="/community"
            icon={<Users size={14} />}
            label="Community"
          />
          <QuickLink
            href="/dreams"
            icon={<MoonIcon size={14} />}
            label="Dream Journal"
          />
          <QuickLink
            href="/life-events"
            icon={<Heart size={14} />}
            label="Life Events"
          />
          <QuickLink
            href="/i-ching"
            icon={<Layers size={14} />}
            label="I-Ching"
          />
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════
// DASHBOARD SUB-COMPONENTS
// ══════════════════════════════════════════════════════════════

function TodaySymbolCard({ symbol, onRedraw }) {
  const st = getStage(symbol.stage);
  const prompts = useMemo(() => {
    if (!symbol.reflection_prompts) return [];
    try {
      const p =
        typeof symbol.reflection_prompts === "string"
          ? JSON.parse(symbol.reflection_prompts)
          : symbol.reflection_prompts;
      return Array.isArray(p) ? p : [];
    } catch {
      return [];
    }
  }, [symbol]);

  return (
    <div
      style={{
        borderRadius: 20,
        border: `1px solid ${st.border}`,
        background: st.bg,
        padding: "24px 28px",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 16,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 36,
            background: "rgba(0,0,0,0.2)",
            border: `1px solid ${st.border}`,
            flexShrink: 0,
          }}
        >
          {symbol.visual || st.emoji}
        </div>
        <div style={{ flex: 1, minWidth: 180 }}>
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
                fontSize: 22,
                fontWeight: 700,
                color: "#fff",
              }}
            >
              {symbol.symbol}
            </h3>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                padding: "2px 10px",
                borderRadius: 20,
                color: st.color,
                background: st.bg,
                border: `1px solid ${st.border}`,
              }}
            >
              {st.emoji} {symbol.stage}
            </span>
          </div>
          {symbol.theme && (
            <p style={{ margin: "0 0 4px", fontSize: 13, color: "#9CA3AF" }}>
              {symbol.theme}
            </p>
          )}
          {prompts.length > 0 && (
            <p style={{ margin: 0, fontSize: 13, color: "#D1D5DB" }}>
              <span style={{ color: st.color }}>›</span> {prompts[0]}
            </p>
          )}
        </div>
        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          <a
            href="/socialpath/draw"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "10px 18px",
              borderRadius: 12,
              border: `1px solid ${st.border}`,
              color: st.color,
              background: "rgba(0,0,0,0.2)",
              fontSize: 13,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Reflect <ArrowRight size={14} />
          </a>
          <button
            onClick={onRedraw}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid rgba(139,92,246,0.2)",
              color: "#9B7FD4",
              background: "rgba(0,0,0,0.15)",
              cursor: "pointer",
            }}
          >
            <Shuffle size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

function CurrentStageCard({ compass, needsMore, loading }) {
  if (loading) return <CardSkeleton />;
  if (!compass || needsMore) {
    return (
      <div
        style={{
          borderRadius: 16,
          border: "1px solid rgba(139,92,246,0.15)",
          background: "#1C1332",
          padding: "24px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 12,
          }}
        >
          <Compass size={14} color="#A78BFA" />
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "#A78BFA",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Current Stage
          </span>
        </div>
        <p style={{ margin: "0 0 12px", fontSize: 13, color: "#7C6FA0" }}>
          Start your journey by drawing a symbol.
        </p>
        <a
          href="/socialpath/draw"
          style={{
            fontSize: 12,
            color: "#A78BFA",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          <Sparkles
            size={12}
            style={{ verticalAlign: "middle", marginRight: 4 }}
          />{" "}
          Draw First Symbol
        </a>
      </div>
    );
  }

  const st = getStage(compass.currentStage);
  return (
    <div
      style={{
        borderRadius: 16,
        background: st.bg,
        border: `1px solid ${st.border}`,
        padding: "24px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginBottom: 12,
        }}
      >
        <Compass size={14} color="#A78BFA" />
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: "#A78BFA",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Current Stage
        </span>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 10,
        }}
      >
        <span style={{ fontSize: 28 }}>
          {compass.currentSymbol?.visual || st.emoji}
        </span>
        <div>
          <p
            style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#fff" }}
          >
            {compass.currentSymbol?.symbol}
          </p>
          <p
            style={{
              margin: 0,
              fontSize: 12,
              fontWeight: 600,
              color: st.color,
            }}
          >
            {st.emoji} {compass.currentStage}
          </p>
        </div>
      </div>
    </div>
  );
}

function RecentMovementCard({ recentPath, loading }) {
  if (loading) return <CardSkeleton />;
  return (
    <div
      style={{
        borderRadius: 16,
        border: "1px solid rgba(139,92,246,0.15)",
        background: "#1C1332",
        padding: "24px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginBottom: 12,
        }}
      >
        <TrendingUp size={14} color="#A78BFA" />
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: "#A78BFA",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Recent Movement
        </span>
      </div>
      {recentPath.length > 1 ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 6,
          }}
        >
          {recentPath.map((e, i) => {
            const st = getStage(e.stage);
            return (
              <span
                key={i}
                style={{ display: "flex", alignItems: "center", gap: 4 }}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "3px 10px",
                    borderRadius: 20,
                    color: st.color,
                    background: st.bg,
                    border: `1px solid ${st.border}`,
                  }}
                >
                  {e.visual || st.emoji} {e.symbol}
                </span>
                {i < recentPath.length - 1 && (
                  <ArrowRight size={10} color="#4B5563" />
                )}
              </span>
            );
          })}
        </div>
      ) : (
        <p
          style={{
            margin: 0,
            fontSize: 13,
            color: "#4B5563",
            textAlign: "center",
            padding: "12px 0",
          }}
        >
          Keep drawing to reveal movement patterns.
        </p>
      )}
      <a
        href="/symbolpath"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          fontSize: 12,
          color: "#A78BFA",
          textDecoration: "none",
          marginTop: 12,
        }}
      >
        View compass <ChevronRight size={12} />
      </a>
    </div>
  );
}

function ExploreCard({ href, icon, label, sublabel }) {
  return (
    <a
      href={href}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
        padding: "18px 20px",
        borderRadius: 14,
        background: "#1C1332",
        border: "1px solid rgba(139,92,246,0.12)",
        textDecoration: "none",
      }}
    >
      {icon}
      <p
        style={{
          margin: "4px 0 0",
          fontSize: 13,
          fontWeight: 600,
          color: "#fff",
        }}
      >
        {label}
      </p>
      <p style={{ margin: 0, fontSize: 11, color: "#7C6FA0" }}>{sublabel}</p>
    </a>
  );
}

function QuickLink({ href, icon, label }) {
  return (
    <a
      href={href}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "12px 16px",
        borderRadius: 12,
        background: "rgba(28,19,50,0.5)",
        border: "1px solid rgba(139,92,246,0.08)",
        fontSize: 12,
        color: "#D1D5DB",
        textDecoration: "none",
      }}
    >
      <span style={{ color: "#A78BFA" }}>{icon}</span> {label}
    </a>
  );
}

function CardSkeleton() {
  return (
    <div
      style={{
        borderRadius: 16,
        border: "1px solid rgba(139,92,246,0.15)",
        background: "#1C1332",
        padding: "24px",
      }}
    >
      <div
        style={{
          height: 14,
          background: "rgba(139,92,246,0.1)",
          borderRadius: 6,
          width: 100,
          marginBottom: 16,
        }}
      />
      <div
        style={{
          height: 28,
          background: "rgba(139,92,246,0.1)",
          borderRadius: 8,
          width: 160,
          marginBottom: 8,
        }}
      />
      <div
        style={{
          height: 12,
          background: "rgba(139,92,246,0.06)",
          borderRadius: 6,
          width: "100%",
        }}
      />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// SHARED COMPONENTS
// ══════════════════════════════════════════════════════════════

function SectionLabel({ text }) {
  return (
    <p
      style={{
        margin: "0 0 12px",
        fontSize: 11,
        fontWeight: 700,
        color: "#A78BFA",
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        textAlign: "center",
      }}
    >
      {text}
    </p>
  );
}
