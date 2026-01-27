# useClickOutside

A React hook for detecting clicks outside a specified element. Commonly used for closing dropdowns, modals, and popovers when the user clicks elsewhere.

## Features

- **Simple API**: Pass a ref and a callback function
- **TypeScript Support**: Fully typed with generic element support
- **Dependency Support**: Additional dependencies for re-attaching listeners
- **Auto Cleanup**: Automatically removes event listeners on unmount
- **Client-Side Only**: Marked with "use client" directive for Next.js compatibility

## Installation

```tsx
import { useClickOutside } from "@docspace/ui-kit/utils/useClickOutside";
```

## Usage

### Basic Usage

```tsx
import { useRef } from "react";
import { useClickOutside } from "@docspace/ui-kit/utils/useClickOutside";

function Dropdown() {
  const [isOpen, setIsOpen] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => {
    setIsOpen(false);
  });

  if (!isOpen) return null;

  return (
    <div ref={dropdownRef}>
      Dropdown Content
    </div>
  );
}
```

### With Additional Dependencies

You can pass additional dependencies that will cause the effect to re-run:

```tsx
import { useRef, useState } from "react";
import { useClickOutside } from "@docspace/ui-kit/utils/useClickOutside";

function Modal({ onClose, enabled }: { onClose: () => void; enabled: boolean }) {
  const modalRef = useRef<HTMLDivElement>(null);

  useClickOutside(modalRef, () => {
    if (enabled) {
      onClose();
    }
  }, enabled);

  return (
    <div ref={modalRef}>
      Modal Content
    </div>
  );
}
```

### With Different Element Types

The hook supports any HTML element type:

```tsx
// With a div
const divRef = useRef<HTMLDivElement>(null);
useClickOutside(divRef, handleClose);

// With a form
const formRef = useRef<HTMLFormElement>(null);
useClickOutside(formRef, handleClose);

// With a section
const sectionRef = useRef<HTMLElement>(null);
useClickOutside(sectionRef, handleClose);
```

## API Reference

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `ref` | `RefObject<T \| null>` | Yes | React ref attached to the element to monitor |
| `handler` | `VoidFunction` | Yes | Callback function called when click outside is detected |
| `...deps` | `DependencyList` | No | Additional dependencies for the effect |

### Type Signature

```tsx
function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T | null>,
  handler: VoidFunction,
  ...deps: DependencyList
): void;
```

## Examples

### Dropdown Menu

```tsx
import { useRef, useState } from "react";
import { useClickOutside } from "@docspace/ui-kit/utils/useClickOutside";

function DropdownMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useClickOutside(menuRef, () => setIsOpen(false));

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>
        Toggle Menu
      </button>
      {isOpen && (
        <div ref={menuRef}>
          <ul>
            <li>Option 1</li>
            <li>Option 2</li>
            <li>Option 3</li>
          </ul>
        </div>
      )}
    </div>
  );
}
```

### Modal Dialog

```tsx
import { useRef } from "react";
import { useClickOutside } from "@docspace/ui-kit/utils/useClickOutside";

function Modal({ isOpen, onClose, children }) {
  const modalRef = useRef<HTMLDivElement>(null);

  useClickOutside(modalRef, onClose);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div ref={modalRef} className="modal-content">
        {children}
      </div>
    </div>
  );
}
```

### Popover with Conditional Handler

```tsx
import { useRef, useState } from "react";
import { useClickOutside } from "@docspace/ui-kit/utils/useClickOutside";

function Popover({ canClose = true }) {
  const [isVisible, setIsVisible] = useState(true);
  const popoverRef = useRef<HTMLDivElement>(null);

  useClickOutside(
    popoverRef,
    () => {
      if (canClose) {
        setIsVisible(false);
      }
    },
    canClose
  );

  if (!isVisible) return null;

  return (
    <div ref={popoverRef}>
      Popover Content
    </div>
  );
}
```

### Context Menu

```tsx
import { useRef, useState, useEffect } from "react";
import { useClickOutside } from "@docspace/ui-kit/utils/useClickOutside";

function ContextMenu() {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useClickOutside(menuRef, () => setPosition(null));

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      setPosition({ x: e.clientX, y: e.clientY });
    };

    document.addEventListener("contextmenu", handleContextMenu);
    return () => document.removeEventListener("contextmenu", handleContextMenu);
  }, []);

  if (!position) return null;

  return (
    <div
      ref={menuRef}
      style={{ position: "fixed", left: position.x, top: position.y }}
    >
      <ul>
        <li>Cut</li>
        <li>Copy</li>
        <li>Paste</li>
      </ul>
    </div>
  );
}
```

## How It Works

1. The hook adds a `mousedown` event listener to the document
2. When a click occurs, it checks if the click target is outside the referenced element
3. If the click is outside, the handler function is called
4. The event listener is automatically removed when the component unmounts

## Notes

- Uses `mousedown` event (not `click`) for earlier detection
- The handler is not called if `ref.current` is `null`
- Works with nested elements - clicking on children won't trigger the handler
- Re-attaches the listener when `ref`, `handler`, or any dependency changes

## Related

- [Portal Component](../../components/portal/README.md) - For rendering modals outside the DOM hierarchy
- [Tooltip Component](../../components/tooltip/README.md) - Uses click outside for dismissal
