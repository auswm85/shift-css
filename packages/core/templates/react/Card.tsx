import { forwardRef, type HTMLAttributes } from 'react';

export interface CardProps extends HTMLAttributes<HTMLElement> {
	/** Card variant */
	variant?: 'flat' | 'elevated' | 'outline';
	/** Surface depth */
	surface?: 'raised' | 'floating';
	/** Card size */
	size?: 'sm' | 'lg';
	/** Interactive (hoverable) */
	interactive?: boolean;
	/** Horizontal layout */
	horizontal?: boolean;
}

export const Card = forwardRef<HTMLElement, CardProps>(
	({ variant, surface, size, interactive = false, horizontal = false, children, ...rest }, ref) => {
		return (
			<article
				ref={ref}
				s-card={variant}
				s-surface={surface}
				s-size={size}
				s-interactive={interactive || undefined}
				s-horizontal={horizontal || undefined}
				{...rest}
			>
				{children}
			</article>
		);
	}
);

Card.displayName = 'Card';
