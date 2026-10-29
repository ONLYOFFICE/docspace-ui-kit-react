import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import { withDemoBanner } from "../../../../.storybook/decorators/PortalGate";

import { SignInRoutes } from "./SignInRoutes";

const meta = {
  title: "Samples/Legal practice/Setup/Who is signed in",
  component: SignInRoutes,
  tags: ["!autodocs"],
  // With no portal selected the sample runs on in-memory data; say so.
  decorators: [withDemoBanner],
  parameters: {
    controls: { disable: true },
    actions: { disable: true },
  },
} satisfies Meta<typeof SignInRoutes>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    const card = (title: string) =>
      canvas.getByText(title).parentElement as HTMLElement;
    // With nobody signed in the demo persona picks the highlighted workspace.
    await expect(card("Lawyer's workspace")).toHaveStyle({ opacity: "1" });
    await expect(card("Client cabinet")).toHaveStyle({ opacity: "0.45" });

    await userEvent.click(canvas.getByLabelText("Show as a client"));
    await expect(card("Client cabinet")).toHaveStyle({ opacity: "1" });
    await expect(card("Lawyer's workspace")).toHaveStyle({ opacity: "0.45" });
  },
};
