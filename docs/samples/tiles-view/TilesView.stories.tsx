import type { Meta, StoryObj } from "@storybook/react-vite";

import { TilesView } from "./TilesView";

const meta = {
  title: "Samples/07. Tiles and the view switch",
  component: TilesView,
  tags: ["!autodocs"],
  parameters: {
    controls: { disable: true },
    actions: { disable: true },
  },
} satisfies Meta<typeof TilesView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
