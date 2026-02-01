<script setup lang="ts">
/**
 * Surface Component
 *
 * @example
 * <Surface>Default surface</Surface>
 * <Surface depth="raised">Raised surface</Surface>
 * <Surface bordered interactive>Interactive bordered surface</Surface>
 */

export interface SurfaceProps {
	/** Surface depth */
	depth?: 'raised' | 'floating';
	/** Show border */
	bordered?: boolean;
	/** Interactive (hoverable) */
	interactive?: boolean;
}

withDefaults(defineProps<SurfaceProps>(), {
	bordered: false,
	interactive: false,
});
</script>

<template>
	<div :s-surface="depth" :s-bordered="bordered || undefined" :s-interactive="interactive || undefined">
		<slot />
	</div>
</template>
