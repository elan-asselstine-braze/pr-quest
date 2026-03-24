# PR Quest

A Next.js learning site that helps designers get comfortable submitting pull requests. Everything happens in the browser: **Learn** (concepts), **Setup** (clone, branch, push), **Practice** (guided tasks and a quest map), and level pages for your first PR, review practice, and debugging.

**New to this repo?** See [docs/GITHUB_SETUP.md](docs/GITHUB_SETUP.md) for how to put this project on GitHub and push your first commit.

**Sharing with designers:** Send them the deployed site URL or the repo. They follow in-app steps—no separate command-line tutorial.

## Branch naming (important)

Use this convention so everyone can work in the same repo without collisions:

- **Task 1:** `task1-yourname` (e.g. `task1-elan`)
- **Task 2:** `task2-yourname`
- **Task 3:** `task3-yourname`

Everyone branches off `main`. Don’t merge during the session unless it’s curated; merges are controlled afterward.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Keep `npm run dev` running while you edit; the site hot-reloads so you can preview changes before opening a PR.

## What’s in the app

| Area | Purpose |
|------|---------|
| **Dashboard** | Progress, contributors, emoji of the day, playful buttons |
| **Learn** | Short modules on PRs, Git, and review |
| **Setup** | Step-by-step: clone, branch, edit, commit, push |
| **Practice** | “Start here” beginner tasks, then a quest map of optional tasks (by difficulty) |

Level pages (`/level-1`, `/level-2`, `/level-3`) walk through your first PR, reviewing a seeded PR, and hunting an intentional UI bug with Cursor.

## Project structure

- `app/` – Next.js App Router pages (dashboard, learn, setup, practice, levels, tasks)
- `components/` – UI (TabNav, dashboard tiles, PracticeMap, etc.)
- `lib/` – Contributors list, level metadata, practice tasks, theme tokens
- `levels/` – Facilitator notes and seeded-issue ideas for Level 2
- `scripts/` – `seed-review-prs.js` for maintainers (optional PR scaffolding)
- `docs/` – GitHub setup, deployment, testing notes

## Contributing

1. Create a branch: `git checkout -b task1-yourname`
2. Make your change (e.g. add your name in `lib/contributors.ts`, or a practice task).
3. Commit and push, then open a pull request using the PR template.
