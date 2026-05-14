import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    // Get tradition IDs
    const traditions = await sql`
      SELECT id, slug FROM tradition_frameworks
    `;

    const traditionMap = {};
    traditions.forEach((t) => (traditionMap[t.slug] = t.id));

    // Symbol mappings for each tradition
    const mappings = [
      // Ubuntu Relational Pulse
      {
        symbol_id: 1,
        tradition: "ubuntu",
        stage_key: "Umuntu",
        reasoning: "Seed represents individual potential and self-identity",
      },
      {
        symbol_id: 2,
        tradition: "ubuntu",
        stage_key: "Umuntu",
        reasoning: "Dawn is personal awakening and self-awareness",
      },
      {
        symbol_id: 3,
        tradition: "ubuntu",
        stage_key: "Umuntu",
        reasoning: "Key unlocks individual discovery and agency",
      },
      {
        symbol_id: 4,
        tradition: "ubuntu",
        stage_key: "Umuntu",
        reasoning: "Egg is the self in incubation, preparing to emerge",
      },
      {
        symbol_id: 14,
        tradition: "ubuntu",
        stage_key: "Umuntu",
        reasoning: "Mirror is self-reflection and individual awareness",
      },
      {
        symbol_id: 18,
        tradition: "ubuntu",
        stage_key: "Umuntu",
        reasoning: "Lantern guides personal path and inner clarity",
      },

      {
        symbol_id: 8,
        tradition: "ubuntu",
        stage_key: "Ubudlelwano",
        reasoning: "Bridge connects two beings in relationship",
      },
      {
        symbol_id: 6,
        tradition: "ubuntu",
        stage_key: "Ubudlelwano",
        reasoning: "River flows between and nourishes connections",
      },
      {
        symbol_id: 16,
        tradition: "ubuntu",
        stage_key: "Ubudlelwano",
        reasoning: "Loom weaves together intimate bonds",
      },
      {
        symbol_id: 17,
        tradition: "ubuntu",
        stage_key: "Ubudlelwano",
        reasoning: "Scale balances give and take in relationships",
      },
      {
        symbol_id: 13,
        tradition: "ubuntu",
        stage_key: "Ubudlelwano",
        reasoning: "Serpent transforms through relational tension",
      },

      {
        symbol_id: 5,
        tradition: "ubuntu",
        stage_key: "Umphakathi",
        reasoning: "Tree roots community and provides collective shelter",
      },
      {
        symbol_id: 9,
        tradition: "ubuntu",
        stage_key: "Umphakathi",
        reasoning: "Mountain represents collective aspirations",
      },
      {
        symbol_id: 11,
        tradition: "ubuntu",
        stage_key: "Umphakathi",
        reasoning: "Tower is community structure, for better or worse",
      },
      {
        symbol_id: 7,
        tradition: "ubuntu",
        stage_key: "Umphakathi",
        reasoning: "Flame spreads passion through community",
      },
      {
        symbol_id: 19,
        tradition: "ubuntu",
        stage_key: "Umphakathi",
        reasoning: "Compass orients collective direction",
      },

      {
        symbol_id: 22,
        tradition: "ubuntu",
        stage_key: "Ubuntu",
        reasoning: "Star is universal light - all are one",
      },
      {
        symbol_id: 23,
        tradition: "ubuntu",
        stage_key: "Ubuntu",
        reasoning: "Chalice holds the oneness of being",
      },
      {
        symbol_id: 24,
        tradition: "ubuntu",
        stage_key: "Ubuntu",
        reasoning: "Ouroboros is eternal interconnection",
      },
      {
        symbol_id: 21,
        tradition: "ubuntu",
        stage_key: "Ubuntu",
        reasoning:
          "Phoenix transcends individual death into collective rebirth",
      },
      {
        symbol_id: 20,
        tradition: "ubuntu",
        stage_key: "Ubuntu",
        reasoning: "Crown acknowledges sovereignty exists through others",
      },
      {
        symbol_id: 10,
        tradition: "ubuntu",
        stage_key: "Ubuntu",
        reasoning: "Storm reminds all are affected by the whole",
      },
      {
        symbol_id: 12,
        tradition: "ubuntu",
        stage_key: "Umphakathi",
        reasoning: "Labyrinth is the communal journey of confusion",
      },
      {
        symbol_id: 15,
        tradition: "ubuntu",
        stage_key: "Ubuntu",
        reasoning: "Abyss reveals the void where separation ends",
      },

      // Medicine Wheel
      {
        symbol_id: 2,
        tradition: "medicine_wheel",
        stage_key: "East",
        reasoning: "Dawn is the Eastern spring energy of new beginnings",
      },
      {
        symbol_id: 3,
        tradition: "medicine_wheel",
        stage_key: "East",
        reasoning: "Key unlocks mental clarity and new awareness",
      },
      {
        symbol_id: 1,
        tradition: "medicine_wheel",
        stage_key: "East",
        reasoning: "Seed sprouts in spring with fresh potential",
      },
      {
        symbol_id: 4,
        tradition: "medicine_wheel",
        stage_key: "East",
        reasoning: "Egg hatches with spring dawn light",
      },
      {
        symbol_id: 18,
        tradition: "medicine_wheel",
        stage_key: "East",
        reasoning: "Lantern illuminates mental pathways",
      },
      {
        symbol_id: 19,
        tradition: "medicine_wheel",
        stage_key: "East",
        reasoning: "Compass provides directional mental orientation",
      },

      {
        symbol_id: 7,
        tradition: "medicine_wheel",
        stage_key: "South",
        reasoning: "Flame is summer heat and emotional passion",
      },
      {
        symbol_id: 6,
        tradition: "medicine_wheel",
        stage_key: "South",
        reasoning: "River flows with emotional depth",
      },
      {
        symbol_id: 10,
        tradition: "medicine_wheel",
        stage_key: "South",
        reasoning: "Storm is emotional turbulence and summer rains",
      },
      {
        symbol_id: 13,
        tradition: "medicine_wheel",
        stage_key: "South",
        reasoning: "Serpent sheds skin with emotional transformation",
      },
      {
        symbol_id: 14,
        tradition: "medicine_wheel",
        stage_key: "South",
        reasoning: "Mirror reflects emotional truth",
      },
      {
        symbol_id: 15,
        tradition: "medicine_wheel",
        stage_key: "South",
        reasoning: "Abyss is the emotional void and depth",
      },

      {
        symbol_id: 5,
        tradition: "medicine_wheel",
        stage_key: "West",
        reasoning: "Tree harvests growth into physical form",
      },
      {
        symbol_id: 9,
        tradition: "medicine_wheel",
        stage_key: "West",
        reasoning: "Mountain is solid physical embodiment",
      },
      {
        symbol_id: 8,
        tradition: "medicine_wheel",
        stage_key: "West",
        reasoning: "Bridge is physical structure and autumn transition",
      },
      {
        symbol_id: 16,
        tradition: "medicine_wheel",
        stage_key: "West",
        reasoning: "Loom weaves harvest into tangible results",
      },
      {
        symbol_id: 17,
        tradition: "medicine_wheel",
        stage_key: "West",
        reasoning: "Scale measures the physical harvest",
      },
      {
        symbol_id: 11,
        tradition: "medicine_wheel",
        stage_key: "West",
        reasoning: "Tower stands as physical structure facing collapse",
      },

      {
        symbol_id: 22,
        tradition: "medicine_wheel",
        stage_key: "North",
        reasoning: "Star shines in winter night with spiritual wisdom",
      },
      {
        symbol_id: 21,
        tradition: "medicine_wheel",
        stage_key: "North",
        reasoning: "Phoenix embodies spiritual rebirth in stillness",
      },
      {
        symbol_id: 23,
        tradition: "medicine_wheel",
        stage_key: "North",
        reasoning: "Chalice holds winter spiritual nourishment",
      },
      {
        symbol_id: 24,
        tradition: "medicine_wheel",
        stage_key: "North",
        reasoning: "Ouroboros cycles through eternal spiritual return",
      },
      {
        symbol_id: 20,
        tradition: "medicine_wheel",
        stage_key: "North",
        reasoning: "Crown represents spiritual sovereignty and wisdom",
      },
      {
        symbol_id: 12,
        tradition: "medicine_wheel",
        stage_key: "North",
        reasoning: "Labyrinth is the spiritual quest through winter darkness",
      },

      // Neidan Progression
      {
        symbol_id: 1,
        tradition: "neidan",
        stage_key: "Jing",
        reasoning: "Seed is pure essence and foundational potential",
      },
      {
        symbol_id: 4,
        tradition: "neidan",
        stage_key: "Jing",
        reasoning: "Egg holds primal life force in concentrated form",
      },
      {
        symbol_id: 5,
        tradition: "neidan",
        stage_key: "Jing",
        reasoning: "Tree roots deep into earth essence",
      },
      {
        symbol_id: 9,
        tradition: "neidan",
        stage_key: "Jing",
        reasoning: "Mountain is solid foundational essence",
      },
      {
        symbol_id: 7,
        tradition: "neidan",
        stage_key: "Jing",
        reasoning: "Flame burns with raw elemental essence",
      },

      {
        symbol_id: 6,
        tradition: "neidan",
        stage_key: "Qi",
        reasoning: "River is flowing vital energy and breath",
      },
      {
        symbol_id: 8,
        tradition: "neidan",
        stage_key: "Qi",
        reasoning: "Bridge channels energy between states",
      },
      {
        symbol_id: 10,
        tradition: "neidan",
        stage_key: "Qi",
        reasoning: "Storm is turbulent qi seeking balance",
      },
      {
        symbol_id: 13,
        tradition: "neidan",
        stage_key: "Qi",
        reasoning: "Serpent coils kundalini energy up the spine",
      },
      {
        symbol_id: 12,
        tradition: "neidan",
        stage_key: "Qi",
        reasoning: "Labyrinth circulates energy through complex pathways",
      },
      {
        symbol_id: 2,
        tradition: "neidan",
        stage_key: "Qi",
        reasoning: "Dawn awakens and activates vital qi",
      },

      {
        symbol_id: 14,
        tradition: "neidan",
        stage_key: "Shen",
        reasoning: "Mirror reflects luminous spirit consciousness",
      },
      {
        symbol_id: 18,
        tradition: "neidan",
        stage_key: "Shen",
        reasoning: "Lantern illuminates with spirit light",
      },
      {
        symbol_id: 19,
        tradition: "neidan",
        stage_key: "Shen",
        reasoning: "Compass orients spirit toward truth",
      },
      {
        symbol_id: 17,
        tradition: "neidan",
        stage_key: "Shen",
        reasoning: "Scale balances refined spiritual awareness",
      },
      {
        symbol_id: 16,
        tradition: "neidan",
        stage_key: "Shen",
        reasoning: "Loom weaves spirit into conscious patterns",
      },
      {
        symbol_id: 3,
        tradition: "neidan",
        stage_key: "Shen",
        reasoning: "Key unlocks spiritual wisdom",
      },

      {
        symbol_id: 21,
        tradition: "neidan",
        stage_key: "Xu",
        reasoning: "Phoenix burns into void and returns from emptiness",
      },
      {
        symbol_id: 22,
        tradition: "neidan",
        stage_key: "Xu",
        reasoning: "Star exists in vast void of space",
      },
      {
        symbol_id: 23,
        tradition: "neidan",
        stage_key: "Xu",
        reasoning: "Chalice empties to hold the void",
      },
      {
        symbol_id: 24,
        tradition: "neidan",
        stage_key: "Xu",
        reasoning: "Ouroboros dissolves all into eternal return",
      },
      {
        symbol_id: 20,
        tradition: "neidan",
        stage_key: "Xu",
        reasoning: "Crown transcends form into formless mastery",
      },
      {
        symbol_id: 15,
        tradition: "neidan",
        stage_key: "Xu",
        reasoning: "Abyss is the void itself",
      },

      // Sufi Nafs Ladder
      {
        symbol_id: 7,
        tradition: "sufi_nafs",
        stage_key: "Ammara",
        reasoning: "Flame burns with ego desire and passion",
      },
      {
        symbol_id: 11,
        tradition: "sufi_nafs",
        stage_key: "Ammara",
        reasoning: "Tower is ego structure commanding reality",
      },
      {
        symbol_id: 10,
        tradition: "sufi_nafs",
        stage_key: "Ammara",
        reasoning: "Storm is the commanding self in upheaval",
      },

      {
        symbol_id: 14,
        tradition: "sufi_nafs",
        stage_key: "Lawwama",
        reasoning: "Mirror shows the self-accusing conscience awakening",
      },
      {
        symbol_id: 15,
        tradition: "sufi_nafs",
        stage_key: "Lawwama",
        reasoning: "Abyss is the guilt and self-questioning void",
      },
      {
        symbol_id: 13,
        tradition: "sufi_nafs",
        stage_key: "Lawwama",
        reasoning: "Serpent transforms through self-awareness",
      },
      {
        symbol_id: 12,
        tradition: "sufi_nafs",
        stage_key: "Lawwama",
        reasoning: "Labyrinth is confusion seeking redemption",
      },

      {
        symbol_id: 2,
        tradition: "sufi_nafs",
        stage_key: "Mulhima",
        reasoning: "Dawn brings divine inspiration and light",
      },
      {
        symbol_id: 3,
        tradition: "sufi_nafs",
        stage_key: "Mulhima",
        reasoning: "Key unlocks inspired divine guidance",
      },
      {
        symbol_id: 18,
        tradition: "sufi_nafs",
        stage_key: "Mulhima",
        reasoning: "Lantern is divine light guiding the soul",
      },
      {
        symbol_id: 19,
        tradition: "sufi_nafs",
        stage_key: "Mulhima",
        reasoning: "Compass orients toward divine direction",
      },
      {
        symbol_id: 1,
        tradition: "sufi_nafs",
        stage_key: "Mulhima",
        reasoning: "Seed receives divine inspiration to grow",
      },

      {
        symbol_id: 6,
        tradition: "sufi_nafs",
        stage_key: "Mutmainna",
        reasoning: "River flows in tranquil surrender to divine will",
      },
      {
        symbol_id: 17,
        tradition: "sufi_nafs",
        stage_key: "Mutmainna",
        reasoning: "Scale finds peace in divine balance",
      },
      {
        symbol_id: 16,
        tradition: "sufi_nafs",
        stage_key: "Mutmainna",
        reasoning: "Loom weaves with tranquil divine patience",
      },
      {
        symbol_id: 4,
        tradition: "sufi_nafs",
        stage_key: "Mutmainna",
        reasoning: "Egg rests in peaceful incubation",
      },

      {
        symbol_id: 5,
        tradition: "sufi_nafs",
        stage_key: "Radiya",
        reasoning: "Tree is content, rooted in divine pleasure",
      },
      {
        symbol_id: 8,
        tradition: "sufi_nafs",
        stage_key: "Radiya",
        reasoning: "Bridge accepts the path with divine contentment",
      },
      {
        symbol_id: 9,
        tradition: "sufi_nafs",
        stage_key: "Radiya",
        reasoning: "Mountain stands pleased with divine trials",
      },

      {
        symbol_id: 23,
        tradition: "sufi_nafs",
        stage_key: "Mardiyya",
        reasoning: "Chalice is beloved vessel of divine love",
      },
      {
        symbol_id: 20,
        tradition: "sufi_nafs",
        stage_key: "Mardiyya",
        reasoning: "Crown is beloved by the Divine King",
      },

      {
        symbol_id: 22,
        tradition: "sufi_nafs",
        stage_key: "Safiyya",
        reasoning: "Star is pure light annihilated in divine radiance",
      },
      {
        symbol_id: 21,
        tradition: "sufi_nafs",
        stage_key: "Safiyya",
        reasoning: "Phoenix dies completely into divine love",
      },
      {
        symbol_id: 24,
        tradition: "sufi_nafs",
        stage_key: "Safiyya",
        reasoning: "Ouroboros is the pure eternal cycle in God",
      },
    ];

    // Clear existing mappings
    await sql`DELETE FROM symbol_tradition_map`;

    // Insert new mappings
    for (const mapping of mappings) {
      await sql`
        INSERT INTO symbol_tradition_map (symbol_id, tradition_id, stage_key, reasoning)
        VALUES (
          ${mapping.symbol_id},
          ${traditionMap[mapping.tradition]},
          ${mapping.stage_key},
          ${mapping.reasoning}
        )
      `;
    }

    return Response.json({
      success: true,
      message: "Seeded symbol-tradition mappings",
      count: mappings.length,
    });
  } catch (error) {
    console.error("Error seeding tradition mappings:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
