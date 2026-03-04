import sql from "@/app/api/utils/sql";

// List posts
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get("business_id");
    const status = searchParams.get("status");

    let query = `
      SELECT p.*, r.author_name, r.rating, r.source 
      FROM posts p
      LEFT JOIN reviews r ON p.review_id = r.id
      WHERE 1=1
    `;
    const values = [];
    let paramCount = 1;

    if (businessId) {
      query += ` AND p.business_id = $${paramCount++}`;
      values.push(businessId);
    }

    if (status) {
      query += ` AND p.status = $${paramCount++}`;
      values.push(status);
    }

    query += " ORDER BY p.created_at DESC";

    const posts = await sql(query, values);
    return Response.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return Response.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

// Create new post
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      business_id,
      review_id,
      quote_text,
      caption,
      image_url,
      scheduled_time,
      platform,
    } = body;

    if (!business_id || !quote_text || !caption) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const result = await sql`
      INSERT INTO posts (business_id, review_id, quote_text, caption, image_url, scheduled_time, platform)
      VALUES (${business_id}, ${review_id || null}, ${quote_text}, ${caption}, ${image_url || null}, ${scheduled_time || null}, ${platform || null})
      RETURNING *
    `;

    // Update review status to 'used' if review_id is provided
    if (review_id) {
      await sql`UPDATE reviews SET status = 'used' WHERE id = ${review_id}`;
    }

    return Response.json(result[0], { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return Response.json({ error: "Failed to create post" }, { status: 500 });
  }
}

// Update post
export async function PUT(request) {
  try {
    const body = await request.json();
    const {
      id,
      quote_text,
      caption,
      image_url,
      scheduled_time,
      status,
      platform,
    } = body;

    if (!id) {
      return Response.json({ error: "Post ID is required" }, { status: 400 });
    }

    const updates = [];
    const values = [];
    let paramCount = 1;

    if (quote_text !== undefined) {
      updates.push(`quote_text = $${paramCount++}`);
      values.push(quote_text);
    }
    if (caption !== undefined) {
      updates.push(`caption = $${paramCount++}`);
      values.push(caption);
    }
    if (image_url !== undefined) {
      updates.push(`image_url = $${paramCount++}`);
      values.push(image_url);
    }
    if (scheduled_time !== undefined) {
      updates.push(`scheduled_time = $${paramCount++}`);
      values.push(scheduled_time);
    }
    if (status !== undefined) {
      updates.push(`status = $${paramCount++}`);
      values.push(status);
    }
    if (platform !== undefined) {
      updates.push(`platform = $${paramCount++}`);
      values.push(platform);
    }

    if (updates.length === 0) {
      return Response.json({ error: "No fields to update" }, { status: 400 });
    }

    values.push(id);
    const query = `UPDATE posts SET ${updates.join(", ")} WHERE id = $${paramCount} RETURNING *`;
    const result = await sql(query, values);

    if (result.length === 0) {
      return Response.json({ error: "Post not found" }, { status: 404 });
    }

    return Response.json(result[0]);
  } catch (error) {
    console.error("Error updating post:", error);
    return Response.json({ error: "Failed to update post" }, { status: 500 });
  }
}
