#!/usr/bin/env node
/**
 * Seeds GitHub with branches containing intentional issues for PR review practice.
 * Run from repo root. Creates branches; you push and open PRs on GitHub.
 *
 * Usage: node scripts/seed-review-prs.js
 *
 * Branches created:
 * - seeded-pr-spacing: Hardcoded spacing values (should use theme tokens)
 * - seeded-pr-link-colors: Links missing accent color / hover styles
 * - seeded-pr-accessibility: Missing alt text, low contrast (original Level 2 PR)
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

function run(cmd, opts = {}) {
  try {
    return execSync(cmd, { encoding: "utf8", cwd: ROOT, ...opts });
  } catch (e) {
    throw new Error(e.stderr || e.message);
  }
}

function ensureClean() {
  const status = run("git status --short").trim();
  if (status) {
    console.error("Uncommitted changes detected. Commit or stash first.");
    process.exit(1);
  }
}

function createBranch(name, description, changes) {
  console.log(`\nCreating branch: ${name}`);
  run("git checkout main");
  run("git pull origin main 2>/dev/null || true");
  run(`git checkout -b ${name}`);

  for (const { file, content } of changes) {
    const filePath = path.join(ROOT, file);
    fs.writeFileSync(filePath, content, "utf8");
    run(`git add ${file}`);
  }

  run(`git commit -m "${description}"`);
  console.log(`  ✓ ${name} ready`);
}

// --- seeded-pr-spacing: inconsistent / hardcoded spacing ---
const SPACING_CHANGES = [
  {
    file: "components/dashboard/ContributorsTile.tsx",
    content: `import Link from "next/link";
import { contributorsList } from "@/lib/contributors";

export function ContributorsTile() {
  return (
    <div className="glass-card p-4 sm:p-5 flex flex-col h-full">
      <h2 className="text-lg font-semibold mb-1">Contributors</h2>
      <p className="text-sm text-[var(--color-text-muted)] mb-4">
        {contributorsList.length} people learning PRs
      </p>
      <ul className="flex-1 space-y-2 min-h-0" style={{ marginBottom: "18px" }}>
        {contributorsList.map((name, i) => (
          <li key={i} className="text-sm truncate">
            {name}
          </li>
        ))}
      </ul>
      <p className="text-xs text-[var(--color-accent)] mt-4">
        <Link href="https://github.com/elan-asselstine-braze/pr-quest/blob/main/lib/contributors.ts" target="_blank" rel="noopener noreferrer" className="hover:underline">
          Add yourself via PR →
        </Link>
      </p>
      <p className="text-xs text-[var(--color-text-muted)] mt-1">
        Edit <code className="bg-white/10 px-1 rounded">lib/contributors.ts</code>
      </p>
    </div>
  );
}
`,
  },
  {
    file: "app/page.tsx",
    content: `"use client";

import { MainProgressTile } from "@/components/dashboard/MainProgressTile";
import { ContributorsTile } from "@/components/dashboard/ContributorsTile";
import { EmojiOfTheDayTile } from "@/components/dashboard/EmojiOfTheDayTile";
import { ButtonMenuTile } from "@/components/dashboard/ButtonMenuTile";

export default function HomePage() {
  return (
    <main className="flex-1 px-3 py-6 sm:px-4 sm:py-8 w-full min-w-0">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-[var(--color-accent)]">
          Dashboard
        </h1>
        <p className="text-[var(--color-text-muted)] text-sm sm:text-base mb-6">
          Play around with PRs. Change the emoji, add a button, add your name.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ gap: "22px" }}>
          <div className="sm:row-span-1">
            <MainProgressTile />
          </div>
          <div>
            <ContributorsTile />
          </div>
          <div>
            <EmojiOfTheDayTile />
          </div>
          <div>
            <ButtonMenuTile />
          </div>
        </div>
      </div>
    </main>
  );
}
`,
  },
];

// --- seeded-pr-link-colors: links without proper styling ---
const LINK_COLOR_CHANGES = [
  {
    file: "components/dashboard/EmojiOfTheDayTile.tsx",
    content: `import Link from "next/link";
import { emojiOfTheDay, emojiChangeCount } from "@/lib/emojiOfTheDay";

export function EmojiOfTheDayTile() {
  return (
    <div className="glass-card p-4 sm:p-5 flex flex-col h-full items-center text-center">
      <h2 className="text-lg font-semibold mb-1">Emoji of the day</h2>
      <p className="text-sm text-[var(--color-text-muted)] mb-4">
        Submit a PR to change it
      </p>
      <div className="text-5xl sm:text-6xl mb-4" aria-hidden>
        {emojiOfTheDay}
      </div>
      <p className="text-sm text-[var(--color-text-muted)] mb-4">
        Changed <strong className="text-[var(--color-text)]">{emojiChangeCount}</strong> time{emojiChangeCount !== 1 ? "s" : ""}
      </p>
      <Link
        href="https://github.com/elan-asselstine-braze/pr-quest/blob/main/lib/emojiOfTheDay.ts"
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-gray-500"
      >
        Edit lib/emojiOfTheDay.ts →
      </Link>
    </div>
  );
}
`,
  },
  {
    file: "components/dashboard/ButtonMenuTile.tsx",
    content: `"use client";

import { playfulButtons } from "@/lib/playfulButtons";

export function ButtonMenuTile() {
  return (
    <div className="glass-card p-4 sm:p-5 flex flex-col h-full">
      <h2 className="text-lg font-semibold mb-1">Button menu</h2>
      <p className="text-sm text-[var(--color-text-muted)] mb-4">
        Fun buttons added via PR
      </p>
      <ul className="flex-1 space-y-2">
        {playfulButtons.map((btn, i) => (
          <li key={i}>
            <button
              type="button"
              className={\`
                w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-90
                \${btn.color ?? "bg-[var(--color-accent)]/20 text-[var(--color-accent)]"}
              \`}
            >
              {btn.label}
            </button>
          </li>
        ))}
      </ul>
      <p className="text-xs text-gray-500 mt-4">
        <a
          href="https://github.com/elan-asselstine-braze/pr-quest/blob/main/lib/playfulButtons.ts"
          target="_blank"
          rel="noopener noreferrer"
        >
          Add a button via PR →
        </a>
      </p>
      <p className="text-xs text-[var(--color-text-muted)] mt-1">
        Edit <code className="bg-white/10 px-1 rounded">lib/playfulButtons.ts</code>
      </p>
    </div>
  );
}
`,
  },
];

// --- seeded-pr-accessibility: alt text, contrast ---
const ACCESSIBILITY_CHANGES = [
  {
    file: "app/contributors/page.tsx",
    content: `"use client";

import Link from "next/link";
import { contributorsList } from "@/lib/contributors";

export default function ContributorsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-white/10 px-4 py-3 flex items-center gap-4">
        <Link href="/" className="text-[var(--color-accent)] font-semibold hover:underline">
          PR Quest
        </Link>
        <Link href="/level-1" className="text-[var(--color-text-muted)] text-sm hover:text-[var(--color-text)]">
          Level 1
        </Link>
      </header>
      <main className="flex-1 px-4 py-8 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Contributors</h1>
        <p className="text-[var(--color-text-muted)] mb-6">
          Everyone who has added their name via PR.
        </p>
        <ul className="space-y-2">
          {contributorsList.map((name, i) => (
            <li key={i} className="text-lg">
              {name}
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
`,
  },
];

// Add an image without alt for accessibility PR - we need a component that has an img
// Let me check if there's an image somewhere
// Actually the original seeded-issues mentioned: Missing alt text, low contrast button, hardcoded spacing
// The contributors page might not have an image. Let me add one for the accessibility branch.
// I'll create a simple component or add to an existing page. Let me check app/contributors - it doesn't have an image.
// I could add a placeholder img to the dashboard or create a small profile image. Let me add to ContributorsTile for the accessibility branch.
const ACCESSIBILITY_CHANGES_WITH_IMG = [
  {
    file: "components/dashboard/ContributorsTile.tsx",
    content: `import Link from "next/link";
import { contributorsList } from "@/lib/contributors";

export function ContributorsTile() {
  return (
    <div className="glass-card p-4 sm:p-5 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-2">
        <img src="/api/placeholder/24/24" width={24} height={24} className="rounded-full" />
        <h2 className="text-lg font-semibold">Contributors</h2>
      </div>
      <p className="text-sm text-[var(--color-text-muted)] mb-4">
        {contributorsList.length} people learning PRs
      </p>
      <ul className="flex-1 space-y-2 min-h-0">
        {contributorsList.map((name, i) => (
          <li key={i} className="text-sm truncate">
            {name}
          </li>
        ))}
      </ul>
      <button className="mt-4 px-3 py-1.5 rounded bg-gray-500/50 text-gray-400 text-xs">
        Add yourself via PR →
      </button>
      <p className="text-xs text-[var(--color-text-muted)] mt-1">
        Edit <code className="bg-white/10 px-1 rounded">lib/contributors.ts</code>
      </p>
    </div>
  );
}
`,
  },
];

// Use a real placeholder - placeholder.com or a data URI. Let me use a simple approach: an img with no alt.
// Actually placeholder services might not work. Let me use a simple emoji or SVG placeholder. Or just use an img with missing alt - that's the issue.
// I'll use a generic placeholder URL that might 404 - the point is the missing alt. Let me use https://placehold.co/24x24
const ACCESSIBILITY_FINAL = [
  {
    file: "components/dashboard/ContributorsTile.tsx",
    content: `import Link from "next/link";
import { contributorsList } from "@/lib/contributors";

export function ContributorsTile() {
  return (
    <div className="glass-card p-4 sm:p-5 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-2">
        <img src="https://placehold.co/24x24/6b7280/9ca3af?text=👤" width={24} height={24} className="rounded-full" />
        <h2 className="text-lg font-semibold">Contributors</h2>
      </div>
      <p className="text-sm text-[var(--color-text-muted)] mb-4">
        {contributorsList.length} people learning PRs
      </p>
      <ul className="flex-1 space-y-2 min-h-0">
        {contributorsList.map((name, i) => (
          <li key={i} className="text-sm truncate">
            {name}
          </li>
        ))}
      </ul>
      <button className="mt-4 px-3 py-1.5 rounded bg-gray-500/50 text-gray-400 text-xs">
        Add yourself via PR →
      </button>
      <p className="text-xs text-[var(--color-text-muted)] mt-1">
        Edit <code className="bg-white/10 px-1 rounded">lib/contributors.ts</code>
      </p>
    </div>
  );
}
`,
  },
];

function main() {
  console.log("PR Quest: Seeding review branches\n");
  ensureClean();

  createBranch(
    "seeded-pr-spacing",
    "[Seeded] Inconsistent spacing — practice review",
    SPACING_CHANGES
  );

  createBranch(
    "seeded-pr-link-colors",
    "[Seeded] Link styling — practice review",
    LINK_COLOR_CHANGES
  );

  createBranch(
    "seeded-pr-accessibility",
    "[Seeded] Accessibility issues — practice review",
    ACCESSIBILITY_FINAL
  );

  run("git checkout main");

  console.log("\n✓ All branches created. Next steps:");
  console.log("  1. git push origin seeded-pr-spacing seeded-pr-link-colors seeded-pr-accessibility");
  console.log("  2. On GitHub, open a PR for each branch → main");
  console.log("  3. Add the PR URLs to lib/levels.ts (SEEDED_REVIEW_PRS) or set NEXT_PUBLIC_SEEDED_REVIEW_PRS");
  console.log("");
}

main();
