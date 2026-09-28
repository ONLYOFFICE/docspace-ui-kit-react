import type { Meta, StoryObj } from "@storybook/react-vite";

import { Cabinet } from "./Cabinet";

const meta = {
  title: "Samples/Legal practice/The cabinet",
  component: Cabinet,
  tags: ["!autodocs"],
  parameters: {
    controls: { disable: true },
    actions: { disable: true },
  },
} satisfies Meta<typeof Cabinet>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
