import type { ComponentProps, CSSProperties } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import PlanetIcon from "../../assets/icons/12/planet.react.svg?url";

import PublicRoomBar from "./index";

const meta = {
  title: "UI/Feedback/PublicRoomBar",
  component: PublicRoomBar,
  parameters: {
    docs: {
      description: {
        component: `PublicRoomBar displays a notification bar for public room status with header, body text, and optional close action.

### Features

- **Header & Body Text**: Supports both strings and React nodes for flexible content
- **Custom Icon**: Optional icon display alongside the header
- **Close Button**: Optional dismiss action with callback
- **Visibility Control**: Toggle bar visibility programmatically

### Usage

\`\`\`tsx
import PublicRoomBar from "@onlyoffice/apps-ui-kit/components/public-room-bar";

<PublicRoomBar
  headerText="Public Room"
  bodyText="This room is accessible to anyone with the link"
  onClose={handleClose}
/>

// With custom icon
<PublicRoomBar
  headerText="Public Room"
  bodyText="Accessible via link"
  iconName={PlanetIcon}
/>
\`\`\``,
      },
    },
  },
  argTypes: {
    headerText: {
      control: "text",
      description: "Header text or React node",
    },
    bodyText: {
      control: "text",
      description: "Body text or React node",
    },
    iconName: {
      control: "text",
      description: "Custom icon path or React element",
    },
    barIsVisible: {
      control: "boolean",
      description: "Controls the visibility of the bar",
      table: {
        defaultValue: { summary: "false" },
      },
    },
  },
} satisfies Meta<typeof PublicRoomBar>;

type Story = StoryObj<ComponentProps<typeof PublicRoomBar>>;

export default meta;

export const CssCustomization: Story = {
  render: () => (
    <div
      style={
        {
          "--public-room-bar-bg": "#e6f3fb",
          "--public-room-bar-header-color": "#0082c9",
          "--public-room-bar-header-icon": "#0082c9",
          "--public-room-bar-radius": "12px",
          "--public-room-bar-padding": "16px 20px",
          "--public-room-bar-text-size": "13px",
        } as CSSProperties
      }
    >
      <PublicRoomBar
        headerText="Public Room"
        bodyText="This room is accessible to anyone with the link"
        barIsVisible={false}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `CSS Custom Properties for external customization:

| Variable | Description | Default |
|----------|-------------|---------|
| \`--public-room-bar-bg\` | Background color | theme-based |
| \`--public-room-bar-header-color\` | Header text color | theme-based |
| \`--public-room-bar-body-color\` | Body text color | theme-based |
| \`--public-room-bar-close-icon\` | Close icon fill | theme-based |
| \`--public-room-bar-text\` | Container text color | \`#000\` |
| \`--public-room-bar-header-icon\` | Header icon fill | \`#a3a9ae\` |
| \`--public-room-bar-text-size\` | Font size | \`12px\` |
| \`--public-room-bar-padding\` | Inner padding | \`12px 16px\` |
| \`--public-room-bar-radius\` | Border radius | \`6px\` |
| \`--public-room-bar-bottom-margin\` | Bottom margin | \`10px\` |
| \`--public-room-bar-top-margin\` | Top margin (no bar) | \`20px\` |
| \`--public-room-bar-header-gap\` | Header icon/text gap | \`8px\` |
| \`--public-room-bar-header-weight\` | Header font weight | \`600\` |`,
      },
    },
  },
};

export const Default: Story = {
  render: (args) => <PublicRoomBar {...args} />,
  args: {
    headerText: "Public Room",
    bodyText: "This room is accessible to anyone with the link",
    barIsVisible: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Default public room bar with header and body text. Shows basic room access information.",
      },
      source: {
        code: `<PublicRoomBar
  headerText="Public Room"
  bodyText="This room is accessible to anyone with the link"
/>`,
      },
    },
  },
};

export const WithCustomIcon: Story = {
  render: (args) => <PublicRoomBar {...args} />,
  args: {
    headerText: "Public Room",
    bodyText: "This room is accessible to anyone with the link",
    barIsVisible: false,
    iconName: PlanetIcon,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Public room bar with a custom planet icon indicating global/public access.",
      },
      source: {
        code: `<PublicRoomBar
  headerText="Public Room"
  bodyText="Accessible via link"
  iconName={PlanetIcon}
/>`,
      },
    },
  },
};

export const WithoutCloseButton: Story = {
  render: (args) => <PublicRoomBar {...args} />,
  args: {
    headerText: "Public Room",
    bodyText: "This room is accessible to anyone with the link",
    barIsVisible: false,
    onClose: undefined,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Persistent bar without a close button. Cannot be dismissed by the user.",
      },
      source: {
        code: `<PublicRoomBar
  headerText="Public Room"
  bodyText="Persistent notification"
/>`,
      },
    },
  },
};

const WithCustomComponentsTemplate = () => (
  <PublicRoomBar
    headerText={
      <div style={{ color: "var(--accent-main)" }}>Custom Header Component</div>
    }
    bodyText={<div style={{ fontStyle: "italic" }}>Custom Body Component</div>}
    barIsVisible
  />
);

export const WithCustomComponents: Story = {
  render: () => <WithCustomComponentsTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Bar with React components for header and body instead of plain strings, allowing custom styling and layout.",
      },
      source: {
        code: `<PublicRoomBar
  headerText={<div style={{ color: "var(--accent-main)" }}>Custom Header</div>}
  bodyText={<div style={{ fontStyle: "italic" }}>Custom Body</div>}
  barIsVisible
/>`,
      },
    },
  },
};
