"use client";

import { useState } from "react";
import { mutate } from "swr";
import {
  ChevronUp,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const categoryLabels: Record<string, string> = {
  forfeit: "⚔️ Straffe",
  reward: "🎁 Belønning",
  rule: "📜 Regel",
};

interface Idea {
  id: string;
  category: string;
  text: string;
  score: number;
  delta_24h?: number;
}

interface CardProps {
  idea: Idea;
  rank?: number;
}

export default function IdeaCard({ idea, rank }: CardProps) {
  const [score, setScore] = useState(idea.score);
  const delta = idea.delta_24h ?? 0;
  const [voted, setVoted] = useState<0 | 1 | -1>(0);

  async function vote(value: 1 | -1) {
    let delta: number = value;
    if (voted === value) {
      delta = -value;
      setVoted(0);
    } else {
      delta = voted === 0 ? value : value * 2;
      setVoted(value);
    }
    setScore((s) => s + delta);

    const res = await fetch("/api/votes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ideaId: idea.id,
        vote: voted === value ? 0 : value,
      }),
    });

    if (!res.ok) {
      setScore(idea.score); // revert
    } else {
      mutate((key: string) => key.startsWith("/api/ideas"));
    }
  }

  // determine style based on rank
  let borderClass = "border border-gray-200";
  let bgClass = "";
  let medal = "";
  let medalColor = "";
  if (rank === 0) {
    borderClass = "border border-yellow-400 border-l-4";
    bgClass = "bg-yellow-50 dark:bg-yellow-900/20";
    medal = "🥇";
    medalColor = "text-yellow-500";
  } else if (rank === 1) {
    borderClass = "border border-zinc-300 border-l-4";
    bgClass = "bg-zinc-50 dark:bg-zinc-800/40";
    medal = "🥈";
    medalColor = "text-zinc-400";
  } else if (rank === 2) {
    borderClass = "border border-amber-600 border-l-4";
    bgClass = "bg-amber-50 dark:bg-amber-900/25";
    medal = "🥉";
    medalColor = "text-amber-600";
  }

  const baseBorder =
    rank !== 0 && rank !== 1 && rank !== 2
      ? "border-transparent hover:border-slate-200"
      : "";

  return (
    <div
      className={`relative flex items-center gap-4 rounded-md border ${baseBorder} ${borderClass} ${bgClass} hover:shadow-sm transition p-3 md:p-4`}
    >
      {rank !== undefined && rank < 99 && (
        <span
          className={`absolute top-1 right-2 px-1 text-sm md:text-base font-extrabold ${
            rank === 0
              ? "text-yellow-600"
              : rank === 1
              ? "text-zinc-500"
              : rank === 2
              ? "text-amber-600"
              : "text-slate-600"
          }`}
        >
          {rank + 1}
        </span>
      )}
      {/* Vote rail */}
      <div className="flex flex-col items-center w-8 shrink-0 mr-2 pr-2 border-r border-slate-200/70">
        <button
          aria-label="Stem op"
          onClick={() => vote(1)}
          className={`transition-colors hover:text-blue-600 ${
            voted === 1 ? "text-blue-600" : "text-slate-400"
          }`}
        >
          <ChevronUp size={16} strokeWidth={2} />
        </button>
        <span className="text-sm font-mono tabular-nums w-6 text-center flex items-center justify-center gap-0.5">
          {score}
        </span>
        {delta !== 0 && (
          <span className="flex items-center text-[10px] gap-0.5 mt-1">
            {delta > 0 ? (
              <ArrowUpRight size={10} className="text-green-600" />
            ) : (
              <ArrowDownRight size={10} className="text-red-600" />
            )}
            <span className="text-[10px] text-slate-500">
              {Math.abs(delta)}
            </span>
          </span>
        )}
        <button
          aria-label="Stem ned"
          onClick={() => vote(-1)}
          className={`transition-colors hover:text-blue-600 ${
            voted === -1 ? "text-blue-600" : "text-slate-400"
          }`}
        >
          <ChevronDown size={16} strokeWidth={2} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pr-8">
        <p className="text-sm text-slate-800 whitespace-normal break-words">
          {idea.text}
        </p>
      </div>
    </div>
  );
}
