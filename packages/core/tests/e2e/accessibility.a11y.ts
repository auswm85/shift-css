/**
 * Shift CSS - Accessibility Tests with axe-core
 *
 * Tests WCAG 2.1 compliance including color contrast requirements.
 */

import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('Accessibility - Color Contrast', () => {
	test('colors page passes axe contrast checks - light mode', async ({ page }) => {
		await page.goto('/colors.html');
		await page.evaluate(() => {
			document.documentElement.style.colorScheme = 'light';
		});
		await page.waitForTimeout(100);

		// Test UI controls only (not color swatches which intentionally show all color steps)
		// Color swatches are excluded since they demonstrate the full scale range
		const accessibilityScanResults = await new AxeBuilder({ page })
			.withTags(['wcag2aa'])
			.exclude('.color-swatch') // Color palette demonstrations aren't subject to contrast rules
			.exclude('.step-labels') // Step labels are decorative context
			.analyze();

		// Only check AA contrast (4.5:1), not AAA (7:1)
		const contrastViolations = accessibilityScanResults.violations.filter(
			(v) => v.id === 'color-contrast'
		);

		expect(contrastViolations).toHaveLength(0);
	});

	test('colors page passes axe contrast checks - dark mode', async ({ page }) => {
		await page.goto('/colors.html');
		await page.evaluate(() => {
			document.documentElement.style.colorScheme = 'dark';
		});
		await page.waitForTimeout(100);

		// Test UI controls only (not color swatches which intentionally show all color steps)
		const accessibilityScanResults = await new AxeBuilder({ page })
			.withTags(['wcag2aa'])
			.exclude('.color-swatch')
			.exclude('.step-labels')
			.analyze();

		const contrastViolations = accessibilityScanResults.violations.filter(
			(v) => v.id === 'color-contrast'
		);

		expect(contrastViolations).toHaveLength(0);
	});

	test('contrast test page passes axe checks - light mode', async ({ page }) => {
		await page.goto('/contrast.html');
		await page.evaluate(() => {
			document.documentElement.style.colorScheme = 'light';
		});
		await page.waitForTimeout(100);

		const accessibilityScanResults = await new AxeBuilder({ page }).withTags(['wcag2aa']).analyze();

		const contrastViolations = accessibilityScanResults.violations.filter(
			(v) => v.id === 'color-contrast'
		);

		// Log any violations for debugging
		if (contrastViolations.length > 0) {
			console.log('Contrast violations found:');
			for (const violation of contrastViolations) {
				for (const node of violation.nodes) {
					console.log(`  - ${node.html}`);
					console.log(`    ${node.failureSummary}`);
				}
			}
		}

		expect(contrastViolations).toHaveLength(0);
	});

	test('contrast test page passes axe checks - dark mode', async ({ page }) => {
		await page.goto('/contrast.html');
		await page.evaluate(() => {
			document.documentElement.style.colorScheme = 'dark';
		});
		await page.waitForTimeout(100);

		const accessibilityScanResults = await new AxeBuilder({ page }).withTags(['wcag2aa']).analyze();

		const contrastViolations = accessibilityScanResults.violations.filter(
			(v) => v.id === 'color-contrast'
		);

		if (contrastViolations.length > 0) {
			console.log('Dark mode contrast violations found:');
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

test.describe('Accessibility - Components', () => {
	test('components page has no accessibility violations - light mode', async ({ page }) => {
		await page.goto('/components.html');
		await page.evaluate(() => {
			document.documentElement.style.colorScheme = 'light';
		});
		await page.waitForTimeout(100);

		const accessibilityScanResults = await new AxeBuilder({ page })
			.withTags(['wcag2aa', 'wcag21aa'])
			.analyze();

		expect(accessibilityScanResults.violations).toHaveLength(0);
	});

	test('components page has no accessibility violations - dark mode', async ({ page }) => {
		await page.goto('/components.html');
		await page.evaluate(() => {
			document.documentElement.style.colorScheme = 'dark';
		});
		await page.waitForTimeout(100);

		const accessibilityScanResults = await new AxeBuilder({ page })
			.withTags(['wcag2aa', 'wcag21aa'])
			.analyze();

		expect(accessibilityScanResults.violations).toHaveLength(0);
	});

	test('buttons are keyboard accessible', async ({ page }) => {
		await page.goto('/components.html');

		// Tab to first button and check it receives focus
		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab'); // Skip nav links

		const focusedElement = await page.evaluate(() => document.activeElement?.hasAttribute('s-btn'));

		expect(focusedElement).toBe(true);
	});

	test('form inputs have associated labels', async ({ page }) => {
		await page.goto('/components.html');

		const accessibilityScanResults = await new AxeBuilder({ page })
			.withTags(['wcag2aa'])
			.include('[data-testid="inputs-section"]')
			.analyze();

		const labelViolations = accessibilityScanResults.violations.filter(
			(v) => v.id === 'label' || v.id === 'label-title-only'
		);

		expect(labelViolations).toHaveLength(0);
	});
});

test.describe('Accessibility - Focus Indicators', () => {
	test('buttons have visible focus indicators', async ({ page }) => {
		await page.goto('/components.html');
		await page.evaluate(() => {
			document.documentElement.style.colorScheme = 'light';
		});

		const button = page.locator('[s-btn="primary"]').first();
		await button.focus();

		// Check that focus outline is visible
		const outlineWidth = await button.evaluate((el) => {
			const styles = window.getComputedStyle(el);
			return styles.outlineWidth;
		});

		// Focus indicator should be present
		expect(outlineWidth).not.toBe('0px');
	});

	test('inputs have visible focus indicators', async ({ page }) => {
		await page.goto('/components.html');
		await page.evaluate(() => {
			document.documentElement.style.colorScheme = 'light';
		});

		const input = page.locator('#text-input');
		await input.focus();

		// Check that focus ring is visible
		const ringColor = await input.evaluate((el) => {
			const styles = window.getComputedStyle(el);
			return styles.outlineColor || styles.boxShadow;
		});

		expect(ringColor).toBeTruthy();
	});
});

test.describe('Accessibility - Semantic Color Messages', () => {
	test('success messages have sufficient contrast', async ({ page }) => {
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
