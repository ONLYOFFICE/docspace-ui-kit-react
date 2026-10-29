# useFocusTrap Hook

Keeps Tab and Shift+Tab inside a container that covers the page - a dialog, a
side panel, a full-screen viewer - for as long as it is open.

## Usage

```tsx
import { useRef } from "react";
import { useFocusTrap } from "@onlyoffice/apps-ui-kit/hooks/useFocusTrap";

function Panel({ open }: { open: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref, open);

  return (
    <div ref={ref} role="dialog" aria-modal="true" aria-label="Settings">
      ...
    </div>
  );
}
```

`ModalDialog` (both display types), `Aside` and the DocSpace media viewer
already use it.

## API

- **`ref`** (`RefObject<HTMLElement | null>`): the container.
- **`active`** (`boolean`): whether it is open. The trap is on only while this
  is `true` and the ref holds a node.

`getTabStops(root)` is exported too: the elements Tab stops on inside `root`,
in document order.

## Behaviour

- From the last stop Tab goes to the first; from the first Shift+Tab goes to
  the last. In between the order is document order.
- The key is handled on the document, so a container that opened without
  taking the focus still owns the next Tab: it lands on its first stop (or its
  last, for Shift+Tab) instead of moving on through the page behind it.
- A stop is focusable, has a tabIndex of 0 or more, is enabled and rendered,
  and is outside `inert` content. A radio group is one stop: its checked radio,
  or the first one.
- The stops are read at each key press, so content added, removed, hidden or
  disabled while the container is open is followed.
- With no stops at all, Tab moves nothing inside; if the focus is still behind the
  container and the container has a `tabindex` (`-1` will do), the container takes it.
- Of several open traps only one acts: the last to open, or a trap nested in
  its DOM. When it closes, the one below takes over again.
- A Tab that a control inside has already handled (`preventDefault`) is left
  alone, and so is Tab with Ctrl, Alt or Meta.

It does not move the focus into the container on open, nor back to the opener
on close; `ModalDialog` does both itself.
