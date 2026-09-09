# get-system-theme

Returns the system's preferred color theme, accounting for the ONLYOFFICE desktop client.

## What It Does

- `getSystemTheme()` — returns `ThemeKeys.DarkStr` or `ThemeKeys.BaseStr`
  - Inside the desktop client (`window.AscDesktopEditor` present), reads the client's own theme (`window.RendererProcessVariable.theme`)
  - In a browser, falls back to the `prefers-color-scheme: dark` media query
  - On the server (no `window`), returns `ThemeKeys.BaseStr`

## Import

```ts
import { getSystemTheme } from "../../utils/get-system-theme";
```

## Usage

```ts
const theme = getSystemTheme(); // ThemeKeys.DarkStr | ThemeKeys.BaseStr
```

## Key Files

| File | Description |
|------|-------------|
| `index.ts` | `getSystemTheme` function |
| `getSystemTheme.test.ts` | Unit tests (Vitest) |
