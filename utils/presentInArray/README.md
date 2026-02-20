# presentInArray

Simple utility to check if a string exists in an array, with optional case-insensitive matching.

## What It Does

- Searches for an exact string match within an array
- Supports case-insensitive search via the `caseInsensitive` flag
- Returns `true` if found, `false` otherwise

## Import

```ts
import { presentInArray } from "../../utils/presentInArray";
```

## Usage

```ts
presentInArray([".docx", ".pdf", ".xlsx"], ".pdf");
// => true

presentInArray([".DOCX", ".PDF"], ".pdf", true);
// => true (case-insensitive)

presentInArray([".docx", ".pdf"], ".txt");
// => false
```

## API

```ts
presentInArray(array: string[], search: string, caseInsensitive?: boolean): boolean
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `array` | `string[]` | — | Array to search in |
| `search` | `string` | — | String to find |
| `caseInsensitive` | `boolean` | `false` | Convert search to lowercase before matching |

## Key Files

| File | Description |
|------|-------------|
| `index.ts` | `presentInArray` function |
