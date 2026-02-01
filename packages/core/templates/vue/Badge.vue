<script setup lang="ts">
/**
 * Badge Component
 *
 * @example
 * <Badge>Default</Badge>
 * <Badge variant="success">Success</Badge>
 * <Badge variant="danger" size="sm">Small Danger</Badge>
 */

export interface BadgeProps {
	/** Badge variant */
	variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
	/** Badge size */
	size?: 'sm' | 'lg';
}

withDefaults(defineProps<BadgeProps>(), {
	variant: 'primary',
});
</script>

<template>
	<span :s-badge="variant" :s-size="size">
		<slot />
	</span>
</template>
