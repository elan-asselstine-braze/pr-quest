"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  practiceTasks,
  STORAGE_KEY,
  defaultProgress,
  isTaskComplete,
  type Progress,
  type TaskDifficulty,
} from "@/lib/levels";
import { PracticeMap } from "@/components/PracticeMap";

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

const START_TASKS = practiceTasks.filter((t) => t.id >= 1 && t.id <= 3);

function StartTaskCard({
  task,
  done,
}: {
  task: (typeof practiceTasks)[0];
  done: boolean;
}) {
  return (
    <Link
      href={task.path}
      className={`
        glass-card block p-4 transition-all
        hover:border-[var(--color-accent)]/40 hover:shadow-lg hover:shadow-[var(--color-accent)]/10
        ${done ? "border-emerald-500/40 ring-1 ring-emerald-500/20" : "border-[var(--color-accent)]/20"}
      `}
    >
      <div className="flex gap-3 items-start">
        {done && (
          <div
            className="shrink-0 w-7 h-7 rounded-full border-2 border-emerald-500 bg-emerald-500/20 text-emerald-400 flex items-center justify-center"
            aria-hidden
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-[var(--color-text)]">
            {task.title}
          </h3>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
            {task.description}
          </p>
          <p className="text-xs text-[var(--color-text-muted)] mt-1.5 font-mono">
            Branch: {task.branchPrefix}-yourname
          </p>
        </div>
      </div>
    </Link>
  );
}

export default function PracticePage() {
  const [progress, setProgress] = useState<Progress>(defaultProgress);
  const [filter, setFilter] = useState<TaskDifficulty | "all">("all");

  useEffect(() => {
    setProgress(getProgress());
  }, []);

  return (
    <main className="flex-1 px-3 py-6 sm:px-4 sm:py-8 max-w-3xl mx-auto w-full min-w-0">
      <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-[var(--color-text)]">
        Practice
      </h1>
      <p className="text-[var(--color-text-muted)] mb-6">
        Start with these three tasks, then explore the map. Complete tasks to unlock new ones.
        Ideal flow: Learn → Setup → Practice—skip any section as you like.
      </p>

      {/* Start here — first three beginner tasks */}
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl" aria-hidden>🏁</span>
          <span className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Start here</span>
        </div>
        <div className="space-y-3">
          {START_TASKS.map((task) => (
            <StartTaskCard
              key={task.id}
              task={task}
              done={isTaskComplete(task.id, progress)}
            />
          ))}
        </div>
      </section>

      {/* Practice map — Mario-style overworld */}
      <section>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl" aria-hidden>🗺️</span>
            <h2 className="font-semibold text-[var(--color-text)]">Quest map</h2>
          </div>
          <div className="flex flex-wrap gap-2">
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
        </div>
        <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-6 flex justify-center">
          <PracticeMap progress={progress} filter={filter} />
        </div>
        <p className="text-center text-xs text-[var(--color-text-muted)] mt-3">
          Hover over a node to see the task. Filter by difficulty to focus your quest.
        </p>
      </section>
    </main>
  );
}
