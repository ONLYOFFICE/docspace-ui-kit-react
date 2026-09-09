## Project Overview

`@onlyoffice/apps-ui-kit` — shared React component library used across all DocSpace frontend
products (client, login, doceditor, management, sdk). Consumed as a local workspace
dependency: the six apps resolve it to the **source root**, not to `dist`.

Being separated for publication as `@onlyoffice/apps-ui-kit`. That work is in progress
on `feature/ui-kit-separation` and changes several things this file used to state as
permanent — see `docs/public-api.md` for the published surface and the tiering of public
versus portal-internal modules.

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

biome-plugins/       — GENERATED copy of the client's i18n Grit plugins. Regenerate with
                       `pnpm biome-plugins:generate` in DocSpace-client and commit here;
                       nothing checks that it is fresh
docs/                — Storybook .mdx pages, plus public-api.md
scripts/             — copy-locales, copy-images, and the dist checks run by `pnpm build`
.storybook/          — Storybook configuration
test/                — Test setup and mocks
__tests__/           — Playwright visual-regression specs (83, run against Storybook)
index.ts             — Main library entry point

Generated, gitignored, absent from a fresh clone: locales/, css/, fonts/, dist/
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
```

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
- **Localization**: `scripts/copy-locales.js` must run before build/test to populate
  locale files; every command includes it automatically. **It writes a derived subset**,
  not a copy — 662 of the 2 392 `Common.json` keys, chosen by regex-scanning this
  package for used keys (which is why `no-dynamic-i18n-key` matters).
  **Trap: under `CI=true` it fabricates four empty locale stubs and copies neither
  `css/fonts.css` nor `fonts/`, then exits 0.** So CI builds silently produce a
  package with no translations, and `storybook-build` fails outright on the missing
  stylesheet. `copy-images.js` likewise skips entirely under CI — harmless, since
  `assets/icons/` is committed.
