export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return Response.json({
        reply: "OPENAI_API_KEY is missing in Vercel environment variables.",
      });
    }

    const openaiMessages = [
      {
        role: "system",
        content:
          "You are Sora, a warm AI companion. Do not sound like a generic assistant. Never say 'How can I assist you today?' Respond like a caring best friend. Be short, honest, emotional, and human.",
      },
      ...messages.map((m: any) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content,
      })),
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: openaiMessages,
        temperature: 0.9,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return Response.json({
        reply: `OpenAI error: ${data.error?.message || "Unknown error"}`,
      });
    }

    return Response.json({
      reply:
        data.choices?.[0]?.message?.content ||
        "I’m here with you. Tell me more.",
    });
  } catch (err: any) {
    return Response.json({
      reply: `Server error: ${err.message}`,
    });
  }
}
