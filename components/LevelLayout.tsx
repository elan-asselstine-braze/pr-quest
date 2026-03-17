import Link from "next/link";
import { ProgressBar } from "./ProgressBar";

export function LevelLayout({
  children,
  title,
  level,
  hideHeader,
  titleLarge,
  hideGradient,
}: {
  children: React.ReactNode;
  title: string;
  level?: number;
  hideHeader?: boolean;
  titleLarge?: boolean;
  hideGradient?: boolean;
}) {
  const titleClass = [
    "font-bold mb-6 sm:mb-8",
    titleLarge ? "text-4xl sm:text-5xl md:text-6xl" : "text-2xl sm:text-3xl",
    hideGradient ? "text-[var(--color-text)]" : "gradient-accent bg-clip-text text-transparent",
  ].join(" ");

  return (
    <div className="min-h-screen flex flex-col">
      {!hideHeader && (
        <header className="border-b border-white/10 px-3 py-2 sm:px-4 sm:py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-wrap">
            <Link href="/" className="text-[var(--color-accent)] font-semibold hover:underline shrink-0">
              PR Quest
            </Link>
            <ProgressBar currentLevel={level} />
          </div>
        </header>
      )}
      <main className="flex-1 px-3 py-6 sm:px-4 sm:py-8 max-w-3xl mx-auto w-full min-w-0">
        <h1 className={titleClass}>
          {title}
        </h1>
        {children}
      </main>
    </div>
  );
}
