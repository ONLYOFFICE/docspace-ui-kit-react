# Public API

What `@onlyoffice/docspace-ui-kit` promises to external consumers, what it keeps for the
DocSpace portal, and what it guarantees about neither.

**Status:** proposed. This document is the contract the `exports` map, the dependency list and
the compatibility policy are derived from — nothing downstream can be written until it is
agreed. Verified against `feature/ui-kit-separation`.

## Why this exists

Today nothing distinguishes public API from internals. All six monorepo apps resolve
`@docspace/ui-kit` to the **source root** — a `node_modules` symlink plus an explicit webpack
alias in the Next.js apps — so with no `exports` map, any path inside the package is
importable. The result is 3 609 deep-subpath imports across 1 364 files reaching arbitrary
internals, and no way to change anything without guessing who depends on it.

Publishing forces the question. An `exports` map declares what resolves; everything else stops
being reachable. That is the enforcement this document defines.

## Tiers

| Tier | Meaning | Guarantee |
|---|---|---|
| **Public** | Documented, published, supported for external use | Semver. Breaking changes need a major and a migration note |
| **Portal-internal** | **Ships in the published package** and resolves, but is not part of the supported contract | None. May change or move in any release, without a major |
| **Private** | Implementation detail | Not resolvable at all once the `exports` map lands |

## Public surface

| Module | Contents | Notes |
|---|---|---|
| `components` | 98 component folders | The bulk of the value. Includes the generic `selector` component (distinct from `selectors/`) |
| `utils` | Helpers re-exported from `utils/index.ts` | The barrel only. `utils/socket` is **not** public — see below |
| `hooks` | 11 hooks | Barrelled in `hooks/index.ts` and exported from the root. `useViewEffect` is a default export, re-exported by name |
| `context` | `ThemeContext`, `InterfaceDirectionContext` | |
| `enums`, `constants`, `types` | Shared enums, constants, type definitions | |
| `errors` | Error page components (401, 403, 404, …) | Self-contained, no portal coupling |
| `styles` | Global SCSS, mixins, variables | Needed by consumers who extend the design system |
| `assets` | Icon set as React components | **Subpath-only, deliberately.** Hundreds of SVG modules; a barrel would defeat tree-shaking and force every consumer to parse the whole set. Licensing of the assets themselves is a separate question (D12) |
| `providers/theme` | `ThemeProvider`, theme objects, `useTheme` | |
| `providers/translation` | `TranslationProvider`, i18n wiring | |
| `providers/error-boundary` | `ErrorBoundary` | |

### Not public, and why — the two that look like they should be

**`providers/Providers` (the composed root).** It composes ErrorBoundary, TranslationProvider,
ThemeProvider **and ApiProvider**, and calls `fetchProvidersData()` to load portal settings on
mount. It is portal-shaped by construction: an external consumer has no such endpoint. Publish
the three providers individually and let consumers compose their own root.

Removing `./api` from the barrel is not enough on its own: `Providers.tsx` imports
`ApiProvider`, so while it stayed exported the root barrel still dragged `axios` into the core
through it. Both had to leave `providers/index.ts` for `axios` to become a portal-only
dependency. Both remain importable by subpath.

**`utils/socket`.** The only importer of `socket.io-client` and
`@socket.io/component-emitter` in the whole library, and meaningful only against a DocSpace
portal's socket server. Keeping it out of the public surface removes both dependencies from the
published package.

## Portal-internal

These **ship in the published package** and resolve normally — the monorepo depends on them 223
times and must be able to consume the built artifact uniformly (WP-12). What they lack is a
*contract*: no semver promise, no documentation for external use, no support.

The `exports` map therefore declares them, and the build emits them. The distinction is
editorial, not mechanical — which is why it has to be written down here rather than enforced by
resolution alone.

| Module | Client imports | Why not public API |
|---|---|---|
| `ai-agent` | 71 | Depends on `@onlyoffice/ai-chat`, which cannot currently be published. Ships anyway, via optional peer dependencies — see below |
| `billing` | 69 | Portal tariff/payment flows; depends on the API layer and MobX stores |
| `selectors` | 74 | Data-driven pickers (People, Room, Files, Groups, MCPServers, AIAgent) built on the API layer and MobX |
| `uploader` | 7 | Depends on `selectors/Files` and `providers/api` |
| `document-editor` | 2 | Wrapper around `@onlyoffice/document-editor-react`; external consumers should use that package directly |
| `api` | — | Portal REST client |
| `providers/api` | — | Portal API provider; sole importer of `axios` |
| `utils/socket` | — | See above |

Any of these could be promoted to public later if there is external demand (D5). Promotion is
cheap — it means documenting and committing to semver, not moving code.

## Shipping `ai-agent` without a publishable `ai-chat`

`@onlyoffice/ai-chat` is a vendored `file:` tarball, and a published package with a `file:`
dependency is uninstallable for everyone. But `ai-agent` has to ship. The resolution is
**optional peer dependencies** — the same pattern `ai-chat` itself uses, and one that needs no
exception to the "externalize everything" build rule.

- `@onlyoffice/ai-chat` is declared as a **peer dependency marked optional**
  (`peerDependenciesMeta`).
- The build keeps it **external**; `dist/ai-agent/**` ships with a bare
  `@onlyoffice/ai-chat` specifier.
- `npm i @onlyoffice/docspace-ui-kit` installs cleanly for everyone: an unsatisfied optional
  peer is neither fetched nor an error.
- Consumers who never import `ai-agent/*` — every external consumer, for now — are unaffected.
- The monorepo supplies `ai-chat` itself: the tarball declaration moves to the consuming
  package, or stays in the ui-kit workspace manifest for development.

The failure mode is loud and honest: importing `ai-agent/*` without supplying `ai-chat` fails at
build time naming the missing package. That is the opposite of the silent failures this
separation exists to prevent.

`ai-agent` is therefore unusable for external consumers until `ai-chat` is published. That
follows from the constraint, not from this design, and it is acceptable precisely because
`ai-agent` carries no public contract.

## Dependency consequences

Because every module now ships, the question is no longer "what does the core need" but **what
must a consumer install to use what they actually import**. The `ai-chat` mechanism generalises
into the rule:

> The public core's requirements are `dependencies`. Anything needed *only* by portal-internal
> modules is an **optional peer dependency**.

That way `npm i @onlyoffice/docspace-ui-kit` pulls what a component library legitimately needs
(~32 packages instead of 68), while the portal — which does import those modules — supplies the
rest from its own manifest.

### `dependencies` — the public core (~32)

What `components`, `utils`, `context`, `enums`, `constants`, `types`, `errors`, `hooks` and the
three public providers actually import. Notably including:

**`@onlyoffice/docspace-api-sdk`**, imported by 15 core files — `components/selector` (5),
`providers/theme` (2), `providers/translation`, `utils/common` and others — almost entirely for
types and enums such as `RoomType`, `FolderType` and `CustomColorThemesSettingsItem`. Currently
a `file:` tarball, which is unpublishable. Version 3.7.0 **is** on public npm, so switching to
`^3.7.0` removes the blocker — but the two are **not the same artifact**, and that is worth
knowing:

| | npm 3.7.0 | vendored 3.7.0 |
|---|---|---|
| Files | 2 649 | 2 622 |
| Differing by content | 83 files, incl. `LICENSE`, `README`, `chat-api`, `settings-api`, `files-settings-api` | |
| Present only on the other side | 27 model files (`ai-user-settings-*`, `external-sharing-settings-*`, `generated-file-*`, …) | **none** |

The npm build is a strict superset by file presence — nothing is lost by switching — and the
two enums the core actually imports, `room-type.js` and `folder-type.js`, are byte-identical.
Both manifests declare version 3.7.0, Apache-2.0 and a single dependency.

So the switch is safe in the ways that matter here, but it is **not a no-op**: one version
number currently designates two different builds. That is a publishing-hygiene problem on the
API SDK side, and it means the vendored tarball was never a reliable record of what 3.7.0 is.
Reproducible builds (WP-5) depend on this not recurring.

### `peerDependencies`, required

`react`, `react-dom` (relaxed to `^19.0.0`), plus **`i18next` and `react-i18next`** — imported
by `providers/translation`, and stateful, so a second copy in the consumer's tree breaks
translation silently. Peer, never bundled.

### `peerDependencies`, optional — portal-internal only

Declared so the portal can satisfy them and external consumers never download them:

| Package(s) | Needed by |
|---|---|
| `@onlyoffice/ai-chat` | `ai-agent` |
| `@anthropic-ai/sdk`, `openai`, `@google/genai`, `@mistralai/mistralai`, `@assistant-ui/react-markdown`, `@codemirror/lang-json`, `codemirror`, `katex`, `react-shiki`, `class-variance-authority`, `tailwind-merge`, `@radix-ui/react-{dialog,switch,tabs,tooltip}` | **`ai-chat`'s own optional peers** — see below |
| `mobx`, `mobx-react` (77 importers, all portal) | `selectors`, `billing` |
| `axios` | `providers/api` |
| `socket.io-client`, `@socket.io/component-emitter` | `utils/socket` |
| `react-router` | portal navigation |
| `react-markdown`, `react-syntax-highlighter`, `rehype-katex`, `rehype-raw`, `remark-gfm`, `remark-math` | `ai-agent` markdown rendering |
| `@onlyoffice/document-editor-react` | `document-editor` |

### The 15 packages nobody imports, and why they must stay

Fifteen of ui-kit's current `dependencies` have **zero imports** anywhere in the library. They
are not dead weight: `@onlyoffice/ai-chat` declares **32 peer dependencies, 28 of them
optional**, and these entries exist purely to satisfy them. Removing them would not break the
build — it would silently switch off `ai-chat` features, since that is exactly what an
unsatisfied optional peer does.

They therefore move from `dependencies` to **optional peers**, keeping their satisfying role
while leaving external installs alone.

Two entries are *not* explained by `ai-chat`'s peer list and need separate decisions:

- **`react-virtualized-auto-sizer`** — no import, not an `ai-chat` peer. Genuinely removable.
- **`@babel/runtime`** — no source-level import, but Babel injects `@babel/runtime/helpers/*`
  into transpiled output. Verify against the build before deleting.

### Two of `ai-chat`'s *required* peers are satisfied by accident

`@assistant-ui/react` and `assistant-stream` are **required** (non-optional) peers of `ai-chat`
and are declared nowhere in ui-kit. They resolve today only because ui-kit declares
`@assistant-ui/react-markdown`, which drags `@assistant-ui/react@0.11.58` in transitively
(`pnpm why` confirms the chain). If that package ever changes its own requirement, a required
peer of `ai-chat` breaks with no declaration anywhere pointing at the cause. Declare both
explicitly.

Six of the 28 optional peers are also unsatisfied — `@codemirror/state`, `@codemirror/view`,
`@radix-ui/react-dropdown-menu`, `@radix-ui/react-slot`, `clsx`, `zustand` — so some `ai-chat`
functionality is presumably inactive today. Whether that is intended belongs to whoever owns
`ai-agent`.

## Subpath contract

Deep imports stay supported — 2 694 of the 3 609 import sites are `components/*`, and breaking
them is not on the table. The `exports` map therefore declares:

- `.` — the barrel
- `./styles.css` — extracted stylesheet
- `./<module>` and `./<module>/*` for every public module above
- portal-internal paths, resolvable but undocumented

The barrel currently omits `hooks` and `assets` while both are deep-imported 101 times
combined. Adding them makes the barrel match the documented surface.

## Enforcement

The contract is machine-checked, not merely written down:

- `exports` map — anything undeclared stops resolving
- `publint` and `attw --pack` in CI — catches malformed maps and unresolvable types
- clean-install smoke tests against bare Vite and Next.js apps — catches what the monorepo's
  own resolution hides
- an API-surface snapshot, so a change to the public surface shows up in review as a diff

## Open questions

1. ~~Does the published package ship the portal-internal modules?~~ **Answered: yes.** They
   ship; `ai-agent` works through optional peer dependencies until `@onlyoffice/ai-chat` can be
   published.
2. ~~Should the ONLYOFFICE icons move to MIT with the code?~~ **Answered: no — non-code
   elements keep CC BY-SA 4.0.** `LICENSE` carries three sets of terms: MIT for the code,
   CC BY-SA 4.0 for illustrations, icon sets and technical writing, and an exclusion for the
   four third-party brand marks in `assets/thirdparties/` (Box, GitHub), which are not
   Ascensio System SIA's to license. This keeps the assets' terms unchanged by the relicense,
   and keeps the 246 icons mirrored into the client repository under identical terms on both
   sides.
3. **Should the core drop `@onlyoffice/docspace-api-sdk`** by inlining the handful of enums and
   types it uses, rather than depending on the portal's API SDK? Not required for publication.
4. **`@babel/runtime`** — required by the build output, or removable?
5. **Are the six unsatisfied `ai-chat` optional peers intentional?** Owner: whoever maintains
   `ai-agent`.
