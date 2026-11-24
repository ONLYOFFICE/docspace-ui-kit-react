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

| Path                          | What                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `config.json`                 | converter settings: project, Storybook, provider chain, title map, exclusions, card layouts                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `NOTES.md`                    | every problem found and its fix, grading conventions, **Re-sync risks** - read before a sync                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `conventions.md`              | the README header the design agent reads first (Claude Design)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `preview-context.mjs`         | translations, theme and brand lookup the previews' providers use                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `react18-compat.mjs`          | lets the bundle run on React 18 (Claude Design templates)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `overrides/story-imports.mjs` | fork of the converter's story-import rules (svgr, kebab-case folders, root barrel, story styles, `import.meta.glob`, react-i18next)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `previews/*.tsx`              | hand-written preview overrides (open overlays, single-card heights)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `artifact/`                   | the Design System artifact: `build.mjs` (converts `ds-bundle/` to the artifact's files), `tokens.mjs` and `scss-scan.mjs` (derive every token from the kit's code, with its source, and write `token-sources.md`), `check-design.mjs` (lists every value a design made up: colours, sizes, shadows, inline SVG, missing fonts), `figma-styles.mjs` and `figma-diff.mjs` (fetch the Figma library's published styles with `FIGMA_TOKEN` and compare them with the code by value), `figma-components.mjs`, `kit-components.mjs`, `figma-components-diff.mjs`, `figma-icons-diff.mjs` and `figma-sizes-diff.mjs` (the same for components and their variants, for icons, and - with a full-seat token - for the sizes drawn on the layers), `README.md` (its brand book), `cover.html`, `asset-groups.mjs` (which folder each asset group mirrors), `assets.mjs` (plans uploads and records their ids), `assets.json` (the record of OUR artifact's uploads), `export.mjs` (a complete copy in a folder), `icons-readme.md` (README of the Icons group), `sync-nav-icons.mjs`, `nav-icons/` and `nav-icons-readme.md` (the Navigation group and its README) |
| `screenshots/`                | the 82 product screenshots of the Screenshots asset group, which `docs/guides/screens.md` was measured from                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |

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

## Assets

Every asset group mirrors one folder of this repository, file for file
(`artifact/asset-groups.mjs`):

| Group       | Folder                                                                |
| ----------- | --------------------------------------------------------------------- |
| Logos       | `assets/logo/`                                                        |
| Screenshots | `.design-sync/screenshots/`                                           |
| Icons       | `assets/icons/` (refreshed by `copy-images.js`)                       |
| Navigation  | `.design-sync/artifact/nav-icons/` (by `artifact/sync-nav-icons.mjs`) |

Assets are uploads, kept by id, and an id resolves only in the artifact it
was uploaded to - so each artifact has its own **record** of them
(`{group: {name: {blob, size, type}}}`). Ours is `artifact/assets.json`.
Step 2 refuses to build while a record disagrees with the disk: a file not
uploaded, one whose size changed since its upload, or a record whose file is
gone. After a folder changes:

1. `node .design-sync/artifact/assets.mjs plan --assets .design-sync/artifact/assets.json --out <plan.json>`
   lists each file to upload and the path to upload it from.
2. Upload them to the artifact as assets (Claude Code's Artifact tool,
   `asset: true`, at most 25 files per call; nothing else can). The asset
   store fails a call now and then with `store_unavailable`; repeat only the
   files the result says were not stored.
3. Write the returned ids to a file, `{"<group>/<name>": "<id>"}`, and run
   `node .design-sync/artifact/assets.mjs record --assets .design-sync/artifact/assets.json --ids <ids.json>`.
   It takes each size from the disk (the upload result counts CRLF line
   endings) and drops the records of removed files.
4. Rebuild (step 2 above) and publish as usual. An old upload that nothing
   names any more stays in the store; delete it only when you mean to.

Known gap: our artifact holds another revision of the three logos
(re-serialized, `></path>` for `/>`), so `plan` lists them and step 2 does
not check the Logos group until they are uploaded again.

The Navigation group holds every icon the portal's left navigation draws -
the kit does not ship several of them - and `artifact/nav-icons-readme.md`
is its README: which entry uses which file. Both are generated by
`artifact/sync-nav-icons.mjs` from the client's map
(`packages/shared/utils/catalogIconHelper.ts`) and committed, so a build
never needs the client. After the client changes its navigation icons, run
`node .design-sync/artifact/sync-nav-icons.mjs` (it needs
`DOCSPACE_CLIENT_ROOT`, default `../DocSpace/client`), then steps 1-4.

## Publishing in another organization

An artifact can be opened only by people its owner's organization lets in,
so a team in another organization publishes its **own** Design System
artifact from this same code. Nothing here is tied to ours except
`assets.json` and the URL above. In Claude Code, at the repository root:

1. Build `ds-bundle/` from the kit (it is not in git). `/design-sync` does
   it and also re-grades the previews; the build alone is four commands,
   checked on a fresh worktree, about two minutes:
   - `pnpm install --frozen-lockfile` (with `CI=1` in a second worktree, so
     `prepare` does not install git hooks into the shared `.git`)
   - `pnpm build`
   - `npx --no-install storybook build -c .storybook -o .design-sync/sb-reference`
   - `node .ds-sync/package-build.mjs --config .design-sync/config.json --node-modules ./node_modules --entry ./dist/esm/index.js --out ./ds-bundle`
     with `NODE_OPTIONS=--max-old-space-size=8192`. `.ds-sync/` is the
     converter Claude Code stages on the first `/design-sync`; it is not in
     git.
2. Create the artifact: ask Claude Code for a new artifact of the Design
   System type, titled as you like; keep its URL.
3. Make its asset record: `node .design-sync/artifact/assets.mjs plan --assets .design-sync/artifact/assets.<team>.json --out <plan.json>`
   (a record that does not exist yet means "upload everything": 323 files),
   upload every file in the plan to the new artifact, and run `assets.mjs record`
   with the ids, as in Assets above.
4. Build with that record and publish to the new URL, as in steps 2-3 of
   "Updating after a change to the kit".

The page then matches ours, apart from the URL. Every later update repeats
1, 3 (only what changed) and 4.

## A copy in a folder

The quickest way to the design system on your own machine, artifact or no
artifact: run `/design-system-init` in Claude Code at the repository root
(`.claude/skills/design-system-init/`). It checks for the converter, builds
`ds-bundle/` (step 1 of the previous section), exports the copy to
`ds-export/project/` (gitignored) and checks it - about two minutes **once the converter
is in place**. The converter is the one thing it cannot provide: without
`.ds-sync/` it stops and asks for one `/design-sync`, which stages it. That
run diffs against the committed anchor (see "Not in git"), so it grades only
what changed since the last verified sync, not all 123 components.

By hand, `node .design-sync/artifact/export.mjs [--out <dir>]` (default
`ds-export`) writes everything the
artifact holds to `<dir>/project/`: the 540 files a publish sends,
`design-system.json` included, and every asset at
`project/assets/<Group>/<file>`, copied from its folder. It needs
`ds-bundle/` like step 2, and nothing from claude.ai. The type's own page
(`index.html`, `SKILL.md`, `artifact-type/`) is not part of a copy.

The copy stands on its own: its `design-system.json` names each asset by
that local path (`file`) instead of an upload id, every path in it is
relative to `project/`, and the export fails if one has no file behind it.
Zip the folder to hand the design system to someone who cannot open the
artifact, or point an agent at it ("read `project/README.md` first"). It is
not a way to publish: an artifact's index needs that artifact's upload ids,
so a team that wants its own artifact follows the previous section.

## Not in git

`ds-bundle/`, `.ds-sync/` (staged converter scripts), `sb-reference/` (the
reference Storybook), `.cache/` (grades and comparisons), `learnings/` and
logs.

What **is** in git is the verification anchor, `sync-anchor.json`: which
version of every component was last verified. A re-sync diffs against it
and grades only the components whose sources moved since, so a fresh
checkout - on any machine, in any organization - grades nothing it has not
changed. Whoever re-syncs refreshes it after grading (`NOTES.md`,
"Verification anchor").
