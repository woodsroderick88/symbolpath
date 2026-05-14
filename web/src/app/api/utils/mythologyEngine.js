/**
 * SYMBOLPATH — MYTHOLOGY LAYER
 *
 * Phase 8: Symbolic Autobiography
 *
 * ──────────────────────────────────────────────────────────────────
 * CORE PRINCIPLE:
 *
 *   This engine synthesizes every preceding phase into
 *   a coherent life narrative told through symbols.
 *
 *   It does NOT write fiction.
 *   It does NOT claim destiny.
 *   It reflects back what has actually happened,
 *   named in symbolic language.
 *
 *   "The Long Threshold"  — a chapter name, not a prophecy.
 *   "The Season of Dissolution" — observed, not prescribed.
 *   "The Return to Integration" — a pattern, not a promise.
 *
 * ──────────────────────────────────────────────────────────────────
 * THE SIX SYNTHESIS DIMENSIONS:
 *
 *   1. TRANSFORMATIONAL CHAPTERS
 *      Named eras derived from mythic continuity,
 *      enriched with initiations, wounds, and atmosphere.
 *
 *   2. SYMBOLIC AUTOBIOGRAPHY
 *      The full arc told as a sequence of chapters
 *      with transitions between them.
 *
 *   3. RECURRING WOUNDS
 *      Patterns that keep returning —
 *      loops, regressions, suppressed stages.
 *
 *   4. INITIATIONS
 *      Threshold crossings that mark genuine transformation —
 *      the moments the field fundamentally shifted.
 *
 *   5. LONG-CYCLE THEMES
 *      Motifs that span the entire history —
 *      anchored symbols, persistent constellations,
 *      dominant atmospheric tones.
 *
 *   6. LIFE-ERA SYNTHESIS
 *      The summary — who you are becoming,
 *      told through the language of what has been.
 *
 * ──────────────────────────────────────────────────────────────────
 */

import { computeMythicContinuity } from "@/app/api/utils/mythicContinuityEngine";
import { computeSymbolicIdentity } from "@/app/api/utils/identityEngine";
import { computePredictiveIntelligence } from "@/app/api/utils/predictiveEngine";
import sql from "@/app/api/utils/sql";

// ──────────────────────────────────────────────────────────────────
// MASTER FUNCTION
// ──────────────────────────────────────────────────────────────────

export async function computeMythology(userId) {
  // Gather all prior layers
  const [continuity, identity, predictions, gravity, events] =
    await Promise.all([
      computeMythicContinuity(userId),
      computeSymbolicIdentity(userId),
      computePredictiveIntelligence(userId),
      loadGravity(userId),
      loadEventSummary(userId),
    ]);

  // Readiness check — mythology requires both continuity and identity
  if (!continuity?.ready || !identity?.ready) {
    return {
      ready: false,
      reason: !continuity?.ready
        ? continuity?.reason || "Not enough symbolic history for mythology."
        : identity?.reason || "Not enough symbolic data for identity.",
      minimumNeeded: "At least 10 events across 21 days with identity depth.",
    };
  }

  const eras = continuity.eras || [];
  const transitions = continuity.chapterTransitions || [];
  const loops = continuity.loops || {};
  const initiations = continuity.initiations || {};
  const atmosphereMigrations = continuity.atmosphereMigrations || {};
  const stabilization = continuity.stabilization || {};

  const constellations = identity.constellations || [];
  const tendencies = identity.tendencies || {};
  const seasons = identity.seasons || [];
  const maturity = identity.maturity || {};
  const signatures = identity.signatures || [];
  const climates = identity.climates || {};
  const ontology = identity.ontology || {};

  // ── Build each dimension ──
  const chapters = buildTransformationalChapters(
    eras,
    transitions,
    initiations,
    atmosphereMigrations,
  );
  const autobiography = buildSymbolicAutobiography(chapters, events, maturity);
  const wounds = buildRecurringWounds(loops, tendencies, signatures, ontology);
  const initiationMap = buildInitiations(transitions, initiations, eras);
  const longCycleThemes = buildLongCycleThemes(
    gravity,
    constellations,
    signatures,
    atmosphereMigrations,
    events,
  );
  const synthesis = buildLifeEraSynthesis(
    chapters,
    wounds,
    initiationMap,
    longCycleThemes,
    maturity,
    predictions,
  );

  return {
    ready: true,
    meta: {
      totalEvents: events.totalEvents,
      spanDays: events.spanDays,
      eraCount: eras.length,
      chapterCount: chapters.length,
      maturityLevel: maturity.level,
    },
    chapters,
    autobiography,
    wounds,
    initiations: initiationMap,
    longCycleThemes,
    synthesis,
  };
}

// ──────────────────────────────────────────────────────────────────
// 1. TRANSFORMATIONAL CHAPTERS
//
// Takes eras from mythic continuity and enriches them
// with initiatory context, atmosphere, and symbolic meaning.
// ──────────────────────────────────────────────────────────────────

function buildTransformationalChapters(
  eras,
  transitions,
  initiations,
  atmosphereMigrations,
) {
  if (eras.length === 0) return [];

  const chapters = eras.map((era, index) => {
    // Find the transition that led INTO this era
    const entryTransition =
      transitions.find(
        (t) =>
          t.to?.character === era.character &&
          t.to?.startDate === era.startDate,
      ) || (index > 0 ? transitions[index - 1] : null);

    // Find the transition that leads OUT of this era
    const exitTransition = transitions[index] || null;

    // Determine the chapter's initiatory quality
    const initiationType = classifyChapterInitiation(era, entryTransition);

    // Find any atmosphere migration during this era
    const migrations = (atmosphereMigrations?.migrations || []).filter((m) => {
      const mDate = new Date(m.month || m.date);
      return mDate >= new Date(era.startDate) && mDate <= new Date(era.endDate);
    });

    // Build chapter title — more evocative than era name when context allows
    const chapterTitle = generateChapterTitle(
      era,
      initiationType,
      entryTransition,
    );

    return {
      index: index + 1,
      title: chapterTitle,
      eraName: era.name,
      character: era.character,
      stage: era.dominantStage,
      stagePercentage: era.dominantPercentage,
      atmosphere: era.dominantAtmosphere,
      startDate: era.startDate,
      endDate: era.endDate,
      durationWeeks: era.durationWeeks,
      isCurrent: era.isCurrent || false,
      topSymbols: (era.topSymbols || []).slice(0, 5),
      stageDistribution: era.stageDistribution || {},
      // Enrichments
      initiationType,
      entryTransition: entryTransition
        ? {
            type: entryTransition.type,
            name: entryTransition.name,
            from: entryTransition.from,
            bridgeSymbols: entryTransition.bridgeSymbols || [],
            arrivingSymbols: entryTransition.arrivingSymbols || [],
          }
        : null,
      internalAtmosphereMigrations: migrations.length,
      narrative: buildChapterNarrative(
        era,
        initiationType,
        entryTransition,
        exitTransition,
      ),
    };
  });

  return chapters;
}

function classifyChapterInitiation(era, entryTransition) {
  if (!entryTransition) return "origin";

  const type = entryTransition.type;
  if (type === "rebirth") return "rebirth";
  if (type === "collapse") return "descent";
  if (type === "culmination") return "culmination";
  if (type === "emergence") return "emergence";
  if (type === "dissolution") return "dissolution";
  if (entryTransition.direction === "ascending") return "ascent";
  if (entryTransition.direction === "descending") return "descent";
  return "passage";
}

const CHAPTER_TITLE_TEMPLATES = {
  Crisis: {
    origin: "The First Reckoning",
    descent: "The Descent",
    rebirth: "The Return Through Fire",
    dissolution: "The Unraveling",
    passage: "The Dark Passage",
    default: "The Reckoning",
  },
  Growth: {
    origin: "The Seed Ground",
    rebirth: "The Return to Growth",
    ascent: "The Rising",
    emergence: "The Emergence",
    passage: "The Cultivation",
    default: "The Growing Season",
  },
  Integration: {
    origin: "The First Weaving",
    culmination: "The Convergence",
    ascent: "The Gathering",
    rebirth: "The Reweaving",
    passage: "The Integration",
    default: "The Weaving",
  },
  Mastery: {
    origin: "The First Radiance",
    culmination: "The Crowning",
    ascent: "The Sovereignty",
    passage: "The Mastery",
    default: "The Season of Radiance",
  },
  Awakening: {
    origin: "The Awakening",
    rebirth: "The Reawakening",
    descent: "The Return to Beginnings",
    passage: "The Stirring",
    default: "The New Dawn",
  },
  Threshold: {
    origin: "The Long Threshold",
    dissolution: "The Dissolution",
    passage: "The Crossing",
    default: "The Threshold",
  },
  Mixed: {
    origin: "The Season of Flux",
    passage: "The Shifting Ground",
    default: "The Flux",
  },
};

function generateChapterTitle(era, initiationType, entryTransition) {
  const templates =
    CHAPTER_TITLE_TEMPLATES[era.character] || CHAPTER_TITLE_TEMPLATES.Mixed;
  const title = templates[initiationType] || templates.default;

  // If era is long, prefix with "The Long ..."
  if (
    era.durationWeeks >= 8 &&
    !title.includes("Long") &&
    !title.includes("Season")
  ) {
    return title.replace("The ", "The Long ");
  }

  return title;
}

function buildChapterNarrative(era, initiationType, entry, exit) {
  const parts = [];

  // Opening
  if (initiationType === "origin") {
    parts.push(
      `Your symbolic journey began here — ${era.durationWeeks} weeks defined by ${era.dominantStage || era.character}.`,
    );
  } else if (entry) {
    parts.push(
      `Following ${entry.name || "a transition"}, ${era.dominantStage || era.character} became the dominant energy for ${era.durationWeeks} weeks.`,
    );
  } else {
    parts.push(
      `A ${era.durationWeeks}-week chapter dominated by ${era.dominantStage || era.character}.`,
    );
  }

  // Atmosphere
  if (era.dominantAtmosphere) {
    parts.push(`The atmosphere was ${era.dominantAtmosphere}.`);
  }

  // Key symbols
  const symbols = (era.topSymbols || []).slice(0, 3);
  if (symbols.length > 0) {
    const names = symbols.map((s) => `${s.visual || ""} ${s.symbol}`.trim());
    parts.push(`Guided by ${names.join(", ")}.`);
  }

  // Bridge symbols from entry
  if (entry?.bridgeSymbols?.length > 0) {
    const bridges = entry.bridgeSymbols
      .slice(0, 2)
      .map((s) => `${s.visual || ""} ${s.symbol}`.trim());
    parts.push(
      `${bridges.join(" and ")} carried through from the previous chapter.`,
    );
  }

  // Current
  if (era.isCurrent) {
    parts.push("This chapter is still unfolding.");
  }

  return parts.join(" ");
}

// ──────────────────────────────────────────────────────────────────
// 2. SYMBOLIC AUTOBIOGRAPHY
//
// The full arc as a coherent sequence — prologue, chapters, current.
// ──────────────────────────────────────────────────────────────────

function buildSymbolicAutobiography(chapters, events, maturity) {
  if (chapters.length === 0) {
    return {
      title: "A Story Beginning",
      prologue:
        "The symbolic field has begun to gather, but the autobiography has not yet formed its first chapter.",
      chapters: [],
      currentChapter: null,
      arc: null,
    };
  }

  const firstChapter = chapters[0];
  const lastChapter = chapters[chapters.length - 1];
  const currentChapter = chapters.find((c) => c.isCurrent) || lastChapter;

  // Determine the overall arc direction
  const RANK = {
    Awakening: 0,
    Growth: 1,
    Crisis: 2,
    Integration: 3,
    Mastery: 4,
    Threshold: 2,
    Mixed: 1,
  };
  const startRank = RANK[firstChapter.character] ?? 1;
  const endRank = RANK[currentChapter.character] ?? 1;

  let arcType = "unfolding";
  if (chapters.length >= 3) {
    if (endRank > startRank + 1) arcType = "ascending";
    else if (endRank < startRank - 1) arcType = "descending";
    else if (
      chapters.some((c) => c.character === "Crisis") &&
      currentChapter.character !== "Crisis"
    )
      arcType = "transformational";
    else if (
      chapters.some((c) => c.character === "Crisis") &&
      currentChapter.character === "Crisis"
    )
      arcType = "in_crisis";
    else arcType = "cyclical";
  }

  // Title
  const ARC_TITLES = {
    ascending: "The Ascending Path",
    descending: "The Descent and What It Reveals",
    transformational: "Through Fire and Back",
    in_crisis: "The Ongoing Reckoning",
    cyclical: "The Spiral",
    unfolding: "The Unfolding",
  };

  // Prologue — reflective, never dramatic
  const prologue = buildPrologue(chapters, arcType, events);

  return {
    title: ARC_TITLES[arcType] || "The Unfolding",
    arcType,
    prologue,
    chapterCount: chapters.length,
    totalWeeks: chapters.reduce((s, c) => s + c.durationWeeks, 0),
    firstChapter: {
      title: firstChapter.title,
      stage: firstChapter.stage,
      startDate: firstChapter.startDate,
    },
    currentChapter: {
      title: currentChapter.title,
      stage: currentChapter.stage,
      isCurrent: currentChapter.isCurrent,
      durationWeeks: currentChapter.durationWeeks,
    },
    maturityLevel: maturity?.level || "nascent",
  };
}

function buildPrologue(chapters, arcType, events) {
  const first = chapters[0];
  const current = chapters[chapters.length - 1];
  const totalWeeks = chapters.reduce((s, c) => s + c.durationWeeks, 0);

  const parts = [];

  parts.push(
    `Across ${totalWeeks} weeks and ${events.totalEvents} symbolic encounters, a story has been taking shape.`,
  );

  parts.push(
    `It began with ${first.title} — ${first.durationWeeks} weeks of ${first.stage || first.character} energy.`,
  );

  if (chapters.length > 2) {
    const midChapters = chapters.slice(1, -1);
    const crisisCount = midChapters.filter(
      (c) => c.character === "Crisis",
    ).length;
    const growthCount = midChapters.filter(
      (c) => c.character === "Growth" || c.character === "Mastery",
    ).length;

    if (crisisCount > 0 && growthCount > 0) {
      parts.push(`The path wound through both reckoning and cultivation.`);
    } else if (crisisCount > 0) {
      parts.push(`The journey passed through periods of reckoning.`);
    } else if (growthCount > 0) {
      parts.push(`The path moved through seasons of growth.`);
    }
  }

  if (current.isCurrent) {
    parts.push(
      `Now, the story is in ${current.title} — a ${current.stage || current.character} chapter still unfolding.`,
    );
  } else {
    parts.push(`The most recent chapter was ${current.title}.`);
  }

  return parts.join(" ");
}

// ──────────────────────────────────────────────────────────────────
// 3. RECURRING WOUNDS
//
// Patterns that keep returning. Not pathology — but symbolic
// attention to what the psyche keeps revisiting.
//
// "The field keeps returning to Crisis through Storm.
//  This is the third time."
// ──────────────────────────────────────────────────────────────────

function buildRecurringWounds(loops, tendencies, signatures, ontology) {
  const wounds = [];

  // A) Stage loops — oscillation patterns (A→B→A)
  const stageLoops = loops?.stageLoops || [];
  for (const loop of stageLoops) {
    const isRegressive = loop.isRegressive;
    const recurrences = loop.count || 0;
    wounds.push({
      type: "oscillation",
      pattern: `${loop.anchor}⟲${loop.oscillation}`,
      recurrences,
      isRegressive,
      title: isRegressive
        ? `The Return to ${loop.anchor}`
        : `The ${loop.anchor}–${loop.oscillation} Oscillation`,
      narrative: isRegressive
        ? `After reaching ${loop.oscillation}, the field has returned to ${loop.anchor} ${recurrences} times. This is not failure — it may be that something in ${loop.anchor} has not yet been fully met.`
        : `The field oscillates between ${loop.anchor} and ${loop.oscillation} (${recurrences} times). This pendulum suggests an unresolved tension between these two energies.`,
    });
  }

  // B) Symbol loops — symbols stuck in a stage
  const symbolLoops = loops?.symbolLoops || [];
  for (const loop of symbolLoops) {
    const appearances = loop.count || 0;
    const months = loop.months || 0;
    wounds.push({
      type: "symbol_loop",
      symbol: loop.symbol,
      stage: loop.stage,
      occurrences: appearances,
      title: `${loop.symbol} in ${loop.stage}`,
      narrative: `${loop.symbol} has appeared in ${loop.stage} ${appearances} times across ${months} months. When a symbol returns to the same stage repeatedly, it may point to an unresolved dynamic that wants attention.`,
    });
  }

  // C) Regressive tendencies (from transformation tendencies)
  const regressiveTendencies = (tendencies?.transitions || []).filter(
    (t) => t.direction === "descending" && t.count >= 3,
  );
  for (const rt of regressiveTendencies) {
    // Check if this regression is already captured in stage loops
    const alreadyLoop = wounds.some(
      (w) =>
        w.type === "oscillation" &&
        w.pattern.includes(rt.from) &&
        w.pattern.includes(rt.to),
    );
    if (alreadyLoop) continue;

    wounds.push({
      type: "regression",
      from: rt.from,
      to: rt.to,
      count: rt.count,
      title: `The ${rt.from} → ${rt.to} Pattern`,
      narrative: `The field has moved from ${rt.from} back to ${rt.to} ${rt.count} times. This regression pattern may indicate that ${rt.from} has not yet consolidated, or that something in ${rt.to} keeps pulling the field back.`,
    });
  }

  // D) Shadow expressions (from ontological insights)
  const tensions = ontology?.tensions || [];
  for (const tension of tensions) {
    wounds.push({
      type: "tension",
      symbols: tension.pair || [],
      title: tension.title || "Symbolic Tension",
      narrative:
        tension.narrative ||
        `Two counterbalancing forces are both strongly present — this tension is a wound that may also be a source of depth.`,
    });
  }

  return wounds;
}

// ──────────────────────────────────────────────────────────────────
// 4. INITIATIONS
//
// Threshold crossings that mark real transformation.
// Not every transition is an initiation —
// only the ones that fundamentally changed the field.
// ──────────────────────────────────────────────────────────────────

function buildInitiations(transitions, initiationsData, eras) {
  const result = [];

  // A) Major chapter transitions (from mythic continuity)
  for (const t of transitions) {
    const isSignificant =
      t.depth >= 2 ||
      t.type === "rebirth" ||
      t.type === "collapse" ||
      t.type === "culmination";
    if (!isSignificant) continue;

    const INITIATION_NAMES = {
      rebirth: "The Rebirth",
      collapse: "The Collapse",
      culmination: "The Culmination",
      emergence: "The Emergence",
      dissolution: "The Dissolution",
    };

    result.push({
      type: "chapter_crossing",
      name: INITIATION_NAMES[t.type] || t.name || "The Crossing",
      transitionType: t.type,
      direction: t.direction,
      depth: t.depth,
      from: t.from,
      to: t.to,
      bridgeSymbols: (t.bridgeSymbols || []).slice(0, 3),
      arrivingSymbols: (t.arrivingSymbols || []).slice(0, 3),
      departingSymbols: (t.departingSymbols || []).slice(0, 3),
      narrative: buildInitiationNarrative(t),
    });
  }

  // B) Recurring initiations from mythic continuity
  // initiationsData is an array of objects with type, pattern, count, symbols
  const initiationsArr = Array.isArray(initiationsData) ? initiationsData : [];

  // Awakening initiations
  const awakeningInits = initiationsArr.filter(
    (i) => i.type === "awakening_initiation",
  );
  for (const init of awakeningInits) {
    result.push({
      type: "recurring_initiation",
      name: "The Recurring Threshold",
      count: init.count,
      pattern: init.pattern,
      symbols: init.symbols || [],
      narrative: `The ${init.pattern} threshold has been crossed ${init.count} times. Each crossing is an initiation — a passage from one mode of being into fresh awareness. The recurring nature of this initiation suggests it is a central dynamic of this symbolic life.`,
    });
  }

  // Forge initiations (Crisis → Growth)
  const forgeInits = initiationsArr.filter(
    (i) => i.type === "forge_initiation",
  );
  for (const init of forgeInits) {
    result.push({
      type: "forge_initiation",
      name: "The Forge",
      count: init.count,
      pattern: init.pattern,
      symbols: init.symbols || [],
      narrative: `${init.count} forge events — passages from Crisis directly into Growth. These are moments where difficulty was transmuted into renewal, not just survived but actively built upon.`,
    });
  }

  return result;
}

function buildInitiationNarrative(t) {
  const parts = [];

  if (t.type === "rebirth") {
    parts.push(
      `A rebirth — the field crossed from ${t.from?.character || "crisis"} into ${t.to?.character || "growth"}.`,
    );
  } else if (t.type === "collapse") {
    parts.push(
      `A collapse — the field fell from ${t.from?.character || "growth"} into ${t.to?.character || "crisis"}.`,
    );
  } else if (t.type === "culmination") {
    parts.push(
      `A culmination — the field reached ${t.to?.character || "mastery"} from ${t.from?.character || "integration"}.`,
    );
  } else {
    parts.push(
      `A significant transition from ${t.from?.character || "unknown"} to ${t.to?.character || "unknown"}.`,
    );
  }

  const bridges = (t.bridgeSymbols || []).slice(0, 2);
  if (bridges.length > 0) {
    parts.push(
      `${bridges.map((s) => `${s.visual || ""} ${s.symbol}`.trim()).join(" and ")} carried through this crossing.`,
    );
  }

  const arriving = (t.arrivingSymbols || []).slice(0, 2);
  if (arriving.length > 0) {
    parts.push(
      `${arriving.map((s) => `${s.visual || ""} ${s.symbol}`.trim()).join(" and ")} emerged on the other side.`,
    );
  }

  return parts.join(" ");
}

// ──────────────────────────────────────────────────────────────────
// 5. LONG-CYCLE THEMES
//
// Motifs that span the entire history. What persists.
// What keeps returning. What defines the symbolic life over time.
// ──────────────────────────────────────────────────────────────────

function buildLongCycleThemes(
  gravity,
  constellations,
  signatures,
  atmosphereMigrations,
  events,
) {
  const themes = [];

  // A) Anchored symbols — the permanent residents of the field
  const anchored = gravity.filter((g) => g.anchored);
  if (anchored.length > 0) {
    themes.push({
      type: "anchored_symbols",
      title: "The Permanent Residents",
      symbols: anchored.slice(0, 8).map((g) => ({
        symbol: g.symbol,
        visual: g.visual || "",
        stage: g.stage || "",
        weight: parseFloat(g.weight),
        peakWeight: parseFloat(g.peak_weight),
      })),
      narrative: `${anchored.length} symbol${anchored.length !== 1 ? "s have" : " has"} become anchored — permanent residents of the symbolic field. ${anchored.length >= 3 ? "These are the deep structures of this symbolic life, the symbols that persist even when attention wanders." : "These symbols have accumulated enough weight to become part of the lasting landscape."}`,
    });
  }

  // B) Foundational constellations — symbol groups that keep appearing together
  const foundational = constellations.filter(
    (c) => c.confidence === "foundational" || c.confidence === "established",
  );
  if (foundational.length > 0) {
    themes.push({
      type: "persistent_constellations",
      title: "The Abiding Constellations",
      constellations: foundational.slice(0, 4).map((c) => ({
        name: c.name,
        members: (c.members || []).map((m) => ({
          symbol: m.symbol || m,
          visual: m.visual || "",
        })),
        confidence: c.confidence,
        atmosphere: c.dominantAtmosphere || c.atmosphere,
      })),
      narrative: `${foundational.length} constellation${foundational.length !== 1 ? "s have" : " has"} proven durable — groups of symbols that repeatedly appear together. These are not coincidences but structural features of how this symbolic field organizes itself.`,
    });
  }

  // C) Foundational signatures — the identity-level symbols
  const coreSignatures = (signatures || []).filter(
    (s) => s.confidence === "foundational" || s.confidence === "established",
  );
  if (coreSignatures.length > 0) {
    themes.push({
      type: "core_signatures",
      title: "The Core Signatures",
      signatures: coreSignatures.slice(0, 6).map((s) => ({
        symbol: s.symbol,
        visual: s.visual || "",
        stage: s.stage || "",
        confidence: s.confidence,
        frequency: s.frequency,
      })),
      narrative: `${coreSignatures.length} symbol${coreSignatures.length !== 1 ? "s" : ""} form the core signature of this symbolic identity — appearing consistently enough to be considered defining.`,
    });
  }

  // D) Atmospheric drift — the long climate migration
  const drift = atmosphereMigrations?.drift;
  if (drift && drift.fromAtmosphere && drift.toAtmosphere) {
    const shifted = drift.fromAtmosphere !== drift.toAtmosphere;
    themes.push({
      type: "atmospheric_drift",
      title: shifted ? "The Atmospheric Migration" : "The Steady Atmosphere",
      from: drift.fromAtmosphere,
      to: drift.toAtmosphere,
      shifted,
      narrative: shifted
        ? `The symbolic climate has migrated from ${drift.fromAtmosphere} to ${drift.toAtmosphere} over the full history. This is a continental drift — a slow, deep shift in the quality of experience.`
        : `The atmosphere has remained predominantly ${drift.fromAtmosphere} throughout — a stable climate that provides continuity even as surface symbols shift.`,
    });
  }

  // E) Dominant stage across all time
  if (events.stageDistribution) {
    const sorted = Object.entries(events.stageDistribution).sort(
      (a, b) => b[1] - a[1],
    );
    if (sorted.length > 0) {
      const dominant = sorted[0];
      const dominantPct = Math.round((dominant[1] / events.totalEvents) * 100);

      if (dominantPct >= 25) {
        themes.push({
          type: "dominant_stage",
          title: `The ${dominant[0]} Undertone`,
          stage: dominant[0],
          percentage: dominantPct,
          distribution: Object.fromEntries(
            sorted.map(([s, c]) => [
              s,
              Math.round((c / events.totalEvents) * 100),
            ]),
          ),
          narrative: `Across the entire history, ${dominant[0]} has been the most frequent stage at ${dominantPct}%. This is the undertone — the background frequency that colors everything else.`,
        });
      }
    }
  }

  return themes;
}

// ──────────────────────────────────────────────────────────────────
// 6. LIFE-ERA SYNTHESIS
//
// The summary. Not a prediction. Not a prescription.
// A mirror held up to the entire symbolic history.
// ──────────────────────────────────────────────────────────────────

function buildLifeEraSynthesis(
  chapters,
  wounds,
  initiations,
  longCycleThemes,
  maturity,
  predictions,
) {
  // Current chapter
  const current =
    chapters.find((c) => c.isCurrent) || chapters[chapters.length - 1];

  // Wound summary
  const activeWoundCount = wounds.length;
  const oscillationCount = wounds.filter(
    (w) => w.type === "oscillation",
  ).length;

  // Initiation summary
  const majorInitiations = initiations.filter(
    (i) => i.type === "chapter_crossing",
  ).length;
  const recurringInitiations = initiations.filter(
    (i) => i.type === "recurring_initiation" || i.type === "forge_initiation",
  ).length;

  // Theme summary
  const anchoredTheme = longCycleThemes.find(
    (t) => t.type === "anchored_symbols",
  );
  const constellationTheme = longCycleThemes.find(
    (t) => t.type === "persistent_constellations",
  );
  const driftTheme = longCycleThemes.find(
    (t) => t.type === "atmospheric_drift",
  );

  // Predictive horizon
  const highConfidenceForecasts = (predictions?.forecasts || []).filter(
    (f) => f.confidence >= 0.7,
  );

  // Build synthesis narrative
  const parts = [];

  // Opening
  if (chapters.length === 1) {
    parts.push(
      `This symbolic life is in its first chapter — ${current?.title || "unnamed"}.`,
    );
  } else {
    parts.push(
      `Across ${chapters.length} chapters, a symbolic autobiography has formed.`,
    );
  }

  // Maturity
  const MATURITY_REFLECTIONS = {
    nascent:
      "The mythology is young — patterns are still forming, and the story is more sketch than narrative.",
    early:
      "The mythology is beginning to take shape — some threads are visible, though much remains to be written.",
    forming:
      "A real mythology has formed — recurring themes, established patterns, and recognizable chapters.",
    deep: "A deep mythology — rich with recurring themes, tested through initiations, and grounded in persistent symbolic structures.",
  };
  parts.push(
    MATURITY_REFLECTIONS[maturity?.level] || MATURITY_REFLECTIONS.nascent,
  );

  // Wounds
  if (activeWoundCount > 0) {
    if (oscillationCount > 0) {
      parts.push(
        `${oscillationCount} oscillation pattern${oscillationCount !== 1 ? "s" : ""} suggest${oscillationCount === 1 ? "s" : ""} unresolved tensions — places where the field keeps returning.`,
      );
    }
    if (activeWoundCount > oscillationCount) {
      parts.push(
        `${activeWoundCount - oscillationCount} other recurring pattern${activeWoundCount - oscillationCount !== 1 ? "s" : ""} point to dynamics that want continued attention.`,
      );
    }
  } else {
    parts.push(
      "No strong recurring wounds are visible — the field flows without obvious stuckness.",
    );
  }

  // Initiations
  if (majorInitiations > 0) {
    parts.push(
      `${majorInitiations} major initiation${majorInitiations !== 1 ? "s" : ""} — threshold${majorInitiations !== 1 ? "s" : ""} that fundamentally changed the field.`,
    );
  }

  // Long themes
  if (anchoredTheme && anchoredTheme.symbols?.length > 0) {
    const topAnchored = anchoredTheme.symbols
      .slice(0, 3)
      .map((s) => `${s.visual} ${s.symbol}`.trim());
    parts.push(
      `The permanent residents — ${topAnchored.join(", ")} — form the deep structure.`,
    );
  }

  // Atmospheric drift
  if (driftTheme?.shifted) {
    parts.push(
      `The atmosphere has migrated from ${driftTheme.from} to ${driftTheme.to} — a slow, deep climatic shift.`,
    );
  }

  // Horizon (from predictions, if available)
  if (highConfidenceForecasts.length > 0) {
    parts.push(
      `Looking forward: ${highConfidenceForecasts.length} strong historical precedent${highConfidenceForecasts.length !== 1 ? "s" : ""} suggest${highConfidenceForecasts.length === 1 ? "s" : ""} the field may be approaching a shift.`,
    );
  }

  // Closing
  parts.push(
    "This is a living mythology — it will continue to evolve as the symbolic practice deepens.",
  );

  return {
    currentChapter: current
      ? {
          title: current.title,
          stage: current.stage,
          atmosphere: current.atmosphere,
        }
      : null,
    maturityLevel: maturity?.level || "nascent",
    woundCount: activeWoundCount,
    initiationCount: majorInitiations + recurringInitiations,
    themeCount: longCycleThemes.length,
    forecastSignals: highConfidenceForecasts.length,
    narrative: parts.join(" "),
  };
}

// ──────────────────────────────────────────────────────────────────
// DATA LOADERS
// ──────────────────────────────────────────────────────────────────

async function loadGravity(userId) {
  const rows = await sql(
    `SELECT sg.symbol, sg.weight, sg.peak_weight, sg.anchored, sg.count,
            sg.first_seen, sg.last_seen, sg.source_types,
            sa.stage, sa.visual, sa.theme, sa.atmospheric_influence
     FROM symbol_gravity sg
     LEFT JOIN symbol_archetypes sa ON sg.symbol = sa.symbol
     WHERE sg.user_id = $1
     ORDER BY sg.weight DESC`,
    [userId],
  );
  return rows;
}

async function loadEventSummary(userId) {
  const rows = await sql(
    `SELECT
       COUNT(*) as total_events,
       MIN(created_at) as first_event,
       MAX(created_at) as last_event,
       COUNT(DISTINCT stage) as distinct_stages,
       COUNT(DISTINCT symbol) as distinct_symbols
     FROM symbol_events
     WHERE user_id = $1`,
    [userId],
  );

  const stageRows = await sql(
    `SELECT stage, COUNT(*) as cnt
     FROM symbol_events
     WHERE user_id = $1
     GROUP BY stage`,
    [userId],
  );

  const summary = rows[0] || {};
  const firstDate = summary.first_event
    ? new Date(summary.first_event)
    : new Date();
  const lastDate = summary.last_event
    ? new Date(summary.last_event)
    : new Date();
  const spanDays = Math.max(
    1,
    Math.round((lastDate - firstDate) / (1000 * 60 * 60 * 24)),
  );

  const stageDistribution = {};
  for (const r of stageRows) {
    stageDistribution[r.stage] = parseInt(r.cnt, 10);
  }

  return {
    totalEvents: parseInt(summary.total_events, 10) || 0,
    firstEvent: summary.first_event,
    lastEvent: summary.last_event,
    spanDays,
    distinctStages: parseInt(summary.distinct_stages, 10) || 0,
    distinctSymbols: parseInt(summary.distinct_symbols, 10) || 0,
    stageDistribution,
  };
}
