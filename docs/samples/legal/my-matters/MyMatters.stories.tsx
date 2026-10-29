import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor } from "storybook/test";

import { withDemoBanner } from "../../../../.storybook/decorators/PortalGate";

import { MyMatters } from "./MyMatters";

const meta = {
  title: "Samples/Legal practice/Screens/01. My matters",
  component: MyMatters,
  tags: ["!autodocs"],
  // With no portal selected the sample runs on in-memory data; say so.
  decorators: [withDemoBanner],
  parameters: {
    controls: { disable: true },
    actions: { disable: true },
  },
} satisfies Meta<typeof MyMatters>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    // The lawyer sees every matter they were added to.
    await waitFor(() =>
      expect(canvas.getByText("Delgado v. City Transit")).toBeVisible(),
    );
    await expect(canvas.getByText("Brightwater acquisition")).toBeVisible();
    // The client sees only their own.
    await expect(
      canvas.getAllByText("Harper v. Northwind Logistics").length,
    ).toBeGreaterThan(1);
  },
};
