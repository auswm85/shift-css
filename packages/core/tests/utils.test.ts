/**
 * Shift CSS - Unit Tests for Token Generation Utilities
 */

import { describe, expect, test } from 'bun:test';
import {
	calculateContrastRatio,
	camelToKebab,
	generateCssVar,
	generateLightDark,
	generateOklchColor,
	isValidChroma,
	isValidHue,
	isValidLightness,
	meetsWcagAA,
	meetsWcagAAA,
	meetsWcagAALarge,
	oklchLightnessToRelativeLuminance,
	resolveTokenReference,
} from '../scripts/utils.ts';

describe('camelToKebab', () => {
	test('converts camelCase to kebab-case', () => {
		expect(camelToKebab('backgroundColor')).toBe('background-color');
		expect(camelToKebab('borderTopLeftRadius')).toBe('border-top-left-radius');
	});

	test('handles single word', () => {
		expect(camelToKebab('color')).toBe('color');
	});

	test('handles already kebab-case', () => {
		expect(camelToKebab('background-color')).toBe('background-color');
	});

	test('handles consecutive capitals', () => {
		// The regex only splits on lowercase-uppercase boundaries
		expect(camelToKebab('getHTTPResponse')).toBe('get-httpresponse');
	});
});

describe('resolveTokenReference', () => {
	test('resolves token reference to CSS variable', () => {
		expect(resolveTokenReference('{color.primary.500}')).toBe('var(--color-primary-500)');
		expect(resolveTokenReference('{surface.base}')).toBe('var(--surface-base)');
	});

	test('returns value unchanged if not a reference', () => {
		expect(resolveTokenReference('#ffffff')).toBe('#ffffff');
		expect(resolveTokenReference('1rem')).toBe('1rem');
	});

	test('handles nested paths', () => {
		expect(resolveTokenReference('{color.neutral.50}')).toBe('var(--color-neutral-50)');
	});
});

describe('generateOklchColor', () => {
	test('generates valid OKLCH color string', () => {
		expect(generateOklchColor('0.5', '0.15', 'var(--hue)')).toBe('oklch(0.5 0.15 var(--hue))');
	});

	test('handles decimal values', () => {
		expect(generateOklchColor('0.9778', '0.0108', '250')).toBe('oklch(0.9778 0.0108 250)');
	});
});

describe('generateCssVar', () => {
	test('generates CSS custom property declaration', () => {
		expect(generateCssVar('color-primary-500', '#6366f1')).toBe(
			'    --color-primary-500: #6366f1;'
		);
	});

	test('handles complex values', () => {
		expect(generateCssVar('shadow-md', '0 4px 6px rgba(0,0,0,0.1)')).toBe(
			'    --shadow-md: 0 4px 6px rgba(0,0,0,0.1);'
		);
	});
});

describe('generateLightDark', () => {
	test('generates light-dark() function', () => {
		expect(generateLightDark('var(--white)', 'var(--black)')).toBe(
			'light-dark(var(--white), var(--black))'
		);
	});
});

describe('OKLCH value validation', () => {
	describe('isValidLightness', () => {
		test('accepts valid lightness values', () => {
			expect(isValidLightness('0')).toBe(true);
			expect(isValidLightness('0.5')).toBe(true);
			expect(isValidLightness('1')).toBe(true);
			expect(isValidLightness('0.9778')).toBe(true);
		});

		test('rejects invalid lightness values', () => {
			expect(isValidLightness('-0.1')).toBe(false);
			expect(isValidLightness('1.1')).toBe(false);
			expect(isValidLightness('abc')).toBe(false);
		});
	});

	describe('isValidChroma', () => {
		test('accepts valid chroma values', () => {
			expect(isValidChroma('0')).toBe(true);
			expect(isValidChroma('0.15')).toBe(true);
			expect(isValidChroma('0.4')).toBe(true);
		});

		test('rejects invalid chroma values', () => {
			expect(isValidChroma('-0.1')).toBe(false);
			expect(isValidChroma('0.6')).toBe(false);
			expect(isValidChroma('abc')).toBe(false);
		});
	});

	describe('isValidHue', () => {
		test('accepts valid hue values', () => {
			expect(isValidHue('0')).toBe(true);
			expect(isValidHue('180')).toBe(true);
			expect(isValidHue('360')).toBe(true);
			expect(isValidHue('250')).toBe(true);
		});

		test('rejects invalid hue values', () => {
			expect(isValidHue('-10')).toBe(false);
			expect(isValidHue('400')).toBe(false);
			expect(isValidHue('abc')).toBe(false);
		});
	});
});

describe('WCAG Contrast Calculations', () => {
	describe('calculateContrastRatio', () => {
		test('calculates contrast ratio between two luminances', () => {
			// Black on white should be 21:1
			const ratio = calculateContrastRatio(1, 0);
			expect(ratio).toBeCloseTo(21, 0);
		});

		test('returns same ratio regardless of order', () => {
			expect(calculateContrastRatio(0.5, 0.1)).toBe(calculateContrastRatio(0.1, 0.5));
		});

		test('identical colors have ratio of 1', () => {
			expect(calculateContrastRatio(0.5, 0.5)).toBe(1);
		});
	});

	describe('WCAG compliance checks', () => {
		test('meetsWcagAA requires 4.5:1 ratio', () => {
			expect(meetsWcagAA(4.5)).toBe(true);
			expect(meetsWcagAA(4.49)).toBe(false);
			expect(meetsWcagAA(7)).toBe(true);
		});

		test('meetsWcagAAA requires 7:1 ratio', () => {
			expect(meetsWcagAAA(7)).toBe(true);
			expect(meetsWcagAAA(6.99)).toBe(false);
			expect(meetsWcagAAA(21)).toBe(true);
		});

		test('meetsWcagAALarge requires 3:1 ratio', () => {
			expect(meetsWcagAALarge(3)).toBe(true);
			expect(meetsWcagAALarge(2.99)).toBe(false);
		});
	});
});

describe('Token Validation', () => {
	test('lightness scale values are valid', () => {
		const lightnessValues = [
			'0.9778', // 50
			'0.9356', // 100
			'0.8811', // 200
			'0.8267', // 300
			'0.7422', // 400
			'0.6478', // 500
			'0.5733', // 600
			'0.4689', // 700
			'0.3944', // 800
			'0.3200', // 900
			'0.2378', // 950
		];

		for (const value of lightnessValues) {
			expect(isValidLightness(value)).toBe(true);
		}
	});

	test('lightness scale is monotonically decreasing', () => {
		const lightnessValues = [
			0.9778, 0.9356, 0.8811, 0.8267, 0.7422, 0.6478, 0.5733, 0.4689, 0.3944, 0.32, 0.2378,
		];

		for (let i = 1; i < lightnessValues.length; i++) {
			const current = lightnessValues[i]!;
			const previous = lightnessValues[i - 1]!;
			expect(current).toBeLessThan(previous);
		}
	});

	test('chroma values are valid', () => {
		const chromaValues = [
			'0.0108',
			'0.0321',
			'0.0636',
			'0.0951',
			'0.1211',
			'0.1472',
			'0.1383',
			'0.1178',
			'0.0894',
			'0.0720',
			'0.0540',
		];

		for (const value of chromaValues) {
			expect(isValidChroma(value)).toBe(true);
		}
	});
});

describe('Contrast between scale endpoints', () => {
	test('primary-50 and primary-950 should have sufficient contrast', () => {
		// Lightness values from the scale
		const l50 = 0.9778;
		const l950 = 0.2378;

		const lum50 = oklchLightnessToRelativeLuminance(l50);
		const lum950 = oklchLightnessToRelativeLuminance(l950);

		const ratio = calculateContrastRatio(lum50, lum950);

		// Should meet at least AA for large text
		expect(meetsWcagAALarge(ratio)).toBe(true);
	});

	test('neutral scale should maintain readable contrast', () => {
		// Test text on background scenarios
		const bgLight = 0.9778; // neutral-50
		const textDark = 0.32; // neutral-900

		const lumBg = oklchLightnessToRelativeLuminance(bgLight);
		const lumText = oklchLightnessToRelativeLuminance(textDark);

		const ratio = calculateContrastRatio(lumBg, lumText);

		// Should meet AA for normal text
		expect(meetsWcagAA(ratio)).toBe(true);
	});
});
