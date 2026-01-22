/**
 * Shift CSS - Attribute Type Definitions
 *
 * Shared type definitions for all Shift CSS attributes.
 * Used by React and Vue module augmentations.
 */

// =============================================================================
// COMPONENT ATTRIBUTES
// =============================================================================

/** Button variants */
export type ShiftButtonVariant =
	| 'primary'
	| 'secondary'
	| 'ghost'
	| 'link'
	| 'outline'
	| 'danger'
	| 'success'
	| 'warning';

/** Badge variants */
export type ShiftBadgeVariant =
	| 'primary'
	| 'secondary'
	| 'accent'
	| 'success'
	| 'warning'
	| 'danger'
	| 'outline'
	| 'outline-primary'
	| 'outline-secondary'
	| 'outline-success'
	| 'outline-warning'
	| 'outline-danger';

/** Surface variants */
export type ShiftSurfaceVariant = 'raised' | 'sunken' | 'overlay';

/** Modal position variants */
export type ShiftModalPosition = 'center' | 'top' | 'bottom' | 'left' | 'right' | 'fullscreen';

/** Tooltip position */
export type ShiftTooltipPosition = 'top' | 'bottom' | 'left' | 'right';

/** Prose variants */
export type ShiftProseVariant = 'sm' | 'lg';

/** Input types (for styling variants) */
export type ShiftInputVariant = 'error' | 'success';

// =============================================================================
// SIZE ATTRIBUTES
// =============================================================================

/** Common size scale */
export type ShiftSize = 'sm' | 'lg' | 'xl';

/** Extended size scale (includes full) */
export type ShiftSizeExtended = ShiftSize | 'full';

// =============================================================================
// LAYOUT ATTRIBUTES
// =============================================================================

/** Flex direction and patterns */
export type ShiftFlexVariant =
	| 'row'
	| 'col'
	| 'row-reverse'
	| 'col-reverse'
	| 'center'
	| 'stack'
	| 'between'
	| 'end'
	| 'wrap'
	| 'nowrap';

/** Grid column counts */
export type ShiftGridColumns = '1' | '2' | '3' | '4' | '5' | '6' | '12' | 'auto-fit' | 'auto-fill';

/** Grid row counts */
export type ShiftGridRows = '1' | '2' | '3' | '4';

/** Column span */
export type ShiftColSpan = '1' | '2' | '3' | '4' | '6' | '12' | 'full';

/** Row span */
export type ShiftRowSpan = '1' | '2' | '3' | 'full';

/** Gap sizes */
export type ShiftGap = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'none';

/** Container sizes */
export type ShiftContainer = 'sm' | 'md' | 'lg' | 'xl' | 'full' | 'prose';

/** Justify content */
export type ShiftJustify = 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';

/** Align items */
export type ShiftItems = 'start' | 'end' | 'center' | 'baseline' | 'stretch';

/** Align content */
export type ShiftContent = 'start' | 'end' | 'center' | 'between' | 'around';

/** Position */
export type ShiftPosition = 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';

/** Inset */
export type ShiftInset = '0' | 'auto';

/** Display */
export type ShiftDisplay =
	| 'block'
	| 'inline'
	| 'inline-block'
	| 'contents'
	| 'inline-flex'
	| 'inline-grid';

// =============================================================================
// VISIBILITY ATTRIBUTES
// =============================================================================

/** Responsive breakpoints for hide-on */
export type ShiftBreakpoint = 'sm' | 'md' | 'lg' | 'xl';

/** Overflow */
export type ShiftOverflow = 'auto' | 'hidden' | 'scroll' | 'visible';

/** Pointer events */
export type ShiftPointer = 'none' | 'auto';

/** User select */
export type ShiftSelect = 'none' | 'text' | 'all' | 'auto';

// =============================================================================
// COMPLETE ATTRIBUTE MAP
// =============================================================================

/**
 * All Shift CSS attributes with their value types.
 * Boolean attributes accept `true` or empty string.
 */
export interface ShiftAttributes {
	// Component attributes (with variants)
	's-btn'?: ShiftButtonVariant | boolean;
	's-badge'?: ShiftBadgeVariant | boolean;
	's-surface'?: ShiftSurfaceVariant | boolean;
	's-modal'?: ShiftModalPosition | boolean;
	's-tooltip'?: string;
	's-tooltip-pos'?: ShiftTooltipPosition;
	's-prose'?: ShiftProseVariant | boolean;
	's-input'?: ShiftInputVariant | boolean;
	's-card'?: boolean;
	's-skip-link'?: boolean;

	// Size modifier (composable)
	's-size'?: ShiftSizeExtended;

	// Layout attributes
	's-flex'?: ShiftFlexVariant | boolean;
	's-grid'?: ShiftGridColumns | boolean;
	's-grid-rows'?: ShiftGridRows;
	's-col-span'?: ShiftColSpan;
	's-row-span'?: ShiftRowSpan;
	's-gap'?: ShiftGap | boolean;
	's-container'?: ShiftContainer | boolean;
	's-justify'?: ShiftJustify;
	's-items'?: ShiftItems;
	's-content'?: ShiftContent;
	's-position'?: ShiftPosition;
	's-inset'?: ShiftInset;
	's-display'?: ShiftDisplay;

	// Visibility attributes
	's-hide-on'?: ShiftBreakpoint;
	's-overflow'?: ShiftOverflow;
	's-overflow-x'?: ShiftOverflow;
	's-overflow-y'?: ShiftOverflow;
	's-pointer'?: ShiftPointer;
	's-select'?: ShiftSelect;

	// Boolean attributes (presence-only)
	's-block'?: boolean;
	's-bordered'?: boolean;
	's-btn-group'?: boolean;
	's-card-body'?: boolean;
	's-card-footer'?: boolean;
	's-card-header'?: boolean;
	's-card-media'?: boolean;
	's-card-title'?: boolean;
	's-card-subtitle'?: boolean;
	's-card-icon'?: boolean;
	's-card-grid'?: boolean;
	's-card-stack'?: boolean;
	's-checkbox'?: boolean;
	's-collapse'?: boolean;
	's-dot'?: boolean;
	's-field'?: boolean;
	's-field-label'?: boolean;
	's-field-hint'?: boolean;
	's-field-error'?: boolean;
	's-hidden'?: boolean;
	's-horizontal'?: boolean;
	's-icon'?: boolean;
	's-input-group'?: boolean;
	's-input-addon'?: boolean;
	's-interactive'?: boolean;
	's-invisible'?: boolean;
	's-isolate'?: boolean;
	's-link'?: boolean;
	's-loading'?: boolean;
	's-modal-body'?: boolean;
	's-modal-close'?: boolean;
	's-modal-footer'?: boolean;
	's-modal-header'?: boolean;
	's-not-sr-only'?: boolean;
	's-pill'?: boolean;
	's-radio'?: boolean;
	's-skip-link-group'?: boolean;
	's-sr-only'?: boolean;
	's-toggle'?: boolean;
	's-truncate'?: boolean;
	's-visible'?: boolean;
}
