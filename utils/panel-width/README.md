# Panel width

Keeps the width of a resizable side panel between visits, in `localStorage`. The info panel
and the AI chat panel are both remembered this way, each under its own key.

## Installation

```typescript
import {
  createPanelWidthStorage,
  CHAT_PANEL_MIN_WIDTH,
} from "@onlyoffice/apps-ui-kit/utils/panel-width";
```

## Function

### `createPanelWidthStorage(key, bounds)`

Returns `{ read, save }` for one panel.

- `key` - the `localStorage` key the width is kept under.
- `bounds.defaultWidth` - what `read` returns while nothing usable is saved.
- `bounds.minWidth`, `bounds.maxWidth` - the range a width is kept in, rounded to whole pixels.
  `maxWidth` is optional; without it there is no upper bound.

`read()` returns the saved width brought into range, or `defaultWidth` for anything that is not
a number. `save(width)` brings the width into range, saves it and returns what it saved. Both
keep working when storage is unavailable (private browsing, storage disabled): `read` returns
the default and `save` still returns the width, which then lasts only for the session.

**Example:**

```typescript
const infoPanelWidth = createPanelWidthStorage("infoPanelWidth", {
  defaultWidth: 400,
  minWidth: 400,
  maxWidth: 800,
});

infoPanelWidth.save(640); // 640, kept for the next visit
infoPanelWidth.read(); // 640
```

## Constants

- `CHAT_PANEL_MIN_WIDTH` - 360, the narrowest the docked AI chat panel can be dragged to; the
  chat's saved width is kept above it too.
