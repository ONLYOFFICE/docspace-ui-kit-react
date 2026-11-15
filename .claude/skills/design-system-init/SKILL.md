---
name: design-system-init
description: Build the ONLYOFFICE Apps UI Kit design system on this machine from this checkout -- install, library build, Storybook, the design-sync converter, then a self-contained copy in a folder that agents read instead of the Design System artifact. Use when someone wants the design system locally, has no access to the artifact (another organization), or wants to refresh their local copy after the kit changed.
argument-hint: "[--out <dir>] [--skip-build]"
---

# Design system, locally

The result is one folder, `<out>/project/` (default `../ds-export/project/`,
a sibling of this checkout), holding everything the published Design System
artifact holds: the brand book (`README.md`), screen recipes (`screens.md`),
`tokens.json`, the compiled kit with a card, preview and `.d.ts` per component
(`components/`), fonts, and every logo, screenshot and icon under `assets/`.
Its `design-system.json` names each asset by its local path, so the folder
needs neither claude.ai nor the artifact, and it can be zipped and handed on.

This skill builds and copies. It never commits, never uploads, never publishes
an artifact and never edits `.design-sync/artifact/assets.json`. Publishing an
artifact of one's own is a different flow: `.design-sync/README.md`,
"Publishing in another organization".

Run every step from the repository root with the Bash tool. Stop at the first
failure and report it with its output; do not work around a failed step.

## 1 -- preflight

- `.design-sync/artifact/export.mjs` must exist. If it does not, this branch
  predates the local copy: say so and stop.
- `node --version` (20 or newer) and `pnpm --version` must both answer.
- Work out the output directory: `--out <dir>` if given, else `../ds-export`.
  If `<out>/project/` already exists, it is replaced: say so in one line before
  step 5, and never point `--out` at the repository itself or at a folder that
  holds anything but an earlier copy (look first).

## 2 -- the converter

```bash
test -f .ds-sync/package-build.mjs && echo present || echo missing
```

`.ds-sync/` is the design-sync converter. It is not in git: Claude Code's own
`/design-sync` skill stages it into the checkout on its first run, and it stays
there. Nothing else provides it. If it is missing, stop and tell the user:

> The converter (`.ds-sync/`) is not here, and only `/design-sync` provides
> it. Run `/design-sync` once in this checkout, then this skill again. It
> diffs against the verification anchor committed in
> `.design-sync/sync-anchor.json`, so it grades only the components changed
> since the last verified sync -- not all of them. (Or ask someone who has the
> converter for a ready copy of the design-system folder: unzipped, it is
> exactly what this skill builds.)

This skill itself never grades: the repository holds the last verified state,
and a local copy is built from it as it is.

Do not try to recreate it, download it or copy it from elsewhere.

## 3 -- the build

Skip this step with `--skip-build` only when `ds-bundle/_ds_bundle.js` exists
and the kit has not changed since it was built; say that it was skipped.

```bash
pnpm install --frozen-lockfile
pnpm build
npx --no-install storybook build -c .storybook -o .design-sync/sb-reference
NODE_OPTIONS=--max-old-space-size=8192 node .ds-sync/package-build.mjs \
  --config .design-sync/config.json --node-modules ./node_modules \
  --entry ./dist/esm/index.js --out ./ds-bundle
```

- In a second worktree of the repository (`.git` is a file, not a folder), run
  `pnpm install` with `CI=1`: otherwise its `prepare` script installs git hooks
  into the `.git` the worktrees share.
- About two minutes with the converter in place; run the Storybook build and
  the converter in the background if the session's command limit is short.
- The converter must end without an error and leave `ds-bundle/_ds_bundle.js`.

## 4 -- the copy

```bash
node .design-sync/artifact/export.mjs --out <out>
```

It runs `build.mjs`, copies every asset from the folder its group mirrors, and
rewrites the index to local paths. It fails when an asset file is missing or
the index names a path the copy does not have. A warning that some files are
"not byte-identical to the upload" is expected (the published artifact holds
another revision of the three logos) and does not affect the copy.

## 5 -- check and report

```bash
ls <out>/project
grep -c '"blob"' <out>/project/design-system.json
```

Expect `README.md`, `screens.md`, `tokens.json`, `design-system.json`,
`components/`, `fonts/`, `assets/`, and a count of `0` (no upload ids left).
The export's own last lines give the asset count (323 at the time of writing)
and the number of index paths checked.

Report, in the user's language:

- where the copy is (`<out>/project/`), which commit it was built from
  (`git log -1 --format='%h %s'`), and the export's counts;
- how to use it: tell an agent "The design system is in `<out>/project`. Read
  `README.md` first, then `screens.md`; take components from `components/`
  and icons from `assets/`." -- or zip the folder for someone else;
- that the copy is a snapshot: after the kit changes, run this skill again.

Offer, without doing it unasked, to add that sentence to a project's own
instructions (`CLAUDE.md` or `CLAUDE.local.md` of the project where screens
will be designed), so every session there finds the copy.
