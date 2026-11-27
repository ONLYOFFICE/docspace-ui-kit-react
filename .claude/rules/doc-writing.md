---
paths:
  - "**/README.md"
  - "**/*.stories.tsx"
  - "**/*.types.ts"
  - "**/*.types.tsx"
---

# How long documentation text runs, and what it says

`COMPONENT_README_TEMPLATE.md` says which sections a README has and `STORY_TEMPLATE.md` what a
story file carries. This file is about the text inside them -- a prop's JSDoc, an `argTypes`
description, a story's `description.story`, a README's lead and bullets: how long each runs,
what order it says things in, and what it leaves to the generated tables.

It has two readers, and they want the same text. A person reads the Docs page in Storybook or
the README on api.onlyoffice.com and looks for "what does it do" in the first line. An agent
reads the same README from the package and the `apps-ui-kit` skill, and from the JSDoc in
`dist/types`. Research on tool descriptions finds nothing gained beyond three to six sentences.
The context an agent pays for grows with every word, and a longer description among short ones
is picked more often whether it fits or not.

So there is one text, not a short one for people and a long one for agents. Two texts drift
apart, and nothing measured favours the long one.

## A. Every piece of prose

1. **The first sentence stands on its own.** It says what the thing is for, in the present
   tense, without "This component…" or "This prop…". The README's first sentence is the
   catalogue's `summary`, and a truncated listing shows nothing else.
2. **A sentence runs at most 25 words; aim for 15–20.** One fact per sentence. A condition and
   its consequence glued with ", and…, so…, which…" are two sentences.
3. **Only what the reader cannot see elsewhere.** The props table and the Controls panel already
   print the type, whether a prop is required, its default and an enum's members. The
   `## Test ids` table holds the test ids. A prop's description repeats none of them, and names no
   CSS variable; that belongs in `## CSS variables`. Say what a bound _means_ ("the field stops
   growing and scrolls"), not its number.
4. **One term per concept, in the kit's words.** A "room" in one prop and a "workspace" in the
   next read as two things. The kit does not know what a room is either: `audit-stories` has the
   rule on product terms.
5. **Neighbours match.** The props of one component, and the stories of one file, have the
   same length and tone. A description twice as long as its siblings draws the agent to it.
   Two props that differ by one state get parallel sentences.
6. **No internals.** No MobX store names, DocSpace-client paths, task numbers or names of
   private helpers. A consumer can see none of them.
7. **Deprecation is a tag.** `@deprecated Use X instead.` on the prop. The generator prints
   **Deprecated.** in front of it, so the prose does not say so again.
8. **A scenario is a recipe.** Anything that takes three steps to explain is a compiling block
   under `## Recipes`, or a page under `docs/`, not a long bullet.

## B. How long each piece runs

| Piece                                      | Norm                                                                    | Warning above                    |
| ------------------------------------------ | ----------------------------------------------------------------------- | -------------------------------- |
| README `summary` (the first sentence)      | one sentence                                                            | 160 characters, an error already |
| README lead paragraph                      | one to three sentences                                                  | 60 words                         |
| a `Use this when / not when` bullet        | one sentence; a "not" bullet links the sibling                          | 30 words                         |
| a prop's JSDoc                             | one sentence; a boolean switch says what both values do, in two at most | 40 words                         |
| an `argTypes` description                  | as the JSDoc, and never contradicting it                                | 40 words                         |
| a `description.story`                      | one or two sentences on _why_, or one short bullet per visible item     | 50 words                         |
| a `Behaviour the types don't state` bullet | one or two sentences, in the order of section C                         | 50 words                         |
| an `Accessibility` bullet                  | one or two sentences                                                    | 50 words                         |
| the Effect cell of `## CSS variables`      | one phrase                                                              | 20 words                         |
| any sentence                               | 15–20 words                                                             | 25 words                         |

The ceilings sit near the library's p85 on the day they were set (2026-11-17): about one
sentence, bullet or story text in seven runs past its ceiling. They mark the
tail, not the norm, so text written today aims at the Norm column. A bullet that needs more is
usually two facts, or a recipe.

## C. The order inside a behaviour bullet

The same three layers the API report recommends for an endpoint description:

1. **What happens** -- a statement, not advice: "`type="reset"` is coerced to `"button"`."
2. **When it matters, or what to use instead** -- "use a `<form>` reset handler to clear the
   fields."
3. **The trap**, only if there is one -- the case where following the obvious path fails
   silently.

Most bullets need only the first layer. The second is the most valuable after it.

## D. Smells

| Smell      | What it looks like here                                                                                    |
| ---------- | ---------------------------------------------------------------------------------------------------------- |
| Tautology  | `label` -- "Button text"; `tabIndex` -- "Button tab index"; `onClose` -- "Called on close".                |
| Bloated    | the props table retold in prose; a story description that lists every prop the story sets                  |
| Tangled    | a 40-word sentence carrying the behaviour, its exception and the workaround                                |
| Fragmented | half a fact in the JSDoc, the other half in a story description that does not ship                         |
| Untrue     | a sentence describing the component before its last fix. Wrong text is worse than none: an agent trusts it |
| Leaky      | a store name, a client path, an internal helper the consumer cannot see                                    |

A tautological JSDoc is fixed by answering one of three questions. What does the value change on
screen? Where does a valid value come from? What do both values of a boolean do?

## E. Text that leaves its page

The README and the story texts are also pages on api.onlyoffice.com (`docs-generation.md`), and
assistants fetch those pages and quote one paragraph at a time. Write so that a paragraph lifted
out on its own is still true.

1. **No live Storybook in a story's description.** The site prints it under a still picture, so
   "the Controls panel", "the Actions panel" and "Hover the buttons to see it" mean nothing there.
   Say what happens instead: "A hint below the button on hover". A canvas that needs a gesture
   says so in its own JSX, which the picture shows.
2. **The first sentence of a story's description is also its picture's alt text.** The generator
   uses it, so open with what the picture shows, not with how to use the story.
3. **A story's shown name is plain words for the state**, set with `name`: "Loading", "With icon",
   "Pressed look". The export keeps its name: it is the story's id, and the screenshot baselines
   and the site's picture files are keyed by it.
4. **A recipe's heading is the task a reader would type into search**: "Show a loading state while
   an action runs", "Make a destructive (red) button" -- not "Loading" or "Destructive". Advice that
   answers a task and sits in another section gets a recipe, and the section links to it.
5. **A snippet's component is named for what it is** (`DeleteButton`, `DialogFooter`), never
   `Example` or `Demo`. Labels and handlers are real (`label="Save"`, `onClick={save}`); an empty
   `() => {}` only where doing nothing is the point.
6. **No time-relative words**: "new", "recently", "soon", "no longer", "used to". Describe what is
   true now; a change and its version belong in `CHANGELOG.md`.
7. **CSS variables say which variants read each one** and where it must be set: on the component's
   own `style`, on an ancestor, or on the theme provider.
8. **Accessibility says, for every `aria-*` a consumer may pass, whether it is kept or
   overwritten**, and names each gap together with what the consumer has to add.
9. **Every sibling a reader may confuse the component with gets a "not when" bullet**, linked, with
   the reason in one clause.

What the site page gets on top -- its `<title>`, a meta description that names the package, the
alt texts -- is written by the generator (`scripts/docs/render.mjs`), not by hand in each README.

## What checks this

`pnpm check:readme` measures sections A2, B, E1 and the tautology smell, and reports them as
warnings, which never fail the gate:

- `W_LONG_SENTENCE` -- a sentence over 25 words, in a README's prose, a prop's JSDoc or a
  story's text;
- `W_LONG_TEXT` -- a piece over its ceiling in table B;
- `W_TAUTOLOGICAL_PROP` -- a JSDoc or `argTypes` description that adds at most one word to the
  prop's and the component's names. `id`, `className`, `style`, `ref`, `forwardedRef`, `testId`
  and `dataTestId` are exempt: their meaning is fixed by React or by the kit;
- `W_LIVE_ONLY_TEXT` -- a story's description that names a Storybook panel or opens a sentence
  with an instruction to act on the canvas ("Hover…", "Click…", "Right click…").

A README's warnings include its story files, those in subfolders without a README of their own
too -- the table's parts, the skeletons.

Most of the library predates this rule, so by default the warnings are printed only for the
folders the branch changed since it left its parent branch (`master`, `release/*`, `hotfix/*`),
however many times it was pushed. The rest are counted in one closing line. `--only <folder>`
prints them for that folder, and `--style-all` prints all of them. CI's checkout has no origin
branches to find the parent from, so on a pull request it fetches the target branch and passes
`--base origin/<target>`; the scope starts where the pull request left it.

How much of a folder's text to bring within the limits depends on the change:

- **A README or story file rewritten in full** -- `COMPONENT_README_TEMPLATE.md`'s procedure, an
  `audit-stories` fix -- clears every warning for the folder. The code is being read anyway.
- **A smaller change** clears the warnings on the lines it touches, and leaves the rest.

Do not sweep the library in one pass: a rewrite done for length alone, without reading the code, is
how a sentence turns untrue.

The counting lives in `scripts/lib/doc-style.mjs`, and `LIMITS` there is the one copy of the
ceilings; a test keeps table B above in step with it. It masks code spans before splitting, so the
dots in `ModalDialog.Header` end no sentence. The sentence split and the tautology threshold follow
the DocSpace server's `openapi-desc-opt` scan, in a server checkout next to the client
(`../DocSpace/server/.claude/skills/openapi-desc-opt/scan.py` from this repository). The
checks see length and wording only. Whether a sentence is _true_ is still the job of reading the
code, and of `audit-stories`.

## Where this came from

A report on API descriptions, dated 2026-11-02 and not kept in this repository, measured the
DocSpace OpenAPI contract against Stripe,
GitHub, Google, Microsoft Graph, Twilio and Slack. It also drew on Anthropic's and OpenAI's
tool-definition guidance and on three studies: Hsieh et al. 2023, Hasan et al. 2026 ("MCP Tool
Descriptions Are Smelly!") and Faghih et al. 2025. The server's endpoint rule still asks for 150–200
words per operation, and the report argues against that number; nothing here carries it over.
