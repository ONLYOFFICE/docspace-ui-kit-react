import type { Meta, StoryObj } from "@storybook/react-vite";

import { withDemoBanner } from "../../../../.storybook/decorators/PortalGate";

import { PortalConnection } from "./PortalConnection";

const meta = {
  title: "Samples/Legal practice/Setup/Connect to a portal",
  component: PortalConnection,
  tags: ["!autodocs"],
  // With no portal selected the sample runs on in-memory data; say so.
  decorators: [withDemoBanner],
  parameters: {
    controls: { disable: true },
    actions: { disable: true },
  },
} satisfies Meta<typeof PortalConnection>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
