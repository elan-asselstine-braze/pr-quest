"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LevelLayout } from "@/components/LevelLayout";
import { Badge } from "@/components/Badge";
import { WhatYoullSee } from "@/components/WhatYoullSee";
import {
  levels,
  firstChangeOptions,
  STORAGE_KEY,
  defaultProgress,
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

function setProgressStorage(progress: Progress) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

const CHECKBOX_LABELS = [
  "Created a branch (level1-yourname)",
  "Opened a pull request",
  "Used the PR template",
  "Added a screenshot (optional but great)",
];

export default function Level1Page() {
  const [progress, setProgressState] = useState<Progress>(defaultProgress);

  useEffect(() => {
    setProgressState(getProgress());
  }, []);

  const checkboxes = progress.level1.checkboxes;
  const allChecked = checkboxes.every(Boolean);
  const complete = progress.level1.complete;

  const toggle = (index: number) => {
    const next = [...checkboxes];
    next[index] = !next[index];
    const newComplete = next.every(Boolean);
    const nextProgress: Progress = {
      ...progress,
      level1: { checkboxes: next, complete: newComplete || progress.level1.complete },
    };
    setProgressState(nextProgress);
    setProgressStorage(nextProgress);
  };

  return (
    <LevelLayout title={levels[0].title} level={1}>
      <div className="space-y-10">
        {/* Learn */}
        <section className="glass-card space-y-4">
          <h2 className="text-xl font-semibold">What is a branch?</h2>
          <p className="text-[var(--color-text-muted)]">
            A branch is a copy of the code where you can make changes without affecting the main
            version. When you’re ready, you propose merging your branch via a pull request.
          </p>

          <h2 className="text-xl font-semibold mt-6">What is a PR?</h2>
          <p className="text-[var(--color-text-muted)]">
            A pull request (PR) is a proposed change that others can review, discuss, and approve
            before it’s merged. It’s the standard way teams contribute code and keep changes visible
            and safe.
          </p>

          <h2 className="text-xl font-semibold mt-6">Why do teams use PRs?</h2>
          <p className="text-[var(--color-text-muted)]">
            PRs give everyone a single place to see what’s changing, leave comments, and approve
            work. You’re learning the same process here—in a small, safe environment.
          </p>

          <h2 className="text-xl font-semibold mt-6">What to expect in real teams</h2>
          <p className="text-[var(--color-text-muted)]">
            In your team you might also see tests run automatically, CI checks, or more review
            steps. This quest is a focused slice so you learn the core flow. When you see those
            extra steps, you’ll already know what you’re aiming for.
          </p>

          <div className="rounded-lg bg-white/5 p-4 mt-4">
            <p className="text-sm font-medium mb-2">PR anatomy</p>
            <p className="text-xs text-[var(--color-text-muted)]">
              Title → Description (what you changed, why) → Files changed → Review / comments →
              Merge
            </p>
          </div>
        </section>

        {/* Do */}
        <section className="glass-card space-y-4">
          <h2 className="text-xl font-semibold">Do it</h2>
          <p className="text-[var(--color-text-muted)]">Run these in your terminal (replace yourname with your name):</p>
          <pre className="bg-black/40 rounded-lg p-4 text-sm overflow-x-auto">
            <code>git checkout -b level1-yourname{"\n"}npm run dev</code>
          </pre>
          <p className="text-sm text-[var(--color-text-muted)]">
            Then choose one change below. Edit the file, save, commit, and open a PR. Use the{" "}
            <Link href="https://github.com/elan-asselstine-braze/pr-quest/blob/main/PR_TEMPLATE.md" className="text-[var(--color-accent)] underline" target="_blank" rel="noopener noreferrer">
              PR template
            </Link>.
          </p>

          <h3 className="font-semibold mt-6">Choose your first change</h3>
          <ul className="space-y-2">
            {firstChangeOptions.map((opt) => (
              <li key={opt.id} className="flex flex-col gap-0.5">
                <span className="font-medium">{opt.label}</span>
                <span className="text-sm text-[var(--color-text-muted)]">
                  File: <code className="bg-white/10 px-1 rounded">{opt.file}</code> — {opt.task}
                </span>
              </li>
            ))}
          </ul>
          <p className="text-sm">
            <Link href="/contributors" className="text-[var(--color-accent)] underline">
              Go to Contributors page →
            </Link>
          </p>
        </section>

        {/* What you'll see on GitHub */}
        <section>
          <h2 className="text-xl font-semibold mb-3">Before you open your PR</h2>
          <p className="text-[var(--color-text-muted)] mb-3">
            After you push your branch, go to GitHub → your repo. You’ll see a yellow banner:
            &quot;Compare & pull request.&quot; Click it. Here’s what the next screen looks like:
          </p>
          <WhatYoullSee
            title="What you'll see on GitHub"
            caption="Paste your title at the top, description in the box, then click Create pull request."
            labels={[
              { text: "Title goes here", position: "top" },
              { text: "Description (use the PR template)", position: "top" },
              { text: "Create pull request button", position: "bottom" },
            ]}
          />
        </section>

        {/* Checklist */}
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
              <Badge id={1} label={levels[0].badge} unlocked={true} />
              <span className="text-sm text-[var(--color-text-muted)]">Level 1 complete!</span>
            </div>
          )}
        </section>
      </div>
    </LevelLayout>
  );
}
