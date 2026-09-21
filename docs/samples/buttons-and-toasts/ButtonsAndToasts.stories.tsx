import type { Meta, StoryObj } from "@storybook/react-vite";

import { ButtonsAndToasts } from "./ButtonsAndToasts";

const meta = {
  title: "Samples/01. Buttons and toasts",
  component: ButtonsAndToasts,
  tags: ["!autodocs"],
  parameters: {
    controls: { disable: true },
    actions: { disable: true },
  },
} satisfies Meta<typeof ButtonsAndToasts>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
