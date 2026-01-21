/**
 * Code Generator
 * Creates shift.config.json and scaffolds stylesheets
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import {
	type ArchitectureMode,
	DEFAULT_CONFIG,
	type DetectedFramework,
	type ShiftConfig,
} from '../types.ts';

/** Shift CSS layer order */
const SHIFT_LAYERS = 'shift.tokens, shift.base, shift.components, shift.utilities';

/**
 * Generate the layer order declaration based on architecture mode
 */
export function generateLayerOrder(mode: ArchitectureMode): string {
	if (mode === 'hybrid') {
		return `@layer legacy, ${SHIFT_LAYERS};`;
	}
	return `@layer ${SHIFT_LAYERS};`;
}

/**
 * Generate config file content
 */
export function generateConfig(options: Partial<ShiftConfig> = {}): ShiftConfig {
	return {
		...DEFAULT_CONFIG,
		...options,
		hues: {
			...DEFAULT_CONFIG.hues,
			...options.hues,
		},
		paths: {
			...DEFAULT_CONFIG.paths,
			...options.paths,
		},
	};
}

/**
 * Generate stylesheet content based on architecture mode
 */
export function generateStylesheet(
	mode: ArchitectureMode,
	detectedFrameworks: DetectedFramework[] = []
): string {
	const lines: string[] = [];

	// Header comment
	lines.push('/**');
	lines.push(' * Shift CSS Entry Point');
	lines.push(' * Initialized by shift-css init');
	lines.push(' *');
	if (mode === 'hybrid') {
		lines.push(' * Layer order (lowest → highest specificity):');
		lines.push(' * 1. legacy           - Your existing frameworks');
		lines.push(' * 2. shift.tokens     - Design tokens (colors, spacing, typography)');
		lines.push(' * 3. shift.base       - Reset and base styles');
		lines.push(' * 4. shift.components - UI components');
		lines.push(' * 5. shift.utilities  - Utility classes');
		lines.push(' * 6. (unlayered)      - Your custom overrides (highest specificity)');
	} else {
		lines.push(' * Layer order (lowest → highest specificity):');
		lines.push(' * 1. shift.tokens     - Design tokens (colors, spacing, typography)');
		lines.push(' * 2. shift.base       - Reset and base styles');
		lines.push(' * 3. shift.components - UI components');
		lines.push(' * 4. shift.utilities  - Utility classes');
		lines.push(' * 5. (unlayered)      - Your custom overrides (highest specificity)');
	}
	lines.push(' */');
	lines.push('');

	// Layer order declaration
	lines.push(generateLayerOrder(mode));
	lines.push('');

	// Shift CSS imports
	lines.push('@import "@shift-css/core/tokens";');
	lines.push('@import "@shift-css/core/base";');
	lines.push('@import "@shift-css/core/components";');
	lines.push('@import "@shift-css/core/utilities";');
	lines.push('');

	// Legacy layer for hybrid mode
	if (mode === 'hybrid') {
		lines.push('/* Legacy framework imports - add your existing CSS here */');
		lines.push('@layer legacy {');

		if (detectedFrameworks.length > 0) {
			for (const fw of detectedFrameworks) {
				lines.push(`  /* @import "${fw.file.relativePath}"; */`);
			}
		} else {
			lines.push('  /* @import "your-existing-framework.css"; */');
		}

		lines.push('}');
		lines.push('');
	}

	// Custom styles section
	lines.push('/* Your custom styles below */');
	lines.push('');

	return lines.join('\n');
}

/**
 * Write config file to disk
 */
export async function writeConfig(rootDir: string, config: ShiftConfig): Promise<string> {
	const configPath = join(rootDir, 'shift.config.json');
	const content = JSON.stringify(config, null, '\t');
	await writeFile(configPath, `${content}\n`, 'utf-8');
	return configPath;
}

/**
 * Write stylesheet to disk
 */
export async function writeStylesheet(
	rootDir: string,
	relativePath: string,
	content: string
): Promise<string> {
	const fullPath = join(rootDir, relativePath);
	const dir = dirname(fullPath);

	// Create directory if it doesn't exist
	await mkdir(dir, { recursive: true });
	await writeFile(fullPath, content, 'utf-8');

	return fullPath;
}

/**
 * Check if config file already exists
 */
export async function configExists(rootDir: string): Promise<boolean> {
	try {
		await readFile(join(rootDir, 'shift.config.json'), 'utf-8');
		return true;
	} catch {
		return false;
	}
}

/**
 * Read existing config file
 */
export async function readConfig(rootDir: string): Promise<ShiftConfig | null> {
	try {
		const content = await readFile(join(rootDir, 'shift.config.json'), 'utf-8');
		return JSON.parse(content) as ShiftConfig;
	} catch {
		return null;
	}
}

/**
 * Check if stylesheet already exists
 */
export async function stylesheetExists(rootDir: string, relativePath: string): Promise<boolean> {
	try {
		await readFile(join(rootDir, relativePath), 'utf-8');
		return true;
	} catch {
		return false;
	}
}
