/**
 * Shift CSS - Vue Type Definitions
 *
 * Module augmentation for Vue 3 templates to support Shift CSS attributes.
 * Works with Volar (Vue Language Tools) for template type checking.
 *
 * Usage:
 *   Add to your tsconfig.json:
 *   {
 *     "compilerOptions": {
 *       "types": ["@shift-css/core/types/vue"]
 *     }
 *   }
 *
 *   Or add a reference in a .d.ts file:
 *   /// <reference types="@shift-css/core/types/vue" />
 */

import type { ShiftAttributes } from './attributes';

// Augment Vue's global component props
declare module 'vue' {
	interface ComponentCustomProps extends ShiftAttributes {}
}

// Augment @vue/runtime-dom for template type checking
declare module '@vue/runtime-dom' {
	interface HTMLAttributes extends ShiftAttributes {}
}
