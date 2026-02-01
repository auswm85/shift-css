/**
 * CSS Transformer
 * Wraps component CSS in @layer for cascade layer support
 */

/**
 * Options for CSS transformation
 */
export interface TransformOptions {
	/** Layer name to wrap CSS in (default: 'components') */
	layer?: string;
	/** Whether to strip existing @layer declarations */
	stripExistingLayers?: boolean;
	/** Add header comment */
	addHeader?: boolean;
	/** Component name for header */
	componentName?: string;
}

/**
 * Extract @layer name if CSS is already wrapped
 */
function getExistingLayerName(css: string): string | null {
	const match = css.match(/^@layer\s+([a-zA-Z_-][a-zA-Z0-9_-]*)\s*\{/);
	return match?.[1] ?? null;
}

/**
 * Strip leading/trailing comments from CSS for processing
 * Returns the comments separately to preserve them
 */
function extractLeadingComments(css: string): {
	comments: string;
	content: string;
} {
	const match = css.match(/^((?:\/\*[\s\S]*?\*\/\s*)*)/);
	if (match?.[1]) {
		return {
			comments: match[1],
			content: css.slice(match[1].length),
		};
	}
	return { comments: '', content: css };
}

/**
 * Generate a header comment for component
 */
function generateHeader(componentName: string): string {
	return `/**
 * Shift CSS - ${componentName} Component
 *
 * This file was created from @shift-css/core using \`shift add ${componentName}\`.
 * You can customize the CSS custom properties below.
 *
 * @see https://getshiftcss.com/components/${componentName}
 */

`;
}

/**
 * Wrap CSS content in an @layer declaration
 */
export function wrapInLayer(css: string, options: TransformOptions = {}): string {
	const { layer = 'components', addHeader = true, componentName = 'component' } = options;

	// Extract leading comments (docblock) - we extract but preserve via original css
	const { content } = extractLeadingComments(css);

	// Check if already wrapped in the target layer
	const existingLayer = getExistingLayerName(content.trim());
	if (existingLayer === layer) {
		// Already in the correct layer, just return with optional header
		return addHeader ? generateHeader(componentName) + css : css;
	}

	// Check if wrapped in a different layer
	if (existingLayer) {
		// Replace the layer name
		const rewrapped = content.replace(new RegExp(`^@layer\\s+${existingLayer}`), `@layer ${layer}`);
		return addHeader ? generateHeader(componentName) + rewrapped : rewrapped;
	}

	// Wrap the content in the layer
	const trimmedContent = content.trim();

	// Indent the content
	const indentedContent = trimmedContent
		.split('\n')
		.map((line) => (line.trim() ? `\t${line}` : line))
		.join('\n');

	const wrapped = `@layer ${layer} {\n${indentedContent}\n}\n`;

	return addHeader ? generateHeader(componentName) + wrapped : wrapped;
}

/**
 * Process @import statements - moves them outside the layer
 * @layer cannot contain @import, so we need to extract them
 */
export function extractImports(css: string): {
	imports: string[];
	content: string;
} {
	const importRegex = /@import\s+(?:url\([^)]+\)|"[^"]+"|'[^']+')[^;]*;/g;
	const imports: string[] = [];

	// Use matchAll to avoid assignment in expression
	for (const match of css.matchAll(importRegex)) {
		imports.push(match[0]);
	}

	// Remove imports from content
	const content = css.replace(importRegex, '').trim();

	return { imports, content };
}

/**
 * Transform CSS for ejection
 * - Extracts @import statements
 * - Wraps remaining CSS in @layer
 * - Adds header comment
 */
export function transformForEjection(css: string, options: TransformOptions = {}): string {
	const { layer = 'components', componentName = 'component' } = options;

	// Extract imports first
	const { imports, content } = extractImports(css);

	// Wrap the content in a layer
	const wrapped = wrapInLayer(content, {
		layer,
		addHeader: true,
		componentName,
	});

	// Combine imports (outside layer) with wrapped content
	if (imports.length > 0) {
		return `${imports.join('\n')}\n\n${wrapped}`;
	}

	return wrapped;
}

/**
 * Validate CSS syntax (basic check)
 */
export function validateCss(css: string): { valid: boolean; error?: string } {
	// Check for balanced braces
	let braceCount = 0;
	let inString = false;
	let stringChar = '';

	for (let i = 0; i < css.length; i++) {
		const char = css[i] as string;
		const prevChar = css[i - 1];

		// Track string state
		if ((char === '"' || char === "'") && prevChar !== '\\') {
			if (!inString) {
				inString = true;
				stringChar = char;
			} else if (char === stringChar) {
				inString = false;
			}
		}

		// Count braces outside strings
		if (!inString) {
			if (char === '{') braceCount++;
			if (char === '}') braceCount--;
		}

		if (braceCount < 0) {
			return { valid: false, error: 'Unexpected closing brace' };
		}
	}

	if (braceCount !== 0) {
		return { valid: false, error: 'Unbalanced braces' };
	}

	return { valid: true };
}
