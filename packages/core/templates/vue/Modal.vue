<script setup lang="ts">
import { ref, watch } from 'vue';

/**
 * Modal Component
 *
 * @example
 * <Modal v-model:open="isOpen">
 *   <div s-modal-header>Title</div>
 *   <div s-modal-body>Content</div>
 * </Modal>
 */

export interface ModalProps {
	/** Modal size */
	size?: 'sm' | 'lg' | 'xl' | 'full';
	/** Modal position */
	position?: 'center' | 'top' | 'bottom' | 'left' | 'right';
	/** Control modal open state */
	open?: boolean;
}

const props = defineProps<ModalProps>();

const emit = defineEmits<{
	'update:open': [value: boolean];
}>();

const dialogRef = ref<HTMLDialogElement | null>(null);

watch(
	() => props.open,
	(isOpen) => {
		const dialog = dialogRef.value;
		if (!dialog) return;
		if (isOpen && !dialog.open) {
			dialog.showModal();
		} else if (!isOpen && dialog.open) {
			dialog.close();
		}
	},
	{ immediate: true, flush: 'post' }
);

function handleClose() {
	emit('update:open', false);
}
</script>

<template>
	<dialog ref="dialogRef" s-modal :s-size="size" :s-position="position" aria-modal="true" @close="handleClose">
		<slot />
	</dialog>
</template>
