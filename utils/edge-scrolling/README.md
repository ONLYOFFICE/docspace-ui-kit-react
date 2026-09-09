# edge-scrolling

Auto-scrolls the `.section-scroll` container when the mouse nears the top or bottom edge of the viewport — used during drag-and-drop operations.

## What It Does

- `onEdgeScrolling(e)` — call on `mousemove` during a drag; scrolls `.section-scroll` up or down when the cursor is within 200px of the viewport edge, scaling scroll speed by proximity to the edge
- `clearEdgeScrollingTimer()` — cancels any pending scroll step; call on drag end

## Import

```ts
import { onEdgeScrolling, clearEdgeScrollingTimer } from "../../utils/edge-scrolling";
```

## Usage

```ts
document.addEventListener("mousemove", onEdgeScrolling);
document.addEventListener("mouseup", clearEdgeScrollingTimer);
```

## Key Files

| File | Description |
|------|-------------|
| `index.ts` | `onEdgeScrolling`, `clearEdgeScrollingTimer` |
| `edgeScrolling.test.ts` | Unit tests (Vitest) |
