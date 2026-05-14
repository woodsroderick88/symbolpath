export async function POST(request) {
  try {
    const { cardName, cardMeaning } = await request.json();

    if (!cardName) {
      return Response.json({ error: "Card name is required" }, { status: 400 });
    }

    const prompt = `Based on the tarot card "${cardName}" with the meaning: "${cardMeaning}", generate a short, powerful daily affirmation (1-2 sentences) that captures the positive energy and wisdom of this card. Make it personal and empowering.`;

    const response = await fetch(
      `${process.env.EXPO_PUBLIC_PROXY_BASE_URL || ""}/integrations/chat-gpt/conversationgpt4`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content:
                "You are a wise tarot reader. Respond with only the affirmation, nothing else.",
            },
            { role: "user", content: prompt },
          ],
          stream: false,
        }),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to generate affirmation");
    }

    const data = await response.json();
    const affirmation =
      data.choices?.[0]?.message?.content ||
      "I embrace the energy of this card and welcome its wisdom into my life.";

    return Response.json({ affirmation });
  } catch (error) {
    console.error("Error generating affirmation:", error);
    return Response.json({
      affirmation: "I am open to the messages the universe sends me today.",
    });
  }
}
