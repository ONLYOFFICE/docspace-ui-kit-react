import type { Meta, StoryObj } from "@storybook/react-vite";

import { FileTable } from "./FileTable";

const meta = {
  title: "Samples/06. Sortable table",
  component: FileTable,
  tags: ["!autodocs"],
  parameters: {
    controls: { disable: true },
    actions: { disable: true },
  },
} satisfies Meta<typeof FileTable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
