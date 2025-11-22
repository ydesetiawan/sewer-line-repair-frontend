/**
 * Formats a slug string to a human-readable title
 * Replaces all hyphens with spaces and capitalizes first letter of each word
 *
 * @param slug - The slug string to format (e.g., "united-states", "new-york")
 * @returns Formatted title string (e.g., "United States", "New York")
 *
 * @example
 * formatSlugToTitle('united-states') // "United States"
 * formatSlugToTitle('san-diego') // "San Diego"
 * formatSlugToTitle('new-york-city') // "New York City"
 */
export function formatSlugToTitle(slug: string | undefined | null): string {
  if (!slug) return ''

  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

