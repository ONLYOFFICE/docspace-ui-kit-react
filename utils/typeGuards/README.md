# typeGuards

Type guard utilities for runtime type checking.

## What It Does

- `isNextImage(item)` — checks if an unknown value is a Next.js `StaticImageData` object (has a `src` property)
- Used to distinguish between plain string image URLs and Next.js static image imports

## Import

```ts
import { isNextImage } from "../../utils/typeGuards";
```

## Usage

```ts
import DefaultAvatar from "../assets/avatar.png";

const avatarUrl = isNextImage(DefaultAvatar)
  ? DefaultAvatar.src
  : DefaultAvatar;
```

## API

```ts
isNextImage(item: unknown): item is StaticImageData
```

Returns `true` if `item` is a non-null object with a `src` property (matching Next.js `StaticImageData` shape).

## Key Files

| File | Description |
|------|-------------|
| `index.ts` | `isNextImage` type guard and `StaticImageData` type |
