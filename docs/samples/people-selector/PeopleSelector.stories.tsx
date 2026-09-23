import type { Meta, StoryObj } from "@storybook/react-vite";

import { PeopleSelector } from "./PeopleSelector";

const meta = {
  title: "Samples/09. People picker",
  component: PeopleSelector,
  tags: ["!autodocs"],
  parameters: {
    controls: { disable: true },
    actions: { disable: true },
  },
} satisfies Meta<typeof PeopleSelector>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
