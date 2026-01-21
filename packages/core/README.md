# @shift-css/core

A zero-runtime, OKLCH-native CSS framework with automatic theming.

[![npm version](https://img.shields.io/npm/v/@shift-css/core)](https://www.npmjs.com/package/@shift-css/core)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## Installation

```bash
npm install @shift-css/core
# or
bun add @shift-css/core
# or
pnpm add @shift-css/core
```

## Usage

```css
/* Full framework */
@import "@shift-css/core";

/* Or minified for production */
@import "@shift-css/core/min";
```

```html
<div s-surface="raised">
  <h2>Hello Shift</h2>
  <button s-btn="primary">Get Started</button>
</div>
```

No configuration, no JavaScript, no build step for customization.

## Features

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

## Customization

Override seed hues to transform your entire palette:

```css
:root {
  --shift-hue-primary: 280; /* Purple */
  --shift-hue-secondary: 200; /* Teal */
  --shift-hue-accent: 45; /* Gold */
  --shift-hue-neutral: 280; /* Purple-tinted grays */
}
```

## Modular Imports

Import only what you need:

```css
/* Reset only */
@import "@shift-css/core/reset";

/* Tokens only */
@import "@shift-css/core/tokens";
```

## Bundle Size

| File            | Size   |
| --------------- | ------ |
| `shift.css`     | ~55 KB |
| `shift.min.css` | ~41 KB |
| Gzipped         | ~10 KB |

## Browser Support

| Browser | Minimum Version |
| ------- | --------------- |
| Chrome  | 131+            |
| Firefox | 133+            |
| Safari  | 18+             |
| Edge    | 131+            |

## Documentation

Full documentation at [getshiftcss.com](https://getshiftcss.com)

## CLI

Use the CLI to initialize Shift CSS with proper cascade layers:

```bash
npx shift-css init
```

See [@shift-css/cli](https://www.npmjs.com/package/@shift-css/cli) for details.

## License

MIT
