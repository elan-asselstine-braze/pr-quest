"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SETUP_COMPLETE_KEY, SETUP_XP, REPO_URL } from "@/lib/levels";
import { CopyableCommand } from "@/components/CopyableCommand";

function getSetupComplete(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(SETUP_COMPLETE_KEY) === "true";
  } catch {
    return false;
  }
}

export default function SetupPage() {
  const [isComplete, setIsComplete] = useState(false);
  const [isCelebrating, setIsCelebrating] = useState(false);

  useEffect(() => {
    setIsComplete(getSetupComplete());
  }, []);

  const handleMarkComplete = () => {
    if (isComplete) return;
    try {
      localStorage.setItem(SETUP_COMPLETE_KEY, "true");
      setIsComplete(true);
      setIsCelebrating(true);
      setTimeout(() => setIsCelebrating(false), 800);
    } catch {
      // ignore
    }
  };

  return (
    <main className="flex-1 px-3 py-6 sm:px-4 sm:py-8 max-w-3xl mx-auto w-full min-w-0">
      <h1 className="text-2xl sm:text-3xl font-bold mb-8 text-[var(--color-text)]">
        Setup
      </h1>

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
        </ul>
        <p className="text-sm text-[var(--color-text-muted)] mt-3 pt-3 border-t border-white/10">
          <strong className="text-[var(--color-text)]">Tip:</strong> Not sure if Git and Node are installed? In Cursor, ask: <em>&quot;Check if Git and Node are installed on my machine, and help me set them up if they&apos;re not.&quot;</em> Cursor can run the checks and guide you through installation.
        </p>
      </div>

      <ol className="text-sm space-y-6 list-decimal list-inside text-[var(--color-text-muted)]">
        <li>
          <span className="font-medium text-[var(--color-text)]">Go to a folder where you want the project</span>
          <CopyableCommand command="cd ~/Desktop" />
          <p className="mt-1 text-xs">
            This puts you in your Desktop. You can use <span className="font-mono bg-white/10 px-1 rounded">~/Documents</span> or any other folder.
          </p>
        </li>
        <li>
          <span className="font-medium text-[var(--color-text)]">Clone the repo</span>
          <CopyableCommand command={`git clone ${REPO_URL}.git`} />
          <p className="mt-1 text-xs">
            Downloads a copy of the project to a new <span className="font-mono bg-white/10 px-1 rounded">pr-quest</span> folder.
          </p>
        </li>
        <li>
          <span className="font-medium text-[var(--color-text)]">Enter the project and install dependencies</span>
          <CopyableCommand command="cd pr-quest && npm install" />
          <p className="mt-1 text-xs">
            Moves into the project folder and installs the packages the app needs.
          </p>
        </li>
      </ol>

      <div className="mt-6">
        {isCelebrating ? (
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-accent)]/20 text-[var(--color-accent)]"
            role="status"
            aria-live="polite"
          >
            <span className="text-xl">🎉</span>
            <span className="font-medium">Setup complete!</span>
            <span className="text-sm opacity-90">+{SETUP_XP} XP</span>
          </div>
        ) : isComplete ? (
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
        ) : (
          <button
            type="button"
            onClick={handleMarkComplete}
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-[var(--color-accent)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Mark complete
          </button>
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
        </ul>
      </div>
    </main>
  );
}
