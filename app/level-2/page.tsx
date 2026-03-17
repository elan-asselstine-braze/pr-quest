"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LevelLayout } from "@/components/LevelLayout";
import { Badge } from "@/components/Badge";
import { DiffExplainer } from "@/components/DiffExplainer";
import { levels, seededReviewPRs, STORAGE_KEY, defaultProgress, type Progress } from "@/lib/levels";

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

function setProgressStorage(progress: Progress) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

const CHECKBOX_LABELS = [
  "Left a clarifying question",
  "Suggested an improvement",
  "Identified a real issue",
  "Wrote a summary comment",
];

export default function Level2Page() {
  const [progress, setProgressState] = useState<Progress>(defaultProgress);

  useEffect(() => {
    setProgressState(getProgress());
  }, []);

  const checkboxes = progress.level2.checkboxes;
  const allChecked = checkboxes.every(Boolean);

  const toggle = (index: number) => {
    const next = [...checkboxes];
    next[index] = !next[index];
    const newComplete = next.every(Boolean);
    const nextProgress: Progress = {
      ...progress,
      level2: { checkboxes: next, complete: newComplete || progress.level2.complete },
    };
    setProgressState(nextProgress);
    setProgressStorage(nextProgress);
  };

  return (
    <LevelLayout title={levels[1].title} level={2}>
      <div className="space-y-10">
        <section>
          <DiffExplainer />
        </section>

        <section className="glass-card space-y-4">
          <h2 className="text-xl font-semibold">Your mission</h2>
          <p className="text-[var(--color-text-muted)]">
            Open a seeded PR on GitHub and leave at least one clarifying question, one
            suggestion, and one summary comment. Pick any PR below—each has intentional issues to find.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {seededReviewPRs.map((pr) => (
              <a
                key={pr.title}
                href={pr.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 rounded-lg border border-white/10 bg-white/5 hover:border-[var(--color-accent)]/30 hover:bg-[var(--color-accent)]/5 transition-colors"
              >
                <span className="font-medium text-[var(--color-text)]">{pr.title}</span>
                <p className="text-xs text-[var(--color-text-muted)] mt-1">{pr.focus}</p>
                <span className="text-xs text-[var(--color-accent)] mt-2 inline-block">Review on GitHub →</span>
              </a>
            ))}
          </div>
        </section>

        <section className="glass-card space-y-3">
          <h2 className="text-xl font-semibold">Checklist</h2>
          {CHECKBOX_LABELS.map((label, i) => (
            <label key={i} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={checkboxes[i]}
                onChange={() => toggle(i)}
                className="rounded border-white/30"
              />
              <span>{label}</span>
            </label>
          ))}
          {allChecked && (
            <div className="pt-4 flex items-center gap-2">
              <Badge id={2} label={levels[1].badge} unlocked={true} />
              <span className="text-sm text-[var(--color-text-muted)]">Complete!</span>
            </div>
          )}
        </section>
      </div>
    </LevelLayout>
  );
}
