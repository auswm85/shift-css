import { type ButtonHTMLAttributes, forwardRef } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	/** Button variant */
	variant?:
		| 'primary'
		| 'secondary'
		| 'ghost'
		| 'link'
		| 'outline'
		| 'danger'
		| 'success'
		| 'warning';
	/** Button size */
	size?: 'sm' | 'lg' | 'xl';
	/** Loading state */
	loading?: boolean;
	/** Icon-only button */
	icon?: boolean;
	/** Full-width button */
	block?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			variant = 'primary',
			size,
			disabled = false,
			loading = false,
			icon = false,
			block = false,
			type = 'button',
			children,
			...rest
		},
		ref
	) => {
		return (
			<button
				ref={ref}
				s-btn={variant}
				s-size={size}
				s-icon={icon || undefined}
				s-block={block || undefined}
				s-loading={loading || undefined}
				type={type}
				disabled={disabled || loading}
				{...rest}
			>
				{children}
			</button>
		);
	}
);

Button.displayName = 'Button';
