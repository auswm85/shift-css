import { type AnchorHTMLAttributes, forwardRef } from 'react';

export interface SkipLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
	/** Element ID to skip to (e.g., "#main") */
	href?: string;
}

export const SkipLink = forwardRef<HTMLAnchorElement, SkipLinkProps>(
	({ href = '#main', children = 'Skip to main content', ...rest }, ref) => {
		return (
			<a ref={ref} s-skip-link href={href} {...rest}>
				{children}
			</a>
		);
	}
);

SkipLink.displayName = 'SkipLink';
