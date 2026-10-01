## Project Overview

`@onlyoffice/apps-ui-kit` — shared React component library used across all DocSpace
frontend products (client, login, doceditor, management, sdk).

**This is now a standalone repository, not a submodule of DocSpace-client.** It builds,
tests and runs Storybook on its own, with no DocSpace checkout beside it. Consumers
depend on the **published package** — they resolve it to `dist`, not to the source root
as they did under the monorepo. DocSpace-client currently consumes a packed tarball;
publication to npm has not happened yet; the manifest is at `4.0.0` and the package is
`@onlyoffice/apps-ui-kit`, AGPL-3.0-only.

The separation work lives on `feature/ui-kit-separation`. See `docs/public-api.md` for
the published surface and the tiering of public versus portal-internal modules.

**Consequence worth keeping in mind:** there is no longer a client build compiling these
sources, so packaging defects (`exports` subpaths, peer deps, missing assets) are only
caught by `pnpm build` + `pnpm verify:package` here, or by a consumer. Prefer Storybook
for component work and reach for the packed tarball when verifying the package itself.

## Rules in `.claude/rules/`

Path-scoped detail that does not belong here, loaded when the matching files are touched:

| Rule                     | Covers                                                                                                                                                                                                                           |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `plugin-api.md`          | the root barrel **is** the DocSpace plugin UI API; the portal shim, subpath imports that throw, and the `agent-skills` skill that documents it                                                                                   |
| `component-authoring.md` | folder layout, props and JSDoc, `ref` as a prop, stories, what `vitest.config.ts` actually collects                                                                                                                              |
| `theming.md`             | which layer a `var(--x)` comes from, undefined tokens failing silently, RTL                                                                                                                                                      |
| `packaging.md`           | `exports`, `publishConfig`, ESM-only dist, dependency placement, per-module CSS, `"use client"`                                                                                                                                  |
| `live-portal.md`         | how anything here talks to a real DocSpace: `useApi()`'s clients, the provider Storybook already mounts, `.env` and the portal switcher, whose identity a key runs as, and why every committed screen must render with no portal |
| `source-checks.md`       | the client-side checks that used to cover this source (hex, ASCII, indentation, assets, deps, licence headers), why none of them run here now, and AGPL-3.0-only without per-file headers                                        |
| `cross-platform.md`      | why every command has to run on Windows too, what `package.json` scripts may not contain, and why `path.sep` does not make an id POSIX                                                                                           |
| `vscode-tasks.md`        | the three layers behind the status-bar buttons in `ui-kit.code-workspace`                                                                                                                                                        |

## Tech Stack

- **React 19** (peer dependency)
- **TypeScript 5** (strict mode, `tsconfig.json`)
- **Rollup** — library build (`rollup.config.mjs`), **ESM only** (`dist/esm`, `dist/types`);
  there is no CJS output
- **Storybook 10** — component documentation and visual development
- **Vitest** — unit and component tests
- **Biome** — linting only. Its **formatter is disabled**
  (`biome.json`: `formatter.enabled: false`); formatting is Prettier, via `pnpm format`
  (`--check`) and `pnpm format:fix` (`--write`). The repository **has** been formatted:
  `pnpm format` passes over the whole tree, and it is gated in `lefthook.yml` at three
  points (pre-commit and pre-merge-commit rewrite staged files; pre-push runs
  `pnpm format:gate` first) and in CI's lint job, which uses `--check` and never writes.
  Prettier is configured in `.prettierrc.yaml` (Prettier 3's own defaults, pinned
  so the editor and the script cannot disagree) and `.prettierignore` holds back
  `pnpm-lock.yaml` — formatting it produces a lockfile pnpm rejects — the client-derived
  `locales/` and `css/`, and `*.mdx`, whose licence-header comment Prettier escapes into
  something Storybook's indexer cannot parse
- **SCSS Modules** — styling (`*.module.scss` per component); theming via CSS
  custom properties
- **Lefthook** — git hooks. Pre-commit and pre-merge-commit rewrite the staged files
  with Prettier (`stage_fixed`); pre-push runs `format:gate`, `lint`, `tsc`, `test`,
  `build` and `verify:package`, in that order and stopping at the first failure
  (`priority` + `piped` — lefthook otherwise sorts commands alphabetically and runs
  them all). `format:gate` fixes the files it finds and still fails the push, because
  a pre-push hook cannot rewrite the commits being pushed
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
scripts/             — copy-locales, copy-images, verify-package, and the
                       build pipeline steps (normalize-types, finalize-dist, check-dist)
.storybook/          — Storybook configuration
test/                — Test setup and mocks
__tests__/           — Playwright visual-regression specs (94, run against Storybook);
                       not run in CI
locales/en/          — COMMITTED, so the package builds standalone. Other languages are
                       gitignored and produced on demand by `pnpm sync-locales`
index.ts             — Main library entry point

css/fonts.css and fonts/ are COMMITTED as well — Storybook imports the stylesheet and the
Docker E2E image has no DocSpace beside it. `pnpm sync-locales` refreshes them; the library
build does not use them.

Gitignored, absent from a fresh clone: dist/, locales/* except locales/en, the
Playwright output (playwright-report/, test-results/) and site-docs/ (`pnpm docs`).
```

## Common Commands

```bash
# Install dependencies
pnpm install

# Library build: rollup -> tsc declarations -> normalize types -> per-directory
# package.json markers -> assemble dist/styles.css -> assert no bundled
# dependencies, no non-index chunks, no lost "use client"
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

# API-site pages for api.onlyoffice.com (site/docspace/ui-kit): a copy of
# Storybook -- one page per docs entry, in its tree, with stories and React
# blocks as pictures -- into gitignored site-docs/. docs:check also compiles every page as MDX (CI runs it);
# docs:sync copies the result into ../api.onlyoffice.com (API_SITE_ROOT).
# See docs-generation.md.
pnpm docs:build         # Storybook, Chromium if missing, pictures, pages -- the site's one command
pnpm docs:sync          # docs:build, then copy into the site checkout
pnpm docs               # pages only, seconds, no browser (what CI checks)
pnpm docs:check
pnpm docs:screenshots
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
- **`ref` as a prop**: React 19, so `ref?: React.Ref<HTMLElement>` in the props type. Do not
  add `forwardRef` to new components; the 20 that still use it are legacy
- **Accessibility**: WCAG 2.1 AA — `aria-*` attributes, keyboard navigation, focus management
- **Formatting**: Prettier (`.prettierrc.yaml`) — 80-char line width, double quotes,
  trailing commas, 2-space indent, LF. Biome's formatter is off and configures none of this
- **Tests**: Vitest + React Testing Library, setup in `test/setup.ts`
- **Stories**: every component must have a story. It may live in a subdirectory rather
  than beside `index.ts` — `table`, `rows` and `tiles` all do — so check recursively
  before concluding one is missing. Every component folder has one now, `theme-provider`
  included.

## Product naming

The product formerly called DocSpace is **ONLYOFFICE Apps**. Every piece of user-facing text
uses that name: UI strings, stories, the samples and other `.mdx` pages, and the READMEs the
package ships.

- **Where space is tight — buttons, links, badges — `ONLYOFFICE` alone is enough**: "Sign in
  with ONLYOFFICE", "Open in ONLYOFFICE".
- **Roles use the product's own words**, which carry no product name: Owner, Full admin, Room
  admin, Power user, User, Guest.
- **Names of things are not copy, so they stay**: `@onlyoffice/docspace-api-sdk`, the
  `DocSpace-client` repository and its paths, API routes, `docspace` in URLs, environment and
  config keys, CSS classes and test ids. Engineering notes here (`CLAUDE.md`, `.claude/rules/`)
  keep "DocSpace" where it names that codebase.
- **Inside a component the name comes from `getBrandName("ProductName")`**, because a
  white-label portal renames the product again; `t("Common:ProductName")` is refused by the
  `no-constants-via-i18n` lint plugin. Samples and documentation write the name out.

## Paths

Never write an absolute path into anything committed here — not into `CLAUDE.md`, the rules
under `.claude/`, a script, a comment, a README or a commit message. An absolute path carries
one machine's home directory into a shared repository, where it is wrong for everyone else and
silently stays wrong.

Write paths relative to the repository root (`.claude/scripts/…`, `components/button/`). A
checkout that lives outside this one is named relative to it and made overridable, which is what
every script here already does:

| Neighbour       | Expected at, from this repository | Override                        |
| --------------- | --------------------------------- | ------------------------------- |
| DocSpace client | `../DocSpace/client`              | `DOCSPACE_CLIENT_ROOT`          |
| `agent-skills`  | `../agent-skills`                 | `AGENT_SKILLS_ROOT`, `--skills` |

Both are siblings of this checkout. The client default is spelled `../../DocSpace/client` in
`scripts/copy-locales.js` and `scripts/copy-images.js` because those resolve it from `scripts/`,
one level further down — which is the whole reason to say what a path is relative to whenever it
is not the repository root.

The exception is a path that is genuinely absolute on every machine — a URL, or a runtime path
inside a container such as `/app`. A path under `/Users`, `/home` or `C:\Users` never is.

## Language

Everything committed here is written in English: source and comments, READMEs and `.mdx`
pages, the rules under `.claude/`, commit messages. The ASCII scan in
`.claude/rules/source-checks.md` already refuses non-Latin text in `.ts` and `.tsx`; this is
the same rule for prose and every other file, where nothing checks it. Two things are not
prose and may hold other languages: locale resources under `locales/`, and an example of
feeding them, such as the German strings in the root README's translation example.

Working notes in another language do not go into the repository at all. Keep such a file out
with `.git/info/exclude` — it is local, uncommitted, and `git add -A` skips it — rather than
translating it or committing it. To look for stray text:

```bash
git grep -nIP '[\x{0400}-\x{04FF}]' -- . ':!locales'
```

## Commit messages

Do not add `Co-Authored-By` trailers or any other AI-attribution lines to
commit messages. Same rule as the DocSpace client repository.

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
  whole. The same script also copies `css/fonts.css` and `fonts/` from the client — both
  are **committed**, like `locales/en` and `assets/icons/`, so Storybook and the Docker
  E2E image work with no DocSpace anywhere near them; the script only refreshes them.
  `copy-images.js` skips under CI — harmless, since `assets/icons/` is committed.
