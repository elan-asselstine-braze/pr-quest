"use client";

/**
 * Placeholder for step screenshots. Add your image to public/images/ and pass the path.
 * Example: <StepImage src="/images/step-1-cursor.png" alt="Project open in Cursor" description="Project open in Cursor" />
 */
export function StepImage({
  src,
  alt,
  description,
}: {
  src?: string;
  alt: string;
  description: string;
}) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className="rounded-lg border border-white/10 w-full max-w-2xl"
      />
    );
  }
  return (
    <div className="rounded-lg border-2 border-dashed border-[var(--color-accent)]/30 bg-black/30 aspect-video flex flex-col items-center justify-center gap-2 p-4 text-center">
      <span className="text-[var(--color-text-muted)] text-sm">
        📷 Screenshot: {description}
      </span>
      <span className="text-xs text-[var(--color-text-muted)]">
        Add your image to <code className="bg-white/10 px-1 rounded">public/images/</code> and pass the path to this component
      </span>
    </div>
  );
}
