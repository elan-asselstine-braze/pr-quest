"use client";

type BadgeProps = {
  id: number;
  label: string;
  unlocked: boolean;
};

export function Badge({ label, unlocked }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
        ${unlocked ? "bg-[var(--color-accent)]/20 text-[var(--color-accent)]" : "bg-white/5 text-[var(--color-text-muted)]"}
      `}
    >
      {unlocked ? "✓ " : "🔒 "}
      {label}
    </span>
  );
}
