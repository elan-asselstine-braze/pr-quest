import Link from "next/link";
import { ProgressBar } from "./ProgressBar";

export function LevelLayout({
  children,
  title,
  level,
}: {
  children: React.ReactNode;
  title: string;
  level?: number;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-white/10 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-[var(--color-accent)] font-semibold hover:underline">
            PR Quest
          </Link>
          <ProgressBar currentLevel={level} />
        </div>
      </header>
      <main className="flex-1 px-4 py-8 max-w-3xl mx-auto w-full">
        <h1 className="text-3xl font-bold mb-8 gradient-accent bg-clip-text text-transparent">
          {title}
        </h1>
        {children}
      </main>
    </div>
  );
}
