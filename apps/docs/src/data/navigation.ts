export interface NavItem {
	label: string;
	href: string;
}

export interface NavGroup {
	label: string;
	items: NavItem[];
}

export type NavEntry = NavItem | NavGroup;

export const navigation: NavEntry[] = [
	{ label: 'Live Demo', href: '/demo' },
	{
		label: 'Getting Started',
		items: [
			{ label: 'Introduction', href: '/getting-started/introduction' },
			{ label: 'Installation', href: '/getting-started/installation' },
			{ label: 'Quick Start', href: '/getting-started/quick-start' },
		],
	},
	{
		label: 'Core Concepts',
		items: [
			{ label: 'OKLCH Color System', href: '/concepts/oklch-colors' },
			{ label: 'Cascade Layers', href: '/concepts/cascade-layers' },
			{ label: 'Light/Dark Theming', href: '/concepts/theming' },
			{ label: 'Customization', href: '/concepts/customization' },
		],
	},
	{
		label: 'Components',
		items: [
			{ label: 'Surface', href: '/components/surface' },
			{ label: 'Button', href: '/components/button' },
			{ label: 'Card', href: '/components/card' },
			{ label: 'Input', href: '/components/input' },
		],
	},
	{
		label: 'Utilities',
		items: [
			{ label: 'Spacing', href: '/utilities/spacing' },
			{ label: 'Flexbox & Grid', href: '/utilities/layout' },
			{ label: 'Typography', href: '/utilities/typography' },
		],
	},
	{
		label: 'Tokens',
		items: [
			{ label: 'Colors', href: '/tokens/colors' },
			{ label: 'Spacing', href: '/tokens/spacing' },
			{ label: 'Typography', href: '/tokens/typography' },
		],
	},
];

export function isNavGroup(entry: NavEntry): entry is NavGroup {
	return 'items' in entry;
}

export function flattenNavigation(): NavItem[] {
	const items: NavItem[] = [];
	for (const entry of navigation) {
		if (isNavGroup(entry)) {
			items.push(...entry.items);
		} else {
			items.push(entry);
		}
	}
	return items;
}

export function findAdjacentPages(currentPath: string): { prev?: NavItem; next?: NavItem } {
	const items = flattenNavigation();
	const normalizedPath = currentPath.replace(/\/$/, '');
	const currentIndex = items.findIndex(
		(item) => item.href === normalizedPath || item.href === currentPath
	);

	if (currentIndex === -1) {
		return {};
	}

	return {
		prev: currentIndex > 0 ? items[currentIndex - 1] : undefined,
		next: currentIndex < items.length - 1 ? items[currentIndex + 1] : undefined,
	};
}
