type Label = { text: string; position: "top" | "left" | "right" | "bottom" };

export function WhatYoullSee({
  title = "What you'll see",
  caption,
  labels = [],
  src,
}: {
  title?: string;
  caption?: string;
  labels?: Label[];
  src?: string;
}) {
  return (
    <div className="glass-card border-dashed border-2 border-[var(--color-accent)]/30">
      <p className="text-sm font-medium text-[var(--color-accent)] mb-2">{title}</p>
      {src ? (
        <img
          src={src}
          alt={title}
          className="rounded-lg border border-white/10 w-full max-w-2xl"
        />
      ) : (
        <div className="bg-black/30 rounded-lg aspect-video flex items-center justify-center text-[var(--color-text-muted)] text-sm">
          GitHub: Create pull request screen
        </div>
      )}
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
