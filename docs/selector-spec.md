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
