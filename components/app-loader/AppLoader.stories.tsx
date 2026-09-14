import type { CSSProperties } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import AppLoader from "./index";

const meta = {
  title: "UI/Status components/AppLoader",
  component: AppLoader,
  parameters: {
    docs: {
      description: {
        component: `A full-screen loading indicator displayed while the application is initializing. Uses the Rombs animation loader.

### Features

- **Full-Screen Overlay**: Centers the loader in the viewport with fixed positioning
- **Rombs Animation**: Uses the animated rombs (diamond) loader style
- **Dark Mode Support**: Automatically adjusts background via CSS variables
- **Zero Configuration**: No props required - renders a consistent loading state

### Usage

\`\`\`tsx
import AppLoader from "@onlyoffice/apps-ui-kit/components/app-loader";

<AppLoader />
\`\`\``,
      },
    },
    layout: "fullscreen",
  },
} satisfies Meta<typeof AppLoader>;

type Story = StoryObj<typeof AppLoader>;

export default meta;

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
        story: `CSS Custom Properties for external customization:

| Variable | Description | Default |
|----------|-------------|---------|
| \`--app-loader-bg\` | Background color of the overlay | white / black |
| \`--app-loader-z-index\` | Stack order of the overlay | \`5000\` |`,
      },
    },
  },
};

export const Default: Story = {
  render: () => <AppLoader />,
  parameters: {
    docs: {
      description: {
        story:
          "Full-screen application loader with rombs animation. The component uses fixed positioning and always covers the full viewport, regardless of its container.",
      },
      source: {
        code: `<AppLoader />`,
      },
    },
  },
};
