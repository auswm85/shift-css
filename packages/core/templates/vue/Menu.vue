<script setup lang="ts">
/**
 * Menu Component
 *
 * @example
 * <Menu>
 *   <a s-menu-item href="#">Item 1</a>
 *   <a s-menu-item href="#">Item 2</a>
 * </Menu>
 */

export interface MenuProps {
	/** Menu size */
	size?: 'sm' | 'lg';
	/** Accessible label for the menu */
	ariaLabel?: string;
}

defineProps<MenuProps>();
</script>

<template>
	<nav s-menu :s-size="size" role="menu" :aria-label="ariaLabel">
		<slot />
	</nav>
</template>
