import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

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

export const Default: Story = {
  play: async ({ canvas }) => {
    // Nothing to create on without a portal.
    await expect(
      canvas.getByText(/^No portal is configured, so there is nowhere/),
    ).toBeVisible();
    await expect(
      canvas.getByRole("button", { name: "Create the demo matters" }),
    ).toBeDisabled();
    await expect(canvas.getByText("Sokolova residence permit")).toBeVisible();
  },
};
