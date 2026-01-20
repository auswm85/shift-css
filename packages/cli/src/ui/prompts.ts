/**
 * Interactive Prompts
 * User interaction using @clack/prompts
 */

import * as p from '@clack/prompts';
import pc from 'picocolors';
import { getColorName, hexToHue, isHexColor, PRESETS } from '../core/color.ts';
import type { ArchitectureMode, DetectedFramework } from '../types.ts';

/**
 * Show intro banner
 */
export function showIntro(): void {
	console.clear();
	p.intro(pc.bgMagenta(pc.white(' 🎨 Shift CSS Init ')));
}

/**
 * Show outro message
 */
export function showOutro(message: string): void {
	p.outro(message);
}

/**
 * Show cancel message and exit
 */
export function handleCancel(): never {
	p.cancel('Setup cancelled');
	process.exit(0);
}

/**
 * Create a spinner for async operations
 */
export function createSpinner(): ReturnType<typeof p.spinner> {
	return p.spinner();
}

/**
 * Show a note box
 */
export function showNote(message: string, title?: string): void {
	p.note(message, title);
}

/**
 * Ask for architecture mode
 */
export async function askArchitectureMode(
	detectedFrameworks: DetectedFramework[]
): Promise<ArchitectureMode> {
	const hasFrameworks = detectedFrameworks.length > 0;

	const frameworkHint = hasFrameworks
		? `Detected: ${detectedFrameworks.map((f) => f.type).join(', ')}`
		: undefined;

	const mode = await p.select({
		message: 'What type of project is this?',
		options: [
			{
				value: 'greenfield' as const,
				label: 'New project (Greenfield)',
				hint: 'Pure Shift CSS, no legacy frameworks',
			},
			{
				value: 'hybrid' as const,
				label: 'Existing project (Hybrid)',
				hint: frameworkHint ?? 'Shift CSS alongside existing CSS',
			},
		],
		initialValue: hasFrameworks ? ('hybrid' as const) : ('greenfield' as const),
	});

	if (p.isCancel(mode)) handleCancel();

	return mode as ArchitectureMode;
}

/**
 * Ask for primary seed hue with presets and hex input
 */
export async function askPrimaryHue(): Promise<number> {
	// Build options from presets + custom
	const presetOptions = PRESETS.map((preset) => ({
		value: preset.hue,
		label: preset.name,
		hint: preset.description,
	}));

	const hue = await p.select({
		message: 'Choose your brand color:',
		options: [
			...presetOptions,
			{ value: -1, label: 'Custom', hint: 'Enter hex code or hue value' },
		],
	});

	if (p.isCancel(hue)) handleCancel();

	if (hue === -1) {
		// Show cheat sheet
		p.log.info(pc.dim('Hue guide: 20=Red, 90=Yellow, 140=Green, 260=Blue, 320=Purple'));

		const customValue = await p.text({
			message: 'Enter a hex code (#a855f7) or hue (0-360):',
			placeholder: '#a855f7 or 260',
			validate: (value) => {
				const trimmed = value.trim();

				// Check if hex color
				if (isHexColor(trimmed)) {
					const parsedHue = hexToHue(trimmed);
					if (parsedHue === null) return 'Invalid hex color';
					return undefined;
				}

				// Check if number
				const num = Number.parseInt(trimmed, 10);
				if (Number.isNaN(num)) return 'Enter a hex code (#ff0000) or hue number (0-360)';
				if (num < 0 || num > 360) return 'Hue must be between 0 and 360';
				return undefined;
			},
		});

		if (p.isCancel(customValue)) handleCancel();

		const trimmed = (customValue as string).trim();

		// Convert hex to hue
		if (isHexColor(trimmed)) {
			const parsedHue = hexToHue(trimmed);
			if (parsedHue !== null) {
				const colorName = getColorName(parsedHue);
				p.log.success(
					`Converted ${pc.cyan(trimmed)} → ${pc.magenta(colorName)} (Hue: ${parsedHue})`
				);
				return parsedHue;
			}
		}

		// Parse as number
		return Number.parseInt(trimmed, 10);
	}

	// Show what preset was selected
	const preset = PRESETS.find((p) => p.hue === hue);
	if (preset) {
		const colorName = getColorName(preset.hue);
		p.log.info(`${pc.magenta(preset.name)} → ${colorName} (Hue: ${preset.hue})`);
	}

	return hue as number;
}

/**
 * Ask for stylesheet path
 */
export async function askStylesheetPath(defaultPath: string): Promise<string> {
	const path = await p.text({
		message: 'Where should the stylesheet be created?',
		placeholder: defaultPath,
		defaultValue: defaultPath,
		validate: (value) => {
			if (!value) return 'Please enter a path';
			if (!value.endsWith('.css')) return 'Path must end with .css';
			return undefined;
		},
	});

	if (p.isCancel(path)) handleCancel();

	return path as string;
}

/**
 * Confirm overwriting existing files
 */
export async function confirmOverwrite(filePath: string): Promise<boolean> {
	const confirmed = await p.confirm({
		message: `${pc.yellow(filePath)} already exists. Overwrite it?`,
		initialValue: false,
	});

	if (p.isCancel(confirmed)) handleCancel();

	return confirmed as boolean;
}

/**
 * Confirm project initialization
 */
export async function confirmInit(
	configPath: string,
	stylesheetPath: string,
	mode: ArchitectureMode
): Promise<boolean> {
	const modeLabel = mode === 'greenfield' ? 'Greenfield' : 'Hybrid';

	showNote(
		[
			`${pc.bold('Config:')}      ${pc.cyan(configPath)}`,
			`${pc.bold('Stylesheet:')}  ${pc.cyan(stylesheetPath)}`,
			`${pc.bold('Mode:')}        ${pc.cyan(modeLabel)}`,
		].join('\n'),
		'Files to create'
	);

	const confirmed = await p.confirm({
		message: 'Proceed with initialization?',
		initialValue: true,
	});

	if (p.isCancel(confirmed)) handleCancel();

	return confirmed as boolean;
}

/**
 * Show log message
 */
export function log(message: string): void {
	p.log.message(message);
}

/**
 * Show success log
 */
export function logSuccess(message: string): void {
	p.log.success(message);
}

/**
 * Show warning log
 */
export function logWarning(message: string): void {
	p.log.warn(message);
}

/**
 * Show error log
 */
export function logError(message: string): void {
	p.log.error(message);
}
