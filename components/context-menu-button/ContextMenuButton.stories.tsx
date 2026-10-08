import type { ComponentProps, CSSProperties } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen, waitFor } from "storybook/test";

import VerticalDotsReactSvgUrl from "../../assets/icons/16/vertical-dots.react.svg?url";

import type { ContextMenuModel } from "../context-menu";

import { ContextMenuButton } from ".";
import { ContextMenuButtonDisplayType } from "./ContextMenuButton.enums";

const onOption2 = fn().mockName("Option 2");

const menuData: ContextMenuModel[] = [
  { key: "key1", label: "Option 1", onClick: fn().mockName("Option 1") },
  { key: "key2", label: "Option 2", onClick: onOption2 },
  { key: "key3", label: "Option 3", onClick: fn().mockName("Option 3") },
  { key: "key4", isSeparator: true },
  {
    key: "key5",
    label: "Delete",
    disabled: false,
    onClick: fn().mockName("Delete"),
  },
];

function getMenuData() {
  return menuData;
}

const meta = {
  title: "UI/Interactive elements/ContextMenuButton",
  component: ContextMenuButton,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
  },
  argTypes: {
    title: {
      control: "text",
      description:
        "Tooltip text shown on hover over the icon; it appears only where the app mounts `RootTooltip`",
      table: {
        defaultValue: { summary: '""' },
      },
    },
    size: {
      control: { type: "number", min: 12, max: 32 },
      description: "Specifies the icon size",
      table: {
        defaultValue: { summary: "16" },
      },
    },
    isDisabled: {
      control: "boolean",
      description: "Sets the button to a disabled state",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    displayType: {
      control: "select",
      options: Object.values(ContextMenuButtonDisplayType),
      description:
        "`dropdown` opens the menu under the button; `toggle` renders no menu and passes every click to `onClick`; `auto` behaves exactly like `dropdown`",
      table: {
        defaultValue: { summary: "dropdown" },
      },
    },
    directionX: {
      control: "select",
      options: ["left", "right"],
      description: "Horizontal direction for the dropdown",
      table: {
        defaultValue: { summary: "left" },
      },
    },
    directionY: {
      control: "select",
      options: ["top", "bottom", "both"],
      description: "Vertical direction for the dropdown",
    },
    fixedDirection: {
      control: "boolean",
      description: "Fixes the direction of the dropdown (disables auto-flip)",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    displayIconBorder: {
      control: "boolean",
      description:
        "Puts the icon in a rounded 32px box that can carry a border",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isFill: {
      control: "boolean",
      description: "Whether to fill the icon",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    usePortal: {
      control: "boolean",
      description: "Renders the dropdown in a portal",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    color: {
      control: "color",
      description: 'Any CSS colour for the icon, or the literal `"accent"`',
    },
    hoverColor: {
      control: "color",
      description: "Colour of the icon while the pointer is over it",
    },
    clickColor: {
      control: "color",
      description:
        "Colour of the icon while the mouse button is held down on it",
    },
    onClick: {
      action: "onClick",
      description:
        "Called when the button opens the menu in `dropdown` mode (not when it closes it), and in `toggle` mode on every click or Enter/Space instead of opening a menu",
    },
    onClose: {
      action: "onClose",
      description:
        "Called when the menu closes by itself: a click outside it, Escape or Tab",
    },
    opened: {
      control: "boolean",
      description:
        "Opens the menu from outside; changing it opens or closes the menu",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    data: {
      control: false,
      description: "Items of the menu when there is no `getData`",
      table: {
        defaultValue: { summary: "[]" },
      },
    },
    getData: {
      control: false,
      description:
        "Returns the menu items; called each time the menu opens, and used instead of `data` when set",
    },
    iconName: {
      control: "text",
      description:
        "URL of the icon, fetched when the button renders; without it the kit's vertical dots are drawn",
    },
    iconHoverName: {
      control: "text",
      description: "URL of the icon shown while the pointer is over the button",
    },
    iconClickName: {
      control: "text",
      description:
        "URL of the icon shown while the mouse button is held down on it",
    },
    iconOpenName: {
      control: "text",
      description: "URL of the icon shown while the menu is open",
    },
    onMouseEnter: {
      action: "onMouseEnter",
      description: "Called when the pointer enters the icon",
    },
    onMouseLeave: {
      action: "onMouseLeave",
      description: "Called when the pointer leaves the icon",
    },
    onMouseOver: {
      action: "onMouseOver",
      description: "Called when the pointer moves onto the icon",
    },
    onMouseOut: {
      action: "onMouseOut",
      description: "Called when the pointer moves off the icon",
    },
    zIndex: {
      control: "number",
      description: "Stacking order of the menu",
    },
    className: {
      control: "text",
      description: "Class added to the wrapper around the icon and the menu",
    },
    id: {
      control: "text",
      description: "`id` of the wrapper around the icon and the menu",
    },
    style: {
      control: "object",
      description: "Inline style of the wrapper around the icon and the menu",
    },
    dropDownClassName: {
      control: "text",
      description: "Class added to the menu",
    },
    iconClassName: {
      control: "text",
      description: "Class added to the icon",
    },
    columnCount: {
      control: false,
      description: "Ignored; nothing in the menu reads it",
    },
    asideHeader: {
      control: false,
      description: "Ignored; nothing reads it",
    },
    testId: {
      control: "text",
      description: "Value of `data-testid` on the wrapper",
      table: {
        defaultValue: { summary: "context-menu-button" },
      },
    },
  },
} satisfies Meta<typeof ContextMenuButton>;

type Story = StoryObj<ComponentProps<typeof ContextMenuButton>>;

export default meta;

const Wrapper = (props: { children: React.ReactNode }) => {
  return <div style={{ height: "200px" }}>{props.children}</div>;
};

export const Default: Story = {
  render: (args) => (
    <Wrapper>
      <ContextMenuButton {...args} />
    </Wrapper>
  ),
  play: async ({ args, canvas, userEvent }) => {
    // A named menu button, collapsed.
    const icon = canvas.getByRole("button", { name: "Actions" });
    await expect(icon).toHaveAttribute("aria-haspopup", "menu");
    await expect(icon).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(icon);
    await expect(
      screen.getByRole("menuitem", { name: "Option 1" }),
    ).toBeVisible();
    await expect(icon).toHaveAttribute("aria-expanded", "true");
    await expect(screen.getByRole("menu")).toHaveAttribute(
      "id",
      icon.getAttribute("aria-controls"),
    );
    // onClick reports the click that opens the menu.
    await expect(args.onClick).toHaveBeenCalledTimes(1);

    // An item runs its own onClick and closes the menu.
    await userEvent.click(screen.getByRole("menuitem", { name: "Option 2" }));
    await expect(onOption2).toHaveBeenCalledTimes(1);
    await waitFor(() =>
      expect(screen.queryByRole("menuitem", { name: "Option 1" })).toBeNull(),
    );

    // Clicking the dots again opens (onClick) and then closes (no onClick).
    await userEvent.click(icon);
    await userEvent.click(icon);
    await expect(args.onClick).toHaveBeenCalledTimes(2);
    await expect(
      screen.queryByRole("menuitem", { name: "Option 1" }),
    ).toBeNull();

    // A click outside closes it and reports onClose.
    await userEvent.click(icon);
    await expect(
      screen.getByRole("menuitem", { name: "Option 1" }),
    ).toBeVisible();
    await userEvent.click(document.body);
    await waitFor(() => expect(args.onClose).toHaveBeenCalledTimes(1));
    await expect(
      screen.queryByRole("menuitem", { name: "Option 1" }),
    ).toBeNull();

    // The keyboard: Tab to the button, Enter opens the menu on its first
    // item, the arrows move, Enter runs the item and focus comes back.
    await userEvent.tab();
    await expect(icon).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    const first = await screen.findByRole("menuitem", { name: "Option 1" });
    await waitFor(() => expect(first).toHaveFocus());
    await userEvent.keyboard("{ArrowDown}");
    await expect(
      screen.getByRole("menuitem", { name: "Option 2" }),
    ).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(onOption2).toHaveBeenCalledTimes(2);
    await waitFor(() => expect(icon).toHaveFocus());
    await expect(icon).toHaveAttribute("aria-expanded", "false");

    // Escape closes the menu, reports onClose and returns focus.
    await userEvent.keyboard(" ");
    await waitFor(() =>
      expect(screen.getByRole("menuitem", { name: "Option 1" })).toHaveFocus(),
    );
    await userEvent.keyboard("{Escape}");
    await expect(args.onClose).toHaveBeenCalledTimes(2);
    await expect(icon).toHaveFocus();
    await expect(icon).toHaveAttribute("aria-expanded", "false");
  },
  args: {
    title: "Actions",
    displayType: ContextMenuButtonDisplayType.dropdown,
    iconName: VerticalDotsReactSvgUrl,
    size: 16,
    directionX: "right",
    directionY: "bottom",
    fixedDirection: true,
    isDisabled: false,
    data: menuData,
    usePortal: false,
    getData: getMenuData,
    onClick: fn(),
    onClose: fn(),
  },
  parameters: {
    docs: {
      description: {
        story:
          'The row-level "more" button: click the dots, or focus them and press Enter, Space or an arrow key, to open the menu, and click again, press Escape or click outside it to close it. In the open menu the arrow keys move between items and Enter runs one. Change any other prop live in the Controls panel below.',
      },
      source: {
        code: `<ContextMenuButton
  title="Actions"
  iconName={VerticalDotsIcon}
  directionX="right"
  directionY="bottom"
  fixedDirection
  getData={() => menuData}
/>`,
      },
    },
  },
};

const DisabledTemplate = () => {
  return (
    <Wrapper>
      <ContextMenuButton
        title="Actions"
        displayType={ContextMenuButtonDisplayType.dropdown}
        iconName={VerticalDotsReactSvgUrl}
        size={16}
        isDisabled
        data={menuData}
        getData={getMenuData}
      />
    </Wrapper>
  );
};

export const Disabled: Story = {
  render: () => <DisabledTemplate />,
  play: async ({ canvas, userEvent }) => {
    const icon = canvas.getByRole("button", { name: "Actions" });
    await expect(icon).toHaveAttribute("aria-disabled", "true");
    await expect(icon).toHaveAttribute("tabindex", "-1");
    await userEvent.click(icon);
    await expect(screen.queryByRole("menuitem")).toBeNull();
    icon.focus();
    await userEvent.keyboard("{Enter}");
    await expect(screen.queryByRole("menuitem")).toBeNull();
  },
  parameters: {
    docs: {
      description: {
        story:
          "Use it when the actions do not apply to the current item: the icon greys out and a click opens nothing (`isDisabled`).",
      },
      source: {
        code: `<ContextMenuButton
  title="Actions"
  iconName={VerticalDotsIcon}
  isDisabled
  getData={() => menuData}
/>`,
      },
    },
  },
};

const WithIconBorderTemplate = () => {
  return (
    <Wrapper>
      <ContextMenuButton
        title="Actions"
        displayType={ContextMenuButtonDisplayType.dropdown}
        iconName={VerticalDotsReactSvgUrl}
        size={16}
        displayIconBorder
        directionX="right"
        directionY="bottom"
        fixedDirection
        data={menuData}
        getData={getMenuData}
      />
    </Wrapper>
  );
};

export const WithIconBorder: Story = {
  render: () => <WithIconBorderTemplate />,
  play: async ({ canvas }) => {
    // A rounded 32px box around the dots; the default theme draws no line.
    const button = canvas.getByTestId("context-menu-button");
    const rect = button.getBoundingClientRect();
    await expect([Math.round(rect.width), Math.round(rect.height)]).toEqual([
      32, 32,
    ]);
    await expect(
      parseFloat(getComputedStyle(button).borderRadius),
    ).toBeGreaterThan(0);
  },
  parameters: {
    docs: {
      description: {
        story:
          "Gives the icon a larger, boxed click target (`displayIconBorder`): the dots sit in a rounded 32px square. The default theme draws no line around it; set `--cmb-border` to add one, as the CSS customization story does.",
      },
      source: {
        code: `<ContextMenuButton
  title="Actions"
  iconName={VerticalDotsIcon}
  displayIconBorder
  getData={() => menuData}
/>`,
      },
    },
  },
};

const CustomColorsTemplate = () => {
  return (
    <Wrapper>
      <div style={{ display: "flex", gap: "24px" }}>
        <ContextMenuButton
          title="Blue"
          displayType={ContextMenuButtonDisplayType.dropdown}
          iconName={VerticalDotsReactSvgUrl}
          size={16}
          color="#2DA7DB"
          hoverColor="#1a8abf"
          directionX="right"
          directionY="bottom"
          fixedDirection
          data={menuData}
          getData={getMenuData}
        />
        <ContextMenuButton
          title="Green"
          displayType={ContextMenuButtonDisplayType.dropdown}
          iconName={VerticalDotsReactSvgUrl}
          size={16}
          color="#4CAF50"
          hoverColor="#388E3C"
          directionX="right"
          directionY="bottom"
          fixedDirection
          data={menuData}
          getData={getMenuData}
        />
        <ContextMenuButton
          title="Red"
          displayType={ContextMenuButtonDisplayType.dropdown}
          iconName={VerticalDotsReactSvgUrl}
          size={16}
          color="#FF5722"
          hoverColor="#D84315"
          directionX="right"
          directionY="bottom"
          fixedDirection
          data={menuData}
          getData={getMenuData}
        />
      </div>
    </Wrapper>
  );
};

export const CustomColors: Story = {
  render: () => <CustomColorsTemplate />,
  play: async ({ canvas }) => {
    // Blue, green and red, in the order they are drawn.
    const colours = [
      "rgb(45, 167, 219)",
      "rgb(76, 175, 80)",
      "rgb(255, 87, 34)",
    ];
    const buttons = canvas.getAllByTestId("context-menu-button");
    for (const [index, colour] of colours.entries()) {
      // The dots are fetched and inlined after mounting.
      const path = await waitFor(() => {
        const found = buttons[index].querySelector("svg path");
        if (!found) throw new Error("The icon has not loaded yet");
        return found;
      });
      await expect(getComputedStyle(path).fill).toBe(colour);
    }
  },
  parameters: {
    docs: {
      description: {
        story:
          "Matches the icon to the surface it sits on: each button has its own colour, and hovering it shows its hover colour (`color`, `hoverColor`). Click any to open its menu.",
      },
      source: {
        code: `<ContextMenuButton title="Blue" iconName={Icon} color="#2DA7DB" hoverColor="#1a8abf" getData={() => menuData} />
<ContextMenuButton title="Green" iconName={Icon} color="#4CAF50" hoverColor="#388E3C" getData={() => menuData} />
<ContextMenuButton title="Red" iconName={Icon} color="#FF5722" hoverColor="#D84315" getData={() => menuData} />`,
      },
    },
  },
};

// usePortal={false} keeps the menu inside the wrapper, so it inherits the variables
const CssCustomizationTemplate = () => {
  return (
    <div
      style={
        {
          "--dropdown-bg": "#e6f3fb",
          "--dropdown-border-style": "1px solid #0082c9",
          "--dropdown-shadow": "0 4px 16px rgba(0, 130, 201, 0.25)",
          "--dropdown-radius": "12px",
          "--dropdown-inner-padding": "4px 0",
          "--cmb-border": "1px solid #0082c9",
          "--cmb-hover-border": "#003f63",
          "--cmb-size": "36px",
          "--cmb-radius": "8px",
          "--cmb-icon-padding": "8px 9px",
        } as CSSProperties
      }
    >
      <Wrapper>
        <ContextMenuButton
          title="Actions"
          iconName={VerticalDotsReactSvgUrl}
          getData={getMenuData}
          data={menuData}
          opened
          displayIconBorder
          usePortal={false}
        />
      </Wrapper>
    </div>
  );
};

export const CssCustomization: Story = {
  render: () => <CssCustomizationTemplate />,
  play: async ({ canvas }) => {
    // opened shows the menu without a click, inline because usePortal is off.
    await expect(
      canvas.getByRole("menuitem", { name: "Option 1" }),
    ).toBeVisible();
  },
  parameters: {
    docs: {
      description: {
        story: `Every overridable variable set on one wrapper -- the variables are listed under CSS variables on this page. The example opens the menu in a bordered box (\`displayIconBorder\`), so every variable is on screen at once; hover the dots to see \`--cmb-hover-border\`. The menu is kept inline (\`usePortal={false}\`): in a portal it leaves the wrapper, so set the \`--dropdown-*\` variables on \`document.body\` instead.`,
      },
      source: {
        code: `<div
  style={{
    "--dropdown-bg": "#e6f3fb",
    "--dropdown-border-style": "1px solid #0082c9",
    "--dropdown-shadow": "0 4px 16px rgba(0, 130, 201, 0.25)",
    "--dropdown-radius": "12px",
    "--dropdown-inner-padding": "4px 0",
    "--cmb-border": "1px solid #0082c9",
    "--cmb-hover-border": "#003f63",
    "--cmb-size": "36px",
    "--cmb-radius": "8px",
    "--cmb-icon-padding": "8px 9px",
  }}
>
  <ContextMenuButton
    title="Actions"
    iconName={VerticalDotsIcon}
    getData={() => menuData}
    opened
    displayIconBorder
    usePortal={false}
  />
</div>`,
      },
    },
  },
};
