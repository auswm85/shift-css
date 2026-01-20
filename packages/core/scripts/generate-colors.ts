/**
 * Shift CSS - OKLCH Color Generator
 *
 * Generates CSS custom properties from token definitions.
 * Uses OKLCH color space for perceptually uniform color scales.
 */

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TOKENS_DIR = join(__dirname, '../tokens');
const OUTPUT_DIR = join(__dirname, '../src/tokens');

interface ColorToken {
	value: string;
	type?: string;
	description?: string;
}

interface ColorTokens {
	color: {
		seed: Record<string, ColorToken>;
		lightness: Record<string, ColorToken>;
		chroma: {
			vivid: Record<string, ColorToken>;
			neutral: Record<string, ColorToken>;
		};
	};
}

interface SemanticToken {
	light: ColorToken;
	dark: ColorToken;
	description?: string;
}

interface SemanticTokens {
	semantic: Record<string, Record<string, SemanticToken>>;
}

interface SpacingTokens {
	spacing: Record<string, ColorToken>;
	radius: Record<string, ColorToken>;
}

function loadJson<T>(filename: string): T {
	const filepath = join(TOKENS_DIR, filename);
	const content = readFileSync(filepath, 'utf-8');
	return JSON.parse(content) as T;
}

function generateSeedHueVariables(seeds: Record<string, ColorToken>): string[] {
	const lines: string[] = ['    /* SEED HUE CUSTOMIZATION POINTS */'];

	for (const [name, token] of Object.entries(seeds)) {
		lines.push(`    --shift-hue-${name}: ${token.value};`);
	}

	return lines;
}

function generateColorScale(
	scaleName: string,
	hueName: string,
	lightness: Record<string, ColorToken>,
	chroma: Record<string, ColorToken>,
	_isNeutral: boolean = false
): string[] {
	const lines: string[] = [``, `    /* ${scaleName.toUpperCase()} SCALE */`];
	const hueVar = `var(--shift-hue-${hueName})`;

	for (const step of Object.keys(lightness)) {
		const l = lightness[step]?.value;
		const c = chroma[step]?.value;

		if (l !== undefined && c !== undefined) {
			const varName = `--color-${scaleName}-${step}`;
			lines.push(`    ${varName}: oklch(${l} ${c} ${hueVar});`);
		}
	}

	return lines;
}

function generateSemanticTokens(semantic: SemanticTokens['semantic']): string[] {
	const lines: string[] = ['', '    /* SEMANTIC TOKENS with light-dark() */'];

	for (const [category, tokens] of Object.entries(semantic)) {
		lines.push(``, `    /* ${category.toUpperCase()} */`);

		for (const [name, token] of Object.entries(tokens)) {
			const varName = `--${category}-${camelToKebab(name)}`;

			// Convert token references to CSS variable references
			const lightValue = resolveTokenReference(token.light.value);
			const darkValue = resolveTokenReference(token.dark.value);

			lines.push(`    ${varName}: light-dark(${lightValue}, ${darkValue});`);
		}
	}

	return lines;
}

function resolveTokenReference(value: string): string {
	// Convert {color.primary.500} to var(--color-primary-500)
	const match = value.match(/^\{(.+)\}$/);
	if (match?.[1]) {
		const path = match[1].replace(/\./g, '-');
		return `var(--${path})`;
	}
	return value;
}

function camelToKebab(str: string): string {
	return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

function generateSpacingTokens(spacing: SpacingTokens): string[] {
	const lines: string[] = ['', '    /* SPACING SCALE */'];

	for (const [step, token] of Object.entries(spacing.spacing)) {
		const varName = `--spacing-${step.replace('.', '_')}`;
		lines.push(`    ${varName}: ${token.value};`);
	}

	lines.push('', '    /* BORDER RADIUS */');

	for (const [name, token] of Object.entries(spacing.radius)) {
		const varName = `--radius-${name}`;
		lines.push(`    ${varName}: ${token.value};`);
	}

	return lines;
}

function generateTypographyTokens(): string[] {
	return [
		'',
		'    /* TYPOGRAPHY */',
		'    --font-sans: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";',
		'    --font-serif: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;',
		'    --font-mono: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;',
		'',
		'    /* FONT SIZES (fluid) */',
		'    --text-xs: clamp(0.6875rem, 0.625rem + 0.25vi, 0.75rem);',
		'    --text-sm: clamp(0.8125rem, 0.75rem + 0.25vi, 0.875rem);',
		'    --text-base: clamp(0.9375rem, 0.875rem + 0.25vi, 1rem);',
		'    --text-lg: clamp(1.0625rem, 1rem + 0.25vi, 1.125rem);',
		'    --text-xl: clamp(1.1875rem, 1.0625rem + 0.5vi, 1.25rem);',
		'    --text-2xl: clamp(1.4375rem, 1.25rem + 0.75vi, 1.5rem);',
		'    --text-3xl: clamp(1.75rem, 1.5rem + 1vi, 1.875rem);',
		'    --text-4xl: clamp(2.125rem, 1.75rem + 1.5vi, 2.25rem);',
		'    --text-5xl: clamp(2.75rem, 2.25rem + 2vi, 3rem);',
		'',
		'    /* LINE HEIGHTS */',
		'    --leading-none: 1;',
		'    --leading-tight: 1.25;',
		'    --leading-snug: 1.375;',
		'    --leading-normal: 1.5;',
		'    --leading-relaxed: 1.625;',
		'    --leading-loose: 2;',
		'',
		'    /* FONT WEIGHTS */',
		'    --font-thin: 100;',
		'    --font-extralight: 200;',
		'    --font-light: 300;',
		'    --font-normal: 400;',
		'    --font-medium: 500;',
		'    --font-semibold: 600;',
		'    --font-bold: 700;',
		'    --font-extrabold: 800;',
		'    --font-black: 900;',
		'',
		'    /* LETTER SPACING */',
		'    --tracking-tighter: -0.05em;',
		'    --tracking-tight: -0.025em;',
		'    --tracking-normal: 0;',
		'    --tracking-wide: 0.025em;',
		'    --tracking-wider: 0.05em;',
		'    --tracking-widest: 0.1em;',
	];
}

function generateTransitionTokens(): string[] {
	return [
		'',
		'    /* TRANSITIONS */',
		'    --duration-75: 75ms;',
		'    --duration-100: 100ms;',
		'    --duration-150: 150ms;',
		'    --duration-200: 200ms;',
		'    --duration-300: 300ms;',
		'    --duration-500: 500ms;',
		'    --duration-700: 700ms;',
		'    --duration-1000: 1000ms;',
		'',
		'    /* EASING */',
		'    --ease-linear: linear;',
		'    --ease-in: cubic-bezier(0.4, 0, 1, 1);',
		'    --ease-out: cubic-bezier(0, 0, 0.2, 1);',
		'    --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);',
		'    --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);',
	];
}

function generateShadowTokens(): string[] {
	return [
		'',
		'    /* SHADOWS */',
		'    --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);',
		'    --shadow-base: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);',
		'    --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);',
		'    --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);',
		'    --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);',
		'    --shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);',
		'    --shadow-inner: inset 0 2px 4px 0 rgb(0 0 0 / 0.05);',
		'    --shadow-none: 0 0 #0000;',
	];
}

function generateTokensCSS(): string {
	const colors = loadJson<ColorTokens>('colors.json');
	const semantic = loadJson<SemanticTokens>('semantic.json');
	const spacing = loadJson<SpacingTokens>('spacing.json');

	const lines: string[] = [
		'/**',
		' * Shift CSS - Design Tokens',
		' * Auto-generated from tokens/*.json',
		' * DO NOT EDIT DIRECTLY',
		' */',
		'',
		'@layer shift.tokens {',
		'  :root {',
		'    color-scheme: light dark;',
		'',
	];

	// Seed hue customization points
	lines.push(...generateSeedHueVariables(colors.color.seed));

	// Generate color scales for each seed
	const colorScales = ['primary', 'secondary', 'accent', 'success', 'warning', 'danger'];

	for (const scale of colorScales) {
		lines.push(
			...generateColorScale(scale, scale, colors.color.lightness, colors.color.chroma.vivid)
		);
	}

	// Generate neutral scale (brand-tinted grays)
	lines.push(
		...generateColorScale(
			'neutral',
			'neutral',
			colors.color.lightness,
			colors.color.chroma.neutral,
			true
		)
	);

	// Semantic tokens
	lines.push(...generateSemanticTokens(semantic.semantic));

	// Spacing tokens
	lines.push(...generateSpacingTokens(spacing));

	// Typography tokens
	lines.push(...generateTypographyTokens());

	// Transition tokens
	lines.push(...generateTransitionTokens());

	// Shadow tokens
	lines.push(...generateShadowTokens());

	lines.push('  }', '}', '');

	return lines.join('\n');
}

function main(): void {
	console.log('Generating Shift CSS tokens...');

	// Ensure output directory exists
	mkdirSync(OUTPUT_DIR, { recursive: true });

	// Generate tokens CSS
	const css = generateTokensCSS();
	const outputPath = join(OUTPUT_DIR, 'tokens.css');
	writeFileSync(outputPath, css, 'utf-8');

	console.log(`✓ Generated ${outputPath}`);
	console.log('Token generation complete!');
}

main();
