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
import { initCommand } from './commands/init.ts';

const VERSION = '0.0.1';

function showHelp(): void {
	console.log(`
${pc.bold('Shift CSS CLI')} ${pc.dim(`v${VERSION}`)}

${pc.dim('Usage:')}
  ${pc.cyan('shift-css')} ${pc.green('<command>')} ${pc.dim('[options]')}

${pc.dim('Commands:')}
  ${pc.green('init')}     Set up Shift CSS in your project
           Detects existing frameworks and wraps them in @layer legacy

${pc.dim('Options:')}
  ${pc.yellow('--help, -h')}     Show this help message
  ${pc.yellow('--version, -v')}  Show version number

${pc.dim('Examples:')}
  ${pc.cyan('npx shift-css init')}
  ${pc.cyan('npx shift-css --help')}

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
