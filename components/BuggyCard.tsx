"use client";

import { useState } from "react";

/**
 * Intentional bug for Level 3: hover triggers state update which re-renders
 * and can cause flicker or layout shift. Designers investigate with Cursor
 * and fix (e.g. use CSS-only hover, or stabilize the layout).
 */
export function BuggyCard() {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`
        glass-card cursor-pointer transition-all duration-150
        ${hovered ? "scale-105 border-[var(--color-accent)]/50" : ""}
      `}
    >
      <p className="font-medium">Something feels off here</p>
      <p className="text-sm text-[var(--color-text-muted)] mt-1">
        Hover me. If you notice flicker or a jump, you’ve found the bug. Use Cursor to investigate.
      </p>
      {hovered && <p className="text-xs text-[var(--color-accent)] mt-2">Hovering! (state update → re-render)</p>}
    </div>
  );
}
