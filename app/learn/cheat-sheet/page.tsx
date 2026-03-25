import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { CopyableCommand } from "@/components/CopyableCommand";

export const metadata: Metadata = {
  title: { absolute: "PR cheat sheet — PR Quest" },
  description:
    "One-page reference: git commands from clone through push, with short explanations for each step.",
};

function Step({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="border-b border-white/[0.08] pb-8 mb-8 last:mb-0 last:border-0 last:pb-0">
      <div className="flex gap-3 items-start mb-3">
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--color-accent)]/35 bg-[var(--color-accent)]/10 text-sm font-semibold text-[var(--color-accent)]"
          aria-hidden
        >
          {n}
        </span>
        <h2 className="text-lg font-semibold text-[var(--color-text)] leading-snug pt-0.5">{title}</h2>
      </div>
      <div className="ml-0 sm:ml-11 space-y-3">{children}</div>
    </section>
  );
}

export default function PRCheatSheetPage() {
  return (
    <main className="flex-1 px-3 py-6 sm:px-4 sm:py-10 max-w-2xl mx-auto w-full min-w-0">
      <Link
        href="/learn"
        className="text-sm text-[var(--color-accent)] hover:underline mb-5 inline-block"
      >
        ← Back to Learn
      </Link>

      <header className="mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-text)] mb-2">PR cheat sheet</h1>
        <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
          A linear reference from first clone to opening a pull request. Replace placeholders like{" "}
          <code className="text-[var(--color-accent)]/90 text-xs font-mono">&lt;repository-url&gt;</code> with
          your real values.
        </p>
      </header>

      <article className="rounded-2xl border border-white/10 bg-[#0c0c10]/80 p-5 sm:p-8">
        <Step n={1} title="Clone the repository">
          <CopyableCommand command="git clone <repository-url>" />
          <CopyableCommand command="cd <repo-folder>" className="mt-2" />
          <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
            <strong className="font-medium text-[var(--color-text)]">What it does:</strong>{" "}
            <code className="text-zinc-400 text-xs">clone</code> downloads the project and its full Git history to
            your computer. Use the HTTPS or SSH URL from the green &quot;Code&quot; button on GitHub.{" "}
            <code className="text-zinc-400 text-xs">cd</code> switches your terminal into that project folder so
            later commands run in the right place.
          </p>
        </Step>

        <Step n={2} title="Update your default branch">
          <CopyableCommand command="git checkout main" />
          <CopyableCommand command="git pull origin main" className="mt-2" />
          <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
            <strong className="font-medium text-[var(--color-text)]">What it does:</strong> You move to the shared
            line of work your team treats as source of truth (often called <code className="text-zinc-400 text-xs">main</code>
            — some repos use <code className="text-zinc-400 text-xs">master</code> or another name).{" "}
            <code className="text-zinc-400 text-xs">pull</code> fetches and merges the latest commits from the remote
            so you are not branching off stale code.
          </p>
        </Step>

        <Step n={3} title="Create a branch for your work">
          <CopyableCommand command="git checkout -b <your-branch-name>" />
          <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
            <strong className="font-medium text-[var(--color-text)]">What it does:</strong> Creates a new branch and
            switches to it. Your commits will attach here instead of directly on{" "}
            <code className="text-zinc-400 text-xs">main</code>, which keeps the shared branch stable until you merge
            via a PR. Pick a short, descriptive name (e.g.{" "}
            <code className="text-zinc-400 text-xs">add-contributor-name</code>).
          </p>
        </Step>

        <Step n={4} title="Make your changes">
          <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
            Edit files in your editor or IDE. When you are ready to save that work into Git, continue with stage →
            commit → push. No Git command is required for the edits themselves.
          </p>
        </Step>

        <Step n={5} title="Stage the files you want in the next commit">
          <CopyableCommand command="git add ." />
          <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mt-2">Or stage specific paths:</p>
          <CopyableCommand command="git add path/to/file" className="mt-1.5" />
          <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
            <strong className="font-medium text-[var(--color-text)]">What it does:</strong> Staging is how you tell
            Git exactly which changes belong in the next snapshot. Only staged lines are included in the commit.
          </p>
        </Step>

        <Step n={6} title="Commit with a message">
          <CopyableCommand command='git commit -m "Short, clear description of the change"' />
          <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
            <strong className="font-medium text-[var(--color-text)]">What it does:</strong> Records the staged work as
            one commit on your branch, with a message reviewers will see in history and on the PR.
          </p>
        </Step>

        <Step n={7} title="Push your branch to the remote">
          <CopyableCommand command="git push -u origin <your-branch-name>" />
          <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
            <strong className="font-medium text-[var(--color-text)]">What it does:</strong> Uploads your branch and
            commits to the shared remote (e.g. GitHub). <code className="text-zinc-400 text-xs">-u</code> links your
            local branch to the remote one so later you can run <code className="text-zinc-400 text-xs">git push</code>{" "}
            without extra arguments.
          </p>
        </Step>

        <Step n={8} title="Open the pull request">
          <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
            On GitHub, open the repository in the browser. You should see a prompt to compare and open a pull request
            for your recently pushed branch; or use <strong className="font-medium text-[var(--color-text)]">Pull requests</strong>{" "}
            → <strong className="font-medium text-[var(--color-text)]">New pull request</strong>, choose your branch,
            add a title and description, then create the PR for review.
          </p>
        </Step>

        <Step n={9} title="After review (optional)">
          <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
            If reviewers ask for changes, edit the same files locally, then{" "}
            <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs font-mono text-emerald-300/90">git add</code>,{" "}
            <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs font-mono text-emerald-300/90">git commit</code>
            , and <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs font-mono text-emerald-300/90">git push</code>{" "}
            again on the same branch — the PR updates automatically with the new commits.
          </p>
        </Step>
      </article>
    </main>
  );
}
