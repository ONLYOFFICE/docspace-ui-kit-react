---
paths:
  - "index.ts"
  - "components/**"
  - "hooks/**"
  - "context/**"
  - "enums/**"
  - "constants/**"
  - "types/**"
  - "utils/**"
  - "errors/**"
  - "providers/**"
  - "uploader/**"
  - "billing/**"
---

# This package is the DocSpace plugin UI API

A DocSpace plugin does not install this library. The portal hands it its own already-mounted
copy: `packages/client/src/helpers/plugins/react/uiKit.ts` in DocSpace-client is one line —

```ts
export * from "@onlyoffice/apps-ui-kit";
```

— and `react/shim.ts` publishes that module as a blob URL, then rewrites every plugin import
of `@onlyoffice/apps-ui-kit` to point at it. A second copy inside the plugin
bundle would read no portal context and fall back to light LTR, so the plugin never bundles
the kit.

**The consequence: `index.ts` at this repository root _is_ the plugin API surface, in full.**
Not a curated subset — whatever `export *` reaches from the root barrel is what every plugin
author can import, and removing a name from it breaks plugins with no compile error anywhere
in this repository or in the client. Treat a change to `index.ts` as a public-API change even
when `docs/public-api.md` calls the module portal-internal.

`docs/plugin-surface.json` records that surface name by name (706 exports today: 459 values,
247 type-only). Diff a change against it with
`node .claude/scripts/plugin-surface/surface.mjs`, or use the `plugin-surface` skill. Any change
to the barrel, an addition too, means `pnpm surface` in the same commit: `pnpm surface:check`
runs in pre-push and CI and fails on every difference, because the file ships in the package and
agent-skills' `ui-kit` skill reads each name's `origin` to tell a consumer which ones are
portal-internal.

## What is in the surface and what is not

| Reachable from a plugin                                                | Not reachable                                                                   |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `components`, `hooks`, `context`, `enums`, `constants`, `types`        | `ai-agent`, `api`, `selectors`, `document-editor` — absent from the root barrel |
| `utils` (the barrel only)                                              | `utils/socket` — subpath only                                                   |
| `errors`, `uploader`, `billing`                                        | `providers/Providers`, `providers/api` — not in `providers/index.ts`            |
| `providers/theme`, `providers/translation`, `providers/error-boundary` | `assets/**`, `styles/**` — subpath only                                         |

Everything in the right-hand column is reachable by _subpath_ for the client and other npm
consumers, and unreachable for a plugin, because:

## Subpath imports throw at plugin load

`SPECIFIER_MAP` in the shim has exactly one key for this package. A plugin writing

```ts
import { Button } from "@onlyoffice/apps-ui-kit/components/button";
```

makes `rewritePluginImports` throw naming that specifier — deliberately, so the failure is not
a missing export in the browser later. The barrel is the only entry a plugin has.

This is the opposite of the rule for the client itself, which imports by subpath everywhere
(`@onlyoffice/apps-ui-kit/components/text`) precisely to keep the wildcard `exports` map and
tree-shaking useful. Do not carry one convention into the other.

## Icons: 22 of them are plugin API, the rest are not

`assets/**` is subpath-only, so the icon set as a whole is unreachable from a plugin. But two
component barrels re-export named icons — `components/quick-actions/icons.ts` (20) and
`components/nav-menu/icons.ts` (2) — and `export *` carries them all the way to the root. So
`import { CreateDocumentIcon } from "@onlyoffice/apps-ui-kit"` works, for those 22 names only.

That is a leak rather than a designed surface, and renaming the asset behind one of them breaks
a plugin. Either treat those names as API or stop re-exporting them from the barrel; do not
quietly add a 23rd. Everything else: inline JSX SVG in the plugin, or a file under the plugin's
own `assets/` through `plugin.iconUrl`.

Seven types also reach the barrel from `@onlyoffice/docspace-api-sdk` (`EmployeeFullDto`,
`FileDto`, `FolderDto`, `GroupDto`, `SdkDateToAutoCleanUp`, `SdkSortedByType`,
`SdkFilesSettingsDtoDefaultSharingAccessRightsEnum`) through `types/` and `enums/`, plus
`TFileEntrySecurity`, derived from the SDK's `FileEntryDto`, and the deprecated 3.7.0 aliases
`FileDtoInteger`, `FolderDtoInteger` and `FileEntryDtoIntegerAllOfSecurity`. A plugin
inherits them without ever declaring that package, and they move when it is upgraded.

`node .claude/scripts/plugin-surface/surface.mjs` lists both groups; the `plugin-surface` skill
is what to run when a change touches a barrel.

## The skill that teaches this lives in another repository

`agent-skills` (`skills/plugin-sdk`) is the Claude skill that generates and validates DocSpace
plugins. It is a separate checkout, expected at `../agent-skills` — a sibling of this
repository — or wherever `AGENT_SKILLS_ROOT` / `--skills <path>` points; the scripts refuse to
guess rather than reading the wrong tree. Its knowledge of the kit is a **snapshot**, and
nothing checks that the snapshot is fresh —
`node .claude/scripts/ui-kit-reference/check-drift.mjs` is what checks the checkable part of it.

### The rename landed in all three repositories at once

The specifier the portal's shim accepts had to change in the client, in this package and in
the skill together, because the shim throws on any bare specifier it does not know. The three
`feature/ui-kit-separation` branches merged on 2 October 2026 — into the client's and this
repository's `release/v4.0.0` (!753 and !108) and into agent-skills' `main`. Since then the
client depends on `@onlyoffice/apps-ui-kit` from npm, this repository publishes it, and
agent-skills installs it from npm at `UI_KIT_RANGE` in `scripts/generator/project-files.mjs`,
which `check-drift.mjs` checks admits this package.

What stays true: a layout change here invalidates prose in
`references/ui-kit.md` that nobody re-reads. The traps it records (`FieldContainer.labelVisible`,
`ToggleButton`'s absolute label, `Textarea`'s missing width, `SearchInput.onChange`) are
checked by the drift script; the layout and spacing prose is not.

So: **a change to a component's defaults, outer margin, or intrinsic sizing is a change to
plugin documentation one repository away.** Re-read `references/ui-kit.md` for that component
and say in the commit message whether it still holds.

## Version skew is the normal state

The client installs the kit from npm (`^4.0.1` in `packages/client` and `packages/shared`),
and plugins run against whatever the deployed portal bundled. A plugin author's local kit and the portal's kit are different builds by default.
Anything a plugin relies on must therefore be a stable export, not a recently added one.
