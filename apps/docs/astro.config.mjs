import mdx from '@astrojs/mdx';
import { defineConfig } from 'astro/config';
import critters from 'astro-critters';

export default defineConfig({
	site: 'https://getshiftcss.com',
	base: '/',
	integrations: [
		mdx(),
		critters({
			// Inline critical CSS for faster FCP
			preload: 'swap', // Preload non-critical CSS with font-display swap
			pruneSource: true, // Remove inlined CSS from external stylesheets
		}),
	],
	markdown: {
		shikiConfig: {
			themes: {
				light: 'github-light',
				dark: 'github-dark',
			},
		},
	},
	vite: {
		css: {
			// Enable CSS code splitting
			devSourcemap: true,
		},
		build: {
			// Optimize CSS
			cssCodeSplit: true,
			cssMinify: 'lightningcss',
		},
	},
});
