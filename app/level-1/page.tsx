"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LevelLayout } from "@/components/LevelLayout";
import { WhatYoullSee } from "@/components/WhatYoullSee";
import { CopyableCommand } from "@/components/CopyableCommand";
import { STORAGE_KEY, defaultProgress, XP_PER_LEVEL, type Progress } from "@/lib/levels";

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

export default function Level1Page() {
  const [progress, setProgress] = useState<Progress>(defaultProgress);
  const [isCelebrating, setIsCelebrating] = useState(false);

  useEffect(() => {
    setProgress(getProgress());
  }, []);

  const isComplete = progress.level1.complete;

  const handleTaskComplete = () => {
    if (isComplete) return;
    const next: Progress = {
      ...progress,
      level1: { ...progress.level1, complete: true },
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

  return (
    <LevelLayout title="Your first PR" level={1} hideHeader hideGradient>
      <p className="text-[var(--color-text-muted)] mb-10 text-lg">
        You&apos;ll add your name to the contributors list on the Dashboard homepage and submit it as a pull request. We&apos;ll walk you through every step—no coding experience required.
      </p>

      <div className="space-y-16">
        {/* Prerequisites */}
        <section className="glass-card border-[var(--color-accent)]/20 p-6">
          <h2 className="text-lg font-semibold mb-2 text-[var(--color-text)]">Before you start</h2>
          <p className="text-[var(--color-text-muted)] mb-4">
            Make sure you&apos;ve completed the <Link href="/setup" className="text-[var(--color-accent)] underline">Setup</Link> page: clone the repo, install dependencies, and create your branch. If you haven&apos;t, do that first—we&apos;ll wait!
          </p>
        </section>

        {/* Step 1: Open in Cursor */}
        <section className="glass-card p-6 space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-[var(--color-accent)]/20 text-[var(--color-accent)] font-bold flex items-center justify-center">1</span>
            <h2 className="text-xl font-semibold text-[var(--color-text)]">Open the project in Cursor</h2>
          </div>
          <p className="text-[var(--color-text-muted)]">
            Open Cursor (or your code editor). Go to <strong className="text-[var(--color-text)]">File → Open Folder</strong> and select the <code className="bg-black/40 px-1.5 py-0.5 rounded text-sm">pr-quest</code> folder—the one you cloned during Setup. You should see a list of files and folders in the left sidebar.
          </p>
        </section>

        {/* Step 2: Make the code change */}
        <section className="glass-card p-6 space-y-6">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-[var(--color-accent)]/20 text-[var(--color-accent)] font-bold flex items-center justify-center">2</span>
            <h2 className="text-xl font-semibold text-[var(--color-text)]">Add your name to the list</h2>
          </div>
          <p className="text-[var(--color-text-muted)]">
            The file contains a list of names. You&apos;ll add yours. Don&apos;t worry—you&apos;re just adding a line of text. Here&apos;s what to do:
          </p>

          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-[var(--color-text)] mb-2">What you&apos;ll see (before):</p>
              <pre className="p-4 rounded-lg bg-black/40 text-sm font-mono text-[var(--color-text)] overflow-x-auto">
{`export const contributorsList: string[] = [
  "Add your name here! (Edit lib/contributors.ts and open a PR)",
];`}
              </pre>
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--color-text)] mb-2">What to change it to (after):</p>
              <pre className="p-4 rounded-lg bg-black/40 text-sm font-mono text-[var(--color-text)] overflow-x-auto">
{`export const contributorsList: string[] = [
  "Add your name here! (Edit lib/contributors.ts and open a PR)",
  "Your Name",
];`}
              </pre>
            </div>
          </div>

          <div className="rounded-lg bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 p-4">
            <p className="text-sm font-medium text-[var(--color-text)] mb-2">Ask Cursor to do it:</p>
            <p className="text-sm text-[var(--color-text-muted)] mb-2">
              Open the Cursor chat (Cmd+L or Ctrl+L) and try one of these:
            </p>
            <ul className="text-sm text-[var(--color-text-muted)] space-y-1 list-disc list-inside">
              <li><em>&quot;Add my name [Your Name] to the contributors list in lib/contributors.ts&quot;</em></li>
              <li><em>&quot;Add a new entry to the contributorsList array in contributors.ts with my name&quot;</em></li>
              <li><em>&quot;Add [Your Name] to the contributors list in contributors.ts&quot;</em></li>
            </ul>
          </div>

          <div className="rounded-lg bg-white/5 border border-white/10 p-4">
            <p className="text-sm font-medium text-[var(--color-text)] mb-2">Or do it manually:</p>
            <ol className="text-sm text-[var(--color-text-muted)] space-y-2 list-decimal list-inside">
              <li>Click after the closing <code className="bg-black/40 px-1 rounded">]</code> of the first line (the one with &quot;Add your name here&quot;).</li>
              <li>Press <strong className="text-[var(--color-text)]">Enter</strong> to create a new line.</li>
              <li>Type a comma <code className="bg-black/40 px-1 rounded">,</code> at the end of the line you just left.</li>
              <li>On the new line, type your name in quotes: <code className="bg-black/40 px-1 rounded">&quot;Your Name&quot;</code> (replace with your actual name).</li>
              <li>Press <strong className="text-[var(--color-text)]">Cmd+S</strong> (Mac) or <strong className="text-[var(--color-text)]">Ctrl+S</strong> (Windows) to save.</li>
            </ol>
          </div>

        </section>

        {/* Step 3: See your change */}
        <section className="glass-card p-6 space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-[var(--color-accent)]/20 text-[var(--color-accent)] font-bold flex items-center justify-center">3</span>
            <h2 className="text-xl font-semibold text-[var(--color-text)]">See your change in the app</h2>
          </div>
          <p className="text-[var(--color-text-muted)]">
            Before submitting, let&apos;s make sure your change looks right. Run the app and open the Dashboard.
          </p>
          <p className="text-sm text-[var(--color-text-muted)]">
            In the terminal (or Cursor&apos;s integrated terminal), run:
          </p>
          <CopyableCommand command="npm run dev" />
          <p className="text-sm text-[var(--color-text-muted)]">
            Then open <a href="http://localhost:3000" target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent)] underline">http://localhost:3000</a> (the Dashboard) in your browser. You should see your name in the Contributors tile on the homepage. If you do, you&apos;re ready for the next step!
          </p>
        </section>

        {/* Step 4: Commit and push */}
        <section className="glass-card p-6 space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-[var(--color-accent)]/20 text-[var(--color-accent)] font-bold flex items-center justify-center">4</span>
            <h2 className="text-xl font-semibold text-[var(--color-text)]">Commit and push your changes</h2>
          </div>
          <p className="text-[var(--color-text-muted)]">
            Now you&apos;ll save your change to Git and send it to GitHub.
          </p>

          <div className="rounded-lg bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 p-4">
            <p className="text-sm font-medium text-[var(--color-text)] mb-2">Ask Cursor to do it:</p>
            <p className="text-sm text-[var(--color-text-muted)] mb-2">
              In Cursor chat, try one of these (replace <code className="bg-black/40 px-1 rounded">yourname</code> with your branch name, e.g. <code className="bg-black/40 px-1 rounded">task1-jane</code>):
            </p>
            <ul className="text-sm text-[var(--color-text-muted)] space-y-1 list-disc list-inside">
              <li><em>&quot;Commit and push lib/contributors.ts with the message [First PR] Add my name to contributors. My branch is task1-yourname&quot;</em></li>
              <li><em>&quot;Help me add, commit, and push lib/contributors.ts to my branch task1-yourname&quot;</em></li>
              <li><em>&quot;Run the git commands to commit and push my changes to GitHub—I changed lib/contributors.ts and my branch is task1-yourname&quot;</em></li>
            </ul>
          </div>

          <div className="rounded-lg bg-white/5 border border-white/10 p-4">
            <p className="text-sm font-medium text-[var(--color-text)] mb-2">Or run the commands manually:</p>
            <div className="space-y-3 mt-2">
              <div>
                <p className="text-xs text-[var(--color-text-muted)] mb-1">Stage the file you changed</p>
                <CopyableCommand command="git add lib/contributors.ts" />
              </div>
              <div>
                <p className="text-xs text-[var(--color-text-muted)] mb-1">Save with a message</p>
                <CopyableCommand command='git commit -m "[First PR] Add my name to contributors"' />
              </div>
              <div>
                <p className="text-xs text-[var(--color-text-muted)] mb-1">Upload to GitHub</p>
                <CopyableCommand command="git push -u origin task1-yourname" />
              </div>
            </div>
          </div>
        </section>

        {/* Step 5: Open the PR */}
        <section className="glass-card p-6 space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-[var(--color-accent)]/20 text-[var(--color-accent)] font-bold flex items-center justify-center">5</span>
            <h2 className="text-xl font-semibold text-[var(--color-text)]">Open your pull request</h2>
          </div>
          <p className="text-[var(--color-text-muted)]">
            Go to the repo on GitHub in your browser. You&apos;ll see a yellow banner that says <strong className="text-[var(--color-text)]">&quot;Compare & pull request&quot;</strong>. Click it. Fill in the title and description (use the PR template if there is one), then click <strong className="text-[var(--color-text)]">Create pull request</strong>.
          </p>
          <WhatYoullSee
            title="What you'll see on GitHub"
            caption="Paste your title at the top, description in the box, then click Create pull request."
            labels={[
              { text: "Title: e.g. [First PR] Add my name to contributors", position: "top" },
              { text: "Description (use the PR template)", position: "top" },
              { text: "Create pull request button", position: "bottom" },
            ]}
          />
          <p className="text-sm text-[var(--color-text-muted)]">
            Use the{" "}
            <Link href="https://github.com/elan-asselstine-braze/pr-quest/blob/main/PR_TEMPLATE.md" className="text-[var(--color-accent)] underline" target="_blank" rel="noopener noreferrer">
              PR template
            </Link>{" "}
            if your repo has one.
          </p>
        </section>

        {/* Need help? */}
        <section className="rounded-xl border border-white/10 bg-white/5 p-6">
          <h2 className="font-semibold text-[var(--color-text)] mb-2">Need help?</h2>
          <p className="text-sm text-[var(--color-text-muted)] mb-2">
            Stuck on a step? In Cursor, you can ask: <em>&quot;Help me add my name to the contributors list in lib/contributors.ts&quot;</em> or <em>&quot;I get an error when I run git push—what does it mean?&quot;</em>
          </p>
          <Link href="/" className="text-sm text-[var(--color-accent)] underline">
            View the Dashboard →
          </Link>
        </section>

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
              <span className="text-sm opacity-90">+{XP_PER_LEVEL} XP</span>
            </div>
          ) : isComplete ? (
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-400 text-sm font-medium">
                <span>✓</span> Task complete
              </span>
              <Link
                href="/practice"
                className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-[var(--color-accent)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
              >
                New tasks unlocked! →
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
