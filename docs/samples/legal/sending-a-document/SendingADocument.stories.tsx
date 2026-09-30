import type { Meta, StoryObj } from "@storybook/react-vite";

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

export const Default: Story = {};
