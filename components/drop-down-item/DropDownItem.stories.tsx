import type { CSSProperties, ComponentProps } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen, within } from "storybook/test";

import SettingsReactSvgUrl from "../../assets/settings.react.svg?url";

import { DropDown } from "../drop-down";
import { DropDownItem } from ".";

const meta = {
  title: "UI/Overlays/DropDownItem",
  component: DropDownItem,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
  },
  argTypes: {
    label: {
      control: "text",
      description:
        "Text of the row. A string also becomes the row's hover tooltip.",
    },
    icon: {
      control: "text",
      description:
        "Icon at the start of the item: a component, an element or a URL. A same-origin `.svg` or an SVG data URL is inlined; any other URL becomes an `<img>`.",
    },
    disabled: {
      control: "boolean",
      description:
        "Stops `onClick` firing and greys the item out. The enclosing `DropDown` also drops disabled items from its list unless `showDisabledItems` is set.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isSeparator: {
      control: "boolean",
      description: "Renders a divider line in place of the label and children.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isHeader: {
      control: "boolean",
      description:
        "Renders the row as a menu title: taller, with a line under it and no hover or pressed look.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isSelected: {
      control: "boolean",
      description:
        "Sets `aria-selected` and sends clicks to `onClickSelectedItem`. It paints the background only on a disabled item.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isSubMenu: {
      control: "boolean",
      description:
        "Draws a trailing arrow for a row that leads to a submenu. It opens nothing by itself.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isModern: {
      control: "boolean",
      description: "Narrows the row's side padding to 8px.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    noHover: {
      control: "boolean",
      description: "Turns off the background on hover.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    noActive: {
      control: "boolean",
      description: "Turns off the background while the row is pressed.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    withToggle: {
      control: "boolean",
      description:
        "Shows a switch at the end of the row; its change calls `onClick`.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    checked: {
      control: "boolean",
      description: "Turns that switch on. It needs `withToggle`.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isBeta: {
      control: "boolean",
      description: "Shows a purple beta badge after the label.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isPaidBadge: {
      control: "boolean",
      description: "Shows a paid-plan badge after the label.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    textOverflow: {
      control: "boolean",
      description:
        "Makes the row a block instead of a flex row, so its own ellipsis applies to a long label.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    fillIcon: {
      control: "boolean",
      description:
        "Paints an inlined SVG icon in the item's icon colour. Off, it keeps its own colours.",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    isActiveDescendant: {
      control: "boolean",
      description:
        "Highlights the row the arrow keys reached, with a ring and the hover background.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    minWidth: {
      control: "text",
      description: "Minimum width of the row, as a CSS length.",
    },
    onClick: {
      action: "clicked",
      description:
        "Called on a click on the item, and on a change of the toggle when `withToggle` is set — hence the event union. It is not called while the item is disabled.",
    },
    isActive: {
      control: "boolean",
      description:
        "Paints the selected background. On a submenu row it also turns the arrow down.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    withoutIcon: {
      control: "boolean",
      description: "Hides the icon even when `icon` is set.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    withHeaderArrow: {
      control: "boolean",
      description:
        "Puts a back arrow before a header's title. It does nothing without `isHeader`.",
    },
    headerArrowAction: {
      action: "headerArrowAction",
      description:
        "Called by a click on the header's back arrow, before the row's own click handling.",
    },
    children: {
      control: false,
      description:
        "Content of the item, used **instead of** `label` — it is rendered only when `label` is empty, not alongside it. `additionalElement` is the one that comes after the label.",
    },
    additionalElement: {
      control: false,
      description:
        "Node at the end of the row, after the badges and the external link.",
    },
    description: {
      control: "text",
      description:
        "Second line under the label, always visible: what choosing the item means. It shows only with a `label`, and the row grows to fit it.",
    },
    truncateText: {
      control: "boolean",
      description:
        "Cuts a long label off with an ellipsis, keeping the rest of the row in place.",
    },
    betaLabel: {
      control: "text",
      description:
        "Text of the beta badge, used instead of the host's own constant.",
    },
    paidLabel: {
      control: "text",
      description:
        "Text of the paid badge, used instead of the translated default. `badgeLabel` wins over it.",
    },
    badgeLabel: {
      control: "text",
      description:
        "Text of the paid badge. It wins over `paidLabel` and the translated default.",
    },
    withExternalLink: {
      control: "boolean",
      description:
        "Shows an external-link icon at the end of the row. It needs `externalLinkPath` as well.",
    },
    externalLinkPath: {
      control: "text",
      description:
        "Address of the external-link icon. It becomes the icon's `href` only together with `onExternalLinkClick`.",
    },
    onExternalLinkClick: {
      action: "onExternalLinkClick",
      description:
        "Called on a plain click of the external-link icon, in place of following the `href`. A middle or modified click is left to the browser.",
    },
    onClickSelectedItem: {
      action: "onClickSelectedItem",
      description:
        "Called on every click of an item marked `isSelected`, a disabled one included.",
    },
    onMouseDown: {
      action: "onMouseDown",
      description: "Called on a mouse press on the row, before the click.",
    },
    stopMouseDownPropagation: {
      control: "boolean",
      description:
        "Keeps a mouse press on the row from reaching the page, so a click-outside handler does not close the menu before the click lands.",
    },
    setOpen: {
      action: "setOpen",
      description:
        "Called with `false` after a click, a disabled item's included, for the enclosing menu to close itself. A disabled item with `tooltip` on a touch device skips it.",
    },
    tooltip: {
      control: "text",
      description:
        "Hint shown when the item is disabled, on a touch device only. It needs `RootTooltip` mounted, and it does nothing on an enabled item or with a pointer.",
    },
    tabIndex: {
      control: "number",
      description:
        "Position in the tab order. The default of -1 keeps the item off it.",
      table: {
        defaultValue: { summary: "-1" },
      },
    },
    height: {
      control: "number",
      description:
        "Height the enclosing `DropDown` reserves for this item in its virtualised list, in pixels. It does not resize the row, and it reaches the DOM as an attribute.",
    },
    heightTablet: {
      control: "number",
      description:
        "The same, used instead of `height` on a tablet-width viewport. Unlike `height`, it stays off the DOM.",
    },
    className: {
      control: "text",
      description: "Extra class name for the row.",
    },
    style: {
      control: "object",
      description: "Inline styles for the row.",
    },
    id: {
      control: "text",
      description: "HTML id of the row.",
    },
    testId: {
      control: "text",
      description: "Value of `data-testid` on the item.",
      table: {
        defaultValue: { summary: '"drop-down-item"' },
      },
    },
  },
} satisfies Meta<typeof DropDownItem>;

type Story = StoryObj<ComponentProps<typeof DropDownItem>>;

export default meta;

const left = (element: Element) => element.getBoundingClientRect().left;

const Wrapper = (props: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        width: "250px",
      }}
    >
      {props.children}
    </div>
  );
};

export const Default: Story = {
  render: (args) => <DropDownItem {...args} />,
  args: {
    label: "Default Item",
    onClick: fn(),
  },
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("option", { name: "Default Item" }));
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
  parameters: {
    docs: {
      description: {
        story: "A plain item with a label, the row a menu is made of.",
      },
      source: {
        code: `<DropDownItem label="Default Item" onClick={handleClick} />`,
      },
    },
  },
};

const WithDescriptionTemplate = () => {
  return (
    <Wrapper>
      <DropDownItem
        label="Editor"
        icon={SettingsReactSvgUrl}
        description="Can edit the document, leave comments and share it with others."
      />
      <DropDownItem
        label="Commenter"
        icon={SettingsReactSvgUrl}
        description="Can read the document and leave comments, but not change its text."
      />
      <DropDownItem
        label="Viewer"
        icon={SettingsReactSvgUrl}
        description="Can only read the document."
      />
    </Wrapper>
  );
};

export const WithDescription: Story = {
  name: "With a description",
  render: () => <WithDescriptionTemplate />,
  play: async ({ canvas }) => {
    // The explanation sits on a line of its own under the label.
    const editor = canvas.getByRole("option", { name: /^Editor/ });
    const label = within(editor).getByText("Editor");
    const description = within(editor).getByText(/^Can edit the document/);
    await expect(description).toBeVisible();
    await expect(
      description.getBoundingClientRect().top,
    ).toBeGreaterThanOrEqual(label.getBoundingClientRect().bottom);
  },
  parameters: {
    docs: {
      description: {
        story:
          "Each item reads as two lines: the label, and under it an always-visible explanation of what choosing it means (`description`). Use it where picking an item has consequences the label alone cannot convey.",
      },
      source: {
        code: `<DropDownItem
  label="Editor"
  icon={SettingsIcon}
  description="Can edit the document, leave comments and share it with others."
/>`,
      },
    },
  },
};

const ItemTypesTemplate = () => {
  return (
    <Wrapper>
      <DropDownItem isHeader label="Header Item" />
      <DropDownItem label="Regular Item" />
      <DropDownItem label="With Icon" icon={SettingsReactSvgUrl} />
      <DropDownItem isSeparator />
      <DropDownItem label="Selected Item" isSelected isActive />
      <DropDownItem label="Disabled Item" disabled />
    </Wrapper>
  );
};

export const ItemTypes: Story = {
  name: "Item kinds",
  render: () => <ItemTypesTemplate />,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("separator")).toBeInTheDocument();
    await expect(
      canvas.getByRole("option", { name: "Selected Item" }),
    ).toHaveAttribute("aria-selected", "true");
    await expect(
      canvas.getByRole("option", { name: "Disabled Item" }),
    ).toHaveAttribute("aria-disabled", "true");
  },
  parameters: {
    docs: {
      description: {
        story:
          "The building blocks of a menu, top to bottom:\n\n- **Header Item** — a section title (`isHeader`).\n- **Regular Item** and **With Icon** — plain rows (`icon`).\n- A separator line (`isSeparator`).\n- **Selected Item** — highlighted (`isActive`) and announced as selected (`isSelected`).\n- **Disabled Item** — greyed out and not clickable (`disabled`).",
      },
      source: {
        code: `<DropDownItem isHeader label="Header Item" />
<DropDownItem label="Regular Item" />
<DropDownItem label="With Icon" icon={SettingsIcon} />
<DropDownItem isSeparator />
<DropDownItem label="Selected Item" isSelected isActive />
<DropDownItem label="Disabled Item" disabled />`,
      },
    },
  },
};

const WithToggleTemplate = () => {
  return (
    <Wrapper>
      <DropDownItem label="Toggle Off" withToggle checked={false} />
      <DropDownItem label="Toggle On" withToggle checked />
    </Wrapper>
  );
};

export const WithToggle: Story = {
  name: "With a switch",
  render: () => <WithToggleTemplate />,
  play: async ({ canvas }) => {
    const toggleOf = (name: string) =>
      within(canvas.getByRole("option", { name })).getByRole("checkbox");
    await expect(toggleOf("Toggle On")).toBeChecked();
    await expect(toggleOf("Toggle Off")).not.toBeChecked();
  },
  parameters: {
    docs: {
      description: {
        story:
          "**Toggle Off** and **Toggle On**: entries that switch an option in place, without a dialog (`withToggle`, `checked`). A change of the switch calls `onClick`.",
      },
      source: {
        code: `<DropDownItem label="Toggle Off" withToggle checked={false} />
<DropDownItem label="Toggle On" withToggle checked />`,
      },
    },
  },
};

const WithBadgesTemplate = () => {
  return (
    <Wrapper>
      <DropDownItem
        label="New Feature"
        icon={SettingsReactSvgUrl}
        isBeta
        betaLabel="Beta"
      />
      <DropDownItem
        label="Premium Feature"
        icon={SettingsReactSvgUrl}
        isPaidBadge
        paidLabel="Pro"
      />
    </Wrapper>
  );
};

export const WithBadges: Story = {
  name: "With badges",
  render: () => <WithBadgesTemplate />,
  play: async ({ canvas }) => {
    await expect(
      within(canvas.getByRole("option", { name: /New Feature/ })).getByText(
        "Beta",
      ),
    ).toBeVisible();
    await expect(
      within(canvas.getByRole("option", { name: /Premium Feature/ })).getByText(
        "Pro",
      ),
    ).toBeVisible();
  },
  parameters: {
    docs: {
      description: {
        story:
          "**New Feature** carries a beta badge (`isBeta`, `betaLabel`), **Premium Feature** a paid one (`isPaidBadge`, `paidLabel`). A badge says before the click that an entry is new or paid.",
      },
      source: {
        code: `<DropDownItem label="New Feature" icon={SettingsIcon} isBeta betaLabel="Beta" />
<DropDownItem label="Premium Feature" icon={SettingsIcon} isPaidBadge paidLabel="Pro" />`,
      },
    },
  },
};

const SubmenuTemplate = () => {
  return (
    <Wrapper>
      <DropDownItem label="Open Submenu" icon={SettingsReactSvgUrl} isSubMenu />
      <DropDownItem
        label="Active Submenu"
        icon={SettingsReactSvgUrl}
        isSubMenu
        isActive
      />
    </Wrapper>
  );
};

export const Submenu: Story = {
  name: "Submenu entries",
  render: () => <SubmenuTemplate />,
  play: async ({ canvas }) => {
    const arrow = (name: string) =>
      canvas
        .getByRole("option", { name })
        .querySelector('[class*="submenuArrow"]') as HTMLElement;
    await expect(arrow("Open Submenu")).toBeVisible();
    await expect(arrow("Open Submenu")).toHaveStyle({ transform: "none" });
    // The open entry's arrow is turned down.
    await expect(arrow("Active Submenu")).toHaveStyle({
      transform: "matrix(0, 1, -1, 0, 0, 0)",
    });
  },
  parameters: {
    docs: {
      description: {
        story:
          "**Open Submenu** ends in a sideways arrow: the entry leads to more options (`isSubMenu`). **Active Submenu**, whose submenu is open, is highlighted with the arrow turned down (`isActive`).",
      },
      source: {
        code: `<DropDownItem label="Open Submenu" icon={SettingsIcon} isSubMenu />
<DropDownItem label="Active Submenu" icon={SettingsIcon} isSubMenu isActive />`,
      },
    },
  },
};

const WithAdditionalElementTemplate = () => {
  return (
    <Wrapper>
      <DropDownItem
        label="Save"
        icon={SettingsReactSvgUrl}
        additionalElement={<span style={{ color: "#999" }}>Ctrl+S</span>}
      />
      <DropDownItem
        label="Copy"
        icon={SettingsReactSvgUrl}
        additionalElement={<span style={{ color: "#999" }}>Ctrl+C</span>}
      />
    </Wrapper>
  );
};

export const WithAdditionalElement: Story = {
  name: "With a trailing element",
  render: () => <WithAdditionalElementTemplate />,
  play: async ({ canvas }) => {
    const save = canvas.getByRole("option", { name: /^Save/ });
    const shortcut = within(save).getByText("Ctrl+S");
    await expect(left(shortcut)).toBeGreaterThan(
      left(within(save).getByText("Save")),
    );
    await expect(
      within(canvas.getByRole("option", { name: /^Copy/ })).getByText("Ctrl+C"),
    ).toBeVisible();
  },
  parameters: {
    docs: {
      description: {
        story:
          "**Save** and **Copy** end in their keyboard shortcuts (`additionalElement`). Any element can sit at the end of the row.",
      },
      source: {
        code: `<DropDownItem label="Save" icon={SettingsIcon} additionalElement={<span>Ctrl+S</span>} />
<DropDownItem label="Copy" icon={SettingsIcon} additionalElement={<span>Ctrl+C</span>} />`,
      },
    },
  },
};

const HeaderWithArrowTemplate = ({
  headerArrowAction,
}: {
  headerArrowAction?: () => void;
}) => {
  return (
    <Wrapper>
      <DropDownItem
        label="Header with Back"
        isHeader
        withHeaderArrow
        headerArrowAction={headerArrowAction}
      />
      <DropDownItem label="Option 1" />
      <DropDownItem label="Option 2" />
    </Wrapper>
  );
};

export const HeaderWithArrow: Story = {
  name: "Header with a back arrow",
  render: (args) => (
    <HeaderWithArrowTemplate headerArrowAction={args.headerArrowAction} />
  ),
  args: { headerArrowAction: fn() },
  play: async ({ args, canvas, userEvent }) => {
    const header = canvas.getByRole("option", { name: "Header with Back" });
    await userEvent.click(header.querySelector("svg") as SVGElement);
    await expect(args.headerArrowAction).toHaveBeenCalledTimes(1);
  },
  parameters: {
    docs: {
      description: {
        story:
          "**Header with Back** has an arrow before the title, the way back from a nested level (`isHeader`, `withHeaderArrow`). A click on the arrow calls `headerArrowAction`.",
      },
      source: {
        code: `<DropDownItem
  label="Header with Back"
  isHeader
  withHeaderArrow
  headerArrowAction={goBack}
/>`,
      },
    },
  },
};

const TextOverflowTemplate = () => {
  return (
    <Wrapper>
      <DropDownItem
        label="This is a very long item label that should trigger text overflow ellipsis when the container is too small"
        textOverflow
        minWidth="200px"
      />
    </Wrapper>
  );
};

export const WithTextOverflow: Story = {
  name: "Long labels",
  render: () => <TextOverflowTemplate />,
  play: async ({ canvas }) => {
    // The row itself cuts the label.
    const row = canvas.getByRole("option");
    await expect(row.scrollWidth).toBeGreaterThan(row.clientWidth);
    await expect(row).toHaveStyle({
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    });
  },
  parameters: {
    docs: {
      description: {
        story:
          "A label longer than the menu is cut off with an ellipsis instead of wrapping or widening the menu (`textOverflow`).",
      },
      source: {
        code: `<DropDownItem label="Very long text..." textOverflow minWidth="200px" />`,
      },
    },
  },
};

export const WithExternalLink: Story = {
  name: "With an external link",
  render: (args) => (
    <Wrapper>
      <DropDownItem {...args} />
    </Wrapper>
  ),
  args: {
    label: "Help center",
    icon: SettingsReactSvgUrl,
    withExternalLink: true,
    externalLinkPath: "https://example.com/help",
    onClick: fn(),
    onExternalLinkClick: fn(),
  },
  play: async ({ args, canvas, userEvent }) => {
    // The icon is a real link: it has the address and a name, and it is
    // reachable with the keyboard.
    const external = canvas.getByRole("link", { name: "Open Help center" });
    await expect(external).toHaveAttribute("href", "https://example.com/help");
    await expect(external).toHaveAttribute("target", "_blank");
    external.focus();
    await expect(external).toHaveFocus();
    // With onExternalLinkClick the plain click is left to the callback.
    await userEvent.click(external);
    await expect(args.onExternalLinkClick).toHaveBeenCalledTimes(1);
    await userEvent.keyboard("{Enter}");
    await expect(args.onExternalLinkClick).toHaveBeenCalledTimes(2);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
  parameters: {
    docs: {
      description: {
        story:
          '**Help center** ends in an external-link icon (`withExternalLink`, `externalLinkPath`), a focusable link named "Open Help center". A plain click on it calls `onExternalLinkClick`, not `onClick`. Without that callback the icon does nothing.',
      },
      source: {
        code: `<DropDownItem
  label="Help center"
  icon={SettingsIcon}
  withExternalLink
  externalLinkPath="https://example.com/help"
  onExternalLinkClick={() => navigate("/help")}
/>`,
      },
    },
  },
};

// Arabic for "Settings", "More options" and "Notifications", escaped to keep the source ASCII.
const RightToLeftTemplate = () => (
  <div dir="rtl">
    <Wrapper>
      <DropDownItem
        label={"\u0627\u0644\u0625\u0639\u062f\u0627\u062f\u0627\u062a"}
        icon={SettingsReactSvgUrl}
      />
      <DropDownItem
        label={
          "\u0627\u0644\u0645\u0632\u064a\u062f \u0645\u0646 \u0627\u0644\u062e\u064a\u0627\u0631\u0627\u062a"
        }
        icon={SettingsReactSvgUrl}
        isSubMenu
      />
      <DropDownItem
        label={"\u0627\u0644\u0625\u0634\u0639\u0627\u0631\u0627\u062a"}
        icon={SettingsReactSvgUrl}
        withToggle
        checked
      />
    </Wrapper>
  </div>
);

export const RightToLeft: Story = {
  name: "Right to left",
  render: () => <RightToLeftTemplate />,
  globals: { direction: "rtl" },
  play: async ({ canvas }) => {
    const [settings, more, notifications] = canvas.getAllByRole("option");
    // The icon on the right of the label, the arrow and the switch at the
    // left end.
    const iconOf = (option: HTMLElement) =>
      option.querySelector('[class*="iconWrapper"]') as Element;
    const label = settings.querySelector('[dir="auto"]') as Element;
    await expect(left(iconOf(settings))).toBeGreaterThan(left(label));
    const arrow = more.querySelector('[class*="submenuArrow"]') as Element;
    await expect(left(arrow)).toBeLessThan(left(iconOf(more)));
    const toggle = within(notifications).getByRole("checkbox");
    await expect(left(toggle)).toBeLessThan(left(iconOf(notifications)));
  },
  parameters: {
    noPadding: true,
    docs: {
      // Framed, so the theme's data-dir="rtl" does not flip the whole Docs page.
      story: { inline: false, height: "130px" },
      description: {
        story:
          'The same rows under a right-to-left interface. The icons sit right of the labels; the submenu arrow and the switch move to the left end, the arrow pointing left. The direction comes from the theme\'s `interfaceDirection`; the wrapper also carries `dir="rtl"`.',
      },
      source: {
        code: `<div dir="rtl">
  <DropDownItem label="..." icon={SettingsIcon} />
  <DropDownItem label="..." icon={SettingsIcon} isSubMenu />
  <DropDownItem label="..." icon={SettingsIcon} withToggle checked />
</div>`,
      },
    },
  },
};

export const CssCustomization: Story = {
  name: "CSS variables",
  play: async () => {
    const custom = screen.getByRole("option", { name: "Custom Item" });
    await expect(custom).toHaveStyle({
      height: "40px",
      color: "rgb(76, 29, 149)",
      fontSize: "14px",
    });
    await expect(screen.getByRole("option", { name: "Header" })).toHaveStyle({
      height: "56px",
    });
    await expect(
      screen.getByRole("option", { name: "Disabled Item" }),
    ).toHaveStyle({ color: "rgb(167, 139, 250)" });
  },
  render: () => (
    <div
      style={{
        height: "240px",
        overflow: "hidden",
        transform: "translateZ(0)",
      }}
    >
      <div
        style={
          {
            position: "relative",
            height: "20px",
            width: "240px",
            "--drop-down-item-color": "light-dark(#4c1d95, #c4b5fd)",
            "--drop-down-item-icon-fill": "#7c3aed",
            "--drop-down-item-hover-bg": "light-dark(#ede9fe, #2a2147)",
            "--drop-down-item-divider": "light-dark(#c4b5fd, #4c3d80)",
            "--drop-down-item-disabled-color": "#a78bfa",
            "--drop-down-item-height": "40px",
            "--drop-down-item-font-size": "14px",
            "--drop-down-item-font-weight": "400",
            "--drop-down-item-padding": "0 20px",
            "--drop-down-item-header-height": "56px",
            "--drop-down-item-header-font-size": "18px",
          } as CSSProperties
        }
      >
        <DropDown
          open
          directionY="bottom"
          fixedDirection
          isDefaultMode={false}
          showDisabledItems
        >
          <DropDownItem isHeader label="Header" />
          <DropDownItem label="Custom Item" icon={SettingsReactSvgUrl} />
          <DropDownItem label="Another Item" icon={SettingsReactSvgUrl} />
          <DropDownItem isSeparator />
          <DropDownItem label="Disabled Item" disabled />
        </DropDown>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `Every overridable variable set on one wrapper.

- **Header** — the header height, font size and the line under it.
- **Custom Item** and **Another Item** — text and icon colours, row height, font, padding and hover background.
- The separator: its colour.
- **Disabled Item** — the disabled text colour; \`showDisabledItems\` keeps it in the list.`,
      },
    },
  },
};
