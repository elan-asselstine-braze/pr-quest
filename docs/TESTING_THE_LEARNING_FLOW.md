# Testing the learning flow

Use this to walk through PR Quest as a designer would: website + CLI, then a full Level 1 run (branch → change → PR).

## 1. Run the site

```bash
cd "/Users/elan.asselstine/Desktop/PR Quest"
npm install   # if you haven’t already
npm run dev
```

Open **http://localhost:3000**. You should see:

- Landing page with three level cards and badges
- Links to Level 1, Level 2, Level 3
- “Run the CLI” hint: `npm run quest`

Click into each level to confirm content and checkboxes load. Try checking boxes and refreshing — progress should persist (localStorage).

---

## 2. Run the CLI (guided flow)

In a **second terminal** (keep `npm run dev` running in the first — the CLI and dev server need separate terminals):

```bash
cd "/Users/elan.asselstine/Desktop/PR Quest"
npm run quest
```

- Choose **Level 1** and enter your name when prompted.
- The CLI will:
  - Check git, Node, and `node_modules`
  - Suggest branch name and `git checkout -b task1-yourname`
  - Later steps check whether you edited the right file and have a commit

Run `npm run quest` again after each step (e.g. after creating the branch, after editing the file) to see the next step and validation.

---

## 3. Test Level 1 end-to-end (first PR)

Simulate a designer doing Level 1 on your own repo.

1. **Create branch**
   ```bash
   git checkout main
   git pull origin main
   git checkout -b task1-test
   ```

2. **Make a small change**  
   Edit `app/contributors/page.tsx`: add a test name to the `designers` array (or change a theme token in `app/globals.css`).

3. **Run the CLI again**  
   `npm run quest` → Level 1 → it should detect your branch and file changes and guide you to commit and push.

4. **Commit and push**
   ```bash
   git add app/contributors/page.tsx
   git commit -m "[Level 1] Add test name to contributors"
   git push -u origin task1-test
   ```

5. **Open a PR on GitHub**
   - Go to https://github.com/elan-asselstine-braze/pr-quest
   - Use the yellow “Compare & pull request” for `task1-test`
   - Fill in the PR template (What I changed / Why / Screenshot)

6. **Mark Level 1 complete on the site**  
   On http://localhost:3000/level-1, check all four checkboxes. The “First Ship” badge should unlock and appear on the landing page.

---

## 4. Test Level 2 (review flow)

- No seeded PR yet: the Level 2 page and CLI link to the repo’s **Pull requests** list.
- To test the page: open `/level-2`, read the diff explainer, use the “Open seeded PR” link (goes to PRs list).
- Optional: create a branch `seeded-pr-accessibility`, add the issues from `levels/seeded-issues.md`, push, open a PR, then set that PR URL in `lib/levels.ts` as `SEEDED_PR_URL` (or `NEXT_PUBLIC_SEEDED_PR_URL`) so Level 2 points at a real PR.

---

## 5. Test Level 3 (bug hunt)

1. Open **http://localhost:3000/level-3**.
2. Hover the “Something feels off here” card — the intentional bug (state-driven re-render) may cause a small flicker or layout shift.
3. Use the **Power Prompts** (copy into Cursor) to find and fix `components/BuggyCard.tsx`.
4. Check the four checkboxes when done to unlock the “AI Detective” badge.

---

## Quick checklist

| What to test              | How |
|---------------------------|-----|
| Site loads                | `npm run dev` → http://localhost:3000 |
| Level pages and checkboxes| Click Level 1–3, toggle checkboxes, refresh (progress persists) |
| CLI level menu            | `npm run quest` → pick Level 1, 2, or 3 |
| CLI Level 1 validation    | Run `npm run quest` after branch, after edit, after commit |
| Full Level 1 flow         | Branch → edit contributors → commit → push → open PR on GitHub → check boxes on site |
| Level 3 bug               | Hover BuggyCard on /level-3, use Cursor to fix it |
