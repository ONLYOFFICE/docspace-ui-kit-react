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
        "Text or node shown in the item; a string also becomes the hover title",
    },
    icon: {
      control: "text",
      description:
        "Icon before the label: a component or element rendered as given, or a URL — a path with `.svg` or `images/` is inlined, anything else becomes an image",
    },
    disabled: {
      control: "boolean",
      description:
        "Greys the item out and stops `onClick`; inside `DropDown` the item is dropped from the list unless `showDisabledItems` is set",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isSeparator: {
      control: "boolean",
      description:
        "Renders a one-pixel line between items instead of any content",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isHeader: {
      control: "boolean",
      description:
        "Renders a taller, non-clickable section title with a line under it",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isSelected: {
      control: "boolean",
      description:
        "Marks the item as the current choice: sets `aria-selected` and calls `onClickSelectedItem` on click; it is highlighted only while also disabled",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isSubMenu: {
      control: "boolean",
      description:
        "Shows an arrow at the end of the row; it points the other way in right-to-left and turns down with `isActive`",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isModern: {
      control: "boolean",
      description: "Narrows the side padding of the row to 8px",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    noHover: {
      control: "boolean",
      description: "Keeps the background unchanged under the pointer",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    noActive: {
      control: "boolean",
      description: "Keeps the background unchanged while the item is pressed",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    withToggle: {
      control: "boolean",
      description:
        "Shows a switch at the end of the row; changing it calls `onClick`",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    checked: {
      control: "boolean",
      description: "Whether the switch shown by `withToggle` is on",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isBeta: {
      control: "boolean",
      description:
        "Shows a beta badge at the end of the row, labelled by `betaLabel`",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isPaidBadge: {
      control: "boolean",
      description:
        "Shows a paid badge at the end of the row, labelled by `badgeLabel` or `paidLabel`",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    textOverflow: {
      control: "boolean",
      description:
        "Cuts the whole row off with an ellipsis when it is wider than the item",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    fillIcon: {
      control: "boolean",
      description:
        "Recolours an icon given as a URL to the item's icon colour; off, the icon keeps its own colours",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    isActiveDescendant: {
      control: "boolean",
      description:
        "Paints the item with the hover background as the one keyboard navigation is on; ignored while disabled",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    minWidth: {
      control: "text",
      description: "Minimum width of the item, as a CSS length",
    },
    onClick: {
      action: "clicked",
      description:
        "Called on a click on the item and on a change of its switch; not called while disabled",
    },
    isActive: {
      control: "boolean",
      description:
        "Highlights the item with the selected background; on a submenu entry it also turns the arrow down",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    withoutIcon: {
      control: "boolean",
      description: "Hides the icon even when `icon` is set",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    withHeaderArrow: {
      control: "boolean",
      description: "Shows a back arrow before the label of a header item",
    },
    headerArrowAction: {
      action: "headerArrowAction",
      description: "Called when the back arrow of a header item is clicked",
    },
    children: {
      control: false,
      description:
        "Content of the item, rendered only when `label` is empty — never next to it",
    },
    additionalElement: {
      control: false,
      description: "Element placed at the end of the row, after the label",
    },
    description: {
      control: "text",
      description:
        "Second line under the label, always visible; the item grows to fit it",
    },
    truncateText: {
      control: "boolean",
      description:
        "Cuts the label alone off with an ellipsis, so the elements at the end of the row stay visible",
    },
    betaLabel: {
      control: "text",
      description:
        "Text of the beta badge, used instead of the host's own constant",
    },
    paidLabel: {
      control: "text",
      description:
        "Text of the paid badge, used instead of the translated default",
    },
    badgeLabel: {
      control: "text",
      description: "Text of the paid badge; takes precedence over `paidLabel`",
    },
    withExternalLink: {
      control: "boolean",
      description:
        "Shows an external-link icon at the end of the row, when `externalLinkPath` is also set",
    },
    externalLinkPath: {
      control: "text",
      description:
        "Must be non-empty for the external-link icon to show; the item does not navigate to it itself",
    },
    onExternalLinkClick: {
      action: "onExternalLinkClick",
      description:
        "Called when the external-link icon is clicked, without calling `onClick`",
    },
    onClickSelectedItem: {
      action: "onClickSelectedItem",
      description: "Called when an item with `isSelected` is clicked",
    },
    onMouseDown: {
      action: "onMouseDown",
      description: "Called when a mouse button is pressed on the item",
    },
    stopMouseDownPropagation: {
      control: "boolean",
      description:
        "Keeps a mouse press on the item from reaching the page, so a menu that closes on an outside press stays open until the click",
    },
    setOpen: {
      action: "setOpen",
      description:
        "Called with `false` after every click, disabled ones included, so the enclosing menu can close",
    },
    tooltip: {
      control: "text",
      description:
        "Hint shown on a touch device when a disabled item is tapped; needs `RootTooltip` mounted",
    },
    tabIndex: {
      control: "number",
      description:
        "Position in the Tab order; the default keeps the item off it",
      table: {
        defaultValue: { summary: "-1" },
      },
    },
    height: {
      control: "number",
      description:
        "Height in pixels the enclosing `DropDown` reserves for the item in its list; the item's own height does not follow it",
    },
    heightTablet: {
      control: "number",
      description: "The same as `height`, used on a tablet-width window",
    },
    className: {
      control: "text",
      description: "Class name added to the item",
    },
    style: {
      control: "object",
      description: "Inline styles of the item",
    },
    id: {
      control: "text",
      description: "Id of the item element",
    },
    testId: {
      control: "text",
      description: "Value of `data-testid` on the item",
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
        story:
          "A plain item with a label, the row a menu is made of; change any other prop live in the Controls panel below.",
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
          "The building blocks of a menu, top to bottom: **Header Item** — a section title with a line under it (`isHeader`); **Regular Item** and **With Icon** — plain rows, with and without an icon (`icon`); a separator line (`isSeparator`); **Selected Item** — the current choice, highlighted (`isActive`) and announced as selected (`isSelected`); **Disabled Item** — greyed out and not clickable (`disabled`).",
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
          "A menu entry that switches an option on and off in place, without opening a dialog: **Toggle Off** and **Toggle On** show both positions (`withToggle`, `checked`); a change of the switch calls `onClick`.",
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
          "Badges tell the reader before clicking that an entry is new or needs a paid plan: **New Feature** carries a beta badge (`isBeta`, `betaLabel`), **Premium Feature** a paid one (`isPaidBadge`, `paidLabel`).",
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
          "An arrow at the end of the row tells the reader the entry leads to more options: **Open Submenu** shows it pointing sideways (`isSubMenu`), **Active Submenu** — the entry whose submenu is open — highlighted with the arrow turned down (`isActive`).",
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
          "Any element can sit at the end of the row, such as the keyboard shortcut of a command: **Save** and **Copy** show theirs on the right (`additionalElement`).",
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
          "A nested menu level needs a way back: **Header with Back** shows an arrow before the title (`isHeader`, `withHeaderArrow`); click it to see `headerArrowAction` in the Actions panel.",
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
    // The icon is the only link inside the row's option.
    const option = canvas.getByRole("option", { name: "Help center" });
    const external = option.querySelector("a") as HTMLElement;
    await userEvent.click(external);
    await expect(args.onExternalLinkClick).toHaveBeenCalledTimes(1);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
  parameters: {
    docs: {
      description: {
        story:
          "An entry can carry a second target at its end: **Help center** shows an external-link icon (`withExternalLink`, `externalLinkPath`); click the icon to see `onExternalLinkClick` in the Actions panel while `onClick` stays silent, and open the link from that callback yourself.",
      },
      source: {
        code: `<DropDownItem
  label="Help center"
  icon={SettingsIcon}
  withExternalLink
  externalLinkPath="https://example.com/help"
  onExternalLinkClick={() => window.open(helpUrl, "_blank")}
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
          'The same rows under a right-to-left interface: the icons move to the right of the labels, and the submenu arrow and the switch move to the left end, the arrow mirrored to point left. The direction comes from the theme\'s `interfaceDirection` (the Direction toolbar); the wrapper also carries `dir="rtl"` for the rules that read the DOM direction.',
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
      style={
        {
          position: "relative",
          height: "20px",
          width: "240px",
          "--drop-down-item-color": "#4c1d95",
          "--drop-down-item-icon-fill": "#7c3aed",
          "--drop-down-item-hover-bg": "#ede9fe",
          "--drop-down-item-divider": "#c4b5fd",
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
  ),
  parameters: {
    docs: {
      description: {
        story: `Every overridable variable set on one wrapper -- the variables are listed under CSS variables on this page. **Header** shows the header height, font size and the line under it, **Custom Item** and **Another Item** the text and icon colors, row height, font and padding — hover them for the hover background — the separator its color, and **Disabled Item** the disabled text color (\`showDisabledItems\` keeps it in the list).`,
      },
    },
  },
};
