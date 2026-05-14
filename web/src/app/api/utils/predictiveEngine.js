/**
 * SYMBOLPATH — PREDICTIVE SYMBOLIC INTELLIGENCE
 *
 * Phase 7: Observational Forecasting
 *
 * ──────────────────────────────────────────────────────────────────
 * CORE PRINCIPLE:
 *
 *   This engine does NOT predict the future.
 *   It observes what patterns have historically preceded change,
 *   and notes when current conditions resemble those precedents.
 *
 *   "Storm historically emerges after prolonged suppression
 *    of Growth symbols."
 *
 *   Not: "You will experience a storm."
 *   But: "The conditions that preceded storms before are present now."
 *
 * ──────────────────────────────────────────────────────────────────
 * THE SIX DIMENSIONS OF PREDICTIVE AWARENESS:
 *
 *  1. TRANSITION FORECASTING
 *     "When X stage dominated for N weeks, Y stage followed 4 out of 5 times."
 *     Uses the user's OWN transition history as the basis for forecasting.
 *
 *  2. RECURRENCE ANTICIPATION
 *     "This configuration of symbols last appeared 8 weeks ago,
 *      and was followed by a Crisis→Growth threshold crossing."
 *     Detects when current conditions match past pre-transition states.
 *
 *  3. DESTABILIZATION AWARENESS
 *     "Growth symbols have been suppressed for 3 weeks while Crisis
 *      symbols hold steady — historically this precedes fragmentation."
 *     Notices when the field is under pressure that preceded disruptions before.
 *
 *  4. RECOVERY PREDICTION
 *     "After previous Crisis periods of similar length, recovery took
 *      approximately 2-3 weeks and was led by Tree/River/Flame."
 *     Notes which symbols and patterns historically accompanied recovery.
 *
 *  5. ATMOSPHERE SHIFT AWARENESS
 *     "The atmosphere has been hushed for 4 weeks. Previous hushed periods
 *      of this length transitioned to luminous or turbulent."
 *     Tracks atmospheric duration and what followed in the past.
 *
 *  6. CONSTELLATION ACTIVATION PATTERNS
 *     "The Storm+Mirror constellation activated 3 times before. Each time,
 *      Flame appeared within 2 weeks."
 *     Detects what historically followed specific symbol pairings.
 *
 * ──────────────────────────────────────────────────────────────────
 * LANGUAGE RULES:
 *
 *   ALWAYS: "historically," "in the past," "has tended to,"
 *           "conditions resemble," "precedent suggests"
 *   NEVER:  "will," "going to," "you should expect,"
 *           "this means," "destiny"
 *
 *   Every forecast carries a confidence and a precedent count.
 *   If there's only 1 precedent, the language is maximally hedged.
 * ──────────────────────────────────────────────────────────────────
 */

import sql from "@/app/api/utils/sql";

// Minimum data requirements
const MIN_EVENTS = 15;
const MIN_SPAN_DAYS = 21;
const MIN_DISTINCT_WEEKS = 3;

// ─────────────────────────────────────────────────────────────────────────────
// MASTER FUNCTION
// ─────────────────────────────────────────────────────────────────────────────

export async function computePredictiveIntelligence(userId) {
  // Load all source data
  const [events, archetypes, gravity] = await Promise.all([
    loadEvents(userId),
    loadArchetypes(),
    loadGravity(userId),
  ]);

  // Readiness check
  if (events.length < MIN_EVENTS) {
    return {
      ready: false,
      reason: `Need at least ${MIN_EVENTS} events (have ${events.length}).`,
    };
  }

  const firstDate = new Date(events[0].created_at);
  const lastDate = new Date(events[events.length - 1].created_at);
  const spanDays = Math.round((lastDate - firstDate) / (1000 * 60 * 60 * 24));
  if (spanDays < MIN_SPAN_DAYS) {
    return {
      ready: false,
      reason: `Need at least ${MIN_SPAN_DAYS} days of data (have ${spanDays}).`,
    };
  }

  const distinctWeeks = new Set(events.map((e) => weekKey(e.created_at))).size;
  if (distinctWeeks < MIN_DISTINCT_WEEKS) {
    return {
      ready: false,
      reason: `Need at least ${MIN_DISTINCT_WEEKS} distinct weeks of data.`,
    };
  }

  // Build weekly profiles
  const weeks = buildWeeklyProfiles(events, archetypes);
  const currentWeek = weeks[weeks.length - 1];

  // Run all six dimensions
  const transitionForecasts = computeTransitionForecasting(weeks, currentWeek);
  const recurrenceSignals = computeRecurrenceAnticipation(
    weeks,
    currentWeek,
    archetypes,
  );
  const destabilization = computeDestabilizationAwareness(
    weeks,
    currentWeek,
    gravity,
    archetypes,
  );
  const recovery = computeRecoveryPrediction(weeks, currentWeek, archetypes);
  const atmosphereShifts = computeAtmosphereShiftAwareness(weeks, currentWeek);
  const constellationActivation = computeConstellationActivation(
    events,
    currentWeek,
    archetypes,
  );

  // Assemble all forecasts, sort by confidence
  const allForecasts = [
    ...transitionForecasts,
    ...recurrenceSignals,
    ...destabilization,
    ...recovery,
    ...atmosphereShifts,
    ...constellationActivation,
  ].sort((a, b) => b.confidence - a.confidence);

  // Build summary
  const highConfidence = allForecasts.filter((f) => f.confidence >= 0.7);
  const mediumConfidence = allForecasts.filter(
    (f) => f.confidence >= 0.4 && f.confidence < 0.7,
  );
  const lowConfidence = allForecasts.filter((f) => f.confidence < 0.4);

  // Compute current field state for context
  const fieldState = describeCurrentField(currentWeek, gravity, archetypes);

  return {
    ready: true,
    meta: {
      totalEvents: events.length,
      spanDays,
      distinctWeeks,
      weeksAnalyzed: weeks.length,
    },
    fieldState,
    forecasts: allForecasts,
    summary: {
      total: allForecasts.length,
      highConfidence: highConfidence.length,
      mediumConfidence: mediumConfidence.length,
      lowConfidence: lowConfidence.length,
      narrative: buildSummaryNarrative(allForecasts, fieldState),
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. TRANSITION FORECASTING
//
// "When X stage dominated for N+ weeks, what followed?"
// Uses the user's own history of stage sequences.
// ─────────────────────────────────────────────────────────────────────────────

function computeTransitionForecasting(weeks, currentWeek) {
  const forecasts = [];
  if (weeks.length < 4) return forecasts;

  const currentStage = currentWeek.dominantStage;
  if (!currentStage) return forecasts;

  // How many consecutive weeks has the current stage dominated?
  let streak = 0;
  for (let i = weeks.length - 1; i >= 0; i--) {
    if (weeks[i].dominantStage === currentStage) streak++;
    else break;
  }

  // Find all past instances where this stage dominated for similar or longer streaks
  // and see what came next
  const transitions = [];
  let run = 0;
  let runStage = null;

  for (let i = 0; i < weeks.length - 1; i++) {
    const stage = weeks[i].dominantStage;
    if (stage === runStage) {
      run++;
    } else {
      // Streak ended — if it was our target stage and long enough, record what followed
      if (runStage === currentStage && run >= Math.max(1, streak - 1)) {
        const nextStage = weeks[i].dominantStage;
        if (nextStage && nextStage !== currentStage) {
          transitions.push({
            afterWeeks: run,
            nextStage,
            nextAtmosphere: weeks[i].dominantAtmosphere,
            weekIndex: i,
          });
        }
      }
      runStage = stage;
      run = 1;
    }
  }

  if (transitions.length === 0) return forecasts;

  // Group by what followed
  const nextStageCounts = {};
  for (const t of transitions) {
    nextStageCounts[t.nextStage] = nextStageCounts[t.nextStage] || {
      count: 0,
      instances: [],
    };
    nextStageCounts[t.nextStage].count++;
    nextStageCounts[t.nextStage].instances.push(t);
  }

  const total = transitions.length;

  for (const [nextStage, data] of Object.entries(nextStageCounts)) {
    const ratio = data.count / total;
    const confidence = computeConfidence(data.count, total, ratio);

    if (confidence < 0.2) continue;

    const avgWeeks =
      data.instances.reduce((s, t) => s + t.afterWeeks, 0) /
      data.instances.length;

    forecasts.push({
      type: "transition_forecast",
      dimension: "Transition Forecasting",
      emoji: "🔄",
      confidence,
      precedents: data.count,
      totalPrecedents: total,
      currentStage,
      currentStreak: streak,
      predictedStage: nextStage,
      ratio: Math.round(ratio * 100),
      avgStreakLength: Math.round(avgWeeks * 10) / 10,
      title: `${currentStage} → ${nextStage} transition pattern`,
      narrative: buildForecastNarrative(
        `${currentStage} has dominated for ${streak} week${streak !== 1 ? "s" : ""}`,
        `In ${data.count} of ${total} similar past sequences, ${nextStage} followed`,
        `after an average of ${avgWeeks.toFixed(1)} weeks`,
        confidence,
      ),
    });
  }

  return forecasts;
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. RECURRENCE ANTICIPATION
//
// "Current conditions look like conditions that preceded X before."
// Compares the current week's symbol/stage profile to past weeks
// and sees what followed those similar weeks.
// ─────────────────────────────────────────────────────────────────────────────

function computeRecurrenceAnticipation(weeks, currentWeek, archetypes) {
  const forecasts = [];
  if (weeks.length < 5) return forecasts;

  const currentSymbols = new Set(currentWeek.symbols);
  const currentStages = new Set(Object.keys(currentWeek.stages));

  // Find past weeks with similar profiles (at least 50% symbol overlap)
  const similarities = [];
  for (let i = 0; i < weeks.length - 2; i++) {
    const pastWeek = weeks[i];
    const pastSymbols = new Set(pastWeek.symbols);
    const overlap = [...currentSymbols].filter((s) => pastSymbols.has(s));
    const overlapRatio = overlap.length / Math.max(currentSymbols.size, 1);

    if (overlapRatio >= 0.4 && overlap.length >= 2) {
      // What happened in the next 1-2 weeks?
      const nextWeek = weeks[i + 1];
      const nextNext = weeks[i + 2] || null;

      similarities.push({
        weekIndex: i,
        weekDate: pastWeek.weekStart,
        overlapSymbols: overlap,
        overlapRatio,
        nextDominantStage: nextWeek?.dominantStage,
        nextAtmosphere: nextWeek?.dominantAtmosphere,
        nextNewSymbols: nextWeek
          ? nextWeek.symbols.filter((s) => !pastSymbols.has(s))
          : [],
        twoWeekStage: nextNext?.dominantStage,
      });
    }
  }

  if (similarities.length === 0) return forecasts;

  // Group by what followed
  const followedBy = {};
  for (const sim of similarities) {
    const key = sim.nextDominantStage || "mixed";
    if (!followedBy[key])
      followedBy[key] = { count: 0, instances: [], newSymbols: {} };
    followedBy[key].count++;
    followedBy[key].instances.push(sim);
    for (const ns of sim.nextNewSymbols) {
      followedBy[key].newSymbols[ns] =
        (followedBy[key].newSymbols[ns] || 0) + 1;
    }
  }

  const total = similarities.length;

  for (const [nextStage, data] of Object.entries(followedBy)) {
    const ratio = data.count / total;
    const confidence = computeConfidence(data.count, total, ratio);
    if (confidence < 0.2) continue;

    // Find symbols that consistently appeared after similar conditions
    const anticipatedSymbols = Object.entries(data.newSymbols)
      .filter(([, count]) => count >= 2)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([sym, count]) => ({
        symbol: sym,
        visual: archetypes[sym]?.visual || "",
        times: count,
      }));

    const avgOverlap =
      data.instances.reduce((s, i) => s + i.overlapRatio, 0) /
      data.instances.length;

    forecasts.push({
      type: "recurrence_anticipation",
      dimension: "Recurrence Anticipation",
      emoji: "🔮",
      confidence,
      precedents: data.count,
      totalPrecedents: total,
      matchedConditions: `Similar symbol configurations occurred ${data.count} time${data.count !== 1 ? "s" : ""} before`,
      predictedStage: nextStage,
      anticipatedSymbols,
      avgOverlapRatio: Math.round(avgOverlap * 100),
      title: `Conditions resemble past pre-${nextStage} states`,
      narrative: buildForecastNarrative(
        `The current symbolic configuration resembles ${data.count} past week${data.count !== 1 ? "s" : ""}`,
        `In those instances, ${nextStage} energy followed`,
        anticipatedSymbols.length > 0
          ? `with ${anticipatedSymbols.map((s) => `${s.visual} ${s.symbol}`).join(", ")} tending to emerge`
          : "",
        confidence,
      ),
    });
  }

  return forecasts;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. DESTABILIZATION AWARENESS
//
// Detects conditions that historically preceded disruptions:
// - Stage suppression (a stage normally present goes missing)
// - Concentration pressure (one stage dominates >60% for 3+ weeks)
// - Rising fragmentation (stage diversity increasing over recent weeks)
// ─────────────────────────────────────────────────────────────────────────────

function computeDestabilizationAwareness(
  weeks,
  currentWeek,
  gravity,
  archetypes,
) {
  const forecasts = [];
  if (weeks.length < 4) return forecasts;

  // --- A) STAGE SUPPRESSION ---
  // Find stages that were normally present but have gone missing recently
  const historyLength = Math.max(4, Math.floor(weeks.length * 0.6));
  const historicWeeks = weeks.slice(0, historyLength);
  const recentWeeks = weeks.slice(-3);

  const historicStageCounts = {};
  for (const w of historicWeeks) {
    for (const stage of Object.keys(w.stages)) {
      historicStageCounts[stage] = (historicStageCounts[stage] || 0) + 1;
    }
  }

  const recentStageCounts = {};
  for (const w of recentWeeks) {
    for (const stage of Object.keys(w.stages)) {
      recentStageCounts[stage] = (recentStageCounts[stage] || 0) + 1;
    }
  }

  for (const [stage, historicCount] of Object.entries(historicStageCounts)) {
    const historicPresenceRate = historicCount / historicWeeks.length;
    const recentPresence = recentStageCounts[stage] || 0;
    const recentPresenceRate = recentPresence / recentWeeks.length;

    // Stage was present in >50% of historic weeks but <20% recently
    if (historicPresenceRate > 0.5 && recentPresenceRate < 0.2) {
      // Find what happened after past suppressions of this stage
      const pastSuppressions = findPastSuppressions(weeks, stage);
      const afterEvents = pastSuppressions
        .map((s) => s.whatFollowed)
        .filter(Boolean);

      let predictedOutcome = null;
      let precedentCount = 0;
      if (afterEvents.length >= 2) {
        // Count what most commonly followed
        const afterCounts = {};
        for (const a of afterEvents) afterCounts[a] = (afterCounts[a] || 0) + 1;
        const topAfter = Object.entries(afterCounts).sort(
          (a, b) => b[1] - a[1],
        )[0];
        if (topAfter) {
          predictedOutcome = topAfter[0];
          precedentCount = topAfter[1];
        }
      }

      const confidence = computeConfidence(
        precedentCount,
        afterEvents.length || 1,
        precedentCount / (afterEvents.length || 1),
      );

      forecasts.push({
        type: "destabilization",
        subtype: "stage_suppression",
        dimension: "Destabilization Awareness",
        emoji: "⚠️",
        confidence: Math.max(0.3, confidence),
        precedents: precedentCount,
        suppressedStage: stage,
        historicPresenceRate: Math.round(historicPresenceRate * 100),
        currentAbsenceWeeks: recentWeeks.length,
        predictedOutcome,
        title: `${stage} suppression detected`,
        narrative: buildForecastNarrative(
          `${stage} was present in ${Math.round(historicPresenceRate * 100)}% of your earlier weeks but has been absent for ${recentWeeks.length} weeks`,
          predictedOutcome
            ? `In past instances of ${stage} suppression, ${predictedOutcome} tended to follow`
            : `Prolonged suppression of an active stage has historically preceded shifts in the symbolic field`,
          "",
          Math.max(0.3, confidence),
        ),
      });
    }
  }

  // --- B) CONCENTRATION PRESSURE ---
  // One stage dominating >60% for 3+ consecutive weeks
  const recent3 = weeks.slice(-3);
  if (recent3.length >= 3) {
    const dominantStage = currentWeek.dominantStage;
    const allDominated = recent3.every(
      (w) => w.dominantStage === dominantStage,
    );
    const avgDominance =
      recent3.reduce((s, w) => {
        const total = Object.values(w.stages).reduce((a, b) => a + b, 0);
        const stagePct = (w.stages[dominantStage] || 0) / (total || 1);
        return s + stagePct;
      }, 0) / recent3.length;

    if (allDominated && avgDominance > 0.55) {
      // Find what happened after past concentration of this stage
      const pastConcentrations = findPastConcentrations(
        weeks,
        dominantStage,
        3,
      );

      let nextStages = {};
      for (const pc of pastConcentrations) {
        if (pc.whatFollowed)
          nextStages[pc.whatFollowed] = (nextStages[pc.whatFollowed] || 0) + 1;
      }
      const topNext = Object.entries(nextStages).sort((a, b) => b[1] - a[1])[0];

      const confidence = topNext
        ? computeConfidence(
            topNext[1],
            pastConcentrations.length || 1,
            topNext[1] / (pastConcentrations.length || 1),
          )
        : 0.3;

      forecasts.push({
        type: "destabilization",
        subtype: "concentration_pressure",
        dimension: "Destabilization Awareness",
        emoji: "🔺",
        confidence: Math.max(0.25, confidence),
        precedents: pastConcentrations.length,
        dominantStage,
        concentrationWeeks: 3,
        avgDominance: Math.round(avgDominance * 100),
        predictedShift: topNext ? topNext[0] : null,
        title: `${dominantStage} concentration pressure`,
        narrative: buildForecastNarrative(
          `${dominantStage} has dominated at ${Math.round(avgDominance * 100)}% for 3 consecutive weeks`,
          topNext
            ? `In ${topNext[1]} of ${pastConcentrations.length} similar past concentrations, ${topNext[0]} followed`
            : `Prolonged concentration in one stage has historically preceded a shift`,
          "",
          Math.max(0.25, confidence),
        ),
      });
    }
  }

  // --- C) RISING FRAGMENTATION ---
  if (weeks.length >= 5) {
    const recentDiversity = weeks
      .slice(-3)
      .map((w) => Object.keys(w.stages).length);
    const olderDiversity = weeks
      .slice(-6, -3)
      .map((w) => Object.keys(w.stages).length);

    if (recentDiversity.length >= 2 && olderDiversity.length >= 2) {
      const recentAvg =
        recentDiversity.reduce((a, b) => a + b, 0) / recentDiversity.length;
      const olderAvg =
        olderDiversity.reduce((a, b) => a + b, 0) / olderDiversity.length;

      if (recentAvg > olderAvg + 0.8 && recentAvg >= 3.5) {
        forecasts.push({
          type: "destabilization",
          subtype: "rising_fragmentation",
          dimension: "Destabilization Awareness",
          emoji: "💔",
          confidence: 0.35,
          precedents: 0,
          currentDiversity: Math.round(recentAvg * 10) / 10,
          previousDiversity: Math.round(olderAvg * 10) / 10,
          title: "Rising fragmentation",
          narrative: buildForecastNarrative(
            `Stage diversity has risen from ${olderAvg.toFixed(1)} to ${recentAvg.toFixed(1)} stages per week`,
            "Increasing fragmentation has historically preceded either a consolidation into a new dominant stage or a threshold transition",
            "",
            0.35,
          ),
        });
      }
    }
  }

  return forecasts;
}

function findPastSuppressions(weeks, stage) {
  const results = [];
  for (let i = 3; i < weeks.length - 1; i++) {
    const prevPresent = weeks
      .slice(Math.max(0, i - 3), i)
      .some((w) => w.stages[stage]);
    const currentAbsent = !weeks[i].stages[stage];
    const prevPrevPresent =
      i >= 4 &&
      weeks.slice(Math.max(0, i - 4), i - 1).filter((w) => w.stages[stage])
        .length >= 2;

    if (currentAbsent && prevPrevPresent && !prevPresent) {
      results.push({
        weekIndex: i,
        whatFollowed: weeks[i + 1]?.dominantStage || null,
      });
    }
  }
  return results;
}

function findPastConcentrations(weeks, stage, minStreak) {
  const results = [];
  let streak = 0;
  for (let i = 0; i < weeks.length - 1; i++) {
    if (weeks[i].dominantStage === stage) {
      streak++;
      if (streak >= minStreak && weeks[i + 1]?.dominantStage !== stage) {
        results.push({
          endIndex: i,
          streakLength: streak,
          whatFollowed: weeks[i + 1]?.dominantStage || null,
        });
      }
    } else {
      streak = 0;
    }
  }
  return results;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. RECOVERY PREDICTION
//
// "After past Crisis periods of similar length, recovery took N weeks
//  and was led by these symbols."
// ─────────────────────────────────────────────────────────────────────────────

function computeRecoveryPrediction(weeks, currentWeek, archetypes) {
  const forecasts = [];

  // Only relevant if current dominant stage is Crisis
  if (currentWeek.dominantStage !== "Crisis") return forecasts;

  // How long has Crisis dominated?
  let crisisStreak = 0;
  for (let i = weeks.length - 1; i >= 0; i--) {
    if (weeks[i].dominantStage === "Crisis") crisisStreak++;
    else break;
  }

  if (crisisStreak < 2) return forecasts;

  // Find past Crisis periods and their recovery patterns
  const pastCrises = [];
  let inCrisis = false;
  let crisisStart = -1;

  for (let i = 0; i < weeks.length; i++) {
    if (weeks[i].dominantStage === "Crisis") {
      if (!inCrisis) {
        crisisStart = i;
        inCrisis = true;
      }
    } else {
      if (inCrisis) {
        const crisisLength = i - crisisStart;
        // Find recovery duration (how many weeks until a non-Crisis stage stabilizes)
        let recoveryWeeks = 0;
        const recoverySymbols = new Set();
        let recoveredToStage = null;
        for (let j = i; j < Math.min(i + 6, weeks.length); j++) {
          recoveryWeeks++;
          for (const sym of weeks[j].symbols) recoverySymbols.add(sym);
          if (weeks[j].dominantStage !== "Crisis" && !recoveredToStage) {
            recoveredToStage = weeks[j].dominantStage;
          }
        }

        // Don't include the current crisis period
        if (i < weeks.length - crisisStreak) {
          pastCrises.push({
            startIndex: crisisStart,
            length: crisisLength,
            recoveryWeeks,
            recoveredToStage,
            recoverySymbols: [...recoverySymbols],
          });
        }
        inCrisis = false;
      }
    }
  }

  if (pastCrises.length === 0) return forecasts;

  // Average recovery stats
  const avgRecoveryWeeks =
    pastCrises.reduce((s, c) => s + c.recoveryWeeks, 0) / pastCrises.length;

  // Find most common recovery symbols
  const symbolFreq = {};
  for (const c of pastCrises) {
    for (const sym of c.recoverySymbols) {
      symbolFreq[sym] = (symbolFreq[sym] || 0) + 1;
    }
  }
  const recoverySymbols = Object.entries(symbolFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([sym, count]) => ({
      symbol: sym,
      visual: archetypes[sym]?.visual || "",
      times: count,
    }));

  // Most common recovery destination
  const destCounts = {};
  for (const c of pastCrises) {
    if (c.recoveredToStage)
      destCounts[c.recoveredToStage] =
        (destCounts[c.recoveredToStage] || 0) + 1;
  }
  const topDest = Object.entries(destCounts).sort((a, b) => b[1] - a[1])[0];

  const confidence =
    computeConfidence(pastCrises.length, pastCrises.length, 1.0) * 0.8;

  forecasts.push({
    type: "recovery_prediction",
    dimension: "Recovery Prediction",
    emoji: "🌱",
    confidence,
    precedents: pastCrises.length,
    currentCrisisWeeks: crisisStreak,
    avgRecoveryWeeks: Math.round(avgRecoveryWeeks * 10) / 10,
    recoverySymbols,
    predictedRecoveryStage: topDest ? topDest[0] : null,
    title: "Recovery pattern observed",
    narrative: buildForecastNarrative(
      `The current Crisis period has lasted ${crisisStreak} weeks`,
      `In ${pastCrises.length} past Crisis period${pastCrises.length !== 1 ? "s" : ""}, recovery took approximately ${avgRecoveryWeeks.toFixed(1)} weeks`,
      recoverySymbols.length > 0
        ? `Recovery was historically accompanied by ${recoverySymbols
            .slice(0, 3)
            .map((s) => `${s.visual} ${s.symbol}`)
            .join(", ")}${topDest ? `, leading to ${topDest[0]}` : ""}`
        : "",
      confidence,
    ),
  });

  return forecasts;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. ATMOSPHERE SHIFT AWARENESS
//
// "The atmosphere has been X for N weeks. Past X periods of this length
//  transitioned to Y or Z."
// ─────────────────────────────────────────────────────────────────────────────

function computeAtmosphereShiftAwareness(weeks, currentWeek) {
  const forecasts = [];
  if (weeks.length < 4) return forecasts;

  const currentAtm = currentWeek.dominantAtmosphere;
  if (!currentAtm) return forecasts;

  // How long has this atmosphere persisted?
  let atmStreak = 0;
  for (let i = weeks.length - 1; i >= 0; i--) {
    if (weeks[i].dominantAtmosphere === currentAtm) atmStreak++;
    else break;
  }

  if (atmStreak < 2) return forecasts;

  // Find past instances where this atmosphere persisted and what followed
  const pastPeriods = [];
  let inAtm = false;
  let atmStart = -1;

  for (let i = 0; i < weeks.length; i++) {
    if (weeks[i].dominantAtmosphere === currentAtm) {
      if (!inAtm) {
        atmStart = i;
        inAtm = true;
      }
    } else {
      if (inAtm) {
        const length = i - atmStart;
        if (length >= 2 && i < weeks.length - atmStreak) {
          pastPeriods.push({
            length,
            followedByAtm: weeks[i].dominantAtmosphere,
            followedByStage: weeks[i].dominantStage,
          });
        }
        inAtm = false;
      }
    }
  }

  if (pastPeriods.length === 0) return forecasts;

  // Group by what followed
  const nextAtmCounts = {};
  for (const p of pastPeriods) {
    const key = p.followedByAtm || "unknown";
    nextAtmCounts[key] = (nextAtmCounts[key] || 0) + 1;
  }

  const total = pastPeriods.length;
  const topNext = Object.entries(nextAtmCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2);

  if (topNext.length === 0) return forecasts;

  const confidence = computeConfidence(
    topNext[0][1],
    total,
    topNext[0][1] / total,
  );

  const nextAtmospheres = topNext.map(([atm, count]) => ({
    atmosphere: atm,
    count,
    percentage: Math.round((count / total) * 100),
  }));

  forecasts.push({
    type: "atmosphere_shift",
    dimension: "Atmosphere Shift Awareness",
    emoji: "🌤️",
    confidence,
    precedents: total,
    currentAtmosphere: currentAtm,
    currentDuration: atmStreak,
    predictedAtmospheres: nextAtmospheres,
    title: `${currentAtm} atmosphere — shift pattern`,
    narrative: buildForecastNarrative(
      `The ${currentAtm} atmosphere has persisted for ${atmStreak} week${atmStreak !== 1 ? "s" : ""}`,
      `In ${total} past ${currentAtm} periods of similar length, the atmosphere shifted to ${nextAtmospheres.map((a) => `${a.atmosphere} (${a.percentage}%)`).join(" or ")}`,
      "",
      confidence,
    ),
  });

  return forecasts;
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. CONSTELLATION ACTIVATION PATTERNS
//
// "When Storm+Mirror activated together before, Flame appeared within 2 weeks."
// Looks at symbol co-occurrence windows and what followed them.
// ─────────────────────────────────────────────────────────────────────────────

function computeConstellationActivation(events, currentWeek, archetypes) {
  const forecasts = [];
  const currentSymbols = currentWeek.symbols;
  if (currentSymbols.length < 2) return forecasts;

  // Build pairs from current week
  const currentPairs = [];
  for (let i = 0; i < currentSymbols.length; i++) {
    for (let j = i + 1; j < currentSymbols.length; j++) {
      currentPairs.push([currentSymbols[i], currentSymbols[j]].sort());
    }
  }

  // Build week-by-week symbol sets from events
  const weekSymbols = {};
  for (const e of events) {
    const wk = weekKey(e.created_at);
    if (!weekSymbols[wk]) weekSymbols[wk] = new Set();
    weekSymbols[wk].add(e.symbol);
  }

  const sortedWeeks = Object.keys(weekSymbols).sort();
  const currentWk = sortedWeeks[sortedWeeks.length - 1];

  // For each current pair, find past co-occurrences and what followed
  for (const [symA, symB] of currentPairs) {
    const pastWindows = [];

    for (let i = 0; i < sortedWeeks.length - 1; i++) {
      const wk = sortedWeeks[i];
      if (wk === currentWk) continue;

      const syms = weekSymbols[wk];
      if (syms.has(symA) && syms.has(symB)) {
        // What new symbols appeared in the next 1-2 weeks?
        const nextSymbols = new Set();
        for (let j = i + 1; j <= Math.min(i + 2, sortedWeeks.length - 1); j++) {
          const nextSyns = weekSymbols[sortedWeeks[j]];
          if (nextSyns) {
            for (const s of nextSyns) {
              if (!syms.has(s)) nextSymbols.add(s);
            }
          }
        }
        pastWindows.push({
          week: wk,
          followedBy: [...nextSymbols],
        });
      }
    }

    if (pastWindows.length < 2) continue;

    // Find symbols that consistently followed this pair
    const followCounts = {};
    for (const pw of pastWindows) {
      for (const s of pw.followedBy) {
        followCounts[s] = (followCounts[s] || 0) + 1;
      }
    }

    const anticipatedSymbols = Object.entries(followCounts)
      .filter(([, count]) => count >= 2)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([sym, count]) => ({
        symbol: sym,
        visual: archetypes[sym]?.visual || "",
        stage: archetypes[sym]?.stage || "",
        times: count,
        ratio: Math.round((count / pastWindows.length) * 100),
      }));

    if (anticipatedSymbols.length === 0) continue;

    const confidence = computeConfidence(
      anticipatedSymbols[0].times,
      pastWindows.length,
      anticipatedSymbols[0].times / pastWindows.length,
    );

    forecasts.push({
      type: "constellation_activation",
      dimension: "Constellation Activation",
      emoji: "✨",
      confidence,
      precedents: pastWindows.length,
      constellation: [symA, symB],
      constellationVisual: `${archetypes[symA]?.visual || ""} ${symA} + ${archetypes[symB]?.visual || ""} ${symB}`,
      anticipatedSymbols,
      title: `${symA} + ${symB} activation pattern`,
      narrative: buildForecastNarrative(
        `${archetypes[symA]?.visual || ""} ${symA} and ${archetypes[symB]?.visual || ""} ${symB} are active together this week`,
        `In ${pastWindows.length} past co-occurrences, ${anticipatedSymbols.map((s) => `${s.visual} ${s.symbol}`).join(", ")} tended to emerge within 1-2 weeks`,
        `(${anticipatedSymbols[0].ratio}% of the time)`,
        confidence,
      ),
    });
  }

  // Limit to top 5 by confidence
  return forecasts.sort((a, b) => b.confidence - a.confidence).slice(0, 5);
}

// ─────────────────────────────────────────────────────────────────────────────
// FIELD STATE DESCRIPTION
// ─────────────────────────────────────────────────────────────────────────────

function describeCurrentField(currentWeek, gravity, archetypes) {
  const stageTotal = Object.values(currentWeek.stages).reduce(
    (a, b) => a + b,
    0,
  );
  const stageDistribution = {};
  for (const [stage, count] of Object.entries(currentWeek.stages)) {
    stageDistribution[stage] = Math.round((count / (stageTotal || 1)) * 100);
  }

  const topSymbols = currentWeek.symbols.slice(0, 6).map((s) => ({
    symbol: s,
    visual: archetypes[s]?.visual || "",
    stage: archetypes[s]?.stage || "",
  }));

  // Current gravity anchors
  const anchored = gravity
    .filter((g) => g.anchored)
    .map((g) => ({
      symbol: g.symbol,
      visual: archetypes[g.symbol]?.visual || "",
      weight: parseFloat(g.weight),
    }));

  return {
    weekStart: currentWeek.weekStart,
    dominantStage: currentWeek.dominantStage,
    dominantAtmosphere: currentWeek.dominantAtmosphere,
    stageDistribution,
    stageCount: Object.keys(currentWeek.stages).length,
    totalEvents: currentWeek.events,
    topSymbols,
    anchored,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// NARRATIVE BUILDERS
// ─────────────────────────────────────────────────────────────────────────────

function buildForecastNarrative(condition, pattern, detail, confidence) {
  const qualifier =
    confidence >= 0.7
      ? ""
      : confidence >= 0.4
        ? "Based on limited precedent, "
        : "With very few precedents — take this lightly — ";

  const hedging =
    confidence >= 0.7
      ? "This pattern has been consistent."
      : confidence >= 0.4
        ? "This is an observed tendency, not a certainty."
        : "This is a faint signal — more of a whisper than a statement.";

  const parts = [
    qualifier + condition + ".",
    pattern + ".",
    detail,
    hedging,
  ].filter(Boolean);
  return parts.join(" ");
}

function buildSummaryNarrative(forecasts, fieldState) {
  if (forecasts.length === 0) {
    return "The symbolic field is in a steady state. No strong precedent-based forecasts are available right now.";
  }

  const high = forecasts.filter((f) => f.confidence >= 0.7);
  const medium = forecasts.filter(
    (f) => f.confidence >= 0.4 && f.confidence < 0.7,
  );

  const parts = [];
  if (high.length > 0) {
    parts.push(
      `${high.length} strong signal${high.length !== 1 ? "s" : ""} based on well-established precedent.`,
    );
  }
  if (medium.length > 0) {
    parts.push(
      `${medium.length} moderate signal${medium.length !== 1 ? "s" : ""} with some historical basis.`,
    );
  }

  const dominantDimension = forecasts.reduce((acc, f) => {
    acc[f.dimension] = (acc[f.dimension] || 0) + 1;
    return acc;
  }, {});
  const topDimension = Object.entries(dominantDimension).sort(
    (a, b) => b[1] - a[1],
  )[0];
  if (topDimension) {
    parts.push(
      `The strongest signals come from ${topDimension[0].toLowerCase()}.`,
    );
  }

  parts.push(
    "Remember: these are patterns observed in your history, not predictions of what must happen.",
  );

  return parts.join(" ");
}

// ─────────────────────────────────────────────────────────────────────────────
// CONFIDENCE COMPUTATION
//
// Confidence = f(precedent_count, total_precedents, hit_ratio)
// Scale: 0.0 – 1.0
// ─────────────────────────────────────────────────────────────────────────────

function computeConfidence(hits, total, ratio) {
  if (total === 0 || hits === 0) return 0;

  // Base confidence from ratio
  let base = ratio;

  // Penalize low sample sizes
  if (total === 1) base *= 0.3;
  else if (total === 2) base *= 0.5;
  else if (total === 3) base *= 0.7;
  else if (total <= 5) base *= 0.85;
  // else: full base

  // Reward high hit counts
  if (hits >= 5) base = Math.min(base * 1.1, 0.95);
  if (hits >= 8) base = Math.min(base * 1.15, 0.95);

  // Clamp
  return Math.max(0, Math.min(0.95, base));
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA LOADING
// ─────────────────────────────────────────────────────────────────────────────

async function loadEvents(userId) {
  return sql(
    `SELECT id, symbol, stage, source_type, visual, note, created_at
     FROM symbol_events
     WHERE user_id = $1
     ORDER BY created_at ASC`,
    [userId],
  );
}

let _archCache = null;
async function loadArchetypes() {
  if (_archCache) return _archCache;
  const rows = await sql(`SELECT * FROM symbol_archetypes ORDER BY id`);
  const map = {};
  for (const a of rows) map[a.symbol] = a;
  _archCache = map;
  setTimeout(() => {
    _archCache = null;
  }, 60000);
  return map;
}

async function loadGravity(userId) {
  return sql(
    `SELECT symbol, weight, peak_weight, anchored, first_seen, last_seen, count
     FROM symbol_gravity
     WHERE user_id = $1
     ORDER BY weight DESC`,
    [userId],
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WEEKLY PROFILE BUILDER
// ─────────────────────────────────────────────────────────────────────────────

function buildWeeklyProfiles(events, archetypes) {
  const weekMap = {};

  for (const e of events) {
    const wk = weekKey(e.created_at);
    if (!weekMap[wk]) {
      weekMap[wk] = {
        weekStart: wk,
        stages: {},
        symbols: [],
        symbolSet: new Set(),
        events: 0,
        atmospheres: {},
      };
    }
    const w = weekMap[wk];
    w.stages[e.stage] = (w.stages[e.stage] || 0) + 1;
    if (!w.symbolSet.has(e.symbol)) {
      w.symbolSet.add(e.symbol);
      w.symbols.push(e.symbol);
    }
    w.events++;

    const atm = archetypes[e.symbol]?.atmospheric_influence;
    if (atm) w.atmospheres[atm] = (w.atmospheres[atm] || 0) + 1;
  }

  return Object.values(weekMap)
    .sort((a, b) => a.weekStart.localeCompare(b.weekStart))
    .map((w) => {
      const domStage = Object.entries(w.stages).sort((a, b) => b[1] - a[1])[0];
      const domAtm = Object.entries(w.atmospheres).sort(
        (a, b) => b[1] - a[1],
      )[0];
      return {
        weekStart: w.weekStart,
        dominantStage: domStage?.[0] || null,
        dominantAtmosphere: domAtm?.[0] || null,
        stages: w.stages,
        symbols: w.symbols,
        events: w.events,
      };
    });
}

function weekKey(dateStr) {
  const d = new Date(dateStr);
  const day = d.getUTCDay();
  const diff = d.getUTCDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), diff));
  return monday.toISOString().split("T")[0];
}
