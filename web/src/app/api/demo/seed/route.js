import sql from "@/app/api/utils/sql";
import {
  DEMO_USER_ID,
  DEMO_SYMBOL_EVENTS,
} from "../../../../data/demo-journey";

export async function POST(request) {
  try {
    // Clear previous demo data
    await sql`DELETE FROM symbol_events WHERE user_id = ${DEMO_USER_ID}`;
    await sql`DELETE FROM symbol_gravity WHERE user_id = ${DEMO_USER_ID}`;
    await sql`DELETE FROM gravity_history WHERE user_id = ${DEMO_USER_ID}`;
    await sql`DELETE FROM symbol_relationships WHERE user_id = ${DEMO_USER_ID}`;
    await sql`DELETE FROM dream_journal WHERE user_id = ${DEMO_USER_ID}`;
    await sql`DELETE FROM mood_logs WHERE user_id = ${DEMO_USER_ID}`;
    await sql`DELETE FROM life_events WHERE user_id = ${DEMO_USER_ID}`;
    await sql`DELETE FROM rituals WHERE moon_phase = 'demo'`;
    await sql`DELETE FROM readings WHERE spread_id = 'demo'`;

    // Insert symbol events
    const now = new Date();
    for (const event of DEMO_SYMBOL_EVENTS) {
      const eventDate = new Date(now);
      eventDate.setDate(eventDate.getDate() - event.daysBack);
      const dateStr = eventDate.toISOString();

      // Get visual/theme from archetype
      const archetypeRows =
        await sql`SELECT visual, theme FROM symbol_archetypes WHERE id = ${event.symbolId} LIMIT 1`;
      const archetype = archetypeRows[0] || { visual: "✨", theme: "" };

      await sql(
        `INSERT INTO symbol_events (user_id, source_type, source_id, symbol_id, symbol, stage, theme, visual, note, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          DEMO_USER_ID,
          event.sourceType,
          `demo-${event.daysBack}`,
          event.symbolId,
          event.symbol,
          event.stage,
          archetype.theme || event.symbol.toLowerCase(),
          archetype.visual || "✨",
          event.note,
          dateStr,
        ],
      );
    }

    // Build gravity from events
    const gravityMap = {};
    for (const event of DEMO_SYMBOL_EVENTS) {
      const key = event.symbol;
      if (!gravityMap[key]) {
        gravityMap[key] = {
          symbol: key,
          count: 0,
          weight: 0,
          symbolId: event.symbolId,
        };
      }
      // More recent events have more weight
      const recencyFactor = 1 + (84 - event.daysBack) / 84;
      gravityMap[key].count += 1;
      gravityMap[key].weight += recencyFactor;
    }

    for (const g of Object.values(gravityMap)) {
      const peakWeight = g.weight;
      const anchored = g.count >= 5;
      await sql(
        `INSERT INTO symbol_gravity (user_id, symbol, count, weight, peak_weight, anchored, source_types, first_seen, last_seen)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW() - INTERVAL '84 days', NOW())
         ON CONFLICT (user_id, symbol) DO UPDATE
         SET count = $3, weight = $4, peak_weight = $5, anchored = $6, last_seen = NOW()`,
        [
          DEMO_USER_ID,
          g.symbol,
          g.count,
          Math.round(g.weight * 100) / 100,
          Math.round(peakWeight * 100) / 100,
          anchored,
          JSON.stringify([
            "daily_draw",
            "tarot_reading",
            "mood_log",
            "dream",
            "life_event",
            "ritual",
          ]),
        ],
      );
    }

    // Build co-occurrence relationships
    const eventsByWeek = {};
    for (const event of DEMO_SYMBOL_EVENTS) {
      const weekKey = Math.floor(event.daysBack / 7);
      if (!eventsByWeek[weekKey]) eventsByWeek[weekKey] = new Set();
      eventsByWeek[weekKey].add(event.symbol);
    }

    const coOccurrences = {};
    for (const symbols of Object.values(eventsByWeek)) {
      const arr = Array.from(symbols);
      for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
          const key = [arr[i], arr[j]].sort().join("|");
          coOccurrences[key] = (coOccurrences[key] || 0) + 1;
        }
      }
    }

    for (const [key, count] of Object.entries(coOccurrences)) {
      if (count < 2) continue;
      const [a, b] = key.split("|");
      const strength = Math.min(count / 5, 1);
      await sql(
        `INSERT INTO symbol_relationships (user_id, symbol_a, symbol_b, relationship_type, strength, co_occurrence)
         VALUES ($1, $2, $3, 'co_occurs', $4, $5)
         ON CONFLICT (user_id, symbol_a, symbol_b) DO UPDATE
         SET strength = $4, co_occurrence = $5`,
        [DEMO_USER_ID, a, b, Math.round(strength * 10000) / 10000, count],
      );
    }

    // Insert some dream entries
    const dreams = [
      {
        daysBack: 78,
        title: "Flowing River",
        description: "A wide river carrying me forward, no resistance. Calm.",
        mood: "peaceful",
        lucidity: 2,
      },
      {
        daysBack: 64,
        title: "The Labyrinth",
        description:
          "Walls shifting, no exit visible. Heart racing but curious.",
        mood: "anxious",
        lucidity: 3,
      },
      {
        daysBack: 50,
        title: "Falling",
        description: "Falling endlessly. No bottom. No fear anymore.",
        mood: "surrendered",
        lucidity: 4,
      },
      {
        daysBack: 36,
        title: "Light in Darkness",
        description: "Dark corridor, a lantern appears floating. I follow it.",
        mood: "hopeful",
        lucidity: 3,
      },
      {
        daysBack: 20,
        title: "Finding North",
        description:
          "A compass spinning then settling. I know which way to go.",
        mood: "clear",
        lucidity: 5,
      },
      {
        daysBack: 8,
        title: "The Crown",
        description: "Placed on my head by no one. It was mine all along.",
        mood: "sovereign",
        lucidity: 4,
      },
    ];

    for (const dream of dreams) {
      const dreamDate = new Date(now);
      dreamDate.setDate(dreamDate.getDate() - dream.daysBack);
      await sql(
        `INSERT INTO dream_journal (user_id, title, description, dream_date, mood, lucidity, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          DEMO_USER_ID,
          dream.title,
          dream.description,
          dreamDate.toISOString().split("T")[0],
          dream.mood,
          dream.lucidity,
          dreamDate.toISOString(),
        ],
      );
    }

    // Insert mood logs
    const moods = [
      {
        daysBack: 80,
        before: "neutral",
        after: "energized",
        notes: "Passionate about new project",
      },
      {
        daysBack: 66,
        before: "hopeful",
        after: "uncertain",
        notes: "Feeling at a crossroads",
      },
      {
        daysBack: 54,
        before: "stable",
        after: "overwhelmed",
        notes: "Everything feels unstable",
      },
      {
        daysBack: 44,
        before: "struggling",
        after: "releasing",
        notes: "Shedding old identity",
      },
      {
        daysBack: 32,
        before: "turbulent",
        after: "settling",
        notes: "Finding balance again",
      },
      {
        daysBack: 18,
        before: "integrating",
        after: "clear",
        notes: "Quiet understanding",
      },
      {
        daysBack: 6,
        before: "clear",
        after: "luminous",
        notes: "Clear, open, light",
      },
    ];

    for (const mood of moods) {
      const moodDate = new Date(now);
      moodDate.setDate(moodDate.getDate() - mood.daysBack);
      await sql(
        `INSERT INTO mood_logs (user_id, mood_before, mood_after, notes, created_at)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          DEMO_USER_ID,
          mood.before,
          mood.after,
          mood.notes,
          moodDate.toISOString(),
        ],
      );
    }

    // Insert life events
    const lifeEvents = [
      {
        daysBack: 74,
        title: "Started long-term goal",
        description: "Committed to a challenging project that will take months",
        category: "career",
        intensity: 7,
      },
      {
        daysBack: 60,
        title: "Difficult feedback",
        description: "Received honest feedback that challenged my self-image",
        category: "personal",
        intensity: 8,
      },
      {
        daysBack: 48,
        title: "Conflict with friend",
        description: "Argument revealed unspoken tensions in the relationship",
        category: "relationship",
        intensity: 9,
      },
      {
        daysBack: 30,
        title: "The integration",
        description: "Finally making sense of what the breakdown was about",
        category: "personal",
        intensity: 6,
      },
      {
        daysBack: 14,
        title: "Reconciliation",
        description: "Reconnected with friend — deeper understanding emerged",
        category: "relationship",
        intensity: 8,
      },
      {
        daysBack: 2,
        title: "New opportunity",
        description:
          "An unexpected door opened — something I couldn't have seen before the crisis",
        category: "career",
        intensity: 7,
      },
    ];

    for (const le of lifeEvents) {
      const leDate = new Date(now);
      leDate.setDate(leDate.getDate() - le.daysBack);
      await sql(
        `INSERT INTO life_events (user_id, title, description, event_date, category, intensity, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          DEMO_USER_ID,
          le.title,
          le.description,
          leDate.toISOString().split("T")[0],
          le.category,
          le.intensity,
          leDate.toISOString(),
        ],
      );
    }

    return Response.json({
      success: true,
      message: "Demo journey seeded successfully",
      stats: {
        symbolEvents: DEMO_SYMBOL_EVENTS.length,
        dreams: dreams.length,
        moods: moods.length,
        lifeEvents: lifeEvents.length,
        gravityEntries: Object.keys(gravityMap).length,
        relationships: Object.keys(coOccurrences).filter(
          (k) => coOccurrences[k] >= 2,
        ).length,
      },
    });
  } catch (error) {
    console.error("Demo seed error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  // Check if demo data exists
  const events =
    await sql`SELECT COUNT(*) as cnt FROM symbol_events WHERE user_id = ${DEMO_USER_ID}`;
  const count = parseInt(events[0]?.cnt || "0");
  return Response.json({
    seeded: count > 0,
    eventCount: count,
    userId: DEMO_USER_ID,
  });
}
