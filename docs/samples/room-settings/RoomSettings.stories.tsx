import type { Meta, StoryObj } from "@storybook/react-vite";

import { RoomSettings } from "./RoomSettings";

const meta = {
  title: "Samples/03. Room settings",
  component: RoomSettings,
  tags: ["!autodocs"],
  parameters: {
    controls: { disable: true },
    actions: { disable: true },
  },
} satisfies Meta<typeof RoomSettings>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
