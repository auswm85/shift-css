/**
 * File System Scanner
 * Discovers CSS files in a project
 */

import { readdir, stat } from 'node:fs/promises';
import { basename, join, relative } from 'node:path';
import type { CssFile } from '../types.ts';

/** Directories to skip during scanning */
const IGNORED_DIRS = new Set([
	'node_modules',
	'.git',
	'.svn',
	'.hg',
	'dist',
	'build',
	'coverage',
	'.next',
	'.nuxt',
	'.output',
	'.vercel',
	'.shift-backup',
]);

/** Entry point file names in priority order */
const ENTRY_POINT_NAMES = [
	'main.css',
	'styles.css',
	'style.css',
	'index.css',
	'app.css',
	'global.css',
	'globals.css',
];

/** Entry point directories in priority order */
const ENTRY_POINT_DIRS = ['src', 'styles', 'css', 'assets/css', 'public/css', ''];

/**
 * Recursively scan directory for CSS files
 */
async function scanDirectory(dir: string, rootDir: string, files: CssFile[]): Promise<void> {
	const entries = await readdir(dir, { withFileTypes: true });

	for (const entry of entries) {
		const fullPath = join(dir, entry.name);

		if (entry.isDirectory()) {
			if (!IGNORED_DIRS.has(entry.name)) {
				await scanDirectory(fullPath, rootDir, files);
			}
		} else if (entry.isFile() && entry.name.endsWith('.css')) {
			const stats = await stat(fullPath);
			files.push({
				path: fullPath,
				relativePath: relative(rootDir, fullPath),
				basename: basename(fullPath),
				size: stats.size,
			});
		}
	}
}

/**
 * Scan project for all CSS files
 */
export async function scanForCssFiles(rootDir: string): Promise<CssFile[]> {
	const files: CssFile[] = [];
	await scanDirectory(rootDir, rootDir, files);
	// Sort by size descending (larger files first)
	return files.sort((a, b) => b.size - a.size);
}

/**
 * Find the most likely entry point CSS file
 */
export function findEntryPoint(files: CssFile[]): CssFile | null {
	// Check each directory in priority order
	for (const dir of ENTRY_POINT_DIRS) {
		for (const name of ENTRY_POINT_NAMES) {
			const targetPath = dir ? `${dir}/${name}` : name;
			const match = files.find(
				(f) => f.relativePath === targetPath || f.relativePath === targetPath.replace(/\//g, '\\')
			);
			if (match) return match;
		}
	}

	// Fallback: find any file with an entry point name
	for (const name of ENTRY_POINT_NAMES) {
		const match = files.find((f) => f.basename === name);
		if (match) return match;
	}

	return null;
}

/**
 * Get potential entry point candidates for user selection
 */
export function getEntryPointCandidates(files: CssFile[]): CssFile[] {
	const candidates: CssFile[] = [];
	const seen = new Set<string>();

	// First, add known entry point names
	for (const name of ENTRY_POINT_NAMES) {
		const matches = files.filter((f) => f.basename === name);
		for (const match of matches) {
			if (!seen.has(match.path)) {
				candidates.push(match);
				seen.add(match.path);
			}
		}
	}

	// Then add large CSS files that might be entry points
	const largeCssFiles = files.filter(
		(f) => f.size > 1024 && !seen.has(f.path) && !f.relativePath.includes('vendor')
	);
	for (const file of largeCssFiles.slice(0, 5)) {
		candidates.push(file);
	}

	return candidates;
}
