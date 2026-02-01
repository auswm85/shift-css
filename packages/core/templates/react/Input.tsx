import { forwardRef, type InputHTMLAttributes } from 'react';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
	/** Input size */
	size?: 'sm' | 'lg';
	/** Error state */
	error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
	({ size, error = false, type = 'text', ...rest }, ref) => {
		return (
			<input
				ref={ref}
				s-input=""
				s-size={size}
				aria-invalid={error || undefined}
				type={type}
				{...rest}
			/>
		);
	}
);

Input.displayName = 'Input';
