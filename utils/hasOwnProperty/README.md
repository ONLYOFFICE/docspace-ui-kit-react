# hasOwnProperty

Safe `Object.hasOwn` check that tolerates `null`/`undefined` and non-object values instead of throwing.

## What It Does

- Returns `false` immediately for a falsy `obj`
- Otherwise calls `Object.hasOwn(obj, propertyName)`, catching and swallowing any error

## Import

```ts
import { hasOwnProperty } from "../../utils/hasOwnProperty";
```

## Usage

```ts
hasOwnProperty({ a: 1 }, "a"); // => true
hasOwnProperty(null, "a");     // => false
hasOwnProperty(undefined, "a"); // => false
```

## API

```ts
hasOwnProperty(obj: unknown, propertyName: string): boolean
```

## Key Files

| File | Description |
|------|-------------|
| `index.ts` | `hasOwnProperty` function |
| `hasOwnProperty.test.ts` | Unit tests (Vitest) |
