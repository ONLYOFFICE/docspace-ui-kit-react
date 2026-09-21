import type { Meta, StoryObj } from "@storybook/react-vite";

import { Dialogs } from "./Dialogs";

const meta = {
  title: "Samples/04. Dialogs",
  component: Dialogs,
  tags: ["!autodocs"],
  parameters: {
    controls: { disable: true },
    actions: { disable: true },
  },
} satisfies Meta<typeof Dialogs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
