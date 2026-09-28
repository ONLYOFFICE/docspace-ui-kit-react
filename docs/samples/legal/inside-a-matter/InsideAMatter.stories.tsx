import type { Meta, StoryObj } from "@storybook/react-vite";

import { InsideAMatter } from "./InsideAMatter";

const meta = {
  title: "Samples/Legal practice/02. Inside a matter",
  component: InsideAMatter,
  tags: ["!autodocs"],
  parameters: {
    controls: { disable: true },
    actions: { disable: true },
  },
} satisfies Meta<typeof InsideAMatter>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
