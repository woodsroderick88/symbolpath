import sql from "@/app/api/utils/sql";

function generateCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from(
    { length: 6 },
    () => chars[Math.floor(Math.random() * chars.length)],
  ).join("");
}

export async function GET() {
  try {
    const groups = await sql`
      SELECT rg.*, COUNT(gm.id) AS member_count
      FROM reading_groups rg
      LEFT JOIN group_members gm ON gm.group_id = rg.id
      WHERE rg.is_private = false
      GROUP BY rg.id
      ORDER BY rg.created_at DESC
      LIMIT 30
    `;
    return Response.json(groups);
  } catch (error) {
    console.error("Error fetching groups:", error);
    return Response.json({ error: "Failed to fetch groups" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { name, description, created_by, is_private } = await request.json();
    if (!name)
      return Response.json({ error: "Name required" }, { status: 400 });

    let invite_code = generateCode();
    // ensure uniqueness
    let attempts = 0;
    while (attempts < 5) {
      const existing =
        await sql`SELECT id FROM reading_groups WHERE invite_code = ${invite_code}`;
      if (existing.length === 0) break;
      invite_code = generateCode();
      attempts++;
    }

    const result = await sql`
      INSERT INTO reading_groups (name, description, created_by, is_private, invite_code)
      VALUES (${name}, ${description || null}, ${created_by || "Anonymous"}, ${is_private ?? true}, ${invite_code})
      RETURNING *
    `;

    // Add creator as admin member
    await sql`
      INSERT INTO group_members (group_id, member_name, role)
      VALUES (${result[0].id}, ${created_by || "Anonymous"}, 'admin')
    `;

    return Response.json(result[0]);
  } catch (error) {
    console.error("Error creating group:", error);
    return Response.json({ error: "Failed to create group" }, { status: 500 });
  }
}
