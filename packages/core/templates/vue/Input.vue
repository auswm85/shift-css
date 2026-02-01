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
	/** Input size (omit for default medium size) */
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

const emit = defineEmits<{
	'update:modelValue': [value: string];
}>();

function handleInput(event: Event) {
	emit('update:modelValue', (event.target as HTMLInputElement).value);
}
</script>

<template>
	<input s-input :s-size="size" :type="type" :aria-invalid="error || undefined" :value="modelValue"
		@input="handleInput" />
</template>
