# useFocusReturn Hook

Moves the focus into a container that covers the page - a dialog, a side
panel, a full-screen viewer - when it opens, and gives it back to the element
it came from when it closes.

## Usage

```tsx
import { useRef } from "react";
import { useFocusReturn } from "@onlyoffice/apps-ui-kit/hooks/useFocusReturn";
import { useFocusTrap } from "@onlyoffice/apps-ui-kit/hooks/useFocusTrap";

function Panel({ open }: { open: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useFocusReturn(ref, open);
  useFocusTrap(ref, open);

  return (
    <div
      ref={ref}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label="Settings"
    >
      ...
    </div>
  );
}
```

`ModalDialog` (both display types) and `Aside` already use it.

## API

- **`ref`** (`RefObject<HTMLElement | null>`): the container. It must be able to
  hold the focus: give it `tabIndex={-1}`.
- **`active`** (`boolean`): whether it is open.

## Behaviour

- Opened, the container takes the focus, without scrolling, unless something
  inside it already has it - a field with `autoFocus`, or one the content
  focuses in its own effect.
- The element to give the focus back to is the one focused before the commit
  that opened the container, so a field inside that took the focus on mount is
  never mistaken for it.
- Closed, the focus goes back to that element if the focus was still in the
  container or had dropped to the page's body, and the element is still in the
  page. Focus moved elsewhere in between is left where it is.
- The ref is read again on close, so a container that swapped its node while
  open (`ModalDialog`'s `hideContent`) still counts as holding the focus.
- An opener that leaves the page before the container closes - a menu item
  whose menu closed on the click - gets nothing back. Open such containers with
  the focus on something that stays: a context menu that does not take the
  focus leaves it on its row.
