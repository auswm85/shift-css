/**
 * Shift CSS - Playwright Configuration
 *
 * Configuration for visual regression testing and accessibility validation.
 */

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	testDir: './tests/e2e',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: [['html', { open: 'never' }], ['list']],

	use: {
		baseURL: 'http://localhost:3333',
		trace: 'on-first-retry',
	},

	/* Configure projects for visual regression and accessibility */
	projects: [
		{
			name: 'visual-chrome',
			use: {
				...devices['Desktop Chrome'],
				viewport: { width: 1280, height: 720 },
			},
			testMatch: /.*\.visual\.ts/,
		},
		{
			name: 'visual-firefox',
			use: {
				...devices['Desktop Firefox'],
				viewport: { width: 1280, height: 720 },
			},
			testMatch: /.*\.visual\.ts/,
		},
		{
			name: 'visual-safari',
			use: {
				...devices['Desktop Safari'],
				viewport: { width: 1280, height: 720 },
			},
			testMatch: /.*\.visual\.ts/,
		},
		{
			name: 'visual-mobile',
			use: {
				...devices['iPhone 14'],
			},
			testMatch: /.*\.visual\.ts/,
		},
		{
			name: 'accessibility',
			use: {
				...devices['Desktop Chrome'],
				viewport: { width: 1280, height: 720 },
			},
			testMatch: /.*\.a11y\.ts/,
		},
		{
			name: 'contrast',
			use: {
				...devices['Desktop Chrome'],
				viewport: { width: 1280, height: 720 },
			},
			testMatch: /.*\.contrast\.ts/,
		},
	],

	/* Web server to serve test fixtures */
	webServer: {
		command: 'bun run serve-fixtures',
		url: 'http://localhost:3333',
		reuseExistingServer: !process.env.CI,
		timeout: 10000,
	},

	/* Snapshot configuration for visual regression */
	expect: {
		toHaveScreenshot: {
			maxDiffPixels: 100,
			threshold: 0.1,
		},
	},

	/* Output directories */
	outputDir: './tests/e2e/results',
	snapshotDir: './tests/e2e/snapshots',
});
