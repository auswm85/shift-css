<script setup lang="ts">
/**
 * Prose Component
 *
 * @example
 * <Prose>
 *   <h1>Article Title</h1>
 *   <p>Long form content...</p>
 * </Prose>
 */

export interface ProseProps {
	/** Prose size */
	size?: 'sm' | 'lg';
}

defineProps<ProseProps>();
</script>

<template>
	<div s-prose="" :s-size="size">
		<slot />
	</div>
</template>
