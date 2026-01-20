/**
 * Framework Detector
 * Identifies CSS frameworks by filename and content patterns
 */

import { readFile } from 'node:fs/promises';
import type { CssFile, DetectedFramework, FrameworkSignature, FrameworkType } from '../types.ts';

/** Framework signatures for detection */
export const FRAMEWORK_SIGNATURES: FrameworkSignature[] = [
	{
		name: 'bootstrap',
		filePatterns: [
			/bootstrap\.css$/i,
			/bootstrap\.min\.css$/i,
			/bootstrap[\d.-]+\.css$/i,
			/bootstrap[\d.-]+\.min\.css$/i,
		],
		contentPatterns: [/\.btn-primary\s*\{/, /\.container-fluid\s*\{/, /\.navbar-/, /--bs-/],
		priority: 10,
		icon: '🅱️',
		displayName: 'Bootstrap',
	},
	{
		name: 'tailwind',
		filePatterns: [
			/tailwind\.css$/i,
			/tailwind\.min\.css$/i,
			/tailwind\.output\.css$/i,
			/tailwind-output\.css$/i,
		],
		contentPatterns: [
			/--tw-/,
			/\.hover\\:/,
			/\.focus\\:/,
			/@tailwind\s+(base|components|utilities)/,
			/\.-?m[trblxy]?-\[/,
		],
		priority: 10,
		icon: '🌊',
		displayName: 'Tailwind CSS',
	},
	{
		name: 'bulma',
		filePatterns: [/bulma\.css$/i, /bulma\.min\.css$/i],
		contentPatterns: [/\.is-primary\s*\{/, /\.columns\s*\{/, /\.navbar-burger/],
		priority: 10,
		icon: '🎨',
		displayName: 'Bulma',
	},
	{
		name: 'foundation',
		filePatterns: [/foundation\.css$/i, /foundation\.min\.css$/i],
		contentPatterns: [/\.callout\s*\{/, /\.top-bar\s*\{/, /\.orbit/],
		priority: 10,
		icon: '🏛️',
		displayName: 'Foundation',
	},
	{
		name: 'generic-large',
		filePatterns: [],
		contentPatterns: [],
		priority: 1,
		minSize: 10 * 1024, // 10KB
		icon: '📄',
		displayName: 'Large CSS File',
	},
];

/**
 * Get framework signature by name
 */
export function getSignature(type: FrameworkType): FrameworkSignature | undefined {
	return FRAMEWORK_SIGNATURES.find((s) => s.name === type);
}

/**
 * Check if filename matches any framework pattern
 */
function matchFilename(
	basename: string
): { type: FrameworkType; signature: FrameworkSignature } | null {
	for (const sig of FRAMEWORK_SIGNATURES) {
		if (sig.filePatterns.some((pattern) => pattern.test(basename))) {
			return { type: sig.name, signature: sig };
		}
	}
	return null;
}

/**
 * Check if content matches framework patterns
 */
function matchContent(
	content: string
): { type: FrameworkType; signature: FrameworkSignature } | null {
	for (const sig of FRAMEWORK_SIGNATURES) {
		if (sig.contentPatterns.length === 0) continue;
		const matches = sig.contentPatterns.filter((pattern) => pattern.test(content));
		// Require at least 2 content pattern matches for confidence
		if (matches.length >= 2) {
			return { type: sig.name, signature: sig };
		}
	}
	return null;
}

/**
 * Detect frameworks from a list of CSS files
 */
export async function detectFrameworks(files: CssFile[]): Promise<DetectedFramework[]> {
	const detected: DetectedFramework[] = [];
	const processedPaths = new Set<string>();

	for (const file of files) {
		if (processedPaths.has(file.path)) continue;

		// Pass 1: Filename matching (fast, high confidence)
		const filenameMatch = matchFilename(file.basename);
		if (filenameMatch) {
			detected.push({
				type: filenameMatch.type,
				file,
				confidence: 'high',
				matchedBy: 'filename',
			});
			processedPaths.add(file.path);
			continue;
		}

		// Pass 2: Content analysis for larger files
		if (file.size > 5 * 1024) {
			// >5KB
			try {
				// Read first 50KB for pattern matching
				const content = await readFileHead(file.path, 50 * 1024);

				const contentMatch = matchContent(content);
				if (contentMatch) {
					detected.push({
						type: contentMatch.type,
						file,
						confidence: 'medium',
						matchedBy: 'content',
					});
					processedPaths.add(file.path);
					continue;
				}
			} catch {
				// Skip files we can't read
				continue;
			}
		}

		// Pass 3: Size-based detection for large generic files
		const genericSig = FRAMEWORK_SIGNATURES.find((s) => s.name === 'generic-large');
		if (genericSig?.minSize && file.size > genericSig.minSize) {
			// Only flag as generic-large if it's a likely entry point name
			const entryNames = ['app.css', 'main.css', 'styles.css', 'style.css', 'global.css'];
			if (entryNames.includes(file.basename.toLowerCase())) {
				detected.push({
					type: 'generic-large',
					file,
					confidence: 'low',
					matchedBy: 'size',
				});
				processedPaths.add(file.path);
			}
		}
	}

	// Sort by file size descending
	return detected.sort((a, b) => b.file.size - a.file.size);
}

/**
 * Read first N bytes of a file
 */
async function readFileHead(filepath: string, maxBytes: number): Promise<string> {
	const content = await readFile(filepath, 'utf-8');
	return content.slice(0, maxBytes);
}

/**
 * Check if a file already has @layer declarations
 */
export async function hasLayerDeclarations(filepath: string): Promise<boolean> {
	try {
		const content = await readFile(filepath, 'utf-8');
		return /@layer\s+/.test(content);
	} catch {
		return false;
	}
}
