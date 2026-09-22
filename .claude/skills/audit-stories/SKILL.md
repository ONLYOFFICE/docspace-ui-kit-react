---
name: audit-stories
description: Audit ui-kit components against their Storybook stories — find components without stories, props and states no story shows, stories that drifted from the component's real API or behavior, and stories that break the writing template (STORY_TEMPLATE.md). Invoked without a named component it always starts by asking which one to audit — a menu of component folders, never a scope picked on its own. Use for a component, a folder, or (deliberately) the whole library; `template` runs the template check alone.
argument-hint: "<component | folder> [all] [template]"
---

# Stories audit

The stories are the only written description of a component a
Storybook reader gets: `parameters.docs.description.component`
carries the feature list, the accessibility notes and the table of
CSS variables (see `.claude/rules/component-authoring.md`). This
skill compares each component's actual code with its stories and
reports where they disagree. Fixes land in this repository — the
client consumes only the packed tarball and holds no story.

Scope: the component or folder from the argument. When neither the
argument nor the request names one, **the scope question is
mandatory**: ask it with the interactive option dialog before opening
a single file. Discovering that only one candidate looks relevant is
research, not an answer — the dialog still runs, with that candidate
first, marked "(Recommended)". Options are real component folders
under `components/` — the dialog holds four, so offer the most recently
changed ones and let the built-in "Other" cover the rest. Never pick a
scope yourself. `all` sweeps the whole library — offer it only when
the user asks for a full audit, and warn that it is a long run and
prefer batching by folder. A folder or `all` run is reported in the
shape of "Reporting a sweep" below, never as a stream of items.
`template` after the scope runs check 6 alone: a static pass over the
writing conventions, no code comparison and no browser. Its report
keeps the fixed shape below with only the `### Template` section.

## Checks, per component

1. **A story exists at all.** The convention is one `.stories.tsx`
   per component; a component without one is a finding by itself. The
   file may sit in a subdirectory (`table`, `rows` and `tiles` keep
   theirs there), so search recursively before reporting one missing.
2. **Props coverage.** Compare the exported props type
   (`<Name>.types.ts`) with what the stories exercise through `args`,
   `argTypes` and controls:
   - a prop no story ever sets — especially enum/variant props, where
     each variant deserves a story or a control;
   - callbacks that are wired in the component but invisible in every
     story (no action, no interaction).
3. **State coverage.** Conditional renders in the component (disabled,
   loading, error, empty, RTL-sensitive layout) that no story puts on
   screen.
4. **Staleness.** The reverse direction:
   - story `args` or `argTypes` naming props the component no longer
     has (spreads and loose typing let these survive compilation);
   - defaults shown in `argTypes`/docs that differ from the component's
     real defaults;
   - prose in the story or `.docs.mdx` claiming behavior the component
     code does not implement (verify each claim against the deciding
     code, never against other prose).
5. **Naming and placement** only when broken: the story must live next
   to the component and follow `<Name>.stories.tsx`.
6. **Template conformance.** The story file against `STORY_TEMPLATE.md`
   and the rules under "Fixing stories" below, read statically. A
   deviation is a finding even when the text is accurate:
   - the component description: one purpose sentence, then
     `### Features` with 6–8 `**Label**: <clause>` bullets that are
     full statements — a bare enumeration, a list of prop names, a
     label repeated as its own clause or a trailing period each count;
     `### Accessibility` present when the component sets roles,
     `aria-*` or handles keys, absent otherwise; `### Usage` with two
     to four examples;
   - every story has `parameters.docs.description.story` saying why,
     and `parameters.docs.source.code`;
   - a story is named for what the reader sees or does, not for the
     mechanism;
   - every prop has an `argTypes` entry with a description in the
     types' own terms, a control and the real default;
   - sample data is neutral: no product roles or policies, real names,
     photos, brand names or network-fetched images; one placeholder
     icon unless icons are the subject;
   - `CssCustomization` has the standard form, and every row of its
     table names a variable some rule reads;
   - comments are one line and explain only what the code cannot show.

## Report and fixes

- Rank: missing story file, then stale claims and dead args (actively
  misleading), then coverage gaps (merely incomplete), then template
  deviations (form only).
- **The report has a fixed shape**, top to bottom, and nothing else:
  1. `Scope:` — one line: the component, its story file, the files
     compared.
  2. `Checked:` — one line for everything that passed (placement,
     naming, descriptions present, baselines, tests green). What is
     fine never gets a paragraph, and process narration ("Storybook
     stopped", "writing the report") appears nowhere.
  3. One tally line: how many stale items, how many gaps, how many
     template deviations, how many findings outside the stories, and
     the worst item in one clause.
  4. `### Stale and misleading` — the full skeleton per item.
  5. `### Coverage gaps` — one line per item.
  6. `### Template` — one line per item.
  7. `### Outside the stories` — README, types and component bugs the
     audit ran into, one line each, labelled `README:` or `Component:`.
  8. One closing line: what gets fixed on request, by item number.
- **Items are numbered continuously** across the four sections, so the
  closing line and the user can say "items 4 and 5" and be understood;
  a blank line separates items; each opens with a bold title of at
  most twelve words naming the prop, story or claim and the defect.
- **A stale item has three labels**, so the reader never guesses which
  side is speaking: **"The story shows:"** — what it renders, with
  clickable `[file:line](path#LN)` links; **"The component actually:"**
  — the deciding code, with links; **"Fix:"** — the change. Each label
  is one or two sentences, an item cites at most three locations, and
  the causal chain has at most three steps ("the story sets `title`,
  the HOC strips it, no `RootTooltip` is mounted, so hover shows
  nothing"). The browser check, the test that hides the bug and any
  further evidence go into one indented `Evidence:` sub-bullet, never
  into the labels.
- **A coverage gap is one line**: the prop or state — what the
  component does with it, one link — `Fix:` the story or `argTypes`
  entry to add. It never gets the three-label skeleton.
- **A template item is one line too**: the story, section or bullet —
  what breaks the template, one link — `Fix:` the change. When the fix
  is a rewording, the Fix line carries the new text in full, so it can
  be applied as written.
- **Fix is one line**: the exact change when it fits, otherwise a
  phrase. Alternatives only when the choice is the user's, joined with
  "or". A broader remedy (a global decorator, a HOC change) is its own
  item under `Outside the stories`, not a tail on the Fix line.
- Plain statements, written for a reader who has not seen the code: no
  metaphors, no imagery, no clever headlines ("the baseline PNG is a
  blank page" — never "the tests guard an empty page"). A causal chain
  is spelled out step by step in words ("the story never wires the
  prop the component needs to render, so it shows nothing, so the
  committed baselines are blank"), never compressed into a list of
  props the reader must decode.
- Apply fixes when asked: new or corrected stories follow the library's
  own conventions (`CLAUDE.md`, `.claude/rules/component-authoring.md`)
  and land as commits in this repository. Behavior that looks wrong in
  the _component_ is reported as a potential bug, not papered over in
  the story.

## Reporting a sweep

A folder or `all` scope produces dozens of items, and the itemized
format that reads well for one component turns into a wall of text
for thirty. The reader's first question is _which components have a
problem_, so a sweep report answers that before anything else:

- **Summary table first**, and nothing above it but one line naming
  the scope. One row per component with at least one finding, worst
  first, six columns, no prose inside a cell:

  | Component        | Story file | Stale | Gaps | Template | Worst finding                                    |
  | ---------------- | ---------- | ----- | ---- | -------- | ------------------------------------------------ |
  | `theme-provider` | missing    | –     | –    | –        | no story at all                                  |
  | `context-menu`   | ok         | 3     | 5    | 2        | `args.onHide` names a prop the component dropped |
  | `toggle-button`  | ok         | –     | 2    | 1        | disabled state never shown                       |

  `Stale` counts the items from check 4, `Gaps` the items from checks
  2 and 3, `Template` the items from check 6 (the only column a
  `template` run fills), `Worst finding` is the component's top-ranked item in one
  clause of at most ten words. A component whose story file is missing
  has no counts — the other checks cannot run on it.

- **Clean components in one line** right under the table: "No
  findings: `badge`, `button`, `checkbox`, …" — every audited name that
  is not in the table, comma-separated, never one bullet each and never
  left out (a name absent from both places looks unaudited).
- **Details grouped by component**: a `### <component>` heading per
  table row, in table order, with the itemized skeleton from above
  under it, items numbered within the component. In a sweep each stale
  item is trimmed to its three labeled lines
  — one clause each for "The story shows:", "The component actually:"
  and "Fix:" — and the step-by-step causal chain is spelled out only
  for the top item of each component. Two components never share a
  bullet, a sentence or a paragraph.
- **Batches keep the same shape.** When the run is split by folder, as
  the scope section asks for `all`, every batch reports this way and
  the closing message carries one summary table merged over all
  batches, so the reader ends with a single table for the whole
  library, not one per batch.
- **No narrative between the sections**: no "moving on to", no
  restatement of the checks, no totals in prose — the table already
  carries them.

## Fixing stories

The pattern is `STORY_TEMPLATE.md` at the repository root, with
`components/button/Button.stories.tsx` as the reference. Every fix
follows it:

- **Component description** — one sentence on what the component is
  for (no internals such as ref methods or getter props), then
  `### Features`: 6–8 _capabilities_, one per bullet, in the form the
  existing stories use — `**Label**: <clause>` where the clause is a
  full statement a reader understands without the code: verb-led
  ("Displays folder hierarchy with clickable navigation items",
  "Automatically adjusts position based on viewport space") or a
  qualified noun phrase ("Optional form wrapper with submit handling").
  No trailing period, no bare enumerations ("arrows, Enter and
  Escape" says nothing — write what each key does), no lists of prop
  names, and one capability per bullet. Facets of the same capability
  belong together (the flag that turns it on, how it then looks, the
  tooltip it may carry — "Disabled Items: Dropped from the list unless
  `showDisabledItems` is set, then shown greyed out with an optional
  explaining tooltip" is one idea); an unrelated mode or a niche prop
  (`global`, `scaled`) is not appended as a second clause — it gets
  its `argTypes` entry and, if it matters, its own story.
  `### Accessibility` (Button style: one intro sentence, then bullets)
  lists only what assistive-technology and keyboard users get — the
  roles and `aria-*` attributes the component sets and what each
  announces, the keys it handles, how focus moves — verified with a
  grep for `role=`, `aria-`, `tabIndex` and `.focus(` in the component.
  Styling hooks (`data-*`) and bidi attributes (`dir`) do not belong
  there; a component that sets none of this gets no section. `### Usage`
  with two to four short examples. Storybook's
  own guidance applies on top: the description says what the component
  is for and when to use it, a story description says _why_ one would
  use what it shows, not what it shows.
- **An `argTypes` description states the component's contract in the
  types' own terms**, not the product's use of it: `header` takes "a
  title with an optional visual — initials on a color, an icon, an
  avatar…", not "the room color" — the kit does not know what a room is,
  even when the prop next to it is called `isRoom`.
- **Props live in `argTypes` and the types file**, not in prose: the
  Docs props table is generated from `<Name>.types.ts` by
  `react-docgen-typescript`, JSDoc comments included. Document a prop
  by giving it an `argTypes` entry (control, description, real default)
  and, if it has none, a JSDoc line in the types file.
- **One story per concept or state**, driven by `args` through a shared
  template so the Controls panel works; every story has
  `parameters.docs.description.story` (the _why_, not a restatement of
  the props) and `parameters.docs.source.code`.
- **A story is named for what the reader sees or does**, in the
  template's forms (`WithBackdrop`, `DisabledState`, `AttachedToDocument`),
  never for the mechanism behind it: "Global Right Click" tells a reader
  nothing until the code is open, "Attached To Document" — the JSDoc of
  the prop it shows — does. Interactive canvases say what to do in
  their own text ("No trigger here — right click anywhere").
- **A story description reads from the screen, not from the types.** It
  says what the reader sees and then names the prop behind it, in
  parentheses: "**Auto-save** — the same switch, disabled; hover it to
  read why (`getTooltipContent`)". A story that shows several variants
  gets one bullet per visible item, labelled by the item's own text,
  never a bullet per prop with a chain of prop names ("`withToggle` +
  `checked`: a switch…").
- **Sample data is neutral.** Labels and texts in a story show the
  component, not the product: realistic for a document hub ("Anyone
  with the link", "Move to archive") but never product roles, access
  policies, feature lists or release-specific wording ("Full admin:
  manage the workspace, configure AI agents…") — those change with
  every release and turn the kit's docs into a stale copy of the
  product's. Brand and product names stay out entirely. People are
  generic too: no real names and no photos of real faces — a bundled
  placeholder avatar (`default_user_photo…`) and a role-like title
  ("Team member"); an image fetched from the network also makes every
  screenshot of the story depend on that host. Icons are one
  placeholder (`catalog.folder` in this library) repeated across the
  items — that is how MainButton, DropDown and the other menus do it;
  a story picks a fitting icon per item only when icons are what it
  demonstrates (an `ItemVariants` story), otherwise the dozen extra
  imports document nothing and break on the next icon rename.
- **Comments in a story are rare and one line long.** They explain only
  what the code cannot show — why a story is framed or hidden on Docs,
  why a type forces unused fields — and never repeat the story's own
  description or restate what the JSX plainly does.
- **Targeted edits only.** Keep the file's existing order, change lines
  in place, append new stories after the last existing one. The same
  applies inside the description, and every existing Features bullet,
  argTypes description and `description.story` is judged against the
  deciding code, not kept because it is old ("the backdrop dims the
  background when the menu is open" survived a rewrite while the code
  shows it only in the mobile layout): one that is accurate and
  reads as a full clause stays word for word; one that is wrong,
  names the wrong actor (the component "shows on right-click" when the
  host calls `show`), or repeats its own label ("Backdrop: Optional
  backdrop") is reworded in place; a missing capability is appended —
  the block is never written anew.
- **Fold corrections into this skill at once.** When the user catches
  a discrepancy in how a fix is being made, the rule that prevents it
  is added here in the same turn, before the fix continues. Never
  rewrite a story file wholesale and never run prettier on the whole
  file — the existing stories are not prettier-clean, so that alone
  rewrites hundreds of lines. Format the touched lines by hand in the
  surrounding style.
- **Keep existing story IDs and visuals stable**: `__tests__/` holds
  Playwright screenshot baselines per story ID. A converted story must
  render the same closed state it did before; new stories get new spec
  tests, and their baselines are generated in the Docker image (`compose.yaml`), never from a local macOS run.
- **A viewport preset works in the canvas only.** A story that sets
  `globals.viewport` to show a layout the component picks from
  `window.innerWidth` (a bottom sheet, a collapsed header) renders on
  the Docs page inline at the column's desktop width, where that layout
  never switches on. Give it the same narrow window there: a decorator
  that, when `context.viewMode === "docs"`, renders the story's own
  canvas (`iframe.html?viewMode=story&id=${context.id}`) in a
  phone-sized `<iframe>`, and passes `<Story />` through otherwise.
  Hiding the story from Docs is the fallback, not the first choice.
- **The Docs page mounts every story at once.** A story whose component
  listens on `document` or `window` (a `global` context menu, a hotkey
  hook, a scroll handler) answers events meant for its neighbours
  there; give it a document of its own with
  `parameters.docs.story = { inline: false }` and check the Docs page,
  not only the story canvas.
- **`CssCustomization` has one form** (94 of the 146 story files): the story text
  opens with "CSS Custom Properties for external customization:" and
  lists the variables as a Markdown table `| Variable | Description |
Default |` — defaults taken from the stylesheet's `var(--x, <default>)`
  fallbacks, "theme-based" when the fallback is a theme token. The
  example sets the variables on a wrapper `<div style={{ "--x": … }}>`;
  a component that portals its DOM (a menu, a dropdown, a tooltip) sets
  them through its own `style` prop instead, and the text says why.
- **A CSS-variables table is a list of claims — check every row.** For
  each variable a `CssCustomization` story documents, find the rule
  that reads it (`grep var(--name` across the component's stylesheets)
  and what that rule renders, and when: a variable no rule reads, or
  one whose rule changes nothing observable (a `line-height` on text
  inside a fixed-height row), is dropped from the table; one that only
  works in part gets the caveat in its comment; one that applies only
  in a mode the story does not show (the mobile-only header, an aside
  variant) is labelled with that mode. The same goes for any other
  list in the docs — keys, events, sub-components: every entry is
  verified, none is carried over on trust.
- **Verify in the browser** before reporting a story as fixed: start
  Storybook (`pnpm storybook`, port 6006), open the story, exercise the
  state the story claims to show. A claim the code seems to support but
  the page does not render is corrected or dropped, and the cause is
  reported as a component finding. The mechanics, all three of which
  have failed a run before:
  - Take the story IDs from `http://localhost:6006/index.json`, never
    from the title — the canvas is
    `iframe.html?viewMode=story&id=<story id>`.
  - A scripted check is written to the session scratchpad but run with
    `NODE_PATH="$PWD/node_modules" node <scratchpad>/check.cjs` from the
    repository root. Node resolves `require` from the _script's_ own
    directory, so a scratchpad script never sees the repository's
    `node_modules` and `cd` into the repository does not change that.
  - Import the browser from `@playwright/test`, not `playwright`: only
    the first is a declared dependency, so under pnpm's layout the
    second is absent from `node_modules` even at the repository root.

## Reporting fixes

A fix is reported by item number, never as a diff or as the rewritten
story. The message has a fixed shape and nothing else:

1. `Fixed:` — the item numbers from the audit report.
2. One line per fixed item: its number, what changed in one clause,
   one `[file:line](path#LN)` link. A text change — a Features bullet,
   a description, an `argTypes` description — adds two indented lines,
   `was:` with the old text and `now:` with the new, so the rewording
   is visible without opening the file. A structural change — a
   section added, a story renamed, a `source.code` block added — gets
   no `was`/`now`.
3. `Skipped:` — items left alone, each with the reason in one clause
   (needs a component change, is the user's choice, did not render as
   claimed in the browser).
4. `Checked:` — one line: the stories opened in Storybook, by story
   ID, and what they rendered, story IDs and screenshot baselines
   unchanged, touched lines formatted by hand, tests green. A fix
   reported without a story actually opened is not reported as fixed.
5. `Commit:` — hash and message, or "not committed" when the user
   asked to hold it.

The shape, with placeholders:

```
Fixed: items N, M.
N. <what changed, one clause> — [<Name>.stories.tsx:LN](components/<folder>/<Name>.stories.tsx#LN)
   was: "<old text>"
   now: "<new text>"
M. <section or story added or renamed, one clause> — [<Name>.stories.tsx:LN-LM](…)
Skipped: item K — <reason in one clause>.
Checked: <stories opened and what they rendered>, story IDs and baselines unchanged, touched lines formatted by hand.
Commit: <hash> <message> | not committed
```
