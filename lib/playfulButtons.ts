/** Add your own button via PR! Edit this array and open a pull request. */
export type PlayfulButton = {
  label: string;
  color?: string;
};

export const playfulButtons: PlayfulButton[] = [
  { label: "Don't Click Me", color: "bg-red-500/80" },
  { label: "I'm Shy", color: "bg-gray-400/80" },
  { label: "Actually Useful", color: "bg-black/80" },
  { label: "✨ Sparkles ✨", color: "bg-amber-200/90 text-black" },
];
