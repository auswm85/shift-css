import { forwardRef, type HTMLAttributes } from 'react';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
	/** Badge variant */
	variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
	/** Badge size */
	size?: 'sm' | 'lg';
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
	({ variant = 'primary', size, children, ...rest }, ref) => {
		return (
			<span ref={ref} s-badge={variant} s-size={size} {...rest}>
				{children}
			</span>
		);
	}
);

Badge.displayName = 'Badge';
