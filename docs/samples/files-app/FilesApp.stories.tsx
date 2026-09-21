import type { Meta, StoryObj } from "@storybook/react-vite";

import { FilesApp } from "./FilesApp";

const meta = {
  title: "Samples/10. A small Files app",
  component: FilesApp,
  tags: ["!autodocs"],
  parameters: {
    controls: { disable: true },
    actions: { disable: true },
    noPadding: true,
  },
} satisfies Meta<typeof FilesApp>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
