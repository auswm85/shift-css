# Shift CSS Selector Specification v1.1

## 1. Core Philosophy

Shift CSS moves away from the "modifier class" pattern (e.g., `.btn-primary`) in favor of **Semantic Attribute Modules**. This creates a strict, declarative API for UI components that is easier to maintain and nearly impossible to break with conflicting classes.

- **Namespace:** All framework attributes are prefixed with `s-`.
- **Token Prefix:** All CSS custom properties use `--s-` prefix.
- **Logic Over Description:** Attributes define _what_ an element is and its _state_, not just its look.
- **Low Specificity:** All base styles are wrapped in `:where()` to ensure zero-friction user overrides.
- **Auto Theming:** Uses CSS `light-dark()` and `color-scheme` for automatic dark mode.

---

## 2. Token Naming Convention

All CSS custom properties follow consistent naming:

| Category         | Pattern                      | Example                                |
| :--------------- | :--------------------------- | :------------------------------------- |
| Color scales     | `--s-{color}-{step}`         | `--s-primary-500`, `--s-neutral-200`   |
| Semantic colors  | `--s-{role}`                 | `--s-surface-base`, `--s-text-primary` |
| Spacing          | `--s-space-{n}`              | `--s-space-4`, `--s-space-8`           |
| Typography       | `--s-font-{property}`        | `--s-font-sans`, `--s-font-lg`         |
| Radii            | `--s-radius-{size}`          | `--s-radius`, `--s-radius-lg`          |
| Component-scoped | `--s-{component}-{property}` | `--s-btn-bg`, `--s-card-padding`       |

---

## 3. Global Attribute Map

### Components

| Attribute   | Purpose            | Values                                  | Example                        |
| :---------- | :----------------- | :-------------------------------------- | :----------------------------- |
| `s-btn`     | Button type        | `primary`, `secondary`, `ghost`, `link` | `<button s-btn="primary">`     |
| `s-surface` | Depth/Layering     | `sunken`, `flat`, `raised`, `floating`  | `<section s-surface="raised">` |
| `s-card`    | Card container     | (presence only)                         | `<article s-card>`             |
| `s-input`   | Text input         | (presence only)                         | `<input s-input>`              |
| `s-field`   | Form field wrapper | (presence only)                         | `<div s-field>`                |

### Modifiers

| Attribute | Purpose         | Values                     | Example                      |
| :-------- | :-------------- | :------------------------- | :--------------------------- |
| `s-size`  | Component scale | `sm`, `md`, `lg`, `xl`     | `<button s-btn s-size="lg">` |
| `s-grid`  | Layout engine   | `1` through `12` (columns) | `<div s-grid="3">`           |

### Card Sections

| Attribute       | Purpose           | Example                  |
| :-------------- | :---------------- | :----------------------- |
| `s-card-header` | Card header area  | `<header s-card-header>` |
| `s-card-body`   | Card content area | `<div s-card-body>`      |
| `s-card-footer` | Card footer area  | `<footer s-card-footer>` |

### Form Components

| Attribute    | Purpose            | Example                              |
| :----------- | :----------------- | :----------------------------------- |
| `s-field`    | Form field wrapper | `<div s-field>`                      |
| `s-label`    | Field label        | `<label s-label>`                    |
| `s-checkbox` | Checkbox input     | `<input type="checkbox" s-checkbox>` |
| `s-radio`    | Radio input        | `<input type="radio" s-radio>`       |
| `s-toggle`   | Toggle switch      | `<input type="checkbox" s-toggle>`   |

### Boolean States

| Attribute  | Purpose        | Example                   |
| :--------- | :------------- | :------------------------ |
| `active`   | Active state   | `<a s-btn active>`        |
| `disabled` | Disabled state | `<button s-btn disabled>` |

---

## 4. Specificity Strategy: Layered Intent

### Base Styles (Specificity: 0,0,0)

All base component styles use `:where()` for zero specificity:

```css
:where([s-btn]) {
  /* Base button styles - easily overridable */
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
```

### Variant Styles (Specificity: 0,1,0)

Variant selectors use standard attribute selectors for intentional specificity:

```css
[s-btn="primary"] {
  /* Primary variant - higher specificity than base */
  --_bg: var(--s-primary-500);
  --_color: var(--s-text-on-primary);
}
```

### The Pattern

```css
@layer shift.core {
  /* 1. Base with :where() - zero specificity */
  :where([s-component]) {
    --_private-var: initial-value;
    property: var(--_private-var);
  }

  /* 2. Variants without :where() - normal specificity */
  [s-component="variant"] {
    --_private-var: variant-value;
  }

  /* 3. State selectors */
  [s-component]:hover {
    --_private-var: hover-value;
  }
}
```

---

## 5. CSS Custom Property Scoping

### Private Properties

Internal component state uses underscore-prefixed properties:

```css
:where([s-btn]) {
  --_bg: var(--s-neutral-100);
  --_color: var(--s-text-primary);
  --_border: transparent;

  background: var(--_bg);
  color: var(--_color);
  border: 1px solid var(--_border);
}
```

### Public Override Points

Users can override via semantic tokens or direct properties:

```css
/* Override via semantic tokens */
:root {
  --s-primary-500: oklch(0.6 0.2 280);
}

/* Or override component directly */
[s-btn="primary"] {
  --_bg: purple;
}
```

---

## 6. State Handling

### Interactive States

```css
[s-btn]:hover {
  --_bg: var(--s-primary-600);
}

[s-btn]:active {
  scale: 0.97;
}

[s-btn]:focus-visible {
  outline: 2px solid var(--s-focus-ring);
  outline-offset: 2px;
}
```

### Disabled State

```css
[s-btn][disabled],
[s-btn]:disabled {
  opacity: 0.5;
  pointer-events: none;
}
```

---

## 7. Auto-Contrast Text

Components use OKLCH relative color syntax for automatic text contrast:

```css
[s-btn="primary"] {
  --_bg: var(--s-primary-500);
  /* Auto-contrast: light text on dark bg, dark text on light bg */
  --_color: oklch(from var(--_bg) calc(l < 0.6 ? 0.98: 0.15) 0.01 h);
}
```

This ensures WCAG AA compliant contrast regardless of the primary hue chosen.

---

## 8. Dark Mode Support

### Automatic Theming

The framework uses `color-scheme` and `light-dark()` for automatic dark mode:

```css
:root {
  color-scheme: light dark;
}

:root {
  --s-surface-base: light-dark(var(--s-neutral-50), var(--s-neutral-900));
  --s-text-primary: light-dark(var(--s-neutral-900), var(--s-neutral-50));
}
```

### No JavaScript Required

Dark mode activates automatically based on system preference via `prefers-color-scheme`. Users can force a mode:

```css
/* Force light mode */
:root {
  color-scheme: light;
}

/* Force dark mode */
:root {
  color-scheme: dark;
}
```

---

## 9. Usage Examples

### Buttons

```html
<!-- Primary button -->
<button s-btn="primary">Submit</button>

<!-- Secondary button, large size -->
<button s-btn="secondary" s-size="lg">Learn More</button>

<!-- Ghost button -->
<button s-btn="ghost">Cancel</button>

<!-- Link-style button -->
<button s-btn="link">Read More</button>
```

### Cards

```html
<article s-card>
  <header s-card-header>
    <h2>Card Title</h2>
  </header>
  <div s-card-body>
    <p>Card content goes here.</p>
  </div>
  <footer s-card-footer>
    <button s-btn="primary">Action</button>
  </footer>
</article>
```

### Form Inputs

```html
<div s-field>
  <label s-label for="email">Email</label>
  <input s-input type="email" id="email" placeholder="you@example.com" />
</div>

<div s-field>
  <label s-label>
    <input s-checkbox type="checkbox" />
    Subscribe to newsletter
  </label>
</div>

<div s-field>
  <label s-label>
    <input s-toggle type="checkbox" />
    Enable notifications
  </label>
</div>
```

### Surfaces

```html
<!-- Sunken surface (inset appearance) -->
<div s-surface="sunken">
  <p>Recessed content area</p>
</div>

<!-- Raised surface (subtle elevation) -->
<div s-surface="raised">
  <p>Elevated content</p>
</div>

<!-- Floating surface (modal/dropdown) -->
<div s-surface="floating">
  <p>Overlay content</p>
</div>
```

---

## 10. CSS Layer Order

The framework uses CSS Cascade Layers for predictable specificity:

```css
@layer shift.reset, shift.tokens, shift.core, shift.utils;
```

| Layer          | Purpose               | Specificity |
| :------------- | :-------------------- | :---------- |
| `shift.reset`  | Browser normalization | Lowest      |
| `shift.tokens` | CSS custom properties | Low         |
| `shift.core`   | Component styles      | Medium      |
| `shift.utils`  | Utility classes       | Higher      |
| (unlayered)    | User styles           | Highest     |

User CSS outside `@layer` automatically wins over all framework styles.

---

## 11. Browser Support

Shift CSS targets modern browsers with cutting-edge CSS features:

- Chrome 131+
- Firefox 133+
- Safari 18+

Required features:

- CSS `@layer`
- `light-dark()` function
- `color-scheme` property
- OKLCH color space
- Relative color syntax
- CSS nesting

---

## 12. Utility System

Shift CSS uses a **hybrid utility organization** with two selector strategies:

### Philosophy

| Category              | Selector Type      | Prefix/Pattern        | Purpose                          |
| :-------------------- | :----------------- | :-------------------- | :------------------------------- |
| Atomic utilities      | Classes            | `.s-{property}-{val}` | Fine-grained control (Developer) |
| Structural layout     | Attributes         | `[s-flex]`, `[s-grid]`| Layout skeleton (Designer)       |
| Thematic/State        | Attributes         | `[s-hidden]`, `[s-truncate]` | Semantic intent             |

**Designer's Tool vs Developer's Screwdriver:**
- `[s-gap="md"]` → Designer's tool for consistent spacing
- `.s-gap-4` → Developer's screwdriver for pixel-perfect control

### Atomic Utility Classes

All atomic utilities use the `s-` namespace prefix to avoid conflicts:

```html
<!-- Spacing -->
<div class="s-p-4 s-m-2">Padding and margin</div>
<div class="s-px-4 s-py-2">Horizontal/vertical padding</div>
<div class="s-mt-4 s-mb-8">Individual margins</div>
<div class="s-mx-auto">Centered horizontally</div>

<!-- Typography -->
<p class="s-text-lg s-font-bold">Large bold text</p>
<p class="s-text-center s-leading-relaxed">Centered, relaxed leading</p>
<p class="s-uppercase s-tracking-wide">Uppercase with tracking</p>

<!-- Flex item utilities -->
<div class="s-flex-1">Grow equally</div>
<div class="s-flex-none s-shrink-0">Fixed size</div>

<!-- Sizing -->
<div class="s-w-full s-h-screen">Full width, viewport height</div>
<div class="s-min-w-0 s-max-w-prose">Constrained width</div>

<!-- Gap (atomic) -->
<div s-flex class="s-gap-4">Exact 1rem gap</div>
<div s-grid="3" class="s-gap-x-4 s-gap-y-2">Different row/column gaps</div>
```

### Structural Layout Attributes

Semantic attributes define the layout skeleton:

#### Flex Layout

```html
<div s-flex>Basic flex container</div>
<div s-flex="row">Horizontal (explicit)</div>
<div s-flex="col">Vertical stack</div>
<div s-flex="center">Centered content</div>
<div s-flex="between">Space between, vertically centered</div>
<div s-flex="row wrap">Wrapping row</div>
```

| Attribute              | CSS Output                                |
| :--------------------- | :---------------------------------------- |
| `s-flex`               | `display: flex`                           |
| `s-flex="row"`         | `flex-direction: row`                     |
| `s-flex="col"`         | `flex-direction: column`                  |
| `s-flex="center"`      | `align-items: center; justify-content: center` |
| `s-flex="between"`     | `justify-content: space-between; align-items: center` |
| `s-flex="stack"`       | `flex-direction: column`                  |
| `s-flex~="wrap"`       | `flex-wrap: wrap`                         |

#### Grid Layout

```html
<div s-grid>Basic grid</div>
<div s-grid="3">3 equal columns</div>
<div s-grid="12">12-column grid</div>
<div s-grid="auto-fit">Responsive auto-fit</div>
```

| Attribute              | CSS Output                                |
| :--------------------- | :---------------------------------------- |
| `s-grid`               | `display: grid`                           |
| `s-grid="1"` to `"6"`  | `grid-template-columns: repeat(n, minmax(0, 1fr))` |
| `s-grid="12"`          | 12-column grid                            |
| `s-grid="auto-fit"`    | Responsive columns without media queries  |

#### Grid Span

```html
<div s-col-span="2">Spans 2 columns</div>
<div s-col-span="full">Full width</div>
<div s-row-span="2">Spans 2 rows</div>
```

#### Container

```html
<div s-container>Default max-width (80rem)</div>
<div s-container="sm">Small container (40rem)</div>
<div s-container="prose">Reading width (65ch)</div>
<div s-container="full">Full width</div>
```

#### Semantic Gap

```html
<div s-flex s-gap="md">Consistent medium gap</div>
<div s-grid="3" s-gap="lg">Comfortable grid spacing</div>
```

| Attribute       | Value         |
| :-------------- | :------------ |
| `s-gap`         | `1rem` (default) |
| `s-gap="xs"`    | `0.25rem`     |
| `s-gap="sm"`    | `0.5rem`      |
| `s-gap="md"`    | `1rem`        |
| `s-gap="lg"`    | `1.5rem`      |
| `s-gap="xl"`    | `2rem`        |
| `s-gap="none"`  | `0`           |

#### Alignment Modifiers

```html
<div s-flex s-justify="between" s-items="center">
  Composable alignment
</div>
```

| Attribute              | CSS Property        |
| :--------------------- | :------------------ |
| `s-justify="start\|end\|center\|between\|around\|evenly"` | `justify-content` |
| `s-items="start\|end\|center\|baseline\|stretch"` | `align-items` |
| `s-content="start\|end\|center\|between\|around"` | `align-content` |

#### Position & Display

```html
<div s-position="relative">
  <div s-position="absolute" s-inset="0">Overlay</div>
</div>
<header s-position="sticky">Sticky header</header>
<span s-display="block">Block element</span>
```

### Thematic/State Attributes

#### Visibility

```html
<div s-hidden>Hidden element</div>
<div s-visible>Explicitly visible</div>
<div s-sr-only>Screen reader only</div>
<div s-invisible>Invisible but takes space</div>
```

#### Text Truncation

```html
<p s-truncate>Single line truncate with ellipsis...</p>
<p s-truncate="2">Multi-line clamp to 2 lines</p>
<p s-truncate="3">Multi-line clamp to 3 lines</p>
```

### Utility Layer Specificity

All utilities are in the `shift.utils` layer:

```css
@layer shift.utils {
  /* Atomic classes */
  .s-p-4 { padding: var(--s-space-4); }

  /* Layout attributes */
  [s-flex] { display: flex; }

  /* Thematic attributes */
  [s-hidden] { display: none; }
}
```

User styles outside `@layer` override all utilities without `!important`.
