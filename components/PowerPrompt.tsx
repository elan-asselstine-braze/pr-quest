"use client";

import { useState } from "react";

export function PowerPrompt({ prompt, label = "Cursor prompt" }: { prompt: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card group">
      <p className="text-xs font-medium text-[var(--color-text-muted)] mb-2">{label}</p>
      <p className="text-sm mb-3">&quot;{prompt}&quot;</p>
      <button
        type="button"
        onClick={copy}
        className="text-xs px-3 py-1.5 rounded-lg bg-[var(--color-accent)]/20 text-[var(--color-accent)] hover:bg-[var(--color-accent)]/30 transition-colors"
      >
        {copied ? "Copied!" : "Copy for Cursor"}
      </button>
    </div>
  );
}
