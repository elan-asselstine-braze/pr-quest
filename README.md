# PR Quest

A self-serve learning site that helps designers get confident and comfortable submitting pull requests.

**New to this repo?** See [docs/GITHUB_SETUP.md](docs/GITHUB_SETUP.md) for how to put this project on GitHub and push your first commit.

**Easiest way to share with designers:** Send them the link to the site (or the repo). They can do everything from the website: read the theory on Level 1, then follow the “Easiest path” steps there to make one change and open a PR. No CLI required.

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

Open [http://localhost:3000](http://localhost:3000). **To see your changes before submitting a PR:** keep `npm run dev` running while you edit files; the site will hot-reload so you can preview everything in the browser first.

## Guided mode (CLI)

For step-by-step help through each level, open a **second terminal** (keep `npm run dev` running in the first):

```bash
npm run quest
```

Then choose Level 1, 2, or 3. The CLI checks your environment, suggests commands, and explains what each command does.

## Project structure

- `app/` – Next.js pages (landing, level-1, level-2, level-3, contributors)
- `components/` – UI (ProgressBar, Badge, PowerPrompt, DiffExplainer, etc.)
- `lib/` – Level metadata and config
- `levels/` – Level docs and seeded-issue notes
- `scripts/quest.js` – CLI for guided levels
- `styles/` – Theme tokens and global CSS

## Contributing

1. Create a branch: `git checkout -b task1-yourname`
2. Make your change (e.g. add your name to the Contributors page, or change a theme token).
3. Commit and push, then open a pull request using the PR template.
