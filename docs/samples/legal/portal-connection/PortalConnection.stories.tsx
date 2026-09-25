import type { Meta, StoryObj } from "@storybook/react-vite";

import { PortalConnection } from "./PortalConnection";

const meta = {
  title: "Samples/Legal practice/01. Connect to a portal",
  component: PortalConnection,
  tags: ["!autodocs"],
  parameters: {
    controls: { disable: true },
    actions: { disable: true },
  },
} satisfies Meta<typeof PortalConnection>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
