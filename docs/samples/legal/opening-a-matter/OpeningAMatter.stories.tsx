import type { Meta, StoryObj } from "@storybook/react-vite";

import { withDemoBanner } from "../../../../.storybook/decorators/PortalGate";

import { OpeningAMatter } from "./OpeningAMatter";

const meta = {
  title: "Samples/Legal practice/Screens/05. Opening a matter",
  component: OpeningAMatter,
  tags: ["!autodocs"],
  // With no portal selected the sample runs on in-memory data; say so.
  decorators: [withDemoBanner],
  parameters: {
    controls: { disable: true },
    actions: { disable: true },
  },
} satisfies Meta<typeof OpeningAMatter>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
