---
paths:
  - "**/*.module.scss"
  - "styles/**"
  - "components/theme-provider/**"
  - "providers/theme/**"
---

# Theming: where a token actually comes from

Three layers, and only the middle one lives in this repository:

1. **Sass variables** — `styles/variables/_colors.scss`. Raw hex, compile-time. Never reach a
   consumer as a token; a `#{$black}` is a literal in the output CSS.
2. **CSS custom properties defined here** — `components/theme-provider/ThemeProvider.scss`
   (a short list: `--background-color`, `--text-color`, the payment-callback set) under
   `.light` / `.dark`, plus whatever an individual `*.module.scss` defines for itself.
3. **CSS custom properties defined by the portal** — `packages/shared/styles/theme.scss` in
   DocSpace-client, ~1 000 of them (`--accent-main`, `--border-service-color`,
   `--input-error-color`, …). **This package consumes them and does not ship them.**

`ThemeProvider` (`components/theme-provider/index.tsx`) stamps `data-theme`, `data-dir` and
`--color-scheme-*` / `--interface-direction` on `<html>`. It does not fill layer 3.

## An undefined `var()` fails silently

There is no build error, no lint rule and no test. `color: var(--border-color)` — which does
not exist; the real one is `--border-service-color` — simply inherits and the component looks
almost right in light theme and wrong in dark.

So, before writing `var(--something)`:

```bash
# defined in this package?
grep -rn -- "--something\s*:" --include="*.scss" .
# defined by the portal?
grep -n -- "--something\s*:" ../../DocSpace/client/packages/shared/styles/theme.scss
```

If neither answers, either the name is wrong or you are introducing a token — and a new token
that the portal must supply has to land in `theme.scss` there in the same change, or Storybook
here is the only place it will ever resolve.

## Two legitimate ways a component owns a variable

- **Local fallback for a portal token.** Several components re-declare the portal's value so
  they render standalone: `--accent-main: var(--color-scheme-main-accent, #{$light-blue-main})`
  in `Tabs`, `AddButton`, `IconButton`. Copy that exact form — the `--color-scheme-*` indirection
  is what lets an admin re-brand the accent.
- **A component-level knob**, always with a fallback, and documented in the component's story:
  `var(--article-width, var(--article-desktop-width))`. ~760 of the ~2 560 `var()` uses in
  `components/` carry a fallback, and that is the shape a consumer-overridable token takes.
  Add the row to the story's MDX table in the same commit; nothing else records it.

## Hardcoded hex

Zero `#RRGGBB` / `#RGB` in `.ts`, `.tsx`, `.scss`, `.css`, including inside comments, strings
and SVG `fill=`. Enforced one repository away, not here — see
[source-checks.md](source-checks.md). Use a Sass variable from `styles/variables/_colors.scss`
or a theme entry under `providers/theme/themes/`.

## RTL

The interface direction is an attribute on `<html>`, not a prop. Use logical properties
(`margin-inline-start`, `padding-block`, `inset-inline-end`) and the mixins in
`styles/mixins/_direction.scss` — `logical-padding`, `logical-margin`, `logical-border-radius`,
`flip-in-rtl` for glyphs that must mirror. A physical `left` / `right` / `margin-left` in a new
rule is a bug in Hebrew and Arabic portals, and no check reports it.

## Storybook is the only place the full theme resolves

`.storybook/preview.tsx` mounts `ThemeProviderComponent` and imports `../css/fonts.css` —
which is **gitignored and produced by `pnpm sync-locales`**. A fresh clone therefore fails
`pnpm storybook-build` until that has run once. The portal's `theme.scss` is still not loaded,
so a story can look correct while relying on a token only the client defines; that is exactly
the case the `grep` above catches.
