"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SETUP_COMPLETE_KEY, REPO_URL } from "@/lib/levels";
import { CopyableCommand } from "@/components/CopyableCommand";

const SETUP_STEPS_KEY = "pr-quest-setup-steps";

function getSetupComplete(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(SETUP_COMPLETE_KEY) === "true";
  } catch {
    return false;
  }
}

function getSetupSteps(): boolean[] {
  if (typeof window === "undefined") return [false, false, false, false];
  try {
    const raw = localStorage.getItem(SETUP_STEPS_KEY);
    if (!raw) return [false, false, false, false];
    const parsed = JSON.parse(raw) as boolean[];
    return Array.isArray(parsed) && parsed.length >= 4 ? parsed : [false, false, false, false];
  } catch {
    return [false, false, false, false];
  }
}

export default function SetupPage() {
  const [isComplete, setIsComplete] = useState(false);
  const [stepComplete, setStepComplete] = useState<boolean[]>([false, false, false, false]);

  useEffect(() => {
    setIsComplete(getSetupComplete());
    setStepComplete(getSetupSteps());
  }, []);

  const handleStepClick = (index: number) => {
    const next = [...stepComplete];
    next[index] = !next[index];
    setStepComplete(next);
    try {
      localStorage.setItem(SETUP_STEPS_KEY, JSON.stringify(next));
      if (index === 3 && next[3] && !isComplete) {
        localStorage.setItem(SETUP_COMPLETE_KEY, "true");
        setIsComplete(true);
      }
    } catch {
      // ignore
    }
  };

  return (
    <main className="flex-1 px-3 py-6 sm:px-4 sm:py-8 max-w-3xl mx-auto w-full min-w-0">
      <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-[var(--color-text)]">
        Setup
      </h1>
      <p className="text-sm text-[var(--color-text-muted)] mb-6">
        Follow these 4 steps in order. Don&apos;t skip any!
      </p>

      <div className="mb-8 rounded-xl border border-white/10 bg-white/5 p-4">
        <h2 className="font-semibold text-[var(--color-text)] mb-3">Before you start</h2>
        <p className="text-sm text-[var(--color-text-muted)] mb-3">
          You&apos;ll run commands in a <strong className="text-[var(--color-text)]">terminal</strong>—a
          text-based way to control your computer. Here&apos;s what you need:
        </p>
        <ul className="text-sm text-[var(--color-text-muted)] space-y-2 list-disc list-inside">
          <li>
            <strong className="text-[var(--color-text)]">Open a terminal:</strong> Open{" "}
            <span className="font-mono text-xs bg-black/40 px-1 rounded">Terminal</span> (search in
            Spotlight).
          </li>
          <li>
            <strong className="text-[var(--color-text)]">Install Git</strong> (if needed):{" "}
            <a
              href="https://git-scm.com/downloads"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-accent)] hover:underline"
            >
              Download Git
            </a>
            . Check with <span className="font-mono text-xs bg-black/40 px-1 rounded">git --version</span>.
          </li>
          <li>
            <strong className="text-[var(--color-text)]">Install Node.js</strong> (if needed):{" "}
            <a
              href="https://nodejs.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-accent)] hover:underline"
            >
              Download Node.js
            </a>
            . Check with <span className="font-mono text-xs bg-black/40 px-1 rounded">node --version</span>.
          </li>
          <li>
            <strong className="text-[var(--color-text)]">Install GitHub CLI</strong> (recommended for pushing):{" "}
            <a
              href="https://cli.github.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-accent)] hover:underline"
            >
              Install gh
            </a>
            . On Mac: <span className="font-mono text-xs bg-black/40 px-1 rounded">brew install gh</span>. Then run <span className="font-mono text-xs bg-black/40 px-1 rounded">gh auth login</span> so Git can push without credential errors.
          </li>
        </ul>
        <p className="text-sm text-[var(--color-text-muted)] mt-3 pt-3 border-t border-white/10">
          <strong className="text-[var(--color-text)]">Tip:</strong> Not sure if Git and Node are installed? In Cursor, ask: <em>&quot;Check if Git and Node are installed on my machine, and help me set them up if they&apos;re not.&quot;</em> Cursor can run the checks and guide you through installation.
        </p>
      </div>

      <div className="space-y-6">
        <section className="glass-card p-6 flex gap-4">
          <div className="w-8 shrink-0 flex justify-center pt-0.5">
            <button
              type="button"
              onClick={() => handleStepClick(0)}
              className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                stepComplete[0]
                  ? "border-emerald-500 bg-emerald-500 text-emerald-400"
                  : "border-[var(--color-text-muted)]/80 hover:border-[var(--color-accent)]/70"
              }`}
              aria-label={stepComplete[0] ? "Step 1 complete" : "Mark step 1 complete"}
            >
              {stepComplete[0] && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
          </div>
          <div className="flex-1 min-w-0">
            <div className="mb-1">
              <h2 className="text-lg font-semibold text-[var(--color-text)]">Go to a folder for the project</h2>
              <p className="text-sm text-[var(--color-text-muted)] mt-0.5">You can use <span className="font-mono bg-white/10 px-1 rounded">~/Documents</span> or any other folder instead.</p>
            </div>
            <div className="mt-3">
              <CopyableCommand command="cd ~/Desktop" />
            </div>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              <strong className="text-[var(--color-text)]">Why:</strong> The terminal needs to be &quot;in&quot; a folder before you can clone. This puts you somewhere you can find easily (Desktop).
            </p>
          </div>
        </section>

        <section className="glass-card p-6 flex gap-4">
          <div className="w-8 shrink-0 flex justify-center pt-0.5">
            <button
              type="button"
              onClick={() => handleStepClick(1)}
              className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                stepComplete[1]
                  ? "border-emerald-500 bg-emerald-500 text-emerald-400"
                  : "border-[var(--color-text-muted)]/80 hover:border-[var(--color-accent)]/70"
              }`}
              aria-label={stepComplete[1] ? "Step 2 complete" : "Mark step 2 complete"}
            >
              {stepComplete[1] && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-3">Clone the repo</h2>
            <CopyableCommand command={`git clone ${REPO_URL}.git`} />
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              <strong className="text-[var(--color-text)]">Why:</strong> Cloning downloads a full copy of the project to your computer so you can edit files and push your changes.
            </p>
          </div>
        </section>

        <section className="glass-card p-6 flex gap-4">
          <div className="w-8 shrink-0 flex justify-center pt-0.5">
            <button
              type="button"
              onClick={() => handleStepClick(2)}
              className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                stepComplete[2]
                  ? "border-emerald-500 bg-emerald-500 text-emerald-400"
                  : "border-[var(--color-text-muted)]/80 hover:border-[var(--color-accent)]/70"
              }`}
              aria-label={stepComplete[2] ? "Step 3 complete" : "Mark step 3 complete"}
            >
              {stepComplete[2] && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-3">Enter the project and install</h2>
            <CopyableCommand command="cd pr-quest && npm install" />
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              <strong className="text-[var(--color-text)]">Why:</strong> the app depends on external packages (libraries). <span className="font-mono bg-white/10 px-1 rounded">npm install</span> downloads them so you can run the app locally.
            </p>
          </div>
        </section>

        <section className="glass-card p-6 flex gap-4">
          <div className="w-8 shrink-0 flex justify-center pt-0.5">
            <button
              type="button"
              onClick={() => handleStepClick(3)}
              className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                stepComplete[3]
                  ? "border-emerald-500 bg-emerald-500 text-emerald-400"
                  : "border-[var(--color-text-muted)]/80 hover:border-[var(--color-accent)]/70"
              }`}
              aria-label={stepComplete[3] ? "Step 4 complete" : "Mark step 4 complete"}
            >
              {stepComplete[3] && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-3">Open the project in Cursor</h2>
            <p className="text-sm text-[var(--color-text-muted)]">
              Open Cursor → <strong className="text-[var(--color-text)]">File → Open Folder</strong> → select the <code className="bg-black/40 px-1.5 py-0.5 rounded">pr-quest</code> folder. You should see files and folders in the left sidebar.
            </p>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              <strong className="text-[var(--color-text)]">Why:</strong> You need an editor to change files, and Cursor can help you with AI. Opening the folder loads the project so you can browse and edit.
            </p>
          </div>
        </section>
      </div>

      <div className="mt-6">
        {isComplete && (
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-400 text-sm font-medium">
              <span>✓</span> Setup complete
            </span>
            <Link
              href="/level-1"
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-[var(--color-accent)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Let&apos;s submit your first PR!
            </Link>
          </div>
        )}
      </div>

      <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-4">
        <h2 className="font-semibold text-[var(--color-text)] mb-2">Troubleshooting</h2>
        <ul className="text-sm text-[var(--color-text-muted)] space-y-2">
          <li>
            <strong className="text-[var(--color-text)]">&quot;command not found&quot;</strong> — Git or Node isn&apos;t installed or isn&apos;t in your PATH. Install from the links above and restart the terminal.
          </li>
          <li>
            <strong className="text-[var(--color-text)]">&quot;Permission denied&quot;</strong> — Try a different folder (e.g. <span className="font-mono text-xs bg-black/40 px-1 rounded">~/Desktop</span>).
          </li>
          <li>
            <strong className="text-[var(--color-text)]">Mac: Xcode license</strong> — If Git asks you to accept a license, run <span className="font-mono text-xs bg-black/40 px-1 rounded">xcode-select --install</span> first, or install Git from git-scm.com.
          </li>
          <li>
            <strong className="text-[var(--color-text)]">Push failed (no credentials)</strong> — Install <a href="https://cli.github.com/" target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent)] hover:underline">GitHub CLI</a> and run <span className="font-mono text-xs bg-black/40 px-1 rounded">gh auth login</span>. This configures Git to use authenticated HTTPS so pushes work.
          </li>
        </ul>
      </div>
    </main>
  );
}
