import { forwardRef, type HTMLAttributes } from 'react';

export interface TooltipProps extends HTMLAttributes<HTMLSpanElement> {
	/** Tooltip text content */
	text: string;
	/** Tooltip position */
	position?: 'top' | 'bottom' | 'left' | 'right';
}

export const Tooltip = forwardRef<HTMLSpanElement, TooltipProps>(
	({ text, position, children, ...rest }, ref) => {
		return (
			<span ref={ref} s-tooltip={position} s-tooltip-text={text} {...rest}>
				{children}
			</span>
		);
	}
);

Tooltip.displayName = 'Tooltip';
