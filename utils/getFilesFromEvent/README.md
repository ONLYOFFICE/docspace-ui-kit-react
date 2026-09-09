# getFilesFromEvent

Converts a drag, paste, or file-input event into a flat array of `File` objects, including recursive directory traversal.

## What It Does

- Accepts a `DragEvent`, `ClipboardEvent`, or a `<input>` `ChangeEvent`
- Reads `dataTransfer` or `clipboardData` as available, falling back to `event.target.files` for plain inputs
- Recursively walks dropped directories (via `webkitGetAsEntry`) and flattens their contents into the result
- Attaches a `path` property to each `File` (from `webkitRelativePath` or a directory entry's `fullPath`)
- Filters out OS thumbnail-cache files (`.DS_Store`, `Thumbs.db`)
- An empty dropped directory still yields one `File` marked `isEmptyDirectory: true`, so callers can create it

## Import

```ts
import getFilesFromEvent from "../../utils/getFilesFromEvent";
```

## Usage

```ts
const handleDrop = async (e: React.DragEvent<HTMLElement>) => {
  e.preventDefault();
  const files = await getFilesFromEvent(e);
  // files: File[], each may carry a `path` and/or `isEmptyDirectory`
};
```

## API

```ts
getFilesFromEvent(evt: DragEvent | ClipboardEvent | Event | React.DragEvent | React.ClipboardEvent | React.ChangeEvent<HTMLInputElement>): Promise<File[]>
```

## Key Files

| File | Description |
|------|-------------|
| `index.ts` | `getFilesFromEvent` default export |
| `getFilesFromEvent.test.ts` | Unit tests (Vitest) |
