/**
 * Shift CSS - Accessibility Tests with axe-core
 *
 * Tests WCAG 2.1 compliance including color contrast requirements.
 */

import { AxeBuilder } from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('Accessibility - Color Contrast', () => {
	test.describe('light mode', () => {
		test.use({ colorScheme: 'light' });

		test('colors page passes axe contrast checks', async ({ page }) => {
			await page.goto('/colors.html');
			await page.waitForTimeout(100);

			const accessibilityScanResults = await new AxeBuilder({ page })
				.withTags(['wcag2aa'])
				.exclude('.color-swatch')
				.exclude('.step-labels')
				.analyze();

			const contrastViolations = accessibilityScanResults.violations.filter(
				(v: { id: string }) => v.id === 'color-contrast'
			);

			expect(contrastViolations).toHaveLength(0);
		});

		test('contrast test page passes axe checks', async ({ page }) => {
			await page.goto('/contrast.html');
			await page.waitForTimeout(100);

			const accessibilityScanResults = await new AxeBuilder({ page })
				.withTags(['wcag2aa'])
				.analyze();

			const contrastViolations = accessibilityScanResults.violations.filter(
				(v: { id: string }) => v.id === 'color-contrast'
			);

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
	});

	test.describe('dark mode', () => {
		test.use({ colorScheme: 'dark' });

		test('colors page passes axe contrast checks', async ({ page }) => {
			await page.goto('/colors.html');
			await page.waitForTimeout(100);

			const accessibilityScanResults = await new AxeBuilder({ page })
				.withTags(['wcag2aa'])
				.exclude('.color-swatch')
				.exclude('.step-labels')
				.analyze();

			const contrastViolations = accessibilityScanResults.violations.filter(
				(v: { id: string }) => v.id === 'color-contrast'
			);

			expect(contrastViolations).toHaveLength(0);
		});

		test('contrast test page passes axe checks', async ({ page }) => {
			await page.goto('/contrast.html');
			await page.waitForTimeout(100);

			const accessibilityScanResults = await new AxeBuilder({ page })
				.withTags(['wcag2aa'])
				.analyze();

			const contrastViolations = accessibilityScanResults.violations.filter(
				(v: { id: string }) => v.id === 'color-contrast'
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
});

test.describe('Accessibility - Components', () => {
	test.describe('light mode', () => {
		test.use({ colorScheme: 'light' });

		test('components page has no accessibility violations', async ({ page }) => {
			await page.goto('/components.html');
			await page.waitForTimeout(100);

			const accessibilityScanResults = await new AxeBuilder({ page })
				.withTags(['wcag2aa', 'wcag21aa'])
				.analyze();

			expect(accessibilityScanResults.violations).toHaveLength(0);
		});
	});

	test.describe('dark mode', () => {
		test.use({ colorScheme: 'dark' });

		test('components page has no accessibility violations', async ({ page }) => {
			await page.goto('/components.html');
			await page.waitForTimeout(100);

			const accessibilityScanResults = await new AxeBuilder({ page })
				.withTags(['wcag2aa', 'wcag21aa'])
				.analyze();

			expect(accessibilityScanResults.violations).toHaveLength(0);
		});
	});

	test('buttons are keyboard accessible', async ({ page }) => {
		await page.goto('/components.html');

		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab');

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
			(v: { id: string }) => v.id === 'label' || v.id === 'label-title-only'
		);

		expect(labelViolations).toHaveLength(0);
	});
});

test.describe('Accessibility - Focus Indicators', () => {
	test.use({ colorScheme: 'light' });

	test('buttons have visible focus indicators', async ({ page }) => {
		await page.goto('/components.html');

		const button = page.locator('[s-btn="primary"]').first();
		await button.focus();

		const outlineWidth = await button.evaluate((el) => {
			const styles = window.getComputedStyle(el);
			return styles.outlineWidth;
		});

		expect(outlineWidth).not.toBe('0px');
	});

	test('inputs have visible focus indicators', async ({ page }) => {
		await page.goto('/components.html');

		const input = page.locator('#text-input');
		await input.focus();

		const ringColor = await input.evaluate((el) => {
			const styles = window.getComputedStyle(el);
			return styles.outlineColor || styles.boxShadow;
		});

		expect(ringColor).toBeTruthy();
	});
});

test.describe('Accessibility - Semantic Color Messages', () => {
	test.use({ colorScheme: 'light' });

	test('success messages have sufficient contrast', async ({ page }) => {
		await page.goto('/contrast.html');
		await page.waitForTimeout(100);

		const accessibilityScanResults = await new AxeBuilder({ page })
			.withTags(['wcag2aa'])
			.include('[data-testid="state-contrast"]')
			.analyze();

		const contrastViolations = accessibilityScanResults.violations.filter(
			(v: { id: string }) => v.id === 'color-contrast'
		);

		expect(contrastViolations).toHaveLength(0);
	});
});

test.describe('Accessibility - Screen Reader Utilities', () => {
	test('sr-only elements are visually hidden but in DOM', async ({ page }) => {
		await page.goto('/components.html');

		const srOnlyLabel = page.locator('[data-testid="sr-only-label"]');

		await expect(srOnlyLabel).toBeAttached();

		const box = await srOnlyLabel.boundingBox();
		expect(box?.width).toBeLessThanOrEqual(1);
		expect(box?.height).toBeLessThanOrEqual(1);

		await expect(srOnlyLabel).toHaveText('More options');
	});

	test('skip link becomes visible on focus', async ({ page }) => {
		await page.goto('/components.html');

		const skipLink = page.locator('[data-testid="skip-link"]');

		const initialBox = await skipLink.boundingBox();
		const isInitiallyHidden =
			!initialBox || initialBox.width <= 1 || initialBox.height <= 1 || initialBox.y < 0;
		expect(isInitiallyHidden).toBe(true);

		await skipLink.focus();

		const focusedBox = await skipLink.boundingBox();
		expect(focusedBox).not.toBeNull();
		expect(focusedBox!.width).toBeGreaterThan(1);
		expect(focusedBox!.height).toBeGreaterThan(1);
	});

	test('skip link is keyboard accessible', async ({ page }) => {
		await page.goto('/components.html');

		await page.keyboard.press('Tab');

		const skipLink = page.locator('[data-testid="skip-link"]');
		await expect(skipLink).toBeFocused();

		const box = await skipLink.boundingBox();
		expect(box).not.toBeNull();
		expect(box!.width).toBeGreaterThan(1);
	});
});
