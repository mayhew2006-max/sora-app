"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [messages, setMessages] = useState<any[]>([
    { role: "assistant", content: "Hey, I'm here. What's on your mind?" }
  ]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  async function login() {
    if (!email.trim()) {
      alert("Enter your email first.");
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) alert(error.message);
    else alert("Check your email for login link.");
  }

  async function logout() {
    await supabase.auth.signOut();
    setUser(null);
  }

  async function sendMessage() {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");

    const reply =
      "I'm here with you. Tell me what's really been weighing on you.";

    setMessages([...newMessages, { role: "assistant", content: reply }]);
  }

  function startListening() {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not supported.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      setInput(text);
    };

    recognition.start();
  }

  // 🔐 LOGIN SCREEN
  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="p-6 bg-zinc-900 rounded-xl w-full max-w-sm">
          <h1 className="text-xl mb-4">Login</h1>

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full p-2 mb-4 bg-black border border-white/20"
          />

          <button
            onClick={login}
            className="w-full bg-white text-black p-2 rounded"
          >
            Send Login Link
          </button>
        </div>
      </main>
    );
  }

  // 💬 CHAT UI
  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      <header className="p-4 flex justify-between border-b border-white/10">
        <h1>Sora</h1>
        <button onClick={logout}>Logout</button>
      </header>

      <div className="flex-1 p-4 space-y-2 overflow-y-auto">
        {messages.map((m, i) => (
          <div
            key={i}
            className={m.role === "user" ? "text-right" : "text-left"}
          >
            {m.content}
          </div>
        ))}
      </div>

      <div className="p-4 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 bg-zinc-800"
          placeholder="Talk to Sora..."
        />

        <button onClick={sendMessage}>Send</button>

        <button onClick={startListening}>
          {listening ? "Listening..." : "🎤"}
        </button>
      </div>
    </main>
  );
}
