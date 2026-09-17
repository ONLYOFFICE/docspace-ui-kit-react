---
paths:
  - "**/*.ts"
  - "**/*.tsx"
  - "**/*.scss"
  - "**/package.json"
  - "assets/**"
---

# Hidden source-code checks — a gate that is being switched off

**These rules are not checked by anything in this repository.** `pnpm lint`, `pnpm tsc` and
`pnpm test` here are the whole local gate, and every rule below is outside it. What varies is
whether DocSpace-client still catches them for you, and that depends on which branch of the
client is live:

| Client branch | `moduleWorkspaces` in `common/tests/utils/files.js` | These rules |
|---|---|---|
| `develop`, `release/v4.0.0` | includes `UI_KIT_PATH`, and `getWorkSpaces({ excludeUiKit })` exists to opt out per suite | **enforced** — the suites scan the ui-kit checkout at `libs/ui-kit` and a push there fails |
| `feature/ui-kit-separation` | ui-kit removed; the comment reads "ships as a prebuilt tarball from its own repository and is never part of the scanned workspaces" | **not enforced at all** — colors, ascii, indentation, license and dependencies no longer see this source |

So today, working on the separation branch, nothing anywhere checks the rules below. That is a
gap, not a licence: the reasons they exist — a hex that does not follow the theme, a Cyrillic
character in a string that should have been a locale key — did not go away with the suite that
found them. Treat them as convention, and use
`node .claude/scripts/audit-tokens/audit.mjs` for the two that are mechanically checkable here.

Two suites still reach this package, by reading the **built tarball** out of `node_modules`
rather than the source (`common/tests/utils/ui-kit.js` → `resolveUiKitDist`):
`images.test.js` uses it to decide which images are referenced, and `locales.test.js` uses it
for Common-key evidence and for `UiKitCommonResolverPrefixTest`. Those still fail on the client
side because of something done here — but they name a `dist/` path, which is why the error is
hard to read from that end.

The client-side source of truth is `.claude/rules/source-checks.md` in `DocSpace-client`; this
file is the ui-kit-scoped copy. If the two disagree, the client one wins — but check which
branch it describes first.

## No hardcoded hex colors — anywhere

Zero `#RRGGBB` / `#RGB` in `.ts`, `.tsx`, `.scss`, `.css`. It is a **raw text scan**: a hex
inside a comment, a string, or an SVG `fill=` fails exactly the same. (`rgba()` and `hsl()`
literals slip through — do not exploit that.)

Use a token from `styles/variables/_colors.scss`, or a theme entry under a `themes/`
directory — in this repository that means `providers/theme/themes/`.

Exempt: any path containing `themes`, plus `.test.` and `.stories.` files.

## ASCII-only source

`.ts` and `.tsx` may contain only ASCII plus the allowlist `↓ ↑ ← → ⌘ ⌥ © • —`.

The traps, in order of how often they are hit:

- **en-dash `–` fails; em-dash `—` passes.** They look nearly identical.
- Typographic quotes, ellipsis `…`, emoji and non-breaking spaces fail.
- Any non-Latin text in a string literal or JSX fails — user-facing strings belong in the i18n
  system regardless.
- Lines that **start** with `//`, `*` or `/*` are skipped. A trailing comment after code is
  **not** skipped.

Out of scope: `.test.`, `.stories.`, `mockData.` files.

## Mixed indentation

No `.ts`/`.tsx` file may indent some lines with tabs and others with spaces. A wholly
tab-indented file is a style of its own and passes; only a file using **both** fails.

Nothing here catches it: Biome's formatter is disabled (`"formatter": { "enabled": false }` in
`biome.json`), so a codemod that writes one tab-indented line into a space-indented file ships
silently.

Lines inside a multi-line template literal are skipped, because leading whitespace there is
string content — embedded SVG and CSS keep their own indentation. Any bulk indentation fix must
skip those lines too and verify every template literal is byte-identical afterwards.

Exempt: `.test.`, `.stories.`, `.d.ts`.

The client-side allowlist (`common/tests/test/indentation-allowlist.json`) is **empty** — both
former offenders were in this repository and are fixed. It must only ever shrink, so it stays
empty: a new mixed-indentation file fails the push rather than being added to it.

## Images and assets

- Every image under `assets/**` must be referenced by its **basename** somewhere in source.
  An unused asset fails the push.
- No two different images may share a filename; no identical image under two names.
- **The `assets/` ↔ `public/images/` mirror in DocSpace-client is the one allowed
  duplication**, and mirrored files must keep the same name, the same relative path and the
  same content. Three separate checks enforce name, path and content consistency, so adding an
  icon here usually means adding it there too.
- Never reference images through the string literals `"/static/images`, `"/images`,
  `"static/images` or `"images/`.

## Dependencies

- **Adding a dependency that is not imported anywhere in this package breaks the push**
  (detection is a regex over `import` / `require` / `from` literals). The same applies in
  reverse: removing the last import of a dependency without dropping it from `package.json`.
  A CLI-only tool therefore cannot be declared as a devDependency without an allowlist entry
  on the client side.
- A package must carry the **exact same version string** in every workspace `package.json`.
  Never bump a dependency in only one package.
- `peerDependencies` are **not** checked by either rule — the relevant call in the client's
  `dependencies.test.js` is commented out.
- Production dependencies need an allowlisted license (MIT / Apache-2.0 / BSD / ISC /
  MPL-2.0 / LGPL-3.0-or-later …). GPL, AGPL and SSPL production dependencies fail
  `pnpm licenses-audit` in CI. `unknown` is allowlisted; AGPL is not.

## i18n Biome plugins

Two Grit plugins are wired through this repository's own `biome.json`:

- `no-dynamic-i18n-key` — the first argument of `t()` must be a string literal.
  `t(item.titleKey)` fails lint. Suppress with
  `// biome-ignore lint/plugin/no-dynamic-i18n-key` only when a sibling literal keeps the key
  findable by the locale scanner.
- `no-constants-via-i18n` — brand, const and culture keys (`t("Common:ProductName")`,
  `t("PDF")`, `t("Culture_ru")`) fail lint. Use `getBrandName()`, `getConstName()` or
  `getCultureLabel()` instead.

`biome-plugins/` in this repository is a **generated copy** of the client's, and it exists
precisely because this repository's standalone CI cannot reach `packages/shared`. It is
regenerated by `pnpm biome-plugins:generate` **in DocSpace-client**, and the regenerated copy
must be committed here. **Nothing checks that it is fresh.**

## License headers -- AGPL-3.0-only, but not per file

**Do not add a license header to files here, and do not remove the AGPL declaration from
`package.json`, `LICENSE` or the README.**

The package is **AGPL-3.0-only**. It briefly was not: `scripts/relicense-mit.mjs` stripped the
1 285 per-file AGPL headers and the manifest was switched to MIT, then commit `c2da2207` ("Put
the UI kit back under AGPL-3.0-only") reverted the manifest and the `LICENSE` file. **The
headers were not restored**, so the current, intended state is a package that declares AGPL
three times -- `package.json`, `LICENSE`, `README.md` -- and zero times in its 881 source
files. `scripts/relicense-mit.mjs` is kept for reference; its own comments still describe the
MIT move and are stale in that respect.

The monorepo's license-header check does **not** apply to this package. It used to take an
opt-out -- `getSourceFiles()` in `common/tests/utils/license.js` called
`getWorkSpaces({ excludeUiKit: true })` -- and on `feature/ui-kit-separation` there is nothing
to opt out of: `getWorkSpaces()` takes no argument and ui-kit is not among the workspaces at
all. Verified by running `npm --prefix ./common/tests run test:license` with every header
removed: it passes.

The client's own `.claude/rules/source-checks.md` agrees on that branch -- its header reads
"ui-kit is **not** in scope: it ships as a prebuilt tarball from `docspace-ui-kit-react` and is
not checked out here, so its own checks run in that repository." The two files no longer
disagree; on `develop` and `release/v4.0.0` they still describe the older arrangement.

The rest of the monorepo stays AGPL-3.0-only and keeps its headers, so never point
`common/scripts/update-license-headers.py` at this directory.

## What this repository does enforce

`lefthook.yml` here runs `pnpm tsc`, `pnpm lint` and `pnpm test` on pre-push. That is the whole
local gate — none of the rules above are among them. CI adds `pnpm build` and
`pnpm verify:package`, which cover packaging rather than source style.

Also not enforced anywhere: `pnpm format` (Prettier). Files can be, and are, Prettier-
nonconforming while every gate is green.
