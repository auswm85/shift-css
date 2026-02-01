import { type DialogHTMLAttributes, forwardRef } from 'react';

export interface ModalProps extends DialogHTMLAttributes<HTMLDialogElement> {
	/** Modal size */
	size?: 'sm' | 'lg' | 'xl' | 'full';
	/** Modal position */
	position?: 'center' | 'top' | 'bottom' | 'left' | 'right';
}

export const Modal = forwardRef<HTMLDialogElement, ModalProps>(
	({ size, position, children, ...rest }, ref) => {
		return (
			<dialog ref={ref} s-modal="" s-size={size} s-position={position} aria-modal="true" {...rest}>
				{children}
			</dialog>
		);
	}
);

Modal.displayName = 'Modal';
