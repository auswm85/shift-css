import { type AnchorHTMLAttributes, forwardRef } from 'react';

export interface SkipLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
	/** Target element ID to skip to */
	target?: string;
}

export const SkipLink = forwardRef<HTMLAnchorElement, SkipLinkProps>(
	({ target = '#main', children = 'Skip to main content', ...rest }, ref) => {
		return (
			<a ref={ref} s-skip-link="" href={target} {...rest}>
				{children}
			</a>
		);
	}
);

SkipLink.displayName = 'SkipLink';
