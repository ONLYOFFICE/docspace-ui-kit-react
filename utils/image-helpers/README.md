# image-helpers

Maps file extensions to icon URLs at various sizes (24, 32, 64, 96px). Provides pre-built lookup maps for resolving file type icons.

## What It Does

- Defines an `IconNames` enum mapping icon categories to SVG filenames
- Maintains an `iconsMap` mapping each icon to its supported file extensions
- Generates `Map<string, string>` objects for each icon size, where keys are `"ext.svg"` and values are resolved icon URLs
- Separates room icons (only available at 32px) from file icons (available at all sizes)
- Uses `PUBLIC_DIR/images/icons/{size}/{name}` for icon URL resolution

## Import

```ts
import { iconSize24, iconSize32, iconSize64, iconSize96 } from "../../utils/image-helpers";
```

## Usage

```ts
// Get the 32px icon URL for a .docx file
const iconUrl = iconSize32.get("docx.svg");

// Get the 64px icon URL for an image
const imageIcon = iconSize64.get("image.svg");

// Fallback to generic file icon
const fallback = iconSize32.get("file.svg");
```

## Exported Maps

| Export | Sizes | Includes Room Icons |
|--------|-------|-------------------|
| `iconSize24` | 24px | No |
| `iconSize32` | 32px | Yes |
| `iconSize64` | 64px | No |
| `iconSize96` | 96px | No |

## Key Files

| File | Description |
|------|-------------|
| `index.ts` | Icon maps generation and exports |
