/** Instructional line—hidden on the site. */
export const CONTRIBUTOR_PLACEHOLDER = "Add your name here! (Edit lib/contributors.ts and open a PR)";

/**
 * Replace this entire string with your name in quotes, e.g. YOUR_NAME_HERE → "Alex Kim"
 * Hidden on Dashboard and /contributors until you swap it for a real name.
 */
export const CONTRIBUTOR_NAME_PLACEHOLDER = "YOUR_NAME_HERE";

const HIDDEN_ON_SITE = new Set<string>([CONTRIBUTOR_PLACEHOLDER, CONTRIBUTOR_NAME_PLACEHOLDER]);

/** True if this list entry should appear on Dashboard and /contributors. */
export function isContributorShownOnSite(name: string): boolean {
  return !HIDDEN_ON_SITE.has(name);
}

/** Add your name via PR: replace YOUR_NAME_HERE (or add a new line) and open a pull request. */
export const contributorsList: string[] = [
  "Élan Asselstine",
  "Nancy Chiu",
  "Nancy Liang",
  "Anders Wallace",
  "Jordan Megibow",
  CONTRIBUTOR_PLACEHOLDER,
  CONTRIBUTOR_NAME_PLACEHOLDER,
];

/** Number of names shown on the site (excludes placeholders). */
export const contributorCount = contributorsList.filter(isContributorShownOnSite).length;
