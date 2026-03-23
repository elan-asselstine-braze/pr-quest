/** Placeholder entry - excluded from contributor count and display. */
export const CONTRIBUTOR_PLACEHOLDER = "Add your name here! (Edit lib/contributors.ts and open a PR)";

/** Add your name via PR: edit this array and open a pull request. */
export const contributorsList: string[] = [
  "Élan Asselstine",
  CONTRIBUTOR_PLACEHOLDER,
];

/** Number of actual contributor names (excludes the placeholder). */
export const contributorCount = contributorsList.filter((n) => n !== CONTRIBUTOR_PLACEHOLDER).length;
