# combineUrl

Merges a base URL with any number of path segments, normalizing slashes between them.

## What It Does

- Strips trailing slashes from the base URL
- Strips leading slashes from each segment before joining
- Skips falsy segments (`undefined`, `""`, `0`)
- Accepts strings and numbers as segments

## Import

```ts
import { combineUrl } from "../../utils/combineUrl";
```

## Usage

```ts
combineUrl("https://example.com/", "/api/", "/v1");
// => "https://example.com/api/v1"

combineUrl("https://example.com", "files", 42);
// => "https://example.com/files/42"
```

## API

```ts
combineUrl(host?: string, ...params: (string | number | undefined)[]): string
```

## Key Files

| File | Description |
|------|-------------|
| `index.ts` | `combineUrl` function |
