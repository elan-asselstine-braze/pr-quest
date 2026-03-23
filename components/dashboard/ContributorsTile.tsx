import Link from "next/link";
import { contributorsList, contributorCount, CONTRIBUTOR_PLACEHOLDER } from "@/lib/contributors";

export function ContributorsTile() {
  return (
    <div className="glass-card p-4 sm:p-5 flex flex-col h-full">
      <h2 className="text-lg font-semibold mb-1">Contributors</h2>
      <p className="text-sm text-[var(--color-text-muted)] mb-4">
        {contributorCount} {contributorCount === 1 ? "person" : "people"} learning PRs
      </p>
      <ul className="flex-1 space-y-2 min-h-0">
        {contributorsList
          .filter((name) => name !== CONTRIBUTOR_PLACEHOLDER)
          .map((name, i) => (
          <li key={i} className="text-sm truncate">
            {name}
          </li>
        ))}
      </ul>
      <p className="text-xs text-[var(--color-accent)] mt-4">
        <Link href="https://github.com/elan-asselstine-braze/pr-quest/blob/main/lib/contributors.ts" target="_blank" rel="noopener noreferrer" className="hover:underline">
          Add yourself via PR →
        </Link>
      </p>
      <p className="text-xs text-[var(--color-text-muted)] mt-1">
        Edit <code className="bg-white/10 px-1 rounded">lib/contributors.ts</code>
      </p>
    </div>
  );
}
