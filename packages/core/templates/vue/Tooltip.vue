<script setup lang="ts">
/**
 * Tooltip Component
 *
 * @example
 * <Tooltip text="Helpful info">Hover me</Tooltip>
 * <Tooltip text="Bottom tooltip" position="bottom">Hover me</Tooltip>
 */

export interface TooltipProps {
	/** Tooltip text content */
	text: string;
	/** Tooltip position */
	position?: 'top' | 'bottom' | 'left' | 'right';
}

withDefaults(defineProps<TooltipProps>(), {
	position: 'top',
});
</script>

<template>
	<span :s-tooltip="position" :s-tooltip-text="text" :title="text">
		<slot />
	</span>
</template>
