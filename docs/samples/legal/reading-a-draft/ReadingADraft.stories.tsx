import type { Meta, StoryObj } from "@storybook/react-vite";

import { ReadingADraft } from "./ReadingADraft";

const meta = {
  title: "Samples/Legal practice/Screens/04. Reading the firm's draft",
  component: ReadingADraft,
  tags: ["!autodocs"],
  parameters: {
    controls: { disable: true },
    actions: { disable: true },
  },
} satisfies Meta<typeof ReadingADraft>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
