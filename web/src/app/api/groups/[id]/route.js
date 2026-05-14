import sql from "@/app/api/utils/sql";

export async function GET(request, { params }) {
  try {
    const { id } = params;

    // Support lookup by invite code OR numeric id
    let group;
    if (isNaN(id)) {
      group =
        await sql`SELECT * FROM reading_groups WHERE invite_code = ${id.toUpperCase()}`;
    } else {
      group = await sql`SELECT * FROM reading_groups WHERE id = ${id}`;
    }

    if (!group[0])
      return Response.json({ error: "Group not found" }, { status: 404 });

    const members = await sql`
      SELECT * FROM group_members WHERE group_id = ${group[0].id} ORDER BY joined_at ASC
    `;

    return Response.json({ ...group[0], members });
  } catch (error) {
    console.error("Error fetching group:", error);
    return Response.json({ error: "Failed to fetch group" }, { status: 500 });
  }
}

// Join group by invite code
export async function POST(request, { params }) {
  try {
    const { id } = params;
    const { member_name, invite_code } = await request.json();

    const group = await sql`SELECT * FROM reading_groups WHERE id = ${id}`;
    if (!group[0])
      return Response.json({ error: "Group not found" }, { status: 404 });

    if (
      group[0].is_private &&
      group[0].invite_code !== invite_code?.toUpperCase()
    ) {
      return Response.json({ error: "Invalid invite code" }, { status: 403 });
    }

    // Check if already a member
    const existing = await sql`
      SELECT id FROM group_members WHERE group_id = ${id} AND member_name = ${member_name || "Anonymous"}
    `;
    if (existing.length > 0)
      return Response.json({ already_member: true, ...group[0] });

    await sql`
      INSERT INTO group_members (group_id, member_name, role) VALUES (${id}, ${member_name || "Anonymous"}, 'member')
    `;

    return Response.json({ joined: true, ...group[0] });
  } catch (error) {
    console.error("Error joining group:", error);
    return Response.json({ error: "Failed to join group" }, { status: 500 });
  }
}
