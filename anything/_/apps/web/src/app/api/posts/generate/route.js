// Generate social media post with AI caption
export async function POST(request) {
  try {
    const body = await request.json();
    const { quote, business_name, tone } = body;

    if (!quote || !business_name) {
      return Response.json(
        { error: "Quote and business name are required" },
        { status: 400 },
      );
    }

    const toneGuidance =
      tone === "professional"
        ? "professional and polished"
        : tone === "casual"
          ? "friendly and conversational"
          : "warm and authentic";

    const response = await fetch("/integrations/google-gemini-2-5-pro/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: `You are a social media expert creating engaging Instagram/Facebook captions for local businesses. Keep captions ${toneGuidance}, include relevant emojis, and add 3-5 relevant hashtags.`,
          },
          {
            role: "user",
            content: `Create a compelling social media caption for ${business_name} using this customer review quote: "${quote}"\n\nThe caption should highlight the quote, thank the customer, and encourage engagement.`,
          },
        ],
        json_schema: {
          name: "social_caption",
          schema: {
            type: "object",
            properties: {
              caption: { type: "string" },
              hashtags: {
                type: "array",
                items: { type: "string" },
              },
            },
            required: ["caption", "hashtags"],
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
    const result = JSON.parse(data.choices[0].message.content);

    return Response.json(result);
  } catch (error) {
    console.error("Error generating caption:", error);
    return Response.json(
      { error: "Failed to generate caption" },
      { status: 500 },
    );
  }
}
