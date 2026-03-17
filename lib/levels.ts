export const levels = [
  { id: 1, title: "Ship Your Mark", badge: "First Ship 🚀", path: "/level-1" },
  { id: 2, title: "Review Like a Pro", badge: "Sharp Reviewer 🔍", path: "/level-2" },
  { id: 3, title: "AI Debug Mode", badge: "AI Detective 🧠", path: "/level-3" },
] as const;

/** URL for the Level 2 seeded PR (set before session or via env) */
export const SEEDED_PR_URL =
  process.env.NEXT_PUBLIC_SEEDED_PR_URL || "https://github.com/elan-asselstine-braze/pr-quest/pulls";

/** First-PR options for Level 1 (meta: improve this site) */
export const firstChangeOptions = [
  {
    id: "contributors",
    label: "Add your name to Contributors",
    file: "app/contributors/page.tsx",
    task: "Add your name to the Designers Who Shipped list.",
  },
  {
    id: "theme",
    label: "Change the color theme",
    file: "styles/theme.ts or app/globals.css",
    task: "Change an accent color or token in the theme.",
  },
  {
    id: "font",
    label: "Change the font",
    file: "app/globals.css",
    task: "Update --font-sans or --font-heading (e.g. add a Google Font).",
  },
  {
    id: "profile",
    label: "Add or improve a profile card",
    file: "app/contributors/page.tsx",
    task: "Add a small profile card for yourself or improve the card layout.",
  },
] as const;

/** Level 3 Power Prompts (Cursor) */
export const powerPrompts = [
  "Where is this component defined?",
  "Why might this hover flicker?",
  "What controls this animation?",
  "Explain this file in plain English.",
  "Suggest a clean fix for this bug.",
  "Is this accessible?",
] as const;

export const STORAGE_KEY = "pr-quest-progress";

export type Progress = {
  level1: { checkboxes: boolean[]; complete: boolean };
  level2: { checkboxes: boolean[]; complete: boolean };
  level3: { checkboxes: boolean[]; complete: boolean };
};

export const defaultProgress: Progress = {
  level1: { checkboxes: [false, false, false, false], complete: false },
  level2: { checkboxes: [false, false, false, false], complete: false },
  level3: { checkboxes: [false, false, false, false], complete: false },
};
