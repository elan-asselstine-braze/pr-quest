"use client";

import Link from "next/link";
import {
  quests,
  STORAGE_KEY,
  defaultProgress,
  isQuestUnlocked,
  isTaskComplete,
  type Progress,
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

export function ProgressBar({ currentLevel }: { currentLevel?: number }) {
  const progress = getProgress();

  return (
    <nav className="flex items-center gap-2 flex-wrap" aria-label="Progress">
      {quests.map((quest) => {
        const done = isTaskComplete(quest.id, progress);
        const unlocked = isQuestUnlocked(quest.id, progress);
        const isCurrent = currentLevel === quest.id;
        const label = `${quest.id}${done ? " ✓" : ""}`;
        const className = `
          px-2 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors min-w-0
          ${done ? "bg-emerald-500/20 text-emerald-400" : ""}
          ${isCurrent && !done ? "bg-[var(--color-accent)]/20 text-[var(--color-accent)]" : ""}
          ${!done && !isCurrent && unlocked ? "text-[var(--color-text-muted)] hover:text-[var(--color-text)]" : ""}
          ${!unlocked ? "text-[var(--color-text-muted)] cursor-default" : ""}
        `;
        return unlocked ? (
          <Link key={quest.id} href={quest.path} className={className}>
            {label}
          </Link>
        ) : (
          <span key={quest.id} className={className} aria-label={`${label} (locked)`}>
            {label}
          </span>
        );
      })}
    </nav>
  );
}
