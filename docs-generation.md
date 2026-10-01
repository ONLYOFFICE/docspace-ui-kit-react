# API-site documentation

How the UI kit's section of `api.onlyoffice.com` (`site/docspace/ui-kit`) is produced. The
scheme follows `docspace-sdk-js`: a script writes Docusaurus-ready pages into a gitignored
directory, and a second one copies them into a checkout of the site repository, where they are
reviewed and committed. Nothing here deploys anything.

The difference is the source. The SDK generates its reference from JSDoc with TypeDoc; this
package already has the text, one README per component, and the tree to arrange it in, the
Storybook sidebar. So there is no TypeDoc here, and the pipeline arranges and rewrites pages.
It does not generate them.

## Commands

```bash
pnpm docs             # site-docs/ -- pages, category pages, sidebar; a [warn] fails it
pnpm docs:check       # the same, then every page compiled as MDX the way Docusaurus will
pnpm docs:screenshots # a picture of every component into site-screenshots/ (needs storybook-static)
pnpm docs:sync        # pnpm docs, then copy site-docs/ into ../api.onlyoffice.com/site/docspace/ui-kit
```

CI runs `pnpm docs:check` in the lint job.

| Variable        | Effect                                                                                                                       |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `DOCS_REVISION` | Branch or commit the "Edit this page" and source links point at. Default: `master`, the one branch the GitHub mirror carries |
| `STORYBOOK_URL` | A published Storybook. Set, every component page gets an "Open in Storybook" link                                            |
| `API_SITE_ROOT` | The api.onlyoffice.com checkout for `docs:sync`. Default: `../api.onlyoffice.com`                                            |

`node scripts/docs/index.mjs --include-internal` publishes the portal-internal components too.

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
  pnpm exec playwright install --with-deps chromium
  pnpm storybook-build
  pnpm docs:screenshots
  DOCS_REVISION=<that ref> pnpm docs
  ```

  then replaces `site/docspace/ui-kit/` with `site-docs/` and commits. The Storybook build and the
  pictures take about ten minutes on a GitHub runner; `pnpm docs` alone is seconds, and a run
  without the two picture steps publishes the pages without pictures.

A new category or page here changes nothing on the site: the sidebar module carries the tree.

## What is published

- **Every README with a `ui-kit-doc` metadata block** under `components/` and `providers/`
  whose `status` is `public`. The metadata supplies the page's `description` and its row in the
  category table. A README without the block is not published: nothing says what it is for or
  whether it is public.
- **The "Getting started" MDX pages** with Storybook's parts taken out: the imports, `<Meta>`
  and the decorative components listed under `drop` in `scripts/docs/config.mjs`, and a trailing rule with the paragraph after
  it, which is the page's footer (the version and licence line under Welcome). A page whose
  content is a React component is `skip`ped there, with the reason: "Agent skills" (infographics)
  and "Types and roles" (the access matrices).
- **`docs/getting-started.md`**, as "Installation", because nine READMEs link to it.
- **`Samples/*` is not published.** The samples run against a portal, and the site cannot.

## Where a page goes: the Storybook tree

A README's place is the `title` of the story in **its own folder**, the same pairing
`.storybook/blocks/Readme.tsx` uses to render it as the Docs page. `UI/Form controls/TextInput`
puts `components/text-input/README.md` in the "Form controls" category, labelled `TextInput`.

- **`UI` and `Components` are flattened.** Their children become top-level categories. The
  sidebar would otherwise open with one category that holds everything.
- **A README with no story of its own** but with stories below it (`components/rows`,
  `components/tiles`, `components/table`) describes the group those stories sit in. It becomes
  that category's page, followed by the table of its components.
- **Order is `storySort.order`** in `.storybook/preview.tsx`, read with the TypeScript parser,
  so there is one order and the site cannot drift from the sidebar. It stays inline in the
  preview because Storybook reads it statically and rejects an imported constant ("Unexpected
  'STORY_ORDER'"). Names the order does not list are sorted alphabetically. Storybook keeps them in file-import order, which follows folder names,
  not titles.
- **Titles are read from source** with the TypeScript parser, so no Storybook build is needed.
  A title that is not a string literal is reported instead of guessed.

## What a page is changed into

`scripts/docs/render.mjs`, in order:

1. HTML comments go: the metadata block and the `props`/`enums` markers. MDX has no HTML
   comments. So does the "_Generated by `pnpm readme:props`_" note, which is for repository
   readers.
2. Links are rewritten. A README or published file becomes a relative link to its page on the
   site. A Storybook `?path=/docs/…` link becomes a link to the page that story became. Any
   other repository file becomes a GitHub link at `DOCS_REVISION`, and so does a
   portal-internal README when internal pages are not published. A link to a file that does
   not exist is a `[warn]`.
3. README prose is escaped for MDX: `{`/`}`, a `<` that would open a JSX element,
   `<https://…>` autolinks, and void tags such as `<br>`. Code blocks and inline code are never
   touched. The MDX pages are MDX already and skip this step.
4. Each Props table is reshaped into the SDK's three columns, `Property | Type | Description`:
   `Required` becomes the optional marker after the code span (`` `label`? ``, outside the span
   so the row id has no `?`) and `Default` closes the description as `Default: \`x\`.`. Five
columns do not fit the site's `<APITable>`: on a third of the pages a long type pushed the
description off the right edge. The table is then wrapped in `<APITable>`and the import is
added. As in the SDK, the tables get a`name` only when their row ids collide.
5. Front matter: `description` from the metadata `summary`, and `custom_edit_url` pointing at
   the source file.

## Component pictures

`pnpm docs:screenshots` (`scripts/docs/screenshots.mjs`) photographs one story per published
component in the light and the dark theme, on a transparent canvas, into
`site-screenshots/<category>/<page>-{light,dark}.png`. `pnpm docs` copies the pair beside the
page and puts a Docusaurus `<ThemedImage>` under the intro paragraph, so the reader sees the
theme they are in; a page without a pair gets no picture, and the run says how many are
missing rather than failing -- CI runs no browser.

It needs a static Storybook (`pnpm storybook-build`, or `STORYBOOK_URL` for a served one) and
Playwright's Chromium (`pnpm exec playwright install chromium`). Storybook's `index.json`
names the story: the one tagged `picture` in its CSF (`tags: ["picture"]`), else the file's
first. A component that opens from a trigger -- a dialog, a toast, a drop-down, a tooltip -- has a
recipe in `PICTURE_RECIPES` (`scripts/docs/config.mjs`): the gesture that opens it, and
whether to hide the trigger so only what the portal renders is in the picture. The story is opened with `globals=canvas:transparent`, a global `.storybook/preview.tsx`
declares to drop the white or black page and the margin the decorator otherwise paints; the
picture is the union of everything that paints -- backgrounds, borders, shadows, images,
text -- anywhere in the body, so what a portal renders is in it too, with an 8px margin,
taken at 2x and shown at 1x.

Both directories are gitignored; the pictures are regenerated, never edited.

## Category pages

A category without a README of its own gets a page built from `scripts/docs/sections.mjs`: a
title, a paragraph, and a table of its pages with each one's summary. Storybook groups have
nothing to say about themselves, so that paragraph lives there, keyed by Storybook path
(`"UI/Form controls"`). **A new Storybook group fails a strict run until it has an entry.**
`index.md` at the root lists the categories. A compound README with no pages under it
(`components/table`: its parts have no README of their own) is one page, and is filed in the
category its metadata `category` names -- "Data display", beside Rows and Tiles -- rather than
standing alone between the folders as an empty category.

## Output

```
site-docs/
├── index.md                  # section landing
├── ui-kit-sidebar.cjs        # items array for the site's sidebars.ts
├── getting-started/          # index.md + welcome, installation, structure, …
├── providers/                # index.md + error-boundary, theme, translation
├── form-controls/            # index.md + one page per component
└── …                         # one directory per category
```

Sidebar doc ids carry the `docspace/ui-kit` prefix, and every category links to its
`index.md`. The site spreads `ui-kit-sidebar.cjs` into its own category, as it does
`typedoc-sidebar.cjs` for the SDK.

## Fixing a problem

Fix it at the source, in this order: the README (or the MDX page); the config in
`scripts/docs/config.mjs` / `sections.mjs`; a transform in `scripts/docs/`, and then a general
rule with a test in `scripts/docs/docs.test.mjs`, not a page-specific patch. Never edit
`site-docs/`, which is wiped on every run.
