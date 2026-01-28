# Coding Guidelines & Standards

## 1. Component Usage
- **Strictly** use common components from `src/components/common` for all UI elements.
  - `CText` for all text.
  - `CInput` for text inputs.
  - `CCard` for containers/cards.
  - `Header` for screen headers.
  - `BackButton` for navigation back buttons.
- Do **not** use raw `Text`, `TextInput`, or `View` (unless for layout wrappers) if a common component exists.

## 2. SafeAreaView Usage
- **ALWAYS** use `SafeAreaView` from `react-native-safe-area-context` for all screens.
- **NEVER** use `SafeAreaView` from `react-native`.
- Import: `import { SafeAreaView } from 'react-native-safe-area-context';`
- Use `edges={['top']}` prop when needed for specific edge control.

## 3. Styling & Theming
- **NO Hardcoded Colors**: Always import `colors` from `src/core/theme/colors.js`.
- **Responsive Design**: Use scaling utilities for all dimensions:
  - `moderateScale(size)` for font sizes, padding, margins, borderRadius.
  - `verticalScale(size)` for heights or vertical spacing.
  - Import from `src/core/utils/responsive`.

## 4. Shadow/Glow Effects
- Add subtle shadow effects to cards, buttons, and important UI elements for depth.
- Standard shadow pattern:
  ```javascript
  shadowColor: colors.primary, // or '#000' for neutral
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3, // For Android
  ```

## 5. Razorpay Integration
- Use the reusable Razorpay component from `src/features/payments/Razorpay.js`.
- API keys are stored in `.env` file and loaded via `razorpay.config.js`.
- Example usage:
  ```javascript
  import { initiateRazorpayPayment } from '@/features/payments/Razorpay';
  
  initiateRazorpayPayment({
      amount: 50000, // in paise
      orderId: 'order_id',
      prefill: { name, email, contact },
      onSuccess: (response) => { /* handle success */ },
      onError: (error) => { /* handle error */ },
  });
  ```

## 6. Folder Structure
- Maintain a clean, production-grade structure.
- Group related files (screens, components).
- Ensure `index.js` exports for clean imports.

## 7. Best Practices
- Functional Components with Hooks.
- Clean navigation usage.
- Modularize logic where possible.
- **Imports**: Use `@/` alias for absolute imports (e.g. `import { colors } from '@/core/theme/colors';`).
- Add proper headers with back buttons to all sub-screens.
- Use consistent spacing and alignment throughout the app.
