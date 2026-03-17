"use client";

import { useEffect, useState } from "react";
import { LevelLayout } from "@/components/LevelLayout";
import { Badge } from "@/components/Badge";
import { PowerPrompt } from "@/components/PowerPrompt";
import { BuggyCard } from "@/components/BuggyCard";
import { TerminalBlock } from "@/components/TerminalBlock";
import { levels, powerPrompts, STORAGE_KEY, defaultProgress, type Progress } from "@/lib/levels";
import { level3Commands } from "@/lib/terminalCommands";

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
  "Reproduced the issue",
  "Investigated with Cursor",
  "Fixed the bug",
  "Opened a PR with the fix",
];

export default function Level3Page() {
  const [progress, setProgressState] = useState<Progress>(defaultProgress);

  useEffect(() => {
    setProgressState(getProgress());
  }, []);

  const checkboxes = progress.level3.checkboxes;
  const allChecked = checkboxes.every(Boolean);

  const toggle = (index: number) => {
    const next = [...checkboxes];
    next[index] = !next[index];
    const newComplete = next.every(Boolean);
    const nextProgress: Progress = {
      ...progress,
      level3: { checkboxes: next, complete: newComplete || progress.level3.complete },
    };
    setProgressState(nextProgress);
    setProgressStorage(nextProgress);
  };

  return (
    <LevelLayout title={levels[2].title} level={3}>
      <div className="space-y-10">
        <section className="glass-card space-y-4">
          <h2 className="text-xl font-semibold">Something feels off</h2>
          <p className="text-[var(--color-text-muted)]">
            A bug has been intentionally planted in this site. Your job: notice it, investigate with
            Cursor, fix it, and submit a PR. Possible symptoms: flickering hover state, layout
            jump, or awkward timing.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Reproduce</h2>
          <BuggyCard />
        </section>

        <section className="glass-card space-y-2">
          <h2 className="text-xl font-semibold">Steps</h2>
          <ol className="list-decimal list-inside space-y-1 text-[var(--color-text-muted)]">
            <li>Reproduce – interact with the card above and notice the issue.</li>
            <li>Investigate – use Cursor and the prompts below to find the cause.</li>
            <li>Fix – make a small change that removes the bug.</li>
            <li>Submit PR – branch, commit, push, open a pull request.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Submit your fix (terminal commands)</h2>
          <p className="text-sm text-[var(--color-text-muted)] mb-3">
            After you fix the bug, use these commands to open a PR. Replace yourname with your name.
          </p>
          <TerminalBlock
            commands={level3Commands}
            title="Branch, commit, push"
            copyLabel="Copy"
          />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">AI Power Prompts</h2>
          <p className="text-sm text-[var(--color-text-muted)] mb-4">
            Copy these into Cursor to guide your investigation.
          </p>
          <div className="grid gap-3">
            {powerPrompts.map((prompt, i) => (
              <PowerPrompt key={i} prompt={prompt} />
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
              <Badge id={3} label={levels[2].badge} unlocked={true} />
              <span className="text-sm text-[var(--color-text-muted)]">Complete!</span>
            </div>
          )}
        </section>
      </div>
    </LevelLayout>
  );
}
