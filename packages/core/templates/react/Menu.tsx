import { forwardRef, type HTMLAttributes, useEffect } from 'react';

export interface MenuProps extends HTMLAttributes<HTMLDivElement> {
	/** Menu size */
	size?: 'sm' | 'lg';
}

export const Menu = forwardRef<HTMLDivElement, MenuProps>(
	(
		{ size, children, 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledby, ...rest },
		ref
	) => {
		useEffect(() => {
			if (!ariaLabel && !ariaLabelledby) {
				console.warn(
					'[Menu] Accessibility warning: Menu requires either aria-label or aria-labelledby'
				);
			}
		}, [ariaLabel, ariaLabelledby]);

		if (!ariaLabel && !ariaLabelledby) {
			return null;
		}

		return (
			<div
				ref={ref}
				s-menu
				s-size={size}
				role="menu"
				aria-label={ariaLabel}
				aria-labelledby={ariaLabelledby}
				{...rest}
			>
				{children}
			</div>
		);
	}
);

Menu.displayName = 'Menu';
