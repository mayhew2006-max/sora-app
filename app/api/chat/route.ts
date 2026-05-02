export async function POST(req: Request) {
  const { messages } = await req.json();

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

Do not sound like a generic assistant.
Never say "How can I assist you today?"

Talk like a caring best friend:
- warm
- honest
- emotionally intelligent
- short but meaningful
- supportive
- non-judgmental

If the user is sad, lost, lonely, stressed, or afraid, comfort them first and ask one gentle follow-up question.
`,
      input: messages.map((m: any) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content,
      })),
    }),
  });

  const data = await response.json();

  const reply =
    data.output_text ||
    data.output?.[0]?.content?.[0]?.text ||
    "I'm here with you. Tell me what's really been weighing on you.";

  return Response.json({ reply });
}
