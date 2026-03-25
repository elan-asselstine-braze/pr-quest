import Link from "next/link";
import { PRSimulatorGame } from "@/components/learning-game/PRSimulatorGame";

export default function LearnGamePage() {
  return (
    <main className="flex-1 px-3 py-6 sm:px-4 sm:py-8 max-w-4xl mx-auto w-full min-w-0">
      <Link
        href="/learn"
        className="text-sm text-[var(--color-accent)] hover:underline mb-4 inline-block"
      >
        ← Back to Learn
      </Link>
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-[var(--color-text)]">PR Simulator</h1>
      <PRSimulatorGame />
    </main>
  );
}
