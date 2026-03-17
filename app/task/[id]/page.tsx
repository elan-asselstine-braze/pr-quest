"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { LevelLayout } from "@/components/LevelLayout";
import { CopyableCommand } from "@/components/CopyableCommand";
import {
  practiceTasks,
  STORAGE_KEY,
  defaultProgress,
  isPracticeTaskUnlocked,
  isTaskComplete,
  getBranchName,
  TASK_BEGINNER_XP,
  TASK_INTERMEDIATE_XP,
  TASK_ADVANCED_XP,
  type Progress,
  type PracticeTask,
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

function getXPForTask(task: PracticeTask): number {
  if (task.difficulty === "beginner") return TASK_BEGINNER_XP;
  if (task.difficulty === "intermediate") return TASK_INTERMEDIATE_XP;
  return TASK_ADVANCED_XP;
}

export default function TaskPage() {
  const params = useParams();
  const id = Number(params.id);
  const task = practiceTasks.find((t) => t.id === id);

  const [progress, setProgress] = useState<Progress>(defaultProgress);
  const [isCelebrating, setIsCelebrating] = useState(false);

  useEffect(() => {
    setProgress(getProgress());
  }, []);

  if (!task || isNaN(id)) {
    return (
      <main className="flex-1 px-3 py-6 sm:px-4 sm:py-8 max-w-3xl mx-auto">
        <p className="text-[var(--color-text-muted)]">Task not found.</p>
        <Link href="/practice" className="text-[var(--color-accent)] underline mt-2 inline-block">
          Back to Practice
        </Link>
      </main>
    );
  }

  const unlocked = isPracticeTaskUnlocked(task, progress);
  const done = isTaskComplete(task.id, progress);

  if (!unlocked) {
    return (
      <main className="flex-1 px-3 py-6 sm:px-4 sm:py-8 max-w-3xl mx-auto">
        <p className="text-[var(--color-text-muted)]">
          Complete the previous tasks to unlock this one.
        </p>
        <Link href="/practice" className="text-[var(--color-accent)] underline mt-2 inline-block">
          Back to Practice
        </Link>
      </main>
    );
  }

  const handleTaskComplete = () => {
    if (done) return;
    const next: Progress = {
      ...progress,
      taskProgress: {
        ...progress.taskProgress,
        [task.id]: true,
      },
    };
    setProgress(next);
    setIsCelebrating(true);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
    setTimeout(() => setIsCelebrating(false), 800);
  };

  const xp = getXPForTask(task);
  const branchExample = getBranchName(task, "yourname");

  return (
    <LevelLayout title={task.title} level={task.id <= 3 ? task.id : undefined} hideHeader hideGradient>
      <p className="text-[var(--color-text-muted)] mb-10 text-lg">
        {task.description}
      </p>

      <div className="space-y-16">
        {/* Prerequisites */}
        <section className="glass-card border-[var(--color-accent)]/20 p-6">
          <h2 className="text-lg font-semibold mb-2 text-[var(--color-text)]">Before you start</h2>
          <p className="text-[var(--color-text-muted)] mb-4">
            Create your branch: <code className="bg-black/40 px-1.5 py-0.5 rounded text-sm font-mono">{branchExample}</code>
          </p>
          <CopyableCommand command={`git checkout -b ${branchExample}`} />
        </section>

        {task.difficulty === "beginner" ? (
          <BeginnerTaskContent task={task} />
        ) : (
          <LighterTaskContent task={task} />
        )}

        {/* Task complete */}
        <div className="pt-4">
          {isCelebrating ? (
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-accent)]/20 text-[var(--color-accent)]"
              role="status"
              aria-live="polite"
            >
              <span className="text-xl">🎉</span>
              <span className="font-medium">Task complete!</span>
              <span className="text-sm opacity-90">+{xp} XP</span>
            </div>
          ) : done ? (
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-400 text-sm font-medium">
                <span>✓</span> Task complete
              </span>
              <Link
                href="/practice"
                className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-[var(--color-accent)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Back to Practice →
              </Link>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleTaskComplete}
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-[var(--color-accent)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Task complete
            </button>
          )}
        </div>
      </div>
    </LevelLayout>
  );
}

function BeginnerTaskContent({ task }: { task: PracticeTask }) {
  const content = TASK_CONTENT[task.id];
  if (!content) return <LighterTaskContent task={task} />;
  return <div className="space-y-16">{content}</div>;
}

function LighterTaskContent({ task }: { task: PracticeTask }) {
  return (
    <div className="space-y-6">
      {task.file && (
        <section className="glass-card p-6">
          <h2 className="text-lg font-semibold mb-2 text-[var(--color-text)]">File(s) to edit</h2>
          <p className="text-sm text-[var(--color-text-muted)] font-mono">{task.file}</p>
        </section>
      )}
      {task.cursorPrompts && task.cursorPrompts.length > 0 && (
        <section className="glass-card p-6">
          <h2 className="text-lg font-semibold mb-2 text-[var(--color-text)]">Cursor prompts to try</h2>
          <ul className="text-sm text-[var(--color-text-muted)] space-y-2 list-disc list-inside">
            {task.cursorPrompts.map((prompt, i) => (
              <li key={i} className="italic">&quot;{prompt}&quot;</li>
            ))}
          </ul>
        </section>
      )}
      <section className="rounded-xl border border-white/10 bg-white/5 p-6">
        <h2 className="font-semibold text-[var(--color-text)] mb-2">When you&apos;re done</h2>
        <p className="text-sm text-[var(--color-text-muted)]">
          Commit, push, and open a PR. Use the branch <code className="bg-black/40 px-1 rounded">{task.branchPrefix}-yourname</code>.
        </p>
      </section>
    </div>
  );
}

const TASK_CONTENT: Record<number, React.ReactNode> = {
  2: (
    <>
      <section className="glass-card p-6 space-y-4">
        <h2 className="text-xl font-semibold text-[var(--color-text)]">Where to change the hero text</h2>
        <p className="text-[var(--color-text-muted)]">
          Headers live in <code className="bg-black/40 px-1 rounded">app/page.tsx</code> (Dashboard), <code className="bg-black/40 px-1 rounded">app/learn/page.tsx</code>, and other page files. Find an <code className="bg-black/40 px-1 rounded">h1</code> or heading and change the text.
        </p>
        <div className="rounded-lg bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 p-4">
          <p className="text-sm font-medium text-[var(--color-text)] mb-2">Ask Cursor:</p>
          <p className="text-sm text-[var(--color-text-muted)] italic">&quot;Change the main heading on the Dashboard to [your new text]&quot;</p>
        </div>
      </section>
    </>
  ),
  3: (
    <>
      <section className="glass-card p-6 space-y-4">
        <h2 className="text-xl font-semibold text-[var(--color-text)]">Change the accent color</h2>
        <p className="text-[var(--color-text-muted)]">
          Edit <code className="bg-black/40 px-1 rounded">app/globals.css</code>. Look for <code className="bg-black/40 px-1 rounded">--color-accent</code> and <code className="bg-black/40 px-1 rounded">--color-accent-muted</code>. Change them to any hex color (e.g. <code className="bg-black/40 px-1 rounded">#22c55e</code> for green).
        </p>
        <div className="rounded-lg bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 p-4">
          <p className="text-sm font-medium text-[var(--color-text)] mb-2">Ask Cursor:</p>
          <p className="text-sm text-[var(--color-text-muted)] italic">&quot;Change the accent color in globals.css to [color name or hex]&quot;</p>
        </div>
      </section>
    </>
  ),
  4: (
    <>
      <section className="glass-card p-6 space-y-4">
        <h2 className="text-xl font-semibold text-[var(--color-text)]">Add a new emoji</h2>
        <p className="text-[var(--color-text-muted)]">
          Edit <code className="bg-black/40 px-1 rounded">lib/emojiOfTheDay.ts</code>. The tile shows a single emoji. Add another option—you could change the emoji string, or add an array of emojis and pick one. Get creative!
        </p>
        <div className="rounded-lg bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 p-4">
          <p className="text-sm font-medium text-[var(--color-text)] mb-2">Ask Cursor:</p>
          <p className="text-sm text-[var(--color-text-muted)] italic">&quot;Add a new emoji option to the Emoji of the Day in lib/emojiOfTheDay.ts&quot;</p>
        </div>
      </section>
    </>
  ),
  5: (
    <>
      <section className="glass-card p-6 space-y-4">
        <h2 className="text-xl font-semibold text-[var(--color-text)]">Add a useless button</h2>
        <p className="text-[var(--color-text-muted)]">
          Edit <code className="bg-black/40 px-1 rounded">lib/playfulButtons.ts</code>. Add a new entry to the <code className="bg-black/40 px-1 rounded">playfulButtons</code> array with a <code className="bg-black/40 px-1 rounded">label</code> and optional <code className="bg-black/40 px-1 rounded">color</code>. The Button Menu tile will show it.
        </p>
        <div className="rounded-lg bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 p-4">
          <p className="text-sm font-medium text-[var(--color-text)] mb-2">Ask Cursor:</p>
          <p className="text-sm text-[var(--color-text-muted)] italic">&quot;Add a fun useless button to playfulButtons.ts with label [your idea]&quot;</p>
        </div>
      </section>
    </>
  ),
};
