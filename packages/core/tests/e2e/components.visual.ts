/**
 * Shift CSS - Component Visual Regression Tests
 *
 * Captures screenshots of UI components to detect UI drift.
 */

import { test, expect } from '@playwright/test';

test.describe('Button Components', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/components.html');
	});

	test('buttons section - light mode', async ({ page }) => {
		await page.evaluate(() => {
			document.documentElement.style.colorScheme = 'light';
		});
		await page.waitForTimeout(100);

		const section = page.getByTestId('buttons-section');
		await expect(section).toHaveScreenshot('buttons-light.png');
	});

	test('buttons section - dark mode', async ({ page }) => {
		await page.evaluate(() => {
			document.documentElement.style.colorScheme = 'dark';
		});
		await page.waitForTimeout(100);

		const section = page.getByTestId('buttons-section');
		await expect(section).toHaveScreenshot('buttons-dark.png');
	});

	test('button hover state', async ({ page }) => {
		await page.evaluate(() => {
			document.documentElement.style.colorScheme = 'light';
		});

		const primaryBtn = page.locator('.btn-primary').first();
		await primaryBtn.hover();
		await page.waitForTimeout(100);

		await expect(primaryBtn).toHaveScreenshot('button-primary-hover.png');
	});

	test('button focus state', async ({ page }) => {
		await page.evaluate(() => {
			document.documentElement.style.colorScheme = 'light';
		});

		const primaryBtn = page.locator('.btn-primary').first();
		await primaryBtn.focus();
		await page.waitForTimeout(100);

		await expect(primaryBtn).toHaveScreenshot('button-primary-focus.png');
	});
});

test.describe('Card Components', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/components.html');
	});

	test('cards section - light mode', async ({ page }) => {
		await page.evaluate(() => {
			document.documentElement.style.colorScheme = 'light';
		});
		await page.waitForTimeout(100);

		const section = page.getByTestId('cards-section');
		await expect(section).toHaveScreenshot('cards-light.png');
	});

	test('cards section - dark mode', async ({ page }) => {
		await page.evaluate(() => {
			document.documentElement.style.colorScheme = 'dark';
		});
		await page.waitForTimeout(100);

		const section = page.getByTestId('cards-section');
		await expect(section).toHaveScreenshot('cards-dark.png');
	});
});

test.describe('Form Inputs', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/components.html');
	});

	test('inputs section - light mode', async ({ page }) => {
		await page.evaluate(() => {
			document.documentElement.style.colorScheme = 'light';
		});
		await page.waitForTimeout(100);

		const section = page.getByTestId('inputs-section');
		await expect(section).toHaveScreenshot('inputs-light.png');
	});

	test('inputs section - dark mode', async ({ page }) => {
		await page.evaluate(() => {
			document.documentElement.style.colorScheme = 'dark';
		});
		await page.waitForTimeout(100);

		const section = page.getByTestId('inputs-section');
		await expect(section).toHaveScreenshot('inputs-dark.png');
	});

	test('input focus state', async ({ page }) => {
		await page.evaluate(() => {
			document.documentElement.style.colorScheme = 'light';
		});

		const input = page.locator('#text-input');
		await input.focus();
		await page.waitForTimeout(100);

		await expect(input).toHaveScreenshot('input-focus.png');
	});

	test('input with text', async ({ page }) => {
		await page.evaluate(() => {
			document.documentElement.style.colorScheme = 'light';
		});

		const input = page.locator('#text-input');
		await input.fill('Sample input text');
		await page.waitForTimeout(100);

		await expect(input).toHaveScreenshot('input-filled.png');
	});
});

test.describe('Surface Components', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/components.html');
	});

	test('surfaces section - light mode', async ({ page }) => {
		await page.evaluate(() => {
			document.documentElement.style.colorScheme = 'light';
		});
		await page.waitForTimeout(100);

		const section = page.getByTestId('surfaces-section');
		await expect(section).toHaveScreenshot('surfaces-light.png');
	});

	test('surfaces section - dark mode', async ({ page }) => {
		await page.evaluate(() => {
			document.documentElement.style.colorScheme = 'dark';
		});
		await page.waitForTimeout(100);

		const section = page.getByTestId('surfaces-section');
		await expect(section).toHaveScreenshot('surfaces-dark.png');
	});
});

test.describe('Combined Form Example', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/components.html');
	});

	test('contact form - light mode', async ({ page }) => {
		await page.evaluate(() => {
			document.documentElement.style.colorScheme = 'light';
		});
		await page.waitForTimeout(100);

		const section = page.getByTestId('combined-section');
		await expect(section).toHaveScreenshot('contact-form-light.png');
	});

	test('contact form - dark mode', async ({ page }) => {
		await page.evaluate(() => {
			document.documentElement.style.colorScheme = 'dark';
		});
		await page.waitForTimeout(100);

		const section = page.getByTestId('combined-section');
		await expect(section).toHaveScreenshot('contact-form-dark.png');
	});

	test('contact form - filled', async ({ page }) => {
		await page.evaluate(() => {
			document.documentElement.style.colorScheme = 'light';
		});

		await page.locator('#name').fill('John Doe');
		await page.locator('#email').fill('john@example.com');
		await page.locator('#message').fill('Hello, this is a test message.');
		await page.waitForTimeout(100);

		const section = page.getByTestId('combined-section');
		await expect(section).toHaveScreenshot('contact-form-filled.png');
	});
});

test.describe('Full Page Screenshots', () => {
	test('components page - light mode', async ({ page }) => {
		await page.goto('/components.html');
		await page.evaluate(() => {
			document.documentElement.style.colorScheme = 'light';
		});
		await page.waitForTimeout(100);

		await expect(page).toHaveScreenshot('components-page-light.png', {
			fullPage: true,
		});
	});

	test('components page - dark mode', async ({ page }) => {
		await page.goto('/components.html');
		await page.evaluate(() => {
			document.documentElement.style.colorScheme = 'dark';
		});
		await page.waitForTimeout(100);

		await expect(page).toHaveScreenshot('components-page-dark.png', {
			fullPage: true,
		});
	});
});
