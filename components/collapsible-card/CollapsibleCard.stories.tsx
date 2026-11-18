import { type ComponentProps, useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";

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
        "First line of the header, next to the chevron. The whole header is the button, so this is part of its accessible name.",
      table: { type: { summary: "React.ReactNode" } },
    },
    description: {
      control: "text",
      description:
        "Second line of the header, under the title. Also inside the button, and so also part of its accessible name.",
      table: { type: { summary: "React.ReactNode" } },
    },
    children: {
      control: false,
      description:
        "Body, rendered only while the card is open. Without it the card opens to nothing.",
      table: { type: { summary: "React.ReactNode" } },
    },
    isOpen: {
      control: "boolean",
      description:
        "Whether the card is open. Passing it, even as `false`, makes the card controlled: it opens and closes only when you change this value.",
    },
    defaultOpen: {
      control: "boolean",
      description:
        "Whether the card starts open. Read once, on the first render, and only while `isOpen` is unset.",
      table: { defaultValue: { summary: "false" } },
    },
    onToggle: {
      action: "toggled",
      description:
        "Called with the state the card is moving to whenever the header is activated, in both the controlled and the uncontrolled case.",
    },
    className: {
      control: "text",
      description:
        "Added after the component's own class, on the outer element.",
    },
    style: {
      control: "object",
      description: "Inline style of the outer element.",
    },
    dataTestId: {
      control: "text",
      description: "Value of `data-testid` on the outer element.",
      table: { defaultValue: { summary: '"collapsible-card"' } },
    },
  },
} satisfies Meta<typeof CollapsibleCard>;

type Story = StoryObj<ComponentProps<typeof CollapsibleCard>>;

export default meta;

type Canvas = {
  getByRole: (role: string, options: { name: RegExp }) => HTMLElement;
};

// The header is the card's button, named by its title and description.
const header = (canvas: Canvas) =>
  canvas.getByRole("button", { name: /^Lorem ipsum dolor sit amet\?/ });

const BODY = /Ut enim ad minim veniam/;

export const Collapsed: Story = {
  name: "Closed",
  play: async ({ args, canvas, userEvent }) => {
    await expect(header(canvas)).toHaveAttribute("aria-expanded", "false");
    await expect(canvas.queryByText(BODY)).toBeNull();

    await userEvent.click(header(canvas));
    await expect(header(canvas)).toHaveAttribute("aria-expanded", "true");
    await expect(args.onToggle).toHaveBeenLastCalledWith(true);
    // aria-controls names the body only once the body is in the DOM.
    const bodyId = header(canvas).getAttribute("aria-controls");
    await expect(canvas.getByText(BODY).closest("[id]")).toHaveAttribute(
      "id",
      bodyId,
    );

    // A real button: Enter closes it again.
    await userEvent.keyboard("{Enter}");
    await expect(header(canvas)).toHaveAttribute("aria-expanded", "false");
    await expect(args.onToggle).toHaveBeenLastCalledWith(false);
  },
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
          "The card as it first appears: the title and the description, with the body hidden until the header is clicked.",
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
  name: "Starts open",
  args: {
    ...Collapsed.args,
    defaultOpen: true,
  },
  play: async ({ canvas, userEvent }) => {
    await expect(header(canvas)).toHaveAttribute("aria-expanded", "true");
    await expect(canvas.getByText(BODY)).toBeVisible();
    await userEvent.click(header(canvas));
    await expect(canvas.queryByText(BODY)).toBeNull();
  },
  parameters: {
    docs: {
      description: {
        story:
          "A card that starts open, with its body visible and the chevron pointing up (`defaultOpen`). It still closes on a click.",
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
  name: "Title only",
  args: {
    title: "Lorem ipsum dolor sit amet?",
    children: Collapsed.args?.children,
    onToggle: fn(),
  },
  play: async ({ args, canvas, userEvent }) => {
    // With no description the button is named by the title alone.
    const button = canvas.getByRole("button", {
      name: "Lorem ipsum dolor sit amet?",
    });
    await userEvent.click(button);
    await expect(args.onToggle).toHaveBeenCalledWith(true);
    await expect(canvas.getByText(BODY)).toBeVisible();
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
  name: "Controlled",
  render: (args) => <ControlledTemplate {...args} />,
  args: {
    ...Collapsed.args,
  },
  play: async ({ args, canvas, userEvent }) => {
    // The parent opens it...
    await userEvent.click(
      canvas.getByRole("button", { name: "Open from outside" }),
    );
    await expect(header(canvas)).toHaveAttribute("aria-expanded", "true");
    await expect(args.onToggle).not.toHaveBeenCalled();

    // ...and the header only asks the parent to close it.
    await userEvent.click(header(canvas));
    await expect(args.onToggle).toHaveBeenCalledWith(false);
    await expect(header(canvas)).toHaveAttribute("aria-expanded", "false");
  },
  parameters: {
    docs: {
      description: {
        story:
          "A card whose parent holds the open state (`isOpen`, `onToggle`). The button above and the card's header both toggle it; the header only asks the parent to.",
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
