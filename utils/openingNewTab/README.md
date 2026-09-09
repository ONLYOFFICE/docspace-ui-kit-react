# openingNewTab

Detects a middle-click, Ctrl+Click, or Cmd+Click and opens the target URL in a new tab instead of navigating in place.

## What It Does

- `openingNewTab(url, e?)` — if the click event has `ctrlKey`, `metaKey`, or is a middle-click (`button === 1`), opens `url` (prefixed with `window.ClientConfig.proxy.url` via `combineUrl`) in a new tab and returns `true`; otherwise returns `false` and lets the caller navigate normally

## Import

```ts
import { openingNewTab } from "../../utils/openingNewTab";
```

## Usage

```ts
const handleClick = (e: React.MouseEvent) => {
  if (openingNewTab("/rooms/shared/123", e)) return;
  navigate("/rooms/shared/123");
};
```

## API

```ts
openingNewTab(url: string, e?: React.MouseEvent): boolean
```

## Key Files

| File | Description |
|------|-------------|
| `index.ts` | `openingNewTab` function; also declares the global `Window.ClientConfig` shape |
