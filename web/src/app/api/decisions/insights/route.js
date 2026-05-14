import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request) {
  try {
    const session = await auth();
    const userId = session?.user?.id?.toString() || "anonymous";

    const rows =
      await sql`SELECT * FROM decisions WHERE user_id = ${userId} ORDER BY created_at DESC`;

    const total = rows.length;
    const aligned = rows.filter((d) => d.defense === "None").length;
    const distorted = total - aligned;

    const emotionCount = {};
    rows.forEach((d) => {
      emotionCount[d.emotion] = (emotionCount[d.emotion] || 0) + 1;
    });
    const topEmotion =
      Object.keys(emotionCount).sort(
        (a, b) => emotionCount[b] - emotionCount[a],
      )[0] || null;

    const defenseCount = {};
    rows.forEach((d) => {
      if (d.defense !== "None")
        defenseCount[d.defense] = (defenseCount[d.defense] || 0) + 1;
    });
    const topDefense =
      Object.keys(defenseCount).sort(
        (a, b) => defenseCount[b] - defenseCount[a],
      )[0] || null;

    const consequenceCount = {};
    rows.forEach((d) => {
      consequenceCount[d.consequence] =
        (consequenceCount[d.consequence] || 0) + 1;
    });

    const tarotCount = {};
    rows.forEach((d) => {
      if (d.tarot_card_name)
        tarotCount[d.tarot_card_name] =
          (tarotCount[d.tarot_card_name] || 0) + 1;
    });
    const topTarotCard =
      Object.keys(tarotCount).sort(
        (a, b) => tarotCount[b] - tarotCount[a],
      )[0] || null;

    const days = {};
    rows.forEach((d) => {
      days[new Date(d.created_at).toDateString()] = true;
    });
    let streak = 0;
    const d = new Date();
    while (days[d.toDateString()]) {
      streak++;
      d.setDate(d.getDate() - 1);
    }

    return Response.json({
      total,
      aligned,
      distorted,
      streak,
      topEmotion,
      topDefense,
      topTarotCard,
      emotionCount,
      defenseCount,
      consequenceCount,
    });
  } catch (error) {
    console.error("Error computing insights:", error);
    return Response.json(
      { error: "Failed to compute insights" },
      { status: 500 },
    );
  }
}
