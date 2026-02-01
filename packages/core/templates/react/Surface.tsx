import { forwardRef, type HTMLAttributes } from 'react';

export interface SurfaceProps extends HTMLAttributes<HTMLDivElement> {
	/** Surface depth */
	depth?: 'raised' | 'floating';
	/** Show border */
	bordered?: boolean;
	/** Interactive (hoverable) */
	interactive?: boolean;
}

export const Surface = forwardRef<HTMLDivElement, SurfaceProps>(
	({ depth, bordered = false, interactive = false, children, ...rest }, ref) => {
		return (
			<div
				ref={ref}
				s-surface={depth}
				s-bordered={bordered || undefined}
				s-interactive={interactive || undefined}
				{...rest}
			>
				{children}
			</div>
		);
	}
);

Surface.displayName = 'Surface';
