---
name: component-docs
description: Find and close the documentation gaps that ship in the published package -- components with no README, no story, or a README that is only a heading
argument-hint: "[<component-name>]"
---

# Close a documentation gap

`package.json` publishes `components/**/README.md`, so a component without one ships with no
documentation at all — and the JSDoc on its props is the only thing a plugin author can read
instead ([plugin-api.md](../../rules/plugin-api.md)).

```bash
node .claude/scripts/component-docs/gaps.mjs
```

Ten components have no README, one (`theme-provider`) has no story. Stories are searched
recursively — `table`, `rows` and `tiles` keep theirs in subdirectories, so do not conclude one
is missing from a flat listing.

## Writing a README

Match the existing ones; `components/badge/README.md` is a good short example. Four parts:

1. `# ComponentName`, then one paragraph on **what it is for and when to reach for it** — not
   a restatement of the props.
2. `## Usage` with a JSX block importing by subpath:
   `import { Badge } from "@onlyoffice/apps-ui-kit/components/badge";`. That is how the client
   imports; the barrel import is the plugin's form and belongs in the plugin skill, not here.
3. `## Properties` — a table of name, type, default, description. Generate it from
   `<Name>.types.ts` rather than by hand, and **fix the JSDoc while you are in there** if a prop
   has none. The table and the JSDoc have to agree; the JSDoc is what reaches consumers.
4. Anything the types cannot say: a required wrapper, an own margin, an intrinsic-size quirk.
   This is the part with real value — it is the same material the plugin skill's trap list is
   made of.

Do not invent behaviour. Read the component and its `.module.scss`; where you cannot tell, say
nothing rather than guessing, and note what you left out.

## Writing a story

The story is the documentation surface: `parameters.docs.description.component` carries the
feature list, the accessibility notes and the table of component-level CSS variables. Copy the
shape from a neighbouring component in the same Storybook section.

For a component-level `var(--x, fallback)`, the story's table is the **only** record that the
knob exists. Grep the `.module.scss` for `var(--` with a fallback and make sure each one has a
row.

`theme-provider` is the outstanding case, and it is not a visual component: a story for it shows
what it does to its subtree — `data-theme` on `<html>`, the resolved `--color-scheme-*`
properties, children rendering in both themes. Look at `ThemeProvider.stories.tsx` under
`providers/theme/` first; the provider already has one there, and the component wrapper may only
need to point at it.

## Verify

```bash
pnpm storybook                 # the story renders
npx prettier --check components/<name>
node .claude/scripts/component-docs/gaps.mjs
```

Storybook runs from a fresh clone with no DocSpace checkout: `locales/en`, `assets/icons/`
and `css/fonts.css` are committed.

## Scope

One component per commit unless asked otherwise. Ten READMEs in one diff is ten judgement calls
nobody can review, and a README written without reading the component is worse than none — it
looks authoritative.
