/**
 * Add Command
 * Eject component source files into the user's project
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import * as p from '@clack/prompts';
import pc from 'picocolors';
import {
	componentExists,
	getAvailableComponents,
	getComponent,
	getComponentsWithDependencies,
	resolveComponent,
} from '../core/registry.ts';
import { transformForEjection } from '../core/transformer.ts';
import type { AddConfig } from '../types.ts';
import { createSpinner, handleCancel, showNote, showOutro } from '../ui/prompts.ts';

/**
 * Default configuration for add command
 */
const DEFAULT_ADD_CONFIG: AddConfig = {
	stylesDir: 'src/styles/components',
	componentsDir: 'src/components/ui',
	layer: 'components',
	framework: undefined,
};

/**
 * Load add configuration from shift.config.json or use defaults
 */
async function loadAddConfig(rootDir: string): Promise<AddConfig> {
	try {
		const configPath = join(rootDir, 'shift.config.json');
		const content = await readFile(configPath, 'utf-8');
		const config = JSON.parse(content);

		return {
			stylesDir: config.add?.stylesDir ?? DEFAULT_ADD_CONFIG.stylesDir,
			componentsDir: config.add?.componentsDir ?? DEFAULT_ADD_CONFIG.componentsDir,
			layer: config.add?.layer ?? DEFAULT_ADD_CONFIG.layer,
			framework: config.add?.framework ?? DEFAULT_ADD_CONFIG.framework,
		};
	} catch {
		return DEFAULT_ADD_CONFIG;
	}
}

/**
 * Check if a file exists
 */
async function fileExists(path: string): Promise<boolean> {
	try {
		await readFile(path, 'utf-8');
		return true;
	} catch {
		return false;
	}
}

/**
 * Write file with directory creation
 */
async function writeFileWithDir(path: string, content: string): Promise<void> {
	await mkdir(dirname(path), { recursive: true });
	await writeFile(path, content, 'utf-8');
}

/**
 * Show interactive component selection
 */
async function selectComponents(): Promise<string[]> {
	const available = await getAvailableComponents();

	const selected = await p.multiselect({
		message: 'Which components would you like to add?',
		options: available.map((name) => ({
			value: name,
			label: name,
		})),
		required: true,
	});

	if (p.isCancel(selected)) handleCancel();

	return selected as string[];
}

/**
 * Confirm adding components with dependencies
 */
async function confirmComponentsWithDeps(
	requested: string[],
	withDeps: string[]
): Promise<boolean> {
	const deps = withDeps.filter((c) => !requested.includes(c));

	if (deps.length === 0) {
		return true;
	}

	p.log.info(
		`${pc.cyan(deps.join(', '))} ${deps.length === 1 ? 'is' : 'are'} required as ${deps.length === 1 ? 'a dependency' : 'dependencies'}.`
	);

	const confirmed = await p.confirm({
		message: `Add ${deps.length === 1 ? 'this dependency' : 'these dependencies'} as well?`,
		initialValue: true,
	});

	if (p.isCancel(confirmed)) handleCancel();

	return confirmed as boolean;
}

/**
 * Confirm overwriting existing files
 */
async function confirmOverwrite(files: string[]): Promise<boolean> {
	showNote(files.map((f) => pc.yellow(f)).join('\n'), 'Files that will be overwritten');

	const confirmed = await p.confirm({
		message: 'These files already exist. Overwrite them?',
		initialValue: false,
	});

	if (p.isCancel(confirmed)) handleCancel();

	return confirmed as boolean;
}

/**
 * Format component name for display (capitalize first letter)
 */
function formatComponentName(name: string): string {
	return name.charAt(0).toUpperCase() + name.slice(1);
}

/**
 * Show success summary
 */
function showSuccessSummary(components: string[], config: AddConfig, createdFiles: string[]): void {
	const cssFiles = createdFiles.filter((f) => f.endsWith('.css'));

	const lines = [
		'',
		pc.bold('Import in your styles:'),
		...cssFiles.map((f) => pc.cyan(`@import './${f.split('/').pop()}';`)),
	];

	if (components.length > 0) {
		const firstComponent = components[0] as string;
		const component = formatComponentName(firstComponent);

		lines.push('');
		lines.push(pc.bold('Use in your template:'));

		if (
			config.framework === 'astro' ||
			config.framework === 'react' ||
			config.framework === 'vue'
		) {
			lines.push(pc.cyan(`<${component} variant="primary">Click me</${component}>`));
		} else {
			// HTML attribute API
			if (firstComponent === 'button') {
				lines.push(pc.cyan('<button s-btn="primary">Click me</button>'));
			} else if (firstComponent === 'card') {
				lines.push(pc.cyan('<article s-card>Card content</article>'));
			} else if (firstComponent === 'input') {
				lines.push(pc.cyan('<input s-input type="text" placeholder="Enter text">'));
			} else if (firstComponent === 'surface') {
				lines.push(pc.cyan('<section s-surface="raised">Content</section>'));
			} else {
				lines.push(pc.cyan(`<element s-${firstComponent}>Content</element>`));
			}
		}
	}

	showNote(
		lines.join('\n'),
		`${components.length === 1 ? 'Component' : 'Components'} added successfully!`
	);
}

/**
 * Main add command
 */
export async function addCommand(
	componentNames: string[],
	options: { all?: boolean; force?: boolean; framework?: string } = {}
): Promise<void> {
	const rootDir = process.cwd();

	// Load configuration
	const config = await loadAddConfig(rootDir);

	// Override framework from options
	if (options.framework) {
		config.framework = options.framework as AddConfig['framework'];
	}

	p.intro(pc.bgCyan(pc.white(' 📦 Shift CSS Add ')));

	// Determine which components to add
	let requestedComponents: string[];

	if (options.all) {
		requestedComponents = await getAvailableComponents();
		p.log.info(`Adding all ${requestedComponents.length} components...`);
	} else if (componentNames.length === 0) {
		// Interactive selection
		requestedComponents = await selectComponents();
	} else {
		requestedComponents = componentNames;
	}

	// Validate component names
	const spinner = createSpinner();
	spinner.start('Validating components...');

	const invalidComponents: string[] = [];
	for (const name of requestedComponents) {
		if (!(await componentExists(name))) {
			invalidComponents.push(name);
		}
	}

	if (invalidComponents.length > 0) {
		spinner.stop('Validation failed');
		const available = await getAvailableComponents();
		p.log.error(
			`Unknown component${invalidComponents.length > 1 ? 's' : ''}: ${pc.red(invalidComponents.join(', '))}`
		);
		p.log.info(`Available components: ${pc.cyan(available.join(', '))}`);
		showOutro(pc.red('Add cancelled'));
		return;
	}

	spinner.stop('Components validated');

	// Resolve dependencies
	spinner.start('Resolving dependencies...');
	const componentsWithDeps = await getComponentsWithDependencies(requestedComponents);
	spinner.stop(
		`Resolved ${componentsWithDeps.length} component${componentsWithDeps.length === 1 ? '' : 's'}`
	);

	// Confirm dependencies if any were added
	if (componentsWithDeps.length > requestedComponents.length) {
		const proceed = await confirmComponentsWithDeps(requestedComponents, componentsWithDeps);
		if (!proceed) {
			showOutro(pc.yellow('Add cancelled'));
			return;
		}
	}

	// Check for existing files
	const filesToCreate: {
		component: string;
		cssPath: string;
		templatePath?: string;
	}[] = [];
	const existingFiles: string[] = [];

	// Check if framework is supported
	const templateExtension = config.framework ? getTemplateExtension(config.framework) : null;
	if (config.framework && !templateExtension) {
		p.log.warn(
			pc.yellow(`Framework "${config.framework}" is not supported. Only CSS files will be created.`)
		);
	}

	for (const name of componentsWithDeps) {
		const cssPath = join(rootDir, config.stylesDir, `${name}.css`);
		const templatePath = templateExtension
			? join(rootDir, config.componentsDir, `${formatComponentName(name)}.${templateExtension}`)
			: undefined;

		filesToCreate.push({ component: name, cssPath, templatePath });

		if (await fileExists(cssPath)) {
			existingFiles.push(cssPath.replace(`${rootDir}/`, ''));
		}
		if (templatePath && (await fileExists(templatePath))) {
			existingFiles.push(templatePath.replace(`${rootDir}/`, ''));
		}
	}

	// Confirm overwrite if needed
	if (existingFiles.length > 0 && !options.force) {
		const proceed = await confirmOverwrite(existingFiles);
		if (!proceed) {
			showOutro(pc.yellow('Add cancelled'));
			return;
		}
	}

	// Create files
	spinner.start('Creating files...');
	const createdFiles: string[] = [];
	const missingTemplates: string[] = [];

	for (const { component, cssPath, templatePath } of filesToCreate) {
		const resolved = await resolveComponent(component, config.framework);
		if (!resolved) continue;

		// Transform and write CSS
		const transformedCss = transformForEjection(resolved.cssContent, {
			layer: config.layer,
			componentName: component,
		});
		await writeFileWithDir(cssPath, transformedCss);
		createdFiles.push(cssPath.replace(`${rootDir}/`, ''));

		// Write template if available
		if (templatePath && resolved.templateContent) {
			await writeFileWithDir(templatePath, resolved.templateContent);
			createdFiles.push(templatePath.replace(`${rootDir}/`, ''));
		} else if (templatePath && !resolved.templateContent) {
			missingTemplates.push(component);
		}
	}

	spinner.stop('Files created');

	// Warn about missing templates
	if (missingTemplates.length > 0 && config.framework) {
		p.log.warn(
			pc.yellow(
				`${config.framework} templates not available for: ${missingTemplates.join(', ')}. Only CSS files were created.`
			)
		);
	}

	// Show created files
	for (const file of createdFiles) {
		p.log.success(`Created ${pc.cyan(file)}`);
	}

	// Show customization hints
	if (componentsWithDeps.length > 0) {
		const firstComponent = await getComponent(componentsWithDeps[0] as string);
		if (firstComponent?.customizationPoints.length) {
			p.log.info(
				`${pc.dim('Customize via CSS variables:')} ${pc.cyan(firstComponent.customizationPoints.join(', '))}`
			);
		}
	}

	// Show success summary
	showSuccessSummary(componentsWithDeps, config, createdFiles);

	showOutro(pc.green('✨ Components added!'));
}

/**
 * Get file extension for a framework template
 */
function getTemplateExtension(framework: string): string | null {
	switch (framework) {
		case 'astro':
			return 'astro';
		case 'react':
			return 'tsx';
		case 'vue':
			return 'vue';
		default:
			return null;
	}
}

/**
 * List available components
 */
export async function listComponents(): Promise<void> {
	const available = await getAvailableComponents();

	p.intro(pc.bgCyan(pc.white(' 📦 Shift CSS Components ')));

	const lines = available.map((name) => `  ${pc.cyan(name)}`);
	showNote(lines.join('\n'), 'Available components');

	p.outro(pc.dim(`Run ${pc.cyan('shift-css add <component>')} to add a component`));
}
