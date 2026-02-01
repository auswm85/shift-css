import { forwardRef, type HTMLAttributes } from 'react';

export interface MenuProps extends HTMLAttributes<HTMLElement> {
	/** Menu size */
	size?: 'sm' | 'lg';
}

export const Menu = forwardRef<HTMLElement, MenuProps>(({ size, children, ...rest }, ref) => {
	return (
		<nav ref={ref} s-menu s-size={size} {...rest}>
			{children}
		</nav>
	);
});

Menu.displayName = 'Menu';
