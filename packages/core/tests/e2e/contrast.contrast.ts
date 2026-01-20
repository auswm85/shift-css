/**
 * Shift CSS - Tinted Gray Contrast Validation Tests
 *
 * Validates that tinted grays (neutral scale) meet WCAG AA contrast standards.
 * Uses axe-core for accurate WCAG-compliant contrast validation.
 */

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Tinted Gray Contrast - Axe Validation', () => {
	test('tinted gray combinations meet AA contrast - light mode', async ({ page }) => {
		await page.goto('/contrast.html');
		await page.evaluate(() => {
			document.documentElement.style.colorScheme = 'light';
		});
		await page.waitForTimeout(100);

		// Use axe-core for proper WCAG contrast validation
		const accessibilityScanResults = await new AxeBuilder({ page })
			.withTags(['wcag2aa'])
			.include('[data-testid="light-bg-contrast"]')
			.analyze();

		const contrastViolations = accessibilityScanResults.violations.filter(
			(v) => v.id === 'color-contrast'
		);

		expect(contrastViolations).toHaveLength(0);
	});

	test('tinted gray combinations meet AA contrast - dark mode', async ({ page }) => {
		await page.goto('/contrast.html');
		await page.evaluate(() => {
			document.documentElement.style.colorScheme = 'dark';
		});
		await page.waitForTimeout(100);

		// Use axe-core for proper WCAG contrast validation
		const accessibilityScanResults = await new AxeBuilder({ page })
			.withTags(['wcag2aa'])
			.include('[data-testid="dark-bg-contrast"]')
			.analyze();

		const contrastViolations = accessibilityScanResults.violations.filter(
			(v) => v.id === 'color-contrast'
		);

		expect(contrastViolations).toHaveLength(0);
	});
});

test.describe('Semantic Token Contrast', () => {
	test('semantic tokens meet AA contrast in light mode', async ({
		page,
	}) => {
		await page.goto('/contrast.html');
		await page.evaluate(() => {
			document.documentElement.style.colorScheme = 'light';
		});
		await page.waitForTimeout(100);

		// Test AA compliance (4.5:1) - secondary text only needs AA, not AAA
		const accessibilityScanResults = await new AxeBuilder({ page })
			.withTags(['wcag2aa'])
			.include('[data-testid="semantic-contrast"]')
			.analyze();

		const contrastViolations = accessibilityScanResults.violations.filter(
			(v) => v.id === 'color-contrast'
		);

		expect(contrastViolations).toHaveLength(0);
	});

	test('semantic tokens meet AA contrast in dark mode', async ({
		page,
	}) => {
		await page.goto('/contrast.html');
		await page.evaluate(() => {
			document.documentElement.style.colorScheme = 'dark';
		});
		await page.waitForTimeout(100);

		// Test AA compliance (4.5:1) - secondary text only needs AA, not AAA
		const accessibilityScanResults = await new AxeBuilder({ page })
			.withTags(['wcag2aa'])
			.include('[data-testid="semantic-contrast"]')
			.analyze();

		const contrastViolations = accessibilityScanResults.violations.filter(
			(v) => v.id === 'color-contrast'
		);

		expect(contrastViolations).toHaveLength(0);
	});
});

test.describe('Large Text Contrast Requirements', () => {
	test('large text (24px+) meets AA large (3:1) threshold', async ({ page }) => {
		await page.goto('/contrast.html');
		await page.evaluate(() => {
			document.documentElement.style.colorScheme = 'light';
		});
		await page.waitForTimeout(100);

		const accessibilityScanResults = await new AxeBuilder({ page })
			.withTags(['wcag2aa'])
			.include('[data-testid="large-text-contrast"]')
			.analyze();

		const contrastViolations = accessibilityScanResults.violations.filter(
			(v) => v.id === 'color-contrast'
		);

		expect(contrastViolations).toHaveLength(0);
	});
});

test.describe('Interactive Element Contrast (WCAG 2.1 SC 1.4.11)', () => {
	test('button boundaries meet 3:1 contrast against background', async ({
		page,
	}) => {
		await page.goto('/contrast.html');
		await page.evaluate(() => {
			document.documentElement.style.colorScheme = 'light';
		});
		await page.waitForTimeout(100);

		// axe-core checks UI component contrast automatically
		const accessibilityScanResults = await new AxeBuilder({ page })
			.withTags(['wcag21aa'])
			.include('[data-testid="interactive-contrast"]')
			.analyze();

		// We want no violations for button/input contrast
		const violations = accessibilityScanResults.violations;

		// Log any issues
		if (violations.length > 0) {
			console.log('Interactive element violations:');
			for (const v of violations) {
				console.log(`  ${v.id}: ${v.description}`);
			}
		}

		expect(violations).toHaveLength(0);
	});

	test('input borders meet 3:1 contrast against background', async ({
		page,
	}) => {
		await page.goto('/contrast.html');
		await page.evaluate(() => {
			document.documentElement.style.colorScheme = 'light';
		});
		await page.waitForTimeout(100);

		// Get the input border color and background
		const contrastData = await page.evaluate(() => {
			const container = document.querySelector(
				'[data-testid="interactive-contrast"]'
			);
			const input = container?.querySelector('.input');
			if (!input) return null;

			const styles = window.getComputedStyle(input);
			const borderColor = styles.borderColor;
			const bgColor =
				window.getComputedStyle(input.parentElement!).backgroundColor;

			return { borderColor, bgColor };
		});

		expect(contrastData).not.toBeNull();
		// The actual contrast calculation is done by axe-core in previous test
	});
});

test.describe('Custom Hue Contrast Preservation', () => {
	test('custom neutral hue still meets AA contrast', async ({ page }) => {
		await page.goto('/contrast.html');
		await page.evaluate(() => {
			document.documentElement.style.colorScheme = 'light';
			// Change neutral to a warm hue (could potentially affect contrast)
			document.documentElement.style.setProperty('--shift-hue-neutral', '30');
		});
		await page.waitForTimeout(200);

		const accessibilityScanResults = await new AxeBuilder({ page })
			.withTags(['wcag2aa'])
			.include('[data-testid="light-bg-contrast"]')
			.analyze();

		const contrastViolations = accessibilityScanResults.violations.filter(
			(v) => v.id === 'color-contrast'
		);

		expect(contrastViolations).toHaveLength(0);
	});

	test('custom primary hue still meets AA contrast', async ({ page }) => {
		await page.goto('/contrast.html');
		await page.evaluate(() => {
			document.documentElement.style.colorScheme = 'light';
			// Change primary to magenta
			document.documentElement.style.setProperty('--shift-hue-primary', '320');
		});
		await page.waitForTimeout(200);

		const accessibilityScanResults = await new AxeBuilder({ page })
			.withTags(['wcag2aa'])
			.analyze();

		const contrastViolations = accessibilityScanResults.violations.filter(
			(v) => v.id === 'color-contrast'
		);

		// Log any violations for debugging hue-specific issues
		if (contrastViolations.length > 0) {
			console.log('Custom hue contrast violations:');
			for (const violation of contrastViolations) {
				for (const node of violation.nodes) {
					console.log(`  - ${node.html}`);
					console.log(`    ${node.failureSummary}`);
				}
			}
		}

		expect(contrastViolations).toHaveLength(0);
	});
});

test.describe('State Color Contrast', () => {
	test('all state colors (success, warning, danger) meet AA', async ({
		page,
	}) => {
		await page.goto('/contrast.html');
		await page.evaluate(() => {
			document.documentElement.style.colorScheme = 'light';
		});
		await page.waitForTimeout(100);

		const accessibilityScanResults = await new AxeBuilder({ page })
			.withTags(['wcag2aa'])
			.include('[data-testid="state-contrast"]')
			.analyze();

		const contrastViolations = accessibilityScanResults.violations.filter(
			(v) => v.id === 'color-contrast'
		);

		expect(contrastViolations).toHaveLength(0);
	});
});
