/**
 * Shift CSS - Build Script
 *
 * Orchestrates the complete build process:
 * 1. Generate tokens from JSON definitions
 * 2. Bundle CSS layers with Lightning CSS
 * 3. Minify for production
 */

import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, watch, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { browserslistToTargets, bundle } from 'lightningcss';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, '..');
const SRC_DIR = join(ROOT_DIR, 'src');
const DIST_DIR = join(ROOT_DIR, 'dist');

// Browser targets for cutting-edge 2025 support
// Chrome 131+, Firefox 133+, Safari 18+
const targets = browserslistToTargets(['Chrome >= 131', 'Firefox >= 133', 'Safari >= 18']);

interface BuildOptions {
	watch?: boolean;
	minify?: boolean;
}

function generateTokens(): void {
	console.log('📦 Generating tokens...');

	// Run the token generator as a subprocess
	execSync('tsx scripts/generate-colors.ts', {
		cwd: ROOT_DIR,
		stdio: 'inherit',
	});
}

function bundleCSS(entryPath: string, outputPath: string, minify: boolean = false): void {
	const filename = minify ? 'shift.min.css' : 'shift.css';
	console.log(`📦 Bundling ${filename}...`);

	try {
		const result = bundle({
			filename: entryPath,
			minify,
			sourceMap: !minify,
			targets,
			drafts: {
				customMedia: true,
			},
			// Enable all modern CSS features
			nonStandard: {
				deepSelectorCombinator: true,
			},
		});

		writeFileSync(outputPath, result.code);

		if (result.map && !minify) {
			writeFileSync(`${outputPath}.map`, result.map);
		}

		const size = result.code.length;
		const sizeKB = (size / 1024).toFixed(2);
		console.log(`✓ ${filename} (${sizeKB} KB)`);
	} catch (error) {
		console.error(`✗ Error bundling ${filename}:`, error);
		throw error;
	}
}

function buildIndividualLayers(): void {
	console.log('📦 Building individual layers...');

	// Base layers
	const layers = [
		{ name: 'reset', path: 'base/reset.css' },
		{ name: 'tokens', path: 'tokens/tokens.css' },
	];

	// Components (for modular imports)
	const components = [
		{ name: 'badge', path: 'components/badge.css' },
		{ name: 'button', path: 'components/button.css' },
		{ name: 'card', path: 'components/card.css' },
		{ name: 'input', path: 'components/input.css' },
		{ name: 'modal', path: 'components/modal.css' },
		{ name: 'prose', path: 'components/prose.css' },
		{ name: 'skip-link', path: 'components/skip-link.css' },
		{ name: 'surface', path: 'components/surface.css' },
	];

	// Utils (for modular imports)
	const utils = [
		{ name: 'layout', path: 'utils/layout.css' },
		{ name: 'spacing', path: 'utils/spacing.css' },
		{ name: 'flex', path: 'utils/flex.css' },
		{ name: 'typography', path: 'utils/typography.css' },
		{ name: 'visibility', path: 'utils/visibility.css' },
	];

	// Create subdirectories
	mkdirSync(join(DIST_DIR, 'components'), { recursive: true });
	mkdirSync(join(DIST_DIR, 'utils'), { recursive: true });

	// Build all modules
	const allModules = [
		...layers.map((l) => ({ ...l, outputDir: '' })),
		...components.map((c) => ({ ...c, outputDir: 'components/' })),
		...utils.map((u) => ({ ...u, outputDir: 'utils/' })),
	];

	for (const module of allModules) {
		const inputPath = join(SRC_DIR, module.path);
		const outputPath = join(DIST_DIR, `${module.outputDir}${module.name}.css`);

		if (!existsSync(inputPath)) {
			console.log(`  ⚠ Skipping ${module.name} (file not found)`);
			continue;
		}

		try {
			const result = bundle({
				filename: inputPath,
				minify: false,
				sourceMap: false,
				targets,
			});

			writeFileSync(outputPath, result.code);
			const sizeKB = (result.code.length / 1024).toFixed(2);
			console.log(`  ✓ ${module.outputDir}${module.name}.css (${sizeKB} KB)`);
		} catch (error) {
			console.error(`  ✗ Error building ${module.name}:`, error);
		}
	}
}

function build(_options: BuildOptions = {}): void {
	const startTime = Date.now();
	console.log('\n🚀 Shift CSS Build\n');

	// Ensure dist directory exists
	mkdirSync(DIST_DIR, { recursive: true });

	// Step 1: Generate tokens
	generateTokens();

	// Step 2: Bundle main CSS
	const entryPath = join(SRC_DIR, 'index.css');

	if (!existsSync(entryPath)) {
		console.error(`✗ Entry file not found: ${entryPath}`);
		console.log('  Creating placeholder...');
		mkdirSync(SRC_DIR, { recursive: true });
		writeFileSync(entryPath, '/* Shift CSS Entry - layers will be imported here */\n');
	}

	// Bundle unminified version
	bundleCSS(entryPath, join(DIST_DIR, 'shift.css'), false);

	// Bundle minified version
	bundleCSS(entryPath, join(DIST_DIR, 'shift.min.css'), true);

	// Step 3: Build individual layers for subpath exports
	buildIndividualLayers();

	const duration = Date.now() - startTime;
	console.log(`\n✨ Build complete in ${duration}ms\n`);

	// Calculate total size
	const minifiedPath = join(DIST_DIR, 'shift.min.css');
	if (existsSync(minifiedPath)) {
		const content = readFileSync(minifiedPath);
		const gzipEstimate = Math.round(content.length * 0.25); // Rough gzip estimate
		console.log(`📊 Bundle size: ${(content.length / 1024).toFixed(2)} KB`);
		console.log(`📊 Estimated gzip: ~${(gzipEstimate / 1024).toFixed(2)} KB`);
	}
}

function watchMode(): void {
	console.log('👀 Watching for changes...\n');

	// Initial build
	build();

	// Watch src directory
	watch(SRC_DIR, { recursive: true }, (_event, filename) => {
		if (filename?.endsWith('.css')) {
			console.log(`\n🔄 ${filename} changed, rebuilding...`);
			build();
		}
	});

	// Watch tokens directory
	const tokensDir = join(ROOT_DIR, 'tokens');
	if (existsSync(tokensDir)) {
		watch(tokensDir, { recursive: true }, (_event, filename) => {
			if (filename?.endsWith('.json')) {
				console.log(`\n🔄 Token ${filename} changed, rebuilding...`);
				build();
			}
		});
	}

	// Keep process running
	process.on('SIGINT', () => {
		console.log('\n👋 Stopping watch mode...');
		process.exit(0);
	});
}

// CLI handling
const args = process.argv.slice(2);
const isWatch = args.includes('--watch') || args.includes('-w');

if (isWatch) {
	watchMode();
} else {
	build();
}
