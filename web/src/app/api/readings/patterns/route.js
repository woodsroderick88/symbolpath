import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "100");

    const readings = await sql`
      SELECT id, spread_id, spread_name, cards, ai_narrative, created_at
      FROM readings
      ORDER BY created_at DESC
      LIMIT ${limit}
    `;

    if (readings.length < 3) {
      return Response.json({
        totalReadings: readings.length,
        needsMore: true,
        message: "Complete at least 3 readings to see patterns.",
        patterns: null,
      });
    }

    // ── Analyze card frequency ──
    const cardCounts = {};
    const suitCounts = { cups: 0, wands: 0, swords: 0, pentacles: 0, major: 0 };
    const reversalCount = { total: 0, reversed: 0 };
    const spreadCounts = {};
    const positionCards = {}; // position -> card appearances
    const weekdayCounts = [0, 0, 0, 0, 0, 0, 0];

    for (const reading of readings) {
      // Spread frequency
      spreadCounts[reading.spread_name] =
        (spreadCounts[reading.spread_name] || 0) + 1;

      // Day of week
      const dow = new Date(reading.created_at).getDay();
      weekdayCounts[dow]++;

      const cards = Array.isArray(reading.cards) ? reading.cards : [];
      for (const entry of cards) {
        const cardId =
          entry?.card?.id ||
          entry?.id ||
          (typeof entry === "string" ? entry : null);
        const cardName =
          entry?.card?.name || entry?.name || cardId || "Unknown";
        const isReversed = entry?.isReversed || false;
        const position = entry?.position || "Unknown";

        if (cardId) {
          cardCounts[cardName] = (cardCounts[cardName] || 0) + 1;

          // Suit
          if (cardId.includes("cups")) suitCounts.cups++;
          else if (cardId.includes("wands")) suitCounts.wands++;
          else if (cardId.includes("swords")) suitCounts.swords++;
          else if (cardId.includes("pentacles")) suitCounts.pentacles++;
          else suitCounts.major++;

          // Reversals
          reversalCount.total++;
          if (isReversed) reversalCount.reversed++;

          // Position patterns
          if (!positionCards[position]) positionCards[position] = {};
          positionCards[position][cardName] =
            (positionCards[position][cardName] || 0) + 1;
        }
      }
    }

    // ── Sort and rank ──
    const topCards = Object.entries(cardCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({
        name,
        count,
        percentage: Math.round((count / readings.length) * 100),
      }));

    const dominantSuit = Object.entries(suitCounts).sort(
      (a, b) => b[1] - a[1],
    )[0];
    const suitTotal = Object.values(suitCounts).reduce((a, b) => a + b, 0);

    // ── Themes based on dominant suit ──
    const SUIT_THEMES = {
      cups: {
        theme: "Emotional & Relational",
        emoji: "💧",
        insight:
          "Your readings center around emotions, relationships, and intuition. The universe is asking you to explore your inner world.",
      },
      wands: {
        theme: "Creative & Passionate",
        emoji: "🔥",
        insight:
          "Your readings reveal themes of ambition, creativity, and spiritual growth. The fire within is calling for expression.",
      },
      swords: {
        theme: "Mental & Analytical",
        emoji: "⚔️",
        insight:
          "Your readings are dominated by intellectual challenges, communication, and truth-seeking. Clarity is your path.",
      },
      pentacles: {
        theme: "Material & Grounded",
        emoji: "🪙",
        insight:
          "Your readings focus on practical matters, finances, and the physical world. Building foundations is your journey.",
      },
      major: {
        theme: "Karmic & Transformative",
        emoji: "✨",
        insight:
          "Major Arcana dominates your readings — you're going through significant life lessons and spiritual evolution.",
      },
    };

    const dominantTheme = SUIT_THEMES[dominantSuit[0]] || SUIT_THEMES.major;

    // ── Favorite spreads ──
    const favoriteSpread = Object.entries(spreadCounts).sort(
      (a, b) => b[1] - a[1],
    )[0];

    // ── Day of week preference ──
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const favoriteDay =
      dayNames[weekdayCounts.indexOf(Math.max(...weekdayCounts))];

    // ── Position-specific recurring cards ──
    const recurringInPositions = [];
    for (const [position, cards] of Object.entries(positionCards)) {
      const topCard = Object.entries(cards).sort((a, b) => b[1] - a[1])[0];
      if (topCard && topCard[1] >= 2) {
        recurringInPositions.push({
          position,
          card: topCard[0],
          count: topCard[1],
        });
      }
    }

    // ── Reading streak data (last 30 days) ──
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentReadings = readings.filter(
      (r) => new Date(r.created_at) >= thirtyDaysAgo,
    );
    const recentDays = new Set(
      recentReadings.map(
        (r) => new Date(r.created_at).toISOString().split("T")[0],
      ),
    );

    return Response.json({
      totalReadings: readings.length,
      needsMore: false,
      patterns: {
        topCards,
        dominantSuit: {
          suit: dominantSuit[0],
          count: dominantSuit[1],
          percentage: Math.round((dominantSuit[1] / suitTotal) * 100),
          ...dominantTheme,
        },
        suitBreakdown: Object.entries(suitCounts).map(([suit, count]) => ({
          suit,
          count,
          percentage: Math.round((count / suitTotal) * 100),
        })),
        reversals: {
          total: reversalCount.total,
          reversed: reversalCount.reversed,
          percentage:
            reversalCount.total > 0
              ? Math.round((reversalCount.reversed / reversalCount.total) * 100)
              : 0,
        },
        favoriteSpread: favoriteSpread
          ? { name: favoriteSpread[0], count: favoriteSpread[1] }
          : null,
        favoriteDay,
        recurringInPositions: recurringInPositions.slice(0, 5),
        recentActivity: {
          last30Days: recentReadings.length,
          activeDays: recentDays.size,
        },
      },
    });
  } catch (error) {
    console.error("Error analyzing patterns:", error);
    return Response.json(
      { error: "Failed to analyze patterns" },
      { status: 500 },
    );
  }
}
