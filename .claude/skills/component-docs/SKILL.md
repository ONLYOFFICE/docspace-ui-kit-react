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

[`README_TEMPLATE.md`](../../../README_TEMPLATE.md) is the contract and
[`components/button/README.md`](../../../components/button/README.md) is the worked example.
Read both before starting; what follows is the procedure, not a second description of the
shape.

1. Read `index.ts(x)`, `<Name>.tsx`, `<Name>.types.ts`, `<Name>.enums.ts`, `<Name>.module.scss`,
   the tests and `sub-components/**`. If the barrel wraps the component, read the wrapper too.
2. Complete the JSDoc on every own prop, adding `@default` and `@portal` where the template
   says. A prop without one is an error, not a blank cell.
3. Write the metadata block. `state.visibility` names the real prop — this kit calls it
   `visible`, `isVisible`, `isOpen` and `open` in different folders, and the validator checks
   it against the resolved props.
4. `pnpm readme:props --write --only components/<name>`. Never type between the markers.
5. Write the hand sections, including at least three bullets under "Behaviour the types don't
   state", each traceable to the stylesheet, the source or a test.
6. `pnpm check:readme:full --only components/<name>` until clean, then remove the folder from
   `scripts/readme-allowlist.json`.

The section with the real value is the last one: what the types cannot say. An own outer
margin, a component with no intrinsic size, a callback that receives a value where every
sibling receives the event. It is the same material the plugin skill's trap list is made of.

Do not invent behaviour. Read the component and its `.module.scss`; where you cannot tell, say
nothing rather than guessing, and note what you left out.

## Writing a story

The story shows the component; the README describes it. `parameters.docs.description.component`
reads the README rather than repeating it:

```ts
import readme from "./README.md?raw";
// parameters: { docs: { description: { component: readme } } }
```

So the docs page a developer opens and the file a coding agent reads are one text. The metadata
block and the generator markers are HTML comments and render as nothing.

What the story owns is what prose cannot carry: the scenarios, the controls, the
visual-regression surface. A component-level `var(--x, fallback)` is recorded in the README's
`## CSS variables` table — grep the `.module.scss` for `var(--` with a fallback and make sure
each one has a row there, because stories are not published in the package and a consumer never
sees them.

`theme-provider` is the outstanding case, and it is not a visual component: a story for it shows
what it does to its subtree — `data-theme` on `<html>`, the resolved `--color-scheme-*`
properties, children rendering in both themes. Look at `ThemeProvider.stories.tsx` under
`providers/theme/` first; the provider already has one there, and the component wrapper may only
need to point at it.

## Verify

```bash
pnpm check:readme:full --only components/<name>   # structure, metadata, table, examples
pnpm storybook                                    # the story renders
npx prettier --check components/<name>
node .claude/scripts/component-docs/gaps.mjs
```

`check:readme:full` type-checks every ```tsx block in the README, so an example that does not
compile fails here rather than in a reader's editor. `gaps.mjs` answers a different question —
which files are missing at all — and the two do not overlap.

Storybook runs from a fresh clone with no DocSpace checkout: `locales/en`, `assets/icons/`
and `css/fonts.css` are committed.

## Scope

One component per commit unless asked otherwise. Ten READMEs in one diff is ten judgement calls
nobody can review, and a README written without reading the component is worse than none — it
looks authoritative.
