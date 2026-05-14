import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get("filter"); // 'mentors' | 'seeking' | 'all'

    let mentors;
    if (filter === "mentors") {
      mentors =
        await sql`SELECT * FROM mentor_profiles WHERE is_mentor = true ORDER BY created_at DESC`;
    } else if (filter === "seeking") {
      mentors =
        await sql`SELECT * FROM mentor_profiles WHERE is_seeking = true ORDER BY created_at DESC`;
    } else {
      mentors =
        await sql`SELECT * FROM mentor_profiles ORDER BY created_at DESC LIMIT 50`;
    }

    return Response.json(mentors);
  } catch (error) {
    console.error("Error fetching mentors:", error);
    return Response.json({ error: "Failed to fetch mentors" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const {
      display_name,
      bio,
      experience_level,
      specialties,
      is_mentor,
      is_seeking,
      contact_hint,
    } = await request.json();

    if (!display_name)
      return Response.json({ error: "Display name required" }, { status: 400 });

    const result = await sql`
      INSERT INTO mentor_profiles (display_name, bio, experience_level, specialties, is_mentor, is_seeking, contact_hint)
      VALUES (
        ${display_name},
        ${bio || null},
        ${experience_level || "intermediate"},
        ${JSON.stringify(specialties || [])},
        ${is_mentor ?? false},
        ${is_seeking ?? false},
        ${contact_hint || null}
      )
      RETURNING *
    `;
    return Response.json(result[0]);
  } catch (error) {
    console.error("Error creating profile:", error);
    return Response.json(
      { error: "Failed to create profile" },
      { status: 500 },
    );
  }
}
