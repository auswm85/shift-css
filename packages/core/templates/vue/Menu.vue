<script setup lang="ts">
import { onMounted, computed } from 'vue';

/**
 * Menu Component
 *
 * Requires either aria-label or aria-labelledby for accessibility.
 *
 * @example
 * <Menu aria-label="Actions menu">
 *   <a s-menu-item href="#">Item 1</a>
 *   <a s-menu-item href="#">Item 2</a>
 * </Menu>
 */

export interface MenuProps {
	/** Menu size */
	size?: 'sm' | 'lg';
	/** Accessible label for the menu */
	ariaLabel?: string;
	/** ID of element that labels the menu */
	ariaLabelledby?: string;
}

const props = defineProps<MenuProps>();

const hasAccessibleName = computed(() => props.ariaLabel || props.ariaLabelledby);

onMounted(() => {
	if (!hasAccessibleName.value) {
		console.warn('[Menu] Accessibility warning: Menu requires either aria-label or aria-labelledby');
	}
});
</script>

<template>
	<div v-if="hasAccessibleName" s-menu :s-size="size" role="menu" :aria-label="ariaLabel"
		:aria-labelledby="ariaLabelledby">
		<slot />
	</div>
</template>
