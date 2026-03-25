/**
 * Stages for the PR Simulator practice flow.
 * Commands are validated with flexible whitespace; branch name is captured from checkout.
 */

export type GameStageId =
  | "intro"
  | "branch"
  | "edit"
  | "add"
  | "commit"
  | "push"
  | "pr"
  | "review"
  | "approve"
  | "merge";

export type GameStage = {
  id: GameStageId;
  markerTitle: string;
  /** Short “why this step” copy; shown beside the action column. */
  why: string;
  /** Extra context (optional; hidden in UI when empty) */
  markerBody: string;
  /** Extra hint (optional; hidden when empty) */
  commandHint: string;
  exampleCommand: string;
  exampleLabel?: string;
  ctaButtonLabel?: string;
};

export const LEARNING_GAME_STAGES: GameStage[] = [
  {
    id: "intro",
    markerTitle: "Start on main",
    why: "Most teams treat one branch—usually main—as the shared line everyone builds from.",
    markerBody: "",
    commandHint: "",
    exampleCommand: "",
  },
  {
    id: "branch",
    markerTitle: "Create a branch",
    why: "Branching keeps your experiment separate so main stays stable until you merge.",
    markerBody: "",
    commandHint: "",
    exampleCommand: "git checkout -b my-first-change",
  },
  {
    id: "edit",
    markerTitle: "Make a change",
    why: "A pull request always proposes a real diff; here you add your name to the list.",
    markerBody: "",
    commandHint: "",
    exampleCommand: "",
  },
  {
    id: "add",
    markerTitle: "Stage changes",
    why: "Staging tells Git exactly which files and lines belong in the next commit.",
    markerBody: "",
    commandHint: "",
    exampleCommand: "git add .",
  },
  {
    id: "commit",
    markerTitle: "Commit",
    why: "A commit snapshots staged work with a message teammates can read later.",
    markerBody: "",
    commandHint: "",
    exampleCommand: 'git commit -m "Describe your change"',
  },
  {
    id: "push",
    markerTitle: "Push branch",
    why: `"Pushing a branch" in Git is the act of uploading your local branch commits and changes to a remote repository (such as GitHub, GitLab, or Bitbucket). This action makes your local work visible and accessible to other collaborators.`,
    markerBody: "",
    commandHint: "",
    exampleCommand: "git push -u origin my-first-change",
  },
  {
    id: "pr",
    markerTitle: "Open a pull request",
    why: "The PR is where you propose merging your branch and discuss the change.",
    markerBody: "",
    commandHint: "",
    exampleCommand: "",
    ctaButtonLabel: "Pull request opened",
  },
  {
    id: "review",
    markerTitle: "Review",
    why: "Reviewers read the diff, ask questions, and catch issues before anything lands on main.",
    markerBody: "",
    commandHint: "",
    exampleCommand: "",
    ctaButtonLabel: "Review complete",
  },
  {
    id: "approve",
    markerTitle: "Approval",
    why: "Approval records that the change is OK to merge into the shared branch.",
    markerBody: "",
    commandHint: "",
    exampleCommand: "",
    ctaButtonLabel: "Approved",
  },
  {
    id: "merge",
    markerTitle: "Merge to main",
    why: "Merging folds your work into main so everyone gets your update on the project line.",
    markerBody: "",
    commandHint: "",
    exampleCommand: "",
    ctaButtonLabel: "Merged",
  },
];

/** Parse `git checkout -b branch-name` → branch name, or null */
export function parseCheckoutBranch(input: string): string | null {
  const normalized = input.trim().replace(/\s+/g, " ");
  const m = normalized.match(/^git\s+checkout\s+-b\s+(\S+)$/i);
  return m ? m[1] : null;
}

export function validateGitAdd(input: string): boolean {
  const n = input.trim().replace(/\s+/g, " ");
  return /^git\s+add\s+\S/i.test(n);
}

export function validateGitCommit(input: string): boolean {
  const n = input.trim().replace(/\s+/g, " ");
  return (
    /^git\s+commit\s+-m\s+["'].+["']\s*$/i.test(n) || /^git\s+commit\s+-m\s+\S+/i.test(n)
  );
}

export function validateGitPush(input: string, branchName: string): boolean {
  const n = input.trim().replace(/\s+/g, " ");
  if (!/^git\s+push\b/i.test(n)) return false;
  if (!branchName) return false;
  const escaped = branchName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(escaped, "i").test(n);
}
