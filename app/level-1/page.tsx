"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LevelLayout } from "@/components/LevelLayout";
import { WhatYoullSee } from "@/components/WhatYoullSee";
import { StepImage } from "@/components/StepImage";
import { CopyableCommand } from "@/components/CopyableCommand";
import { STORAGE_KEY, defaultProgress, XP_PER_LEVEL, REPO_URL, type Progress } from "@/lib/levels";

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
        You&apos;ll add your name to the contributors list and submit it as a pull request. Follow all 6 steps in order.
      </p>

      <div className="space-y-16">
        {/* Prerequisites */}
        <section className="glass-card border-[var(--color-accent)]/20 p-6">
          <h2 className="text-lg font-semibold mb-2 text-[var(--color-text)]">Before you start</h2>
          <p className="text-[var(--color-text-muted)] mb-4">
            Make sure you&apos;ve completed the <Link href="/setup" className="text-[var(--color-accent)] underline">Setup</Link> page: clone, install, and open the project in Cursor. If you haven&apos;t, do that first—we&apos;ll wait!
          </p>
        </section>

        {/* Step 1: Create your branch */}
        <section id="step-1" className="glass-card p-6 space-y-4 scroll-mt-4">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-[var(--color-accent)] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M6 3v12" />
              <path d="M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
              <path d="M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
              <path d="M15 6a9 9 0 0 0-9 9" />
            </svg>
            <p className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Step one</p>
          </div>
          <h2 className="text-sm font-bold text-[var(--color-text)] -mt-1">Create your branch</h2>
          <p className="text-lg text-[var(--color-text)] leading-relaxed">
            Branches isolate your changes from the main codebase so you can work safely and submit a clean PR.
          </p>
          <p className="text-sm text-[var(--color-text-muted)]">
            Replace <code className="bg-black/40 px-1.5 py-0.5 rounded text-sm">yourname</code> with your name (e.g. <code className="bg-black/40 px-1.5 py-0.5 rounded text-sm">task1-jane</code>).
          </p>

          <div className="rounded-lg bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 p-4">
            <p className="text-sm font-medium text-[var(--color-text)] mb-2">Ask Cursor to do it:</p>
            <p className="text-sm text-[var(--color-text-muted)] mb-2">
              Open the Cursor chat (Cmd+L or Ctrl+L) and try one of these:
            </p>
            <ul className="text-sm text-[var(--color-text-muted)] space-y-1 list-disc list-inside">
              <li><em>&quot;Create a new branch called task1-[YourName] for my first PR&quot;</em></li>
              <li><em>&quot;Create branch task1-yourname for me&quot;</em></li>
              <li><em>&quot;Help me create a branch for this task. Use task1-[my name]&quot;</em></li>
            </ul>
          </div>

          <div className="rounded-lg bg-white/5 border border-white/10 p-4">
            <p className="text-sm font-medium text-[var(--color-text)] mb-2">Or run the command manually:</p>
            <CopyableCommand command="git checkout -b task1-yourname" />
          </div>
        </section>

        {/* Step 2: Make the code change */}
        <section id="step-2" className="glass-card p-6 space-y-6 scroll-mt-4">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-[var(--color-accent)] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            <p className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Step two</p>
          </div>
          <h2 className="text-sm font-bold text-[var(--color-text)] -mt-1">Add your name to the list</h2>
          <p className="text-lg text-[var(--color-text)] leading-relaxed">
            A simple edit like this lets you practice the full PR workflow without touching complex code.
          </p>
          <p className="text-sm text-[var(--color-text-muted)]">
            Open <code className="bg-black/40 px-1.5 py-0.5 rounded text-sm">lib/contributors.ts</code> and add your name to the array. Options:
          </p>

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

          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-[var(--color-text)] mb-2">In the code (look for this slot):</p>
              <pre className="p-4 rounded-lg bg-black/40 text-sm font-mono text-[var(--color-text)] overflow-x-auto">
{`export const contributorsList: string[] = [
  "Élan Asselstine",
  "Add your name here! (Edit lib/contributors.ts and open a PR)",
  "YOUR_NAME_HERE",
];`}
              </pre>
              <p className="text-xs text-[var(--color-text-muted)] mt-2">
                The <code className="bg-black/40 px-1 rounded">YOUR_NAME_HERE</code> line won&apos;t show on the Dashboard until you replace it with a real name.
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--color-text)] mb-2">After you edit:</p>
              <pre className="p-4 rounded-lg bg-black/40 text-sm font-mono text-[var(--color-text)] overflow-x-auto">
{`export const contributorsList: string[] = [
  "Élan Asselstine",
  "Add your name here! (Edit lib/contributors.ts and open a PR)",
  "Alex Kim",
];`}
              </pre>
            </div>
          </div>

          <div className="rounded-lg bg-white/5 border border-white/10 p-4">
            <p className="text-sm font-medium text-[var(--color-text)] mb-2">Or do it manually:</p>
            <ol className="text-sm text-[var(--color-text-muted)] space-y-2 list-decimal list-inside">
              <li>Open <code className="bg-black/40 px-1 rounded">lib/contributors.ts</code>.</li>
              <li>Find <code className="bg-black/40 px-1 rounded">YOUR_NAME_HERE</code> and replace it with your name in quotes, e.g. <code className="bg-black/40 px-1 rounded">&quot;Alex Kim&quot;</code>.</li>
              <li>Press <strong className="text-[var(--color-text)]">Cmd+S</strong> (Mac) or <strong className="text-[var(--color-text)]">Ctrl+S</strong> (Windows) to save.</li>
            </ol>
          </div>

        </section>

        {/* Step 3: See your change */}
        <section id="step-3" className="glass-card p-6 space-y-4 scroll-mt-4">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-[var(--color-accent)] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <p className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Step three</p>
          </div>
          <h2 className="text-sm font-bold text-[var(--color-text)] -mt-1">See your change in the app</h2>
          <p className="text-lg text-[var(--color-text)] leading-relaxed">
            Verifying locally before submitting helps catch mistakes and builds confidence.
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
        <section id="step-4" className="glass-card p-6 space-y-4 scroll-mt-4">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-[var(--color-accent)] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <p className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Step four</p>
          </div>
          <h2 className="text-sm font-bold text-[var(--color-text)] -mt-1">Commit and push your changes</h2>
          <p className="text-lg text-[var(--color-text)] leading-relaxed">
            Git tracks your changes; pushing sends them to GitHub so you can open a PR.
          </p>
          <p className="text-sm text-[var(--color-text-muted)]">
            If your PR later shows merge conflicts with <code className="bg-black/40 px-1 rounded">main</code>, you can resolve them on GitHub during review—no need to merge <code className="bg-black/40 px-1 rounded">main</code> locally in this step.
          </p>

          <div className="rounded-lg bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 p-4">
            <p className="text-sm font-medium text-[var(--color-text)] mb-2">Ask Cursor:</p>
            <p className="text-sm text-[var(--color-text-muted)]">
              <em>&quot;Help me commit and push my contributors change.&quot;</em>
            </p>
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
        <section id="step-5" className="glass-card p-6 space-y-4 scroll-mt-4">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-[var(--color-accent)] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M18 15a3 3 0 0 0-6 0" />
              <path d="M18 15v3a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-3" />
              <path d="M6 9a3 3 0 0 0 6 0" />
              <path d="M6 9v3a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-3" />
              <line x1="12" y1="9" x2="12" y2="15" />
              <path d="M8 12h8" />
            </svg>
            <p className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Step five</p>
          </div>
          <h2 className="text-sm font-bold text-[var(--color-text)] -mt-1">Open your pull request</h2>
          <p className="text-lg text-[var(--color-text)] leading-relaxed">
            The PR is your request to merge—it&apos;s how collaborators review and integrate your work.
          </p>
          <p className="text-[var(--color-text-muted)]">
            Two ways to get there:
          </p>
          <ol className="text-sm text-[var(--color-text-muted)] space-y-2 list-decimal list-inside">
            <li>
              <strong className="text-[var(--color-text)]">Follow the links in Cursor.</strong> After you push, Cursor often shows a link to open your PR on GitHub—click it.
            </li>
            <li>
              <strong className="text-[var(--color-text)]">Navigate to GitHub.</strong>{" "}
              <Link href={REPO_URL} target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent)] underline">
                Go to the repo on GitHub
              </Link>{" "}
              in your browser. You&apos;ll see a yellow banner that says <strong className="text-[var(--color-text)]">&quot;Compare & pull request&quot;</strong>. Click it.
            </li>
          </ol>
          <StepImage
            src="/images/step-6-github-banner.png"
            alt="GitHub recent push banner with Compare & pull request button"
            description="Yellow banner after pushing: click Compare & pull request"
          />
          <p className="text-[var(--color-text-muted)]">
            Fill in the title and description (use the PR template if there is one), then click <strong className="text-[var(--color-text)]">Create pull request</strong>.
          </p>
          <WhatYoullSee
            title="What you'll see on GitHub"
            src="/images/step-6-pr-screen.png"
            caption="Paste your title at the top, description in the box, then click Create pull request."
            labels={[
              { text: "Title: e.g. [First PR] Add my name to contributors", position: "top" },
              { text: "Description (use the PR template)", position: "top" },
              { text: "Create pull request button", position: "bottom" },
            ]}
          />
          <p className="text-sm text-[var(--color-text-muted)]">
            Use the{" "}
            <Link href={`${REPO_URL}/blob/main/pull_request_template.md`} className="text-[var(--color-accent)] underline" target="_blank" rel="noopener noreferrer">
              PR template
            </Link>{" "}
            if your repo has one.
          </p>
        </section>

        {/* Step 6: Approve and merge your PR (optional) */}
        <section id="step-6" className="glass-card p-6 space-y-4 scroll-mt-4">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-[var(--color-accent)] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <p className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Step six</p>
          </div>
          <h2 className="text-sm font-bold text-[var(--color-text)] -mt-1">Approve and merge your PR <span className="font-normal text-[var(--color-text-muted)]">(optional)</span></h2>
          <p className="text-lg text-[var(--color-text)] leading-relaxed">
            If you see the option to approve and merge your PR, you can do it to complete the full workflow:
          </p>
          <ol className="text-sm text-[var(--color-text-muted)] space-y-2 list-decimal list-inside">
            <li>Click the <strong className="text-[var(--color-text)]">Files changed</strong> tab.</li>
            <li>Click the green <strong className="text-[var(--color-text)]">Review changes</strong> button (top right).</li>
            <li>Select <strong className="text-[var(--color-text)]">Approve</strong> from the dropdown.</li>
            <li>Add an optional comment (e.g. &quot;Looks good!&quot;), then click <strong className="text-[var(--color-text)]">Submit review</strong>.</li>
            <li>If a merge button appears, click it. You&apos;ve completed your first PR! 🎉</li>
          </ol>
          <p className="text-sm font-bold text-[var(--color-text)]">
            Don&apos;t see the option to approve or merge?
          </p>
          <p className="text-sm text-[var(--color-text-muted)]">
            Branch protection or permissions can hide merge for some people. <strong className="text-[var(--color-text)]">Slack Élan Asselstine</strong> and they can help or merge for you.
          </p>
        </section>

        {/* Need help? */}
        <section className="rounded-xl border border-white/10 bg-white/5 p-6">
          <h2 className="font-semibold text-[var(--color-text)] mb-2">Need help?</h2>
          <p className="text-sm text-[var(--color-text-muted)] mb-2">
            Stuck on a step? In Cursor, you can ask: <em>&quot;Help me add my name to the contributors list in lib/contributors.ts&quot;</em> or <em>&quot;I get an error when I run git push—what does it mean?&quot;</em> If the Vercel build fails on your PR, you can still approve it—ask a maintainer to merge.
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
