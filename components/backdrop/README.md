# Backdrop

A flexible backdrop component that provides a customizable overlay for modals, dialogs, and aside components. The component supports multiple instances, touch events, and responsive behavior for mobile and tablet devices.

## Features

- Customizable background and blur effects
- Responsive design with mobile/tablet support
- Configurable z-index for proper stacking
- Multiple backdrop support for aside components
- Touch event handling for mobile devices
- Theme-aware with light/dark mode support

## Usage

```tsx
import { Backdrop } from "@docspace/ui-kit/components/backdrop";

// Basic usage
<Backdrop visible onClick={handleBackdropClick} />

// With modal dialog
<Backdrop
  visible
  isModalDialog
  withBackground
  zIndex={1000}
  onClick={handleBackdropClick}
/>

// With aside component
<Backdrop
  visible
  isAside
  withBackground
  onClick={handleBackdropClick}
/>
```

## Properties

| Prop                 | Type                            | Default | Description                                              |
|----------------------|---------------------------------|---------|----------------------------------------------------------|
| `visible`            | `boolean`                       | `false` | Controls the visibility of the backdrop                  |
| `zIndex`             | `number`                        | `203`   | Sets the z-index CSS property for stacking context       |
| `className`          | `string \| string[]`            | -       | Custom CSS class name(s) to apply                        |
| `id`                 | `string`                        | -       | HTML id attribute for the backdrop element               |
| `style`              | `React.CSSProperties`           | -       | Custom inline styles                                     |
| `withBackground`     | `boolean`                       | `false` | Enables background visibility                            |
| `isAside`            | `boolean`                       | `false` | Indicates backdrop is used with an Aside component       |
| `withoutBackground`  | `boolean`                       | `false` | Forces backdrop to render without background             |
| `isModalDialog`      | `boolean`                       | `false` | Indicates backdrop is used with a modal dialog           |
| `shouldShowBackdrop` | `boolean`                       | `false` | Forces the backdrop to show regardless of existing count |
| `onClick`            | `(e: React.MouseEvent) => void` | -       | Click event handler                                      |

## Styling

The component uses CSS modules with CSS variables for theming:

```css
--backdrop-background-color
```

Theme values:
- Light theme: `rgba(6, 22, 38, 0.2)`
- Dark theme: `rgba(27, 27, 27, 0.6)`

## Examples

### Modal Dialog

```tsx
import { useState } from "react";
import { Backdrop } from "@docspace/ui-kit/components/backdrop";

const ModalExample = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>
      <Backdrop
        visible={isOpen}
        isModalDialog
        withBackground
        onClick={() => setIsOpen(false)}
      />
      {isOpen && (
        <div className="modal">
          Modal Content
        </div>
      )}
    </>
  );
};
```

### Multiple Backdrops with Aside

```tsx
import { useState } from "react";
import { Backdrop } from "@docspace/ui-kit/components/backdrop";

const AsideExample = () => {
  const [isFirstOpen, setFirstOpen] = useState(false);
  const [isSecondOpen, setSecondOpen] = useState(false);

  return (
    <>
      <button onClick={() => setFirstOpen(true)}>Open First Aside</button>
      <button onClick={() => setSecondOpen(true)}>Open Second Aside</button>

      <Backdrop
        visible={isFirstOpen}
        isAside
        withBackground
        onClick={() => setFirstOpen(false)}
      />
      <Backdrop
        visible={isSecondOpen}
        isAside
        withBackground
        onClick={() => setSecondOpen(false)}
      />

      {isFirstOpen && <aside>First Aside Content</aside>}
      {isSecondOpen && <aside>Second Aside Content</aside>}
    </>
  );
};
```

### Custom Z-Index

```tsx
<Backdrop
  visible={isOpen}
  withBackground
  zIndex={500}
  onClick={() => setIsOpen(false)}
/>
```

### Without Blur (Context Menu)

```tsx
<Backdrop
  visible={isContextMenuOpen}
  withoutBlur
  onClick={() => setContextMenuOpen(false)}
/>
```

### Force Show Backdrop

```tsx
// Force backdrop to show even if other backdrops exist
<Backdrop
  visible={isOpen}
  shouldShowBackdrop
  withBackground
  onClick={() => setIsOpen(false)}
/>
```

## Mobile and Tablet Support

The component automatically adjusts its behavior for mobile and tablet devices:

- Automatically shows background on mobile/tablet devices unless `withoutBlur` is set
- Handles touch events appropriately for modal dialogs
- Prevents default touch behavior for non-modal backdrops to avoid scrolling issues

## Backdrop Stacking

The component intelligently manages multiple backdrops:

| Scenario | Behavior |
|----------|----------|
| Default (no `isAside`) | Only one backdrop displayed at a time |
| With `isAside` | Up to two backdrops can be displayed simultaneously |
| With `shouldShowBackdrop` | Forces backdrop to display regardless of count |

## Notes

- When using multiple backdrops with `isAside`, up to two backdrops can be displayed simultaneously
- `withoutBackground` takes precedence over `withBackground`
- Touch events are prevented by default unless `isModalDialog` is true
- The backdrop adds `backdrop-active` and `not-selectable` classes for styling hooks
