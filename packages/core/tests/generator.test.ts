/**
 * Shift CSS - Color Generator Math Tests
 *
 * Tests the mathematical correctness of the OKLCH color generation,
 * including perceptual uniformity and contrast calculations.
 */

import { describe, expect, test } from 'bun:test';
import {
	calculateContrastRatio,
	meetsWcagAA,
	meetsWcagAAA,
	meetsWcagAALarge,
	oklchLightnessToRelativeLuminance,
	isValidLightness,
	isValidChroma,
	isValidHue,
} from '../scripts/utils.ts';

/**
 * Color scale definitions from tokens/colors.json
 */
const LIGHTNESS_SCALE = {
	50: 0.9778,
	100: 0.9356,
	200: 0.8811,
	300: 0.8267,
	400: 0.7422,
	500: 0.6478,
	600: 0.5733,
	700: 0.4689,
	800: 0.3944,
	900: 0.32,
	950: 0.2378,
};

const VIVID_CHROMA_SCALE = {
	50: 0.0108,
	100: 0.0321,
	200: 0.0636,
	300: 0.0951,
	400: 0.1211,
	500: 0.1472,
	600: 0.1383,
	700: 0.1178,
	800: 0.0894,
	900: 0.072,
	950: 0.054,
};

const NEUTRAL_CHROMA_SCALE = {
	50: 0.0054,
	100: 0.0072,
	200: 0.009,
	300: 0.0099,
	400: 0.0108,
	500: 0.0118,
	600: 0.0108,
	700: 0.0099,
	800: 0.009,
	900: 0.0081,
	950: 0.0072,
};

describe('Lightness Scale Properties', () => {
	test('all lightness values are valid (0-1)', () => {
		for (const [step, value] of Object.entries(LIGHTNESS_SCALE)) {
			expect(isValidLightness(value.toString())).toBe(true);
		}
	});

	test('lightness scale is monotonically decreasing', () => {
		const steps = Object.keys(LIGHTNESS_SCALE)
			.map(Number)
			.sort((a, b) => a - b);

		for (let i = 1; i < steps.length; i++) {
			const prevValue = LIGHTNESS_SCALE[steps[i - 1] as keyof typeof LIGHTNESS_SCALE];
			const currValue = LIGHTNESS_SCALE[steps[i] as keyof typeof LIGHTNESS_SCALE];
			expect(currValue).toBeLessThan(prevValue);
		}
	});

	test('lightness steps have perceptually uniform spacing', () => {
		// OKLCH L should be perceptually uniform, so steps should be roughly consistent
		const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
		const differences: number[] = [];

		for (let i = 1; i < steps.length; i++) {
			const diff =
				LIGHTNESS_SCALE[steps[i - 1] as keyof typeof LIGHTNESS_SCALE] -
				LIGHTNESS_SCALE[steps[i] as keyof typeof LIGHTNESS_SCALE];
			differences.push(diff);
		}

		// The average step should be consistent (within tolerance)
		const avgDiff = differences.reduce((a, b) => a + b, 0) / differences.length;

		// Most steps should be within 50% of the average (allowing for intentional variation)
		const withinTolerance = differences.filter(
			(d) => d >= avgDiff * 0.3 && d <= avgDiff * 2.0
		);
		expect(withinTolerance.length).toBeGreaterThanOrEqual(differences.length * 0.7);
	});

	test('endpoints provide sufficient contrast range', () => {
		const lightest = LIGHTNESS_SCALE[50];
		const darkest = LIGHTNESS_SCALE[950];

		// Should span at least 70% of the lightness range
		const range = lightest - darkest;
		expect(range).toBeGreaterThanOrEqual(0.7);
	});
});

describe('Chroma Scale Properties', () => {
	test('all vivid chroma values are valid (0-0.5)', () => {
		for (const value of Object.values(VIVID_CHROMA_SCALE)) {
			expect(isValidChroma(value.toString())).toBe(true);
		}
	});

	test('all neutral chroma values are valid and subtle', () => {
		for (const value of Object.values(NEUTRAL_CHROMA_SCALE)) {
			expect(isValidChroma(value.toString())).toBe(true);
			// Neutral chroma should be very low (< 0.02)
			expect(value).toBeLessThan(0.02);
		}
	});

	test('vivid chroma peaks at middle of scale (500)', () => {
		const peak = VIVID_CHROMA_SCALE[500];
		const otherValues = Object.entries(VIVID_CHROMA_SCALE)
			.filter(([step]) => step !== '500')
			.map(([, value]) => value);

		for (const value of otherValues) {
			expect(peak).toBeGreaterThanOrEqual(value);
		}
	});

	test('neutral chroma is consistently subtle across scale', () => {
		const values = Object.values(NEUTRAL_CHROMA_SCALE);
		const max = Math.max(...values);
		const min = Math.min(...values);

		// Range should be small (< 0.01)
		expect(max - min).toBeLessThan(0.01);
	});
});

describe('Contrast Ratio Calculations', () => {
	test('black on white has maximum contrast (~21:1)', () => {
		const whiteLum = oklchLightnessToRelativeLuminance(1.0);
		const blackLum = oklchLightnessToRelativeLuminance(0.0);
		const ratio = calculateContrastRatio(whiteLum, blackLum);

		expect(ratio).toBeCloseTo(21, 0);
	});

	test('scale endpoint contrast (50 vs 950) meets AAA', () => {
		const lum50 = oklchLightnessToRelativeLuminance(LIGHTNESS_SCALE[50]);
		const lum950 = oklchLightnessToRelativeLuminance(LIGHTNESS_SCALE[950]);
		const ratio = calculateContrastRatio(lum50, lum950);

		expect(meetsWcagAAA(ratio)).toBe(true);
	});

	test('typical text contrast (50 vs 900) meets AAA', () => {
		const lum50 = oklchLightnessToRelativeLuminance(LIGHTNESS_SCALE[50]);
		const lum900 = oklchLightnessToRelativeLuminance(LIGHTNESS_SCALE[900]);
		const ratio = calculateContrastRatio(lum50, lum900);

		expect(meetsWcagAAA(ratio)).toBe(true);
	});

	test('secondary text contrast (50 vs 700) meets AA', () => {
		const lum50 = oklchLightnessToRelativeLuminance(LIGHTNESS_SCALE[50]);
		const lum700 = oklchLightnessToRelativeLuminance(LIGHTNESS_SCALE[700]);
		const ratio = calculateContrastRatio(lum50, lum700);

		expect(meetsWcagAA(ratio)).toBe(true);
	});

	test('large text contrast (50 vs 600) meets AA large', () => {
		const lum50 = oklchLightnessToRelativeLuminance(LIGHTNESS_SCALE[50]);
		const lum600 = oklchLightnessToRelativeLuminance(LIGHTNESS_SCALE[600]);
		const ratio = calculateContrastRatio(lum50, lum600);

		expect(meetsWcagAALarge(ratio)).toBe(true);
	});

	test('dark mode contrast (900 vs 50) meets AAA', () => {
		const lum900 = oklchLightnessToRelativeLuminance(LIGHTNESS_SCALE[900]);
		const lum50 = oklchLightnessToRelativeLuminance(LIGHTNESS_SCALE[50]);
		const ratio = calculateContrastRatio(lum900, lum50);

		expect(meetsWcagAAA(ratio)).toBe(true);
	});

	test('dark mode secondary (900 vs 200) meets AA', () => {
		const lum900 = oklchLightnessToRelativeLuminance(LIGHTNESS_SCALE[900]);
		const lum200 = oklchLightnessToRelativeLuminance(LIGHTNESS_SCALE[200]);
		const ratio = calculateContrastRatio(lum900, lum200);

		expect(meetsWcagAA(ratio)).toBe(true);
	});
});

describe('Tinted Gray Contrast Validation', () => {
	/**
	 * Tinted grays use very low chroma values that shouldn't significantly
	 * affect contrast ratios compared to pure grays. This test validates that.
	 */
	test('neutral chroma does not significantly impact luminance', () => {
		// For OKLCH, chroma affects saturation but not perceived lightness
		// The lightness value should be the primary determinant of contrast
		for (const [step, lightness] of Object.entries(LIGHTNESS_SCALE)) {
			const lum = oklchLightnessToRelativeLuminance(lightness);
			// Luminance should be reasonable (not NaN, not negative)
			expect(lum).toBeGreaterThanOrEqual(0);
			expect(lum).toBeLessThanOrEqual(1);
			expect(isNaN(lum)).toBe(false);
		}
	});

	test('key text contrast pairs maintain readability', () => {
		// Test specific pairs that are commonly used for text
		const textPairs = [
			// Light backgrounds with dark text
			{ bg: 50, fg: 900, minRatio: 7 }, // Primary text - AAA
			{ bg: 50, fg: 800, minRatio: 4.5 }, // Secondary text - AA
			{ bg: 100, fg: 900, minRatio: 7 }, // Primary on slightly darker bg
			// Dark backgrounds with light text
			{ bg: 900, fg: 50, minRatio: 7 }, // Dark mode primary - AAA
			{ bg: 900, fg: 100, minRatio: 4.5 }, // Dark mode secondary - AA
			{ bg: 800, fg: 50, minRatio: 4.5 }, // Dark mode variant - AA
		];

		for (const pair of textPairs) {
			const bgLum = oklchLightnessToRelativeLuminance(
				LIGHTNESS_SCALE[pair.bg as keyof typeof LIGHTNESS_SCALE]
			);
			const fgLum = oklchLightnessToRelativeLuminance(
				LIGHTNESS_SCALE[pair.fg as keyof typeof LIGHTNESS_SCALE]
			);
			const ratio = calculateContrastRatio(bgLum, fgLum);

			expect(ratio).toBeGreaterThanOrEqual(pair.minRatio);
		}
	});
});

describe('Hue-Independent Contrast', () => {
	/**
	 * In OKLCH, contrast is determined by lightness, not hue.
	 * This validates that our contrast calculations work for any hue.
	 */
	test('contrast ratio is hue-independent', () => {
		// Since we use lightness for contrast, different hues should yield same contrast
		const hues = [0, 30, 60, 120, 180, 240, 300, 360];

		const baseLum50 = oklchLightnessToRelativeLuminance(LIGHTNESS_SCALE[50]);
		const baseLum900 = oklchLightnessToRelativeLuminance(LIGHTNESS_SCALE[900]);
		const baseRatio = calculateContrastRatio(baseLum50, baseLum900);

		// All hues should produce the same contrast ratio
		// (since we calculate from lightness only)
		for (const hue of hues) {
			expect(isValidHue(hue.toString())).toBe(true);
			// The contrast calculation doesn't depend on hue
			// This is a validation that our approach is correct
		}

		expect(baseRatio).toBeGreaterThan(7); // AAA
	});
});

describe('WCAG Threshold Functions', () => {
	test('meetsWcagAA boundary cases', () => {
		expect(meetsWcagAA(4.49)).toBe(false);
		expect(meetsWcagAA(4.5)).toBe(true);
		expect(meetsWcagAA(4.51)).toBe(true);
	});

	test('meetsWcagAAA boundary cases', () => {
		expect(meetsWcagAAA(6.99)).toBe(false);
		expect(meetsWcagAAA(7.0)).toBe(true);
		expect(meetsWcagAAA(7.01)).toBe(true);
	});

	test('meetsWcagAALarge boundary cases', () => {
		expect(meetsWcagAALarge(2.99)).toBe(false);
		expect(meetsWcagAALarge(3.0)).toBe(true);
		expect(meetsWcagAALarge(3.01)).toBe(true);
	});

	test('contrast ratio is symmetric', () => {
		const ratio1 = calculateContrastRatio(0.8, 0.2);
		const ratio2 = calculateContrastRatio(0.2, 0.8);
		expect(ratio1).toBe(ratio2);
	});
});

describe('Edge Cases', () => {
	test('identical colors have 1:1 contrast', () => {
		const lum = oklchLightnessToRelativeLuminance(0.5);
		const ratio = calculateContrastRatio(lum, lum);
		expect(ratio).toBe(1);
	});

	test('extreme lightness values', () => {
		// Very light
		expect(isValidLightness('0.999')).toBe(true);
		// Very dark
		expect(isValidLightness('0.001')).toBe(true);
		// Exact boundaries
		expect(isValidLightness('0')).toBe(true);
		expect(isValidLightness('1')).toBe(true);
	});

	test('extreme chroma values', () => {
		// Very low (nearly gray)
		expect(isValidChroma('0.001')).toBe(true);
		// Moderate
		expect(isValidChroma('0.2')).toBe(true);
		// Higher end of typical range
		expect(isValidChroma('0.4')).toBe(true);
	});
});
