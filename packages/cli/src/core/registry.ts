/**
 * Registry Loader
 * Loads and resolves components from the @shift-css/core registry
 */

import { readFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Component definition from registry
 */
export interface RegistryComponent {
	name: string;
	description: string;
	category?: string;
	files: {
		css: string;
	};
	dependencies: string[];
	registryDependencies: string[];
	customizationPoints: string[];
	attributes?: string[];
}

/**
 * Template paths for a component
 */
export interface TemplateSet {
	astro?: string;
	react?: string;
	vue?: string;
}

/**
 * Registry manifest structure
 */
export interface Registry {
	version: number;
	components: Record<string, RegistryComponent>;
	templates: Record<string, TemplateSet>;
}

/**
 * Resolved component with absolute paths
 */
export interface ResolvedComponent {
	component: RegistryComponent;
	cssPath: string;
	cssContent: string;
	templatePath?: string;
	templateContent?: string;
}

/**
 * Get the path to the @shift-css/core package
 */
async function getCorePackagePath(): Promise<string> {
	// Try multiple resolution strategies

	// 1. Check if SHIFT_CORE_PATH env var is set (for development)
	if (process.env.SHIFT_CORE_PATH) {
		return process.env.SHIFT_CORE_PATH;
	}

	// 2. Try monorepo development path (when running from packages/cli)
	const monorepoPath = resolve(process.cwd(), '..', 'core');
	try {
		await readFile(join(monorepoPath, 'package.json'), 'utf-8');
		return monorepoPath;
	} catch {
		// Not in monorepo
	}

	// 3. Try packages/core relative to cwd (when running from repo root)
	const packagesCorePath = join(process.cwd(), 'packages', 'core');
	try {
		await readFile(join(packagesCorePath, 'package.json'), 'utf-8');
		return packagesCorePath;
	} catch {
		// Not in repo root
	}

	// 4. Try to resolve from node_modules
	try {
		const corePackageJson = join(
			process.cwd(),
			'node_modules',
			'@shift-css',
			'core',
			'package.json'
		);
		await readFile(corePackageJson, 'utf-8');
		return dirname(corePackageJson);
	} catch {
		// Not in node_modules
	}

	// 5. Fallback: try to resolve relative to this module (for bundled CLI)
	const __dirname = dirname(fileURLToPath(import.meta.url));
	const devPath = resolve(__dirname, '..', '..', '..', 'core');
	try {
		await readFile(join(devPath, 'package.json'), 'utf-8');
		return devPath;
	} catch {
		throw new Error('Could not find @shift-css/core package. Make sure it is installed.');
	}
}

/**
 * Load the registry manifest
 */
export async function loadRegistry(): Promise<Registry> {
	const corePath = await getCorePackagePath();
	const registryPath = join(corePath, 'registry', 'registry.json');

	try {
		const content = await readFile(registryPath, 'utf-8');
		return JSON.parse(content) as Registry;
	} catch {
		throw new Error('Could not load component registry. Make sure @shift-css/core is up to date.');
	}
}

/**
 * Get a list of all available component names
 */
export async function getAvailableComponents(): Promise<string[]> {
	const registry = await loadRegistry();
	return Object.keys(registry.components).sort();
}

/**
 * Get a component definition by name
 */
export async function getComponent(name: string): Promise<RegistryComponent | null> {
	const registry = await loadRegistry();
	return registry.components[name] ?? null;
}

/**
 * Resolve all dependencies for a component (recursive)
 */
export async function resolveDependencies(
	componentName: string,
	resolved: Set<string> = new Set()
): Promise<string[]> {
	if (resolved.has(componentName)) {
		return [];
	}

	const component = await getComponent(componentName);
	if (!component) {
		return [];
	}

	resolved.add(componentName);
	const deps: string[] = [];

	for (const dep of component.registryDependencies) {
		if (!resolved.has(dep)) {
			const nestedDeps = await resolveDependencies(dep, resolved);
			deps.push(...nestedDeps, dep);
		}
	}

	return deps;
}

/**
 * Get ordered list of components including dependencies
 * Returns dependencies first, then the requested component
 */
export async function getComponentsWithDependencies(componentNames: string[]): Promise<string[]> {
	const allComponents: string[] = [];
	const resolved = new Set<string>();

	for (const name of componentNames) {
		const deps = await resolveDependencies(name, new Set(resolved));
		for (const dep of deps) {
			if (!resolved.has(dep)) {
				allComponents.push(dep);
				resolved.add(dep);
			}
		}
		if (!resolved.has(name)) {
			allComponents.push(name);
			resolved.add(name);
		}
	}

	return allComponents;
}

/**
 * Resolve a component to its full paths and content
 */
export async function resolveComponent(
	name: string,
	framework?: 'astro' | 'react' | 'vue'
): Promise<ResolvedComponent | null> {
	const registry = await loadRegistry();
	const component = registry.components[name];

	if (!component) {
		return null;
	}

	const corePath = await getCorePackagePath();
	const cssPath = join(corePath, 'src', component.files.css);

	let cssContent: string;
	try {
		cssContent = await readFile(cssPath, 'utf-8');
	} catch {
		throw new Error(`Could not read CSS file for component "${name}": ${cssPath}`);
	}

	let templatePath: string | undefined;
	let templateContent: string | undefined;

	if (framework) {
		const templates = registry.templates[name];
		const templateRelPath = templates?.[framework];

		if (templateRelPath) {
			templatePath = join(corePath, templateRelPath);
			try {
				templateContent = await readFile(templatePath, 'utf-8');
			} catch {
				// Template doesn't exist yet, that's ok
				templatePath = undefined;
			}
		}
	}

	return {
		component,
		cssPath,
		cssContent,
		templatePath,
		templateContent,
	};
}

/**
 * Check if a component exists in the registry
 */
export async function componentExists(name: string): Promise<boolean> {
	const component = await getComponent(name);
	return component !== null;
}

/**
 * Get components by category
 */
export async function getComponentsByCategory(): Promise<Record<string, RegistryComponent[]>> {
	const registry = await loadRegistry();
	const byCategory: Record<string, RegistryComponent[]> = {};

	for (const component of Object.values(registry.components)) {
		const category = component.category ?? 'other';
		if (!byCategory[category]) {
			byCategory[category] = [];
		}
		byCategory[category].push(component);
	}

	return byCategory;
}
