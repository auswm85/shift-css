<script setup lang="ts">
/**
 * Input Component
 *
 * @example
 * <Input placeholder="Enter text..." />
 * <Input type="email" size="lg" />
 * <Input error />
 */

export interface InputProps {
	/** Input size */
	size?: 'sm' | 'lg';
	/** Input type */
	type?: string;
	/** Error state */
	error?: boolean;
	/** Model value for v-model */
	modelValue?: string;
}

withDefaults(defineProps<InputProps>(), {
	type: 'text',
	error: false,
});

defineEmits<{
	'update:modelValue': [value: string];
}>();
</script>

<template>
	<input
		s-input=""
		:s-size="size"
		:type="type"
		:aria-invalid="error || undefined"
		:value="modelValue"
		@input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
	/>
</template>
