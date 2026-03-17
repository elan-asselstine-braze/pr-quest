# PR Quest

A self-serve learning site that helps designers get confident and comfortable submitting pull requests. Learn from the site, modify the site via PR, review seeded PRs, and use Cursor to find and fix a bug.

## Branch naming (important)

Use this convention so everyone can work in the same repo without collisions:

- **Level 1:** `level1-yourname` (e.g. `level1-elan`)
- **Level 2:** `level2-yourname`
- **Level 3:** `level3-yourname`

Everyone branches off `main`. Don’t merge during the session unless it’s curated; merges are controlled afterward.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Guided mode (CLI)

For step-by-step help through each level:

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

1. Create a branch: `git checkout -b level1-yourname`
2. Make your change (e.g. add your name to the Contributors page, or change a theme token).
3. Commit and push, then open a pull request using the PR template.
