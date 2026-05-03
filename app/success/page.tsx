"use client";

import { useEffect } from "react";

export default function SuccessPage() {
  useEffect(() => {
    localStorage.setItem("sora_paid", "true");
    window.location.href = "/";
  }, []);

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold">You’re unlocked</h1>
        <p className="text-zinc-400 mt-3">Taking you back to Sora...</p>
      </div>
    </main>
  );
}
