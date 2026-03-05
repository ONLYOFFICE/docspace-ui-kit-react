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
  //    Categories: Interactive elements, Data display, Layout, Navigation, Feedback, etc.
  title: "UI/<category>/<ComponentName>",
  component: ComponentName,
  parameters: {
    docs: {
      description: {
        // 2. Component description with Features, Accessibility (if applicable), and Usage sections
        component: `Short description of what the component does.

### Features

- **Feature 1**: Description
- **Feature 2**: Description
- **Feature 3**: Description

### Accessibility

(Only if the component has ARIA attributes or accessibility features)

- \`aria-label\`: Description
- \`aria-disabled\`: Description

### Usage

\`\`\`tsx
import { ComponentName } from "@docspace/ui-kit/components/component-name";

// Example usage
<ComponentName prop1="value" prop2={true} />
\`\`\``,
      },
    },
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
3. [ ] **Component description** - Include Features, optional Accessibility, and Usage sections
4. [ ] **argTypes** - Document every significant prop with control type, description, and default
5. [ ] **Default story** - Interactive story with `render: (args) => ...` and sensible `args`
6. [ ] **Variant stories** - One per major prop/state (disabled, loading, sizes, types, etc.)
7. [ ] **Story descriptions** - Each story has `parameters.docs.description.story`
8. [ ] **Source code** - Each story has `parameters.docs.source.code` with clean examples
9. [ ] **Template functions** - Extract complex renders into named `*Template` components
10. [ ] **Wrapper** - Use a layout wrapper for stories with multiple items

## Story Naming Conventions

| Pattern | Example |
|---------|---------|
| Default interactive | `Default` |
| Size variants | `Sizes` or `SmallSize`, `LargeSize` |
| State variants | `DisabledState`, `LoadingState`, `HoveredState` |
| Type/style variants | `PrimaryButtons`, `SecondaryButtons` |
| Feature demos | `WithIcon`, `WithTooltip`, `WithCallback` |

## Categories

- `Interactive elements` - Button, Checkbox, RadioButton, Toggle, TextInput, etc.
- `Data display` - Badge, Tag, Avatar, Table, Tabs, etc.
- `Layout` - Section, Article, Portal, etc.
- `Navigation` - Paging, Navigation, Link, etc.
- `Feedback` - Toast, Snackbar, Loader, ProgressBar, etc.
- `Overlays` - ModalDialog, DropDown, ContextMenu, Tooltip, Aside, etc.
- `Form` - FieldContainer, PasswordInput, EmailInput, SearchInput, etc.

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
3. Rewrite the story following this template
