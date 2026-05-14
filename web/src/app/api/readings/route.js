import sql from "@/app/api/utils/sql";
import { emitSymbolEvent } from "@/app/api/symbolpath/engine/route";
import { auth } from "@/auth";

export async function GET() {
  try {
    const rows = await sql`
      SELECT id, spread_id, spread_name, cards, ai_narrative, notes, created_at
      FROM readings
      ORDER BY created_at DESC
      LIMIT 100
    `;
    return Response.json(rows);
  } catch (err) {
    console.error(err);
    return Response.json(
      { error: "Failed to fetch readings" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    const userId = session?.user?.id?.toString() || "anonymous";

    const body = await request.json();
    const { spread_id, spread_name, cards, ai_narrative, notes, source_type } =
      body;

    if (!spread_id || !spread_name || !cards) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const [row] = await sql`
      INSERT INTO readings (spread_id, spread_name, cards, ai_narrative, notes)
      VALUES (${spread_id}, ${spread_name}, ${JSON.stringify(cards)}, ${ai_narrative || null}, ${notes || null})
      RETURNING *
    `;

    const today = new Date().toISOString().split("T")[0];
    const statsCheck =
      await sql`SELECT * FROM user_stats WHERE user_id = ${userId}`;

    if (statsCheck.length === 0) {
      await sql`
        INSERT INTO user_stats (user_id, daily_streak, total_readings, total_journal_entries, badges, last_activity_date)
        VALUES (${userId}, 1, 1, 0, '[]', ${today})
      `;
    } else {
      const currentStats = statsCheck[0];
      const lastDate = currentStats.last_activity_date
        ? new Date(currentStats.last_activity_date).toISOString().split("T")[0]
        : null;
      let newStreak = currentStats.daily_streak;
      if (lastDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split("T")[0];
        if (lastDate === yesterdayStr) newStreak += 1;
        else if (lastDate !== today) newStreak = 1;
      }
      await sql`
        UPDATE user_stats
        SET total_readings = total_readings + 1, daily_streak = ${newStreak}, last_activity_date = ${today}
        WHERE user_id = ${userId}
      `;
    }

    const cardArray = Array.isArray(cards) ? cards : [];
    for (const card of cardArray) {
      const cardName = typeof card === "string" ? card : card.name || card.card;
      if (cardName) {
        const existing =
          await sql`SELECT * FROM card_mastery WHERE user_id = ${userId} AND card_name = ${cardName}`;
        if (existing.length > 0) {
          const newCount = existing[0].appearance_count + 1;
          const newLevel = Math.floor(newCount / 5) + 1;
          await sql`UPDATE card_mastery SET appearance_count = ${newCount}, mastery_level = ${newLevel}, updated_at = NOW() WHERE user_id = ${userId} AND card_name = ${cardName}`;
        } else {
          await sql`INSERT INTO card_mastery (user_id, card_name, appearance_count, mastery_level) VALUES (${userId}, ${cardName}, 1, 1)`;
        }
      }
    }

    // ── Auto-emit symbol events for ALL cards in the spread ──
    const emitSourceType = source_type || "tarot_reading";
    const readingId = String(row.id);

    for (let i = 0; i < cardArray.length; i++) {
      const card = cardArray[i];
      const cardId =
        typeof card === "string" ? card : card?.card?.id || card?.id;
      if (cardId) {
        emitSymbolEvent({
          userId,
          sourceType: emitSourceType,
          sourceId: `${readingId}-${i}`,
          cardId,
        }).catch(() => {});
      }
    }

    // If no cards matched (edge case), still try narrative keywords
    if (cardArray.length === 0 && ai_narrative) {
      emitSymbolEvent({
        userId,
        sourceType: emitSourceType,
        sourceId: readingId,
        moodText: ai_narrative,
      }).catch(() => {});
    }

    return Response.json(row, { status: 201 });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Failed to save reading" }, { status: 500 });
  }
}
