---
name: story-console
description: Start Storybook in Docker, open every story in Chromium, and collect what it prints -- console errors and warnings with their stacks, uncaught exceptions, Storybook's error display, failed requests -- then group the findings and offer fixes. Use when asked to check stories for console errors, to sweep Storybook for React warnings, or to confirm a change left no story complaining.
argument-hint: "[--changed [--base <ref>]] [--filter <text|/regex/>] [--paths <dir,...>] [--docs] [--host]"
---

# What the stories print

Nothing in this repository watches a story's console. The Playwright specs in `__tests__/` take
screenshots, CI's Storybook job only builds, and `audit-stories` reads source. So a React key
warning, a prop leaking onto a DOM element, an `act()` warning, a control Storybook cannot
infer, a route the demo portal has no fixture for -- each renders fine and is seen by nobody.

Scripts: `.claude/scripts/story-console/` -- `scan.mjs` (the scanner), `docker.mjs` (runs it in
the `ui-kit-tests` image through the `stories-console` service in `compose.yaml`), `changed.mjs`
(module folders a diff touches), `ignore.json` (known noise).

The scan runs against `storybook dev`, **never the static build**: `storybook build` is a
production bundle, and React prints none of its development warnings there. A clean scan of
`storybook-static` means nothing.

## Step 1 -- scope

Pick from what the user asked; do not ask when it is clear.

| Asked for                                | Flags                                        |
| ---------------------------------------- | -------------------------------------------- |
| "all stories", a sweep, nothing specific | none -- every story, ~992 of them            |
| what this branch or change touched       | `--changed` (`--base master` for a branch)   |
| one component or area                    | `--filter aside`, `--paths components/aside` |
| the `.mdx` pages as well                 | add `--docs` (157 more entries)              |

`--filter` matches the story id, title or file, case-insensitively, or a `/regex/`; repeat it
for more than one. `--changed` maps changed files to module folders (`components/button`,
`selectors/Files`) and scans their stories; a change under `styles/`, `hooks/`, `utils/`,
`.storybook/` and the like can surface anywhere, which the script says -- then offer the full
run rather than trusting the narrow one.

## Step 2 -- run it in Docker

```bash
node .claude/scripts/story-console/docker.mjs [flags]
```

It rebuilds the image first -- after the first build only the final `COPY . .` layer, so the
working tree as it is now is what gets scanned -- then runs the scan in a container that starts
`storybook dev` itself. The first build installs dependencies and Chromium and takes several
minutes; say so. A full scan is a few minutes more. **Run it in the background** and do not poll.

`--no-build` reuses the image as it stands, for re-reading the same tree. `--concurrency 3` is
the default; lower it if the container runs out of memory (timeouts in bulk are the symptom).

Exit 0 is clean, 1 means findings, 2 means the scan itself failed -- read
`audits/story-console/storybook.log` (the dev server's output) before anything else then.

**`--host`** in the arguments means skip Docker: `node .claude/scripts/story-console/scan.mjs
--start [flags]` on this machine (needs `pnpm exec playwright install chromium` once), or
`--url http://localhost:6006` against a `pnpm storybook` already running. It is the quick way
to re-check a handful of stories after a fix; the Docker run is the reference, because it is the
same Linux and fonts for everyone.

## Step 3 -- read the report

`audits/story-console/report.md` (gitignored, like the rest of `audits/`), with the full data in
`report.json`. Three sections:

- **Error display** -- the story threw while rendering and shows Storybook's red screen. Worst
  first; each is broken for anyone who opens it.
- **Timed out** -- never settled in 60 s. Usually an infinite render loop, a `play` function
  waiting on something that never appears, or a promise nobody resolves. A retried dev-server
  reload is not counted.
- **Messages** -- deduplicated across stories (numbers and hashes do not split a group), in the
  order `pageerror`, `error`, `warn`, `network`, then by how many stories hit it. Each has its
  text as the console shows it and the stack of the call, frames from this repository first.

A React warning (unknown DOM prop, invalid nesting, missing key, unrecognised tag) is logged from
inside React, so its stack is React's alone; for those the group also has a **Rendered by** block
-- the component stack of the element React was working on, taken from React's DevTools
internals, with source lines. Its first repository frame is normally the JSX to change.

Then **triage each group** before proposing anything. Read the code the stack or the Rendered by
block points at; a group with neither is found through the stories listed under it.

| Looks like                                                                       | Usually is                                                                                                                                                                   | Fix goes in                                            |
| -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| `Each child in a list should have a unique "key"`                                | a `.map` without a stable key                                                                                                                                                | the component, or the story if the list is the story's |
| `React does not recognize the X prop on a DOM element`, `Invalid value for prop` | props spread onto a DOM node                                                                                                                                                 | the component: pick the props off before spreading     |
| `Addon controls: Control of type color only supports string`                     | `argTypes: { x: { control: "color" } }` on a prop that is not a string, or a regex matcher in `preview.tsx` (`/(background\|color)$/i`) catching a boolean such as `isColor` | the story's `argTypes`                                 |
| `[demo portal] no fixture for GET /api/...`                                      | a story reaching a route `.storybook/mocks/handlers` does not answer                                                                                                         | a handler plus fixture in `.storybook/mocks/`          |
| `useApi must be used within an ApiProvider`                                      | a story rendered outside the decorator's provider                                                                                                                            | the story; see `.claude/rules/live-portal.md`          |
| `404 GET static/...`, `/images/...`                                              | an asset path the kit does not ship                                                                                                                                          | the component's import, not a copied file              |
| `act(...)`, `findDOMNode`, `defaultProps` deprecation                            | legacy React API                                                                                                                                                             | the component                                          |
| from `@onlyoffice/ai-chat`, `msw`, Storybook itself, no repo frame               | not ours                                                                                                                                                                     | nowhere -- candidate for `ignore.json`                 |

Also note what the same message means in the product: a warning in a story is usually a warning
in DocSpace too, which makes it a component bug, not a story bug -- unless only the story's
args produce it.

## Step 4 -- offer the fixes

Present a short table: group number, what it is, how many stories, where the fix goes, and a
one-line proposed fix. Then ask with `AskUserQuestion` (multi-select) which groups to fix --
recommended first, and say plainly which you consider noise. Do not fix without the answer: a
sweep can span dozens of components.

## Step 5 -- fix and re-scan

For each chosen group:

1. Fix at the source the triage named -- the component rather than a workaround in the story,
   unless the story's args are the cause. Follow `.claude/rules/component-authoring.md` and
   `theming.md` as usual.
2. Re-scan **only the affected stories**: `--filter`/`--paths` for them, Docker or `--host`.
   The group has to be gone from the new report, and nothing new may appear.
3. Run `pnpm tsc`, `pnpm lint` and the component's tests (`pnpm test components/<name>`).

Never make a story quiet by silencing the console -- no `console.error = () => {}`, no spy that
swallows, no `parameters` that hide the error. That removes the report, not the defect.

`ignore.json` is for two things only: noise that is genuinely not this repository's -- a
third-party package's own warning with no repo frame and no way to reach it from here -- and a
story that errs on purpose, such as the ErrorBoundary stories throwing to show their fallback.
Each entry is `{ "pattern", "level", "stories", "reason" }`: `pattern` a regex on the message,
`level` optional (`error`, `warn`, `pageerror`, `network`), `stories` an optional regex on the
story id -- give it whenever the message is only expected in some stories, so the same message
anywhere else is still reported -- and `reason` why this is not a defect. Add one only with the
user's agreement, never to make a run green.

## Step 6 -- report

Say which scope ran and where (Docker or host), the headline counts, what was fixed and
verified by the re-scan, and what is left -- with the reason each remaining group was not
fixed. Do not commit unless asked.
