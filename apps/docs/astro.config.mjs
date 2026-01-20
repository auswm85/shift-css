import mdx from '@astrojs/mdx';
import { defineConfig } from 'astro/config';

export default defineConfig({
	site: 'https://getshiftcss.com',
	base: '/',
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
