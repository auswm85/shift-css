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

// =============================================================================
// BOOLEAN ATTRIBUTE TYPE
// =============================================================================

/** Boolean attribute type - accepts boolean or empty string for presence-only attributes */
export type ShiftBooleanAttr = boolean | '';

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
	's-btn'?: ShiftButtonVariant | ShiftBooleanAttr;
	's-badge'?: ShiftBadgeVariant | ShiftBooleanAttr;
	's-surface'?: ShiftSurfaceVariant | ShiftBooleanAttr;
	's-modal'?: ShiftModalPosition | ShiftBooleanAttr;
	's-tooltip'?: string;
	's-tooltip-pos'?: ShiftTooltipPosition;
	's-prose'?: ShiftProseVariant | ShiftBooleanAttr;
	's-input'?: ShiftInputVariant | ShiftBooleanAttr;
	's-card'?: ShiftBooleanAttr;
	's-skip-link'?: ShiftBooleanAttr;

	// Size modifier (composable)
	's-size'?: ShiftSizeExtended;

	// Layout attributes
	's-flex'?: ShiftFlexVariant | ShiftBooleanAttr;
	's-grid'?: ShiftGridColumns | ShiftBooleanAttr;
	's-grid-rows'?: ShiftGridRows;
	's-col-span'?: ShiftColSpan;
	's-row-span'?: ShiftRowSpan;
	's-gap'?: ShiftGap | ShiftBooleanAttr;
	's-container'?: ShiftContainer | ShiftBooleanAttr;
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
	's-block'?: ShiftBooleanAttr;
	's-bordered'?: ShiftBooleanAttr;
	's-btn-group'?: ShiftBooleanAttr;
	's-card-body'?: ShiftBooleanAttr;
	's-card-footer'?: ShiftBooleanAttr;
	's-card-header'?: ShiftBooleanAttr;
	's-card-media'?: ShiftBooleanAttr;
	's-card-title'?: ShiftBooleanAttr;
	's-card-subtitle'?: ShiftBooleanAttr;
	's-card-icon'?: ShiftBooleanAttr;
	's-card-grid'?: ShiftBooleanAttr;
	's-card-stack'?: ShiftBooleanAttr;
	's-checkbox'?: ShiftBooleanAttr;
	's-collapse'?: ShiftBooleanAttr;
	's-dot'?: ShiftBooleanAttr;
	's-field'?: ShiftBooleanAttr;
	's-field-label'?: ShiftBooleanAttr;
	's-field-hint'?: ShiftBooleanAttr;
	's-field-error'?: ShiftBooleanAttr;
	's-hidden'?: ShiftBooleanAttr;
	's-horizontal'?: ShiftBooleanAttr;
	's-icon'?: ShiftBooleanAttr;
	's-input-group'?: ShiftBooleanAttr;
	's-input-addon'?: ShiftBooleanAttr;
	's-interactive'?: ShiftBooleanAttr;
	's-invisible'?: ShiftBooleanAttr;
	's-isolate'?: ShiftBooleanAttr;
	's-link'?: ShiftBooleanAttr;
	's-loading'?: ShiftBooleanAttr;
	's-modal-body'?: ShiftBooleanAttr;
	's-modal-close'?: ShiftBooleanAttr;
	's-modal-footer'?: ShiftBooleanAttr;
	's-modal-header'?: ShiftBooleanAttr;
	's-not-sr-only'?: ShiftBooleanAttr;
	's-pill'?: ShiftBooleanAttr;
	's-radio'?: ShiftBooleanAttr;
	's-skip-link-group'?: ShiftBooleanAttr;
	's-sr-only'?: ShiftBooleanAttr;
	's-toggle'?: ShiftBooleanAttr;
	's-truncate'?: ShiftBooleanAttr;
	's-visible'?: ShiftBooleanAttr;
}
