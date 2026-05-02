export async function POST(req: Request) {
  const { message, history } = await req.json();

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

You are not a generic assistant.
Do not say “How can I assist you today?”
Talk like a caring, emotionally intelligent best friend.

Style:
- warm
- honest
- human
- short but meaningful
- no judgment
- no robotic assistant language

If the user says they are sad, lost, lonely, stressed, or scared, respond emotionally first.
Ask one gentle follow-up question.
`,
      input: [
        ...(history || []).map((m: any) => ({
          role: m.role === "sora" ? "assistant" : "user",
          content: m.text,
        })),
        { role: "user", content: message },
      ],
    }),
  });

  const data = await response.json();

  const reply =
    data.output_text ||
    data.output?.[0]?.content?.[0]?.text ||
    "I’m here with you. Tell me what’s really been weighing on you.";

  return Response.json({ reply });
}
