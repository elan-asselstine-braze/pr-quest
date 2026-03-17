import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex-1 px-3 py-6 sm:px-4 sm:py-8 max-w-3xl mx-auto w-full min-w-0 flex flex-col items-center justify-center min-h-[50vh] text-center">
      <p className="text-6xl font-bold text-[var(--color-text-muted)] mb-2">404</p>
      <p className="text-[var(--color-text-muted)] mb-6">This page could not be found.</p>
      <Link
        href="/"
        className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-[var(--color-accent)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
      >
        Go to Dashboard
      </Link>
    </main>
  );
}
