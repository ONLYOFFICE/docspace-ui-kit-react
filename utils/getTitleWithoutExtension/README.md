# getTitleWithoutExtension

Utility function that strips the file extension from a document title.

## What It Does

- Removes the last `.extension` segment from a file title
- Returns the full title if `fromTemplate` is `true` (templates keep their extension)
- Returns the full title if the file has no `fileExst` or no title
- Handles titles with multiple dots correctly (only removes the last segment)

## Import

```ts
import { getTitleWithoutExtension } from "../../utils/getTitleWithoutExtension";
```

## Usage

```ts
getTitleWithoutExtension({ title: "report.docx", fileExst: ".docx" }, false);
// => "report"

getTitleWithoutExtension({ title: "my.file.name.pdf", fileExst: ".pdf" }, false);
// => "my.file.name"

getTitleWithoutExtension({ title: "template.docx", fileExst: ".docx" }, true);
// => "template.docx" (fromTemplate preserves extension)

getTitleWithoutExtension({ title: "untitled", fileExst: "" }, false);
// => "untitled" (no extension to remove)
```

## Key Files

| File | Description |
|------|-------------|
| `index.ts` | `getTitleWithoutExtension` function |
