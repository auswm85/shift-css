<script setup lang="ts">
/**
 * Skip Link Component
 *
 * @example
 * <SkipLink />
 * <SkipLink href="#content">Skip to content</SkipLink>
 */

export interface SkipLinkProps {
	/** Element ID to skip to (e.g., "#main") */
	href?: string;
}

withDefaults(defineProps<SkipLinkProps>(), {
	href: '#main',
});
</script>

<template>
	<a s-skip-link :href="href">
		<slot>Skip to main content</slot>
	</a>
</template>
