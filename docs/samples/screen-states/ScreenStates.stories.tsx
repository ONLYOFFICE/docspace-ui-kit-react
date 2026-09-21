import type { Meta, StoryObj } from "@storybook/react-vite";

import { ScreenStates } from "./ScreenStates";

const meta = {
  title: "Samples/08. Loading, empty, broken",
  component: ScreenStates,
  tags: ["!autodocs"],
  parameters: {
    controls: { disable: true },
    actions: { disable: true },
  },
} satisfies Meta<typeof ScreenStates>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
