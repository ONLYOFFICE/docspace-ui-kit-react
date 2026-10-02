import { type ComponentProps, useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { CollapsibleCard } from "./CollapsibleCard";

const meta = {
  title: "UI/Data display/CollapsibleCard",
  component: CollapsibleCard,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
  },
  argTypes: {
    title: {
      control: "text",
      description:
        "First line of the header, in bold, beside the chevron. It is part of the header button's accessible name",
      table: { type: { summary: "React.ReactNode" } },
    },
    description: {
      control: "text",
      description:
        "Second line of the header, in lighter text under the title. Left out when empty; also part of the button's accessible name",
      table: { type: { summary: "React.ReactNode" } },
    },
    children: {
      control: false,
      description:
        "Body shown under the header while the card is open and removed from the page while it is closed. Without it the card opens to nothing",
      table: { type: { summary: "React.ReactNode" } },
    },
    isOpen: {
      control: "boolean",
      description:
        "Whether the card is open. Once it is passed, even as `false`, the card no longer opens on its own: clicking the header only calls `onToggle`, and the parent must change this value",
    },
    defaultOpen: {
      control: "boolean",
      description:
        "Whether the card starts open. Read on the first render only, and ignored while `isOpen` is passed",
      table: { defaultValue: { summary: "false" } },
    },
    onToggle: {
      action: "toggled",
      description:
        "Called with the state the card is moving to, `true` for open, each time the header is clicked or activated from the keyboard",
    },
    className: {
      control: "text",
      description: "Class added after the component's own on the outer element",
    },
    style: {
      control: "object",
      description: "Inline style of the outer element",
    },
    dataTestId: {
      control: "text",
      description: "Value of `data-testid` on the outer element",
      table: { defaultValue: { summary: '"collapsible-card"' } },
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
    onToggle: fn(),
  },
  parameters: {
    docs: {
      description: {
        story:
          "The card as it first appears: only the title and the description, with the body hidden until the header is clicked. Change any other prop live in the Controls panel below.",
      },
      source: {
        code: `<CollapsibleCard
  title="Lorem ipsum dolor sit amet?"
  description="Lorem ipsum dolor sit amet, consectetur adipiscing elit…"
>
  <div>Ut enim ad minim veniam…</div>
</CollapsibleCard>`,
      },
    },
  },
};

export const Expanded: Story = {
  args: {
    ...Collapsed.args,
    defaultOpen: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Content the reader needs right away can be shown from the start: the card opens with its body visible and the chevron pointing up, and still closes on a click (`defaultOpen`).",
      },
      source: {
        code: `<CollapsibleCard
  title="Lorem ipsum dolor sit amet?"
  description="Lorem ipsum dolor sit amet, consectetur adipiscing elit…"
  defaultOpen
>
  <div>Ut enim ad minim veniam…</div>
</CollapsibleCard>`,
      },
    },
  },
};

export const TitleOnly: Story = {
  args: {
    title: "Lorem ipsum dolor sit amet?",
    children: Collapsed.args?.children,
    onToggle: fn(),
  },
  parameters: {
    docs: {
      description: {
        story:
          "A short header needs no second line: without a description the header shrinks to the title beside the chevron (`description` unset).",
      },
      source: {
        code: `<CollapsibleCard title="Lorem ipsum dolor sit amet?">
  <div>Ut enim ad minim veniam…</div>
</CollapsibleCard>`,
      },
    },
  },
};

const ControlledTemplate = (args: ComponentProps<typeof CollapsibleCard>) => {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <button type="button" onClick={() => setOpen((value) => !value)}>
          {open ? "Close from outside" : "Open from outside"}
        </button>
      </div>
      <CollapsibleCard
        {...args}
        isOpen={open}
        onToggle={(next) => {
          setOpen(next);
          args.onToggle?.(next);
        }}
      />
    </div>
  );
};

export const ControlledState: Story = {
  render: (args) => <ControlledTemplate {...args} />,
  args: {
    ...Collapsed.args,
  },
  parameters: {
    docs: {
      description: {
        story:
          "When something else on the page decides whether the card is open, the parent holds the state: the button above and the card's own header both open and close it, and the header only asks the parent to change it (`isOpen`, `onToggle`).",
      },
      source: {
        code: `const [open, setOpen] = useState(false);

<button type="button" onClick={() => setOpen((value) => !value)}>
  {open ? "Close from outside" : "Open from outside"}
</button>
<CollapsibleCard
  title="Lorem ipsum dolor sit amet?"
  description="Lorem ipsum dolor sit amet, consectetur adipiscing elit…"
  isOpen={open}
  onToggle={setOpen}
>
  <div>Ut enim ad minim veniam…</div>
</CollapsibleCard>`,
      },
    },
  },
};
