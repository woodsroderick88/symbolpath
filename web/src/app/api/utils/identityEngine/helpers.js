/**
 * Utility functions for the Identity Engine
 */

/**
 * Parse a JSON array from various input formats
 */
export function parseJsonArray(val) {
  if (Array.isArray(val)) return val;
  if (typeof val === "string") {
    try {
      return JSON.parse(val);
    } catch {
      return [];
    }
  }
  return [];
}

/**
 * Format an array value as a comma-separated string
 */
export function formatArray(val) {
  const arr = parseJsonArray(val);
  return arr.join(", ");
}
