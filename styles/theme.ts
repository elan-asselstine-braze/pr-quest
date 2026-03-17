/**
 * Design tokens for PR Quest.
 * Level 1: try changing these (e.g. accent color, radius) and ship a PR!
 */
export const theme = {
  colors: {
    accent: "var(--color-accent)",
    accentMuted: "var(--color-accent-muted)",
    background: "var(--color-background)",
    surface: "var(--color-surface)",
    text: "var(--color-text)",
    textMuted: "var(--color-text-muted)",
  },
  font: {
    sans: "var(--font-sans)",
    heading: "var(--font-heading)",
  },
  radius: {
    card: "var(--radius-card)",
    button: "var(--radius-button)",
  },
  spacing: {
    card: "var(--spacing-card)",
    section: "var(--spacing-section)",
  },
} as const;
