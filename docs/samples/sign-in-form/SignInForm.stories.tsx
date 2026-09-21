import type { Meta, StoryObj } from "@storybook/react-vite";

import { SignInForm } from "./SignInForm";

const meta = {
  title: "Samples/02. Sign-in form",
  component: SignInForm,
  tags: ["!autodocs"],
  parameters: {
    controls: { disable: true },
    actions: { disable: true },
  },
} satisfies Meta<typeof SignInForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
