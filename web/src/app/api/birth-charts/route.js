import sql from "@/app/api/utils/sql";
import { getSunSign, getApproximateMoonSign } from "@/app/api/utils/astrology";

export async function GET(request) {
  try {
    const charts =
      await sql`SELECT * FROM birth_charts ORDER BY created_at DESC`;
    return Response.json({ charts });
  } catch (error) {
    console.error("Error fetching birth charts:", error);
    return Response.json(
      { error: "Failed to fetch birth charts" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { birth_date, birth_time, birth_location, notes } = body;

    if (!birth_date) {
      return Response.json(
        { error: "birth_date is required" },
        { status: 400 },
      );
    }

    // Calculate sun and moon signs
    const sunSign = getSunSign(birth_date);
    const moonSign = getApproximateMoonSign(birth_date);

    const result = await sql`
      INSERT INTO birth_charts (
        birth_date, birth_time, birth_location, 
        sun_sign, moon_sign, rising_sign, notes
      )
      VALUES (
        ${birth_date}, 
        ${birth_time || null}, 
        ${birth_location || null},
        ${sunSign.name},
        ${moonSign.name},
        ${null},
        ${notes || null}
      )
      RETURNING *
    `;

    return Response.json({ chart: result[0] }, { status: 201 });
  } catch (error) {
    console.error("Error creating birth chart:", error);
    return Response.json(
      { error: "Failed to create birth chart" },
      { status: 500 },
    );
  }
}
