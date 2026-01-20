/**
 * Shift CSS - Token Generation Utilities
 *
 * Pure functions for token generation, extracted for testing.
 */

/**
 * Convert camelCase to kebab-case
 */
export function camelToKebab(str: string): string {
	return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Resolve token reference syntax to CSS variable
 * e.g., {color.primary.500} -> var(--color-primary-500)
 */
export function resolveTokenReference(value: string): string {
	const match = value.match(/^\{(.+)\}$/);
	if (match?.[1]) {
		const path = match[1].replace(/\./g, '-');
		return `var(--${path})`;
	}
	return value;
}

/**
 * Generate an OKLCH color value string
 */
export function generateOklchColor(lightness: string, chroma: string, hueVar: string): string {
	return `oklch(${lightness} ${chroma} ${hueVar})`;
}

/**
 * Generate a CSS custom property declaration
 */
export function generateCssVar(name: string, value: string): string {
	return `    --${name}: ${value};`;
}

/**
 * Generate a light-dark() CSS function
 */
export function generateLightDark(lightValue: string, darkValue: string): string {
	return `light-dark(${lightValue}, ${darkValue})`;
}

/**
 * Validate OKLCH lightness value (0-1)
 */
export function isValidLightness(value: string): boolean {
	const num = parseFloat(value);
	return !Number.isNaN(num) && num >= 0 && num <= 1;
}

/**
 * Validate OKLCH chroma value (0-0.4 typical range)
 */
export function isValidChroma(value: string): boolean {
	const num = parseFloat(value);
	return !Number.isNaN(num) && num >= 0 && num <= 0.5;
}

/**
 * Validate hue value (0-360)
 */
export function isValidHue(value: string): boolean {
	const num = parseFloat(value);
	return !Number.isNaN(num) && num >= 0 && num <= 360;
}

/**
 * Calculate relative luminance from OKLCH lightness
 * Used for WCAG contrast calculations
 */
export function oklchLightnessToRelativeLuminance(l: number): number {
	// Approximate conversion from OKLCH L to relative luminance
	// OKLCH L is perceptually uniform, so this is approximate
	return l ** 2.4;
}

/**
 * Calculate WCAG contrast ratio between two relative luminances
 */
export function calculateContrastRatio(l1: number, l2: number): number {
	const lighter = Math.max(l1, l2);
	const darker = Math.min(l1, l2);
	return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast ratio meets WCAG AA (4.5:1 for normal text)
 */
export function meetsWcagAA(contrastRatio: number): boolean {
	return contrastRatio >= 4.5;
}

/**
 * Check if contrast ratio meets WCAG AAA (7:1 for normal text)
 */
export function meetsWcagAAA(contrastRatio: number): boolean {
	return contrastRatio >= 7;
}

/**
 * Check if contrast ratio meets WCAG AA for large text (3:1)
 */
export function meetsWcagAALarge(contrastRatio: number): boolean {
	return contrastRatio >= 3;
}
