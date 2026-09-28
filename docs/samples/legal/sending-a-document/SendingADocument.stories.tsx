import type { Meta, StoryObj } from "@storybook/react-vite";

import { SendingADocument } from "./SendingADocument";

const meta = {
  title: "Samples/Legal practice/Screens/03. Sending a document",
  component: SendingADocument,
  tags: ["!autodocs"],
  parameters: {
    controls: { disable: true },
    actions: { disable: true },
  },
} satisfies Meta<typeof SendingADocument>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
