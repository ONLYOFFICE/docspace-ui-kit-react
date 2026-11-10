---
paths:
  - "**/*.scss"
  - "**/*.css"
  - "scripts/check-css-selectors.mjs"
  - "scripts/css-selectors-allowlist.json"
---

# Selectors that restyle the whole page

A selector is not only what it matches but what the browser has to recheck when the DOM changes.
Chromium keeps, for every selector, the features that can change its result -- a class, an id, an
attribute name -- and on each mutation restyles only the elements that carry one. Two kinds of
selector defeat that, and both have cost this code base real frame time.

## Never match on the `class` or `style` attribute

`[class*="buttonsContainer"]`, `[class^="icon"]`, `[class="x"]`, `[style*="display: none"]` -- any
operator. The feature the browser keeps for them is the attribute _name_, and every element with
a class has that attribute, so a change that touches the rule marks every one of them for a
restyle.

- `[class*=…]` behind a `:has()` in the client's `SectionHeader.module.scss` restyled the whole
  table on each row a scrolled list mounted: about 900 elements a time, 0.8 s of style work over
  one scroll of the API keys list, and most of a frame on every section page. Matching a class
  instead took it to 0.16 s.
- `:has(.chat-container:not([style*="display: none"]))` in `Section.module.scss` made every
  inline-style write in a section re-run the `:has()` -- a column drag writes one per frame.

They are fragile as well: `[class*="buttonsContainer"]` reaches into a CSS module's generated
name, which a rename or a build setting changes without anything failing.

**What to do instead.** Give the element a class of its own and match that. When the element
lives in this package and a host has to reach it, add a plain global class next to the module one
(`navigation-buttons-container` in `Navigation.tsx`, beside `navigation-logo` and
`navigation_button`) and mention it in the component's README. State that a stylesheet has to
read goes in a class or a `data-*` attribute set by the component, not in an inline style.

## `:has()` re-runs on every change below its subject

A `:has()` is re-evaluated whenever anything inside the element it is attached to changes in a
way its argument could see, and whatever follows it in the selector is then restyled.

- Attach it to the smallest element that answers the question, not to a page container or a
  scroller: under a scroller, every row a virtual list mounts counts as a change.
- After the `)`, match classes only. `:has(…) [class*=…]` and `:has(…) *` turn each of those
  re-runs into a restyle of everything below.
- A `:has()` that reads a pseudo-class that flips often (`:hover`, `:focus-visible`) on a large
  subtree re-runs on every pointer move or focus change; keep its subject small.

## How this is checked

`pnpm check:css-selectors` (`scripts/check-css-selectors.mjs`) fails on a selector on `class` or
`style` in any tracked `.scss` or `.css`, comments aside. It runs in pre-push and in CI.
`scripts/css-selectors-allowlist.json` holds the files that still do it and how many lines each;
the list only shrinks -- a file below its count fails until the count is lowered. What is in it
today: `ai-agent` styles markup of `@onlyoffice/ai-chat`, whose only hooks are utility classes
with CSS variables in their names, and `Filter` and `billing`'s top-up dialog, which can move to
classes of their own.

`:has()` is not checked mechanically -- whether one is cheap depends on where its subject sits in
the page. Review it by the rules above.

## How to find one

Measure before and after, on the stand or in Storybook:

- a Chromium trace with `disabled-by-default-devtools.timeline.invalidationTracking`: a long
  `UpdateLayoutTree` whose `elementCount` is the size of a whole table or page, scheduled by a
  `has` or `class` invalidation, is this problem;
- or delete candidate rules from `document.styleSheets` in the page and compare `RecalcStyleDuration`
  (CDP `Performance.getMetrics`) over the same interaction. Halving the candidates finds the one
  rule quickly.
