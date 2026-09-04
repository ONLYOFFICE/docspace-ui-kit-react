---
paths:
  - "**/*.ts"
  - "**/*.tsx"
  - "**/*.scss"
  - "**/package.json"
  - "assets/**"
---

# Hidden source-code checks — enforced from the DocSpace-client repository

**These rules are not checked by anything in this repository.** `pnpm lint`, `pnpm tsc` and
`pnpm test` here can all be green while the change still fails the blocking pre-push gate in
`DocSpace-client`, because the suites that enforce the rules below live there
(`common/tests/`) and explicitly include `libs/ui-kit` in their scope.

The failure lands one repository away from the author: you commit here, the submodule pointer
is bumped there, and the push fails with an error naming a file you cannot see from that
checkout. Everything below exists so that does not happen.

The client-side source of truth is `.claude/rules/source-checks.md` in `DocSpace-client`; this
file is the ui-kit-scoped copy. If the two disagree, the client one wins.

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

## License headers

Every new `.ts`, `.tsx`, `.js`, `.jsx` file must carry
`SPDX-License-Identifier: AGPL-3.0-only` within its first 2048 characters, and the wording must
match the canonical block **exactly**. Copy it from a neighbouring file.

Exempt: `*.test.*`, `*.spec.*`, `*.stories.*`, `*.d.ts`, `*.config.*`, `mockData*`.

The canonical text is not stored here — it comes from the `licenser.*` settings in
`frontend.code-workspace` in DocSpace-client. Two assertions run: one for a missing header, one
for wording that differs from canonical. Both allowlists are currently **empty**, and both must
only shrink.

Note for the npm separation work: the Apache-2.0 relicense will make this check demand a
*different* header for this repository than for the rest of the monorepo, which the check
cannot currently express. Tracked as debt.

## What this repository does enforce

`lefthook.yml` here runs `pnpm tsc`, `pnpm lint` and `pnpm test` on pre-push. That is the whole
local gate — none of the rules above are among them.

Also not enforced anywhere: `pnpm format` (Prettier). Files can be, and are, Prettier-
nonconforming while every gate is green.
