"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  practiceTasks,
  STORAGE_KEY,
  defaultProgress,
  isPracticeTaskUnlocked,
  isTaskComplete,
  type Progress,
  type TaskDifficulty,
} from "@/lib/levels";

function getProgress(): Progress {
  if (typeof window === "undefined") return defaultProgress;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress;
    return { ...defaultProgress, ...JSON.parse(raw) };
  } catch {
    return defaultProgress;
  }
}

const DIFFICULTY_LABELS: Record<TaskDifficulty, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

function getUnlockMessage(task: (typeof practiceTasks)[0], progress: Progress): string {
  if (task.unlocksAfter === "first-pr") return "Complete your first PR to unlock";
  return "Complete 4 beginner tasks to unlock";
}

export default function PracticePage() {
  const [progress, setProgress] = useState<Progress>(defaultProgress);
  const [filter, setFilter] = useState<TaskDifficulty | "all">("all");

  useEffect(() => {
    setProgress(getProgress());
  }, []);

  const filtered = filter === "all" ? practiceTasks : practiceTasks.filter((t) => t.difficulty === filter);

  return (
    <main className="flex-1 px-3 py-6 sm:px-4 sm:py-8 max-w-3xl mx-auto w-full min-w-0">
      <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-[var(--color-text)]">
        Practice
      </h1>
      <p className="text-[var(--color-text-muted)] mb-6">
        Complete each practice to unlock the next. Start with your first PR, then unlock the rest.
        Ideal flow: Learn → Setup → Practice—skip any section as you like.
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            filter === "all"
              ? "bg-[var(--color-accent)] text-white"
              : "bg-white/10 text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
          }`}
        >
          All
        </button>
        {(["beginner", "intermediate", "advanced"] as const).map((d) => (
          <button
            key={d}
            onClick={() => setFilter(d)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === d
                ? "bg-[var(--color-accent)] text-white"
                : "bg-white/10 text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            }`}
          >
            {DIFFICULTY_LABELS[d]}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((task) => {
          const unlocked = isPracticeTaskUnlocked(task, progress);
          const done = isTaskComplete(task.id, progress);
          const card = (
            <div
              className={`
                glass-card block transition-colors
                ${unlocked ? "hover:border-[var(--color-accent)]/30" : "opacity-75"}
                ${done ? "border-emerald-500/30" : ""}
              `}
            >
              <div className="flex gap-4 items-start">
                {done && (
                  <div
                    className="shrink-0 w-6 h-6 rounded border-2 border-emerald-500 bg-emerald-500/20 text-emerald-400 flex items-center justify-center mt-0.5"
                    aria-hidden
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                )}
                <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-[var(--color-text)]">
                      {task.title}
                    </h3>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        task.difficulty === "beginner"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : task.difficulty === "intermediate"
                            ? "bg-amber-500/20 text-amber-400"
                            : "bg-purple-500/20 text-purple-400"
                      }`}
                    >
                      {DIFFICULTY_LABELS[task.difficulty]}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--color-text-muted)] mt-1">
                    {task.description}
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1 font-mono">
                    Branch: {task.branchPrefix}-yourname
                  </p>
                </div>
                {!unlocked && (
                  <span className="text-xs text-[var(--color-text-muted)] shrink-0 flex items-center gap-1">
                    <span aria-hidden>🔒</span> {getUnlockMessage(task, progress)}
                  </span>
                )}
              </div>
                </div>
              </div>
            </div>
          );
          return unlocked ? (
            <Link key={task.id} href={task.path} className="block">
              {card}
            </Link>
          ) : (
            <div key={task.id} className="cursor-default" aria-disabled>
              {card}
            </div>
          );
        })}
      </div>
    </main>
  );
}
