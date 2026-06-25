# Device Utilities

Device detection and responsive design utilities for detecting screen sizes, device types, and handling SSR scenarios.

## Installation

```typescript
import {
  isMobile,
  isTablet,
  isDesktop,
  isMobileDevice,
  isTouchDevice,
  checkIsSSR,
  mobile,
  tablet,
  desktop,
  size,
} from "@docspace/ui-kit/utils/device";
```

## Constants

### Breakpoint Sizes

```typescript
size = {
  mobile: 600, // Mobile max width
  desktop: 1024, // Desktop min width
  // Tablet is between mobile and desktop (600px - 1024px)
};
```

### Layout Constants

```typescript
INFO_PANEL_WIDTH = 400; // Width of info panel
MAX_INFINITE_LOADER_SHIFT = 800; // Max shift for infinite loader
```

### Media Query Strings

Pre-defined media query strings for use with styled-components or CSS:

```typescript
mobile = "(max-width: 600px)";
mobileMore = "(min-width: 600px)";
tablet = "(max-width: 1023.9px)";
desktop = "(min-width: 1024px)";
transitionalScreenSize = "(max-width: 1424px)"; // desktop + INFO_PANEL_WIDTH
```

## Functions

### `checkIsSSR()`

Checks if the code is running in a server-side rendering environment.

**Returns:** `boolean` - `true` if running on server, `false` if in browser

**Example:**

```typescript
if (checkIsSSR()) {
  // Skip client-only code
  return null;
}

// Safe to access window/document
const width = window.innerWidth;
```

### `isMobile(width?)`

Checks if the viewport is mobile-sized (<=600px).

**Parameters:**

- `width?` (number) - Optional width to check. Defaults to `window.innerWidth`

**Returns:** `boolean` - `true` if mobile-sized

**Example:**

```typescript
// Check current viewport
if (isMobile()) {
  console.log("Mobile layout");
}

// Check specific width
if (isMobile(500)) {
  console.log("500px is mobile size");
}
```

### `isMobileDevice()`

Checks if the device is mobile, accounting for screen orientation. Uses device orientation to calculate true width regardless of rotation.

**Returns:** `boolean` - `true` if mobile device

**Example:**

```typescript
if (isMobileDevice()) {
  // Mobile-specific behavior
  enableTouchOptimizations();
}
```

**Note:** This function uses `window.screen.orientation.angle` or `window.orientation` to calculate the true device width, making it more accurate than `isMobile()` for rotated devices.

### `isTablet(width?)`

Checks if the viewport is tablet-sized (601px - 1023px).

**Parameters:**

- `width?` (number) - Optional width to check. Defaults to `window.innerWidth`

**Returns:** `boolean` - `true` if tablet-sized

**Example:**

```typescript
if (isTablet()) {
  console.log("Tablet layout");
}

// Check specific width
if (isTablet(768)) {
  console.log("768px is tablet size");
}
```

### `isDesktop()`

Checks if the viewport is desktop-sized (≥1024px).

**Returns:** `boolean` - `true` if desktop-sized

**Example:**

```typescript
if (isDesktop()) {
  console.log("Desktop layout");
}
```

**Note:** Returns `false` in SSR environment.

### `isTouchDevice`

Constant that detects if the device supports touch input.

**Type:** `boolean`

**Example:**

```typescript
if (isTouchDevice) {
  // Optimize for touch interactions
  button.style.minHeight = "44px"; // Larger touch target
}
```

## Usage Examples

### Responsive Component

```typescript
import { isMobile, isTablet, isDesktop } from "@docspace/ui-kit/utils/device";

function MyComponent() {
  const [layout, setLayout] = useState<"mobile" | "tablet" | "desktop">(
    "desktop"
  );

  useEffect(() => {
    const updateLayout = () => {
      if (isMobile()) {
        setLayout("mobile");
      } else if (isTablet()) {
        setLayout("tablet");
      } else {
        setLayout("desktop");
      }
    };

    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, []);

  return <div className={`layout-${layout}`}>Content</div>;
}
```

### Styled Components Media Queries

```typescript
import styled from "styled-components";
import { mobile, tablet, desktop } from "@docspace/ui-kit/utils/device";

const Container = styled.div`
  padding: 40px;

  @media ${desktop} {
    max-width: 1200px;
    margin: 0 auto;
  }

  @media ${tablet} {
    padding: 24px;
  }

  @media ${mobile} {
    padding: 16px;
  }
`;
```

### SSR-Safe Code

```typescript
import { checkIsSSR, isMobile } from "@docspace/ui-kit/utils/device";

function MyComponent() {
  // Safe to call in SSR
  if (checkIsSSR()) {
    return <div>Loading...</div>;
  }

  // Client-only code
  const mobile = isMobile();
  return <div>{mobile ? "Mobile View" : "Desktop View"}</div>;
}
```

### Touch vs Mouse Optimization

```typescript
import { isTouchDevice } from "@docspace/ui-kit/utils/device";

const Button = styled.button`
  padding: 8px 16px;

  ${isTouchDevice &&
  `
    min-height: 44px;
    min-width: 44px;
    padding: 12px 20px;
  `}
`;
```

### Device-Specific Features

```typescript
import {
  isMobileDevice,
  isTouchDevice,
  isDesktop,
} from "@docspace/ui-kit/utils/device";

function initializeApp() {
  if (isMobileDevice()) {
    // Enable mobile-specific features
    enablePullToRefresh();
  }

  if (isTouchDevice && !isDesktop()) {
    // Touch tablet or mobile
    enableSwipeGestures();
  } else if (isDesktop() && !isTouchDevice) {
    // Desktop with mouse
    enableKeyboardShortcuts();
  }
}
```

### Custom Breakpoint Hook

```typescript
import { useState, useEffect } from "react";
import { isMobile, isTablet, isDesktop } from "@docspace/ui-kit/utils/device";

export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
  });

  useEffect(() => {
    const updateBreakpoint = () => {
      setBreakpoint({
        isMobile: isMobile(),
        isTablet: isTablet(),
        isDesktop: isDesktop(),
      });
    };

    updateBreakpoint();
    window.addEventListener("resize", updateBreakpoint);
    return () => window.removeEventListener("resize", updateBreakpoint);
  }, []);

  return breakpoint;
}
```

## Breakpoint Reference

| Breakpoint   | Range          | Description             |
| ------------ | -------------- | ----------------------- |
| Mobile       | 0 - 600px      | Phone screens           |
| Tablet       | 601px - 1023px | Tablet screens          |
| Desktop      | 1024px+        | Desktop screens         |
| Transitional | Up to 1424px   | Desktop with info panel |

## SSR Considerations

When using these utilities in a server-side rendering context:

1. **Always check SSR status** - Use `checkIsSSR()` before accessing `window` or `navigator`
2. **Device detection functions** - Return safe defaults in SSR:
   - `isMobile()` returns `false` (checks if window exists)
   - `isTablet()` returns `false`
   - `isDesktop()` returns `false`
3. **Client-only constants** - `isTouchDevice` is only set on client side
4. **Hydration** - Be careful with SSR/client mismatches in responsive components

## Best Practices

1. **Performance** - Cache breakpoint checks instead of calling on every render
2. **Resize handlers** - Debounce resize event listeners for better performance
3. **Media queries** - Prefer CSS media queries over JavaScript when possible
4. **SSR compatibility** - Always check `checkIsSSR()` before using browser APIs
5. **Touch detection** - Use `isTouchDevice` for permanent features, not as a proxy for mobile

## Related

- [Styled Components Documentation](https://styled-components.com/docs/advanced#media-templates)
- [MDN: window.matchMedia](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia)
- [MDN: Screen Orientation API](https://developer.mozilla.org/en-US/docs/Web/API/Screen/orientation)

