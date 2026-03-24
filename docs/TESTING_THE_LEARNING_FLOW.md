# Testing the learning flow

Use this to walk through PR Quest as a designer would: the website only, then a full first-PR run (branch → change → PR).

## 1. Run the site

```bash
cd "/path/to/pr-quest"
npm install   # if you haven’t already
npm run dev
```

Open **http://localhost:3000**. You should see:

- **Dashboard** with progress, contributors, emoji of the day, and buttons
- **Learn**, **Setup**, and **Practice** in the sidebar

Click through **Learn** modules, **Setup** steps, and **Practice** (start tasks + quest map). On **Level 1** (`/level-1`), confirm content and checkboxes load. Try checking boxes and refreshing—progress should persist (localStorage).

---

## 2. Test Level 1 end-to-end (first PR)

Simulate a designer doing their first PR on your own repo.

1. **Create branch**
   ```bash
   git checkout main
   git pull origin main
   git checkout -b task1-test
   ```

2. **Make a small change**  
   Edit `lib/contributors.ts`: add a test name to `contributorsList` (or follow the Level 1 page for the exact file).

3. **Commit and push**
   ```bash
   git add lib/contributors.ts
   git commit -m "[Level 1] Add test name to contributors"
   git push -u origin task1-test
   ```

4. **Open a PR on GitHub**
   - Go to your repo on GitHub
   - Use the yellow “Compare & pull request” for `task1-test`
   - Fill in the PR template (What I changed / Why / Screenshot)

5. **Mark Level 1 complete on the site**  
   On http://localhost:3000/level-1, complete the steps (checkboxes). The dashboard should reflect progress.

---

## 3. Test Level 2 (review flow)

- With no seeded PR: the Level 2 page links to the repo’s **Pull requests** list.
- Open `/level-2`, read the diff explainer, use the seeded PR links.
- Optional: create a branch `seeded-pr-accessibility`, add the issues from `levels/seeded-issues.md`, push, open a PR, then set that PR URL in `lib/levels.ts` as `SEEDED_PR_URL` (or `NEXT_PUBLIC_SEEDED_PR_URL`) so Level 2 points at a real PR.

---

## 4. Test Level 3 (bug hunt)

1. Open **http://localhost:3000/level-3**.
2. Hover the “Something feels off here” card—the intentional bug may cause a small flicker or layout shift.
3. Use the **Power Prompts** (copy into Cursor) to find and fix `components/BuggyCard.tsx`.
4. Check the four checkboxes when done.

---

## Quick checklist

| What to test               | How |
|----------------------------|-----|
| Site loads                 | `npm run dev` → http://localhost:3000 |
| Learn / Setup / Practice   | Use sidebar; Practice map and start tasks |
| Level pages and checkboxes | Level 1–3; toggle checkboxes, refresh (progress persists) |
| Full Level 1 flow          | Branch → edit `lib/contributors.ts` → commit → push → PR on GitHub → complete steps on site |
| Level 3 bug                | Hover BuggyCard on `/level-3`, use Cursor to fix it |
