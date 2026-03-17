import Link from "next/link";
import { emojiOfTheDay, emojiChangeCount } from "@/lib/emojiOfTheDay";

export function EmojiOfTheDayTile() {
  return (
    <div className="glass-card p-4 sm:p-5 flex flex-col h-full items-center text-center">
      <h2 className="text-lg font-semibold mb-1">Emoji of the day</h2>
      <p className="text-sm text-[var(--color-text-muted)] mb-4">
        Submit a PR to change it
      </p>
      <div className="text-5xl sm:text-6xl mb-4" aria-hidden>
        {emojiOfTheDay}
      </div>
      <p className="text-sm text-[var(--color-text-muted)] mb-4">
        Changed <strong className="text-[var(--color-text)]">{emojiChangeCount}</strong> time{emojiChangeCount !== 1 ? "s" : ""}
      </p>
      <Link
        href="https://github.com/elan-asselstine-braze/pr-quest/blob/main/lib/emojiOfTheDay.ts"
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-[var(--color-accent)] hover:underline"
      >
        Edit lib/emojiOfTheDay.ts →
      </Link>
    </div>
  );
}
