#!/usr/bin/env node
/**
 * Shift CSS CLI
 *
 * A "Guided Hand" CLI tool that helps set up CSS layer compatibility
 *
 * Usage:
 *   npx shift-css init    - Initialize Shift CSS in your project
 *   npx shift-css --help  - Show help
 */

import pc from 'picocolors';
import pkg from '../package.json' with { type: 'json' };
import { addCommand, listComponents } from './commands/add.ts';
import { initCommand } from './commands/init.ts';
import { typesCommand } from './commands/types.ts';

const VERSION = pkg.version;

function showHelp(): void {
	console.log(`
${pc.bold('Shift CSS CLI')} ${pc.dim(`v${VERSION}`)}

${pc.dim('Usage:')}
  ${pc.cyan('shift-css')} ${pc.green('<command>')} ${pc.dim('[options]')}

${pc.dim('Commands:')}
  ${pc.green('init')}     Set up Shift CSS in your project
           Detects existing frameworks and wraps them in @layer legacy
  ${pc.green('add')}      Add components to your project (shadcn-style ejection)
           Copies component CSS wrapped in @layer for customization
  ${pc.green('types')}    Generate TypeScript definitions for Shift CSS attributes
           Detects React/Vue/Svelte and shows setup instructions

${pc.dim('Options:')}
  ${pc.yellow('--help, -h')}     Show this help message
  ${pc.yellow('--version, -v')}  Show version number

${pc.dim('Add Options:')}
  ${pc.yellow('--all')}          Add all available components
  ${pc.yellow('--force')}        Overwrite existing files without prompting
  ${pc.yellow('--framework')}    Framework for templates (astro, react, vue)

${pc.dim('Examples:')}
  ${pc.cyan('npx shift-css init')}
  ${pc.cyan('npx shift-css add button card')}
  ${pc.cyan('npx shift-css add --all')}
  ${pc.cyan('npx shift-css types --react -o shift.d.ts')}

${pc.dim('Learn more:')} ${pc.underline('https://getshiftcss.com')}
`);
}

function showVersion(): void {
	console.log(`shift-css v${VERSION}`);
}

async function main(): Promise<void> {
	const args = process.argv.slice(2);
	const command = args[0];

	// Handle flags
	if (command === '--help' || command === '-h') {
		showHelp();
		return;
	}

	if (command === '--version' || command === '-v') {
		showVersion();
		return;
	}

	// Handle commands
	if (command === 'init' || !command) {
		await initCommand();
		return;
	}

	if (command === 'add') {
		// Parse options for add command
		const addOptions: { all?: boolean; force?: boolean; framework?: string } = {};
		const componentNames: string[] = [];

		for (let i = 1; i < args.length; i++) {
			const arg = args[i] as string;
			if (arg === '--all') {
				addOptions.all = true;
			} else if (arg === '--force' || arg === '-f') {
				addOptions.force = true;
			} else if (arg === '--framework' && args[i + 1]) {
				addOptions.framework = args[++i];
			} else if (arg.startsWith('--framework=')) {
				addOptions.framework = arg.slice('--framework='.length);
			} else if (arg === '--list' || arg === '-l') {
				await listComponents();
				return;
			} else if (!arg.startsWith('-')) {
				componentNames.push(arg);
			}
		}

		await addCommand(componentNames, addOptions);
		return;
	}

	if (command === 'types') {
		// Parse options for types command
		const options: { framework?: 'react' | 'vue' | 'svelte'; output?: string } = {};

		for (let i = 1; i < args.length; i++) {
			const arg = args[i] as string;
			if (arg === '--react') {
				options.framework = 'react';
			} else if (arg === '--vue') {
				options.framework = 'vue';
			} else if (arg === '--svelte') {
				options.framework = 'svelte';
			} else if ((arg === '-o' || arg === '--output') && args[i + 1]) {
				options.output = args[++i];
			} else if (arg.startsWith('--output=')) {
				options.output = arg.slice('--output='.length);
			}
		}

		await typesCommand(options);
		return;
	}

	// Unknown command
	console.error(pc.red(`Unknown command: ${command}`));
	console.log(pc.dim(`Run ${pc.cyan('shift-css --help')} for usage information.`));
	process.exit(1);
}

main().catch((error: Error) => {
	console.error(pc.red('Error:'), error.message);
	if (process.env.DEBUG) {
		console.error(error.stack);
	}
	process.exit(1);
});
