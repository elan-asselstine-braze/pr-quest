"use client";

import { useState } from "react";

export function CopyableCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative">
      <pre className="mt-1 p-2 pr-12 rounded bg-black/40 text-xs overflow-x-auto font-mono text-[var(--color-text)]">
        {command}
      </pre>
      <button
        type="button"
        onClick={handleCopy}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded text-[var(--color-text-muted)] hover:text-[var(--color-accent)] hover:bg-white/10 transition-colors"
        title="Copy"
        aria-label={copied ? "Copied!" : "Copy command"}
      >
        {copied ? (
          <span className="text-xs text-emerald-400">Copied</span>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
            <path d="M4 16V4a2 2 0 0 1 2-2h10" />
          </svg>
        )}
      </button>
    </div>
  );
}
