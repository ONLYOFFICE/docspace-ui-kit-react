import type { Meta, StoryObj } from "@storybook/react-vite";

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

export const Default: Story = {};
