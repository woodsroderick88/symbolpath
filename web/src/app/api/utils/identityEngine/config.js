/**
 * Configuration constants for the Identity Engine
 */

export const CONFIDENCE = {
  EMERGING: "emerging",
  RECURRING: "recurring",
  ESTABLISHED: "established",
  FOUNDATIONAL: "foundational",
};

// Signature thresholds
export const SIG_EMERGING_MIN_COUNT = 3;
export const SIG_EMERGING_MIN_WEEKS = 2;
export const SIG_RECURRING_MIN_COUNT = 5;
export const SIG_RECURRING_MIN_WEEKS = 3;
export const SIG_RECURRING_MIN_SOURCES = 2;
export const SIG_ESTABLISHED_MIN_COUNT = 10;
export const SIG_ESTABLISHED_MIN_WEEKS = 6;
export const SIG_ESTABLISHED_MIN_SOURCES = 3;
export const SIG_FOUNDATIONAL_MIN_COUNT = 20;
export const SIG_FOUNDATIONAL_MIN_WEEKS = 12;
export const SIG_FOUNDATIONAL_MIN_SOURCES = 4;

// Constellation identity thresholds
export const CONSTELLATION_MIN_CO_OCCURRENCE = 5;
export const CONSTELLATION_MIN_WEEKS = 3;
export const CONSTELLATION_MIN_MEMBERS = 2;
export const CONSTELLATION_MAX_MEMBERS = 5;

// Season thresholds
export const SEASON_MIN_DAYS = 14;
export const SEASON_WINDOW_DAYS = 7;

// Permanence ranking
export const PERMANENCE_RANK = {
  "Very low": 1,
  Low: 2,
  "Low-moderate": 3,
  Moderate: 4,
  "Moderate-high": 5,
  High: 6,
  "Very high": 7,
  "The highest": 8,
};
