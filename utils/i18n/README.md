# i18n

Reads translations from `window.i18n` outside of a React component tree, plus a hook and a `Trans`-like component built on top of it.

## What It Does

- `getCommonTranslation(key, interpolation?, namespaces?)` — resolves a translation for `key`, in order:
  1. The i18next instance exposed at `window.i18n.instance` (via its own `t()`)
  2. A manual lookup in `window.i18n.loaded` (per-namespace or combined bundle), used when the instance echoes an unknown key instead of honoring `defaultValue`
  3. During SSR (no `window`), an instance registered via `registerCommonI18nInstance`, or the i18next singleton if already initialized
  4. Falls back to `""` and logs a console error if nothing resolves
- `registerCommonI18nInstance(instance)` — lets `TranslationProvider` register its private i18next instance for SSR lookups
- `getCurrentCommonLanguage()` — the current resolved language, normalizing `en-US`/`en-GB` to `en`
- `getTranslationReady()` — returns `window.i18n.loaded` if translations have been loaded
- `useCommonTranslation(namespaces?)` — hook returning a `t()` function that re-renders on `languageChanged`, waiting for `window.i18n` to appear if it is not mounted yet
- `CommonTrans` — a lightweight `<Trans>`-style component: interpolates `{{values}}` and swaps `<0>...</0>` / `<tagName>...</tagName>` segments for React components

## Import

```ts
import { getCommonTranslation, useCommonTranslation } from "../../utils/i18n";
```

## Usage

```tsx
// Outside React
const label = getCommonTranslation("Common:Save");

// Inside a component
const t = useCommonTranslation();
return <span>{t("Common:Save")}</span>;
```

## Key Files

| File | Description |
|------|-------------|
| `index.ts` | Barrel re-exporting the below |
| `i18n-utils.ts` | `getCommonTranslation`, `getCurrentCommonLanguage`, `getTranslationReady`, `registerCommonI18nInstance` |
| `useCommonTranslation.ts` | React hook wrapping `getCommonTranslation` |
| `CommonTrans.tsx` | `<Trans>`-style interpolation component |
| `*.test.ts`, `*.test.tsx` | Unit tests (Vitest) |
