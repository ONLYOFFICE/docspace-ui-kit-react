import React from "react";
import type { ComponentProps } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Text } from "../text";
import { RootTooltip } from "../tooltip";

import { HelpButton } from ".";

const meta = {
  title: "UI/Interactive elements/HelpButton",
  component: HelpButton,
  parameters: {
    docs: {
      description: {
        component: `HelpButton is an info icon that opens a short explanation next to a label or setting whose meaning is not obvious from its own text.

### Features

- **Tooltip Content**: Shows a string in the application's shared tooltip and any other React node in a tooltip the component renders itself
- **Positioning**: Opens on the preferred side of the icon, top unless set otherwise, and moves to another side when that one has no room
- **Size and Color**: Draws the info icon at 12px in the theme's grey unless another size, any CSS colour or the theme accent is given
- **Click Mode**: Opens on click and stays open so a link inside can be reached, or opens on hover when \`openOnClick\` is turned off
- **Offset Control**: Sets the gap between the icon and the tooltip in pixels
- **Custom Anchor**: Opens the tooltip from any element passed as children, in place of the info icon
- **Controlled State**: Can be held open or closed by the parent, with callbacks after the tooltip has been shown and hidden
- **Width Limit**: Caps the width of the tooltip at a CSS length, so long text wraps

### Accessibility

Keyboard support comes from the tooltip underneath:

- **Escape**: Closes the open tooltip, as do a click outside the icon, scrolling and resizing the window
- **Focus**: The icon is a \`<div>\` with no tab stop, so the explanation cannot be opened from the keyboard; keep text that keyboard users need on the page itself

### Usage

\`\`\`tsx
import { HelpButton } from "@onlyoffice/apps-ui-kit/components/help-button";

// Basic help button
<HelpButton tooltipContent={<div>Help text here</div>} />

// With custom position and offset
<HelpButton
  tooltipContent={<div>Help text</div>}
  place="top"
  offset={12}
/>

// With custom size and color
<HelpButton
  tooltipContent={<div>Help text</div>}
  size={24}
  color="#2DA7DB"
/>
\`\`\``,
      },
    },
  },
  argTypes: {
    tooltipContent: {
      description:
        "Content of the tooltip. A string is shown by the application's shared tooltip, which appears only where `RootTooltip` is mounted; any other node opens in a tooltip the component renders itself",
      control: false,
    },
    getContent: {
      description:
        "Function that builds the tooltip's content in place of `tooltipContent`. A returned string goes to the shared tooltip, a returned node to the component's own",
      control: false,
    },
    children: {
      description:
        "Element to open the tooltip from in place of the info icon; the whole element becomes the anchor",
      control: false,
    },
    place: {
      control: "select",
      options: ["top", "right", "bottom", "left"],
      description:
        "Side of the icon the tooltip opens on; it moves to another side when this one has no room",
      table: {
        defaultValue: { summary: "top" },
      },
    },
    size: {
      control: { type: "number", min: 8, max: 48 },
      description:
        "Width and height of the info icon; a number is pixels, a string a CSS length",
      table: {
        defaultValue: { summary: "12" },
      },
    },
    color: {
      control: "color",
      description:
        'Colour of the info icon: any CSS colour, `"accent"` for the theme accent, or the name of a custom property starting with `--`',
    },
    iconName: {
      control: "text",
      description:
        "URL of an SVG to draw instead of the info icon, fetched by the browser at runtime",
    },
    iconNode: {
      control: false,
      description: "Icon as JSX to draw instead of the info icon",
    },
    offset: {
      control: "number",
      description: "Gap between the icon and the tooltip, in pixels",
    },
    openOnClick: {
      control: "boolean",
      description:
        "Opens the tooltip on click and keeps it open until the next click; when off, it opens on hover and closes when the pointer leaves",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    isClickable: {
      control: "boolean",
      description:
        "Shows the pointer cursor over the icon; the tooltip opens on click either way",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    isOpen: {
      control: "boolean",
      description:
        "Holds the tooltip open or closed from outside. Has no effect on a string tooltip",
    },
    afterShow: {
      action: "afterShow",
      description:
        "Called after the tooltip has been shown. Not called for a string tooltip",
    },
    afterHide: {
      action: "afterHide",
      description:
        "Called after the tooltip has been hidden. Not called for a string tooltip",
    },
    tooltipMaxWidth: {
      control: "text",
      description:
        "Widest the tooltip may grow, as a CSS length; longer text wraps. Has no effect on a string tooltip",
      table: {
        defaultValue: { summary: "320px" },
      },
    },
    tooltipStyle: {
      control: "object",
      description: "Inline style of the tooltip box itself",
    },
    noUserSelect: {
      control: "boolean",
      description: "Stops the text in the tooltip from being selected",
    },
    id: {
      control: "text",
      description:
        "Id of the anchor. Without it a new id is generated on every render, so pass one for a button inside something that re-renders",
    },
    className: {
      control: "text",
      description: "Class of the icon or of the element around the children",
      table: {
        defaultValue: { summary: "icon-button" },
      },
    },
    style: {
      control: "object",
      description: "Inline style of the wrapper around the anchor",
    },
    dataTip: {
      control: "text",
      description: "Value of the legacy `data-tip` attribute on the icon",
    },
    dataTestId: {
      control: "text",
      description: "Value of `data-testid` on the wrapper",
      table: {
        defaultValue: { summary: "help-button" },
      },
    },
    tooltipId: {
      control: false,
      description: "Ignored. Nothing reads this prop",
    },
    tooltipProps: {
      control: false,
      description: "Ignored. Nothing reads this prop",
    },
    offsetTop: {
      control: false,
      description: "Ignored. Nothing reads this prop",
    },
    offsetRight: {
      control: false,
      description: "Ignored. Nothing reads this prop",
    },
    offsetBottom: {
      control: false,
      description: "Ignored. Nothing reads this prop",
    },
    offsetLeft: {
      control: false,
      description: "Ignored. Nothing reads this prop",
    },
    hoverColor: {
      control: false,
      description:
        "Accepted by the type but not passed on to the icon, so it has no effect",
    },
    clickColor: {
      control: false,
      description:
        "Accepted by the type but not passed on to the icon, so it has no effect",
    },
    isDisabled: {
      control: false,
      description:
        "Accepted by the type but not passed on to the icon, so it has no effect",
    },
    isFill: {
      control: false,
      description:
        "Accepted by the type but not passed on to the icon, so it has no effect",
    },
    isStroke: {
      control: false,
      description:
        "Accepted by the type but not passed on to the icon, so it has no effect",
    },
    iconHoverName: {
      control: false,
      description:
        "Accepted by the type but not passed on to the icon, so it has no effect",
    },
    iconClickName: {
      control: false,
      description:
        "Accepted by the type but not passed on to the icon, so it has no effect",
    },
    onClick: {
      control: false,
      description:
        "Accepted by the type but not passed on to the icon, so it has no effect",
    },
    onMouseEnter: {
      control: false,
      description:
        "Accepted by the type but not passed on to the icon, so it has no effect",
    },
    onMouseLeave: {
      control: false,
      description:
        "Accepted by the type but not passed on to the icon, so it has no effect",
    },
    onMouseDown: {
      control: false,
      description:
        "Accepted by the type but not passed on to the icon, so it has no effect",
    },
    onMouseUp: {
      control: false,
      description:
        "Accepted by the type but not passed on to the icon, so it has no effect",
    },
    tabIndex: {
      control: false,
      description:
        "Accepted by the type but not passed on to the icon, so it has no effect",
    },
    onKeyDown: {
      control: false,
      description:
        "Accepted by the type but not passed on to the icon, so it has no effect",
    },
    title: {
      control: false,
      description:
        "Accepted by the type but not passed on to the icon, so it has no effect",
    },
  },
} satisfies Meta<typeof HelpButton>;

type Story = StoryObj<ComponentProps<typeof HelpButton>>;

export default meta;

const Wrapper = (props: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        display: "flex",
        gap: "32px",
        alignItems: "center",
        padding: "40px 20px",
      }}
    >
      {props.children}
    </div>
  );
};

export const Default: Story = {
  render: (args) => (
    <div style={{ padding: "40px 20px" }}>
      <HelpButton {...args} />
    </div>
  ),
  args: {
    tooltipContent: <div>This is a help tooltip</div>,
    place: "right",
    offset: 8,
  },
  parameters: {
    docs: {
      description: {
        story:
          "The info icon with a short explanation beside it; click the icon to open it, and change any other prop live in the Controls panel below.",
      },
      source: {
        code: `<HelpButton
  tooltipContent={<div>This is a help tooltip</div>}
  place="right"
  offset={8}
/>`,
      },
    },
  },
};

const CustomStyleTemplate = () => {
  return (
    <Wrapper>
      <HelpButton
        tooltipContent={<div>Default size</div>}
        place="top"
        offset={8}
      />
      <HelpButton
        tooltipContent={<div>Large blue help button</div>}
        size={24}
        color="#2DA7DB"
        place="top"
        offset={12}
      />
      <HelpButton
        tooltipContent={<div>Large green help button</div>}
        size={20}
        color="#4CAF50"
        place="top"
        offset={12}
      />
    </Wrapper>
  );
};

export const CustomStyle: Story = {
  render: () => <CustomStyleTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "An icon larger or in another colour stands out next to a heading rather than a field label. Click each icon to open its tooltip.",
      },
      source: {
        code: `<HelpButton tooltipContent={<div>Default size</div>} place="top" />
<HelpButton tooltipContent={<div>Large blue</div>} size={24} color="#2DA7DB" place="top" />
<HelpButton tooltipContent={<div>Large green</div>} size={20} color="#4CAF50" place="top" />`,
      },
    },
  },
};

const WithCustomContentTemplate = () => {
  return (
    <div style={{ padding: "40px 20px" }}>
      <HelpButton
        tooltipContent={
          <div style={{ padding: "8px" }}>
            <Text fontSize="14px" fontWeight="bold">
              Help Information
            </Text>
            <ul style={{ margin: "8px 0" }}>
              <li>First instruction</li>
              <li>Second instruction</li>
              <li>Third instruction</li>
            </ul>
            <Text fontSize="12px" color="gray">
              Click for more details
            </Text>
          </div>
        }
        place="right"
        offset={8}
      />
    </div>
  );
};

export const WithCustomContent: Story = {
  render: () => <WithCustomContentTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "An explanation that needs a heading or a list goes in as a React node, which opens in the component's own tooltip with no shared tooltip mounted.",
      },
      source: {
        code: `<HelpButton
  tooltipContent={
    <div>
      <Text fontWeight="bold">Help Information</Text>
      <ul>
        <li>First instruction</li>
        <li>Second instruction</li>
      </ul>
    </div>
  }
  place="right"
/>`,
      },
    },
  },
};

const TooltipPositionsTemplate = () => {
  return (
    <div
      style={{
        display: "flex",
        gap: "48px",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 40px",
      }}
    >
      {(["top", "right", "bottom", "left"] as const).map((place) => (
        <div
          key={place}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <HelpButton
            tooltipContent={<div>Tooltip appears at {place}</div>}
            place={place}
            offset={8}
          />
          <span style={{ fontSize: "12px", color: "#666" }}>{place}</span>
        </div>
      ))}
    </div>
  );
};

export const TooltipPositions: Story = {
  render: () => <TooltipPositionsTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "The side matters when the icon sits at the edge of a form or next to other controls. Click each icon to see its tooltip open on the side written under it.",
      },
      source: {
        code: `<HelpButton tooltipContent={<div>Top</div>} place="top" />
<HelpButton tooltipContent={<div>Right</div>} place="right" />
<HelpButton tooltipContent={<div>Bottom</div>} place="bottom" />
<HelpButton tooltipContent={<div>Left</div>} place="left" />`,
      },
    },
  },
};

const TextContentTemplate = () => {
  return (
    <div style={{ padding: "40px 20px" }}>
      <RootTooltip />
      <HelpButton
        id="text-content-help"
        tooltipContent="Plain text opens in the shared tooltip"
        place="right"
      />
    </div>
  );
};

export const WithTextContent: Story = {
  render: () => <TextContentTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Plain text needs no tooltip of its own: a string is shown by the application's shared tooltip, so it appears only where `RootTooltip` is mounted once, as it is here. Click the icon to open it.",
      },
      source: {
        code: `<RootTooltip />
<HelpButton
  id="text-content-help"
  tooltipContent="Plain text opens in the shared tooltip"
  place="right"
/>`,
      },
    },
  },
};

const CustomAnchorTemplate = () => {
  return (
    <div style={{ padding: "40px 20px" }}>
      <HelpButton
        id="custom-anchor-help"
        place="right"
        tooltipMaxWidth="240px"
        tooltipContent={
          <Text fontSize="12px">Storage is counted across all your rooms.</Text>
        }
      >
        <Text as="span" style={{ textDecoration: "underline dotted" }}>
          Storage
        </Text>
      </HelpButton>
    </div>
  );
};

export const WithCustomAnchor: Story = {
  render: () => <CustomAnchorTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "When the label itself should open the explanation, pass it as children in place of the icon. Click **Storage** to open a tooltip no wider than 240px (`tooltipMaxWidth`).",
      },
      source: {
        code: `<HelpButton
  id="custom-anchor-help"
  place="right"
  tooltipMaxWidth="240px"
  tooltipContent={<Text fontSize="12px">Storage is counted across all your rooms.</Text>}
>
  <Text as="span" style={{ textDecoration: "underline dotted" }}>Storage</Text>
</HelpButton>`,
      },
    },
  },
};

const OpensOnHoverTemplate = () => {
  return (
    <div style={{ padding: "40px 20px" }}>
      <HelpButton
        id="hover-help"
        openOnClick={false}
        place="right"
        tooltipContent={<div>Opens while the pointer is over the icon</div>}
      />
    </div>
  );
};

export const OpensOnHover: Story = {
  render: () => <OpensOnHoverTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "A one-line hint with nothing to click inside can open on hover instead (`openOnClick={false}`). Point at the icon to open it; the tooltip closes when the pointer leaves.",
      },
      source: {
        code: `<HelpButton
  openOnClick={false}
  place="right"
  tooltipContent={<div>Opens while the pointer is over the icon</div>}
/>`,
      },
    },
  },
};

// The tooltip renders in a portal outside the wrapper, so the variables go through tooltipStyle.
const cssTooltipStyle = {
  "--tooltip-bg": "#1e3a5f",
  "--tooltip-color": "#e6f3fb",
  "--tooltip-max-width-value": "180px",
} as React.CSSProperties;

export const CssCustomization: Story = {
  render: () => (
    <div
      style={{
        padding: "40px 20px",
        display: "flex",
        gap: "32px",
        alignItems: "center",
      }}
    >
      <HelpButton
        tooltipContent={<div>Customized tooltip</div>}
        place="right"
        offset={8}
        tooltipStyle={cssTooltipStyle}
      />
      <HelpButton
        tooltipContent={
          <div>Another tooltip, wrapped at the custom maximum width</div>
        }
        size={20}
        place="right"
        offset={8}
        tooltipStyle={cssTooltipStyle}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `CSS Custom Properties for external customization:

| Variable | Description | Default |
| --- | --- | --- |
| \`--tooltip-bg\` | Background of the tooltip | theme-based |
| \`--tooltip-color\` | Text colour of the tooltip | theme-based |
| \`--tooltip-max-width-value\` | Widest the tooltip may grow before its text wraps | \`320px\` |

The tooltip renders in a portal outside the page's own elements, so the variables are passed through \`tooltipStyle\` rather than set on a wrapper. Click either icon to see the custom colours; the second tooltip's longer text wraps at 180px. The icon's colour is set with the \`color\` prop: its own stylesheet declares \`--icon-button-color\` on the icon, so a value set around it never arrives.`,
      },
      source: {
        code: `<HelpButton
  tooltipContent={<div>Customized tooltip</div>}
  tooltipStyle={{
    "--tooltip-bg": "#1e3a5f",
    "--tooltip-color": "#e6f3fb",
    "--tooltip-max-width-value": "180px",
  }}
/>`,
      },
    },
  },
};
