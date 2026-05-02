"use client";

import { useState } from "react";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<string[]>([]);

  function sendMessage() {
    if (!message) return;
    setChat([...chat, message]);
    setMessage("");
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col p-4">
      
      <h1 className="text-xl mb-4">Sora</h1>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto mb-4">
        {chat.map((msg, i) => (
          <div key={i} className="mb-2 text-gray-300">
            {msg}
          </div>
        ))}
      </div>

      {/* Input area */}
      <div className="flex gap-2">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type here..."
          className="flex-1 p-3 rounded bg-white text-black"
        />
        <button
          onClick={sendMessage}
          className="bg-white text-black px-4 rounded"
        >
          Send
        </button>
      </div>

    </main>
  );
}
