"use client";

import { useEffect, useState } from "react";

type Msg = { role: "user" | "sora"; text: string };

export default function Home() {
  const [started, setStarted] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(false);
  const [freeLeft, setFreeLeft] = useState(20);
  const [voiceOn, setVoiceOn] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("sora-memory");
    if (saved) {
      const data = JSON.parse(saved);
      setMessages(data.messages || []);
      setFreeLeft(data.freeLeft ?? 20);
    } else {
      setMessages([
        { role: "sora", text: "Hey, I’m here. What’s on your mind?" },
      ]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "sora-memory",
      JSON.stringify({ messages, freeLeft })
    );
  }, [messages, freeLeft]);

  function speak(text: string) {
    if (!voiceOn) return;
    const voice = new SpeechSynthesisUtterance(text);
    voice.rate = 0.95;
    voice.pitch = 1;
    speechSynthesis.speak(voice);
  }

  async function sendMessage(e?: React.FormEvent) {
    e?.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    if (freeLeft <= 0) {
      const paywall =
        "You’ve used your free messages. Upgrade to keep talking with Sora anytime.";
      setMessages((m) => [...m, { role: "sora", text: paywall }]);
      speak(paywall);
      return;
    }

    setInput("");
    setFreeLeft((n) => n - 1);
    setMessages((m) => [...m, { role: "user", text }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history: messages }),
      });

      const data = await res.json();
      const reply =
        data.reply ||
        "I’m here with you. Tell me more about what’s really going on.";

      setMessages((m) => [...m, { role: "sora", text: reply }]);
      speak(reply);
    } catch {
      const fallback =
        "I’m still here with you. Something glitched, but you can keep talking.";
      setMessages((m) => [...m, { role: "sora", text: fallback }]);
      speak(fallback);
    }

    setLoading(false);
  }

  if (!started) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-zinc-900 text-white flex items-center justify-center px-6">
        <section className="max-w-2xl text-center">
          <div className="mb-6 text-sm text-zinc-400 tracking-widest uppercase">
            AI Companion
          </div>

          <h1 className="text-7xl font-bold mb-5">Sora</h1>

          <p className="text-xl text-zinc-300 mb-8">
            Someone to talk to without judgment.
          </p>

          <p className="text-zinc-500 mb-10">
            A warm, private companion that listens, remembers, and responds like
            someone who actually cares.
          </p>

          <button
            onClick={() => setStarted(true)}
            className="bg-white text-black px-10 py-4 rounded-full font-semibold shadow-lg hover:scale-105 transition"
          >
            Start talking
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex flex-col">
      <header className="p-5 border-b border-white/10 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Sora</h1>
          <p className="text-sm text-zinc-400">
            {freeLeft} free messages left
          </p>
        </div>

        <button
          onClick={() => setVoiceOn(!voiceOn)}
          className="text-sm border border-white/20 px-4 py-2 rounded-full"
        >
          Voice {voiceOn ? "On" : "Off"}
        </button>
      </header>

      <section className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={
              msg.role === "user"
                ? "ml-auto max-w-[80%] bg-white text-black rounded-2xl px-5 py-3 shadow"
                : "mr-auto max-w-[80%] bg-zinc-900 border border-white/10 rounded-2xl px-5 py-3 shadow"
            }
          >
            {msg.text}
          </div>
        ))}

        {loading && (
          <div className="text-zinc-500 text-sm">Sora is thinking...</div>
        )}
      </section>

      {freeLeft <= 0 && (
        <div className="p-4 border-t border-white/10">
          <a
            href="https://buy.stripe.com/"
            className="block text-center w-full bg-white text-black py-4 rounded-xl font-semibold"
          >
            Upgrade to keep talking
          </a>
        </div>
      )}

      <form
        onSubmit={sendMessage}
        className="p-4 border-t border-white/10 flex gap-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Talk to Sora..."
          className="flex-1 bg-zinc-900 border border-white/10 rounded-xl px-4 py-4 text-white outline-none"
        />

        <button
          type="submit"
          className="bg-white text-black rounded-xl px-6 font-semibold"
        >
          Send
        </button>
      </form>
    </main>
  );
}
