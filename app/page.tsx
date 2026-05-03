"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const sendMagicLink = async () => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
    });

    if (error) {
      alert("Error: " + error.message);
    } else {
      alert("Check your email for login link 🔥");
    }
  };

  return (
    <main className="p-6 text-white">
      <h1 className="text-2xl mb-4">Sora AI</h1>

      {/* LOGIN */}
      <div className="mb-6">
        <input
          type="email"
          placeholder="Enter your email"
          className="p-2 text-black mr-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={sendMagicLink} className="bg-blue-500 p-2">
          Login
        </button>
      </div>

      {/* CHAT (your existing UI stays below this) */}
      <input
        placeholder="Talk to Sora..."
        className="p-2 text-black w-full"
      />
    </main>
  );
}
