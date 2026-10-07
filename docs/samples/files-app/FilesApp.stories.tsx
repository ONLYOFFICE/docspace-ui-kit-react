import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor } from "storybook/test";

import { withDemoBanner } from "../../../.storybook/decorators/PortalGate";
import withBundledLogos from "../../../.storybook/decorators/withBundledLogos";

import { FilesApp } from "./FilesApp";

const meta = {
  title: "Samples/A small Files app",
  component: FilesApp,
  tags: ["!autodocs"],
  // The sample's Article header asks for the portal logo; with no portal
  // selected it runs on in-memory data, which the banner says.
  decorators: [withDemoBanner, withBundledLogos],
  parameters: {
    controls: { disable: true },
    actions: { disable: true },
    noPadding: true,
  },
} satisfies Meta<typeof FilesApp>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    // The demo rooms load after mounting.
    const room = await waitFor(() => canvas.getByText("Finance department"));
    await expect(canvas.getByText("Board papers")).toBeVisible();

    // A room opens in place.
    await userEvent.click(room);
    await waitFor(() =>
      expect(canvas.getByText("Q4 budget.xlsx")).toBeVisible(),
    );
    await expect(canvas.queryByText("Board papers")).toBeNull();
  },
};
