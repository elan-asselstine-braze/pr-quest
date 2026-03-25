"use client";

import { useCallback, useState } from "react";

type CopyableCommandProps = {
  /** Exact string copied to the clipboard and shown in the block. */
  command: string;
  className?: string;
};

export function CopyableCommand({ command, className = "" }: CopyableCommandProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard denied or unavailable — ignore
    }
  }, [command]);

  return (
    <div
      className={`flex items-stretch overflow-hidden rounded-lg border border-white/10 bg-black/40 ${className}`}
    >
      <code className="min-w-0 flex-1 overflow-x-auto px-3 py-2.5 pr-2 font-mono text-[13px] leading-relaxed text-emerald-300/95 sm:text-sm">
        {command}
      </code>
      <button
        type="button"
        onClick={handleCopy}
        className="shrink-0 border-l border-white/10 bg-white/[0.03] px-3 text-xs font-medium text-zinc-400 transition-colors hover:bg-white/[0.06] hover:text-[var(--color-accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/50"
        aria-label={`Copy command: ${command}`}
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
