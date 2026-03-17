"use client";

import Link from "next/link";
import { levels } from "@/lib/levels";
import { STORAGE_KEY, defaultProgress, type Progress } from "@/lib/levels";

function getProgress(): Progress {
  if (typeof window === "undefined") return defaultProgress;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress;
    const parsed = JSON.parse(raw) as Progress;
    return {
      level1: parsed.level1 ?? defaultProgress.level1,
      level2: parsed.level2 ?? defaultProgress.level2,
      level3: parsed.level3 ?? defaultProgress.level3,
    };
  } catch {
    return defaultProgress;
  }
}

export function ProgressBar({ currentLevel }: { currentLevel?: number }) {
  const progress = getProgress();

  return (
    <nav className="flex items-center gap-2 flex-wrap" aria-label="Level progress">
      {levels.map((level) => {
        const done = progress[`level${level.id}` as keyof Progress]?.complete ?? false;
        const isCurrent = currentLevel === level.id;
        return (
          <Link
            key={level.id}
            href={level.path}
            className={`
              px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
              ${done ? "bg-emerald-500/20 text-emerald-400" : ""}
              ${isCurrent && !done ? "bg-[var(--color-accent)]/20 text-[var(--color-accent)]" : ""}
              ${!done && !isCurrent ? "text-[var(--color-text-muted)] hover:text-[var(--color-text)]" : ""}
            `}
          >
            {level.id}. {level.title}
            {done && " ✓"}
          </Link>
        );
      })}
    </nav>
  );
}
