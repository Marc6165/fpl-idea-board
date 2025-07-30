"use client";

import { useState } from "react";
import { ideaSchema } from "@/lib/validators";
import { mutate } from "swr";

interface Props {
  compact?: boolean;
}

export default function IdeaForm({ compact }: Props) {
  const [category, setCategory] = useState<"forfeit" | "reward" | "rule">(
    "forfeit"
  );
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = ideaSchema.safeParse({ category, text });
    if (!parsed.success) {
      setError(parsed.error.errors[0].message);
      return;
    }
    setLoading(true);
    const res = await fetch("/api/ideas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });
    setLoading(false);
    if (!res.ok) {
      setError("Something went wrong");
      return;
    }
    setError(null);
    setText("");
    mutate((key: string) => key.startsWith("/api/ideas"));
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`${
        compact
          ? "bg-transparent border-none shadow-none p-0 space-y-2 mb-0"
          : "bg-white rounded-md border shadow-sm p-6 space-y-4 mb-10"
      }`}
    >
      {!compact && <h2 className="text-xl font-semibold">Indsend en ny idé</h2>}
      <div className="flex flex-col sm:flex-row gap-4">
        <select
          className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={category}
          onChange={(e) => setCategory(e.target.value as any)}
        >
          <option value="forfeit">Straffe</option>
          <option value="reward">Belønning</option>
          <option value="rule">Regel</option>
        </select>
        <input
          type="text"
          maxLength={280}
          placeholder="Beskriv din idé..."
          className="border rounded-md p-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {loading ? "..." : "Indsend"}
        </button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}
