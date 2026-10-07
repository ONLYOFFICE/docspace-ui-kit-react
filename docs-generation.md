# API-site documentation

How the UI kit's section of `api.onlyoffice.com` (`site/docspace/ui-kit`) is produced. The
scheme follows `docspace-sdk-js`: a script writes Docusaurus-ready pages into a gitignored
directory, and a second one copies them into a checkout of the site repository, where they are
reviewed and committed. Nothing here deploys anything.

The difference is the source. The SDK generates its reference from JSDoc with TypeDoc; this
package already has the text and the tree: **the site is a copy of Storybook**. Every docs entry
of the Storybook index becomes a page, in Storybook's tree and order, with the same text, and
with what only Storybook can render -- the stories, the args tables, the React blocks of a page
-- as pictures.

## Commands

```bash
pnpm docs:build       # everything: Storybook, Chromium if missing, the pictures, then the pages
pnpm docs:sync        # docs:build, then copy site-docs/ into ../api.onlyoffice.com/site/docspace/ui-kit

pnpm run docs             # the pages alone, in seconds and with no browser; a [warn] fails it
pnpm docs:check       # the same, then every page compiled as MDX the way Docusaurus will
pnpm docs:screenshots # the pictures alone, from an existing storybook-static
```

`docs:build` and `docs:sync` take `--reuse-storybook` to keep an existing `storybook-static`
instead of rebuilding it. `docs:screenshots` takes `--only <slug>...` for a few pages,
`--missing` for the pictures not on disk yet and `--storybook <dir|url>` for a Storybook other
than `storybook-static`; the full set is about 1 100 pictures and takes some fifteen minutes.

CI runs `pnpm docs:check` in the lint job.

| Variable        | Effect                                                                                                                                           |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `DOCS_REVISION` | Branch or commit the "Edit this page" and source links point at. Default: `master`, the one branch the GitHub mirror carries                     |
| `STORYBOOK_URL` | A published Storybook. Set, every component page gets an "Open in Storybook" link, and `docs:screenshots` reads it instead of `storybook-static` |
| `API_SITE_ROOT` | The api.onlyoffice.com checkout for `docs:sync`. Default: `../api.onlyoffice.com`                                                                |

## Publishing

As for the SDK, publishing is the site team's step: this repository only has to make
`pnpm docs:check` pass, which CI runs. `pnpm docs:sync` copies the output into a local checkout of
the site for a look before handing over; it is not a deploy.

What the site needs, once:

- a `docspaceUiKit` sidebar in `sidebars.ts` -- the root page, then the generated sidebar:

  ```ts
  docspaceUiKit: [
    {type: "doc", id: "docspace/ui-kit/index"},
    ...require('./site/docspace/ui-kit/ui-kit-sidebar.cjs'),
  ],
  ```

- a `docSidebar` entry for it in the DocSpace navbar menu in `docusaurus.config.ts`, and a
  section in `src/sections.ts` (which gives the DocSpace landing its card and `llms.txt` its
  entry) with an icon in `src/features.tsx`;
- a `ReBuild docspace-ui-kit` workflow shaped like `rebuild-docspace-js-sdk.yaml`, which checks
  this repository out at a ref and, in it, runs

  ```bash
  pnpm install --frozen-lockfile
  DOCS_REVISION=<that ref> pnpm docs:build
  ```

  then replaces `site/docspace/ui-kit/` with `site-docs/` and commits. `docs:build` builds the
  Storybook, takes the pictures and writes the pages; half an hour on a GitHub runner, so give
  the job `timeout-minutes: 90`.

  **Run the job in Playwright's image**, the one matching `@playwright/test` in
  `package.json`:

  ```yaml
  container: mcr.microsoft.com/playwright:v1.58.1-noble
  ```

  Chromium and its system libraries are already in it, and `docs:build` sees the browser on
  disk and skips the install. Without the image, `docs:build` runs
  `playwright install --with-deps chromium` itself: an `apt-get` as root, a 170 MB download
  and its extraction into the runner's filesystem. That is where a Docker-based runner once
  stalled for the whole hour, with nothing in the log after the download's progress bar. If
  the image cannot be used, run that install as a step of its own with `timeout-minutes: 10`
  and `DEBUG: pw:install`, so a stall is bounded and the extraction shows in the log.

A new story, page or group here changes nothing on the site: the sidebar module carries the tree.

## One page per Storybook docs entry

Storybook's index has one docs entry per CSF file and one per MDX page. Each becomes a page:

- **A CSF file with an MDX docs page pointing at it** (`<Meta of={Stories} />`: the selectors,
  the errors, the uploader, the portal composites, the samples) -- the MDX page, kind `docs`.
- **A CSF file with a README beside it** (every component under `components/` and the three
  public providers) -- the README, kind `readme`, which is what Storybook renders as the
  component's Docs page (`.storybook/blocks/DocsPage.tsx`): the README's intro, the primary
  story, the props, the stories, the README's reference half.
- **A CSF file with neither** (the table's parts, `ArticleItem`, AI Settings) -- a generated page,
  kind `autodocs`: title, `docs.description.component`, the primary story, the args table, the
  stories.
- **An MDX page of its own** (`<Meta title="…" />`: Getting started) -- the page, kind `mdx`.
- `docs/getting-started.md`, as "Installation and setup", because nine READMEs link to it
  (`EXTRA_PAGES`).

Portal-internal components are on the site because they are in Storybook. The one section left
out is `Samples` (`SKIPPED_ROOTS`): the samples are applications run against a portal, and
without one they photograph as demo screens; the Welcome hero drops its links to them.

## The tree and the order

A page's place is its Storybook title. `UI/Form controls/TextInput` puts the page in `UI`, under
it `Form controls`, labelled `TextInput`; the categories nest as Storybook's sidebar does. The
file is the label in kebab-case, split at its capitals (`PeopleSelector` -> `people-selector`,
`Error404` -> `error-404`); a README page is named after its folder, which already is.

- **A README with no story of its own** but with stories below it (`components/rows`,
  `components/tiles`, `components/table`) describes the group those stories sit in. It becomes
  that category's page, followed by the table of its pages.
- **Order is `storySort.order`** in `.storybook/preview.tsx`, read with the TypeScript parser,
  so there is one order and the site cannot drift from the sidebar. It stays inline in the
  preview because Storybook reads it statically and rejects an imported constant ("Unexpected
  'STORY_ORDER'"). Names the order does not list follow Storybook's index: story files in byte
  order of their path, a group placed where its first story appears.
- **Titles are read from source** with the TypeScript parser, so no Storybook build is needed
  for the pages. A title that is not a string literal is reported instead of guessed.

## Pictures

`pnpm docs:screenshots` (`scripts/docs/screenshots.mjs`) takes, for every page, what
`scripts/docs/pictures.mjs` lists for it, in the light and the dark theme, on a transparent
canvas, into `site-screenshots/<category>/<page>--<name>-{light,dark}.png`:

- `primary` -- the story the page opens with: the one tagged `picture` in its CSF
  (`tags: ["picture"]`), else the file's first. A component that opens from a trigger has a
  recipe in `PICTURE_RECIPES` (`scripts/docs/config.mjs`): the gesture that opens it, and what to
  hide so only the component is in the picture. The recipe applies to every story of the
  folder; a story that does not render the trigger is photographed as it is.
- one per story, named after the story (`with-icon`), for the Stories section. A story tagged
  `no-picture` is listed without one -- for a story that paints a page of its own in both
  themes, as `FieldContainer`'s `CustomStyling` does. An export whose key would be `primary` or
  `args-table` is named `<key>-story`.
- `block<n>` -- the n-th React element of an MDX page, photographed on the Docs page itself:
  the infographics and anything `scripts/docs/blocks.mjs` has no text rendering for;
- `args-table` -- the args table of an `autodocs` page, or a `<Controls />` block, read off the
  Docs page as rows into one JSON file rather than photographed, so the site shows a table.

A page listed in `MDX_PAGES` with `pictures: false` gets none of these: the Document Editor
wrapper and the TranslationProvider photograph as nothing a reader learns from.

Stories are opened with `globals=canvas:transparent`, a global `.storybook/preview.tsx` declares
to drop the white or black page the decorator otherwise paints; the picture is the union of
everything that paints anywhere in the body, so what a portal renders is in it too, with an 8px
margin, clamped to the viewport, taken at 2x and shown at 1x. The demo-data banner and the
dashed story frames (`STORY_CHROME`, matched by CSS-module class prefix) are hidden first: they
are scenery, not the component. A block is photographed as the element Storybook rendered,
matched to the MDX by position among the page's non-Markdown blocks.

`pnpm run docs` copies the pictures beside the pages and puts a Docusaurus `<ThemedImage>` where
each belongs, so the reader sees the theme they are in. A picture not taken leaves no trace on
the page beyond a count in the run's output: CI runs no browser, and `pnpm run docs` stays seconds.

It needs a static Storybook (`pnpm storybook-build`, or `STORYBOOK_URL` for a served one) and
Playwright's Chromium (`pnpm exec playwright install chromium`). Storybook's `index.json` names
every story and docs entry, so nothing is guessed; the export-to-id rule (`WithIcon` ->
`with-icon`) is Storybook's own `storyNameFromExport`.

## What a page is changed into

`scripts/docs/render.mjs`:

1. **README pages.** HTML comments go: the metadata block and the `props`/`enums` markers. So
   does the "_Generated by `pnpm readme:props`_" note, which is for repository readers. Links
   are rewritten: a README or published file becomes a relative link to its page on the site, a
   Storybook `?path=/docs/…` link the page that story became, any other repository file a GitHub
   link at `DOCS_REVISION`; a link to a file that does not exist is a `[warn]`. Prose is escaped
   for MDX: `{`/`}`, a `<` that would open a JSX element, autolinks, void tags; code blocks and
   inline code are never touched. Each Props table is reshaped into the SDK's three columns,
   `Property | Type | Description`: `Required` becomes the optional marker after the code span
   (`` `label`? ``, outside the span so the row id has no `?`) and `Default` closes the
   description as ``Default: `x`.``. Five columns do not fit the site's `<APITable>`, which the
   tables are then wrapped in; as in the SDK, they get a `name` only when their row ids collide.
   The primary picture goes under the intro. A Stories section, listing each story's name,
   description (`docs.description.story`) and picture, is placed before the Minimal example
   heading, where Storybook shows them.
2. **MDX pages.** Imports and `<Meta>` go; every other React element at the top level is
   replaced by its picture, a `<Story of>` by the story's. A trailing rule and the paragraph after
   it -- the version and licence line under Welcome -- is the page's Storybook footer and goes
   too. A page whose H1 was inside a React element gets one from its title.
3. **Front matter**: `description` from the metadata `summary` (or the component description),
   and `custom_edit_url` pointing at the source file.
4. **Portal-only pages.** A README whose `status` is `portal-internal`, or a page whose source
   is under a directory in `PORTAL_DIRS` (`scripts/docs/config.mjs`), opens with a warning
   admonition that says so and links to the Public API page.

## Category pages

A category without a README of its own gets a page built from `scripts/docs/sections.mjs`: a
title, a paragraph, and a table of its groups and pages with each one's summary. Storybook groups
have nothing to say about themselves, so that paragraph lives there, keyed by Storybook path
(`"UI/Form controls"`). **A new Storybook group fails a strict run until it has an entry.**
`index.md` at the root lists the top-level categories.

## Output

```
site-docs/
├── index.md                  # section landing
├── ui-kit-sidebar.cjs        # items array for the site's sidebars.ts, nested as Storybook's
├── getting-started/          # index.md + welcome, installation, structure, …
├── components/               # index.md + the portal composites; selectors/, providers/, errors/
└── ui/                       # index.md + form-controls/, overlays/, … one directory per group
```

Sidebar doc ids carry the `docspace/ui-kit` prefix, and every category links to its
`index.md`. The site spreads `ui-kit-sidebar.cjs` into its own category, as it does
`typedoc-sidebar.cjs` for the SDK.

## Fixing a problem

Fix it at the source, in this order: the README, the MDX page or the story; the config in
`scripts/docs/config.mjs` / `sections.mjs`; a transform in `scripts/docs/`, and then a general
rule with a test in `scripts/docs/docs.test.mjs`, not a page-specific patch. Never edit
`site-docs/` or `site-screenshots/`, which are regenerated.
