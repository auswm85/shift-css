import { forwardRef, type HTMLAttributes } from 'react';

export interface ProseProps extends HTMLAttributes<HTMLDivElement> {
	/** Prose size */
	size?: 'sm' | 'lg';
}

export const Prose = forwardRef<HTMLDivElement, ProseProps>(({ size, children, ...rest }, ref) => {
	return (
		<div ref={ref} s-prose s-size={size} {...rest}>
			{children}
		</div>
	);
});

Prose.displayName = 'Prose';
