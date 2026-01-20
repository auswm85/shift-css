import mdx from '@astrojs/mdx';
import { defineConfig } from 'astro/config';

export default defineConfig({
	site: 'https://auswm85.github.io',
	base: '/shift-css',
	integrations: [mdx()],
	markdown: {
		shikiConfig: {
			themes: {
				light: 'github-light',
				dark: 'github-dark',
			},
		},
	},
});
