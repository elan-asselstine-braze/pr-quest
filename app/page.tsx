"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { levels, STORAGE_KEY, defaultProgress, type Progress } from "@/lib/levels";
import { Badge } from "@/components/Badge";
import { ProgressBar } from "@/components/ProgressBar";

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

export default function HomePage() {
  const [progress, setProgress] = useState<Progress>(defaultProgress);

  useEffect(() => {
    setProgress(getProgress());
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <span className="font-semibold text-[var(--color-accent)]">PR Quest</span>
        <ProgressBar />
      </header>

      <main className="flex-1 px-4 py-12 max-w-3xl mx-auto w-full">
        <h1 className="text-4xl font-bold mb-4 gradient-accent bg-clip-text text-transparent">
          Get confident with pull requests
        </h1>
        <p className="text-[var(--color-text-muted)] text-lg mb-10">
          Learn → Modify via PR → Review → Debug with AI. You’ll learn on this site and change this site.
        </p>

        <div className="flex flex-wrap gap-2 mb-10">
          {levels.map((level) => (
            <Badge
              key={level.id}
              id={level.id}
              label={level.badge}
              unlocked={progress[`level${level.id}` as keyof Progress]?.complete ?? false}
            />
          ))}
        </div>

        <div className="space-y-4">
          {levels.map((level) => (
            <Link
              key={level.id}
              href={level.path}
              className="block glass-card hover:border-[var(--color-accent)]/30 transition-colors"
            >
              <h2 className="text-xl font-semibold mb-1">{level.title}</h2>
              <p className="text-[var(--color-text-muted)] text-sm">
                {level.id === 1 && "Create a branch, make a small change, open your first PR."}
                {level.id === 2 && "Review a seeded PR and leave helpful comments."}
                {level.id === 3 && "Find and fix an intentional bug using Cursor."}
              </p>
            </Link>
          ))}
        </div>

        <p className="mt-10 text-[var(--color-text-muted)] text-sm">
          Prefer a guided flow? Run <code className="bg-white/10 px-1.5 py-0.5 rounded">npm run quest</code> in your terminal.
        </p>
      </main>
    </div>
  );
}
