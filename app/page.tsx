"use client";

import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hey, I'm here. What's on your mind?" }
  ]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");

    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ messages: newMessages })
    });

    const data = await res.json();

    setMessages([...newMessages, { role: "assistant", content: data.reply }]);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="p-6 text-xl font-semibold">Sora</div>

      <div className="flex-1 overflow-y-auto px-6 space-y-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-xl p-4 rounded-2xl ${
              m.role === "user"
                ? "bg-white text-black ml-auto"
                : "bg-zinc-800"
            }`}
          >
            {m.content}
          </div>
        ))}
      </div>

      <div className="p-4 flex gap-2 border-t border-zinc-800">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Talk to Sora..."
          className="flex-1 p-3 rounded-xl bg-zinc-900 outline-none"
        />
        <button
          onClick={sendMessage}
          className="bg-white text-black px-5 rounded-xl"
        >
          Send
        </button>
      </div>
    </div>
  );
}
