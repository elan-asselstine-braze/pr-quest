# Deploy PR Quest to Vercel

Use this to deploy the site so you can test the full flow (Learn → Setup → Practice) as a new user.

## 1. Push your code to GitHub

Ensure your latest changes are pushed:

```bash
git push origin main
```

## 2. Deploy to Vercel

### Option A: Vercel Dashboard (recommended)

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
2. Click **Add New** → **Project**.
3. Import the `pr-quest` repository (or `elan-asselstine-braze/pr-quest`).
4. Vercel will auto-detect Next.js. Keep the defaults.
5. Click **Deploy**.
6. Wait for the build. Your site will be live at `https://your-project.vercel.app`.

### Option B: Vercel CLI

```bash
npm i -g vercel
cd "/path/to/pr-quest"
vercel
```

Follow the prompts to link the project and deploy.

## 3. Environment variables (optional)

If you use custom values, add them in **Project Settings → Environment Variables**:

| Variable | Example | Purpose |
|----------|---------|---------|
| `NEXT_PUBLIC_REPO_URL` | `https://github.com/your-org/pr-quest` | Links in the app point to your repo |
| `NEXT_PUBLIC_SEEDED_REVIEW_PRS` | JSON array of PR objects | Direct links to seeded review PRs |

For testing the flow, the defaults work.

## 4. Test the full flow as a new user

1. **Use incognito/private mode** (or a different browser) so localStorage is fresh.
2. Open your Vercel URL (e.g. `https://pr-quest.vercel.app`).
3. **Learn** – Go through the Learn modules, mark them complete as desired.
4. **Setup** – Follow the Setup page (clone the **org repo**, install, create branch). Internal users clone the shared repository, not a fork.
5. **Practice** – Start with Level 1 (Your first PR), make the change, preview, commit, push, open PR.

## 5. Repo for new users

If you want users to clone and contribute to a specific repo:

- Set `NEXT_PUBLIC_REPO_URL` to that repo in Vercel.
- Ensure the Setup page clone command matches (it reads from `docs` or you can add an env-based clone URL).

## 6. Seeded PRs for review practice

To add seeded PRs for Level 2:

```bash
npm run seed-review-prs
git push origin seeded-pr-spacing seeded-pr-link-colors seeded-pr-accessibility
```

Then create PRs on GitHub for each branch and optionally set `NEXT_PUBLIC_SEEDED_REVIEW_PRS`.
