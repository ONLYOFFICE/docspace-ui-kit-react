import type { CSSProperties, ComponentProps } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { LinkWithDropdown } from ".";

const meta = {
  title: "UI/Interactive elements/LinkWithDropdown",
  component: LinkWithDropdown,
  parameters: {
    docs: {
      description: {
        component: `A link component that expands to show a dropdown menu of options.

### Features

- **Menu Items**: Renders each entry of \`data\` as a menu item and closes the menu after one is clicked
- **Custom Text Styles**: Configurable font size, weight, and color
- **Expander Icon**: Optional chevron after the text that turns over while the menu is open
- **Disabled State**: Clicking no longer opens the menu and the cursor stays an arrow
- **Semitransparent Mode**: Draws the whole link at half opacity
- **Custom Width**: Sets an exact menu width instead of fitting the widest entry
- **Direction Control**: Opens the menu above or below the link and aligns it to either side, optionally keeping that placement when it does not fit
- **Text Overflow**: Truncates a long label with an ellipsis at 200px instead of wrapping it

### Accessibility

The link announces itself as a menu button; it handles no keys of its own.

- \`role="button"\` with \`aria-haspopup="true"\`: announced as a button that opens a menu
- \`aria-expanded\`: reports whether the menu is open
- \`aria-disabled\`: reports the disabled state set by \`isDisabled\`
- The link has no \`href\` or \`tabIndex\`, so it is not in the tab order and keyboard users cannot reach it

### Usage

\`\`\`tsx
import { LinkWithDropdown } from "@onlyoffice/apps-ui-kit/components/link-with-dropdown";

<LinkWithDropdown
  data={[
    { key: "1", label: "Option 1", onClick: handleClick },
    { key: "2", label: "Option 2", onClick: handleClick },
  ]}
>
  Click me
</LinkWithDropdown>
\`\`\``,
      },
    },
  },
  argTypes: {
    children: {
      control: "text",
      description: "Text of the link",
    },
    data: {
      control: "object",
      description:
        "Entries of the menu, each with the props of a `DropDownItem`: a required `key`, a `label`, an `onClick` called with the click event, or `isSeparator` for a divider line",
    },
    fontSize: {
      control: "text",
      description: "Font size of the link text",
      table: {
        defaultValue: { summary: "13px" },
      },
    },
    fontWeight: {
      control: "number",
      description: "Font weight of the text, as a number",
    },
    isBold: {
      control: "boolean",
      description: "Quick way to make text bold",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    color: {
      control: "color",
      description: "Text color of the link",
    },
    isDisabled: {
      control: "boolean",
      description:
        "Makes the link inert: clicking no longer opens the menu and the cursor stays an arrow",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    withExpander: {
      control: "boolean",
      description:
        "Draws a chevron after the text, which turns over while the menu is open",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isSemitransparent: {
      control: "boolean",
      description: "Draws the link at half opacity",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isTextOverflow: {
      control: "boolean",
      description:
        "Truncates the text with an ellipsis at 200px instead of wrapping it",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    dropdownType: {
      control: "select",
      options: ["alwaysDashed", "appearDashedAfterHover"],
      description:
        "Whether the dashed underline is always drawn or appears on hover. Currently neither value draws an underline",
      table: {
        defaultValue: { summary: "alwaysDashed" },
      },
    },
    manualWidth: {
      control: "text",
      description:
        "Exact width of the menu, as a CSS length. Without it the menu is as wide as its widest entry",
    },
    directionY: {
      control: "select",
      options: ["top", "bottom", "both"],
      description:
        "Whether the menu opens above or below the link; `both` opens it below unless it would run off the bottom of the window",
      table: {
        defaultValue: { summary: "bottom" },
      },
    },
    fixedDirection: {
      control: "boolean",
      description:
        "Keeps the menu on the chosen sides even when it does not fit there, instead of flipping it",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    directionX: {
      control: "select",
      options: ["left", "right"],
      description: "Which side of the link the menu is aligned to",
      table: {
        defaultValue: { summary: "right" },
      },
    },
    isOpen: {
      control: "boolean",
      description:
        "Whether the menu starts open. The link then keeps that state itself; changing this prop re-syncs it",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isDefaultMode: {
      control: "boolean",
      description:
        "Whether the menu is rendered in a portal on `document.body`. Turn it off to render it in place",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    title: {
      control: "text",
      description:
        "Tooltip text for the label. It opens the kit's shared tooltip, which appears only where the page mounts `RootTooltip`; no native `title` attribute is set",
    },
    hasScroll: {
      control: "boolean",
      description:
        "Wraps the menu in a scrollbar of its own, 250px tall (100px in landscape). It only takes effect on a phone",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    withDynamicScrollbar: {
      control: "boolean",
      description:
        "Measures the room around the link on every open and scrolls the menu inside what is left",
    },
    topSpace: {
      control: "number",
      description:
        "(`withDynamicScrollbar` only) Space to leave above the menu, in pixels",
    },
    bottomSpace: {
      control: "number",
      description:
        "(`withDynamicScrollbar` only) Space to leave below the menu, in pixels",
    },
    isAside: {
      control: "boolean",
      description:
        "Passed to the menu's backdrop, which then keeps an aside panel above itself",
    },
    withoutBackground: {
      control: "boolean",
      description: "Passed to the menu's backdrop: makes it transparent",
    },
    className: {
      control: "text",
      description:
        "Class added to the outermost element and to the link inside it",
    },
    dropDownClassName: {
      control: "text",
      description: "Class added to the menu",
    },
    id: {
      control: "text",
      description: "`id` of the outermost element",
    },
    style: {
      control: "object",
      description: "Inline style of the outermost element",
    },
    isHovered: {
      control: false,
      description:
        "Ignored. Nothing reads this prop; the hover look comes from CSS",
    },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: "20px", marginBottom: "200px" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LinkWithDropdown>;

type Story = StoryObj<ComponentProps<typeof LinkWithDropdown>>;

export default meta;

const dropdownItems = [
  {
    key: "key1",
    label: "Button 1",
    onClick: fn().mockName("Button 1"),
  },
  {
    key: "key2",
    label: "Button 2",
    onClick: fn().mockName("Button 2"),
  },
  {
    key: "key3",
    isSeparator: true,
  },
  {
    key: "key4",
    label: "Button 3",
    onClick: fn().mockName("Button 3"),
  },
];

export const Default: Story = {
  render: (args) => <LinkWithDropdown {...args} />,
  args: {
    children: "Default Link",
    data: dropdownItems,
    fontSize: "13px",
    fontWeight: 400,
    isBold: false,
    isTextOverflow: false,
    isSemitransparent: false,
    directionY: "bottom",
    fixedDirection: true,
    isDefaultMode: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "The link with a three-item menu; click it to open the menu, pick an entry to see its `onClick` in the Actions panel, and change any other prop live in the Controls panel below.",
      },
      source: {
        code: `<LinkWithDropdown
  data={[
    { key: "key1", label: "Button 1", onClick: handleClick },
    { key: "key2", label: "Button 2", onClick: handleClick },
    { key: "key3", isSeparator: true },
    { key: "key4", label: "Button 3", onClick: handleClick },
  ]}
>
  Default Link
</LinkWithDropdown>`,
      },
    },
  },
};

const WithExpanderTemplate = () => {
  return (
    <LinkWithDropdown
      data={dropdownItems}
      fontSize="13px"
      withExpander
      directionY="bottom"
      fixedDirection
      isDefaultMode={false}
    >
      Link with Expander
    </LinkWithDropdown>
  );
};

export const WithExpander: Story = {
  render: () => <WithExpanderTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Link with an expander arrow icon that indicates the presence of a dropdown menu.",
      },
      source: {
        code: `<LinkWithDropdown data={items} withExpander>Link with Expander</LinkWithDropdown>`,
      },
    },
  },
};

const CustomStylingTemplate = () => {
  return (
    <LinkWithDropdown
      data={dropdownItems}
      fontSize="16px"
      fontWeight={600}
      isBold
      color="#4781d1"
      directionY="bottom"
      fixedDirection
      isDefaultMode={false}
    >
      Custom Styled Link
    </LinkWithDropdown>
  );
};

export const CustomStyling: Story = {
  render: () => <CustomStylingTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Link with custom font size, weight, and color for styled appearance.",
      },
      source: {
        code: `<LinkWithDropdown data={items} fontSize="16px" fontWeight={600} isBold color="#4781d1">
  Custom Styled Link
</LinkWithDropdown>`,
      },
    },
  },
};

const DisabledTemplate = () => {
  return (
    <LinkWithDropdown data={dropdownItems} fontSize="13px" isDisabled>
      Disabled Link
    </LinkWithDropdown>
  );
};

export const Disabled: Story = {
  render: () => <DisabledTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Use it while the options do not apply yet: clicking no longer opens the menu and the cursor stays an arrow (`isDisabled`). In the light theme the text keeps the default grey, so the state is not visible until the link is clicked.",
      },
      source: {
        code: `<LinkWithDropdown data={items} isDisabled>Disabled Link</LinkWithDropdown>`,
      },
    },
  },
};

const SemiTransparentTemplate = () => {
  return (
    <LinkWithDropdown
      data={dropdownItems}
      fontSize="13px"
      isSemitransparent
      directionY="bottom"
      fixedDirection
      isDefaultMode={false}
    >
      Semi-transparent Link
    </LinkWithDropdown>
  );
};

export const SemiTransparent: Story = {
  render: () => <SemiTransparentTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Link with reduced opacity for a subtle, secondary appearance.",
      },
      source: {
        code: `<LinkWithDropdown data={items} isSemitransparent>Semi-transparent Link</LinkWithDropdown>`,
      },
    },
  },
};

const WithCustomWidthTemplate = () => {
  return (
    <LinkWithDropdown
      data={dropdownItems}
      fontSize="13px"
      manualWidth="300px"
      directionY="bottom"
      fixedDirection
      isDefaultMode={false}
    >
      Custom Width Link
    </LinkWithDropdown>
  );
};

export const WithCustomWidth: Story = {
  render: () => <WithCustomWidthTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Link with a manually set dropdown width for controlling the menu size.",
      },
      source: {
        code: `<LinkWithDropdown data={items} manualWidth="300px">Custom Width Link</LinkWithDropdown>`,
      },
    },
  },
};

const TextOverflowTemplate = () => {
  return (
    <LinkWithDropdown
      data={dropdownItems}
      fontSize="13px"
      isTextOverflow
      withExpander
      directionY="bottom"
      fixedDirection
      isDefaultMode={false}
    >
      A long link label that does not fit in the available width
    </LinkWithDropdown>
  );
};

export const TextOverflow: Story = {
  render: () => <TextOverflowTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Use it where a label can be longer than its place: the text stops at 200px with an ellipsis and the chevron stays beside it (`isTextOverflow`).",
      },
      source: {
        code: `<LinkWithDropdown
  data={items}
  isTextOverflow
  withExpander
>
  A long link label that does not fit in the available width
</LinkWithDropdown>`,
      },
    },
  },
};

const OpenMenuTemplate = () => {
  return (
    <LinkWithDropdown
      data={dropdownItems}
      fontSize="13px"
      withExpander
      isOpen
      directionY="bottom"
      fixedDirection
      isDefaultMode={false}
    >
      Open Link
    </LinkWithDropdown>
  );
};

export const OpenMenu: Story = {
  render: () => <OpenMenuTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "The menu shown on first render (`isOpen`): the link keeps its highlighted background and the chevron points up while the menu is open. Clicking outside or picking an entry closes it.",
      },
      source: {
        code: `<LinkWithDropdown data={items} withExpander isOpen>
  Open Link
</LinkWithDropdown>`,
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
          gap: "16px",
          "--link-with-dropdown-color": "#7c3aed",
          "--link-with-dropdown-bg": "#f5f3ff",
          "--link-with-dropdown-hover-color": "#5b21b6",
          "--link-with-dropdown-hover-bg": "#ddd6fe",
          "--link-with-dropdown-disabled-color": "#c4b5fd",
          "--link-with-dropdown-radius": "8px",
          "--link-with-dropdown-padding": "6px 12px",
        } as CSSProperties
      }
    >
      <LinkWithDropdown
        data={dropdownItems}
        fontSize="13px"
        withExpander
        directionY="bottom"
        fixedDirection
        isDefaultMode={false}
      >
        Customized Link
      </LinkWithDropdown>
      <LinkWithDropdown data={dropdownItems} fontSize="13px" isDisabled>
        Disabled Link
      </LinkWithDropdown>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `CSS Custom Properties for external customization:

| Variable | Description | Default |
|----------|-------------|---------|
| \`--link-with-dropdown-color\` | Text and chevron color; the chevron keeps it on hover and while open | theme-based |
| \`--link-with-dropdown-bg\` | Background of the closed link | \`transparent\` |
| \`--link-with-dropdown-hover-color\` | Text color on hover and while the menu is open | theme-based |
| \`--link-with-dropdown-hover-bg\` | Background on hover and while the menu is open | theme-based |
| \`--link-with-dropdown-disabled-color\` | Text color with \`isDisabled\` | theme-based |
| \`--link-with-dropdown-radius\` | Corner radius of the link's background | \`3px\` |
| \`--link-with-dropdown-padding\` | Inner padding around the text | \`4px 8px\` |

The first link shows the text, background, radius and padding variables; hover it or open its menu to see the hover pair. The second, with \`isDisabled\`, is there for \`--link-with-dropdown-disabled-color\`.`,
      },
      source: {
        code: `<div
  style={{
    "--link-with-dropdown-color": "#7c3aed",
    "--link-with-dropdown-bg": "#f5f3ff",
    "--link-with-dropdown-hover-color": "#5b21b6",
    "--link-with-dropdown-hover-bg": "#ddd6fe",
    "--link-with-dropdown-disabled-color": "#c4b5fd",
    "--link-with-dropdown-radius": "8px",
    "--link-with-dropdown-padding": "6px 12px",
  }}
>
  <LinkWithDropdown data={items} withExpander>
    Customized Link
  </LinkWithDropdown>
  <LinkWithDropdown data={items} isDisabled>
    Disabled Link
  </LinkWithDropdown>
</div>`,
      },
    },
  },
};
