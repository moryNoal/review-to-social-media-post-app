// AI-powered review analysis to extract best quotes
export async function POST(request) {
  try {
    const body = await request.json();
    const { reviews } = body;

    if (!reviews || !Array.isArray(reviews) || reviews.length === 0) {
      return Response.json(
        { error: "Reviews array is required" },
        { status: 400 },
      );
    }

    // Prepare reviews for AI analysis
    const reviewTexts = reviews
      .map(
        (r, idx) =>
          `Review ${idx + 1} (${r.rating} stars, ${r.source}):\n"${r.review_text}"\nAuthor: ${r.author_name || "Anonymous"}`,
      )
      .join("\n\n");

    const response = await fetch("/integrations/google-gemini-2-5-pro/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content:
              "You are an expert social media manager who extracts the most compelling, authentic quotes from customer reviews. Focus on quotes that are specific, emotional, and would resonate on social media.",
          },
          {
            role: "user",
            content: `Analyze these customer reviews and extract the 3-5 best quotes that would work great as social media posts. For each quote, provide:
1. The exact quote (keep it short and punchy, 10-20 words max)
2. Why it's compelling
3. Suggested caption for social media

Reviews:
${reviewTexts}`,
          },
        ],
        json_schema: {
          name: "review_analysis",
          schema: {
            type: "object",
            properties: {
              best_quotes: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    quote: { type: "string" },
                    reason: { type: "string" },
                    suggested_caption: { type: "string" },
                    review_index: { type: "number" },
                  },
                  required: [
                    "quote",
                    "reason",
                    "suggested_caption",
                    "review_index",
                  ],
                  additionalProperties: false,
                },
              },
            },
            required: ["best_quotes"],
            additionalProperties: false,
          },
        },
      }),
    });

    if (!response.ok) {
      throw new Error(
        `AI request failed: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();
    const analysis = JSON.parse(data.choices[0].message.content);

    return Response.json(analysis);
  } catch (error) {
    console.error("Error analyzing reviews:", error);
    return Response.json(
      { error: "Failed to analyze reviews" },
      { status: 500 },
    );
  }
}
