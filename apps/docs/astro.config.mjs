import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';

export default defineConfig({
	site: 'https://shift-css.dev',
	integrations: [
		starlight({
			title: 'Shift CSS',
			description:
				'Zero-runtime, OKLCH-native CSS framework with cascade layers and native light-dark() theming',
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/your-username/shift-css' },
			],
			customCss: ['@shift-css/core'],
			sidebar: [
				{
					label: 'Getting Started',
					items: [
						{ label: 'Introduction', slug: 'getting-started/introduction' },
						{ label: 'Installation', slug: 'getting-started/installation' },
						{ label: 'Quick Start', slug: 'getting-started/quick-start' },
					],
				},
				{
					label: 'Core Concepts',
					items: [
						{ label: 'OKLCH Color System', slug: 'concepts/oklch-colors' },
						{ label: 'Cascade Layers', slug: 'concepts/cascade-layers' },
						{ label: 'Light/Dark Theming', slug: 'concepts/theming' },
						{ label: 'Customization', slug: 'concepts/customization' },
					],
				},
				{
					label: 'Components',
					items: [
						{ label: 'Surface', slug: 'components/surface' },
						{ label: 'Button', slug: 'components/button' },
						{ label: 'Card', slug: 'components/card' },
						{ label: 'Input', slug: 'components/input' },
					],
				},
				{
					label: 'Utilities',
					items: [
						{ label: 'Spacing', slug: 'utilities/spacing' },
						{ label: 'Flexbox & Grid', slug: 'utilities/layout' },
						{ label: 'Typography', slug: 'utilities/typography' },
					],
				},
				{
					label: 'Tokens',
					items: [
						{ label: 'Colors', slug: 'tokens/colors' },
						{ label: 'Spacing', slug: 'tokens/spacing' },
						{ label: 'Typography', slug: 'tokens/typography' },
					],
				},
			],
		}),
	],
});
