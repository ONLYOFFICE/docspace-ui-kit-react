# Story Template Guide

Use this template when rewriting component stories to match the Button pattern.

## Template Structure

```tsx
// (c) Copyright Ascensio System SIA 2009-2026
// ... (keep the full license header)

import type { ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

// Import the component and its types/enums
import { ComponentName } from ".";

const meta = {
  // 1. Title follows: "UI/<category>/<ComponentName>"
  //    The category must match the README's metadata block; see Categories below.
  title: "UI/<category>/<ComponentName>",
  component: ComponentName,
  parameters: {
    // 2. No component description. The Docs page is the component's README.md,
    //    rendered by .storybook/blocks/DocsPage.tsx; see "Where the description
    //    lives" below.
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
    // 3. Figma design link (if available)
    design: {
      type: "figma",
      url: "https://www.figma.com/file/...",
    },
  },
  // 4. argTypes - document each controllable prop
  argTypes: {
    propName: {
      control: "select" | "boolean" | "text" | "number" | "color",
      options: [], // for "select" control only
      description: "What this prop does",
      table: {
        defaultValue: { summary: "defaultValue" },
      },
    },
  },
} satisfies Meta<typeof ComponentName>;

type Story = StoryObj<ComponentProps<typeof ComponentName>>;

export default meta;

// 5. Optional: Wrapper component for consistent layout
const Wrapper = (props: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
        gridGap: "16px",
        alignItems: "center",
      }}
    >
      {props.children}
    </div>
  );
};

// 6. Default story - interactive with args
export const Default: Story = {
  render: (args) => <ComponentName {...args} />,
  args: {
    // default prop values
  },
};

// 7. Additional stories - one per significant variant/state
// Use dedicated template functions for complex renders

const VariantTemplate = () => {
  return (
    <Wrapper>
      <ComponentName variant="a" />
      <ComponentName variant="b" />
    </Wrapper>
  );
};

export const VariantStory: Story = {
  render: () => <VariantTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Description of what this variant demonstrates.",
      },
      source: {
        code: `<ComponentName variant="a" />
<ComponentName variant="b" />`,
      },
    },
  },
};
```

## Checklist for Each Component

1. [ ] **License header** - Keep the full AGPL license comment
2. [ ] **Meta title** - `"UI/<category>/<ComponentName>"` format
3. [ ] **No component description** - The README is the Docs page; a fact the story would state goes into the README
4. [ ] **argTypes** - Document every significant prop with control type, description, and default
5. [ ] **Default story** - Interactive story with `render: (args) => ...` and sensible `args`
6. [ ] **Variant stories** - One per major prop/state (disabled, loading, sizes, types, etc.)
7. [ ] **Story descriptions** - Each story has `parameters.docs.description.story`
8. [ ] **Source code** - Each story has `parameters.docs.source.code` with clean examples
9. [ ] **Template functions** - Extract complex renders into named `*Template` components
10. [ ] **Wrapper** - Use a layout wrapper for stories with multiple items
11. [ ] **Story order** - `Default` first, `CssCustomization` last; `RightToLeft`, when present, right before it
12. [ ] **`CssCustomization` has no table** - It demonstrates the variables; the README's `## CSS variables` lists them

## Where the description lives

The component's `README.md` is its only description. The Docs page renders it
(`.storybook/blocks/DocsPage.tsx`): the intro — purpose, when to use, import — above the
primary story, the reference sections below the stories, and the README's generated
`## Props` left to the Controls table. The README ships in the package and is synced into the
`ui-kit` agent skill; a story is in neither, so a fact written only in a story reaches nobody
who installed the kit.

So a story file carries no `parameters.docs.description.component`, and its
`CssCustomization` text says what the example sets, not which variables exist. A fact you
would have written as a Features or Accessibility bullet belongs in the README's
"Behaviour the types don't state" or "Accessibility"; a variable and its caveats in its
"CSS variables" table. Verify it against the code first — `README_TEMPLATE.md` governs the
README.

What stays in the story is what a README cannot hold: the canvases, the controls, the
`argTypes` descriptions, each story's `description.story` saying why it exists, and
`source.code`.

One exception: a story file whose own folder has no README — the table's parts, the
skeletons, `ArticleItem` — keeps a one-sentence `description.component`, because its Docs page
has nothing else to show. It names the parent page that describes the part in full, and the
facts live in the parent README.

## Story Naming Conventions

| Pattern             | Example                                         |
| ------------------- | ----------------------------------------------- |
| Default interactive | `Default`                                       |
| Size variants       | `Sizes` or `SmallSize`, `LargeSize`             |
| State variants      | `DisabledState`, `LoadingState`, `HoveredState` |
| Type/style variants | `PrimaryButtons`, `SecondaryButtons`            |
| Feature demos       | `WithIcon`, `WithTooltip`, `WithCallback`       |
| Direction           | `RightToLeft` (never `RTL`)                     |

## Categories

Seven, and they are the same seven a README's `category` may hold. The two must agree:
`pnpm check:readme` compares them and reports `W_CATEGORY_STORY` when they do not.

- `Interactive elements` - Button, IconButton, Link, Tag, etc.
- `Form controls` - FieldContainer, TextInput, Textarea, ComboBox, Checkbox, Slider, etc.
- `Overlays` - ModalDialog, Aside, DropDown, ContextMenu, Tooltip, etc.
- `Data display` - Badge, Avatar, Text, Card, Table, Tiles, etc.
- `Layout` - Section, Article, Portal, Scrollbar, etc.
- `Navigation` - Navigation, Paging, Tabs, Filter, etc.
- `Feedback` - Toast, Snackbar, Loader, ProgressBar, skeletons, etc.

A story title may also use one of these grouping sections, which keep a family together in
the sidebar and count as their category above: `Table` and `Tiles` and `Rows` (Data
display), `Layout components` (Layout), `Status components` and `Skeletons` (Feedback).

## How to Use This With Claude Code

To update stories in batches, ask Claude:

```
Update the stories for [checkbox, radio-button, toggle-button] components
following the pattern in STORY_TEMPLATE.md and button.stories.tsx
```

Or for a single component:

```
Rewrite the story for the badge component following the Button story pattern
```

Claude will:

1. Read the component's source to understand its props
2. Read the existing story
3. Rewrite the story following this template, putting any description into the README
