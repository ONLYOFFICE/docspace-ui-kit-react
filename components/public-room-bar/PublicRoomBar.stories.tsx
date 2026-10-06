import type { ComponentProps, CSSProperties } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, waitFor } from "storybook/test";

import PlanetIcon from "../../assets/icons/12/planet.react.svg?url";

import PublicRoomBar from "./index";

const meta = {
  title: "UI/Feedback/PublicRoomBar",
  component: PublicRoomBar,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
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
  play: async ({ canvas }) => {
    const bar = canvas.getByTestId("public_room_bar");
    await expect(canvas.getByText("Public Room")).toBeVisible();
    await expect(
      canvas.getByText("This room is accessible to anyone with the link"),
    ).toBeVisible();
    // The default people glyph, and no cross without onClose.
    await expect(bar.querySelector("svg")).not.toBeNull();
    await expect(canvas.queryByTestId("icon-button")).toBeNull();
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
  play: async ({ canvas }) => {
    // A URL is fetched and inlined as an SVG.
    const bar = canvas.getByTestId("public_room_bar");
    await waitFor(() => expect(bar.querySelector("svg")).not.toBeNull());
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
  play: async ({ canvas }) => {
    await expect(canvas.queryByTestId("icon-button")).toBeNull();
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
  play: async ({ canvas }) => {
    // A node is wrapped in a div rather than a paragraph.
    const header = canvas.getByText("Custom Header Component");
    await expect(header.closest("p")).toBeNull();
    await expect(
      canvas.getByText("Custom Body Component").closest("p"),
    ).toBeNull();
    // barIsVisible only drops the top margin.
    await expect(
      getComputedStyle(canvas.getByTestId("public_room_bar")).marginTop,
    ).toBe("0px");
  },
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
  play: async ({ args, canvas, userEvent }) => {
    // The cross only reports the click; the bar stays on screen.
    await userEvent.click(canvas.getByTestId("icon-button"));
    await expect(args.onClose).toHaveBeenCalledTimes(1);
    await expect(canvas.getByTestId("public_room_bar")).toBeVisible();
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
  play: async ({ canvas }) => {
    // The icon and the header go together; the body line stays.
    await expect(canvas.queryByText("Public Room")).toBeNull();
    await expect(
      canvas.getByTestId("public_room_bar").querySelector("svg"),
    ).toBeNull();
    await expect(
      canvas.getByText("This room is accessible to anyone with the link"),
    ).toBeVisible();
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
  play: async ({ canvas }) => {
    const style = getComputedStyle(canvas.getByTestId("public_room_bar"));
    await expect(style.backgroundColor).toBe("rgb(230, 243, 251)");
    await expect(style.borderRadius).toBe("12px");
  },
  parameters: {
    docs: {
      description: {
        story: `The colour, spacing and corner variables set on one wrapper -- the variables are listed under CSS variables on this page.`,
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
