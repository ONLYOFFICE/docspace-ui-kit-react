import type { Meta, StoryObj } from "@storybook/react-vite";

import { withDemoBanner } from "../../../../.storybook/decorators/PortalGate";

import { Cabinet } from "./Cabinet";

const meta = {
  title: "Samples/Legal practice/The cabinet",
  component: Cabinet,
  tags: ["!autodocs"],
  // With no portal selected the sample runs on in-memory data; say so.
  decorators: [withDemoBanner],
  parameters: {
    controls: { disable: true },
    actions: { disable: true },
  },
} satisfies Meta<typeof Cabinet>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
