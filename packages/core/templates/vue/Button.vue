<script setup lang="ts">
/**
 * Button Component
 *
 * @example
 * <Button>Default</Button>
 * <Button variant="primary">Primary</Button>
 * <Button variant="secondary" size="lg">Large Secondary</Button>
 * <Button variant="ghost" disabled>Disabled Ghost</Button>
 */

export interface ButtonProps {
	/** Button variant */
	variant?: 'primary' | 'secondary' | 'ghost' | 'link' | 'outline' | 'danger' | 'success' | 'warning';
	/** Button size */
	size?: 'sm' | 'lg' | 'xl';
	/** Disabled state */
	disabled?: boolean;
	/** Loading state */
	loading?: boolean;
	/** Icon-only button */
	icon?: boolean;
	/** Full-width button */
	block?: boolean;
	/** Button type */
	type?: 'button' | 'submit' | 'reset';
}

const props = withDefaults(defineProps<ButtonProps>(), {
	variant: 'primary',
	disabled: false,
	loading: false,
	icon: false,
	block: false,
	type: 'button',
});
</script>

<template>
	<button :s-btn="variant" :s-size="size" :s-icon="icon || undefined" :s-block="block || undefined"
		:s-loading="loading || undefined" :type="type" :disabled="props.disabled || props.loading"
		:aria-busy="loading || undefined" :aria-disabled="props.disabled || props.loading || undefined">
		<slot />
	</button>
</template>
