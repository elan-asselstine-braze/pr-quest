# Setting up PR Quest on GitHub

Your project is already a git repo with an initial commit on `main`. Follow these steps to put it on GitHub.

## 1. Create the repo on GitHub

1. Go to [github.com/new](https://github.com/new).
2. **Repository name:** `pr-quest` (or any name you prefer).
3. **Description (optional):** e.g. "Learn pull requests in the browser—Learn, Setup, Practice for designers."
4. Choose **Public**.
5. **Do not** check "Add a README", "Add .gitignore", or "Choose a license" — you already have these in your local repo.
6. Click **Create repository**.

## 2. Connect your local repo and push

**If you get "remote origin already exists":** update the URL instead of adding:

```bash
git remote set-url origin https://github.com/YOUR_USERNAME/pr-quest.git
```

Then push (same as below).

**First-time setup:** add GitHub as the remote (replace YOUR_USERNAME with your GitHub username):

```bash
cd "/Users/elan.asselstine/Desktop/PR Quest"

git remote add origin https://github.com/YOUR_USERNAME/pr-quest.git

# Or with SSH:
# git remote add origin git@github.com:YOUR_USERNAME/pr-quest.git

# Push main
git push -u origin main
```

If you used a different repo name or org, change `YOUR_USERNAME/pr-quest` to match (e.g. `myorg/pr-quest`).

## 3. Use the PR template on GitHub

So that new PRs get the template automatically:

1. On GitHub, open your repo.
2. Go to **Settings** → **General**.
3. Under "Pull Requests", check **Allow merge commits** (or your preferred merge strategy).
4. The repo has `pull_request_template.md` in the root — GitHub automatically uses it for new PRs.

## 4. (Optional) Level 2 seeded PR

When you’re ready for Level 2:

1. Create a branch: `seeded-pr-accessibility`.
2. Add the intentional issues from `levels/seeded-issues.md`.
3. Push the branch and open a PR (you don’t have to merge it).
4. Copy the PR URL and set it in `lib/levels.ts` as `SEEDED_PR_URL`, or set the env var `NEXT_PUBLIC_SEEDED_PR_URL` when building/running.

## 5. Share the repo URL

Update these with your real repo URL so links work for designers:

- **README.md** — no change needed; it uses generic instructions.
- **Level 1 page** — the "PR template" link: replace `https://github.com/your-org/pr-quest/blob/main/pull_request_template.md` in `app/level-1/page.tsx` with your repo’s raw pull_request_template.md URL, or leave as-is and tell designers to find pull_request_template.md in the repo.
- **lib/levels.ts** — `SEEDED_PR_URL` when you have the Level 2 PR.

You’re done. Designers can clone the repo, run `npm install` and `npm run dev`, and follow **Learn**, **Setup**, and **Practice** in the app.
