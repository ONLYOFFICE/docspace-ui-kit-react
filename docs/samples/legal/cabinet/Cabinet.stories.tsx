import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor } from "storybook/test";

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

export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    // The lawyer's workspace first, with every demo matter.
    await waitFor(() =>
      expect(canvas.getByText("Harper v. Northwind Logistics")).toBeVisible(),
    );
    await expect(canvas.getByText("Delgado v. City Transit")).toBeVisible();

    // The other tab switches to the client's cabinet.
    await userEvent.click(canvas.getByText("As the client"));
    await expect(
      canvas.getByText("The cabinet, under the client's own OAuth token."),
    ).toBeVisible();
  },
};
