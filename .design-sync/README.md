# Design sync

This folder holds the **inputs** that turn `@onlyoffice/apps-ui-kit` into a
design system for Claude - not the design system itself. The output (the
compiled bundle, 123 component cards, tokens, fonts, guides) is generated on
every sync into the gitignored `ds-bundle/` and published to Claude.

If you are an agent reading this repository: `previews/` is **not** the list
of components. It holds the 21 hand-written preview overrides; the other
previews are generated from the Storybook stories at sync time. The full set
is every story title under `components/` that maps to a root export (123 at
the last sync).

## Where the design system lives

- **Design System artifact (Claude):** "ONLYOFFICE Apps UI Kit" -
  `https://claude.ai/artifact/UsKAVyuwJwaiK56sBGCV3i`. One artifact for the
  team, updated in place: the link never changes. It is marked as synced from
  code (`"editing": "code"`), so nobody edits it on the page - change the kit
  and re-run the sync. Ask its owner for access (Share menu); people who
  publish updates need **Can edit**.
- **Claude Design project (claude.ai/design, closing 14 December 2026):**
  `https://claude.ai/design/p/d44ca729-67df-4f9a-b452-056b215ace9c`
  (`projectId` in `config.json`).

## What is here

| Path                          | What                                                                                                                                                                                                                                                 |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `config.json`                 | converter settings: project, Storybook, provider chain, title map, exclusions, card layouts                                                                                                                                                          |
| `NOTES.md`                    | every problem found and its fix, grading conventions, **Re-sync risks** - read before a sync                                                                                                                                                         |
| `conventions.md`              | the README header the design agent reads first (Claude Design)                                                                                                                                                                                       |
| `preview-context.mjs`         | translations, theme and brand lookup the previews' providers use                                                                                                                                                                                     |
| `react18-compat.mjs`          | lets the bundle run on React 18 (Claude Design templates)                                                                                                                                                                                            |
| `overrides/story-imports.mjs` | fork of the converter's story-import rules (svgr, kebab-case folders, root barrel, story styles, `import.meta.glob`, react-i18next)                                                                                                                  |
| `previews/*.tsx`              | hand-written preview overrides (open overlays, single-card heights)                                                                                                                                                                                  |
| `artifact/`                   | the Design System artifact: `build.mjs` (converts `ds-bundle/` to the artifact's files), `README.md` (its brand book), `cover.html`, `assets.json` (ids of the uploaded logos, screenshots and icons), `icons-readme.md` (README of the Icons group) |

## Updating after a change to the kit

Components are changed in code, through the usual PRs. After the change is
merged, one person with Can edit on the artifact:

1. Runs `/design-sync` in Claude Code at the repository root. It rebuilds
   the library and Storybook, re-verifies only the components whose stories
   or previews changed, and updates `ds-bundle/`. Read `NOTES.md` first; it
   needs `pnpm install`, `pnpm build` and Playwright's Chromium.
2. Rebuilds the artifact's files:
   `node .design-sync/artifact/build.mjs --out <dir> --assets .design-sync/artifact/assets.json --by "<your name>"`
3. Publishes `<dir>/project/` to the artifact URL above (Claude Code's
   Artifact tool, in batches of at most 255 files, `.d.ts` as `text/plain`),
   and `project/design-system.json` last, in a call of its own.

Two people publishing at once: the second publish is refused and has to be
repeated, so agree on who publishes.

## Icons

The artifact's **Icons** asset group is every SVG under `assets/icons/`,
uploaded one for one and recorded in `artifact/assets.json` under `Icons`,
keyed by the path below `assets/icons/` (`32/word.svg`). Uploads are made by
hand, so step 2 refuses to build while that record disagrees with the disk:
an icon not uploaded, one whose size changed since its upload, or a record
whose file is gone. After `copy-images.js` refreshes the icons:

1. Upload each new or changed file to the artifact as an asset (Claude
   Code's Artifact tool, `asset: true`, at most 25 files per call). The
   asset store fails a call now and then with `store_unavailable`; repeat
   only the files the result says were not stored.
2. Put each returned id in `assets.json`: `{"blob": "<id>", "size": <bytes>,
"type": "image/svg+xml"}`, with `size` taken from the file on disk, not
   from the upload result (the store reports a few bytes more), and delete
   the entries of removed files.
3. Rebuild (step 2 above) and publish as usual. An old upload that nothing
   names any more stays in the store; delete it only when you mean to.

## Not in git

`ds-bundle/`, `.ds-sync/` (staged converter scripts), `sb-reference/` (the
reference Storybook), `.cache/` (grades and comparisons), `learnings/` and
logs. Verification state is carried by the published project, not by git.
