import type { ComponentProps, CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import PortalLogo from "./PortalLogo";

const meta = {
  title: "UI/Data display/PortalLogo",
  component: PortalLogo,
  parameters: {
    docs: {
      description: {
        component: `Renders the portal logo with responsive behavior based on screen width and theme.

### Features

- **Theme Aware**: Automatically selects light or dark logo variant
- **Responsive**: Switches to a compact logo on mobile when resizable
- **Error Handling**: Falls back to a default SVG logo if the image fails to load

### Usage

\`\`\`tsx
import PortalLogo from "@docspace/ui-kit/components/portal-logo";

// Basic portal logo
<PortalLogo />

// Resizable logo (adapts to mobile)
<PortalLogo isResizable />

// With custom class
<PortalLogo className="custom-logo" isResizable />
\`\`\``,
      },
    },
  },
  argTypes: {
    className: {
      control: "text",
      description: "Optional CSS class name applied to the logo",
    },
    isResizable: {
      control: "boolean",
      description:
        "Whether the logo resizes based on screen width (compact on mobile)",
      table: {
        defaultValue: { summary: "false" },
      },
    },
  },
} satisfies Meta<typeof PortalLogo>;

type Story = StoryObj<ComponentProps<typeof PortalLogo>>;

export default meta;

export const CssCustomization: Story = {
  render: () => (
    // Group 1 — mobile header bar (visible when viewport <= 600 px)
    //   --portal-logo-mobile-bg      header bar background
    //   --portal-logo-mobile-height  bar height
    //   --portal-logo-mobile-img-height  logo image height inside the bar
    //
    // Group 2 — desktop logo image (visible when viewport > 600 px)
    //   --portal-logo-desktop-img-height  image height
    //   --portal-logo-desktop-img-width   image width
    <div
      style={
        {
          "--portal-logo-mobile-bg": "#e6f3fb",
          "--portal-logo-mobile-height": "56px",
          "--portal-logo-mobile-img-height": "28px",
          "--portal-logo-desktop-img-height": "44px",
          "--portal-logo-desktop-img-width": "320px",
        } as CSSProperties
      }
    >
      <PortalLogo isResizable />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `CSS Custom Properties for external customization:

**Mobile header bar** (shown when viewport <= 600 px)

| Variable | Description | Default |
|----------|-------------|---------|
| \`--portal-logo-mobile-bg\` | Header bar background | theme-based |
| \`--portal-logo-mobile-height\` | Bar height | \`48px\` |
| \`--portal-logo-mobile-img-height\` | Logo image height | \`24px\` |

**Desktop logo image** (shown when viewport > 600 px)

| Variable | Description | Default |
|----------|-------------|---------|
| \`--portal-logo-desktop-img-height\` | Logo height | \`44px\` |
| \`--portal-logo-desktop-img-width\` | Logo width | \`386px\` |`,
      },
    },
  },
};

export const Default: Story = {
  render: (args) => <PortalLogo {...args} />,
  args: {
    isResizable: false,
  },
};

export const Resizable: Story = {
  render: (args) => <PortalLogo {...args} />,
  args: {
    isResizable: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Resizable logo that adapts to screen width. On mobile viewports, it switches to a compact logo displayed in a fixed header bar.",
      },
      source: {
        code: `<PortalLogo isResizable />`,
      },
    },
  },
};

export const WithClassName: Story = {
  render: (args) => <PortalLogo {...args} />,
  args: {
    className: "custom-logo-class",
    isResizable: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Portal logo with a custom CSS class applied for additional styling.",
      },
      source: {
        code: `<PortalLogo className="custom-logo-class" />`,
      },
    },
  },
};

