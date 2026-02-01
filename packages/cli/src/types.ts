/**
 * Shift CSS CLI - Type Definitions
 */

/**
 * Architecture mode for the project
 * - greenfield: Pure Shift CSS, no legacy frameworks
 * - hybrid: Shift CSS alongside existing CSS frameworks
 */
export type ArchitectureMode = 'greenfield' | 'hybrid';

/**
 * Shift CSS configuration file schema (shift.config.json)
 */
export interface ShiftConfig {
	/** OKLCH seed hues for color generation */
	hues: {
		primary: number;
		secondary: number;
		accent: number;
		neutral: number;
	};
	/** Project architecture mode */
	mode: ArchitectureMode;
	/** Path configuration */
	paths: {
		/** Main stylesheet path */
		stylesheet: string;
	};
	/** Schema version for future compatibility */
	version: 1;
}

/**
 * Default configuration values
 */
export const DEFAULT_CONFIG: ShiftConfig = {
	hues: {
		primary: 260, // Plasma - Electric Blue
		secondary: 320, // Laser - Cyber-Pink
		accent: 45, // Gold
		neutral: 260, // Blue-tinted grays
	},
	mode: 'greenfield',
	paths: {
		stylesheet: 'src/styles/shift.css',
	},
	version: 1,
};

/**
 * Framework detection types (for hybrid mode)
 */
export type FrameworkType = 'bootstrap' | 'tailwind' | 'bulma' | 'foundation' | 'generic-large';

export type Confidence = 'high' | 'medium' | 'low';
export type MatchedBy = 'filename' | 'content' | 'size';

export interface CssFile {
	/** Absolute path */
	path: string;
	/** Relative to project root */
	relativePath: string;
	/** Filename only */
	basename: string;
	/** File size in bytes */
	size: number;
}

export interface DetectedFramework {
	type: FrameworkType;
	file: CssFile;
	confidence: Confidence;
	matchedBy: MatchedBy;
}

export interface FrameworkSignature {
	name: FrameworkType;
	/** Filename patterns to match */
	filePatterns: RegExp[];
	/** CSS content patterns to match */
	contentPatterns: RegExp[];
	/** Higher priority = more specific match */
	priority: number;
	/** Minimum file size for generic detection */
	minSize?: number;
	/** Display icon */
	icon: string;
	/** Display name */
	displayName: string;
}

/**
 * Init command result
 */
export interface InitResult {
	/** Path to created/updated config file */
	configPath: string;
	/** Path to created/updated stylesheet */
	stylesheetPath: string;
	/** Selected architecture mode */
	mode: ArchitectureMode;
	/** Detected frameworks (in hybrid mode) */
	detectedFrameworks?: DetectedFramework[];
}

export type UserAction = 'apply' | 'copy' | 'skip';

/**
 * Supported framework types for component templates
 */
export type ComponentFramework = 'astro' | 'react' | 'vue';

/**
 * Configuration for the add command
 */
export interface AddConfig {
	/** Directory for ejected CSS files */
	stylesDir: string;
	/** Directory for ejected component templates */
	componentsDir: string;
	/** CSS layer name to wrap components in */
	layer: string;
	/** Framework for component templates */
	framework?: ComponentFramework;
}
