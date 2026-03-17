type Label = { text: string; position: "top" | "left" | "right" | "bottom" };

export function WhatYoullSee({
  title = "What you'll see",
  caption,
  labels = [],
}: {
  title?: string;
  caption?: string;
  labels?: Label[];
}) {
  return (
    <div className="glass-card border-dashed border-2 border-[var(--color-accent)]/30">
      <p className="text-sm font-medium text-[var(--color-accent)] mb-2">{title}</p>
      {/* Placeholder for screenshot – replace with actual image when available */}
      <div className="bg-black/30 rounded-lg aspect-video flex items-center justify-center text-[var(--color-text-muted)] text-sm">
        GitHub: Create pull request screen
      </div>
      {labels.length > 0 && (
        <ul className="mt-2 space-y-1 text-xs text-[var(--color-text-muted)]">
          {labels.map((l, i) => (
            <li key={i}>{l.text}</li>
          ))}
        </ul>
      )}
      {caption && <p className="mt-2 text-sm text-[var(--color-text-muted)]">{caption}</p>}
    </div>
  );
}
