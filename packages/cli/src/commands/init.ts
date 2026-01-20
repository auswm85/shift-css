/**
 * Init Command
 * Initialize Shift CSS in a project
 */

import pc from 'picocolors';
import { detectFrameworks } from '../core/detector.ts';
import {
	configExists,
	generateConfig,
	generateStylesheet,
	stylesheetExists,
	writeConfig,
	writeStylesheet,
} from '../core/generator.ts';
import { scanForCssFiles } from '../core/scanner.ts';
import { DEFAULT_CONFIG, type InitResult } from '../types.ts';
import { showNextSteps, showStylesheetPreview } from '../ui/display.ts';
import {
	askArchitectureMode,
	askPrimaryHue,
	askStylesheetPath,
	confirmInit,
	confirmOverwrite,
	createSpinner,
	logSuccess,
	logWarning,
	showIntro,
	showOutro,
} from '../ui/prompts.ts';

/**
 * Main init command
 */
export async function initCommand(): Promise<void> {
	const rootDir = process.cwd();

	showIntro();

	// Check if already initialized
	const hasConfig = await configExists(rootDir);
	if (hasConfig) {
		logWarning('This project already has a shift.config.json');
		const shouldOverwrite = await confirmOverwrite('shift.config.json');
		if (!shouldOverwrite) {
			showOutro(pc.yellow('Initialization cancelled'));
			return;
		}
	}

	// Step 1: Scan for existing CSS frameworks (silent, for detection)
	const spinner = createSpinner();
	spinner.start('Scanning project...');

	const cssFiles = await scanForCssFiles(rootDir);
	const detectedFrameworks = await detectFrameworks(cssFiles);

	if (detectedFrameworks.length > 0) {
		spinner.stop(`Detected existing CSS: ${detectedFrameworks.map((f) => f.type).join(', ')}`);
	} else {
		spinner.stop('Project scanned');
	}

	// Step 2: Ask for architecture mode
	const mode = await askArchitectureMode(detectedFrameworks);

	// Step 3: Ask for primary hue
	const primaryHue = await askPrimaryHue();

	// Step 4: Ask for stylesheet path
	const defaultStylesheetPath = DEFAULT_CONFIG.paths.stylesheet;
	const stylesheetPath = await askStylesheetPath(defaultStylesheetPath);

	// Check if stylesheet already exists
	const hasStylesheet = await stylesheetExists(rootDir, stylesheetPath);
	if (hasStylesheet) {
		const shouldOverwrite = await confirmOverwrite(stylesheetPath);
		if (!shouldOverwrite) {
			showOutro(pc.yellow('Initialization cancelled'));
			return;
		}
	}

	// Step 5: Preview what will be created
	const stylesheetContent = generateStylesheet(mode, detectedFrameworks);
	showStylesheetPreview(stylesheetContent);

	// Step 6: Confirm and create files
	const shouldProceed = await confirmInit('shift.config.json', stylesheetPath, mode);

	if (!shouldProceed) {
		showOutro(pc.yellow('Initialization cancelled'));
		return;
	}

	// Create config
	const config = generateConfig({
		mode,
		hues: {
			primary: primaryHue,
			secondary: DEFAULT_CONFIG.hues.secondary,
			accent: DEFAULT_CONFIG.hues.accent,
			neutral: primaryHue, // Match neutral to primary for cohesion
		},
		paths: {
			stylesheet: stylesheetPath,
		},
	});

	spinner.start('Creating files...');

	const configPath = await writeConfig(rootDir, config);
	const fullStylesheetPath = await writeStylesheet(rootDir, stylesheetPath, stylesheetContent);

	spinner.stop('Files created');

	// Success!
	logSuccess(`Created ${pc.cyan('shift.config.json')}`);
	logSuccess(`Created ${pc.cyan(stylesheetPath)}`);

	const result: InitResult = {
		configPath,
		stylesheetPath: fullStylesheetPath,
		mode,
		detectedFrameworks: detectedFrameworks.length > 0 ? detectedFrameworks : undefined,
	};

	// Show next steps based on mode
	showNextSteps(result);

	showOutro(pc.green('✨ Shift CSS initialized!'));
}
