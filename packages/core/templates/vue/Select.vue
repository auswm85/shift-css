<script setup lang="ts">
/**
 * Select Component
 *
 * @example
 * <Select v-model="value">
 *   <option value="1">Option 1</option>
 *   <option value="2">Option 2</option>
 * </Select>
 */

export interface SelectProps {
	/** Select size */
	size?: 'sm' | 'lg';
	/** Error state */
	error?: boolean;
	/** Model value for v-model */
	modelValue?: string;
}

withDefaults(defineProps<SelectProps>(), {
	error: false,
});

defineEmits<{
	'update:modelValue': [value: string];
}>();
</script>

<template>
	<select s-select="" :s-size="size" :aria-invalid="error || undefined" :value="modelValue"
		@change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)">
		<slot />
	</select>
</template>
