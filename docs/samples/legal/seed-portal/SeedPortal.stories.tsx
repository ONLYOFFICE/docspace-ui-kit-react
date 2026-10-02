import type { Meta, StoryObj } from "@storybook/react-vite";

import { withDemoBanner } from "../../../../.storybook/decorators/PortalGate";

import { SeedPortal } from "./SeedPortal";

const meta = {
  title: "Samples/Legal practice/Setup/Demo data on your portal",
  component: SeedPortal,
  tags: ["!autodocs"],
  // With no portal selected the sample runs on in-memory data; say so.
  decorators: [withDemoBanner],
  parameters: {
    controls: { disable: true },
    actions: { disable: true },
  },
} satisfies Meta<typeof SeedPortal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
