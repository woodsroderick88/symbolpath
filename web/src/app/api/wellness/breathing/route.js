export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const cardName = searchParams.get("cardName") || "";

    const stressCards = [
      "The Tower",
      "Ten of Swords",
      "Nine of Swords",
      "Five of Pentacles",
      "Three of Swords",
      "The Devil",
      "Death",
      "Five of Cups",
    ];

    const isStressCard = stressCards.some((card) =>
      cardName.toLowerCase().includes(card.toLowerCase()),
    );

    let exercise;
    if (isStressCard) {
      exercise = {
        name: "Calming Breath",
        duration: 240,
        pattern: [
          { phase: "inhale", duration: 4, instruction: "Breathe in slowly" },
          { phase: "hold", duration: 4, instruction: "Hold gently" },
          { phase: "exhale", duration: 6, instruction: "Release slowly" },
          { phase: "hold", duration: 2, instruction: "Pause" },
        ],
        description:
          "This extended exhale activates your parasympathetic nervous system, promoting calm and grounding.",
      };
    } else {
      exercise = {
        name: "Balanced Breath",
        duration: 180,
        pattern: [
          { phase: "inhale", duration: 4, instruction: "Breathe in" },
          { phase: "hold", duration: 4, instruction: "Hold" },
          { phase: "exhale", duration: 4, instruction: "Breathe out" },
          { phase: "hold", duration: 4, instruction: "Hold" },
        ],
        description:
          "Box breathing creates balance and focus, centering your energy.",
      };
    }

    return Response.json(exercise);
  } catch (error) {
    console.error("Error generating breathing exercise:", error);
    return Response.json(
      { error: "Failed to generate exercise" },
      { status: 500 },
    );
  }
}
