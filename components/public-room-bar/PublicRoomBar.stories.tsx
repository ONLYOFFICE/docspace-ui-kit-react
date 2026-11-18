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
        "Bold first line, beside the icon. A string renders in the kit's `Text`; anything else is wrapped in a `div` instead of `Text`'s usual `p`. `hideHeader` removes it.",
    },
    bodyText: {
      control: "text",
      description:
        "The line under the header, at 12px. A string renders in the kit's `Text`; anything else is wrapped in a `div` instead of `Text`'s usual `p`.",
    },
    iconName: {
      control: "text",
      description:
        "Icon beside the header, the kit's 16px people glyph when unset. A string is fetched as an SVG through `react-svg`; an element is rendered as given. Only `path` fills are recoloured.",
      table: {
        defaultValue: { summary: "16px people glyph" },
      },
    },
    hideHeader: {
      control: "boolean",
      description:
        "Drops the whole first row, icon and header text together, leaving the body on its own.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    onClose: {
      control: false,
      description:
        "Called when the close button is clicked. The button exists only while this is set, and the bar does not hide itself.",
    },
    barIsVisible: {
      control: "boolean",
      description:
        "Removes the bar's own 20px top margin, for a bar that already sits under something. It shows and hides nothing, whatever the name suggests.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    className: {
      control: "text",
      description:
        "Added after the component's own classes on the outer element.",
    },
    style: {
      control: "object",
      description:
        "Inline style of the outer element, and the place for the bar's CSS variables.",
    },
    dataTestId: {
      control: "text",
      description: "Value of `data-testid` on the outer element.",
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
          "The bar as most screens use it: the default icon, a header and a body line, with no close cross.",
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
  name: "Custom icon",
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
  name: "Without a close button",
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
  name: "Nodes as text",
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
          "A coloured header and an italic body passed as nodes, each wrapped in a div instead of a paragraph (`headerText`, `bodyText`). The bar sits without its top margin (`barIsVisible`).",
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
  name: "With a close button",
  render: (args) => <PublicRoomBar {...args} />,
  args: {
    headerText: "Public Room",
    bodyText: "This room is accessible to anyone with the link",
    barIsVisible: false,
    onClose: fn(),
  },
  play: async ({ args, canvas, userEvent }) => {
    // The cross only reports the click; the bar stays on screen.
    const close = canvas.getByRole("button", { name: "Close" });
    await userEvent.click(close);
    await expect(args.onClose).toHaveBeenCalledTimes(1);
    await expect(canvas.getByTestId("public_room_bar")).toBeVisible();

    // It is a real button: reached with Tab, pressed with Enter or Space.
    close.blur();
    await userEvent.tab();
    await expect(close).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(args.onClose).toHaveBeenCalledTimes(2);
    await userEvent.keyboard(" ");
    await expect(args.onClose).toHaveBeenCalledTimes(3);
  },
  parameters: {
    docs: {
      description: {
        story:
          "A close button on the right, for a note the reader may dismiss (`onClose`). It is named by `closeLabel` and works from the keyboard. Pressing it only reports the click; the bar stays until the host removes it.",
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
  name: "Body only",
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
  name: "CSS variables",
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
          "--public-room-bar-close-icon": "#0082c9",
        } as CSSProperties
      }
    >
      <PublicRoomBar
        headerText="Public Room"
        bodyText="This room is accessible to anyone with the link"
        barIsVisible={false}
        onClose={() => {}}
      />
    </div>
  ),
  play: async ({ canvas }) => {
    const style = getComputedStyle(canvas.getByTestId("public_room_bar"));
    await expect(style.backgroundColor).toBe("rgb(230, 243, 251)");
    await expect(style.borderRadius).toBe("12px");
    // The close-icon variable paints the cross.
    const cross = canvas
      .getByRole("button", { name: "Close" })
      .querySelector("path") as SVGPathElement;
    await expect(getComputedStyle(cross).fill).toBe("rgb(0, 130, 201)");
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
    "--public-room-bar-close-icon": "#0082c9",
  }}
>
  <PublicRoomBar
    headerText="Public Room"
    bodyText="This room is accessible to anyone with the link"
    onClose={onClose}
  />
</div>`,
      },
    },
  },
};
