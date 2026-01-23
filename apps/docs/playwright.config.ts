/**
 * Shift CSS Docs - Playwright Configuration
 *
 * Configuration for accessibility testing with axe-core.
 */

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	testDir: './tests',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: [['html', { open: 'never' }], ['list']],
	timeout: 120000, // 2 minutes for crawling all pages

	use: {
		baseURL: 'http://localhost:4321',
		trace: 'on-first-retry',
	},

	projects: [
		{
			name: 'accessibility',
			use: {
				...devices['Desktop Chrome'],
				viewport: { width: 1280, height: 720 },
			},
		},
	],

	webServer: {
		command: 'bun run preview',
		url: 'http://localhost:4321',
		reuseExistingServer: !process.env.CI,
		timeout: 30000,
	},

	outputDir: './tests/results',
});
