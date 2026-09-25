import type { Meta, StoryObj } from "@storybook/react-vite";

import { SignInRoutes } from "./SignInRoutes";

const meta = {
  title: "Samples/Legal practice/02. Who is signed in",
  component: SignInRoutes,
  tags: ["!autodocs"],
  parameters: {
    controls: { disable: true },
    actions: { disable: true },
  },
} satisfies Meta<typeof SignInRoutes>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
