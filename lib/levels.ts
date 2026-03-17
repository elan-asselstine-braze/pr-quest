export const levels = [
  { id: 1, title: "Ship Your Mark", badge: "First Ship 🚀", path: "/level-1" },
  { id: 2, title: "Review Like a Pro", badge: "Sharp Reviewer 🔍", path: "/level-2" },
  { id: 3, title: "AI Debug Mode", badge: "AI Detective 🧠", path: "/level-3" },
] as const;

/** Difficulty tier for progressive unlock */
export type TaskDifficulty = "beginner" | "intermediate" | "advanced";

/** Unlock requirement: first-pr | all beginner done | all intermediate done */
export type UnlocksAfter = "first-pr" | "beginner" | "intermediate";

export type PracticeTask = {
  id: number;
  title: string;
  description: string;
  path: string;
  difficulty: TaskDifficulty;
  unlocksAfter: UnlocksAfter;
  branchPrefix: string;
  /** File(s) to edit - for guidance */
  file?: string;
  /** Cursor prompts for lighter guidance */
  cursorPrompts?: string[];
};

/** Practice tasks: progressive unlock. First PR always first; beginner unlocks after it; intermediate after all beginner; advanced after all intermediate. */
export const practiceTasks: PracticeTask[] = [
  {
    id: 1,
    title: "Your first PR",
    description: "Add your name to the contributors list on the Dashboard.",
    path: "/level-1",
    difficulty: "beginner",
    unlocksAfter: "first-pr",
    branchPrefix: "task1",
    file: "lib/contributors.ts",
  },
  {
    id: 2,
    title: "Change the hero text",
    description: "Update any of the headers on the Dashboard or other pages.",
    path: "/task/2",
    difficulty: "beginner",
    unlocksAfter: "first-pr",
    branchPrefix: "task2",
    file: "app/page.tsx, app/learn/page.tsx, etc.",
  },
  {
    id: 3,
    title: "Change the CTA button color",
    description: "Update the accent color of the primary buttons.",
    path: "/task/3",
    difficulty: "beginner",
    unlocksAfter: "first-pr",
    branchPrefix: "task3",
    file: "app/globals.css",
  },
  {
    id: 4,
    title: "Add a new emoji to the homepage",
    description: "Add another emoji option to the Emoji of the Day tile.",
    path: "/task/4",
    difficulty: "beginner",
    unlocksAfter: "first-pr",
    branchPrefix: "task4",
    file: "lib/emojiOfTheDay.ts",
  },
  {
    id: 5,
    title: "Add an interestingly useless button",
    description: "Add a fun, useless button to the dashboard button menu.",
    path: "/task/5",
    difficulty: "beginner",
    unlocksAfter: "first-pr",
    branchPrefix: "task5",
    file: "lib/playfulButtons.ts, components/dashboard/ButtonMenuTile.tsx",
  },
  {
    id: 6,
    title: "Add a task filter",
    description: "Filter practice tasks by difficulty (beginner, intermediate, advanced).",
    path: "/task/6",
    difficulty: "intermediate",
    unlocksAfter: "beginner",
    branchPrefix: "task6",
    file: "app/practice/page.tsx",
    cursorPrompts: [
      "How do I add a filter dropdown to the Practice page?",
      "Filter the practiceTasks array by difficulty",
    ],
  },
  {
    id: 7,
    title: "Add a light mode toggle",
    description: "Let users switch between dark and light theme.",
    path: "/task/7",
    difficulty: "intermediate",
    unlocksAfter: "beginner",
    branchPrefix: "task7",
    file: "app/globals.css, app/layout.tsx",
    cursorPrompts: [
      "How do I add a theme toggle (dark/light mode)?",
      "Add CSS variables for light mode",
    ],
  },
  {
    id: 8,
    title: "Add a Back to top button",
    description: "Show a button on scroll that smoothly scrolls to the top.",
    path: "/task/8",
    difficulty: "advanced",
    unlocksAfter: "intermediate",
    branchPrefix: "task8",
    cursorPrompts: [
      "Add a scroll-to-top button that appears when user scrolls down",
      "Use scroll position to show/hide the button",
    ],
  },
  {
    id: 9,
    title: "Add a confirmation before reset",
    description: "Ask the user to confirm before resetting progress on the Learn page.",
    path: "/task/9",
    difficulty: "advanced",
    unlocksAfter: "intermediate",
    branchPrefix: "task9",
    file: "app/learn/page.tsx",
    cursorPrompts: [
      "Add a confirm dialog before the reset action",
      "Use window.confirm or a modal for reset confirmation",
    ],
  },
];

/** Number of completed practice tasks */
export function getPracticeTasksComplete(progress: Progress): number {
  return practiceTasks.filter((t) => isTaskComplete(t.id, progress)).length;
}

/** Backward compat: first 3 tasks for ProgressBar/setup. Use practiceTasks for full list. */
export const quests = practiceTasks.slice(0, 3).map((t) => ({
  id: t.id,
  title: t.title,
  path: t.path,
  branchPrefix: t.branchPrefix,
  badge: t.title,
}));

/** Backward compat: unlock check for quest ids (uses practice task unlock logic). */
export function isQuestUnlocked(questId: number, progress: Progress): boolean {
  const task = practiceTasks.find((t) => t.id === questId);
  return task ? isPracticeTaskUnlocked(task, progress) : false;
}

/** Next incomplete practice task that is unlocked */
export function getNextPracticeTask(progress: Progress): PracticeTask | null {
  return practiceTasks.find((t) => !isTaskComplete(t.id, progress) && isPracticeTaskUnlocked(t, progress)) ?? null;
}

/** Branch name for a task: {prefix}-yourname */
export function getBranchName(task: PracticeTask, yourName: string): string {
  const slug = yourName.replace(/\s+/g, "-").toLowerCase();
  return `${task.branchPrefix}-${slug}`;
}

/** Check if a practice task is complete. Task 1 uses level1; others use taskProgress. */
export function isTaskComplete(taskId: number, progress: Progress): boolean {
  if (taskId === 1) return progress.level1?.complete ?? false;
  return progress.taskProgress?.[taskId] ?? false;
}

/** Check if a practice task is unlocked based on progress. */
export function isPracticeTaskUnlocked(task: PracticeTask, progress: Progress): boolean {
  if (task.unlocksAfter === "first-pr") {
    if (task.id === 1) return true;
    return isTaskComplete(1, progress);
  }
  if (task.unlocksAfter === "beginner") {
    const beginnerTasks = practiceTasks.filter((t) => t.difficulty === "beginner");
    return beginnerTasks.every((t) => isTaskComplete(t.id, progress));
  }
  // unlocksAfter "intermediate" = all intermediate tasks must be complete (unlocks advanced)
  const intermediateTasks = practiceTasks.filter((t) => t.difficulty === "intermediate");
  return intermediateTasks.every((t) => isTaskComplete(t.id, progress));
}

/** XP / level-up framing: complete modules to earn XP, level up at thresholds (Pokémon-style) */
export const XP_PER_LEVEL = 100;
export const TASK1_XP = 100; // First PR
export const TASK_BEGINNER_XP = 25;
export const TASK_INTERMEDIATE_XP = 50;
export const TASK_ADVANCED_XP = 75;
export const MAX_LEVEL = 3;
export const MAX_XP = 500; // Generous cap for many tasks

export function getTotalXP(progress: Progress): number {
  let xp = 0;
  if (progress.level1?.complete) xp += TASK1_XP;
  for (const task of practiceTasks) {
    if (task.id === 1) continue;
    if (isTaskComplete(task.id, progress)) {
      if (task.difficulty === "beginner") xp += TASK_BEGINNER_XP;
      else if (task.difficulty === "intermediate") xp += TASK_INTERMEDIATE_XP;
      else if (task.difficulty === "advanced") xp += TASK_ADVANCED_XP;
    }
  }
  return xp;
}

/** Current level (1–3) based on total XP. Level 2 at 100+ XP, Level 3 at 200+ XP. */
export function getCurrentLevel(progress: Progress): number {
  return getCurrentLevelFromXP(getTotalXP(progress));
}

/** Level from raw XP total (use when XP includes setup/learn bonuses). */
export function getCurrentLevelFromXP(totalXP: number): number {
  if (totalXP >= 200) return 3;
  if (totalXP >= 100) return 2;
  return 1;
}

/** Learn modules: conceptual order (What is PR → Git basics → Creating PR → Review). */
export type LearnModule = {
  id: number;
  title: string;
  summary: string;
  path: string;
  /** Which practice level completion counts for this module (for progress). */
  completeWhenLevel: 1 | 2 | 3;
  /** Optional icon (emoji) for the module card. */
  icon?: string;
};

export const learnModules: LearnModule[] = [
  {
    id: 1,
    title: "What is a Pull Request?",
    summary: "Learn the basics of PRs and why they matter",
    path: "/level-1",
    completeWhenLevel: 1,
    icon: "🔀",
  },
  {
    id: 2,
    title: "Git & GitHub Basics",
    summary: "Understand version control fundamentals",
    path: "/setup",
    completeWhenLevel: 1,
    icon: "📦",
  },
  {
    id: 3,
    title: "Creating a Good PR",
    summary: "Best practices for pull requests",
    path: "/level-1",
    completeWhenLevel: 1,
    icon: "💬",
  },
  {
    id: 4,
    title: "The Review Process",
    summary: "What happens after you submit",
    path: "/level-2",
    completeWhenLevel: 2,
    icon: "✅",
  },
];

function isLevelComplete(progress: Progress, levelNum: 1 | 2 | 3): boolean {
  const level = progress[`level${levelNum}`];
  return level && "complete" in level ? level.complete : false;
}

/** Number of learn modules completed (module complete when its practice level is complete). */
export function getLearnModulesCompleted(progress: Progress): number {
  const completed = new Set<number>();
  for (const m of learnModules) {
    if (isLevelComplete(progress, m.completeWhenLevel)) completed.add(m.id);
  }
  return completed.size;
}

/** Storage key for learn modules the user has marked complete (before doing practice). */
export const LEARN_MARKED_COMPLETE_KEY = "pr-quest-learn-marked";

/** Storage key for setup marked complete. */
export const SETUP_COMPLETE_KEY = "pr-quest-setup-complete";

/** XP granted when user marks a learn module complete (display only). */
export const LEARN_MODULE_XP = 25;

/** XP granted when user marks setup complete. */
export const SETUP_XP = 25;

/** Combined completed count: practice-complete modules + user-marked modules (by id). */
export function getLearnModulesCompletedWithMarked(
  progress: Progress,
  markedIds: number[]
): number {
  const completed = new Set<number>();
  for (const m of learnModules) {
    if (isLevelComplete(progress, m.completeWhenLevel)) completed.add(m.id);
  }
  markedIds.forEach((id) => completed.add(id));
  return completed.size;
}

/** Whether a learn module is complete (marked or practice done). */
function isLearnModuleComplete(m: LearnModule, progress: Progress, markedIds: number[]): boolean {
  return markedIds.includes(m.id) || isLevelComplete(progress, m.completeWhenLevel);
}

/** First incomplete learn module, or null if all done. */
export function getNextLearnModule(
  progress: Progress,
  markedIds: number[]
): LearnModule | null {
  return learnModules.find((m) => !isLearnModuleComplete(m, progress, markedIds)) ?? null;
}

/** URL for the Level 2 seeded PR (legacy single-PR link) */
export const SEEDED_PR_URL =
  process.env.NEXT_PUBLIC_SEEDED_PR_URL || "https://github.com/elan-asselstine-braze/pr-quest/pulls";

/** Seeded PRs for review practice. Set via NEXT_PUBLIC_SEEDED_REVIEW_PRS (JSON array) or add URLs here. */
export type SeededReviewPR = {
  title: string;
  url: string;
  focus: string;
};

function getSeededReviewPRs(): SeededReviewPR[] {
  try {
    const env = process.env.NEXT_PUBLIC_SEEDED_REVIEW_PRS;
    if (env) {
      const parsed = JSON.parse(env) as SeededReviewPR[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // ignore
  }
  const base = SEEDED_PR_URL.split("?")[0].replace(/\/pull\/\d+.*$/, "/pulls");
  return [
    { title: "Spacing", url: `${base}?q=is%3Apr+is%3Aopen+head%3Aseeded-pr-spacing`, focus: "Hardcoded spacing values" },
    { title: "Link colors", url: `${base}?q=is%3Apr+is%3Aopen+head%3Aseeded-pr-link-colors`, focus: "Links missing accent / hover" },
    { title: "Accessibility", url: `${base}?q=is%3Apr+is%3Aopen+head%3Aseeded-pr-accessibility`, focus: "Alt text, contrast" },
  ];
}

export const seededReviewPRs = getSeededReviewPRs();

/** First-PR options for Level 1 (meta: improve this site) */
export const firstChangeOptions = [
  {
    id: "contributors",
    label: "Add your name to Contributors",
    file: "lib/contributors.ts",
    task: "Add your name to the contributorsList array.",
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
  /** Task completions for practice tasks 2+ (task 1 uses level1.complete) */
  taskProgress?: Record<number, boolean>;
};

export const defaultProgress: Progress = {
  level1: { checkboxes: [false, false, false, false], complete: false },
  level2: { checkboxes: [false, false, false, false], complete: false },
  level3: { checkboxes: [false, false, false, false], complete: false },
  taskProgress: {},
};
