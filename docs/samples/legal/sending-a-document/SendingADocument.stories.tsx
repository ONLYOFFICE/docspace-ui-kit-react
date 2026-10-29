import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor } from "storybook/test";

import { withDemoBanner } from "../../../../.storybook/decorators/PortalGate";

import { SendingADocument } from "./SendingADocument";

const meta = {
  title: "Samples/Legal practice/Screens/03. Sending a document",
  component: SendingADocument,
  tags: ["!autodocs"],
  // With no portal selected the sample runs on in-memory data; say so.
  decorators: [withDemoBanner],
  parameters: {
    controls: { disable: true },
    actions: { disable: true },
  },
} satisfies Meta<typeof SendingADocument>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    // Send it opens a drop zone for that request, and closes it again.
    const send = await waitFor(
      () => canvas.getAllByRole("button", { name: "Send it" })[0],
    );
    await userEvent.click(send);
    await expect(canvas.getByText("Choose a file")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Not now" }));
    await expect(canvas.queryByText("Choose a file")).toBeNull();
  },
};
