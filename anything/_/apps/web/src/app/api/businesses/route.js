import sql from "@/app/api/utils/sql";

// Get business by ID
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json(
        { error: "Business ID is required" },
        { status: 400 },
      );
    }

    const businesses = await sql`
      SELECT * FROM businesses WHERE id = ${id}
    `;

    if (businesses.length === 0) {
      return Response.json({ error: "Business not found" }, { status: 404 });
    }

    return Response.json(businesses[0]);
  } catch (error) {
    console.error("Error fetching business:", error);
    return Response.json(
      { error: "Failed to fetch business" },
      { status: 500 },
    );
  }
}

// Update business branding
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, name, logo_url, primary_color, secondary_color, font_family } =
      body;

    if (!id) {
      return Response.json(
        { error: "Business ID is required" },
        { status: 400 },
      );
    }

    const updates = [];
    const values = [];
    let paramCount = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramCount++}`);
      values.push(name);
    }
    if (logo_url !== undefined) {
      updates.push(`logo_url = $${paramCount++}`);
      values.push(logo_url);
    }
    if (primary_color !== undefined) {
      updates.push(`primary_color = $${paramCount++}`);
      values.push(primary_color);
    }
    if (secondary_color !== undefined) {
      updates.push(`secondary_color = $${paramCount++}`);
      values.push(secondary_color);
    }
    if (font_family !== undefined) {
      updates.push(`font_family = $${paramCount++}`);
      values.push(font_family);
    }

    if (updates.length === 0) {
      return Response.json({ error: "No fields to update" }, { status: 400 });
    }

    values.push(id);
    const query = `UPDATE businesses SET ${updates.join(", ")} WHERE id = $${paramCount} RETURNING *`;
    const result = await sql(query, values);

    if (result.length === 0) {
      return Response.json({ error: "Business not found" }, { status: 404 });
    }

    return Response.json(result[0]);
  } catch (error) {
    console.error("Error updating business:", error);
    return Response.json(
      { error: "Failed to update business" },
      { status: 500 },
    );
  }
}
