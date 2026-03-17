#!/usr/bin/env node
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const inquirer = require("inquirer");

const ROOT = path.resolve(__dirname, "..");
const TARGET_FILE_CONTRIB = "app/contributors/page.tsx";

function run(cmd, opts = {}) {
  try {
    return { ok: true, out: execSync(cmd, { encoding: "utf8", cwd: ROOT, ...opts }) };
  } catch (e) {
    return { ok: false, out: (e.stdout || e.stderr || e.message || "").trim() };
  }
}

function inRepo() {
  const r = run("git rev-parse --is-inside-work-tree");
  return r.ok && r.out.trim() === "true";
}

function currentBranch() {
  const r = run("git branch --show-current");
  return r.ok ? r.out.trim() : null;
}

function hasUncommittedChanges() {
  const r = run("git status --short");
  return r.ok && r.out.trim().length > 0;
}

function getModifiedFiles() {
  const r = run("git diff --name-only");
  if (!r.ok) return [];
  return r.out.trim() ? r.out.trim().split("\n") : [];
}

function aheadOfMain() {
  const r = run("git rev-list --count main..HEAD 2>/dev/null || git rev-list --count origin/main..HEAD 2>/dev/null");
  if (!r.ok) return 0;
  const n = parseInt(r.out.trim(), 10);
  return isNaN(n) ? 0 : n;
}

function welcome() {
  console.log(chalk.cyan("\n  Welcome to PR Quest.\n"));
  console.log(chalk.gray("  This guide will help you complete each level step by step."));
  console.log(chalk.gray("  Nothing here can break the exercise. If you get stuck, use the suggested Cursor prompt.\n"));
}

async function level1Flow(name) {
  const branchName = name ? `level1-${name.replace(/\s+/g, "-").toLowerCase()}` : "level1-yourname";

  console.log(chalk.bold("\n--- Level 1: Ship Your Mark ---\n"));
  console.log(chalk.gray("You will: create a branch, make a small change, commit, and open a PR.\n"));

  // Step 1: Environment
  console.log(chalk.yellow("Step 1 of 5 — Check your environment\n"));
  const hasGit = run("git --version").ok;
  const hasNode = run("node --version").ok;
  const hasNodeModules = fs.existsSync(path.join(ROOT, "node_modules"));
  console.log(hasGit ? chalk.green("  ✔ Git is installed") : chalk.red("  ✘ Git not found"));
  console.log(hasNode ? chalk.green("  ✔ Node is installed") : chalk.red("  ✘ Node not found"));
  console.log(hasNodeModules ? chalk.green("  ✔ Dependencies installed") : chalk.red("  ✘ Run npm install"));
  if (!inRepo()) {
    console.log(chalk.red("  ✘ Not inside a git repo. Clone PR Quest and run from its root."));
    return;
  }
  console.log(chalk.green("  ✔ Inside repo\n"));

  // Step 2: Branch
  console.log(chalk.yellow("Step 2 of 5 — Create your branch\n"));
  console.log(chalk.white("  Suggested branch name: " + chalk.cyan(branchName)));
  console.log(chalk.gray("  Run:\n"));
  console.log(chalk.cyan("  git checkout -b " + branchName + "\n"));
  console.log(chalk.gray("  What this does: creates a new branch and switches you to it. Your work stays separate from main.\n"));
  const branch = currentBranch();
  if (branch && branch.startsWith("level1-")) {
    console.log(chalk.green("  ✔ You're on branch " + branch + "\n"));
  } else {
    console.log(chalk.gray("  After you run the command above, run " + chalk.cyan("npm run quest") + " again to continue.\n"));
    return;
  }

  // Step 3: Make change
  console.log(chalk.yellow("Step 3 of 5 — Make your change\n"));
  console.log(chalk.white("  Target file: " + chalk.cyan(TARGET_FILE_CONTRIB)));
  console.log(chalk.gray("  Add your name to the Designers Who Shipped list on the Contributors page.\n"));
  const modified = getModifiedFiles();
  const touchedRightFile = modified.some((f) => f === TARGET_FILE_CONTRIB || f.includes("contributors"));
  if (hasUncommittedChanges() && touchedRightFile) {
    console.log(chalk.green("  ✔ You edited the correct file"));
    console.log(chalk.green("  ✔ Git detects changes\n"));
  } else if (hasUncommittedChanges()) {
    console.log(chalk.yellow("  ✔ Git detects changes. If you meant to edit Contributors, the file is app/contributors/page.tsx\n"));
  } else {
    console.log(chalk.yellow("  Hmm — I don't see any file changes yet.\n"));
    console.log(chalk.gray("  Common reasons:"));
    console.log(chalk.gray("  - You edited the wrong file"));
    console.log(chalk.gray("  - You didn't save the file"));
    console.log(chalk.gray("  Try this Cursor prompt: \"Help me find where the contributors list is defined in this repo.\"\n"));
    return;
  }

  // Step 4: Commit
  console.log(chalk.yellow("Step 4 of 5 — Commit your work\n"));
  console.log(chalk.gray("  Run:\n"));
  console.log(chalk.cyan("  git add " + TARGET_FILE_CONTRIB));
  console.log(chalk.cyan('  git commit -m "[Level 1] Add my name to contributors"\n'));
  console.log(chalk.gray("  What this does: stages your file and creates a commit with a message.\n"));
  if (aheadOfMain() > 0) {
    console.log(chalk.green("  ✔ You have a commit ahead of main\n"));
  } else {
    console.log(chalk.gray("  After you commit, run " + chalk.cyan("npm run quest") + " again.\n"));
    return;
  }

  // Step 5: Push & PR
  console.log(chalk.yellow("Step 5 of 5 — Open your PR\n"));
  console.log(chalk.gray("  Push your branch:\n"));
  console.log(chalk.cyan("  git push -u origin " + branch + "\n"));
  console.log(chalk.gray("  Then open GitHub → your repo. You'll see a yellow \"Compare & pull request\" banner. Click it.\n"));
  console.log(chalk.white("  Suggested PR title: ") + chalk.cyan("[Level 1] Add " + (name || "my name") + " to contributors"));
  console.log(chalk.gray("\n  Suggested description (paste into the PR body):\n"));
  console.log(chalk.cyan("  ## What I changed"));
  console.log(chalk.cyan("  - Added my name to the contributors page"));
  console.log(chalk.cyan("  ## Why"));
  console.log(chalk.cyan("  - Completing Level 1 of PR Quest"));
  console.log(chalk.cyan("  ## Screenshot"));
  console.log(chalk.cyan("  - (Add after running locally)\n"));
}

async function level2Flow() {
  console.log(chalk.bold("\n--- Level 2: Review Like a Pro ---\n"));
  console.log(chalk.gray("Your mission: review the seeded pull request and leave:\n"));
  console.log(chalk.gray("  - 1 clarifying question"));
  console.log(chalk.gray("  - 1 suggestion"));
  console.log(chalk.gray("  - 1 summary comment\n"));
  console.log(chalk.white("  Seeded PR: ") + chalk.cyan("https://github.com/your-org/pr-quest/pull/1"));
  console.log(chalk.gray("\n  Tip: You're not trying to prove you're technical. You're making the work clearer, safer, and stronger.\n"));
  console.log(chalk.gray("  When done, mark Level 2 complete on the website.\n"));
}

async function level3Flow() {
  console.log(chalk.bold("\n--- Level 3: AI Debug Mode ---\n"));
  console.log(chalk.gray("A bug has been intentionally planted in this site.\n"));
  console.log(chalk.gray("Your job:\n"));
  console.log(chalk.gray("  1. Notice the issue (e.g. flicker, layout jump)"));
  console.log(chalk.gray("  2. Investigate with Cursor"));
  console.log(chalk.gray("  3. Fix it"));
  console.log(chalk.gray("  4. Submit a PR\n"));
  console.log(chalk.white("  Suggested Cursor prompts:\n"));
  console.log(chalk.cyan('  - "Where is this component defined?"'));
  console.log(chalk.cyan('  - "Why would this element shift on hover?"'));
  console.log(chalk.cyan('  - "Explain this component in plain English."'));
  console.log(chalk.cyan('  - "Suggest a clean fix for this bug."\n'));
}

async function main() {
  welcome();

  const { level } = await inquirer.prompt([
    {
      type: "list",
      name: "level",
      message: "Which level?",
      choices: [
        { name: "Level 1 — Ship Your Mark", value: 1 },
        { name: "Level 2 — Review Like a Pro", value: 2 },
        { name: "Level 3 — AI Debug Mode", value: 3 },
      ],
    },
  ]);

  if (level === 1) {
    const { name } = await inquirer.prompt([
      { type: "input", name: "name", message: "Your name (for branch level1-<name>):", default: "yourname" },
    ]);
    await level1Flow(name);
  } else if (level === 2) {
    await level2Flow();
  } else {
    await level3Flow();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
