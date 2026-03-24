"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { LevelLayout } from "@/components/LevelLayout";
import { CopyableCommand } from "@/components/CopyableCommand";
import {
  practiceTasks,
  REPO_URL,
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
  return (
    <div className="space-y-16">
      {content}
      <SubmitPRSection task={task} />
    </div>
  );
}

function SubmitPRSection({ task }: { task: PracticeTask }) {
  const branchExample = getBranchName(task, "yourname");
  const commitMsg = `[Task ${task.id}] ${task.title}`;

  return (
    <>
      <section className="glass-card p-6 space-y-4">
        <h2 className="text-xl font-semibold text-[var(--color-text)]">Preview your changes</h2>
        <p className="text-[var(--color-text-muted)]">
          Before submitting, run the app and check your changes in the browser.
        </p>
        <CopyableCommand command="npm run dev" />
        <p className="text-sm text-[var(--color-text-muted)]">
          Open <a href="http://localhost:3000" target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent)] underline">localhost:3000</a> and verify everything looks right.
        </p>
      </section>

      <section className="glass-card p-6 space-y-6">
        <h2 className="text-xl font-semibold text-[var(--color-text)]">Submit your PR</h2>
        <p className="text-[var(--color-text-muted)]">
          Once your changes look good, commit, push, and open a pull request.
        </p>

        <div className="rounded-lg bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 p-4">
          <p className="text-sm font-medium text-[var(--color-text)] mb-2">Ask Cursor to do it:</p>
          <p className="text-sm text-[var(--color-text-muted)] mb-2">
            In Cursor chat, try: <em>&quot;Commit and push my changes with message &apos;{commitMsg}&apos;. My branch is {branchExample}.&quot;</em>
          </p>
        </div>

        <div className="rounded-lg bg-white/5 border border-white/10 p-4">
          <p className="text-sm font-medium text-[var(--color-text)] mb-3">Or run the commands manually:</p>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-[var(--color-text-muted)] mb-1">1. Stage your changes</p>
              <CopyableCommand command="git add ." />
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-muted)] mb-1">2. Commit with a message</p>
              <CopyableCommand command={`git commit -m "${commitMsg}"`} />
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-muted)] mb-1">3. Push to GitHub</p>
              <CopyableCommand command={`git push -u origin ${branchExample}`} />
            </div>
          </div>
        </div>
      </section>

      <section className="glass-card p-6 space-y-4">
        <h3 className="text-lg font-semibold text-[var(--color-text)]">4. Open your pull request</h3>
        <p className="text-[var(--color-text-muted)]">
          <Link href={REPO_URL} target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent)] underline">
            Go to the repo on GitHub
          </Link>
          . You&apos;ll see a yellow banner: <strong className="text-[var(--color-text)]">&quot;Compare &amp; pull request&quot;</strong>. Click it, fill in the title and description (use the PR template if there is one), then click <strong className="text-[var(--color-text)]">Create pull request</strong>.
        </p>
      </section>

      <section className="glass-card p-6 space-y-4">
        <h3 className="text-lg font-semibold text-[var(--color-text)]">5. Review and merge your PR <span className="font-normal text-[var(--color-text-muted)]">(optional)</span></h3>
        <p className="text-[var(--color-text-muted)]">
          If you see the option to approve and merge: click <strong className="text-[var(--color-text)]">Files changed</strong>, then the green <strong className="text-[var(--color-text)]">Review changes</strong> button, select <strong className="text-[var(--color-text)]">Approve</strong>, add an optional comment, and click <strong className="text-[var(--color-text)]">Submit review</strong>. The PR will merge automatically once approved. <strong className="text-[var(--color-text)]">Don&apos;t see it?</strong> That&apos;s normal for PRs from forks—Slack Élan Asselstine and they&apos;ll merge it for you.
        </p>
      </section>
    </>
  );
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
        <p className="text-sm text-[var(--color-text-muted)] mb-2">
          Run <code className="bg-black/40 px-1 rounded">npm run dev</code> to preview, then commit, push, and open a PR. Use the branch <code className="bg-black/40 px-1 rounded">{task.branchPrefix}-yourname</code>. If you see the option to approve and merge: <strong className="text-[var(--color-text)]">Files changed</strong> → <strong className="text-[var(--color-text)]">Review changes</strong> → <strong className="text-[var(--color-text)]">Approve</strong> → <strong className="text-[var(--color-text)]">Submit review</strong>. Don&apos;t see it? Slack Élan Asselstine and they&apos;ll merge it for you.
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
  13: (
    <>
      <section className="glass-card p-6 space-y-4">
        <h2 className="text-xl font-semibold text-[var(--color-text)]">Add a Fun Fact card</h2>
        <p className="text-[var(--color-text-muted)]">
          Create a new tile component (e.g. <code className="bg-black/40 px-1 rounded">FunFactTile.tsx</code>) that displays a fun fact. Add it to the dashboard grid in <code className="bg-black/40 px-1 rounded">app/page.tsx</code>. Follow the pattern of EmojiOfTheDayTile or ContributorsTile.
        </p>
        <div className="rounded-lg bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 p-4">
          <p className="text-sm font-medium text-[var(--color-text)] mb-2">Ask Cursor:</p>
          <p className="text-sm text-[var(--color-text-muted)] italic">&quot;Create a FunFactTile component and add it to the dashboard&quot;</p>
        </div>
      </section>
    </>
  ),
  14: (
    <>
      <section className="glass-card p-6 space-y-4">
        <h2 className="text-xl font-semibold text-[var(--color-text)]">Add Quote of the Day</h2>
        <p className="text-[var(--color-text-muted)]">
          Create <code className="bg-black/40 px-1 rounded">lib/quoteOfTheDay.ts</code> similar to <code className="bg-black/40 px-1 rounded">emojiOfTheDay.ts</code>—export a quote string. Add a <code className="bg-black/40 px-1 rounded">QuoteOfTheDayTile</code> component and include it in the dashboard. Users can change the quote via PR.
        </p>
        <div className="rounded-lg bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 p-4">
          <p className="text-sm font-medium text-[var(--color-text)] mb-2">Ask Cursor:</p>
          <p className="text-sm text-[var(--color-text-muted)] italic">&quot;Create quoteOfTheDay and a QuoteOfTheDayTile like the emoji tile&quot;</p>
        </div>
      </section>
    </>
  ),
};
