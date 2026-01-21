# @shift-css/cli

CLI tool for initializing [Shift CSS](https://getshiftcss.com) in your project.

## Installation

```bash
# Run directly with npx (recommended)
npx shift-css init

# Or install globally
npm install -g @shift-css/cli
shift-css init
```

## Usage

### `shift-css init`

Initialize Shift CSS in your project with the correct layer hierarchy.

```bash
npx shift-css init
```

**What it does:**

1. **Scans** your project for existing CSS frameworks
2. **Asks** about your project type (Greenfield or Hybrid)
3. **Configures** your brand color (presets or hex code)
4. **Creates** `shift.config.json` with your settings
5. **Scaffolds** your main stylesheet with proper cascade layers

### Example Output

```
🎨 Shift CSS Init

◇ Scanning project...
│ Detected existing CSS: bootstrap

◆ What type of project is this?
│ ○ New project (Greenfield)
│ ● Existing project (Hybrid)

◆ Choose your brand color:
│ ● Plasma (Electric Blue - High-tech default)
│ ○ Laser (Cyber-Pink - Neon futurism)
│ ○ Acid (Toxic Green - Engineering edge)
│ ○ Void (Monochrome - Industrial minimal)
│ ○ Custom

ℹ Plasma → Blue (Hue: 260)

◆ Where should the stylesheet be created?
│ src/styles/shift.css

◇ Files to create
│ Config:      shift.config.json
│ Stylesheet:  src/styles/shift.css
│ Mode:        Hybrid

◆ Proceed with initialization?
│ Yes

✓ Created shift.config.json
✓ Created src/styles/shift.css

✨ Shift CSS initialized!
```

## Color Presets

Curated themes optimized for Shift CSS:

| Preset | Hue | Visual Identity |
|--------|-----|-----------------|
| **Plasma** | 260 | Electric Blue - High-tech default |
| **Laser** | 320 | Cyber-Pink - Neon futurism |
| **Acid** | 140 | Toxic Green - Engineering edge |
| **Void** | 0 | Monochrome - Industrial minimal |

### Using Your Brand Color

Don't know OKLCH hues? Paste your hex code:

```
◆ Choose your brand color:
│ ● Custom

ℹ Hue guide: 20=Red, 90=Yellow, 140=Green, 260=Blue, 320=Purple

◆ Enter a hex code (#a855f7) or hue (0-360):
│ #a855f7

✓ Converted #a855f7 → Purple (Hue: 271)
```

The CLI auto-converts hex to OKLCH hue—use what you know, get the power of perceptually uniform colors.

## Generated Files

### shift.config.json

Configuration file storing your project settings:

```json
{
  "hues": {
    "primary": 260,
    "secondary": 280,
    "accent": 45,
    "neutral": 260
  },
  "mode": "greenfield",
  "paths": {
    "stylesheet": "src/styles/shift.css"
  },
  "version": 1
}
```

### Stylesheet (Greenfield mode)

```css
@layer shift.tokens, shift.base, shift.components, shift.utilities;

@import "@shift-css/core/tokens";
@import "@shift-css/core/base";
@import "@shift-css/core/components";
@import "@shift-css/core/utilities";

/* Your custom styles below */
```

### Stylesheet (Hybrid mode)

```css
@layer legacy, shift.tokens, shift.base, shift.components, shift.utilities;

@import "@shift-css/core/tokens";
@import "@shift-css/core/base";
@import "@shift-css/core/components";
@import "@shift-css/core/utilities";

/* Legacy framework imports - add your existing CSS here */
@layer legacy {
  /* @import "bootstrap/dist/css/bootstrap.min.css"; */
}

/* Your custom styles below */
```

## Architecture Modes

### Greenfield

For new projects without existing CSS frameworks. Shift CSS has full control over the cascade.

### Hybrid

For projects with existing CSS (Bootstrap, Tailwind, etc.). The `@layer legacy` block gives existing styles the lowest specificity, so Shift CSS can override them without `!important`.

## Framework Detection

The CLI automatically detects:

| Framework       | Detection Method                          |
| --------------- | ----------------------------------------- |
| Bootstrap       | Filename + content patterns               |
| Tailwind CSS    | Filename + content patterns (`--tw-`)     |
| Bulma           | Filename + content patterns               |
| Foundation      | Filename + content patterns               |
| Large CSS files | Files >10KB with common entry point names |

## Options

```bash
shift-css --help     # Show help
shift-css --version  # Show version
```

## License

MIT
