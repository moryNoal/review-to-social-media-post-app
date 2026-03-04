import sql from "@/app/api/utils/sql";

// List reviews with filters
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get("business_id");
    const source = searchParams.get("source");
    const status = searchParams.get("status");
    const minRating = searchParams.get("min_rating") || 4;

    let query = "SELECT * FROM reviews WHERE 1=1";
    const values = [];
    let paramCount = 1;

    if (businessId) {
      query += ` AND business_id = $${paramCount++}`;
      values.push(businessId);
    }

    if (source) {
      query += ` AND source = $${paramCount++}`;
      values.push(source);
    }

    if (status) {
      query += ` AND status = $${paramCount++}`;
      values.push(status);
    }

    query += ` AND rating >= $${paramCount++}`;
    values.push(minRating);

    query += " ORDER BY review_date DESC";

    const reviews = await sql(query, values);
    return Response.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return Response.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

// Create new review
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      business_id,
      source,
      rating,
      review_text,
      author_name,
      author_image_url,
      review_date,
    } = body;

    if (!business_id || !source || !rating || !review_text) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    if (rating < 1 || rating > 5) {
      return Response.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 },
      );
    }

    const result = await sql`
      INSERT INTO reviews (business_id, source, rating, review_text, author_name, author_image_url, review_date)
      VALUES (${business_id}, ${source}, ${rating}, ${review_text}, ${author_name || null}, ${author_image_url || null}, ${review_date || new Date().toISOString()})
      RETURNING *
    `;

    return Response.json(result[0], { status: 201 });
  } catch (error) {
    console.error("Error creating review:", error);
    return Response.json({ error: "Failed to create review" }, { status: 500 });
  }
}

// Update review status
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return Response.json(
        { error: "Review ID and status are required" },
        { status: 400 },
      );
    }

    const validStatuses = ["pending", "selected", "used", "blacklisted"];
    if (!validStatuses.includes(status)) {
      return Response.json({ error: "Invalid status" }, { status: 400 });
    }

    const result = await sql`
      UPDATE reviews SET status = ${status} WHERE id = ${id} RETURNING *
    `;

    if (result.length === 0) {
      return Response.json({ error: "Review not found" }, { status: 404 });
    }

    return Response.json(result[0]);
  } catch (error) {
    console.error("Error updating review:", error);
    return Response.json({ error: "Failed to update review" }, { status: 500 });
  }
}
