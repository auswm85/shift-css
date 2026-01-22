/**
 * Shift CSS - React Type Definitions
 *
 * Module augmentation for React JSX to support Shift CSS attributes.
 *
 * Usage:
 *   Add to your tsconfig.json:
 *   {
 *     "compilerOptions": {
 *       "types": ["@shift-css/core/types/react"]
 *     }
 *   }
 *
 *   Or add a reference in a .d.ts file:
 *   /// <reference types="@shift-css/core/types/react" />
 */

import type { ShiftAttributes } from './attributes';

declare module 'react' {
	// biome-ignore lint/correctness/noUnusedVariables: T must match React's HTMLAttributes<T> signature
	interface HTMLAttributes<T> extends ShiftAttributes {}
}
