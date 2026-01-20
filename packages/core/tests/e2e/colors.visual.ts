/**
 * Shift CSS - Color Scale Visual Regression Tests
 *
 * Captures screenshots of color scales to detect UI drift.
 */

import { expect, test } from '@playwright/test';

test.describe('Color Scales Visual Regression', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/colors.html');
	});

	test('primary color scale - light mode', async ({ page }) => {
		await page.evaluate(() => {
			document.documentElement.style.colorScheme = 'light';
		});
		await page.waitForTimeout(100); // Allow CSS to settle

		const scale = page.getByTestId('primary-scale');
		await expect(scale).toHaveScreenshot('primary-scale-light.png');
	});

	test('primary color scale - dark mode', async ({ page }) => {
		await page.evaluate(() => {
			document.documentElement.style.colorScheme = 'dark';
		});
		await page.waitForTimeout(100);

		const scale = page.getByTestId('primary-scale');
		await expect(scale).toHaveScreenshot('primary-scale-dark.png');
	});

	test('neutral scale (tinted grays) - light mode', async ({ page }) => {
		await page.evaluate(() => {
			document.documentElement.style.colorScheme = 'light';
		});
		await page.waitForTimeout(100);

		const scale = page.getByTestId('neutral-scale');
		await expect(scale).toHaveScreenshot('neutral-scale-light.png');
	});

	test('neutral scale (tinted grays) - dark mode', async ({ page }) => {
		await page.evaluate(() => {
			document.documentElement.style.colorScheme = 'dark';
		});
		await page.waitForTimeout(100);

		const scale = page.getByTestId('neutral-scale');
		await expect(scale).toHaveScreenshot('neutral-scale-dark.png');
	});

	test('secondary color scale - light mode', async ({ page }) => {
		await page.evaluate(() => {
			document.documentElement.style.colorScheme = 'light';
		});
		await page.waitForTimeout(100);

		const scale = page.getByTestId('secondary-scale');
		await expect(scale).toHaveScreenshot('secondary-scale-light.png');
	});

	test('accent color scale - light mode', async ({ page }) => {
		await page.evaluate(() => {
			document.documentElement.style.colorScheme = 'light';
		});
		await page.waitForTimeout(100);

		const scale = page.getByTestId('accent-scale');
		await expect(scale).toHaveScreenshot('accent-scale-light.png');
	});

	test('success color scale - light mode', async ({ page }) => {
		await page.evaluate(() => {
			document.documentElement.style.colorScheme = 'light';
		});
		await page.waitForTimeout(100);

		const scale = page.getByTestId('success-scale');
		await expect(scale).toHaveScreenshot('success-scale-light.png');
	});

	test('warning color scale - light mode', async ({ page }) => {
		await page.evaluate(() => {
			document.documentElement.style.colorScheme = 'light';
		});
		await page.waitForTimeout(100);

		const scale = page.getByTestId('warning-scale');
		await expect(scale).toHaveScreenshot('warning-scale-light.png');
	});

	test('danger color scale - light mode', async ({ page }) => {
		await page.evaluate(() => {
			document.documentElement.style.colorScheme = 'light';
		});
		await page.waitForTimeout(100);

		const scale = page.getByTestId('danger-scale');
		await expect(scale).toHaveScreenshot('danger-scale-light.png');
	});

	test('full page - light mode', async ({ page }) => {
		await page.evaluate(() => {
			document.documentElement.style.colorScheme = 'light';
		});
		await page.waitForTimeout(100);

		await expect(page).toHaveScreenshot('colors-page-light.png', {
			fullPage: true,
		});
	});

	test('full page - dark mode', async ({ page }) => {
		await page.evaluate(() => {
			document.documentElement.style.colorScheme = 'dark';
		});
		await page.waitForTimeout(100);

		await expect(page).toHaveScreenshot('colors-page-dark.png', {
			fullPage: true,
		});
	});
});

test.describe('Custom Hue Override Visual Tests', () => {
	test('custom primary hue changes scale', async ({ page }) => {
		await page.goto('/colors.html');
		await page.evaluate(() => {
			document.documentElement.style.colorScheme = 'light';
			document.documentElement.style.setProperty('--shift-hue-primary', '320'); // Magenta
		});
		await page.waitForTimeout(100);

		const scale = page.getByTestId('primary-scale');
		await expect(scale).toHaveScreenshot('primary-scale-custom-hue.png');
	});

	test('custom neutral hue tints grays', async ({ page }) => {
		await page.goto('/colors.html');
		await page.evaluate(() => {
			document.documentElement.style.colorScheme = 'light';
			document.documentElement.style.setProperty('--shift-hue-neutral', '30'); // Warm grays
		});
		await page.waitForTimeout(100);

		const scale = page.getByTestId('neutral-scale');
		await expect(scale).toHaveScreenshot('neutral-scale-warm-tint.png');
	});
});
