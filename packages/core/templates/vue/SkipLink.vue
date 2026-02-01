<script setup lang="ts">
/**
 * Skip Link Component
 *
 * @example
 * <SkipLink />
 * <SkipLink target="#content">Skip to content</SkipLink>
 */

export interface SkipLinkProps {
	/** Target element ID to skip to */
	target?: string;
}

withDefaults(defineProps<SkipLinkProps>(), {
	target: '#main',
});
</script>

<template>
	<a s-skip-link="" :href="target">
		<slot>Skip to main content</slot>
	</a>
</template>
