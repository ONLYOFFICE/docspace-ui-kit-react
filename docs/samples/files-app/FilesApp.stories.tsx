import type { Meta, StoryObj } from "@storybook/react-vite";

import withBundledLogos from "../../../.storybook/decorators/withBundledLogos";

import { FilesApp } from "./FilesApp";

const meta = {
  title: "Samples/A small Files app",
  component: FilesApp,
  tags: ["!autodocs"],
  // The sample's Article header asks for the portal logo.
  decorators: [withBundledLogos],
  parameters: {
    controls: { disable: true },
    actions: { disable: true },
    noPadding: true,
  },
} satisfies Meta<typeof FilesApp>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
