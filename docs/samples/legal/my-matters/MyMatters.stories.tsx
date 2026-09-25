import type { Meta, StoryObj } from "@storybook/react-vite";

import { MyMatters } from "./MyMatters";

const meta = {
  title: "Samples/Legal practice/03. My matters",
  component: MyMatters,
  tags: ["!autodocs"],
  parameters: {
    controls: { disable: true },
    actions: { disable: true },
  },
} satisfies Meta<typeof MyMatters>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
