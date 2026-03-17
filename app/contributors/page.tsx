import Link from "next/link";
import { contributorsList } from "@/lib/contributors";

export default function ContributorsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-white/10 px-4 py-3 flex items-center gap-4">
        <Link href="/" className="text-[var(--color-accent)] font-semibold hover:underline">
          PR Quest
        </Link>
        <Link href="/level-1" className="text-[var(--color-text-muted)] text-sm hover:text-[var(--color-text)]">
          First PR
        </Link>
      </header>

      <main className="flex-1 px-4 py-12 max-w-2xl mx-auto w-full">
        <h1 className="text-3xl font-bold mb-2">Designers Who Shipped</h1>
        <p className="text-[var(--color-text-muted)] mb-8">
          Everyone listed here completed their first PR and opened a PR to add their name. Edit{" "}
          <code className="bg-white/10 px-1 rounded">lib/contributors.ts</code> and open a PR.
        </p>

        <ul className="space-y-2">
          {contributorsList.map((name, i) => (
            <li key={i} className="glass-card list-none">
              {name}
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
