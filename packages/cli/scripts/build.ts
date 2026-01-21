/**
 * Shift CSS CLI - Build Script
 *
 * Bundles the CLI for distribution using Bun
 */

import { chmodSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, '..');
const SRC_DIR = join(ROOT_DIR, 'src');
const DIST_DIR = join(ROOT_DIR, 'dist');

async function build(): Promise<void> {
	const startTime = Date.now();
	console.log('\n🚀 Shift CSS CLI Build\n');

	// Ensure dist directory exists
	if (!existsSync(DIST_DIR)) {
		mkdirSync(DIST_DIR, { recursive: true });
	}

	const entrypoint = join(SRC_DIR, 'index.ts');

	if (!existsSync(entrypoint)) {
		console.error('✗ Entry file not found:', entrypoint);
		process.exit(1);
	}

	console.log('📦 Bundling CLI...');

	try {
		const result = await Bun.build({
			entrypoints: [entrypoint],
			outdir: DIST_DIR,
			target: 'node',
			format: 'esm',
			minify: false,
			sourcemap: 'external',
			external: ['@clack/prompts', 'picocolors'],
		});

		if (!result.success) {
			console.error('✗ Build failed:');
			for (const log of result.logs) {
				console.error(log);
			}
			process.exit(1);
		}

		// Make the output executable
		const outputPath = join(DIST_DIR, 'index.js');
		chmodSync(outputPath, 0o755);

		const duration = Date.now() - startTime;
		console.log(`✓ Built to dist/index.js`);
		console.log(`\n✨ Build complete in ${duration}ms\n`);
	} catch (error) {
		console.error('✗ Build error:', error);
		process.exit(1);
	}
}

build();
