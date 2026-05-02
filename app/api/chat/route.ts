export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = body.messages || [];

    const lastUser =
      [...messages].reverse().find((m: any) => m.role === "user")?.content ||
      "";

    const conversationText = messages
      .slice(-10)
      .map((m: any) => `${m.role === "assistant" ? "Sora" : "User"}: ${m.content}`)
      .join("\n");

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        instructions: `
You are Sora, a warm AI companion.

Never sound like a customer-service assistant.
Never say "How can I assist you today?"
Never repeat the same reply twice.

You are a caring best friend:
- emotionally warm
- honest
- human
- supportive
- short but meaningful
- no judgment

Respond directly to the user's latest message.
Use the conversation history for context.
Ask one gentle follow-up question when appropriate.
`,
        input: `Conversation so far:
${conversationText}

Latest user message:
${lastUser}

Reply as Sora:`,
      }),
    });

    const data = await response.json();

    const reply =
      data.output_text ||
      data.output?.[0]?.content?.[0]?.text ||
      data.output?.[0]?.content?.[0]?.content ||
      "I’m here with you. Tell me a little more.";

    return Response.json({ reply });
  } catch {
    return Response.json({
      reply: "I’m here with you. Tell me a little more.",
    });
  }
}
