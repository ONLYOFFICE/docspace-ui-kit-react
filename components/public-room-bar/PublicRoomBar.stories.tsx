import type { ComponentProps, CSSProperties } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import PlanetIcon from "../../assets/icons/12/planet.react.svg?url";

import PublicRoomBar from "./index";

const meta = {
  title: "UI/Feedback/PublicRoomBar",
  component: PublicRoomBar,
  parameters: {
    docs: {
      description: {
        component: `PublicRoomBar is a standing note above a screen's content — an icon beside a bold header, a smaller body line and an optional close cross — for a state the reader should keep in mind while they work.

### Features

- **Header & Body Text**: Supports both strings and React nodes for flexible content
- **Custom Icon**: Shows the kit's people glyph beside the header by default, or an SVG URL or element passed in its place
- **Close Button**: Shows a close cross only while \`onClose\` is set; the bar does not hide itself, so the host stops rendering it
- **Hidden Header**: Drops the icon and header row with \`hideHeader\`, leaving the body line on its own
- **Top Margin Switch**: Keeps a 20px margin above the bar and drops it when \`barIsVisible\` is set; the prop shows and hides nothing
- **Theme Colors**: Takes its background and text colours from the light or dark theme, each replaceable through a CSS variable

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

// Body line only
<PublicRoomBar headerText="" bodyText="Accessible via link" hideHeader />
\`\`\``,
      },
    },
  },
  argTypes: {
    headerText: {
      control: "text",
      description:
        "Bold first line beside the icon: a string, or any node, which is then wrapped in a div instead of a paragraph",
    },
    bodyText: {
      control: "text",
      description:
        "Smaller line under the header, at 12px: a string, or any node, which is then wrapped in a div instead of a paragraph",
    },
    iconName: {
      control: "text",
      description:
        "Icon beside the header: a URL of an SVG file, loaded and inlined, or an element rendered as given; only its path fills take the header icon colour",
      table: {
        defaultValue: { summary: "16px people glyph" },
      },
    },
    hideHeader: {
      control: "boolean",
      description:
        "Removes the first row, icon and header text together, so only the body line is left",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    onClose: {
      control: false,
      description:
        "Called when the close cross is clicked; the cross is shown only while this is set, and the bar stays on screen until the host stops rendering it",
    },
    barIsVisible: {
      control: "boolean",
      description:
        "Removes the 20px margin above the bar, for a bar that already sits under something; it does not show or hide the bar",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    className: {
      control: "text",
      description: "Class added after the component's own on the outer element",
    },
    style: {
      control: "object",
      description: "Inline style of the outer element",
    },
    dataTestId: {
      control: "text",
      description: "Value of data-testid on the outer element",
      table: {
        defaultValue: { summary: '"public_room_bar"' },
      },
    },
  },
} satisfies Meta<typeof PublicRoomBar>;

type Story = StoryObj<ComponentProps<typeof PublicRoomBar>>;

export default meta;

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
          "The bar as most screens use it: the default icon, a header and a body line, with no close cross. Change any prop live in the Controls panel below.",
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
          "Replace the default glyph when another icon says more about the state the bar explains — here a planet, passed as an SVG URL (`iconName`).",
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
    headerText={<div style={{ color: "#0082c9" }}>Custom Header Component</div>}
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
          "Pass nodes instead of strings when a line needs markup of its own — a coloured header and an italic body here, each wrapped in a div instead of a paragraph (`headerText`, `bodyText`). The bar also sits without its top margin (`barIsVisible`).",
      },
      source: {
        code: `<PublicRoomBar
  headerText={<div style={{ color: "#0082c9" }}>Custom Header</div>}
  bodyText={<div style={{ fontStyle: "italic" }}>Custom Body</div>}
  barIsVisible
/>`,
      },
    },
  },
};

export const WithCloseButton: Story = {
  render: (args) => <PublicRoomBar {...args} />,
  args: {
    headerText: "Public Room",
    bodyText: "This room is accessible to anyone with the link",
    barIsVisible: false,
    onClose: fn(),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Let the reader dismiss a note they have read: a close cross appears on the right (`onClose`). Clicking it only reports the click in the Actions panel; the bar stays until the host stops rendering it.",
      },
      source: {
        code: `const [isShown, setIsShown] = useState(true);

{isShown ? (
  <PublicRoomBar
    headerText="Public Room"
    bodyText="This room is accessible to anyone with the link"
    onClose={() => setIsShown(false)}
  />
) : null}`,
      },
    },
  },
};

export const WithoutHeader: Story = {
  render: (args) => <PublicRoomBar {...args} />,
  args: {
    headerText: "Public Room",
    bodyText: "This room is accessible to anyone with the link",
    barIsVisible: false,
    hideHeader: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "For a note that needs no title: the icon and the bold header are gone and only the smaller body line is left (`hideHeader`).",
      },
      source: {
        code: `<PublicRoomBar
  headerText=""
  bodyText="This room is accessible to anyone with the link"
  hideHeader
/>`,
      },
    },
  },
};

export const CssCustomization: Story = {
  render: () => (
    <div
      style={
        {
          "--public-room-bar-bg": "#e6f3fb",
          "--public-room-bar-header-color": "#0082c9",
          "--public-room-bar-header-icon": "#0082c9",
          "--public-room-bar-body-color": "#1f5f86",
          "--public-room-bar-radius": "12px",
          "--public-room-bar-padding": "16px 20px",
          "--public-room-bar-top-margin": "8px",
          "--public-room-bar-bottom-margin": "24px",
          "--public-room-bar-header-gap": "12px",
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
| \`--public-room-bar-header-icon\` | Header icon fill | \`#657077\` |
| \`--public-room-bar-padding\` | Inner padding | \`12px 16px\` |
| \`--public-room-bar-radius\` | Border radius | \`6px\` |
| \`--public-room-bar-bottom-margin\` | Bottom margin | \`10px\` |
| \`--public-room-bar-top-margin\` | Top margin, dropped when \`barIsVisible\` is set | \`20px\` |
| \`--public-room-bar-header-gap\` | Gap between the header icon and text | \`8px\` |

The example sets every variable on a wrapper. The close cross keeps the icon button's own colour whatever the wrapper sets.`,
      },
      source: {
        code: `<div
  style={{
    "--public-room-bar-bg": "#e6f3fb",
    "--public-room-bar-header-color": "#0082c9",
    "--public-room-bar-header-icon": "#0082c9",
    "--public-room-bar-body-color": "#1f5f86",
    "--public-room-bar-radius": "12px",
    "--public-room-bar-padding": "16px 20px",
    "--public-room-bar-top-margin": "8px",
    "--public-room-bar-bottom-margin": "24px",
    "--public-room-bar-header-gap": "12px",
  }}
>
  <PublicRoomBar
    headerText="Public Room"
    bodyText="This room is accessible to anyone with the link"
  />
</div>`,
      },
    },
  },
};
