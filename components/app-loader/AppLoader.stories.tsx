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
- **Dark Mode Support**: Turns the sheet dark grey when the theme provider puts the \`dark\` class on \`<body>\`
- **Zero Configuration**: No props required - renders a consistent loading state
- **Opaque Sheet**: Hides the page behind it completely instead of dimming it
- **Adjustable Stacking**: Sits above page content by default, with its stack order and background colour open to CSS custom properties

### Accessibility

The loader inside the sheet marks itself busy for assistive technology:

- **Busy state**: The inner loader carries \`aria-busy="true"\`, so screen readers treat it as content that is still loading
- **Focus**: The sheet takes no focus and does not trap it, so controls under it stay reachable with Tab

### Usage

\`\`\`tsx
import AppLoader from "@onlyoffice/apps-ui-kit/components/app-loader";

<AppLoader />
\`\`\`

\`\`\`tsx
if (!ready) return <AppLoader />;

return <App />;
\`\`\``,
      },
    },
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
        story: `CSS Custom Properties for external customization:

| Variable | Description | Default |
|----------|-------------|---------|
| \`--app-loader-bg\` | Background color of the overlay | \`#ffffff\`, \`#333333\` in the dark theme |
| \`--app-loader-z-index\` | Stack order of the overlay | \`5000\` |`,
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
