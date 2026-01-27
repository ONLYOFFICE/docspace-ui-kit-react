# DOM Helpers

Utility class for common DOM manipulation operations including viewport measurements, element positioning, scrollbar calculations, and z-index management.

## Installation

```typescript
import DomHelpers from "@docspace/ui-kit/utils/dom-helpers";
```

## Methods

### `getViewport()`

Gets the current viewport dimensions.

**Returns:** `{ width: number, height: number }` - Viewport dimensions

**Example:**

```typescript
const { width, height } = DomHelpers.getViewport();
console.log(`Viewport: ${width}x${height}`);
```

**Note:** Returns `{ width: 0, height: 0 }` in SSR environment.

### `getOffset(el?)`

Gets the absolute offset position of an element relative to the document.

**Parameters:**
- `el?` (HTMLElement | null) - The element to get offset for

**Returns:** `{ top: number | "auto", left: number | "auto" }` - Element offset

**Example:**

```typescript
const element = document.getElementById("my-element");
const offset = DomHelpers.getOffset(element);
console.log(`Position: top=${offset.top}, left=${offset.left}`);
```

**Note:** Returns `{ top: "auto", left: "auto" }` if element is null or undefined.

### `getOuterWidth(el, margin?)`

Gets the outer width of an element, optionally including margins.

**Parameters:**
- `el` (HTMLElement) - The element to measure
- `margin?` (string) - If truthy, includes margin in calculation

**Returns:** `number` - Element width in pixels

**Example:**

```typescript
const element = document.getElementById("my-element");

// Width without margin
const width = DomHelpers.getOuterWidth(element);

// Width including margin
const widthWithMargin = DomHelpers.getOuterWidth(element, "true");
```

### `getHiddenElementOuterWidth(element)`

Gets the outer width of a hidden element by temporarily making it visible.

**Parameters:**
- `element` (HTMLElement | null) - The hidden element to measure

**Returns:** `number` - Element width in pixels

**Example:**

```typescript
const hiddenElement = document.getElementById("hidden-dropdown");
const width = DomHelpers.getHiddenElementOuterWidth(hiddenElement);
console.log(`Hidden element width: ${width}px`);
```

**Note:** This method temporarily sets `visibility: hidden` and `display: block` to measure the element, then restores original styles.

### `getHiddenElementOuterHeight(element)`

Gets the outer height of a hidden element by temporarily making it visible.

**Parameters:**
- `element` (HTMLElement | null) - The hidden element to measure

**Returns:** `number` - Element height in pixels

**Example:**

```typescript
const hiddenElement = document.getElementById("collapsed-panel");
const height = DomHelpers.getHiddenElementOuterHeight(hiddenElement);
console.log(`Hidden element height: ${height}px`);
```

### `calculateScrollbarWidth(el?)`

Calculates the scrollbar width for a specific element or the browser default.

**Parameters:**
- `el?` (HTMLElement) - Optional element to calculate scrollbar width for

**Returns:** `number` - Scrollbar width in pixels

**Example:**

```typescript
// Get browser default scrollbar width
const defaultWidth = DomHelpers.calculateScrollbarWidth();

// Get scrollbar width for a specific scrollable element
const scrollContainer = document.getElementById("scroll-container");
const containerScrollbarWidth = DomHelpers.calculateScrollbarWidth(scrollContainer);
```

**Note:** When called without an element, the result is cached for subsequent calls.

### `generateZIndex()`

Generates an incrementing z-index value for layered UI elements.

**Returns:** `number` - Next z-index value (starts at 1001)

**Example:**

```typescript
const modalZIndex = DomHelpers.generateZIndex(); // 1001
const tooltipZIndex = DomHelpers.generateZIndex(); // 1002
```

### `revertZIndex()`

Decrements the z-index counter. Call when closing layered elements.

**Example:**

```typescript
// Opening modals
const modal1ZIndex = DomHelpers.generateZIndex(); // 1001
const modal2ZIndex = DomHelpers.generateZIndex(); // 1002

// Closing modal2
DomHelpers.revertZIndex(); // Now at 1001
```

**Note:** Z-index will not go below 1000.

### `getCurrentZIndex()`

Gets the current z-index value without modifying it.

**Returns:** `number` - Current z-index value

**Example:**

```typescript
const currentZ = DomHelpers.getCurrentZIndex();
console.log(`Current z-index: ${currentZ}`);
```

## Usage Examples

### Positioning a Dropdown

```typescript
import DomHelpers from "@docspace/ui-kit/utils/dom-helpers";

function positionDropdown(trigger: HTMLElement, dropdown: HTMLElement) {
  const triggerOffset = DomHelpers.getOffset(trigger);
  const triggerWidth = DomHelpers.getOuterWidth(trigger);
  const dropdownWidth = DomHelpers.getHiddenElementOuterWidth(dropdown);
  const viewport = DomHelpers.getViewport();

  let left = triggerOffset.left as number;

  // Flip to left if would overflow right edge
  if (left + dropdownWidth > viewport.width) {
    left = (triggerOffset.left as number) + triggerWidth - dropdownWidth;
  }

  dropdown.style.top = `${(triggerOffset.top as number) + trigger.offsetHeight}px`;
  dropdown.style.left = `${left}px`;
}
```

### Managing Modal z-index Stack

```typescript
import DomHelpers from "@docspace/ui-kit/utils/dom-helpers";

class ModalManager {
  private modals: Map<string, number> = new Map();

  open(modalId: string, element: HTMLElement) {
    const zIndex = DomHelpers.generateZIndex();
    this.modals.set(modalId, zIndex);
    element.style.zIndex = String(zIndex);
  }

  close(modalId: string) {
    if (this.modals.has(modalId)) {
      this.modals.delete(modalId);
      DomHelpers.revertZIndex();
    }
  }
}
```

### Responsive Layout Calculations

```typescript
import DomHelpers from "@docspace/ui-kit/utils/dom-helpers";

function calculateGridColumns(containerWidth: number, minItemWidth: number) {
  const scrollbarWidth = DomHelpers.calculateScrollbarWidth();
  const availableWidth = containerWidth - scrollbarWidth;
  return Math.floor(availableWidth / minItemWidth);
}

function updateLayout() {
  const viewport = DomHelpers.getViewport();
  const columns = calculateGridColumns(viewport.width, 200);
  console.log(`Grid columns: ${columns}`);
}
```

### Measuring Hidden Content

```typescript
import DomHelpers from "@docspace/ui-kit/utils/dom-helpers";

function animateHeight(element: HTMLElement, show: boolean) {
  if (show) {
    const targetHeight = DomHelpers.getHiddenElementOuterHeight(element);
    element.style.height = "0px";
    element.style.display = "block";

    requestAnimationFrame(() => {
      element.style.transition = "height 300ms ease";
      element.style.height = `${targetHeight}px`;
    });
  } else {
    element.style.height = "0px";
    element.addEventListener(
      "transitionend",
      () => {
        element.style.display = "none";
      },
      { once: true }
    );
  }
}
```

## Static Properties

| Property | Type | Description |
|----------|------|-------------|
| `calculatedScrollbarWidth` | `number \| null` | Cached browser scrollbar width |
| `zIndex` | `number` | Current z-index counter value |

## SSR Considerations

- `getViewport()` returns `{ width: 0, height: 0 }` when `window` is undefined
- Other methods that access DOM should only be called on the client side
- Use `checkIsSSR()` from device utilities before calling these methods in SSR contexts

## Related

- [Device Utilities](../device/README.md) - Screen size detection and media queries
- [MDN: Element.getBoundingClientRect](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect)
- [MDN: Window.pageYOffset](https://developer.mozilla.org/en-US/docs/Web/API/Window/pageYOffset)
