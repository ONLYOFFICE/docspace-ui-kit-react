import type { Meta, StoryObj } from "@storybook/react-vite";

import { withDemoBanner } from "../../../../.storybook/decorators/PortalGate";

import { InsideAMatter } from "./InsideAMatter";

const meta = {
  title: "Samples/Legal practice/Screens/02. Inside a matter",
  component: InsideAMatter,
  tags: ["!autodocs"],
  // With no portal selected the sample runs on in-memory data; say so.
  decorators: [withDemoBanner],
  parameters: {
    controls: { disable: true },
    actions: { disable: true },
  },
} satisfies Meta<typeof InsideAMatter>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
