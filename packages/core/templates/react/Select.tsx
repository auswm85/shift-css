import { forwardRef, type SelectHTMLAttributes } from 'react';

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
	/** Select size */
	size?: 'sm' | 'lg';
	/** Error state */
	error?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
	({ size, error = false, children, ...rest }, ref) => {
		return (
			<select ref={ref} s-select="" s-size={size} aria-invalid={error || undefined} {...rest}>
				{children}
			</select>
		);
	}
);

Select.displayName = 'Select';
