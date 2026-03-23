"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import {
  learnModules,
  STORAGE_KEY,
  defaultProgress,
  getLearnModulesCompletedWithMarked,
  SEEDED_PR_URL,
  LEARN_MARKED_COMPLETE_KEY,
  SETUP_COMPLETE_KEY,
  LEARN_MODULE_XP,
  type Progress,
} from "@/lib/levels";

const TOTAL_MODULES = 4;
const CELEBRATION_DURATION_MS = 800;

/** Inline content for "What is a Pull Request?" (first module) - with Mark complete CTA */
function WhatIsPRContent({
  isComplete,
  isCelebrating,
  onMarkComplete,
}: {
  isComplete: boolean;
  isCelebrating: boolean;
  onMarkComplete: () => void;
}) {
  return (
    <div className="pt-2 pb-1 space-y-6 text-sm text-[var(--color-text)]">
      <p>
        A pull request (PR) is a <strong>proposal for a change</strong>. It’s a way to suggest
        something specific, discuss it with your team, and get it reviewed—without committing to
        shipping it or maintaining the code forever.
      </p>

      <div>
        <p className="font-semibold mb-1.5">A PR is:</p>
        <ul className="list-disc list-inside space-y-1 text-[var(--color-text-muted)]">
          <li>A way to suggest a specific change</li>
          <li>A place for discussion and review</li>
          <li>Something engineers can modify, take over, or reject</li>
        </ul>
      </div>

      <div>
        <p className="font-semibold mb-1.5">A PR is not:</p>
        <ul className="list-disc list-inside space-y-1 text-[var(--color-text-muted)]">
          <li>A guarantee the change must ship</li>
          <li>A requirement that you maintain the code forever</li>
        </ul>
      </div>

      <blockquote className="text-base sm:text-lg text-center text-[var(--color-text)] font-medium py-4 px-4 rounded-lg bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20">
        “Here’s a concrete suggestion—what do you think?”
      </blockquote>
      <p className="text-center text-xs text-[var(--color-text-muted)] -mt-2">
        Helpful mental model: a PR is a structured way to say this.
      </p>

      <div>
        <p className="font-semibold mb-1.5">When to submit a PR:</p>
        <p className="text-[var(--color-text-muted)]">
          When the change is small and contained, easy to explain in one or two sentences, and
          low-risk (e.g. copy fixes, docs, token tweaks, small component variants). Not for
          architectural changes, complex logic, or anything you can’t clearly explain.
        </p>
      </div>

      <div>
        <p className="font-semibold mb-1.5">Examples to look at:</p>
        <p className="text-[var(--color-text-muted)] mb-2">
          Open a few real PRs to see titles, descriptions, and the diff view. Look for small
          changes like copy, docs, or tokens.
        </p>
        <ul className="space-y-1.5">
          <li>
            <Link
              href={SEEDED_PR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-accent)] hover:underline"
            >
              Browse pull requests in this repo →
            </Link>
          </li>
          <li>
            <Link
              href="https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-accent)] hover:underline"
            >
              GitHub: About pull requests →
            </Link>
          </li>
        </ul>
      </div>

      <div className="pt-2 flex flex-wrap items-center gap-3">
        {isCelebrating ? (
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-accent)]/20 text-[var(--color-accent)]"
            role="status"
            aria-live="polite"
          >
            <span className="text-xl">🎉</span>
            <span className="font-medium">Module complete!</span>
            <span className="text-sm opacity-90">+{LEARN_MODULE_XP} XP</span>
          </div>
        ) : isComplete ? (
          <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-400 text-sm font-medium">
            <span>✓</span> Complete
          </span>
        ) : (
          <button
            type="button"
            onClick={onMarkComplete}
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-[var(--color-accent)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Mark complete
          </button>
        )}
      </div>
    </div>
  );
}

/** Short content for other modules; expanded area shows summary + link or Mark complete */
function getModuleExpandedContent(
  moduleId: number,
  path: string,
  opts?: { markedComplete: number[]; celebratingModuleId: number | null; onMarkComplete: (id: number) => void }
) {
  const copy: Record<number, { summary: string; label: string }> = {
    2: {
      summary: "",
      label: "Go to Setup",
    },
    3: {
      summary: "Write a clear title and description, keep changes small, and make review easy.",
      label: "Your first PR",
    },
    4: {
      summary: "What reviewers look for, how to respond to feedback, and when to request review.",
      label: "Review a PR",
    },
  };
  const c = copy[moduleId];
  if (!c) return null;
  const hasMarkComplete = (moduleId === 2 || moduleId === 3 || moduleId === 4) && opts;
  const isComplete = opts ? opts.markedComplete.includes(moduleId) : false;
  const isCelebrating = opts ? opts.celebratingModuleId === moduleId : false;

  return (
    <div className="pt-2 pb-1 space-y-3 text-sm text-[var(--color-text)]">
      {c.summary && <p>{c.summary}</p>}
      {moduleId === 2 && (
        <>
          <div className="space-y-3">
            <p className="text-[var(--color-text-muted)]">
              <strong className="text-[var(--color-text)]">Git</strong> is a version control system
              that tracks every change to your files. It's like having unlimited undo and a complete
              history of your project.
            </p>
            <p className="text-[var(--color-text-muted)]">
              <strong className="text-[var(--color-text)]">GitHub</strong> is where you host your Git
              repositories online. It adds powerful collaboration features like PRs, issues, and code
              reviews.
            </p>
            <p className="text-[var(--color-text-muted)]">
              <strong className="text-[var(--color-text)]">Branches</strong> are parallel versions of
              your code. They let you work on new features without affecting the main codebase until
              you're ready.
            </p>
            <div>
              <p className="font-medium text-[var(--color-text)] mb-2">The typical workflow</p>
              <p className="text-[var(--color-text-muted)] mb-4">
                Clone a repo → create a branch → make changes → commit → push → open a PR. You'll
                practice this entire cycle here. Here is what you can expect:
              </p>
              <div className="rounded-xl border border-white/10 bg-[var(--color-accent)]/5 p-4 sm:p-5">
                <ol className="space-y-6 text-sm text-[var(--color-text-muted)]">
                <li className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 items-start py-4 first:pt-0 last:pb-0 border-b border-white/5 last:border-b-0">
                  <div>
                    <span className="text-[var(--color-text)] font-medium">Clone the repo</span>
                    <pre className="mt-1 p-2 rounded bg-black/40 text-xs overflow-x-auto font-mono text-[var(--color-text)]">
                      git clone https://github.com/&lt;org&gt;/&lt;repo&gt;.git
                    </pre>
                    <p className="mt-1 text-xs">
                      Replace <code className="bg-white/10 px-1 rounded">&lt;org&gt;/&lt;repo&gt;</code> with the actual repository (e.g. <code className="bg-white/10 px-1 rounded">your-org/pr-quest</code>).
                    </p>
                  </div>
                  <p className="text-xs sm:pt-6">
                    Copying the most recent repository code to your machine. Downloads the full project and its history.
                  </p>
                </li>
                <li className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 items-start py-4 first:pt-0 last:pb-0 border-b border-white/5 last:border-b-0">
                  <div>
                    <span className="text-[var(--color-text)] font-medium">Create a branch</span>
                    <pre className="mt-1 p-2 rounded bg-black/40 text-xs overflow-x-auto font-mono text-[var(--color-text)]">
                      git checkout -b my-feature-branch
                    </pre>
                  </div>
                  <p className="text-xs sm:pt-6">
                    Creating a parallel version of the code. You work on this branch without affecting the main codebase.
                  </p>
                </li>
                <li className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 items-start py-4 first:pt-0 last:pb-0 border-b border-white/5 last:border-b-0">
                  <div>
                    <span className="text-[var(--color-text)] font-medium">Stage and commit your changes</span>
                    <pre className="mt-1 p-2 rounded bg-black/40 text-xs overflow-x-auto font-mono text-[var(--color-text)]">
                      git add .
                      git commit -m "Describe your changes"
                    </pre>
                  </div>
                  <p className="text-xs sm:pt-6">
                    Staging marks which changes to include. Commit saves a snapshot with a message so you can track what changed and why.
                  </p>
                </li>
                <li className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 items-start py-4 first:pt-0 last:pb-0 border-b border-white/5 last:border-b-0">
                  <div>
                    <span className="text-[var(--color-text)] font-medium">Push to GitHub</span>
                    <pre className="mt-1 p-2 rounded bg-black/40 text-xs overflow-x-auto font-mono text-[var(--color-text)]">
                      git push -u origin my-feature-branch
                    </pre>
                  </div>
                  <p className="text-xs sm:pt-6">
                    Uploading your branch and commits to GitHub so others can see them and you can open a PR.
                  </p>
                </li>
                <li className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 items-start py-4 first:pt-0 last:pb-0 border-b border-white/5 last:border-b-0">
                  <div>
                    <span className="text-[var(--color-text)] font-medium">Open a PR</span>
                    <p className="mt-1 text-xs">
                    Go to the repo on GitHub → you’ll see “Compare & pull request” for your branch → click it, fill in the template, create the PR.
                  </p>
                  </div>
                  <p className="text-xs sm:pt-6">
                    Proposing to merge your branch into main.
                  </p>
                </li>
              </ol>
              </div>
              <p className="mt-4 text-sm text-[var(--color-text-muted)]">
                Don't worry about remembering all of these steps! In your first PR, you will be guided step by step.
              </p>
            </div>
          </div>
        </>
      )}
      {moduleId === 3 && (
        <div className="space-y-4">
          <ul className="list-disc list-inside space-y-2 text-[var(--color-text-muted)] text-sm">
            <li>
              <strong className="text-[var(--color-text)]">Write a clear, descriptive title.</strong> Instead of "Updates", write "Add dark mode toggle to header" or "Fix mobile navigation bug".
            </li>
            <li>
              <strong className="text-[var(--color-text)]">Explain WHAT you changed and WHY.</strong> The code shows how you did it, but the description should explain your reasoning.
            </li>
            <li>
              <strong className="text-[var(--color-text)]">Keep PRs focused.</strong> One PR = one feature or fix. Smaller PRs are easier to review and less likely to cause conflicts.
            </li>
            <li>
              <strong className="text-[var(--color-text)]">Add screenshots for UI changes.</strong> Reviewers love seeing visual changes without having to pull down your code.
            </li>
            <li>
              <strong className="text-[var(--color-text)]">Link to related issues or documentation.</strong> Context helps reviewers understand the bigger picture.
            </li>
          </ul>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border-l-4 border-emerald-500/80 bg-emerald-500/10 p-3">
              <p className="flex items-center gap-2 text-sm font-medium text-emerald-400 mb-1">
                <span>✓</span> Good PR Title
              </p>
              <p className="text-xs text-[var(--color-text-muted)]">"Add dark mode toggle to header"</p>
            </div>
            <div className="rounded-lg border-l-4 border-red-500/80 bg-red-500/10 p-3">
              <p className="flex items-center gap-2 text-sm font-medium text-red-400 mb-1">
                <span>✗</span> Bad PR Title
              </p>
              <p className="text-xs text-[var(--color-text-muted)]">"Updates" or "Fixed stuff"</p>
            </div>
          </div>
        </div>
      )}
      {moduleId === 4 && (
        <div className="space-y-4 pt-2">
          <div>
            <p className="font-medium text-[var(--color-text)] mb-1.5">The process</p>
            <ol className="list-decimal list-inside space-y-1 text-[var(--color-text-muted)]">
              <li>Author creates a PR and requests review</li>
              <li>Reviewer leaves comments on the PR</li>
              <li>Author responds to each comment (change or discuss)</li>
              <li>Reviewer approves when ready → merge</li>
            </ol>
          </div>
          <div>
            <p className="font-medium text-[var(--color-text)] mb-1.5">As an author</p>
            <ul className="list-disc list-inside space-y-1 text-[var(--color-text-muted)]">
              <li>Use the PR template; state what feedback you want and provide context</li>
              <li>Answer or acknowledge every comment</li>
              <li>Treat feedback as a discussion about the code, not your worth</li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-[var(--color-text)] mb-1.5">As a reviewer</p>
            <ul className="list-disc list-inside space-y-1 text-[var(--color-text-muted)]">
              <li>Focus on material impact—quality and correctness, not style preferences</li>
              <li>Frame feedback as requests or suggestions, not commands</li>
              <li>Explicitly approve when you think it’s ready to merge</li>
            </ul>
          </div>
        </div>
      )}
      {hasMarkComplete ? (
        <div className="pt-2 flex flex-wrap items-center gap-3">
          {isCelebrating ? (
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-accent)]/20 text-[var(--color-accent)]"
              role="status"
              aria-live="polite"
            >
              <span className="text-xl">🎉</span>
              <span className="font-medium">Module complete!</span>
              <span className="text-sm opacity-90">+{LEARN_MODULE_XP} XP</span>
            </div>
          ) : isComplete ? (
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-400 text-sm font-medium">
              <span>✓</span> Complete
            </span>
          ) : (
            <button
              type="button"
              onClick={() => opts!.onMarkComplete(moduleId)}
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-[var(--color-accent)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Mark complete
            </button>
          )}
        </div>
      ) : (
        <Link
          href={path}
          className="inline-block px-4 py-2 rounded-lg bg-[var(--color-accent)]/20 text-[var(--color-accent)] font-medium hover:bg-[var(--color-accent)]/30 transition-colors text-sm"
        >
          {c.label} →
        </Link>
      )}
    </div>
  );
}

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

function getMarkedComplete(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LEARN_MARKED_COMPLETE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function LearnPageContent() {
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState<Progress>(defaultProgress);
  const [markedComplete, setMarkedComplete] = useState<number[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [celebratingModuleId, setCelebratingModuleId] = useState<number | null>(null);

  useEffect(() => {
    setProgress(getProgress());
    setMarkedComplete(getMarkedComplete());
  }, []);

  useEffect(() => {
    const moduleParam = searchParams.get("module");
    if (moduleParam) {
      const id = parseInt(moduleParam, 10);
      if (id >= 1 && id <= TOTAL_MODULES) setExpandedId(id);
    }
  }, [searchParams]);

  const completed = getLearnModulesCompletedWithMarked(progress, markedComplete);
  const percent = TOTAL_MODULES > 0 ? Math.round((completed / TOTAL_MODULES) * 100) : 0;

  const handleMarkComplete = (moduleId: number) => {
    if (markedComplete.includes(moduleId)) return;
    setCelebratingModuleId(moduleId);
    const next = [...markedComplete, moduleId];
    setMarkedComplete(next);
    try {
      localStorage.setItem(LEARN_MARKED_COMPLETE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
    setTimeout(() => {
      setCelebratingModuleId(null);
      setExpandedId(null);
    }, CELEBRATION_DURATION_MS);
  };

  const handleReset = () => {
    try {
      localStorage.removeItem(LEARN_MARKED_COMPLETE_KEY);
      localStorage.removeItem(SETUP_COMPLETE_KEY);
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setMarkedComplete([]);
    setCelebratingModuleId(null);
    setExpandedId(null);
    setProgress(getProgress());
  };

  return (
    <main className="flex-1 px-3 py-6 sm:px-4 sm:py-8 max-w-3xl mx-auto w-full min-w-0">
      <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-[var(--color-text)]">
        Learn Pull Requests
      </h1>
      <p className="text-[var(--color-text-muted)] mb-8">
        Master the basics before making your first contribution. Ideal flow: Learn → Setup →
        Practice. Feel free to skip sections as you like.
      </p>

      <div className="rounded-xl border border-white/10 bg-[var(--color-accent)]/10 p-4 mb-8">
        <div className="flex justify-between items-start gap-4 mb-2">
          <div>
            <h2 className="font-semibold text-[var(--color-text)]">Your Progress</h2>
            <p className="text-sm text-[var(--color-text-muted)]">
              {completed} of {TOTAL_MODULES} completed
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] underline"
            >
              Reset
            </button>
            <span className="text-2xl font-bold text-[var(--color-accent)]">{percent}%</span>
          </div>
        </div>
        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-[var(--color-accent)] transition-all duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      <div className="space-y-3">
        {learnModules.map((module) => {
          const isExpanded = expandedId === module.id;
          const expandedContent =
            module.id === 1 ? (
              <WhatIsPRContent
                isComplete={markedComplete.includes(1)}
                isCelebrating={celebratingModuleId === 1}
                onMarkComplete={() => handleMarkComplete(1)}
              />
            ) : (
              getModuleExpandedContent(
                module.id,
                module.path,
                (module.id === 2 || module.id === 3 || module.id === 4)
                  ? {
                      markedComplete,
                      celebratingModuleId,
                      onMarkComplete: handleMarkComplete,
                    }
                  : undefined
              )
            );

          return (
            <div
              key={module.id}
              className={`glass-card overflow-hidden transition-colors ${
                isExpanded ? "border-[var(--color-accent)]/30" : ""
              }`}
            >
              <button
                type="button"
                onClick={() => setExpandedId(isExpanded ? null : module.id)}
                className="w-full flex items-center gap-4 p-4 text-left hover:bg-white/5 transition-colors"
                aria-expanded={isExpanded}
                aria-controls={`learn-module-${module.id}`}
                id={`learn-module-${module.id}-button`}
              >
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl shrink-0 ${
                    markedComplete.includes(module.id)
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-[var(--color-accent)]/20"
                  }`}
                  aria-hidden
                >
                  {markedComplete.includes(module.id) ? "✓" : (module.icon ?? "📄")}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-[var(--color-text)]">{module.title}</h3>
                  <p className="text-sm text-[var(--color-text-muted)] mt-0.5">{module.summary}</p>
                </div>
                <span
                  className={`shrink-0 text-[var(--color-text-muted)] transition-transform ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                  aria-hidden
                >
                  ↓
                </span>
              </button>
              {expandedContent && (
                <div
                  id={`learn-module-${module.id}`}
                  role="region"
                  aria-labelledby={`learn-module-${module.id}-button`}
                  className={`border-t border-white/10 px-4 pb-4 pt-0 ${isExpanded ? "" : "hidden"}`}
                >
                  {expandedContent}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {completed === TOTAL_MODULES && (
        <div className="mt-10">
          <Link
            href="/setup"
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-[var(--color-accent)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Up Next: Setup →
          </Link>
        </div>
      )}
    </main>
  );
}

function LearnPageFallback() {
  return (
    <main className="flex-1 px-3 py-6 sm:px-4 sm:py-8 max-w-3xl mx-auto w-full min-w-0">
      <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-[var(--color-text)]">Learn Pull Requests</h1>
      <p className="text-[var(--color-text-muted)]">Loading...</p>
    </main>
  );
}

export default function LearnPage() {
  return (
    <Suspense fallback={<LearnPageFallback />}>
      <LearnPageContent />
    </Suspense>
  );
}
