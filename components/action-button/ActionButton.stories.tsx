import type { Meta, StoryObj } from "@storybook/react-vite";

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
    docs: {
      description: {
        component: `A lightweight polymorphic action button.

### Features

- **Polymorphic**: render as \`button\`, \`a\`, or any React component via \`as\`
- **Icon support**: optional leading icon via \`icon\` prop
- **React 19**: accepts \`ref\` as a regular prop

### Usage

\`\`\`tsx
import { ActionButton } from "@onlyoffice/apps-ui-kit/components/action-button";

<ActionButton onClick={handleClick}>Clear filter</ActionButton>

<ActionButton icon={<FilterIcon />} onClick={handleClick}>Clear filter</ActionButton>

<ActionButton as="a" href="/about">Go to page</ActionButton>
\`\`\``,
      },
    },
  },
  argTypes: {
    icon: { control: false },
    as: { control: false },
  },
} satisfies Meta<typeof ActionButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Clear filter",
  },
};

export const WithIcon: Story = {
  args: {
    children: "Clear filter",
    icon: <FilterIcon />,
  },
};

export const TextOnly: Story = {
  args: {
    children: "Text",
  },
};

export const AsLink: Story = {
  args: {
    as: "a",
    href: "#",
    children: "Go to page",
  },
};
