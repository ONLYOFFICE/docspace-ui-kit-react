# useCloseOnAnchorCovered

Hook for automatically closing a popup when its anchor element becomes covered during scroll.

## Basic Usage

```tsx
import { useCloseOnAnchorCovered } from "@docspace/ui-kit/hooks/useCloseOnAnchorCovered";

const MyPopup = ({ anchorRef, onClose }) => {
  const popupRef = useRef<HTMLDivElement>(null);

  // Uses default isElementCovered implementation
  useCloseOnAnchorCovered({
    anchorRef,
    popupRef,
    onClose,
  });

  return <div ref={popupRef}>Popup content</div>;
};
```

## Advanced Usage with Custom Coverage Check

```tsx
import { useCloseOnAnchorCovered, isElementCovered } from "@docspace/ui-kit/hooks/useCloseOnAnchorCovered";

const MyPopup = ({ anchorRef, onClose }) => {
  const popupRef = useRef<HTMLDivElement>(null);

  // Custom logic to check if element is covered
  const customCoverageCheck = (element: HTMLElement) => {
    // Your custom implementation
    return isElementCovered(element); // or your own logic
  };

  useCloseOnAnchorCovered({
    anchorRef,
    popupRef,
    onClose,
    isElementCovered: customCoverageCheck,
    enabled: true,
  });

  return <div ref={popupRef}>Popup content</div>;
};
```

## Parameters

- `anchorRef` - Reference to the anchor element that triggers the popup
- `popupRef` - Reference to the popup element itself
- `onClose` - Callback function to close the popup
- `isElementCovered` - Optional function to determine if the anchor element is covered by other elements (default: built-in implementation)
- `enabled` - Optional boolean to enable/disable the hook (default: `true`)

## Exported Utilities

### `isElementCovered(element: HTMLElement): boolean`

Default implementation that checks if an element is covered by other elements or outside the viewport.

**Checks:**
- If element is outside viewport boundaries
- If element is covered by another element at its center-top point

## Features

- Uses `requestAnimationFrame` for optimal performance
- Implements throttling to prevent excessive checks
- Ignores scroll events inside the popup itself
- Passive event listener for better scroll performance
