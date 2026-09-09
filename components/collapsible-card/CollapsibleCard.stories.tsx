import type { ComponentProps } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { CollapsibleCard } from "./CollapsibleCard";

const meta = {
  title: "UI/Data display/CollapsibleCard",
  component: CollapsibleCard,
  parameters: {
    docs: {
      description: {
        component: `Card with a clickable header that expands/collapses the body.

### Features

- **title** / **description**: header content (rendered inline with the chevron)
- **children**: body content shown when expanded
- Controlled via \`isOpen\` + \`onToggle\`, or uncontrolled via \`defaultOpen\`
- Chevron rotates 180° on open (no body animation by default)

### Usage

\`\`\`tsx
import { CollapsibleCard } from "@onlyoffice/apps-ui-kit/components/collapsible-card";

<CollapsibleCard
  title="Already using another platform?"
  description="Plug ONLYOFFICE into any ecosystem — no custom code, no migration."
  defaultOpen
>
  {/* any content */}
</CollapsibleCard>
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof CollapsibleCard>;

type Story = StoryObj<ComponentProps<typeof CollapsibleCard>>;

export default meta;

export const Collapsed: Story = {
  args: {
    title: "Lorem ipsum dolor sit amet?",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    children: (
      <div style={{ padding: 16 }}>
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
        ut aliquip ex ea commodo consequat. Duis aute irure dolor in
        reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
        pariatur.
      </div>
    ),
  },
};

export const Expanded: Story = {
  args: {
    ...Collapsed.args,
    defaultOpen: true,
  },
};
