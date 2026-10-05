import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";

import { ActionButton } from ".";

const FilterIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="currentColor"
  >
    <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z" />
  </svg>
);

const meta = {
  title: "UI/Interactive elements/ActionButton",
  component: ActionButton,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
  },
  argTypes: {
    label: {
      control: "text",
      description: "Text of the button; anything passed as children is dropped",
    },
    icon: {
      control: false,
      description:
        "Icon node drawn at 12px before the label and filled with the text colour",
    },
    as: {
      control: false,
      description:
        "Element or component to render instead of a button; its props are then accepted",
      table: {
        defaultValue: { summary: "button" },
      },
    },
    className: {
      control: "text",
      description:
        "Class applied to the rendered element after the component's own",
    },
    disabled: {
      control: "boolean",
      description:
        "Native button attribute: fades the button to half opacity and blocks clicks",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    onClick: { action: "onClick" },
  },
  args: {
    label: "Clear filter",
    onClick: fn(),
  },
} satisfies Meta<typeof ActionButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <ActionButton {...args} />,
  play: async ({ args, canvas, userEvent }) => {
    const button = canvas.getByRole("button", { name: "Clear filter" });

    // A native button: Tab reaches it, Enter and Space press it.
    await userEvent.tab();
    await expect(button).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard(" ");
    await expect(args.onClick).toHaveBeenCalledTimes(2);

    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledTimes(3);
  },
  parameters: {
    docs: {
      description: {
        story:
          "The plain text button for a secondary action; click it to see \`onClick\` in the Actions panel, and change any other prop live in the Controls panel below.",
      },
      source: {
        code: `<ActionButton label="Clear filter" onClick={handleClick} />`,
      },
    },
  },
};

export const WithIcon: Story = {
  args: {
    icon: <FilterIcon />,
  },
  play: async ({ canvas }) => {
    // The icon sits before the label; the label alone names the button.
    const button = canvas.getByRole("button", { name: "Clear filter" });
    await expect(button.firstElementChild?.querySelector("svg")).not.toBeNull();
  },
  parameters: {
    docs: {
      description: {
        story:
          "An icon before the label makes the action easier to spot in a busy toolbar; the icon takes the text colour (\`icon\`).",
      },
      source: {
        code: `<ActionButton icon={<FilterIcon />} label="Clear filter" />`,
      },
    },
  },
};

export const AsLink: Story = {
  args: {
    as: "a",
    href: "#",
    label: "Go to page",
  },
  play: async ({ canvas }) => {
    // as="a" renders a real link that takes href.
    await expect(
      canvas.getByRole("link", { name: "Go to page" }),
    ).toHaveAttribute("href", "#");
    await expect(canvas.queryByRole("button")).toBeNull();
  },
  parameters: {
    docs: {
      description: {
        story:
          "The same look for an action that navigates: the button becomes a link and takes \`href\` (\`as\`).",
      },
      source: {
        code: `<ActionButton as="a" href="/about" label="Go to page" />`,
      },
    },
  },
};

export const DisabledState: Story = {
  args: {
    icon: <FilterIcon />,
    disabled: true,
  },
  play: async ({ args, canvas }) => {
    const button = canvas.getByRole("button", { name: "Clear filter" });
    await expect(button).toBeDisabled();
    // A disabled button takes no pointer events, so the click is not tried.
    await expect(args.onClick).not.toHaveBeenCalled();
  },
  parameters: {
    docs: {
      description: {
        story:
          "An action that is not available yet stays in place but fades and ignores clicks (\`disabled\`); it works only on the default \`button\`.",
      },
      source: {
        code: `<ActionButton icon={<FilterIcon />} label="Clear filter" disabled />`,
      },
    },
  },
};
