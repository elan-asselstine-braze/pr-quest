export function DiffExplainer() {
  return (
    <div className="glass-card space-y-4">
      <h3 className="font-semibold">Diff anatomy</h3>
      <div className="font-mono text-sm bg-black/40 rounded-lg overflow-hidden">
        <div className="px-3 py-2 border-b border-white/10 text-[var(--color-text-muted)]">
          app/contributors/page.tsx
        </div>
        <div className="p-0">
          <div className="px-3 py-1 bg-red-500/10 text-red-400">− const old = "remove this";</div>
          <div className="px-3 py-1 bg-emerald-500/10 text-emerald-400">+ const updated = "new line";</div>
        </div>
      </div>
      <p className="text-sm text-[var(--color-text-muted)]">
        Minus (−) = removed. Plus (+) = added. You can comment on a single line or the whole file.
      </p>

      <h3 className="font-semibold mt-4">Comment types</h3>
      <ul className="space-y-2 text-sm">
        <li><strong>Question</strong> – &quot;What happens if we…?&quot;</li>
        <li><strong>Suggestion</strong> – &quot;Consider using a theme token here.&quot;</li>
        <li><strong>Nit</strong> – Small style/typo (optional to fix).</li>
        <li><strong>Blocker</strong> – Must fix before merge (e.g. accessibility).</li>
      </ul>
      <p className="text-sm text-[var(--color-text-muted)]">
        You’re not trying to prove you’re technical. You’re making the work clearer, safer, and stronger.
      </p>
    </div>
  );
}
