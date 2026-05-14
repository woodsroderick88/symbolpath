import sql from "@/app/api/utils/sql";

export async function POST(request, { params }) {
  try {
    const { id } = params;
    const { seeker_name, message } = await request.json();

    if (!seeker_name)
      return Response.json({ error: "Name required" }, { status: 400 });

    const mentor = await sql`SELECT id FROM mentor_profiles WHERE id = ${id}`;
    if (!mentor[0])
      return Response.json({ error: "Mentor not found" }, { status: 404 });

    const result = await sql`
      INSERT INTO mentor_requests (mentor_id, seeker_name, message)
      VALUES (${id}, ${seeker_name}, ${message || null})
      RETURNING *
    `;
    return Response.json(result[0]);
  } catch (error) {
    console.error("Error creating request:", error);
    return Response.json({ error: "Failed to send request" }, { status: 500 });
  }
}

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const requests = await sql`
      SELECT * FROM mentor_requests WHERE mentor_id = ${id} ORDER BY created_at DESC
    `;
    return Response.json(requests);
  } catch (error) {
    console.error("Error fetching requests:", error);
    return Response.json(
      { error: "Failed to fetch requests" },
      { status: 500 },
    );
  }
}
