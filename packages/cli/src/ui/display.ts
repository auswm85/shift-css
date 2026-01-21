/**
 * Display Utilities
 * Colorful terminal output formatting
 */

import pc from 'picocolors';
import { getSignature } from '../core/detector.ts';
import type { DetectedFramework, InitResult } from '../types.ts';

/**
 * Format file size for display
 */
export function formatSize(bytes: number): string {
	if (bytes < 1024) return `${bytes} B`;
	const kb = bytes / 1024;
	if (kb < 1024) return `${kb.toFixed(1)} KB`;
	const mb = kb / 1024;
	return `${mb.toFixed(1)} MB`;
}

/**
 * Display detected frameworks in a nice list
 */
export function showDetectedFrameworks(frameworks: DetectedFramework[]): void {
	console.log('');
	console.log(pc.bold('  Detected CSS Files:'));
	console.log('');

	for (const fw of frameworks) {
		const sig = getSignature(fw.type);
		const icon = sig?.icon ?? '📄';
		const name = sig?.displayName ?? fw.type;
		const size = formatSize(fw.file.size);
		const confidence = fw.confidence === 'high' ? '' : pc.dim(` (${fw.confidence} confidence)`);

		console.log(`  ${icon}  ${pc.cyan(fw.file.relativePath)}`);
		console.log(`      ${pc.dim(name)} · ${pc.dim(size)}${confidence}`);
		console.log('');
	}
}

/**
 * Display stylesheet preview
 */
export function showStylesheetPreview(content: string): void {
	console.log('');
	console.log(pc.bold('  Stylesheet Preview:'));
	console.log('');
	console.log(pc.dim('  ─'.repeat(40)));
	console.log('');

	const lines = content.split('\n');
	const maxLines = 25;
	const displayLines = lines.slice(0, maxLines);

	for (const line of displayLines) {
		if (line.startsWith('/**') || line.startsWith(' *') || line.startsWith(' */')) {
			console.log(`  ${pc.dim(line)}`);
		} else if (line.startsWith('@layer') || line.startsWith('@import')) {
			console.log(`  ${pc.cyan(line)}`);
		} else if (line.includes('/*') && line.includes('*/')) {
			console.log(`  ${pc.dim(line)}`);
		} else {
			console.log(`  ${line}`);
		}
	}

	if (lines.length > maxLines) {
		console.log(`  ${pc.dim(`... ${lines.length - maxLines} more lines`)}`);
	}

	console.log('');
	console.log(pc.dim('  ─'.repeat(40)));
	console.log('');
}

/**
 * Display a boxed code snippet for copying
 */
export function showCopySnippet(code: string): void {
	console.log('');
	console.log(pc.bold('  Copy this code to your CSS file:'));
	console.log('');
	console.log(pc.dim('  ─'.repeat(40)));
	console.log('');

	for (const line of code.split('\n')) {
		console.log(`  ${pc.cyan(line)}`);
	}

	console.log('');
	console.log(pc.dim('  ─'.repeat(40)));
	console.log('');
}

/**
 * Display success message
 */
export function showSuccess(message: string): void {
	console.log(`  ${pc.green('✓')} ${message}`);
}

/**
 * Display warning message
 */
export function showWarning(message: string): void {
	console.log(`  ${pc.yellow('⚠')} ${message}`);
}

/**
 * Display error message
 */
export function showError(message: string): void {
	console.log(`  ${pc.red('✗')} ${message}`);
}

/**
 * Display info message
 */
export function showInfo(message: string): void {
	console.log(`  ${pc.blue('ℹ')} ${message}`);
}

/**
 * Display next steps after completion
 */
export function showNextSteps(result: InitResult): void {
	console.log('');
	console.log(pc.bold('  Next steps:'));
	console.log('');

	// Step 1: Install
	console.log(`  1. ${pc.cyan('npm install @shift-css/core')}`);

	// Step 2: Import the stylesheet
	console.log(`  2. Import ${pc.cyan(result.stylesheetPath.split('/').pop())} in your app`);

	// Step 3: Mode-specific guidance
	if (result.mode === 'hybrid' && result.detectedFrameworks?.length) {
		console.log(`  3. Uncomment your framework imports in the @layer legacy block`);
		console.log(`  4. Start using Shift CSS components alongside your existing code`);
	} else {
		console.log(`  3. Start using Shift CSS components and utilities`);
	}

	console.log('');
	console.log(pc.dim(`  📚 Documentation: https://getshiftcss.com`));
	console.log('');
}
