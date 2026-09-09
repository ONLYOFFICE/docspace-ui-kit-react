# getLogoUrl

Builds the portal's `/logo.ashx` URL for a given white-label logo type, theme, culture, and cache-busting mode.

## What It Does

- `getLogoUrl(logoType, dark?, def?, culture?, update?)` — returns a `logo.ashx` query URL
  - `dark` selects the dark-theme variant
  - `def` requests the default (non-custom) logo
  - `culture` appends a `&culture=` parameter for locale-specific logos
  - `update: true` appends the `logoUpdateTimestamp` from `sessionStorage`, if present, to bust cached images after a logo change

## Import

```ts
import { getLogoUrl } from "../../utils/getLogoUrl";
import { WhiteLabelLogoType } from "../../enums";
```

## Usage

```ts
getLogoUrl(WhiteLabelLogoType.LightSmall);
// => "/logo.ashx?logotype=1&dark=false&default=false"

getLogoUrl(WhiteLabelLogoType.LightSmall, true, false, "ru", true);
// => "/logo.ashx?logotype=1&dark=true&default=false&culture=ru&t=<timestamp>"
```

## Key Files

| File | Description |
|------|-------------|
| `index.ts` | `getLogoUrl` function |
| `getLogoUrl.test.ts` | Unit tests (Vitest) |
