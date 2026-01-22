/**
 * Shiki transformer that converts hex colors to OKLCH
 * This gives us true perceptual uniformity in syntax highlighting
 */
import type { ShikiTransformer } from 'shiki';

// Convert sRGB to linear RGB (remove gamma correction)
function srgbToLinear(c: number): number {
	return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

// Convert linear RGB to XYZ (D65 illuminant)
function linearRgbToXyz(r: number, g: number, b: number): [number, number, number] {
	return [
		0.4124564 * r + 0.3575761 * g + 0.1804375 * b,
		0.2126729 * r + 0.7151522 * g + 0.072175 * b,
		0.0193339 * r + 0.119192 * g + 0.9503041 * b,
	];
}

// Convert XYZ to Oklab
function xyzToOklab(x: number, y: number, z: number): [number, number, number] {
	const l_ = Math.cbrt(0.8189330101 * x + 0.3618667424 * y - 0.1288597137 * z);
	const m_ = Math.cbrt(0.0329845436 * x + 0.9293118715 * y + 0.0361456387 * z);
	const s_ = Math.cbrt(-0.0482003018 * x + 0.2643662691 * y + 0.633851707 * z);

	return [
		0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_,
		1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_,
		0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_,
	];
}

// Convert Oklab to OKLCH
function oklabToOklch(L: number, a: number, b: number): [number, number, number] {
	const C = Math.sqrt(a * a + b * b);
	let h = (Math.atan2(b, a) * 180) / Math.PI;
	if (h < 0) h += 360;
	return [L, C, h];
}

// Convert hex color to OKLCH
function hexToOklch(hex: string): string {
	// Parse hex
	const r = parseInt(hex.slice(1, 3), 16) / 255;
	const g = parseInt(hex.slice(3, 5), 16) / 255;
	const b = parseInt(hex.slice(5, 7), 16) / 255;

	// Convert through color spaces
	const linearR = srgbToLinear(r);
	const linearG = srgbToLinear(g);
	const linearB = srgbToLinear(b);

	const [x, y, z] = linearRgbToXyz(linearR, linearG, linearB);
	const [L, a, bVal] = xyzToOklab(x, y, z);
	const [l, c, h] = oklabToOklch(L, a, bVal);

	// Format as OKLCH
	// L is 0-1, convert to percentage
	// C is typically 0-0.4 for most colors
	// H is 0-360 degrees
	const lPercent = (l * 100).toFixed(1);
	const cValue = c.toFixed(3);
	const hValue = h.toFixed(0);

	// Skip hue for achromatic colors (very low chroma)
	if (c < 0.005) {
		return `oklch(${lPercent}% ${cValue} none)`;
	}

	return `oklch(${lPercent}% ${cValue} ${hValue})`;
}

// Transform both light and dark color values in a style string
function transformStyleColors(style: string): string {
	return style.replace(
		/color:#([0-9a-fA-F]{6})/g,
		(_, hex) => `color:${hexToOklch('#' + hex)}`
	).replace(
		/--shiki-dark:#([0-9a-fA-F]{6})/g,
		(_, hex) => `--shiki-dark:${hexToOklch('#' + hex)}`
	);
}

// Expand 3-digit hex to 6-digit
function expandHex(hex: string): string {
	if (hex.length === 3) {
		return hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
	}
	return hex;
}

// Transform all hex colors in a style string (for pre element)
function transformAllHexColors(style: string): string {
	return style.replace(
		/#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/g,
		(_, hex) => hexToOklch('#' + expandHex(hex))
	);
}

export const oklchTransformer: ShikiTransformer = {
	name: 'oklch-colors',
	span(node) {
		if (!node?.properties) return;
		const style = node.properties.style;
		if (style && typeof style === 'string') {
			node.properties.style = transformStyleColors(style);
		}
	},
	pre(node) {
		if (!node?.properties) return;
		const style = node.properties.style;
		if (style && typeof style === 'string') {
			// Transform all hex colors in the pre element
			node.properties.style = transformAllHexColors(style);
		}
	},
};

export default oklchTransformer;
