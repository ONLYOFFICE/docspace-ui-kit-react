import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen, waitFor } from "storybook/test";

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

export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    await waitFor(() =>
      expect(canvas.getByText("Harper v. Northwind Logistics")).toBeVisible(),
    );

    // The form opens in a dialog and closes with nothing opened.
    await userEvent.click(canvas.getByRole("button", { name: "New matter" }));
    // The dialog slides in.
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "Open the matter" }),
      ).toBeVisible(),
    );
    const submit = screen.getByRole("button", { name: "Open the matter" });
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    // Hidden, not unmounted.
    await waitFor(() => expect(submit).not.toBeVisible());
  },
};
