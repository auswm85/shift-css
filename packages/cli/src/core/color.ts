/**
 * Color Utilities
 * Hex to OKLCH hue conversion
 */

/**
 * Parse a hex color string to RGB values
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
	// Remove # if present
	const cleaned = hex.replace(/^#/, '');

	// Support 3-char shorthand (#f0f -> #ff00ff)
	const fullHex =
		cleaned.length === 3
			? cleaned
					.split('')
					.map((c) => c + c)
					.join('')
			: cleaned;

	if (fullHex.length !== 6) return null;

	const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
	if (!result) return null;

	return {
		r: Number.parseInt(result[1]!, 16),
		g: Number.parseInt(result[2]!, 16),
		b: Number.parseInt(result[3]!, 16),
	};
}

/**
 * Convert RGB to HSL and extract hue
 * Returns hue in degrees (0-360)
 */
function rgbToHue(r: number, g: number, b: number): number {
	// Normalize to 0-1
	const rNorm = r / 255;
	const gNorm = g / 255;
	const bNorm = b / 255;

	const max = Math.max(rNorm, gNorm, bNorm);
	const min = Math.min(rNorm, gNorm, bNorm);
	const delta = max - min;

	// Achromatic (gray) - return neutral hue
	if (delta === 0) return 250;

	let hue: number;

	if (max === rNorm) {
		hue = ((gNorm - bNorm) / delta) % 6;
	} else if (max === gNorm) {
		hue = (bNorm - rNorm) / delta + 2;
	} else {
		hue = (rNorm - gNorm) / delta + 4;
	}

	hue = Math.round(hue * 60);
	if (hue < 0) hue += 360;

	return hue;
}

/**
 * Convert hex color to OKLCH hue
 * Note: This is a simplified conversion that uses HSL hue as approximation
 * For production, consider using colorjs.io for accurate OKLCH conversion
 */
export function hexToHue(hex: string): number | null {
	const rgb = hexToRgb(hex);
	if (!rgb) return null;
	return rgbToHue(rgb.r, rgb.g, rgb.b);
}

/**
 * Check if a string looks like a hex color
 */
export function isHexColor(value: string): boolean {
	return /^#?([a-fA-F0-9]{3}|[a-fA-F0-9]{6})$/.test(value.trim());
}

/**
 * Get a human-readable color name for a hue
 */
export function getColorName(hue: number): string {
	// Normalize hue to 0-360
	const h = ((hue % 360) + 360) % 360;

	if (h >= 0 && h < 15) return 'Red';
	if (h >= 15 && h < 45) return 'Orange';
	if (h >= 45 && h < 75) return 'Yellow';
	if (h >= 75 && h < 105) return 'Lime';
	if (h >= 105 && h < 135) return 'Green';
	if (h >= 135 && h < 165) return 'Teal';
	if (h >= 165 && h < 195) return 'Cyan';
	if (h >= 195 && h < 225) return 'Sky';
	if (h >= 225 && h < 255) return 'Blue';
	if (h >= 255 && h < 285) return 'Indigo';
	if (h >= 285 && h < 315) return 'Purple';
	if (h >= 315 && h < 345) return 'Pink';
	return 'Red';
}

/**
 * Shift CSS preset themes
 */
export interface ColorPreset {
	name: string;
	hue: number;
	description: string;
}

export const PRESETS: ColorPreset[] = [
	{ name: 'Plasma', hue: 260, description: 'Electric Blue - High-tech default' },
	{ name: 'Laser', hue: 320, description: 'Cyber-Pink - Neon futurism' },
	{ name: 'Acid', hue: 140, description: 'Toxic Green - Engineering edge' },
	{ name: 'Void', hue: 0, description: 'Monochrome - Industrial minimal' },
];
