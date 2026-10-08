import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { AsideHeader } from ".";
import SettingsReactSvg from "../../../assets/settings.react.svg";
import InfoOutlineReactSvg from "../../../assets/info.outline.react.svg";
import { Button, ButtonSize } from "../../button";

const meta: Meta<typeof AsideHeader> = {
  title: "UI/Overlays/AsideHeader",
  component: AsideHeader,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
  },
  argTypes: {
    header: {
      control: "text",
      description:
        "Title of the panel: a string is shown as bold 21px text, any other node inside a heading that cuts off with an ellipsis; nothing is shown without it",
    },
    isBackButton: {
      control: "boolean",
      description:
        "Shows a back arrow before the title, which calls `onBackClick`",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isCloseable: {
      control: "boolean",
      description:
        "Shows the close cross, the only control that calls `onCloseClick`",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    withoutBorder: {
      control: "boolean",
      description:
        "Hides the line under the header, which otherwise spans the full width of the panel",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    headerHeight: {
      control: "text",
      description:
        "Height of the header as a CSS length, such as `70px`; without it the header is 53px tall",
    },
    isLoading: {
      control: "boolean",
      description:
        "Replaces the whole header, title, icons and close cross alike, with a skeleton bar",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    headerIcons: {
      control: false,
      description:
        "Extra icon buttons between the title and the close cross, each with a `key`, an `onClick` and either an `iconNode` or a `url` of an image loaded at runtime",
      table: {
        defaultValue: { summary: "[]" },
      },
    },
    headerComponent: {
      control: false,
      description:
        "Any node shown after the icons and before the close cross, for a control that is not an icon",
    },
    onBackClick: {
      action: "back clicked",
      description: "Called when the back arrow is clicked",
    },
    onCloseClick: {
      action: "close clicked",
      description: "Called when the close cross is clicked",
    },
    className: {
      control: "text",
      description: "Class name added to the header element",
    },
    id: {
      control: "text",
      description: "`id` of the header element",
    },
    style: {
      control: false,
      description: "Inline style of the header element",
    },
    dataTestId: {
      control: "text",
      description: "Value of `data-testid` on the header element",
      table: {
        defaultValue: { summary: '"aside-header"' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof AsideHeader>;

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <div style={{ width: "450px", border: "1px solid #eee" }}>{children}</div>
);

export const Default: Story = {
  render: (args) => (
    <Wrapper>
      <AsideHeader {...args} />
    </Wrapper>
  ),
  args: {
    header: "Default Header",
    isCloseable: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "A title and the close cross, the header every side panel starts with; clicks on the cross are logged in the Actions panel. Change any other prop live in the Controls panel below.",
      },
      source: {
        code: `<AsideHeader header="Members" onCloseClick={handleClose} />`,
      },
    },
  },
};

export const WithBackButton: Story = {
  render: (args) => (
    <Wrapper>
      <AsideHeader {...args} />
    </Wrapper>
  ),
  args: {
    header: "Header with Back Button",
    isBackButton: true,
    isCloseable: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "A back arrow before the title, for a panel that opens a second level and needs a way back to the first; the arrow calls its own handler, logged in the Actions panel (`isBackButton`).",
      },
      source: {
        code: `<AsideHeader
  header="Details"
  isBackButton
  onBackClick={handleBack}
  onCloseClick={handleClose}
/>`,
      },
    },
  },
};

export const WithIcons: Story = {
  render: (args) => (
    <Wrapper>
      <AsideHeader {...args} />
    </Wrapper>
  ),
  args: {
    header: "Header with Icons",
    headerIcons: [
      {
        key: "settings",
        iconNode: <SettingsReactSvg />,
        onClick: () => console.log("Settings clicked"),
      },
      {
        key: "info",
        iconNode: <InfoOutlineReactSvg />,
        onClick: () => console.log("Info clicked"),
      },
    ],
    isCloseable: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Two icon buttons between the title and the close cross, for actions on what the panel shows without a toolbar of their own; each icon has its own click handler (`headerIcons`).",
      },
      source: {
        code: `<AsideHeader
  header="Header with Icons"
  headerIcons={[
    { key: "settings", iconNode: <SettingsIcon />, onClick: openSettings },
    { key: "info", iconNode: <InfoIcon />, onClick: openInfo },
  ]}
  onCloseClick={handleClose}
/>`,
      },
    },
  },
};

export const Loading: Story = {
  render: (args) => (
    <Wrapper>
      <AsideHeader {...args} />
    </Wrapper>
  ),
  args: {
    isLoading: true,
    isCloseable: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "A skeleton bar in place of the whole header while the panel waits for its data. The close cross goes too, so a panel that may load for long needs another way out (`isLoading`).",
      },
      source: {
        code: `<AsideHeader isLoading />`,
      },
    },
  },
};

export const WithoutBorder: Story = {
  render: (args) => (
    <Wrapper>
      <AsideHeader {...args} />
    </Wrapper>
  ),
  args: {
    header: "Header without Border",
    withoutBorder: true,
    isCloseable: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "The header with no line under it, for a panel whose first block already draws its own separator (`withoutBorder`).",
      },
      source: {
        code: `<AsideHeader header="Members" withoutBorder onCloseClick={handleClose} />`,
      },
    },
  },
};

export const CustomHeight: Story = {
  render: (args) => (
    <Wrapper>
      <AsideHeader {...args} />
    </Wrapper>
  ),
  args: {
    header: "Custom Height Header",
    headerHeight: "70px",
    isCloseable: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "A 70px header instead of 53px, for a title bar that has to line up with a taller bar next to the panel (`headerHeight`).",
      },
      source: {
        code: `<AsideHeader header="Members" headerHeight="70px" onCloseClick={handleClose} />`,
      },
    },
  },
};

export const BackAndClose: Story = {
  render: (args) => (
    <Wrapper>
      <AsideHeader {...args} />
    </Wrapper>
  ),
  args: {
    header: "A navigation header with a title too long for the panel",
    isBackButton: true,
    isCloseable: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "The back arrow and the close cross around a title too long for the panel: the title is cut off with an ellipsis rather than pushing the close cross out of the header.",
      },
      source: {
        code: `<AsideHeader
  header="A navigation header with a title too long for the panel"
  isBackButton
  onBackClick={handleBack}
  onCloseClick={handleClose}
/>`,
      },
    },
  },
};

export const WithCustomControl: Story = {
  render: (args) => (
    <Wrapper>
      <AsideHeader {...args} />
    </Wrapper>
  ),
  args: {
    header: "Members",
    headerComponent: (
      <Button label="Invite" size={ButtonSize.extraSmall} primary />
    ),
    isCloseable: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "A button between the title and the close cross, for an action that needs a label rather than an icon (`headerComponent`).",
      },
      source: {
        code: `<AsideHeader
  header="Members"
  headerComponent={<Button label="Invite" size={ButtonSize.extraSmall} primary />}
  onCloseClick={handleClose}
/>`,
      },
    },
  },
};

// Framed on Docs: the theme provider stamps the direction on the page, which would flip the whole Docs page.
export const RightToLeft: Story = {
  render: (args) => (
    <div dir="rtl">
      <Wrapper>
        <AsideHeader {...args} />
      </Wrapper>
    </div>
  ),
  globals: { direction: "rtl" },
  args: {
    header: "Details",
    isBackButton: true,
    isCloseable: true,
  },
  parameters: {
    noPadding: true,
    docs: {
      story: { inline: false, height: "81px" },
      description: {
        story:
          'The same header under a right-to-left interface: the back arrow moves to the right edge and points right, the title follows it, and the close cross sits on the left. The direction comes from the theme\'s `interfaceDirection` (the Direction toolbar); the wrapper also carries `dir="rtl"` for the rules that read the DOM direction.',
      },
      source: {
        code: `<div dir="rtl">
  <AsideHeader header="Details" isBackButton onBackClick={handleBack} onCloseClick={handleClose} />
</div>`,
      },
    },
  },
};

export const CssCustomization: Story = {
  render: () => (
    <div
      style={
        {
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          width: "450px",
          "--aside-header-color": "#004f82",
          "--aside-header-border": "#0082c9",
          "--aside-header-font-size": "18px",
          "--aside-header-height": "60px",
          "--aside-header-gap": "16px",
        } as CSSProperties
      }
    >
      {/* A node title, not a string: a string title ignores the color and font-size variables */}
      <div style={{ border: "1px solid #eee" }}>
        <AsideHeader header={<span>Customized Header</span>} isBackButton />
      </div>
      <div style={{ border: "1px solid #eee" }}>
        <AsideHeader
          header={<span>Centered Title</span>}
          style={
            {
              "--aside-header-title-position": "absolute",
              "--aside-header-title-inset": "50%",
              "--aside-header-title-transform": "translateX(-50%)",
              "--aside-header-border-display": "none",
            } as CSSProperties
          }
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `Two headers restyled through CSS variables -- the variables are listed under CSS variables on this page.

- **Customized Header** — the wrapper's color, border, font size, height and gap; the back arrow is on to show the gap before the title.
- **Centered Title** — the title taken out of the row and centered, with the line removed. These variables are set through the header's own \`style\`, because in the wrapper they would also move the first header's title away from its back arrow.`,
      },
      source: {
        code: `<div
  style={{
    "--aside-header-color": "#004f82",
    "--aside-header-border": "#0082c9",
    "--aside-header-font-size": "18px",
    "--aside-header-height": "60px",
    "--aside-header-gap": "16px",
  }}
>
  <AsideHeader header={<span>Customized Header</span>} isBackButton />
  <AsideHeader
    header={<span>Centered Title</span>}
    style={{
      "--aside-header-title-position": "absolute",
      "--aside-header-title-inset": "50%",
      "--aside-header-title-transform": "translateX(-50%)",
      "--aside-header-border-display": "none",
    }}
  />
</div>`,
      },
    },
  },
};
