# Shift CSS Selector Specification v1.0

## 1. Core Philosophy

Shift CSS moves away from the "modifier class" pattern (e.g., `.btn-primary`) in favor of **Semantic Attribute Modules**. This creates a strict, declarative API for UI components that is easier to maintain and nearly impossible to break with conflicting classes.

- **Namespace:** All framework attributes are prefixed with `s-`.
- **Logic Over Description:** Attributes define _what_ an element is and its _state_, not just its look.
- **Low Specificity:** All base styles are wrapped in `:where()` to ensure zero-friction user overrides.

---

## 2. Global Attribute Map

| Attribute   | Purpose         | Values                                  | Example                        |
| :---------- | :-------------- | :-------------------------------------- | :----------------------------- |
| `s-btn`     | Button type     | `primary`, `secondary`, `ghost`, `link` | `<button s-btn="primary">`     |
| `s-size`    | Component scale | `sm`, `md`, `lg`, `xl`                  | `<div s-card s-size="lg">`     |
| `s-surface` | Depth/Layering  | `sunken`, `flat`, `raised`, `floating`  | `<section s-surface="raised">` |
| `s-grid`    | Layout engine   | `1` through `12` (columns)              | `<div s-grid="3">`             |
| `[active]`  | Boolean state   | N/A (Presence only)                     | `<nav s-link active>`          |

---

## 3. Implementation Blueprint (CSS)

### A. The Component Base

We use `:where()` to keep specificity identical to a single class while allowing easy overrides.

```css
@layer shift.core {
  /* Base Button Definition */
  :where([s-btn]) {
    --s-btn-bg: var(--s-gray-100);
    --s-btn-color: var(--s-gray-900);

    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: var(--s-space-2) var(--s-space-4);
    background: var(--s-btn-bg);
    color: var(--s-btn-color);
    border-radius: var(--s-radius);
    transition: scale 0.1s ease;
  }

  /* Variant Logic */
  [s-btn="primary"] {
    --s-btn-bg: oklch(from var(--s-primary) l c h);
    --s-btn-color: white;
  }

  /* Sizing Logic */
  [s-size="lg"] {
    padding: var(--s-space-4) var(--s-space-8);
    font-size: var(--s-font-lg);
  }

  /* Modern State Handling */
  [s-btn]:active {
    scale: 0.97;
  }
}
```
