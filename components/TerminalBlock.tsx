"use client";

import { useState } from "react";
import type { TerminalCommand } from "@/lib/terminalCommands";

type TerminalBlockProps = {
  commands: TerminalCommand[];
  title?: string;
  prompt?: string;
  copyLabel?: string;
};

export function TerminalBlock({
  commands,
  title = "Practice these commands",
  prompt = "$ ",
  copyLabel = "Copy",
}: TerminalBlockProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyCommand = (command: string, index: number) => {
    navigator.clipboard.writeText(command);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const copyAll = () => {
    const text = commands.map((c) => c.command).join("\n");
    navigator.clipboard.writeText(text);
    setCopiedIndex(-1);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="rounded-lg overflow-hidden border border-white/10 bg-[#0d0d0f] font-mono text-sm">
      {/* Window chrome */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-white/10 bg-black/30">
        <span className="w-3 h-3 rounded-full bg-white/20" />
        <span className="w-3 h-3 rounded-full bg-white/20" />
        <span className="w-3 h-3 rounded-full bg-white/20" />
        {title && (
          <span className="text-[var(--color-text-muted)] text-xs ml-2">{title}</span>
        )}
      </div>

      <div className="p-4 space-y-4">
        {commands.map(({ command, explanation }, index) => (
          <div key={index} className="space-y-1">
            <div className="flex items-start gap-2 flex-wrap">
              <span className="text-emerald-400/90 shrink-0">{prompt}</span>
              <code className="text-[var(--color-text)] break-all">{command}</code>
              <button
                type="button"
                onClick={() => copyCommand(command, index)}
                className="text-xs px-2 py-1 rounded bg-white/10 text-[var(--color-text-muted)] hover:text-[var(--color-accent)] hover:bg-white/15 transition-colors shrink-0"
              >
                {copiedIndex === index ? "Copied!" : copyLabel}
              </button>
            </div>
            <p className="text-xs text-[var(--color-text-muted)] pl-5">
              What this does: {explanation}
            </p>
          </div>
        ))}
      </div>

      <div className="px-4 pb-4">
        <button
          type="button"
          onClick={copyAll}
          className="text-xs px-3 py-1.5 rounded bg-[var(--color-accent)]/20 text-[var(--color-accent)] hover:bg-[var(--color-accent)]/30 transition-colors"
        >
          {copiedIndex === -1 ? "Copied!" : "Copy all commands"}
        </button>
      </div>
    </div>
  );
}
