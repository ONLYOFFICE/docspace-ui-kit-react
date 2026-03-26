# useCloseOnAnchorCovered

Hook for automatically closing a popup when its anchor element becomes covered or leaves the viewport.

Uses a continuous `requestAnimationFrame` loop — catches any cause of position change: scroll, touch scroll, programmatic scroll, or layout changes.

## Basic Usage

```tsx
import { useCloseOnAnchorCovered } from "@docspace/ui-kit/hooks/useCloseOnAnchorCovered";

const MyPopup = ({ anchorRef, onClose }) => {
  useCloseOnAnchorCovered({
    anchorRef,
    onClose,
  });

  return <div>Popup content</div>;
};
```

## Advanced Usage with Custom Coverage Check

```tsx
import { useCloseOnAnchorCovered, isElementCovered } from "@docspace/ui-kit/hooks/useCloseOnAnchorCovered";

const MyPopup = ({ anchorRef, onClose }) => {
  const customCoverageCheck = (element: HTMLElement) => {
    return isElementCovered(element); // or your own logic
  };

  useCloseOnAnchorCovered({
    anchorRef,
    onClose,
    isElementCovered: customCoverageCheck,
    enabled: true,
  });

  return <div>Popup content</div>;
};
```

## Parameters

- `anchorRef` — Reference to the anchor element that triggers the popup
- `onClose` — Callback function to close the popup
- `isElementCovered` — Optional custom check function (default: built-in implementation)
- `enabled` — Optional boolean to enable/disable the hook (default: `true`)

## Exported Utilities

### `isElementCovered(element: HTMLElement): boolean`

Default implementation that checks if an element is covered or outside the viewport.

**Checks:**
- Element is outside viewport boundaries
- Element is covered by another element at its center-top point

## Features

- Continuous `requestAnimationFrame` loop — reacts to any layout change without events
- Uses `useEffectEvent` for stable callbacks — loop restarts only when `enabled` changes
- Automatically stops when `onClose` is called
