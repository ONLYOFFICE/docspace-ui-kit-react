## Project Overview

`@onlyoffice/apps-ui-kit` — shared React component library used across all DocSpace
frontend products (client, login, doceditor, management, sdk).

**This is now a standalone repository, not a submodule of DocSpace-client.** It builds,
tests and runs Storybook on its own, with no DocSpace checkout beside it. Consumers
depend on the **published package** — they resolve it to `dist`, not to the source root
as they did under the monorepo. DocSpace-client currently consumes a packed tarball;
publication to npm has not happened yet (`version` is still `0.0.1`).

The separation work lives on `feature/ui-kit-separation`. See `docs/public-api.md` for
the published surface and the tiering of public versus portal-internal modules.

**Consequence worth keeping in mind:** there is no longer a client build compiling these
sources, so packaging defects (`exports` subpaths, peer deps, missing assets) are only
caught by `pnpm build` + `pnpm verify:package` here, or by a consumer. Prefer Storybook
for component work and reach for the packed tarball when verifying the package itself.

## Tech Stack

- **React 19** (peer dependency)
- **TypeScript 5** (strict mode, `tsconfig.json`)
- **Rollup** — library build (`rollup.config.mjs`), outputs ESM/CJS
- **Storybook 10** — component documentation and visual development
- **Vitest** — unit and component tests
- **Biome** — linting only. Its **formatter is disabled**
  (`biome.json`: `formatter.enabled: false`); formatting is Prettier, via `pnpm format`,
  which is **not** in any gate. Files can be Prettier-nonconforming with everything green
- **SCSS Modules** — styling (`*.module.scss` per component); theming via CSS
  custom properties
- **Lefthook** — git hooks (lint + tests on pre-push)
- **pnpm** — package manager

## Repository Structure

```
components/          — 98 UI components, each in its own folder:
                        <name>/
                          index.ts
                          <Name>.tsx
                          <Name>.types.ts
                          <Name>.module.scss (optional)
                          <Name>.stories.tsx
                          <Name>.test.tsx (optional)
constants/           — Shared constants
context/             — React contexts (ThemeContext, InterfaceDirectionContext)
enums/               — Shared enumerations
errors/              — Error page components (401, 403, 404, etc.)
hooks/               — 11 custom React hooks (barrelled in hooks/index.ts)
providers/           — theme, translation, error-boundary (public) and api (portal-only)
styles/              — Global SCSS styles, mixins, variables
types/               — Shared TypeScript types
utils/               — Utility functions (cookie, date, device, email, i18n, etc.)
assets/              — SVG icons as React components (*.react.svg); assets/icons/ is
                       committed and refreshed from public/images/icons by copy-images.js

Portal-coupled modules -- they ship in the package but are not public API
(docs/public-api.md):

ai-agent/            — AI chat panel and settings; needs @onlyoffice/ai-chat
api/                 — Portal REST client
billing/             — Tariff, payment and services flows; MobX stores
document-editor/     — DocumentEditor wrapper around @onlyoffice/document-editor-react
selectors/           — Data-driven selectors (AIAgent, People, Room, Files, Groups,
                       MCPServers) -- depend on the API layer and MobX stores
uploader/            — Upload UI; depends on selectors/Files and providers/api

biome-plugins/       — Vendored copy of the client's i18n Grit plugins, committed here.
                       Refreshed by hand from DocSpace-client; nothing checks that it is
                       fresh
docs/                — Storybook .mdx pages, plus public-api.md
scripts/             — copy-locales, copy-images, relicense-mit, verify-package, and the
                       build pipeline steps (normalize-types, finalize-dist, check-dist)
.storybook/          — Storybook configuration
test/                — Test setup and mocks
__tests__/           — Playwright visual-regression specs (94, run against Storybook);
                       not run in CI
locales/en/          — COMMITTED, so the package builds standalone. Other languages are
                       gitignored and produced on demand by `pnpm sync-locales`
index.ts             — Main library entry point

Gitignored, absent from a fresh clone: dist/, css/, fonts/, locales/* except locales/en.
`pnpm sync-locales` produces css/ and fonts/ — Storybook needs them, the library build
does not.
```

## Common Commands

```bash
# Install dependencies
pnpm install

# Library build: rollup -> tsc declarations -> normalize types -> single
# stylesheet -> assert no bundled dependencies
pnpm build

# Pack with pnpm and run publint + attw against the real tarball.
# Must be pnpm: publishConfig field overrides are a pnpm feature, and an
# npm-packed tarball has no exports/main at all.
pnpm verify:package

# Watch mode build
pnpm build:watch

# Storybook development server (port 6006)
pnpm storybook

# Build Storybook static
pnpm storybook-build

# Run tests
pnpm test

# Tests with UI
pnpm test:ui

# Tests with coverage
pnpm test:coverage

# Lint
pnpm lint
pnpm lint:fix

# Format
pnpm format
pnpm format:fix

# TypeScript check
pnpm tsc

# Refresh non-English locales, css/fonts.css and fonts/ from a DocSpace client
# checkout. Run by hand, never part of build/test. Needs DOCSPACE_CLIENT_ROOT
# (default ../../DocSpace/client) and fails loudly without it.
pnpm sync-locales
```

## Working with DocSpace

Since the split there is no submodule and no source-root resolution, so the old
"edit component -> check in the client -> commit the submodule" loop no longer
applies. Three levels, fastest first:

1. **Storybook** — the default environment for component work. Covers most changes
   (styles, props, isolated behaviour) with hot reload and no client checkout.
2. **Client integration** — point DocSpace-client at this checkout (a local `link:`
   override plus a bundler alias) to get hot reload against real screens. The override
   is local and must not be committed. Watch for a duplicated React: both React and
   React-DOM are peer deps, so dedupe them in the client's bundler config.
3. **Real package** — `pnpm build && pnpm verify:package`, or pack a tarball and
   install it in the client. This is the only level that exercises `exports`,
   `publishConfig` and peer deps as a consumer sees them. Do it before merging, not
   on every edit.

## Coding Conventions

- **TypeScript**: strict mode; no `any`; explicit types on all exported symbols
- **Component file**: `ComponentName.tsx` + `ComponentName.types.ts` + `index.ts`
- **Theming**: SCSS Modules with CSS custom properties (`var(--token)`); the
  provider stamps `data-theme`/`data-dir` on `<html>`; no hardcoded colors or
  sizes; use CSS logical properties + mixins from `styles/mixins/_direction.scss`
  for RTL
- **Icons**: SVG files in `assets/icons/` imported as React components (`*.react.svg`)
- **Exports**: all public API through `index.ts` at each folder level; tree-shaking must be preserved
- **Peer deps**: React and React-DOM are peer dependencies — never bundle them
- **`forwardRef`**: required on all interactive/input elements
- **Accessibility**: WCAG 2.1 AA — `aria-*` attributes, keyboard navigation, focus management
- **Biome**: 80-char line width, double quotes, trailing commas, CRLF line endings
- **Tests**: Vitest + React Testing Library, setup in `test/setup.ts`
- **Stories**: every component must have a story. It may live in a subdirectory rather
  than beside `index.ts` — `table`, `rows` and `tiles` all do — so check recursively
  before concluding one is missing. Four components currently have none:
  `avatar-editor-dialog`, `quantity-picker`, `room-logo-cover-dialog`, `theme-provider`

## Architecture Notes

- **Flat component model**: each component is self-contained in its folder; no deep nesting between components
- **Theme system**: theme objects (`TTheme`, `TColorScheme`) live in
  `providers/theme/themes/` (`base.ts` / `dark.ts`); runtime theming is CSS
  custom properties set by `ThemeProvider`. `.storybook/lightTheme.ts` /
  `darkTheme.ts` are Storybook-UI themes only
- **Selectors**: complex data-driven selector UIs (AIAgent, People, Room, Files, Groups, MCPServers) live in `selectors/` — they depend on API and MobX stores
- **Providers**: `Providers.tsx` composes ErrorBoundary, TranslationProvider,
  ThemeProvider **and ApiProvider**, and fetches portal settings on mount. It is
  therefore portal-specific and is **not** exported from `providers/index.ts` — nor is
  `providers/api`. Import either by subpath.
- **API integration**: the top-level `api/` and `utils/socket/` provide the API client and
  WebSocket helpers used by selectors. (`utils/api/` does not exist.)
- **Localization**: `locales/en` is **committed**, so the package builds, tests and
  runs Storybook with no DocSpace checkout next to it. `scripts/copy-locales.js` is
  run **by hand** (`pnpm sync-locales`) to refresh the other languages from a client
  checkout — it is deliberately not part of build, test or lint, and not in CI's path.
  It resolves the client via `DOCSPACE_CLIENT_ROOT` (default `../../DocSpace/client`)
  and **fails loudly** when that checkout is missing, rather than fabricating stubs.
  **It writes a derived subset** of `Common.json`, not a copy — the keys it finds by
  regex-scanning this package, plus a hardcoded list of five the regexes miss (which is
  why `no-dynamic-i18n-key` matters); `Payments.json` and `Settings.json` are copied
  whole. The same script also copies `css/fonts.css` and `fonts/` from the client —
  both are gitignored, so **a fresh clone has no fonts stylesheet and `storybook-build`
  will fail on it** until `pnpm sync-locales` runs. `copy-images.js` skips under CI —
  harmless, since `assets/icons/` is committed.
