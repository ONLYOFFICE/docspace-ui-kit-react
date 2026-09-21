import type { Meta, StoryObj } from "@storybook/react-vite";

import { FileList } from "./FileList";

const meta = {
  title: "Samples/05. Selectable file list",
  component: FileList,
  tags: ["!autodocs"],
  parameters: {
    controls: { disable: true },
    actions: { disable: true },
  },
} satisfies Meta<typeof FileList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
