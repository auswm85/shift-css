import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import critters from '@critters-rs/astro';

export default defineConfig({
	site: 'https://getshiftcss.com',
	base: '/',
	integrations: [
		mdx(),
		sitemap(),
		critters(),
	],
	markdown: {
		shikiConfig: {
			theme: 'css-variables',
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
