"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0f0f12] text-[#f4f4f5] flex flex-col items-center justify-center p-8 font-sans">
        <h1 className="text-2xl font-bold text-[#a78bfa] mb-4">Something went wrong</h1>
        <p className="text-[#a1a1aa] mb-4 max-w-md text-center">
          {error?.message ?? "An unexpected error occurred."}
        </p>
        {error?.digest && (
          <p className="text-xs text-[#71717a] mb-4 font-mono">Digest: {error.digest}</p>
        )}
        <button
          onClick={reset}
          className="px-4 py-2 rounded-lg bg-[#a78bfa]/20 text-[#a78bfa] hover:bg-[#a78bfa]/30 transition-colors"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
