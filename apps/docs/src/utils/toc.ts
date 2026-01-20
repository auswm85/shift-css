export interface TocHeading {
	depth: number;
	slug: string;
	text: string;
}

/**
 * Filter headings for TOC display (h2 and h3 only)
 */
export function filterTocHeadings(headings: TocHeading[]): TocHeading[] {
	return headings.filter((h) => h.depth >= 2 && h.depth <= 3);
}

/**
 * Generate a slug from heading text
 */
export function slugify(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/(^-|-$)/g, '');
}
