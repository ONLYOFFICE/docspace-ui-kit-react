import type { Meta, StoryObj } from "@storybook/react-vite";

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

export const Default: Story = {};
