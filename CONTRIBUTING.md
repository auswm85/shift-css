# Contributing to Shift CSS

Thank you for your interest in contributing to Shift CSS! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Code Style](#code-style)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Release Process](#release-process)
- [Getting Help](#getting-help)

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment. We expect all contributors to:

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) v1.0 or higher
- [Node.js](https://nodejs.org/) v20 or higher (for compatibility)
- A modern browser for testing (Chrome 131+, Firefox 133+, or Safari 18+)

### Quick Setup

```bash
# Clone the repository
git clone https://github.com/auswm85/shift-css.git
cd shift-css

# Install dependencies
bun install

# Build the framework
bun run build

# Start development mode
bun run dev
```

## Development Setup

### Install Dependencies

```bash
bun install
```

This installs dependencies for both the core package and documentation site.

### Build Commands

```bash
# Full build (tokens + CSS bundle)
bun run build

# Generate tokens only
cd packages/core && bun run build:tokens

# Development with watch mode
bun run dev

# Build documentation site
bun run docs:build
```

### Development Server

```bash
# Start docs dev server (includes live framework preview)
bun run docs:dev
```

The documentation site at `http://localhost:4321` serves as the primary development environment, showcasing all components and utilities.

## Project Structure

```
shift-css/
├── packages/
│   └── core/                    # @shift-css/core package
│       ├── src/
│       │   ├── index.css        # Layer orchestration entry
│       │   ├── base/
│       │   │   └── reset.css    # Browser reset, fluid typography
│       │   ├── tokens/
│       │   │   └── tokens.css   # Generated CSS custom properties
│       │   ├── components/
│       │   │   ├── surface.css  # Surface component
│       │   │   ├── button.css   # Button component
│       │   │   ├── card.css     # Card component
│       │   │   └── input.css    # Input component
│       │   └── utils/
│       │       ├── layout.css   # Flex, grid, container
│       │       ├── spacing.css  # Margin, padding, gap
│       │       ├── typography.css
│       │       ├── flex.css
│       │       └── visibility.css
│       ├── tokens/              # Token definitions (JSON)
│       │   ├── colors.json      # Color scales and hues
│       │   ├── semantic.json    # Light/dark mappings
│       │   └── spacing.json     # Spacing and radius
│       ├── scripts/
│       │   ├── generate-colors.ts  # Token generator
│       │   ├── build.ts            # CSS bundler
│       │   └── utils.ts            # Helper functions
│       ├── tests/
│       │   ├── e2e/             # Playwright tests
│       │   ├── utils.test.ts    # Unit tests
│       │   └── generator.test.ts
│       └── dist/                # Built output
├── apps/
│   └── docs/                    # Astro documentation site
├── .changeset/                  # Changeset files
├── biome.json                   # Linter/formatter config
└── package.json                 # Root workspace config
```

## Development Workflow

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

Branch naming conventions:

- `feature/` - New features or components
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Test additions or modifications

### 2. Make Your Changes

#### Adding a New Component

1. Create the CSS file in `packages/core/src/components/`
2. Import it in `packages/core/src/index.css`
3. Add documentation in `apps/docs/src/content/docs/components/`
4. Add visual tests in `packages/core/tests/e2e/`
5. Update the README if needed

#### Modifying Tokens

1. Edit the appropriate JSON file in `packages/core/tokens/`
2. Run `bun run build:tokens` to regenerate CSS
3. Verify changes in the documentation site
4. Update visual regression snapshots if needed

#### Adding Utilities

1. Create or modify CSS in `packages/core/src/utils/`
2. Follow the existing naming pattern (`s-` prefix)
3. Add documentation in `apps/docs/src/content/docs/utilities/`

### 3. Test Your Changes

```bash
# Run all tests
bun run test

# Specific test suites
bun run test:unit        # Unit tests
bun run test:e2e         # E2E tests
bun run test:visual      # Visual regression
bun run test:a11y        # Accessibility
bun run test:contrast    # Color contrast
```

### 4. Lint and Format

```bash
# Check for issues
bun run lint

# Auto-fix issues
bun run lint:fix

# Format code
bun run format
```

### 5. Create a Changeset

For any user-facing changes, create a changeset:

```bash
bun run changeset
```

Follow the prompts to:

1. Select the package(s) affected
2. Choose the version bump type (patch/minor/major)
3. Write a description of your changes

## Code Style

### CSS Guidelines

#### Naming Conventions

- **Components**: Use attribute selectors with `s-` prefix

  ```css
  [s-btn] {
  }
  [s-btn="primary"] {
  }
  ```

- **Utilities**: Use class selectors with `s-` prefix

  ```css
  .s-flex {
  }
  .s-m-4 {
  }
  ```

- **Internal properties**: Use `--_` prefix for component-scoped variables
  ```css
  [s-btn] {
    --_btn-bg: var(--s-primary-600);
  }
  ```

#### Layer Organization

All CSS must be wrapped in appropriate layers:

```css
@layer shift.core {
  /* Component styles */
}

@layer shift.utils {
  /* Utility styles */
}
```

#### Token Usage

Always use design tokens instead of hardcoded values:

```css
/* Good */
padding: var(--s-space-4);
color: var(--s-text-primary);
border-radius: var(--s-radius-md);

/* Avoid */
padding: 1rem;
color: #333;
border-radius: 6px;
```

#### Progressive Enhancement

For cutting-edge features, provide fallbacks:

```css
[s-component] {
  /* Fallback first */
  color: var(--s-text-primary);

  /* Enhancement */
  @supports (color: contrast-color(black)) {
    color: contrast-color(var(--_bg));
  }
}
```

### TypeScript Guidelines

- Use strict TypeScript
- Prefer `const` over `let`
- Use meaningful variable names
- Add JSDoc comments for public functions

### JSON Token Guidelines

- Use descriptive names
- Group related tokens
- Document the purpose of each scale
- Maintain consistent structure

## Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

[optional body]

[optional footer]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: CSS/formatting changes (no logic change)
- `refactor`: Code refactoring
- `test`: Test additions or modifications
- `chore`: Build process or tooling changes
- `perf`: Performance improvements

### Examples

```
feat(button): add outline variant

fix(surface): correct auto-contrast calculation for dark backgrounds

docs(readme): add customization examples

style(tokens): reorganize color scale comments

refactor(build): simplify token generation pipeline

test(visual): add snapshot tests for card component

chore(deps): update lightning-css to v1.28
```

## Pull Request Process

### Before Submitting

1. **Ensure all tests pass**: `bun run test`
2. **Lint your code**: `bun run lint`
3. **Update documentation** if needed
4. **Create a changeset** for user-facing changes
5. **Update snapshots** if visual changes are intentional:
   ```bash
   bun run test:update-snapshots
   ```

### PR Title

Follow the commit message format:

```
feat(component): add new feature description
```

### PR Description

Include:

- **Summary**: What does this PR do?
- **Motivation**: Why is this change needed?
- **Changes**: List of specific changes
- **Testing**: How was this tested?
- **Screenshots**: For visual changes

### Review Process

1. A maintainer will review your PR
2. Address any requested changes
3. Once approved, a maintainer will merge
4. Your changes will be included in the next release

## Testing

### Test Structure

```
packages/core/tests/
├── e2e/
│   ├── accessibility.a11y.ts    # WCAG compliance
│   ├── contrast.contrast.ts     # Color contrast
│   ├── components.visual.ts     # Component visuals
│   └── fixtures/                # Test HTML files
├── utils.test.ts                # Utility functions
└── generator.test.ts            # Token generation
```

### Running Tests

```bash
# All tests
bun run test

# Unit tests only
bun run test:unit

# Visual regression (Chrome)
bun run test:visual

# All visual tests (Chrome, Firefox, Mobile)
bun run test:visual:all

# Accessibility tests
bun run test:a11y

# Contrast validation
bun run test:contrast

# Update snapshots
bun run test:update-snapshots
```

### Writing Tests

#### Visual Tests

```typescript
test("component renders correctly", async ({ page }) => {
  await page.goto("/fixtures/component.html");
  await expect(page.locator("[s-component]")).toHaveScreenshot();
});
```

#### Accessibility Tests

```typescript
test("component is accessible", async ({ page }) => {
  await page.goto("/fixtures/component.html");
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
```

### Test Requirements

- All new components must have visual regression tests
- All interactive components must have accessibility tests
- Contrast tests for any new color combinations
- Unit tests for utility functions

## Release Process

Releases are managed through [Changesets](https://github.com/changesets/changesets).

### Creating a Release (Maintainers)

1. **Merge changesets**: PRs with changesets are merged to `main`

2. **Version packages**:

   ```bash
   bun run version
   ```

   This consumes changesets and updates package versions.

3. **Review changes**: Check `CHANGELOG.md` and version bumps

4. **Publish**:
   ```bash
   bun run release
   ```
   This builds and publishes to npm.

### Versioning

- **Patch** (0.0.X): Bug fixes, documentation
- **Minor** (0.X.0): New features, components, utilities
- **Major** (X.0.0): Breaking changes

## Getting Help

- **Questions**: Open a [Discussion](https://github.com/auswm85/shift-css/discussions)
- **Bugs**: Open an [Issue](https://github.com/auswm85/shift-css/issues)
- **Security**: Report via [GitHub Security Advisories](https://github.com/auswm85/shift-css/security/advisories)

### Resources

- [Documentation](https://auswm85.github.io/shift-css)
- [OKLCH Color Space](https://oklch.com/)
- [CSS Cascade Layers](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer)
- [Lightning CSS](https://lightningcss.dev/)

---

Thank you for contributing to Shift CSS!
