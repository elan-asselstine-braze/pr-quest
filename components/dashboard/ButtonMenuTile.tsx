"use client";

import { playfulButtons } from "@/lib/playfulButtons";

export function ButtonMenuTile() {
  return (
    <div className="glass-card p-4 sm:p-5 flex flex-col h-full">
      <h2 className="text-lg font-semibold mb-1">Button menu</h2>
      <p className="text-sm text-[var(--color-text-muted)] mb-4">
        Fun buttons added via PR
      </p>
      <ul className="flex-1 space-y-2">
        {playfulButtons.map((btn, i) => (
          <li key={i}>
            <button
              type="button"
              className={`
                w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-90
                ${btn.color ?? "bg-[var(--color-accent)]/20 text-[var(--color-accent)]"}
              `}
            >
              {btn.label}
            </button>
          </li>
        ))}
      </ul>
      <p className="text-xs text-[var(--color-accent)] mt-4">
        <a
          href="https://github.com/elan-asselstine-braze/pr-quest/blob/main/lib/playfulButtons.ts"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          Add a button via PR →
        </a>
      </p>
      <p className="text-xs text-[var(--color-text-muted)] mt-1">
        Edit <code className="bg-white/10 px-1 rounded">lib/playfulButtons.ts</code>
      </p>
    </div>
  );
}
