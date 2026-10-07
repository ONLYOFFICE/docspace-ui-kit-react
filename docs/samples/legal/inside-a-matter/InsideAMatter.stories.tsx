import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor } from "storybook/test";

import { withDemoBanner } from "../../../../.storybook/decorators/PortalGate";

import { InsideAMatter } from "./InsideAMatter";

const meta = {
  title: "Samples/Legal practice/Screens/02. Inside a matter",
  component: InsideAMatter,
  tags: ["!autodocs"],
  // With no portal selected the sample runs on in-memory data; say so.
  decorators: [withDemoBanner],
  parameters: {
    controls: { disable: true },
    actions: { disable: true },
  },
} satisfies Meta<typeof InsideAMatter>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    // Both views read the same checklist.
    await waitFor(() =>
      expect(canvas.getAllByText("3 of 5 received")).toHaveLength(2),
    );
    await expect(
      canvas.getAllByText("Payslips, last 3 months")[0],
    ).toBeVisible();
    await expect(
      canvas.getByRole("button", { name: "Ask for it" }),
    ).toBeVisible();
    await expect(canvas.getAllByText("Draft claim.docx")[0]).toBeVisible();
  },
};
