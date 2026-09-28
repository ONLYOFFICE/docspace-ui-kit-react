import type { Meta, StoryObj } from "@storybook/react-vite";

import { OpeningAMatter } from "./OpeningAMatter";

const meta = {
  title: "Samples/Legal practice/05. Opening a matter",
  component: OpeningAMatter,
  tags: ["!autodocs"],
  parameters: {
    controls: { disable: true },
    actions: { disable: true },
  },
} satisfies Meta<typeof OpeningAMatter>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
