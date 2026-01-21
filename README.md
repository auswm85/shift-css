<p align="center">
  <img src="assets/logo.svg" alt="Shift CSS" width="80" height="80">
</p>

<h1 align="center">Shift CSS</h1>

<p align="center">
  <a href="https://getshiftcss.com">Documentation</a>
</p>

<p align="center">A zero-runtime, OKLCH-native CSS framework with automatic theming.</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@shift-css/core"><img src="https://img.shields.io/npm/v/@shift-css/core" alt="npm version"></a>
  <a href="https://github.com/auswm85/shift-css/actions/workflows/ci.yml"><img src="https://github.com/auswm85/shift-css/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <a href="https://cdn.jsdelivr.net/npm/@shift-css/core/dist/shift.min.css"><img src="https://img.badgesize.io/https://cdn.jsdelivr.net/npm/@shift-css/core/dist/shift.min.css?compression=gzip&label=CSS%20gzip%20size" alt="CSS gzip size"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT"></a>
</p>

## Why Shift CSS?

Modern CSS has evolved dramatically. Native features like `light-dark()`, OKLCH colors, cascade layers, and container queries eliminate the need for JavaScript-heavy theming solutions. Shift CSS embraces these capabilities to deliver:

- **Zero JavaScript** - Theming works without any runtime code
- **Perceptually uniform colors** - OKLCH ensures consistent brightness across your palette
- **Automatic contrast** - Text colors adapt to any background automatically
- **Clean specificity** - Cascade layers mean no more `!important` battles
- **One-line customization** - Change a single hue variable to transform your entire palette

```css
/* Change your entire brand palette with one line */
:root {
  --shift-hue-primary: 280; /* Purple instead of blue */
}
```

## Quick Start

### Installation

```bash
npm install @shift-css/core
# or
bun add @shift-css/core
# or
pnpm add @shift-css/core
```

### Import

```css
/* Full framework */
@import "@shift-css/core";

/* Or minified for production */
@import "@shift-css/core/min";
```

### Use

```html
<!-- Automatic dark mode support -->
<div s-surface="raised">
  <h2>Hello Shift</h2>
  <button s-btn="primary">Get Started</button>
</div>
```

That's it. No configuration, no JavaScript, no build step for customization.

## Using the CLI

Initialize Shift CSS with the correct layer hierarchy:

```bash
npx shift-css init
```

The CLI will:
- Ask about your project type (Greenfield or Hybrid)
- Configure your brand color (OKLCH seed hue)
- Create `shift.config.json` with your settings
- Scaffold your main stylesheet with proper cascade layers

For existing projects with Bootstrap/Tailwind, choose "Hybrid" mode to get a `@layer legacy` block for your existing CSS.

See [@shift-css/cli](packages/cli) for full documentation.

## Features

### Perceptually Uniform Colors (OKLCH)

Traditional RGB-based color scales produce inconsistent brightness. A "500" shade in one hue might look darker than another. OKLCH solves this with perceptual uniformity:

```css
/* Every 500-level shade has identical perceived brightness */
--s-primary-500: oklch(0.6478 0.1472 var(--shift-hue-primary));
--s-danger-500: oklch(0.6478 0.1472 var(--shift-hue-danger));
```

### Automatic Theming

The native `light-dark()` function handles theme switching without duplicate classes:

```css
/* Shift CSS internally */
--s-surface-base: light-dark(var(--s-neutral-50), var(--s-neutral-900));

/* No more of this */
.bg-white dark:bg-gray-900 {
}
```

Theme respects `prefers-color-scheme` automatically. Override with `color-scheme: light` or `color-scheme: dark` on any element.

### Auto-Contrast Text

Components automatically calculate readable text colors using progressive enhancement:

1. **CSS Color Level 6**: `contrast-color()` (cutting-edge browsers)
2. **OKLCH Fallback**: Relative color syntax with lightness threshold
3. **Semantic Fallback**: Pre-defined semantic tokens

```html
<!-- Text automatically becomes light or dark based on background -->
<div s-surface="primary">Readable on any color</div>
<div s-surface="warning">Still readable here too</div>
```

### Clean Specificity with Cascade Layers

All framework styles live in `@layer`, ensuring your CSS always wins:

```css
@layer shift.reset, shift.tokens, shift.core, shift.utils;

/* Your styles automatically override without !important */
[s-btn] {
  border-radius: 9999px; /* This just works */
}
```

## Core Components

### Surface

Adaptive container with automatic text contrast.

```html
<!-- Variants -->
<div s-surface>Default flat surface</div>
<div s-surface="raised">Elevated card-like</div>
<div s-surface="sunken">Recessed input-like</div>
<div s-surface="floating">High elevation overlay</div>

<!-- Colors -->
<div s-surface="primary">Primary brand color</div>
<div s-surface="secondary">Secondary color</div>
<div s-surface="accent">Accent color</div>

<!-- States -->
<div s-surface="success">Success message</div>
<div s-surface="warning">Warning message</div>
<div s-surface="danger">Error message</div>

<!-- Modifiers -->
<div s-surface s-bordered>With border</div>
<div s-surface="raised" s-interactive>Hoverable card</div>
```

### Button

Accessible button with semantic variants.

```html
<!-- Variants -->
<button s-btn="primary">Primary Action</button>
<button s-btn="secondary">Secondary</button>
<button s-btn="ghost">Ghost Button</button>

<!-- Sizes -->
<button s-btn="primary" s-size="sm">Small</button>
<button s-btn="primary" s-size="lg">Large</button>

<!-- States -->
<button s-btn="primary" disabled>Disabled</button>
```

### Card

Flexible card component with structured sections.

```html
<article s-card>
  <header s-card-header>
    <h3>Card Title</h3>
  </header>
  <div s-card-body>
    <p>Card content goes here.</p>
  </div>
  <footer s-card-footer>
    <button s-btn="primary">Action</button>
  </footer>
</article>
```

### Input

Form input styling with consistent appearance.

```html
<input s-input type="text" placeholder="Enter text" />
<input s-input type="email" s-size="lg" placeholder="Large input" />
<textarea s-input rows="4">Multi-line text</textarea>
<select s-input>
  <option>Select option</option>
</select>
```

## Utilities

Atomic utility classes for rapid prototyping.

### Layout

```html
<!-- Flex patterns -->
<div s-flex="center">Centered content</div>
<div s-flex="between">Space between items</div>
<div s-flex="col gap-4">Column with gap</div>

<!-- Grid -->
<div s-grid="3">Three columns</div>
<div s-grid="auto">Auto-fit columns</div>

<!-- Container -->
<div s-container>Centered max-width container</div>
```

### Spacing

```html
<!-- Margin -->
<div class="s-m-4">All sides margin</div>
<div class="s-mx-auto">Horizontal auto (centering)</div>
<div class="s-mt-8 s-mb-4">Top and bottom</div>

<!-- Padding -->
<div class="s-p-6">All sides padding</div>
<div class="s-px-4 s-py-2">Horizontal and vertical</div>

<!-- Gap (for flex/grid) -->
<div s-flex class="s-gap-4">Items with gap</div>
```

### Typography

```html
<p class="s-text-lg s-font-semibold">Large semibold text</p>
<p class="s-text-sm s-leading-relaxed">Small relaxed text</p>
<p class="s-truncate">Text that truncates...</p>
```

## Customization

### Change Brand Colors

Override seed hues to transform your entire palette:

```css
:root {
  --shift-hue-primary: 280; /* Purple */
  --shift-hue-secondary: 200; /* Teal */
  --shift-hue-accent: 45; /* Gold */
  --shift-hue-neutral: 280; /* Purple-tinted grays */
}
```

### Override Individual Tokens

Fine-tune specific colors or semantic mappings:

```css
:root {
  /* Override a specific shade */
  --s-primary-500: oklch(0.65 0.18 275);

  /* Override semantic tokens */
  --s-surface-base: var(--s-neutral-100);
  --s-interactive-primary: var(--s-accent-600);
}
```

### Component-Level Customization

Components expose internal custom properties:

```css
/* Global button customization */
[s-btn] {
  --_btn-radius: var(--s-radius-full);
}

/* Specific variant */
[s-btn="primary"] {
  --_btn-bg: var(--s-accent-600);
}
```

## Design Tokens

### Color Scales

Seven color scales, each with 11 shades (50-950):

| Scale       | Default Hue  | Purpose                |
| ----------- | ------------ | ---------------------- |
| `primary`   | 250 (Blue)   | Brand, primary actions |
| `secondary` | 180 (Cyan)   | Secondary actions      |
| `accent`    | 30 (Orange)  | Highlights, accents    |
| `success`   | 145 (Green)  | Success states         |
| `warning`   | 45 (Amber)   | Warning states         |
| `danger`    | 25 (Red)     | Error states           |
| `neutral`   | 250 (Tinted) | Backgrounds, text      |

### Spacing Scale

```css
--s-space-0: 0;
--s-space-1: 0.25rem; /* 4px */
--s-space-2: 0.5rem; /* 8px */
--s-space-4: 1rem; /* 16px */
--s-space-8: 2rem; /* 32px */
/* ... up to 96 */
```

### Border Radius

```css
--s-radius-none: 0;
--s-radius-sm: 0.125rem;
--s-radius-base: 0.25rem;
--s-radius-md: 0.375rem;
--s-radius-lg: 0.5rem;
--s-radius-xl: 0.75rem;
--s-radius-2xl: 1rem;
--s-radius-3xl: 1.5rem;
--s-radius-full: 9999px;
```

## Browser Support

Shift CSS targets cutting-edge browsers to leverage modern CSS features:

| Browser | Minimum Version |
| ------- | --------------- |
| Chrome  | 131+            |
| Firefox | 133+            |
| Safari  | 18+             |
| Edge    | 131+            |

### Features Used

- CSS `light-dark()` function
- OKLCH color space
- CSS Cascade Layers (`@layer`)
- Container Queries
- `contrast-color()` (progressive enhancement)

## Bundle Size

| File            | Size   |
| --------------- | ------ |
| `shift.css`     | 54 KB  |
| `shift.min.css` | 40 KB  |
| Gzipped         | ~10 KB |

**Target**: Under 15 KB gzipped

### Modular Imports

Import only what you need:

```css
/* Reset only */
@import "@shift-css/core/reset";

/* Tokens only */
@import "@shift-css/core/tokens";
```

## Project Structure

```
shift-css/
├── packages/
│   ├── core/              # Main CSS framework (@shift-css/core)
│   │   ├── src/
│   │   │   ├── base/      # Reset, typography
│   │   │   ├── tokens/    # Generated CSS properties
│   │   │   ├── components/# Surface, Button, Card, Input
│   │   │   └── utils/     # Layout, spacing, typography
│   │   ├── tokens/        # JSON token definitions
│   │   └── dist/          # Built output
│   └── cli/               # CLI tool (@shift-css/cli)
│       └── src/           # Framework detection & migration
└── apps/docs/             # Documentation site
```

## Development

```bash
# Install dependencies
bun install

# Build framework
bun run build

# Development with watch mode
bun run dev

# Run tests
bun run test

# Documentation site
bun run docs:dev
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed development guidelines.

## Contributing

We welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md) for details on:

- Development setup
- Code style guidelines
- Commit message format
- Pull request process
- Testing requirements

## License

[MIT](LICENSE) - Created by the Shift CSS team.

## Acknowledgments

Shift CSS is built on the shoulders of modern CSS innovations:

- [OKLCH Color Space](https://oklch.com/) for perceptually uniform colors
- [CSS Cascade Layers](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer) for clean specificity
- [CSS `light-dark()`](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/light-dark) for native theming
- [Lightning CSS](https://lightningcss.dev/) for blazing fast builds

---

**Shift CSS** - The future of CSS frameworks is already here.
