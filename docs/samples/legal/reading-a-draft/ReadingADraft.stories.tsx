import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor } from "storybook/test";

import { withDemoBanner } from "../../../../.storybook/decorators/PortalGate";

import { ReadingADraft } from "./ReadingADraft";

const meta = {
  title: "Samples/Legal practice/Screens/04. Reading the firm's draft",
  component: ReadingADraft,
  tags: ["!autodocs"],
  // With no portal selected the sample runs on in-memory data; say so.
  decorators: [withDemoBanner],
  parameters: {
    controls: { disable: true },
    actions: { disable: true },
  },
} satisfies Meta<typeof ReadingADraft>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    // The client reads a draft; with no portal a page stands in for the editor.
    const read = await waitFor(
      () => canvas.getAllByRole("button", { name: "Read" })[0],
    );
    await userEvent.click(read);
    await waitFor(() =>
      expect(
        canvas.getByText(
          "Read only. Comments are yours to add; the text is not.",
        ),
      ).toBeVisible(),
    );
    await expect(canvas.getByText(/this page stands in for it/)).toBeVisible();

    await userEvent.click(canvas.getByRole("button", { name: "Close" }));
    await waitFor(() =>
      expect(canvas.queryByText(/this page stands in for it/)).toBeNull(),
    );
  },
};
