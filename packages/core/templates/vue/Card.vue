<script setup lang="ts">
/**
 * Card Component
 *
 * @example
 * <Card>Simple card content</Card>
 * <Card variant="elevated">Elevated card</Card>
 * <Card interactive>Clickable card</Card>
 */

export interface CardProps {
	/** Card variant */
	variant?: 'flat' | 'elevated' | 'outline';
	/** Surface depth */
	surface?: 'raised' | 'floating';
	/** Card size */
	size?: 'sm' | 'lg';
	/** Interactive (hoverable) */
	interactive?: boolean;
	/** Horizontal layout */
	horizontal?: boolean;
}

withDefaults(defineProps<CardProps>(), {
	interactive: false,
	horizontal: false,
});
</script>

<template>
	<article :s-card="variant" :s-surface="surface" :s-size="size" :s-interactive="interactive || undefined"
		:s-horizontal="horizontal || undefined">
		<slot />
	</article>
</template>
