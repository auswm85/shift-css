/**
 * Shift CSS Docs - Accessibility Crawler Tests
 *
 * Crawls the documentation site and tests each page for WCAG 2.1 AA compliance.
 */

import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

interface PageResult {
	url: string;
	violations: number;
	details: string[];
}

/**
 * Crawl the site starting from the homepage and collect all internal links.
 */
async function crawlSite(
	page: import('@playwright/test').Page,
	baseURL: string
): Promise<Set<string>> {
	const visited = new Set<string>();
	const toVisit = new Set<string>(['/']);

	while (toVisit.size > 0) {
		const path = toVisit.values().next().value as string;
		toVisit.delete(path);

		if (visited.has(path)) continue;
		visited.add(path);

		try {
			await page.goto(path, { waitUntil: 'networkidle' });

			// Find all internal links
			const links = await page.evaluate((base: string) => {
				const anchors = document.querySelectorAll('a[href]');
				const urls: string[] = [];

				for (const anchor of anchors) {
					const href = anchor.getAttribute('href');
					if (!href) continue;

					// Skip external links, anchors, and special protocols
					if (href.startsWith('http') && !href.startsWith(base)) continue;
					if (href.startsWith('#')) continue;
					if (href.startsWith('mailto:') || href.startsWith('tel:')) continue;
					if (href.startsWith('javascript:')) continue;

					// Normalize the URL
					let normalizedPath = href;
					if (href.startsWith(base)) {
						normalizedPath = href.replace(base, '');
					}
					if (!normalizedPath.startsWith('/')) {
						normalizedPath = `/${normalizedPath}`;
					}

					// Remove trailing slash for consistency (except root)
					if (normalizedPath !== '/' && normalizedPath.endsWith('/')) {
						normalizedPath = normalizedPath.slice(0, -1);
					}

					urls.push(normalizedPath);
				}

				return urls;
			}, baseURL);

			for (const link of links) {
				if (!visited.has(link)) {
					toVisit.add(link);
				}
			}
		} catch {
			// Page might not exist, skip it
		}
	}

	return visited;
}

test.describe('Accessibility Crawler', () => {
	let pages: string[];

	test.beforeAll(async ({ browser }) => {
		const page = await browser.newPage();
		const baseURL = 'http://localhost:4321';

		console.log('Crawling site for pages...');
		const crawledPages = await crawlSite(page, baseURL);
		pages = Array.from(crawledPages).sort();
		console.log(`Found ${pages.length} pages to test`);

		await page.close();
	});

	test('all pages pass WCAG 2.1 AA accessibility checks', async ({ page }) => {
		const results: PageResult[] = [];
		let totalViolations = 0;

		for (const pagePath of pages) {
			console.log(`Testing: ${pagePath}`);

			await page.goto(pagePath, { waitUntil: 'networkidle' });

			// Test in light mode - set color-scheme directly
			await page.evaluate(() => {
				document.documentElement.style.colorScheme = 'light';
			});
			await page.waitForTimeout(100);

			const lightResults = await new AxeBuilder({ page })
				.withTags(['wcag2aa', 'wcag21aa'])
				.analyze();

			// Test in dark mode - set color-scheme directly
			await page.evaluate(() => {
				document.documentElement.style.colorScheme = 'dark';
			});
			await page.waitForTimeout(100);

			const darkResults = await new AxeBuilder({ page })
				.withTags(['wcag2aa', 'wcag21aa'])
				.analyze();

			const pageViolations = lightResults.violations.length + darkResults.violations.length;
			totalViolations += pageViolations;

			const details: string[] = [];

			if (lightResults.violations.length > 0) {
				details.push('Light mode violations:');
				for (const v of lightResults.violations) {
					details.push(`  - ${v.id}: ${v.description} (${v.nodes.length} instances)`);
					for (const node of v.nodes) {
						details.push(`    • ${node.html.slice(0, 100)}`);
						if (node.failureSummary) {
							details.push(`      ${node.failureSummary.split('\n')[0]}`);
						}
					}
				}
			}

			if (darkResults.violations.length > 0) {
				details.push('Dark mode violations:');
				for (const v of darkResults.violations) {
					details.push(`  - ${v.id}: ${v.description} (${v.nodes.length} instances)`);
					for (const node of v.nodes) {
						details.push(`    • ${node.html.slice(0, 100)}`);
						if (node.failureSummary) {
							details.push(`      ${node.failureSummary.split('\n')[0]}`);
						}
					}
				}
			}

			results.push({
				url: pagePath,
				violations: pageViolations,
				details,
			});
		}

		// Report results
		console.log('\n📊 Accessibility Report');
		console.log('========================');
		console.log(`Pages tested: ${pages.length}`);
		console.log(`Total violations: ${totalViolations}`);

		if (totalViolations > 0) {
			console.log('\nPages with violations:');
			for (const result of results) {
				if (result.violations > 0) {
					console.log(`\n${result.url} (${result.violations} violations)`);
					for (const detail of result.details) {
						console.log(detail);
					}
				}
			}
		}

		expect(totalViolations).toBe(0);
	});
});
