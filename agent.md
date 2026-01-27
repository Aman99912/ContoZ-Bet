# Coding Guidelines & Standards

## 1. Component Usage
- **Strictly** use common components from `src/components/common` for all UI elements.
  - `CText` for all text.
  - `CInput` for text inputs.
  - `CCard` for containers/cards.
  - `Header` for screen headers.
  - `BackButton` for navigation back buttons.
- Do **not** use raw `Text`, `TextInput`, or `View` (unless for layout wrappers) if a common component exists.

## 2. Styling & Theming
- **NO Hardcoded Colors**: Always import `colors` from `src/core/theme/colors.js`.
- **Responsive Design**: Use scaling utilities for all dimensions:
  - `moderateScale(size)` for font sizes, padding, margins, borderRadius.
  - `verticalScale(size)` for heights or vertical spacing.
  - Import from `src/core/utils/responsive`.

## 3. Folder Structure
- Maintain a clean, production-grade structure.
- Group related files (screens, components).
- Ensure `index.js` exports for clean imports.

## 4. Best Practices
- Functional Components with Hooks.
- Clean navigation usage.
- Modularize logic where possible.
- **Imports**: Use `@/` alias for absolute imports (e.g. `import { colors } from '@/core/theme/colors';`).
