import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || "anonymous";

    let stats = await sql`
      SELECT * FROM user_stats WHERE user_id = ${userId}
    `;

    if (stats.length === 0) {
      const result = await sql`
        INSERT INTO user_stats (user_id, daily_streak, total_readings, total_journal_entries, badges)
        VALUES (${userId}, 0, 0, 0, '[]')
        RETURNING *
      `;
      stats = result;
    }

    return Response.json(stats[0]);
  } catch (error) {
    console.error("Error fetching stats:", error);
    return Response.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { userId, action } = await request.json();
    const uid = userId || "anonymous";
    const today = new Date().toISOString().split("T")[0];

    let stats = await sql`SELECT * FROM user_stats WHERE user_id = ${uid}`;

    if (stats.length === 0) {
      stats = await sql`
        INSERT INTO user_stats (user_id, daily_streak, total_readings, total_journal_entries, badges, last_activity_date)
        VALUES (${uid}, 0, 0, 0, '[]', ${today})
        RETURNING *
      `;
    } else {
      stats = stats;
    }

    const currentStats = stats[0];
    const lastActivity = currentStats.last_activity_date;
    const lastDate = lastActivity
      ? new Date(lastActivity).toISOString().split("T")[0]
      : null;

    let newStreak = currentStats.daily_streak;
    if (lastDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];

      if (lastDate === yesterdayStr) {
        newStreak += 1;
      } else if (lastDate !== today) {
        newStreak = 1;
      }
    }

    let updateQuery = "";
    let values = [];

    if (action === "reading") {
      const result = await sql`
        UPDATE user_stats
        SET total_readings = total_readings + 1,
            daily_streak = ${newStreak},
            last_activity_date = ${today}
        WHERE user_id = ${uid}
        RETURNING *
      `;
      return Response.json(result[0]);
    } else if (action === "journal") {
      const result = await sql`
        UPDATE user_stats
        SET total_journal_entries = total_journal_entries + 1,
            daily_streak = ${newStreak},
            last_activity_date = ${today}
        WHERE user_id = ${uid}
        RETURNING *
      `;
      return Response.json(result[0]);
    }

    return Response.json(currentStats);
  } catch (error) {
    console.error("Error updating stats:", error);
    return Response.json({ error: "Failed to update stats" }, { status: 500 });
  }
}
