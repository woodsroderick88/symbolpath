import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    // Check if traditions already exist
    const existing =
      await sql`SELECT COUNT(*) as count FROM tradition_frameworks`;

    if (existing[0].count > 0) {
      return Response.json({
        message: "Traditions already seeded",
        count: existing[0].count,
      });
    }

    // Seed the traditions by calling the seed endpoint internally
    const seedResponse = await fetch(
      `${process.env.NEXT_PUBLIC_CREATE_APP_URL}/api/traditions/seed`,
      {
        method: "POST",
      },
    );

    const seedData = await seedResponse.json();

    return Response.json({
      success: true,
      message: "Traditions initialized successfully",
      data: seedData,
    });
  } catch (error) {
    console.error("Error initializing traditions:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
