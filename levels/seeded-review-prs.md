# Seeded PRs for Review Practice

Run `npm run seed-review-prs` to create branches with intentional issues. Learners practice leaving review comments on real GitHub PRs.

## Branches created

| Branch | Focus | Issues to find |
|--------|-------|----------------|
| `seeded-pr-spacing` | Spacing | Hardcoded `marginBottom: "18px"`, `gap: "22px"` instead of theme tokens |
| `seeded-pr-link-colors` | Link styling | Links with `text-gray-500` instead of accent; missing `hover:underline` |
| `seeded-pr-accessibility` | Accessibility | Image without `alt`; low-contrast button (`bg-gray-500/50 text-gray-400`) |

## After running the script

1. Push the branches:
   ```bash
   git push origin seeded-pr-spacing seeded-pr-link-colors seeded-pr-accessibility
   ```

2. On GitHub, open a PR for each branch → `main`.

3. (Optional) Configure direct PR URLs in `.env.local`:
   ```
   NEXT_PUBLIC_SEEDED_REVIEW_PRS='[{"title":"Spacing","url":"https://github.com/owner/repo/pull/1","focus":"Hardcoded spacing values"},{"title":"Link colors","url":"https://github.com/owner/repo/pull/2","focus":"Links missing accent / hover"},{"title":"Accessibility","url":"https://github.com/owner/repo/pull/3","focus":"Alt text, contrast"}]'
   ```

   Without this, Level 2 links to the PR list filtered by branch name.
