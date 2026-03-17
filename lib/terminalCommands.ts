export type TerminalCommand = {
  command: string;
  explanation: string;
};

/** Level 1: branch, run app, stage, commit, push */
export const level1Commands: TerminalCommand[] = [
  {
    command: "git checkout -b task1-yourname",
    explanation:
      'Creates a new branch and switches to it. Replace "yourname" with your name. Your work stays separate from main.',
  },
  {
    command: "npm install",
    explanation:
      "Downloads the project's dependencies so you can run the app. Run this once after cloning.",
  },
  {
    command: "npm run dev",
    explanation:
      "Starts the local dev server. Keep it running and open http://localhost:3000 to see your changes.",
  },
  {
    command: "git status",
    explanation: "Shows which files you've changed. Use this before adding and committing.",
  },
  {
    command: "git add lib/contributors.ts",
    explanation:
      "Stages the file so it's included in your next commit. (Use the file you actually changed.)",
  },
  {
    command: 'git commit -m "[Level 1] Add my name to contributors"',
    explanation: "Saves your staged changes with a message that describes what you did.",
  },
  {
    command: "git push -u origin task1-yourname",
    explanation: "Uploads your branch to GitHub so you can open a pull request.",
  },
];

/** Level 3: branch, commit, push for the fix */
export const level3Commands: TerminalCommand[] = [
  {
    command: "git checkout -b task3-yourname",
    explanation:
      'Creates a new branch for your fix. Replace "yourname" with your name.',
  },
  {
    command: "git add components/BuggyCard.tsx",
    explanation: "Stages the file you fixed so it's included in your commit.",
  },
  {
    command: 'git commit -m "[Level 3] Fix hover flicker in BuggyCard"',
    explanation: "Saves your fix with a short message.",
  },
  {
    command: "git push -u origin task3-yourname",
    explanation: "Uploads your branch to GitHub so you can open a pull request.",
  },
];
