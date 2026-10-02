import type { CSSProperties } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import AppLoader from "./index";

const meta = {
  title: "UI/Status components/AppLoader",
  component: AppLoader,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
    layout: "fullscreen",
  },
} satisfies Meta<typeof AppLoader>;

type Story = StoryObj<typeof AppLoader>;

export default meta;

export const Default: Story = {
  render: () => <AppLoader />,
  parameters: {
    docs: {
      description: {
        story:
          "The boot screen as an application shows it before its first layout exists. The sheet is fixed to the viewport, so it covers the whole window wherever it is rendered.",
      },
      source: {
        code: `<AppLoader />`,
      },
    },
  },
};

export const CssCustomization: Story = {
  render: () => (
    <div
      style={
        {
          "--app-loader-bg": "#e6f3fb",
          "--app-loader-z-index": "100",
        } as CSSProperties
      }
    >
      <AppLoader />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `Both variables set on one wrapper -- the variables are listed under CSS variables on this page. The sheet takes a light blue background and drops its stacking order to 100.`,
      },
      source: {
        code: `<div
  style={{
    "--app-loader-bg": "#e6f3fb",
    "--app-loader-z-index": "100",
  }}
>
  <AppLoader />
</div>`,
      },
    },
  },
};
