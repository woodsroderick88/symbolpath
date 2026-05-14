import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
} from "lucide-react";

const STAGE = {
  Awakening: {
    color: "#60A5FA",
    bg: "rgba(96,165,250,0.08)",
    border: "rgba(96,165,250,0.2)",
  },
  Growth: {
    color: "#34D399",
    bg: "rgba(52,211,153,0.08)",
    border: "rgba(52,211,153,0.2)",
  },
  Crisis: {
    color: "#F87171",
    bg: "rgba(248,113,113,0.08)",
    border: "rgba(248,113,113,0.2)",
  },
  Integration: {
    color: "#A78BFA",
    bg: "rgba(167,139,250,0.08)",
    border: "rgba(167,139,250,0.2)",
  },
  Mastery: {
    color: "#FBBF24",
    bg: "rgba(251,191,36,0.08)",
    border: "rgba(251,191,36,0.2)",
  },
};
const stg = (s) =>
  STAGE[s] || {
    color: "#9CA3AF",
    bg: "rgba(156,163,175,0.06)",
    border: "rgba(156,163,175,0.15)",
  };

const DIMENSION_COLORS = {
  "Transition Forecasting": { accent: "#60A5FA", emoji: "🔄" },
  "Recurrence Anticipation": { accent: "#A78BFA", emoji: "🔮" },
  "Destabilization Awareness": { accent: "#F87171", emoji: "⚠️" },
  "Recovery Prediction": { accent: "#34D399", emoji: "🌱" },
  "Atmosphere Shift Awareness": { accent: "#FBBF24", emoji: "🌤️" },
  "Constellation Activation": { accent: "#C084FC", emoji: "✨" },
};
const dim = (d) => DIMENSION_COLORS[d] || { accent: "#9CA3AF", emoji: "🔮" };

export default function PredictionsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["predictions"],
    queryFn: async () => {
      const res = await fetch("/api/symbolpath/predictions");
      if (!res.ok) throw new Error("Failed to load predictions");
      return res.json();
    },
  });

  if (isLoading)
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0F0A1E",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔮</div>
          <p style={{ color: "#9B7FD4", fontSize: 14 }}>
            Reading the patterns…
          </p>
        </div>
      </div>
    );

  if (error)
    return (
      <div style={{ minHeight: "100vh", background: "#0F0A1E", padding: 40 }}>
        <p style={{ color: "#F87171", textAlign: "center" }}>
          Failed to load predictions.
        </p>
      </div>
    );

  if (!data?.ready)
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0F0A1E",
          padding: "80px 24px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 16 }}>🌑</div>
        <h2 style={{ color: "#E9D5FF", marginBottom: 8 }}>
          Not Enough History Yet
        </h2>
        <p
          style={{
            color: "#7C6FA0",
            maxWidth: 400,
            margin: "0 auto",
            lineHeight: 1.7,
          }}
        >
          {data?.reason}
        </p>
        <p style={{ color: "#6B7280", fontSize: 12, marginTop: 16 }}>
          Predictive intelligence needs time to observe your patterns before it
          can speak.
        </p>
      </div>
    );

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
        <div style={{ marginBottom: 32 }}>
          <h1
            style={{
              margin: "0 0 6px",
              fontSize: 28,
              fontWeight: 700,
              color: "#E9D5FF",
            }}
          >
            Predictive Intelligence
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: 14,
              color: "#7C6FA0",
              lineHeight: 1.6,
            }}
          >
            What patterns tend to precede change
          </p>
        </div>

        {/* Disclaimer */}
        <div
          style={{
            background: "rgba(251,191,36,0.04)",
            border: "1px solid rgba(251,191,36,0.15)",
            borderRadius: 12,
            padding: "14px 18px",
            marginBottom: 28,
            display: "flex",
            gap: 12,
            alignItems: "flex-start",
          }}
        >
          <AlertTriangle
            size={16}
            style={{ color: "#FBBF24", marginTop: 2, flexShrink: 0 }}
          />
          <p
            style={{
              margin: 0,
              fontSize: 12,
              color: "#D4A574",
              lineHeight: 1.7,
            }}
          >
            These are observations based on your symbolic history — not
            predictions of what will happen. Patterns tend to precede change,
            but every moment is unique. Take these as invitations to reflect,
            not as certainties.
          </p>
        </div>

        {/* Current Field State */}
        <FieldState state={data.fieldState} />

        {/* Summary */}
        <div
          style={{
            background: "rgba(139,92,246,0.06)",
            borderRadius: 14,
            padding: "18px 22px",
            border: "1px solid rgba(139,92,246,0.15)",
            marginBottom: 28,
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
            Summary
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
            {data.summary.narrative}
          </p>
          <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
            <MiniStat label="Forecasts" value={data.summary.total} />
            <MiniStat
              label="Strong"
              value={data.summary.highConfidence}
              color="#34D399"
            />
            <MiniStat
              label="Moderate"
              value={data.summary.mediumConfidence}
              color="#FBBF24"
            />
            <MiniStat
              label="Faint"
              value={data.summary.lowConfidence}
              color="#6B7280"
            />
          </div>
        </div>

        {/* Forecasts */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {data.forecasts.map((f, i) => (
            <ForecastCard key={i} forecast={f} />
          ))}
        </div>

        {data.forecasts.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🌊</div>
            <p
              style={{
                color: "#7C6FA0",
                fontSize: 14,
                lineHeight: 1.7,
                maxWidth: 400,
                margin: "0 auto",
              }}
            >
              The symbolic field is in a steady state. No strong precedent-based
              forecasts are available right now. Keep engaging with your
              symbolic practice — patterns reveal themselves through time.
            </p>
          </div>
        )}

        {/* Meta */}
        <div
          style={{
            marginTop: 40,
            paddingTop: 20,
            borderTop: "1px solid rgba(139,92,246,0.08)",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 10,
              color: "#4B5563",
              textAlign: "center",
            }}
          >
            Based on {data.meta.totalEvents} events across {data.meta.spanDays}{" "}
            days ({data.meta.weeksAnalyzed} weeks analyzed)
          </p>
        </div>
      </div>
    </div>
  );
}

function FieldState({ state }) {
  const sv = stg(state.dominantStage);
  return (
    <div
      style={{
        background: sv.bg,
        border: `1px solid ${sv.border}`,
        borderRadius: 14,
        padding: "18px 22px",
        marginBottom: 20,
      }}
    >
      <p
        style={{
          margin: "0 0 8px",
          fontSize: 10,
          fontWeight: 700,
          color: "#7C6FA0",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        Current Field
      </p>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 12,
        }}
      >
        <span style={{ fontSize: 16, fontWeight: 700, color: sv.color }}>
          {state.dominantStage}
        </span>
        {state.dominantAtmosphere && (
          <span
            style={{
              fontSize: 12,
              color: "#7C6FA0",
              textTransform: "capitalize",
            }}
          >
            · {state.dominantAtmosphere} atmosphere
          </span>
        )}
        <span style={{ fontSize: 11, color: "#6B7280" }}>
          · {state.totalEvents} events
        </span>
      </div>
      {/* Active symbols */}
      <div
        style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}
      >
        {state.topSymbols?.map((s, i) => (
          <span
            key={i}
            style={{
              fontSize: 12,
              padding: "3px 10px",
              borderRadius: 16,
              background: "rgba(255,255,255,0.04)",
              color: "#C4B5FD",
              border: `1px solid ${sv.border}`,
            }}
          >
            {s.visual} {s.symbol}
          </span>
        ))}
      </div>
      {/* Stage distribution */}
      <div
        style={{
          display: "flex",
          gap: 4,
          height: 4,
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        {Object.entries(state.stageDistribution)
          .sort((a, b) => b[1] - a[1])
          .map(([stage, pct]) => (
            <div
              key={stage}
              style={{
                width: `${pct}%`,
                background: stg(stage).color,
                borderRadius: 2,
              }}
              title={`${stage}: ${pct}%`}
            />
          ))}
      </div>
      <div style={{ display: "flex", gap: 12, marginTop: 6, flexWrap: "wrap" }}>
        {Object.entries(state.stageDistribution)
          .sort((a, b) => b[1] - a[1])
          .map(([stage, pct]) => (
            <span key={stage} style={{ fontSize: 9, color: stg(stage).color }}>
              {stage} {pct}%
            </span>
          ))}
      </div>
    </div>
  );
}

function ForecastCard({ forecast }) {
  const [expanded, setExpanded] = useState(false);
  const d = dim(forecast.dimension);
  const confidencePct = Math.round(forecast.confidence * 100);

  const confidenceLabel =
    confidencePct >= 70 ? "Strong" : confidencePct >= 40 ? "Moderate" : "Faint";
  const confidenceColor =
    confidencePct >= 70
      ? "#34D399"
      : confidencePct >= 40
        ? "#FBBF24"
        : "#6B7280";

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(139,92,246,0.1)",
        borderRadius: 14,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: "100%",
          padding: "18px 22px",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          display: "flex",
          alignItems: "flex-start",
          gap: 14,
        }}
      >
        <span style={{ fontSize: 24, lineHeight: 1, marginTop: 2 }}>
          {forecast.emoji || d.emoji}
        </span>
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 4,
              flexWrap: "wrap",
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: 15,
                fontWeight: 600,
                color: "#E9D5FF",
              }}
            >
              {forecast.title}
            </h3>
            <span
              style={{
                fontSize: 9,
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: 6,
                background: `${confidenceColor}15`,
                color: confidenceColor,
                textTransform: "uppercase",
              }}
            >
              {confidenceLabel}
            </span>
          </div>
          <p style={{ margin: 0, fontSize: 10, color: "#6B7280" }}>
            {forecast.dimension} · {forecast.precedents} precedent
            {forecast.precedents !== 1 ? "s" : ""}
          </p>
        </div>
        {/* Confidence bar */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 4,
            minWidth: 60,
          }}
        >
          <span
            style={{ fontSize: 13, fontWeight: 700, color: confidenceColor }}
          >
            {confidencePct}%
          </span>
          <div
            style={{
              width: 50,
              height: 3,
              background: "rgba(255,255,255,0.05)",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${confidencePct}%`,
                height: "100%",
                background: confidenceColor,
                borderRadius: 2,
              }}
            />
          </div>
          {expanded ? (
            <ChevronUp size={12} color="#6B7280" />
          ) : (
            <ChevronDown size={12} color="#6B7280" />
          )}
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div
          style={{
            padding: "0 22px 20px",
            borderTop: "1px solid rgba(139,92,246,0.06)",
          }}
        >
          <p
            style={{
              margin: "16px 0",
              fontSize: 13,
              color: "#C4B5FD",
              lineHeight: 1.8,
            }}
          >
            {forecast.narrative}
          </p>

          {/* Type-specific details */}
          {forecast.type === "transition_forecast" && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 16px",
                background: "rgba(139,92,246,0.04)",
                borderRadius: 10,
              }}
            >
              <div style={{ textAlign: "center" }}>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: stg(forecast.currentStage).color,
                  }}
                >
                  {forecast.currentStage}
                </span>
                <p style={{ margin: 0, fontSize: 9, color: "#6B7280" }}>
                  {forecast.currentStreak}w streak
                </p>
              </div>
              <div
                style={{
                  flex: 1,
                  height: 2,
                  background: `linear-gradient(90deg, ${stg(forecast.currentStage).color}40, ${stg(forecast.predictedStage).color}40)`,
                  borderRadius: 1,
                }}
              />
              <div style={{ textAlign: "center" }}>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: stg(forecast.predictedStage).color,
                  }}
                >
                  {forecast.predictedStage}
                </span>
                <p style={{ margin: 0, fontSize: 9, color: "#6B7280" }}>
                  {forecast.ratio}% historical
                </p>
              </div>
            </div>
          )}

          {forecast.type === "recurrence_anticipation" &&
            forecast.anticipatedSymbols?.length > 0 && (
              <div>
                <p
                  style={{
                    margin: "0 0 6px",
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#7C6FA0",
                    textTransform: "uppercase",
                  }}
                >
                  Anticipated symbols
                </p>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {forecast.anticipatedSymbols.map((s, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: 12,
                        padding: "4px 12px",
                        borderRadius: 12,
                        background: "rgba(167,139,250,0.06)",
                        color: "#C4B5FD",
                        border: "1px solid rgba(167,139,250,0.15)",
                      }}
                    >
                      {s.visual} {s.symbol}{" "}
                      <span style={{ fontSize: 10, color: "#6B7280" }}>
                        {s.times}×
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            )}

          {forecast.type === "destabilization" && (
            <div
              style={{
                padding: "12px 16px",
                background: "rgba(248,113,113,0.04)",
                borderRadius: 10,
                border: "1px solid rgba(248,113,113,0.1)",
              }}
            >
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                {forecast.suppressedStage && (
                  <div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 14,
                        fontWeight: 700,
                        color: stg(forecast.suppressedStage).color,
                      }}
                    >
                      {forecast.suppressedStage}
                    </p>
                    <p style={{ margin: 0, fontSize: 9, color: "#6B7280" }}>
                      Suppressed
                    </p>
                  </div>
                )}
                {forecast.dominantStage && (
                  <div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 14,
                        fontWeight: 700,
                        color: stg(forecast.dominantStage).color,
                      }}
                    >
                      {forecast.avgDominance}%
                    </p>
                    <p style={{ margin: 0, fontSize: 9, color: "#6B7280" }}>
                      {forecast.dominantStage} concentration
                    </p>
                  </div>
                )}
                {forecast.predictedOutcome && (
                  <div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 14,
                        fontWeight: 700,
                        color: stg(forecast.predictedOutcome).color,
                      }}
                    >
                      {forecast.predictedOutcome}
                    </p>
                    <p style={{ margin: 0, fontSize: 9, color: "#6B7280" }}>
                      Historical outcome
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {forecast.type === "recovery_prediction" && (
            <div
              style={{
                padding: "12px 16px",
                background: "rgba(52,211,153,0.04)",
                borderRadius: 10,
                border: "1px solid rgba(52,211,153,0.1)",
              }}
            >
              <div style={{ display: "flex", gap: 20, marginBottom: 10 }}>
                <MiniStat
                  label="Crisis weeks"
                  value={forecast.currentCrisisWeeks}
                  color="#F87171"
                />
                <MiniStat
                  label="Avg recovery"
                  value={`~${forecast.avgRecoveryWeeks}w`}
                  color="#34D399"
                />
                {forecast.predictedRecoveryStage && (
                  <MiniStat
                    label="Recovers to"
                    value={forecast.predictedRecoveryStage}
                    color={stg(forecast.predictedRecoveryStage).color}
                  />
                )}
              </div>
              {forecast.recoverySymbols?.length > 0 && (
                <div>
                  <p
                    style={{
                      margin: "0 0 4px",
                      fontSize: 9,
                      fontWeight: 700,
                      color: "#7C6FA0",
                      textTransform: "uppercase",
                    }}
                  >
                    Recovery symbols
                  </p>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {forecast.recoverySymbols.map((s, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: 12,
                          padding: "3px 10px",
                          borderRadius: 12,
                          background: "rgba(52,211,153,0.06)",
                          color: "#34D399",
                        }}
                      >
                        {s.visual} {s.symbol}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {forecast.type === "atmosphere_shift" &&
            forecast.predictedAtmospheres?.length > 0 && (
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                  padding: "12px 16px",
                  background: "rgba(251,191,36,0.04)",
                  borderRadius: 10,
                }}
              >
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#FBBF24",
                    textTransform: "capitalize",
                  }}
                >
                  {forecast.currentAtmosphere}
                </span>
                <span style={{ color: "#4B5563" }}>→</span>
                {forecast.predictedAtmospheres.map((a, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#E9D5FF",
                      textTransform: "capitalize",
                    }}
                  >
                    {a.atmosphere}{" "}
                    <span style={{ fontSize: 10, color: "#6B7280" }}>
                      ({a.percentage}%)
                    </span>
                    {i < forecast.predictedAtmospheres.length - 1 && (
                      <span style={{ color: "#4B5563" }}> / </span>
                    )}
                  </span>
                ))}
              </div>
            )}

          {forecast.type === "constellation_activation" && (
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 10,
                  padding: "10px 16px",
                  background: "rgba(192,132,252,0.04)",
                  borderRadius: 10,
                  border: "1px solid rgba(192,132,252,0.1)",
                }}
              >
                <span
                  style={{ fontSize: 14, fontWeight: 600, color: "#C084FC" }}
                >
                  {forecast.constellationVisual}
                </span>
                <span style={{ color: "#4B5563" }}>→</span>
                <span style={{ fontSize: 12, color: "#C4B5FD" }}>
                  {forecast.anticipatedSymbols
                    ?.map((s) => `${s.visual} ${s.symbol}`)
                    .join(", ")}
                </span>
              </div>
              {forecast.anticipatedSymbols?.length > 0 && (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {forecast.anticipatedSymbols.map((s, i) => (
                    <div key={i} style={{ textAlign: "center" }}>
                      <span style={{ fontSize: 20 }}>{s.visual}</span>
                      <p style={{ margin: 0, fontSize: 10, color: "#7C6FA0" }}>
                        {s.symbol}
                      </p>
                      <p style={{ margin: 0, fontSize: 9, color: "#6B7280" }}>
                        {s.ratio}% · {s.times}×
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function MiniStat({ label, value, color }) {
  return (
    <div>
      <p
        style={{
          margin: 0,
          fontSize: 16,
          fontWeight: 700,
          color: color || "#E9D5FF",
        }}
      >
        {value}
      </p>
      <p
        style={{
          margin: "1px 0 0",
          fontSize: 9,
          color: "#6B7280",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {label}
      </p>
    </div>
  );
}
