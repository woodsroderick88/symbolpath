/**
 * SYMBOLPATH — VISUAL LANGUAGE SYSTEM
 *
 * The complete visual identity for every stage, transition, intensity level,
 * and observation type in SymbolPath.
 *
 * This file is the single source of truth for:
 *   - Stage colors, backgrounds, borders, gradients
 *   - Transition visual treatments
 *   - Intensity visual scaling
 *   - Observation type iconography
 *   - Emotional tone palettes
 *   - Motion and animation direction
 *
 * Design principles:
 *   Awakening  → lighter tones, emergence, expansion, upward motion
 *   Growth     → organic greens, building, layering, steady pulse
 *   Crisis     → hot reds, fragmentation, pressure, sharp movement
 *   Integration → calm purples, symmetry, stabilization, convergence
 *   Mastery    → warm golds, radiance, stillness, centered glow
 *
 * Every visual element in the UI should derive from this config to
 * ensure symbolic coherence across the entire application.
 */

// ─────────────────────────────────────────────────────────────────────────────
// STAGE IDENTITY
//
// Each stage has a complete visual identity: colors at multiple opacities,
// gradients for backgrounds, text treatments, border styles, glow effects,
// and associated motion language.
// ─────────────────────────────────────────────────────────────────────────────
export const STAGE_CONFIG = {
  Awakening: {
    // Core colors
    color: "#60A5FA",
    colorLight: "#93C5FD",
    colorDark: "#2563EB",

    // Surfaces
    bg: "rgba(96,165,250,0.08)",
    bgHover: "rgba(96,165,250,0.14)",
    bgSolid: "#EFF6FF",
    border: "rgba(96,165,250,0.25)",
    borderActive: "rgba(96,165,250,0.5)",

    // Gradients
    gradient: "linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 50%, #93C5FD 100%)",
    gradientRadial:
      "radial-gradient(circle at center, rgba(96,165,250,0.15) 0%, transparent 70%)",
    gradientText: "linear-gradient(135deg, #3B82F6, #60A5FA)",

    // Glow / shadows
    glow: "0 0 20px rgba(96,165,250,0.3)",
    shadow: "0 4px 14px rgba(96,165,250,0.15)",

    // Identity
    emoji: "🌅",
    label: "Awakening",
    tagline: "The first light",

    // Visual language
    motionDirection: "upward",
    motionStyle: "expanding",
    visualMetaphor: "emergence",
    intensity: "gentle",

    // Descriptors for narrative use
    adjective: "emerging",
    verb: "awakening",
    noun: "the dawn",
    atmosphere:
      "a sky lightening before sunrise — full of potential, not yet defined",
  },

  Growth: {
    color: "#34D399",
    colorLight: "#6EE7B7",
    colorDark: "#059669",

    bg: "rgba(52,211,153,0.08)",
    bgHover: "rgba(52,211,153,0.14)",
    bgSolid: "#ECFDF5",
    border: "rgba(52,211,153,0.25)",
    borderActive: "rgba(52,211,153,0.5)",

    gradient: "linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 50%, #6EE7B7 100%)",
    gradientRadial:
      "radial-gradient(circle at center, rgba(52,211,153,0.15) 0%, transparent 70%)",
    gradientText: "linear-gradient(135deg, #059669, #34D399)",

    glow: "0 0 20px rgba(52,211,153,0.3)",
    shadow: "0 4px 14px rgba(52,211,153,0.15)",

    emoji: "🌿",
    label: "Growth",
    tagline: "Roots deepening",

    motionDirection: "outward",
    motionStyle: "pulsing",
    visualMetaphor: "building",
    intensity: "steady",

    adjective: "growing",
    verb: "building",
    noun: "the roots",
    atmosphere:
      "a forest floor after rain — things are taking hold, quietly and steadily",
  },

  Crisis: {
    color: "#F87171",
    colorLight: "#FCA5A5",
    colorDark: "#DC2626",

    bg: "rgba(248,113,113,0.08)",
    bgHover: "rgba(248,113,113,0.14)",
    bgSolid: "#FEF2F2",
    border: "rgba(248,113,113,0.25)",
    borderActive: "rgba(248,113,113,0.5)",

    gradient: "linear-gradient(135deg, #FEE2E2 0%, #FECACA 50%, #FCA5A5 100%)",
    gradientRadial:
      "radial-gradient(circle at center, rgba(248,113,113,0.15) 0%, transparent 70%)",
    gradientText: "linear-gradient(135deg, #DC2626, #F87171)",

    glow: "0 0 20px rgba(248,113,113,0.3)",
    shadow: "0 4px 14px rgba(248,113,113,0.15)",

    emoji: "⛈️",
    label: "Crisis",
    tagline: "The storm",

    motionDirection: "inward",
    motionStyle: "fragmenting",
    visualMetaphor: "pressure",
    intensity: "sharp",

    adjective: "disrupted",
    verb: "breaking",
    noun: "the storm",
    atmosphere:
      "a sky split by lightning — everything is illuminated, nothing is comfortable",
  },

  Integration: {
    color: "#A78BFA",
    colorLight: "#C4B5FD",
    colorDark: "#7C3AED",

    bg: "rgba(167,139,250,0.08)",
    bgHover: "rgba(167,139,250,0.14)",
    bgSolid: "#F5F3FF",
    border: "rgba(167,139,250,0.25)",
    borderActive: "rgba(167,139,250,0.5)",

    gradient: "linear-gradient(135deg, #EDE9FE 0%, #DDD6FE 50%, #C4B5FD 100%)",
    gradientRadial:
      "radial-gradient(circle at center, rgba(167,139,250,0.15) 0%, transparent 70%)",
    gradientText: "linear-gradient(135deg, #7C3AED, #A78BFA)",

    glow: "0 0 20px rgba(167,139,250,0.3)",
    shadow: "0 4px 14px rgba(167,139,250,0.15)",

    emoji: "🧭",
    label: "Integration",
    tagline: "Weaving meaning",

    motionDirection: "converging",
    motionStyle: "stabilizing",
    visualMetaphor: "symmetry",
    intensity: "measured",

    adjective: "integrating",
    verb: "weaving",
    noun: "the loom",
    atmosphere:
      "a puzzle assembling itself — pieces finding their places without force",
  },

  Mastery: {
    color: "#FBBF24",
    colorLight: "#FDE68A",
    colorDark: "#D97706",

    bg: "rgba(251,191,36,0.08)",
    bgHover: "rgba(251,191,36,0.14)",
    bgSolid: "#FFFBEB",
    border: "rgba(251,191,36,0.25)",
    borderActive: "rgba(251,191,36,0.5)",

    gradient: "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 50%, #FCD34D 100%)",
    gradientRadial:
      "radial-gradient(circle at center, rgba(251,191,36,0.15) 0%, transparent 70%)",
    gradientText: "linear-gradient(135deg, #D97706, #FBBF24)",

    glow: "0 0 20px rgba(251,191,36,0.3)",
    shadow: "0 4px 14px rgba(251,191,36,0.15)",

    emoji: "👑",
    label: "Mastery",
    tagline: "The crown",

    motionDirection: "centered",
    motionStyle: "glowing",
    visualMetaphor: "radiance",
    intensity: "still",

    adjective: "mastered",
    verb: "shining",
    noun: "the summit",
    atmosphere:
      "a mountaintop at sunrise — everything below is visible, and the air is clear",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// STAGE ORDER — canonical progression
// ─────────────────────────────────────────────────────────────────────────────
export const STAGE_ORDER = [
  "Awakening",
  "Growth",
  "Crisis",
  "Integration",
  "Mastery",
];

// ─────────────────────────────────────────────────────────────────────────────
// TRANSITION VISUALS
//
// When a stage shift occurs, the transition itself has visual identity.
// Ascending shifts feel different from descending ones.
// ─────────────────────────────────────────────────────────────────────────────
export const TRANSITION_VISUALS = {
  ascending: {
    emoji: "📈",
    color: "#34D399",
    label: "Rising",
    motionDirection: "upward",
    description:
      "The energy is climbing — moving toward greater complexity or mastery.",
  },
  descending: {
    emoji: "🍂",
    color: "#F87171",
    label: "Descending",
    motionDirection: "inward",
    description:
      "The energy is moving inward or downward — processing, composting, or confronting.",
  },
  lateral: {
    emoji: "♾️",
    color: "#A78BFA",
    label: "Cycling",
    motionDirection: "circular",
    description:
      "The energy is cycling — moving sideways through different aspects of the same depth.",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// INTENSITY SCALING
//
// Visual treatments that scale with gravity weight / observation priority.
// Used to make high-gravity symbols visually heavier than low-gravity ones.
// ─────────────────────────────────────────────────────────────────────────────
export const INTENSITY_SCALE = {
  fading: {
    opacity: 0.45,
    scale: 0.85,
    borderWidth: 1,
    glowIntensity: 0,
    fontWeight: 400,
    label: "Fading",
  },
  active: {
    opacity: 0.7,
    scale: 1.0,
    borderWidth: 1,
    glowIntensity: 0,
    fontWeight: 400,
    label: "Active",
  },
  strong: {
    opacity: 0.85,
    scale: 1.05,
    borderWidth: 1.5,
    glowIntensity: 0.3,
    fontWeight: 500,
    label: "Strong",
  },
  anchored: {
    opacity: 1.0,
    scale: 1.1,
    borderWidth: 2,
    glowIntensity: 0.5,
    fontWeight: 600,
    label: "Anchored",
  },
  deep: {
    opacity: 1.0,
    scale: 1.15,
    borderWidth: 2.5,
    glowIntensity: 0.7,
    fontWeight: 700,
    label: "Deep",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// OBSERVATION TYPE VISUALS
//
// Each reasoning observation type has its own visual identity.
// ─────────────────────────────────────────────────────────────────────────────
export const OBSERVATION_VISUALS = {
  convergence: {
    emoji: "🎯",
    color: "#F59E0B",
    bgColor: "rgba(245,158,11,0.08)",
    label: "Convergence",
    description: "Multiple sources agree",
  },
  shadow_growth: {
    emoji: "🌗",
    color: "#8B5CF6",
    bgColor: "rgba(139,92,246,0.08)",
    label: "Shadow / Growth",
    description: "Expression polarity",
  },
  threshold: {
    emoji: "⚡",
    color: "#EF4444",
    bgColor: "rgba(239,68,68,0.08)",
    label: "Threshold",
    description: "Approaching permanence",
  },
  momentum: {
    emoji: "🚀",
    color: "#3B82F6",
    bgColor: "rgba(59,130,246,0.08)",
    label: "Momentum",
    description: "Acceleration or deceleration",
  },
  regression_context: {
    emoji: "🌀",
    color: "#EC4899",
    bgColor: "rgba(236,72,153,0.08)",
    label: "Regression",
    description: "Stage movement backward",
  },
  constellation: {
    emoji: "✨",
    color: "#6366F1",
    bgColor: "rgba(99,102,241,0.08)",
    label: "Constellation",
    description: "Symbol cluster detected",
  },
  transition: {
    emoji: "🔄",
    color: "#14B8A6",
    bgColor: "rgba(20,184,166,0.08)",
    label: "Transition",
    description: "Predicted path confirmed",
  },
  absence: {
    emoji: "🌑",
    color: "#6B7280",
    bgColor: "rgba(107,114,128,0.08)",
    label: "Absence",
    description: "Anchored symbol gone silent",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// WEATHER VISUALS
//
// Each emotional weather condition has visual identity.
// ─────────────────────────────────────────────────────────────────────────────
export const WEATHER_VISUALS = {
  Stormy: {
    emoji: "⛈️",
    gradient: "linear-gradient(135deg, #FEE2E2, #FECACA, #FCA5A5)",
    color: "#DC2626",
    textColor: "#991B1B",
  },
  Dawning: {
    emoji: "🌅",
    gradient: "linear-gradient(135deg, #DBEAFE, #BFDBFE, #93C5FD)",
    color: "#2563EB",
    textColor: "#1E40AF",
  },
  Growing: {
    emoji: "🌿",
    gradient: "linear-gradient(135deg, #D1FAE5, #A7F3D0, #6EE7B7)",
    color: "#059669",
    textColor: "#065F46",
  },
  Clearing: {
    emoji: "🌈",
    gradient: "linear-gradient(135deg, #EDE9FE, #DDD6FE, #C4B5FD)",
    color: "#7C3AED",
    textColor: "#5B21B6",
  },
  Radiant: {
    emoji: "☀️",
    gradient: "linear-gradient(135deg, #FEF3C7, #FDE68A, #FCD34D)",
    color: "#D97706",
    textColor: "#92400E",
  },
  Shifting: {
    emoji: "🌊",
    gradient: "linear-gradient(135deg, #E0E7FF, #C7D2FE, #A5B4FC)",
    color: "#4F46E5",
    textColor: "#3730A3",
  },
  Building: {
    emoji: "🌤️",
    gradient: "linear-gradient(135deg, #FEF3C7, #FDE68A)",
    color: "#B45309",
    textColor: "#78350F",
  },
  Turbulent: {
    emoji: "🌪️",
    gradient: "linear-gradient(135deg, #F3F4F6, #E5E7EB, #D1D5DB)",
    color: "#4B5563",
    textColor: "#1F2937",
  },
  Still: {
    emoji: "🌫️",
    gradient: "linear-gradient(135deg, #F9FAFB, #F3F4F6)",
    color: "#9CA3AF",
    textColor: "#6B7280",
  },
  Mixed: {
    emoji: "🌤️",
    gradient: "linear-gradient(135deg, #EFF6FF, #ECFDF5)",
    color: "#6B7280",
    textColor: "#374151",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// PRIORITY VISUALS
//
// Observation priority levels have their own visual treatment.
// ─────────────────────────────────────────────────────────────────────────────
export const PRIORITY_VISUALS = {
  1: {
    label: "Critical",
    color: "#DC2626",
    bg: "rgba(220,38,38,0.08)",
    border: "rgba(220,38,38,0.3)",
    pulse: true,
  },
  2: {
    label: "High",
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.25)",
    pulse: false,
  },
  3: {
    label: "Medium",
    color: "#6366F1",
    bg: "rgba(99,102,241,0.06)",
    border: "rgba(99,102,241,0.2)",
    pulse: false,
  },
  4: {
    label: "Low",
    color: "#9CA3AF",
    bg: "rgba(156,163,175,0.04)",
    border: "rgba(156,163,175,0.15)",
    pulse: false,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// POLARITY VISUALS (Shadow / Growth)
// ─────────────────────────────────────────────────────────────────────────────
export const POLARITY_VISUALS = {
  shadow: {
    emoji: "🌑",
    color: "#6B21A8",
    bg: "rgba(107,33,168,0.06)",
    border: "rgba(107,33,168,0.2)",
    label: "Shadow Expression",
    description: "Stuck, regressive, or unconscious expression of the symbol",
  },
  growth: {
    emoji: "🌕",
    color: "#059669",
    bg: "rgba(5,150,105,0.06)",
    border: "rgba(5,150,105,0.2)",
    label: "Growth Expression",
    description: "Active, intentional, evolving expression of the symbol",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPER: get stage config with safe fallback
// ─────────────────────────────────────────────────────────────────────────────
export function getStageConfig(stage) {
  return STAGE_CONFIG[stage] || STAGE_CONFIG.Growth;
}

export function getObservationVisual(type) {
  return (
    OBSERVATION_VISUALS[type] || {
      emoji: "•",
      color: "#6B7280",
      bgColor: "rgba(107,114,128,0.06)",
      label: type,
      description: "",
    }
  );
}

export function getWeatherVisual(condition) {
  return WEATHER_VISUALS[condition] || WEATHER_VISUALS.Mixed;
}

export function getIntensityScale(permanenceLevel) {
  return INTENSITY_SCALE[permanenceLevel] || INTENSITY_SCALE.active;
}

export function getPriorityVisual(priority) {
  return PRIORITY_VISUALS[priority] || PRIORITY_VISUALS[4];
}
