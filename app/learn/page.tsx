import { Suspense } from "react";
import LearnPageClient from "./LearnPageClient";

function LearnPageFallback() {
  return (
    <main className="flex-1 px-3 py-6 sm:px-4 sm:py-8 max-w-3xl mx-auto w-full min-w-0">
      <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-[var(--color-text)]">Learn How to Make Pull Requests</h1>
      <p className="text-[var(--color-text-muted)]">Loading...</p>
    </main>
  );
}

export default function LearnPage() {
  return (
    <Suspense fallback={<LearnPageFallback />}>
      <LearnPageClient />
    </Suspense>
  );
}
