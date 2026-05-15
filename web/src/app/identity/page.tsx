import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronLeft,
  RefreshCw,
  Fingerprint,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Visual Constants
// ─────────────────────────────────────────────────────────────────────────────
const STAGE = {
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
const stg = (s) => STAGE[s] || STAGE.Growth;

const CONFIDENCE_VIS = {
  emerging: {
    color: "#6B7280",
    bg: "rgba(107,114,128,0.1)",
    border: "rgba(107,114,128,0.2)",
    label: "Emerging",
    desc: "Too early to stabilize",
  },
  recurring: {
    color: "#A78BFA",
    bg: "rgba(167,139,250,0.1)",
    border: "rgba(167,139,250,0.2)",
    label: "Recurring",
    desc: "Meaningful repetition",
  },
  established: {
    color: "#34D399",
    bg: "rgba(52,211,153,0.1)",
    border: "rgba(52,211,153,0.2)",
    label: "Established",
    desc: "Stable tendency",
  },
  foundational: {
    color: "#FBBF24",
    bg: "rgba(251,191,36,0.1)",
    border: "rgba(251,191,36,0.2)",
    label: "Foundational",
    desc: "Deep identity pattern",
  },
};
const confV = (c) => CONFIDENCE_VIS[c] || CONFIDENCE_VIS.emerging;

const MATURITY_VIS = {
  nascent: {
    color: "#6B7280",
    emoji: "🌑",
    gradient: "linear-gradient(135deg, #1F2937, #111827)",
  },
  early: {
    color: "#A78BFA",
    emoji: "🌒",
    gradient: "linear-gradient(135deg, #1E1B4B, #0F0A1E)",
  },
  forming: {
    color: "#60A5FA",
    emoji: "🌓",
    gradient: "linear-gradient(135deg, #1E3A5F, #0F0A1E)",
  },
  deep: {
    color: "#FBBF24",
    emoji: "🌕",
    gradient: "linear-gradient(135deg, #422006, #0F0A1E)",
  },
};
const matV = (l) => MATURITY_VIS[l] || MATURITY_VIS.nascent;

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────
export default function SymbolicIdentityPage() {
  const {
    data: identity,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["symbolpath-identity"],
    queryFn: async () => {
      const res = await fetch("/api/symbolpath/identity");
      if (!res.ok) throw new Error("Failed to load identity");
      return res.json();
    },
  });

  const loading = isLoading;
  const ready = identity?.ready;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0F0A1E",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px 100px" }}
      >
        {/* Back */}
        <a
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontSize: 13,
            color: "#9B7FD4",
            textDecoration: "none",
            marginBottom: 32,
          }}
        >
          <ChevronLeft size={15} /> Back
        </a>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <h1
                style={{
                  margin: "0 0 6px",
                  fontSize: 28,
                  fontWeight: 700,
                  color: "#E9D5FF",
                }}
              >
                Symbolic Identity
              </h1>
              <p
                style={{
                  margin: 0,
                  fontSize: 14,
                  color: "#7C6FA0",
                  lineHeight: 1.6,
                }}
              >
                The forces that consistently define your transformation.
              </p>
            </div>
            <button
              onClick={() => refetch()}
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                border: "1px solid rgba(139,92,246,0.2)",
                background: "transparent",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#9B7FD4",
              }}
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🧬</div>
            <p style={{ color: "#9B7FD4", fontSize: 15 }}>
              Reading your symbolic identity…
            </p>
          </div>
        )}

        {/* Not ready */}
        {!loading && !ready && identity && (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <Fingerprint
              size={48}
              style={{ color: "#4B5563", marginBottom: 16 }}
            />
            <h2 style={{ color: "#E9D5FF", fontSize: 22, marginBottom: 8 }}>
              Identity is forming
            </h2>
            <p
              style={{
                color: "#9B7FD4",
                maxWidth: 440,
                margin: "0 auto",
                lineHeight: 1.7,
                fontSize: 14,
              }}
            >
              {identity.message}
            </p>
            {identity.meta && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 24,
                  marginTop: 24,
                }}
              >
                <Metric label="Events" value={identity.meta.totalEvents} />
                <Metric label="Days" value={identity.meta.spanDays} />
                <Metric label="Symbols" value={identity.meta.distinctSymbols} />
                <Metric label="Sources" value={identity.meta.distinctSources} />
              </div>
            )}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <p style={{ color: "#F87171", fontSize: 14 }}>
              Something went wrong loading your identity. Try refreshing.
            </p>
          </div>
        )}

        {/* Identity Profile */}
        {!loading && ready && identity && (
          <>
            {/* Maturity Banner */}
            <MaturityBanner maturity={identity.maturity} meta={identity.meta} />

            {/* Summary */}
            {identity.summary && (
              <div
                style={{
                  marginBottom: 36,
                  padding: "24px",
                  borderRadius: 16,
                  background: "rgba(139,92,246,0.04)",
                  border: "1px solid rgba(139,92,246,0.12)",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: 14,
                    color: "#C4B5FD",
                    lineHeight: 1.85,
                    fontStyle: "italic",
                  }}
                >
                  {identity.summary}
                </p>
              </div>
            )}

            {/* Pillar 1: Archetypal Signatures */}
            <SignaturesSection signatures={identity.signatures} />

            {/* Pillar 2: Emotional Climates */}
            <ClimatesSection climates={identity.climates} />

            {/* Pillar 3: Dominant Constellations */}
            <ConstellationsSection constellations={identity.constellations} />

            {/* Pillar 4: Transformation Tendencies */}
            <TendenciesSection tendencies={identity.tendencies} />

            {/* Pillar 5: Symbolic Seasons */}
            <SeasonsSection seasons={identity.seasons} />

            {/* Ontological Insights */}
            <OntologySection ontology={identity.ontology || {}} />

            {/* Footer */}
            <div
              style={{
                textAlign: "center",
                marginTop: 40,
                paddingTop: 24,
                borderTop: "1px solid rgba(139,92,246,0.1)",
              }}
            >
              <p
                style={{
                  fontSize: 12,
                  color: "#6B7280",
                  letterSpacing: "0.05em",
                }}
              >
                {identity.meta.totalEvents} events · {identity.meta.spanDays}{" "}
                days · {identity.meta.distinctWeeks} weeks ·{" "}
                {identity.meta.distinctSources} sources
              </p>
              <p style={{ fontSize: 11, color: "#4B5563", marginTop: 4 }}>
                Identity emerges through accumulation, not declaration.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MATURITY BANNER
// ═══════════════════════════════════════════════════════════════════════════════
function MaturityBanner({ maturity, meta }) {
  const mv = matV(maturity.level);
  return (
    <div
      style={{
        background: mv.gradient,
        borderRadius: 20,
        padding: "28px 28px",
        marginBottom: 32,
        border: "1px solid rgba(139,92,246,0.15)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 16,
        }}
      >
        <span style={{ fontSize: 36 }}>{mv.emoji}</span>
        <div>
          <p
            style={{
              margin: "0 0 4px",
              fontSize: 10,
              fontWeight: 700,
              color: "#7C6FA0",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Identity Maturity
          </p>
          <p
            style={{
              margin: 0,
              fontSize: 22,
              fontWeight: 700,
              color: mv.color,
            }}
          >
            {maturity.percentage}% —{" "}
            {maturity.level.charAt(0).toUpperCase() + maturity.level.slice(1)}
          </p>
        </div>
      </div>
      {/* Progress bar */}
      <div
        style={{
          width: "100%",
          height: 6,
          background: "rgba(255,255,255,0.06)",
          borderRadius: 3,
          marginBottom: 16,
        }}
      >
        <div
          style={{
            height: 6,
            borderRadius: 3,
            width: `${maturity.percentage}%`,
            background: `linear-gradient(90deg, ${mv.color}, ${mv.color}88)`,
            transition: "width 0.8s ease",
          }}
        />
      </div>
      <p style={{ margin: 0, fontSize: 13, color: "#9B7FD4", lineHeight: 1.7 }}>
        {maturity.description}
      </p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PILLAR 1: SIGNATURES
// ═══════════════════════════════════════════════════════════════════════════════
function SignaturesSection({ signatures }) {
  const [expanded, setExpanded] = useState(true);
  if (!signatures || signatures.length === 0) return null;

  return (
    <CollapsibleSection
      title="Archetypal Signatures"
      emoji="🧬"
      subtitle="Symbols that keep returning across time, context, and atmosphere"
      count={signatures.length}
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
    >
      {expanded && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {signatures.map((sig, i) => (
            <SignatureCard key={i} sig={sig} />
          ))}
        </div>
      )}
    </CollapsibleSection>
  );
}

function SignatureCard({ sig }) {
  const [open, setOpen] = useState(false);
  const cv = confV(sig.confidence);
  const sv = stg(sig.stage);

  return (
    <div
      onClick={() => setOpen(!open)}
      style={{
        background: "rgba(255,255,255,0.02)",
        border: `1px solid ${sv.border}`,
        borderRadius: 14,
        padding: "16px 20px",
        cursor: "pointer",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 28, flexShrink: 0 }}>{sig.visual}</span>
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 2,
            }}
          >
            <span style={{ fontSize: 16, fontWeight: 700, color: "#E9D5FF" }}>
              {sig.symbol}
            </span>
            <ConfidenceBadge confidence={sig.confidence} />
          </div>
          <p style={{ margin: 0, fontSize: 12, color: "#7C6FA0" }}>
            {sig.stage} · {sig.metrics.totalAppearances} appearances ·{" "}
            {sig.metrics.distinctWeeks} weeks · {sig.metrics.sourceCount}{" "}
            sources
          </p>
        </div>
        {sig.atmosphericInfluence && (
          <span style={{ fontSize: 11, color: "#6B7280", fontStyle: "italic" }}>
            {sig.atmosphericInfluence}
          </span>
        )}
      </div>

      {open && (
        <div
          style={{
            marginTop: 14,
            paddingTop: 14,
            borderTop: "1px solid rgba(139,92,246,0.08)",
          }}
        >
          <p
            style={{
              margin: "0 0 12px",
              fontSize: 14,
              color: "#C4B5FD",
              lineHeight: 1.8,
              fontStyle: "italic",
            }}
          >
            {sig.narrative}
          </p>
          {sig.coreMeaning && (
            <div
              style={{
                background: "rgba(255,255,255,0.02)",
                borderRadius: 10,
                padding: "12px 16px",
                marginBottom: 10,
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: 12,
                  color: "#9B7FD4",
                  lineHeight: 1.7,
                }}
              >
                <span style={{ fontWeight: 700, color: "#C4B5FD" }}>
                  Core meaning:{" "}
                </span>
                {sig.coreMeaning}
              </p>
            </div>
          )}
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <MiniMetric
              label="Weight"
              value={sig.metrics.currentWeight.toFixed(1)}
            />
            <MiniMetric
              label="Peak"
              value={sig.metrics.peakWeight.toFixed(1)}
            />
            <MiniMetric label="Span" value={`${sig.metrics.spanDays}d`} />
            {sig.metrics.isAnchored && (
              <MiniMetric label="Status" value="⚓ Anchored" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PILLAR 2: EMOTIONAL CLIMATES
// ═══════════════════════════════════════════════════════════════════════════════
function ClimatesSection({ climates }) {
  const [expanded, setExpanded] = useState(true);
  if (!climates?.climates || climates.climates.length === 0) return null;

  const total = climates.totalWeeks;
  const items = climates.climates;
  const compounds = climates.compoundClimates || [];

  return (
    <CollapsibleSection
      title="Emotional Climates"
      emoji="🌦️"
      subtitle="Recurring atmospheric patterns across your symbolic history"
      count={items.length}
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
    >
      {expanded && (
        <div>
          {/* Compound climate (if detected) */}
          {compounds.length > 0 &&
            compounds.map((cc, i) => (
              <div
                key={i}
                style={{
                  background: "rgba(139,92,246,0.06)",
                  border: "1px solid rgba(139,92,246,0.15)",
                  borderRadius: 14,
                  padding: "20px",
                  marginBottom: 16,
                }}
              >
                <p
                  style={{
                    margin: "0 0 4px",
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#7C6FA0",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  Compound Climate
                </p>
                <p
                  style={{
                    margin: "0 0 12px",
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#E9D5FF",
                  }}
                >
                  {cc.primary} but {cc.secondary}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: 13,
                    color: "#C4B5FD",
                    lineHeight: 1.8,
                    fontStyle: "italic",
                  }}
                >
                  {cc.narrative}
                </p>
              </div>
            ))}

          {/* Individual climates */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {items.map((clim, i) => (
              <ClimateBar key={i} climate={clim} total={total} />
            ))}
          </div>
        </div>
      )}
    </CollapsibleSection>
  );
}

function ClimateBar({ climate, total }) {
  const cv = confV(climate.confidence);
  const climateColors = {
    turbulent: "#F87171",
    generative: "#34D399",
    convergent: "#A78BFA",
    fragmented: "#6B7280",
    radiant: "#FBBF24",
    emergent: "#60A5FA",
    mixed: "#9CA3AF",
    still: "#4B5563",
  };
  const color = climateColors[climate.climate] || "#6B7280";

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.02)",
        borderRadius: 12,
        padding: "14px 18px",
        border: "1px solid rgba(139,92,246,0.08)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 6,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              fontSize: 14,
              fontWeight: 700,
              color,
              textTransform: "capitalize",
            }}
          >
            {climate.climate}
          </span>
          <ConfidenceBadge confidence={climate.confidence} />
        </div>
        <span style={{ fontSize: 12, fontWeight: 600, color }}>
          {climate.percentage}%
        </span>
      </div>
      <div
        style={{
          width: "100%",
          height: 4,
          background: "rgba(255,255,255,0.04)",
          borderRadius: 2,
          marginBottom: 8,
        }}
      >
        <div
          style={{
            height: 4,
            borderRadius: 2,
            width: `${climate.percentage}%`,
            background: color,
            transition: "width 0.6s ease",
          }}
        />
      </div>
      <p style={{ margin: 0, fontSize: 12, color: "#9B7FD4", lineHeight: 1.6 }}>
        {climate.weekCount} of {climate.totalWeeks} weeks
      </p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PILLAR 3: CONSTELLATIONS
// ═══════════════════════════════════════════════════════════════════════════════
function ConstellationsSection({ constellations }) {
  const [expanded, setExpanded] = useState(true);
  if (!constellations || constellations.length === 0) return null;

  return (
    <CollapsibleSection
      title="Dominant Constellations"
      emoji="✨"
      subtitle="Multi-symbol ecosystems that function as single psychological units"
      count={constellations.length}
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
    >
      {expanded && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {constellations.map((c, i) => (
            <ConstellationCard key={i} constellation={c} />
          ))}
        </div>
      )}
    </CollapsibleSection>
  );
}

function ConstellationCard({ constellation }) {
  const [open, setOpen] = useState(false);
  const cv = confV(constellation.confidence);

  return (
    <div
      onClick={() => setOpen(!open)}
      style={{
        background: "rgba(99,102,241,0.04)",
        border: "1px solid rgba(99,102,241,0.15)",
        borderRadius: 16,
        padding: "20px 24px",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20 }}>{constellation.visuals}</span>
          <span style={{ fontSize: 18, fontWeight: 700, color: "#E9D5FF" }}>
            "{constellation.name}"
          </span>
        </div>
        <ConfidenceBadge confidence={constellation.confidence} />
      </div>
      <div
        style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}
      >
        {constellation.members.map((m) => {
          const stage = constellation.stages?.find((s) => s) || "Growth";
          return (
            <span
              key={m}
              style={{
                fontSize: 12,
                fontWeight: 600,
                padding: "3px 10px",
                borderRadius: 20,
                background: "rgba(99,102,241,0.1)",
                color: "#A5B4FC",
                border: "1px solid rgba(99,102,241,0.2)",
              }}
            >
              {m}
            </span>
          );
        })}
      </div>
      <p
        style={{
          margin: 0,
          fontSize: 13,
          color: "#C4B5FD",
          lineHeight: 1.8,
          fontStyle: "italic",
        }}
      >
        {constellation.narrative}
      </p>

      {open && (
        <div
          style={{
            marginTop: 14,
            paddingTop: 14,
            borderTop: "1px solid rgba(99,102,241,0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 16,
              flexWrap: "wrap",
              marginBottom: 10,
            }}
          >
            <MiniMetric
              label="Co-occurrence"
              value={constellation.metrics.avgCoOccurrence}
            />
            <MiniMetric
              label="Weeks"
              value={constellation.metrics.distinctWeeks}
            />
            <MiniMetric
              label="Sources"
              value={constellation.metrics.sourceCount}
            />
            <MiniMetric
              label="Coherent"
              value={
                constellation.metrics.isAtmosphericallyCoherent ? "Yes" : "No"
              }
            />
          </div>
          {constellation.atmospheres?.length > 0 && (
            <p style={{ margin: "0 0 8px", fontSize: 12, color: "#7C6FA0" }}>
              Atmospheres: {constellation.atmospheres.join(", ")}
            </p>
          )}
          {constellation.rituals?.length > 0 && (
            <p style={{ margin: 0, fontSize: 12, color: "#7C6FA0" }}>
              Practices: {constellation.rituals.join(", ")}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PILLAR 4: TRANSFORMATION TENDENCIES
// ═══════════════════════════════════════════════════════════════════════════════
function TendenciesSection({ tendencies }) {
  const [expanded, setExpanded] = useState(true);
  if (!tendencies) return null;

  const transitions = tendencies.transitions || [];
  const composites = tendencies.compositeTendencies || [];
  const total = transitions.length + composites.length;
  if (total === 0) return null;

  return (
    <CollapsibleSection
      title="Transformation Tendencies"
      emoji="🔄"
      subtitle="How you characteristically move through change"
      count={total}
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
    >
      {expanded && (
        <div>
          {/* Composite tendencies — meta-patterns */}
          {composites.length > 0 && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                marginBottom: 16,
              }}
            >
              {composites.map((ct, i) => (
                <div
                  key={i}
                  style={{
                    background: "rgba(139,92,246,0.06)",
                    border: "1px solid rgba(139,92,246,0.15)",
                    borderRadius: 14,
                    padding: "18px 20px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 8,
                    }}
                  >
                    <span style={{ fontSize: 16 }}>
                      {ct.type === "stabilizer"
                        ? "⚓"
                        : ct.type === "crisis_trigger"
                          ? "⚡"
                          : "🔄"}
                    </span>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#E9D5FF",
                        textTransform: "capitalize",
                      }}
                    >
                      {ct.type === "stabilizer"
                        ? "Stabilizer"
                        : ct.type === "crisis_trigger"
                          ? "Crisis Gateway"
                          : "Recovery Pattern"}
                    </span>
                    <ConfidenceBadge confidence={ct.confidence} />
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 13,
                      color: "#C4B5FD",
                      lineHeight: 1.8,
                      fontStyle: "italic",
                    }}
                  >
                    {ct.narrative}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Individual transitions */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {transitions.slice(0, 8).map((t, i) => (
              <TransitionCard key={i} transition={t} />
            ))}
          </div>
        </div>
      )}
    </CollapsibleSection>
  );
}

function TransitionCard({ transition }) {
  const dirColors = {
    ascending: "#34D399",
    descending: "#F87171",
    lateral: "#6B7280",
  };
  const color = dirColors[transition.direction] || "#6B7280";
  const arrow =
    transition.direction === "ascending"
      ? "↑"
      : transition.direction === "descending"
        ? "↓"
        : "→";
  const fromS = stg(transition.from);
  const toS = stg(transition.to);

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.02)",
        borderRadius: 10,
        padding: "12px 16px",
        border: "1px solid rgba(139,92,246,0.06)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: fromS.color }}>
            {transition.from}
          </span>
          <span style={{ fontSize: 14, color }}>{arrow}</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: toS.color }}>
            {transition.to}
          </span>
          <span style={{ fontSize: 11, color: "#6B7280" }}>
            {transition.count}×
          </span>
          <ConfidenceBadge confidence={transition.confidence} small />
        </div>
        <span style={{ fontSize: 11, color: "#6B7280" }}>
          {transition.percentage}%
        </span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PILLAR 5: SYMBOLIC SEASONS
// ═══════════════════════════════════════════════════════════════════════════════
function SeasonsSection({ seasons }) {
  const [expanded, setExpanded] = useState(true);
  if (!seasons || seasons.length === 0) return null;

  return (
    <CollapsibleSection
      title="Symbolic Seasons"
      emoji="🍂"
      subtitle="Long-form transformation climates — named eras of sustained atmosphere"
      count={seasons.length}
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
    >
      {expanded && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {seasons.map((s, i) => (
            <SeasonCard key={i} season={s} />
          ))}
        </div>
      )}
    </CollapsibleSection>
  );
}

function SeasonCard({ season }) {
  const [open, setOpen] = useState(false);
  const sv = season.dominantStage ? stg(season.dominantStage) : stg("Growth");
  const cv = confV(season.confidence);

  return (
    <div
      onClick={() => setOpen(!open)}
      style={{
        background: sv.bg,
        border: `1px solid ${sv.border}`,
        borderRadius: 16,
        padding: "20px 24px",
        cursor: "pointer",
        position: "relative",
      }}
    >
      {season.isCurrent && (
        <span
          style={{
            position: "absolute",
            top: 12,
            right: 16,
            fontSize: 9,
            fontWeight: 700,
            padding: "2px 8px",
            borderRadius: 6,
            background: "rgba(52,211,153,0.15)",
            color: "#34D399",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          Current
        </span>
      )}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 8,
        }}
      >
        <span style={{ fontSize: 22 }}>{sv.emoji}</span>
        <div>
          <p
            style={{
              margin: "0 0 2px",
              fontSize: 16,
              fontWeight: 700,
              color: "#E9D5FF",
            }}
          >
            {season.name}
          </p>
          <p style={{ margin: 0, fontSize: 11, color: "#7C6FA0" }}>
            {season.startDate} → {season.endDate} · {season.durationWeeks} weeks
          </p>
        </div>
      </div>
      <p
        style={{
          margin: 0,
          fontSize: 13,
          color: "#C4B5FD",
          lineHeight: 1.8,
          fontStyle: "italic",
        }}
      >
        {season.narrative}
      </p>

      {open && (
        <div
          style={{
            marginTop: 14,
            paddingTop: 14,
            borderTop: `1px solid ${sv.border}`,
          }}
        >
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <MiniMetric label="Events" value={season.totalEvents} />
            <MiniMetric label="Symbols" value={season.symbolCount} />
            <MiniMetric
              label="Dominant"
              value={`${season.dominantStage} ${season.dominantPercentage}%`}
            />
          </div>
          {season.topSymbols?.length > 0 && (
            <div
              style={{
                display: "flex",
                gap: 6,
                marginTop: 10,
                flexWrap: "wrap",
              }}
            >
              {season.topSymbols.map((s) => (
                <span
                  key={s}
                  style={{
                    fontSize: 11,
                    padding: "2px 8px",
                    borderRadius: 12,
                    background: "rgba(255,255,255,0.05)",
                    color: "#9B7FD4",
                    border: "1px solid rgba(139,92,246,0.1)",
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ONTOLOGICAL INSIGHTS
// ═══════════════════════════════════════════════════════════════════════════════
function OntologySection({ ontology }) {
  const [expanded, setExpanded] = useState(true);
  const sgp = ontology?.shadowGrowthPolarity || [];
  const gaps = ontology?.counterbalanceGaps || [];
  const anomalies = ontology?.permanenceAnomalies || [];
  const tensions = ontology?.identityTensions || [];
  const alignment = ontology?.ontologicalAlignment || [];
  const rituals = ontology?.ritualResonance || [];

  const totalItems =
    sgp.length +
    gaps.length +
    anomalies.length +
    tensions.length +
    alignment.length +
    rituals.length;

  if (totalItems === 0) return null;

  return (
    <CollapsibleSection
      title="Ontological Insights"
      emoji="🔬"
      subtitle="Deep observations grounded in the symbolic ontology"
      count={totalItems}
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
    >
      {expanded && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Shadow/Growth Polarity */}
          {sgp.length > 0 && (
            <div>
              <p
                style={{
                  margin: "0 0 10px",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#7C6FA0",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                Shadow / Growth Polarity
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {sgp.map((p, i) => {
                  const polarityColors = {
                    "shadow-dominant": "#F87171",
                    "shadow-leaning": "#FB923C",
                    balanced: "#9CA3AF",
                    "growth-leaning": "#34D399",
                    "growth-dominant": "#22D3EE",
                  };
                  const pc = polarityColors[p.polarity] || "#9CA3AF";
                  return (
                    <div
                      key={i}
                      style={{
                        background: "rgba(255,255,255,0.02)",
                        borderRadius: 12,
                        padding: "14px 18px",
                        border: `1px solid ${pc}25`,
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
                        <span style={{ fontSize: 18 }}>{p.visual}</span>
                        <span
                          style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: "#E9D5FF",
                          }}
                        >
                          {p.symbol}
                        </span>
                        <span
                          style={{
                            fontSize: 9,
                            fontWeight: 700,
                            padding: "2px 8px",
                            borderRadius: 6,
                            background: `${pc}15`,
                            color: pc,
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                          }}
                        >
                          {p.polarity}
                        </span>
                      </div>
                      <p
                        style={{
                          margin: 0,
                          fontSize: 12,
                          color: "#C4B5FD",
                          lineHeight: 1.7,
                          fontStyle: "italic",
                        }}
                      >
                        {p.narrative}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Identity Tensions */}
          {tensions.length > 0 && (
            <div>
              <p
                style={{
                  margin: "0 0 10px",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#7C6FA0",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                Identity Tensions
              </p>
              {tensions.map((t, i) => (
                <div
                  key={i}
                  style={{
                    background: "rgba(251,191,36,0.04)",
                    borderRadius: 12,
                    padding: "16px 18px",
                    border: "1px solid rgba(251,191,36,0.15)",
                    marginBottom: 8,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 8,
                    }}
                  >
                    <span style={{ fontSize: 18 }}>{t.visualA}</span>
                    <span style={{ fontSize: 14, color: "#FBBF24" }}>⟷</span>
                    <span style={{ fontSize: 18 }}>{t.visualB}</span>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#E9D5FF",
                      }}
                    >
                      {t.symbolA} × {t.symbolB}
                    </span>
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 12,
                      color: "#C4B5FD",
                      lineHeight: 1.7,
                      fontStyle: "italic",
                    }}
                  >
                    {t.narrative}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Counterbalance Gaps */}
          {gaps.length > 0 && (
            <div>
              <p
                style={{
                  margin: "0 0 10px",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#7C6FA0",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                Counterbalance Gaps
              </p>
              {gaps.map((g, i) => (
                <div
                  key={i}
                  style={{
                    background: "rgba(248,113,113,0.04)",
                    borderRadius: 12,
                    padding: "14px 18px",
                    border: "1px solid rgba(248,113,113,0.12)",
                    marginBottom: 8,
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
                    <span style={{ fontSize: 18 }}>{g.visual}</span>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#E9D5FF",
                      }}
                    >
                      {g.symbol}
                    </span>
                    <span
                      style={{ fontSize: 9, color: "#F87171", fontWeight: 700 }}
                    >
                      UNCHECKED
                    </span>
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 12,
                      color: "#C4B5FD",
                      lineHeight: 1.7,
                      fontStyle: "italic",
                    }}
                  >
                    {g.narrative}
                  </p>
                  {g.guidance && (
                    <p
                      style={{
                        margin: "8px 0 0",
                        fontSize: 11,
                        color: "#9B7FD4",
                        lineHeight: 1.6,
                      }}
                    >
                      {g.guidance}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Permanence Anomalies */}
          {anomalies.length > 0 && (
            <div>
              <p
                style={{
                  margin: "0 0 10px",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#7C6FA0",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                Permanence Anomalies
              </p>
              {anomalies.map((a, i) => (
                <div
                  key={i}
                  style={{
                    background: "rgba(139,92,246,0.04)",
                    borderRadius: 12,
                    padding: "14px 18px",
                    border: "1px solid rgba(139,92,246,0.12)",
                    marginBottom: 8,
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
                    <span style={{ fontSize: 18 }}>{a.visual}</span>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#E9D5FF",
                      }}
                    >
                      {a.symbol}
                    </span>
                    <span
                      style={{
                        fontSize: 9,
                        color: "#A78BFA",
                        fontWeight: 700,
                        textTransform: "uppercase",
                      }}
                    >
                      {a.type === "unexpected_persistence"
                        ? "Persists beyond nature"
                        : "Resists anchoring"}
                    </span>
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 12,
                      color: "#C4B5FD",
                      lineHeight: 1.7,
                      fontStyle: "italic",
                    }}
                  >
                    {a.narrative}
                  </p>
                  {a.guidance && (
                    <p
                      style={{
                        margin: "8px 0 0",
                        fontSize: 11,
                        color: "#9B7FD4",
                        lineHeight: 1.6,
                      }}
                    >
                      {a.guidance}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Ontological Alignment */}
          {alignment.length > 0 && (
            <div>
              <p
                style={{
                  margin: "0 0 10px",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#7C6FA0",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                Ontological Alignment
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {alignment.map((a, i) => {
                  const alignColor =
                    a.alignment === "confirmed" ? "#34D399" : "#FBBF24";
                  return (
                    <div
                      key={i}
                      style={{
                        background: "rgba(255,255,255,0.02)",
                        borderRadius: 12,
                        padding: "14px 18px",
                        border: `1px solid ${alignColor}20`,
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
                        <span style={{ fontSize: 18 }}>{a.visual}</span>
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: "#E9D5FF",
                          }}
                        >
                          {a.symbol}
                        </span>
                        <span
                          style={{
                            fontSize: 9,
                            fontWeight: 700,
                            padding: "2px 8px",
                            borderRadius: 6,
                            background: `${alignColor}15`,
                            color: alignColor,
                            textTransform: "uppercase",
                          }}
                        >
                          {a.alignment === "confirmed"
                            ? "Confirmed"
                            : "Unique Path"}
                        </span>
                      </div>
                      <p
                        style={{
                          margin: 0,
                          fontSize: 12,
                          color: "#C4B5FD",
                          lineHeight: 1.7,
                          fontStyle: "italic",
                        }}
                      >
                        {a.narrative}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Ritual Resonance */}
          {rituals.length > 0 && (
            <div>
              <p
                style={{
                  margin: "0 0 10px",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#7C6FA0",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                Ritual Resonance
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {rituals.map((r, i) => (
                  <div
                    key={i}
                    style={{
                      background: "rgba(52,211,153,0.04)",
                      borderRadius: 12,
                      padding: "14px 18px",
                      border: "1px solid rgba(52,211,153,0.12)",
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
                      <span style={{ fontSize: 14 }}>🕯️</span>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: "#34D399",
                          textTransform: "capitalize",
                        }}
                      >
                        {r.practice}
                      </span>
                      <span style={{ fontSize: 11, color: "#6B7280" }}>
                        {r.symbolCount} signatures
                      </span>
                    </div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 12,
                        color: "#C4B5FD",
                        lineHeight: 1.7,
                        fontStyle: "italic",
                      }}
                    >
                      {r.narrative}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </CollapsibleSection>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SHARED COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

function CollapsibleSection({
  title,
  emoji,
  subtitle,
  count,
  expanded,
  onToggle,
  children,
}) {
  return (
    <div style={{ marginBottom: 32 }}>
      <button
        onClick={onToggle}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 0",
          background: "none",
          border: "none",
          borderBottom: "1px solid rgba(139,92,246,0.15)",
          cursor: "pointer",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 24 }}>{emoji}</span>
          <div style={{ textAlign: "left" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <h2
                style={{
                  margin: 0,
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#E9D5FF",
                  letterSpacing: "-0.01em",
                }}
              >
                {title}
              </h2>
              <span style={{ fontSize: 11, color: "#6B7280" }}>{count}</span>
            </div>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: "#7C6FA0" }}>
              {subtitle}
            </p>
          </div>
        </div>
        {expanded ? (
          <ChevronUp size={18} color="#9B7FD4" />
        ) : (
          <ChevronDown size={18} color="#9B7FD4" />
        )}
      </button>
      {expanded && <div style={{ paddingTop: 20 }}>{children}</div>}
    </div>
  );
}

function ConfidenceBadge({ confidence, small }) {
  const cv = confV(confidence);
  return (
    <span
      style={{
        fontSize: small ? 8 : 9,
        fontWeight: 700,
        padding: small ? "1px 5px" : "2px 8px",
        borderRadius: 6,
        background: cv.bg,
        color: cv.color,
        border: `1px solid ${cv.border}`,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
      }}
    >
      {cv.label}
    </span>
  );
}

function Metric({ label, value }) {
  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#E9D5FF" }}>
        {value}
      </p>
      <p
        style={{
          margin: "2px 0 0",
          fontSize: 10,
          color: "#7C6FA0",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        {label}
      </p>
    </div>
  );
}

function MiniMetric({ label, value }) {
  return (
    <div>
      <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#E9D5FF" }}>
        {value}
      </p>
      <p
        style={{
          margin: "1px 0 0",
          fontSize: 9,
          color: "#7C6FA0",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
        }}
      >
        {label}
      </p>
    </div>
  );
}
