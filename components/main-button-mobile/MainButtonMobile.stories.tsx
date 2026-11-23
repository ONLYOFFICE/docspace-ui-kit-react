import type { CSSProperties, ComponentProps } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen, waitFor } from "storybook/test";

import CatalogFolderReactSvgUrl from "../../assets/icons/16/catalog.folder.react.svg?url";

import { MainButtonMobile } from ".";

const cornerStyle: CSSProperties = {
  position: "fixed",
  bottom: "24px",
  insetInlineEnd: "24px",
};

const actionOptions = [
  {
    key: "1",
    label: "New document",
    icon: CatalogFolderReactSvgUrl,
  },
  {
    key: "2",
    label: "New presentation",
    icon: CatalogFolderReactSvgUrl,
    onClick: fn().mockName("New presentation"),
  },
  {
    key: "3",
    label: "New spreadsheet",
    icon: CatalogFolderReactSvgUrl,
  },
  {
    key: "4",
    label: "New folder",
    icon: CatalogFolderReactSvgUrl,
  },
];

const buttonOptions = [
  {
    key: "1",
    label: "Upload files",
    icon: CatalogFolderReactSvgUrl,
  },
  {
    key: "2",
    label: "Upload folder",
    icon: CatalogFolderReactSvgUrl,
  },
];

const meta = {
  title: "UI/Interactive elements/MainButtonMobile",
  component: MainButtonMobile,
  parameters: {
    layout: "fullscreen",
    docs: {
      // The button and its menu are position: fixed; each story needs a window of its own on Docs.
      story: { inline: false, height: "500px" },
      // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
      // there is no second description to keep in step with it.
    },
  },
  argTypes: {
    actionOptions: {
      // The icons are data URIs too long to edit, and they stretch the table.
      control: false,
      description:
        "Items of the upper group of the menu. An item with `items` becomes a submenu.",
    },
    buttonOptions: {
      // The icons are data URIs too long to edit, and they stretch the table.
      control: false,
      description:
        "Items of the lower group, drawn on a background of its own. An item with `items` becomes a submenu.",
    },
    opened: {
      control: "boolean",
      description:
        "Whether the menu is open, copied into state whenever it changes. The button, the backdrop, an item, Escape and Back change that state too, reported through `onOpen` and `onClose`.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    alert: {
      control: "boolean",
      description:
        "Whether the alert badge is drawn over the button. It is hidden while the menu is open.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    withAlertClick: {
      control: "boolean",
      description:
        'Whether the alert badge is a button (named "Alert") that calls `onAlertClick`. Without it the badge is an image.',
      table: {
        defaultValue: { summary: "false" },
      },
    },
    withMenu: {
      control: "boolean",
      description:
        "Whether the button opens the menu. When `false` it calls `onClick` and the menu never opens.",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    withoutButton: {
      control: "boolean",
      description:
        "Whether the lower group takes the plain wrapper background instead of the accent one.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    manualWidth: {
      control: "text",
      description: "Width of the menu, as a CSS length.",
      table: {
        defaultValue: { summary: "400px" },
      },
    },
    dropdownStyle: {
      control: "object",
      description:
        "Merged into the menu's inline style. The measured height is applied after it and wins.",
    },
    style: {
      control: "object",
      description:
        "Merged into the wrapper's inline style, after the z-index the component sets itself.",
    },
    className: {
      control: "text",
      description:
        "Applied to the wrapper that carries the button and the menu.",
    },
    onClick: {
      action: "onClick",
      description:
        "Called with the event when the button is clicked or pressed with Enter or Space, and only while `withMenu` is `false`.",
    },
    onOpen: {
      action: "onOpen",
      description:
        "Called when the button opens the menu. Handle it with `onClose` to keep `opened` in step.",
    },
    onClose: {
      action: "onClose",
      description:
        "Called when the menu closes: from the button, the backdrop, a chosen item, Escape or the browser's Back. Not called on opening.",
    },
    onAlertClick: {
      action: "onAlertClick",
      description:
        "Called when the alert badge is clicked or pressed, and only while `withAlertClick` is set.",
    },
    ref: {
      control: false,
      description:
        "Handle exposing `contains` and `getButtonElement`, for deciding whether a click landed on the button.",
    },
  },
  args: {
    onClick: fn(),
    onAlertClick: fn(),
    onOpen: fn(),
    onClose: fn(),
  },
} satisfies Meta<typeof MainButtonMobile>;

type Story = StoryObj<ComponentProps<typeof MainButtonMobile>>;

export default meta;

// The plus icon turns into a minus while the menu is open.
const expectOpen = async (open: boolean) =>
  waitFor(() =>
    expect(
      screen.getByTestId(open ? "icon-minus" : "icon-plus"),
    ).toBeInTheDocument(),
  );

// The badge has no test id; its SVG is found through its wrapper's module
// class.
const getAlertBadge = () =>
  screen
    .getByTestId("main-button-mobile")
    .querySelector<SVGElement>('[class*="wrapperAlertIcon"] svg');

export const Default: Story = {
  args: {
    opened: false,
    alert: false,
    withMenu: true,
    style: cornerStyle,
    actionOptions,
    buttonOptions,
  },
  play: async ({ args, canvas, userEvent }) => {
    const button = canvas.getByTestId("floating-button");
    await expectOpen(false);
    await expect(button).toHaveAttribute("aria-haspopup", "menu");
    await expect(button).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(button);
    await expectOpen(true);
    await expect(button).toHaveAttribute("aria-expanded", "true");
    // Opening is reported, and is not a close.
    await expect(args.onOpen).toHaveBeenCalledTimes(1);
    await expect(args.onClose).not.toHaveBeenCalled();
    // Both groups are listed, as a menu of actions.
    await expect(await screen.findByText("New document")).toBeVisible();
    await expect(screen.getByText("Upload files")).toBeVisible();
    await expect(screen.getByRole("menu")).toBeInTheDocument();

    // Picking an item runs its handler and closes the menu.
    await userEvent.click(screen.getByText("New presentation"));
    await expect(actionOptions[1].onClick).toHaveBeenCalledTimes(1);
    await expectOpen(false);
    await expect(args.onClose).toHaveBeenCalledTimes(1);

    // A click on the backdrop closes it too.
    await userEvent.click(button);
    await expectOpen(true);
    await userEvent.click(screen.getByTestId("backdrop"));
    await expectOpen(false);
    await expect(args.onClose).toHaveBeenCalledTimes(2);

    // The keyboard: Enter opens the menu on its first item, the arrows move,
    // Enter chooses, and Escape closes and returns focus to the button.
    button.focus();
    await userEvent.keyboard("{Enter}");
    await expectOpen(true);
    await waitFor(() =>
      expect(
        screen.getByRole("menuitem", { name: /New document/ }),
      ).toHaveFocus(),
    );
    await userEvent.keyboard("{ArrowDown}");
    await expect(
      screen.getByRole("menuitem", { name: /New presentation/ }),
    ).toHaveFocus();
    await userEvent.keyboard("{Escape}");
    await expectOpen(false);
    await expect(button).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expectOpen(true);
    await userEvent.keyboard("{ArrowDown}");
    await userEvent.keyboard("{Enter}");
    await expect(actionOptions[1].onClick).toHaveBeenCalledTimes(2);
    await expectOpen(false);
  },
  parameters: {
    docs: {
      description: {
        story:
          "The button in the corner of the screen, with both groups of items in its menu. A tap or Enter opens the menu; a tap outside, Escape or a chosen item closes it.",
      },
      source: {
        code: `<MainButtonMobile
  style={{ position: "fixed", bottom: "24px", insetInlineEnd: "24px" }}
  actionOptions={actionOptions}
  buttonOptions={buttonOptions}
/>`,
      },
    },
  },
};

export const WithAlert: Story = {
  name: "With alert badge",
  args: {
    alert: true,
    withAlertClick: true,
    style: cornerStyle,
    actionOptions,
  },
  globals: { viewport: { value: "mobile2", isRotated: false } },
  play: async ({ args, canvas, userEvent }) => {
    // With withAlertClick the badge is a named button, reachable by Tab.
    const badge = canvas.getByRole("button", { name: "Alert" });
    await userEvent.click(badge);
    await expect(args.onAlertClick).toHaveBeenCalledTimes(1);
    badge.focus();
    await userEvent.keyboard("{Enter}");
    await expect(args.onAlertClick).toHaveBeenCalledTimes(2);

    // The badge is hidden while the menu is open.
    await userEvent.click(canvas.getByTestId("floating-button"));
    await expectOpen(true);
    await expect(getAlertBadge()).toBeFalsy();
  },
  parameters: {
    docs: {
      description: {
        story:
          "A badge on the closed button draws attention to something waiting for the user (`alert`). With `withAlertClick` it is a button named Alert that calls `onAlertClick`; without it, an image. It is hidden while the menu is open.",
      },
      source: {
        code: `<MainButtonMobile
  alert
  withAlertClick
  onAlertClick={openNotifications}
  actionOptions={actionOptions}
/>`,
      },
    },
  },
};

export const WithSubmenu: Story = {
  name: "With submenu",
  args: {
    opened: true,
    style: cornerStyle,
    actionOptions: [
      {
        key: "form",
        label: "New form",
        icon: CatalogFolderReactSvgUrl,
        openByDefault: true,
        items: [
          { key: "form-blank", label: "From blank", action: "form-blank" },
          {
            key: "form-file",
            label: "From a text file",
            action: "form-file",
          },
        ],
      },
      {
        key: "folder",
        label: "New folder",
        icon: CatalogFolderReactSvgUrl,
        description: "Keeps related files together",
      },
    ],
  },
  play: async ({ userEvent }) => {
    // openByDefault expands the nested items in place.
    await expect(await screen.findByText("From blank")).toBeVisible();
    await expect(
      screen.getByText("Keeps related files together"),
    ).toBeVisible();

    // The parent item folds them away again.
    await userEvent.click(screen.getByText("New form"));
    await waitFor(() => expect(screen.queryByText("From blank")).toBeNull());
  },
  parameters: {
    docs: {
      description: {
        story:
          "Groups related actions under one item without opening a second menu. **New form** opens its nested items in place under it, already expanded (`items`, `openByDefault`); **New folder** carries a second line under its label (`description`).",
      },
      source: {
        code: `<MainButtonMobile
  opened
  actionOptions={[
    {
      key: "form",
      label: "New form",
      icon: FolderIcon,
      openByDefault: true,
      items: [
        { key: "form-blank", label: "From blank", action: "form-blank" },
        { key: "form-file", label: "From a text file", action: "form-file" },
      ],
    },
    { key: "folder", label: "New folder", icon: FolderIcon, description: "Keeps related files together" },
  ]}
/>`,
      },
    },
  },
};

export const WithoutMenu: Story = {
  name: "Without a menu",
  args: {
    withMenu: false,
    style: cornerStyle,
  },
  play: async ({ args, canvas, userEvent }) => {
    // withMenu off: the click calls onClick and no menu opens.
    await userEvent.click(canvas.getByTestId("floating-button"));
    await expect(args.onClick).toHaveBeenCalledTimes(1);
    await expectOpen(false);
  },
  parameters: {
    docs: {
      description: {
        story:
          "For a screen with only one thing to create, the button runs that action directly (`withMenu`). A click calls `onClick`, and no menu opens.",
      },
      source: {
        code: `<MainButtonMobile withMenu={false} onClick={handleUpload} />`,
      },
    },
  },
};

export const CssCustomization: Story = {
  name: "CSS customization",
  render: () => (
    <div
      style={
        {
          "--main-button-mobile-button-color": "#7c3aed",
          "--main-button-mobile-icon-fill": "#ffffff",
          "--main-button-mobile-badge-size": "14px",
          "--main-button-mobile-badge-offset": "4px",
          "--main-button-mobile-dropdown-item-padding": "8px 20px",
          "--main-button-mobile-button-options-background-color": "#5b21b6",
        } as CSSProperties
      }
    >
      <MainButtonMobile
        alert
        actionOptions={actionOptions}
        buttonOptions={buttonOptions}
        style={cornerStyle}
      />
    </div>
  ),
  globals: { viewport: { value: "mobile2", isRotated: false } },
  play: async () => {
    // The size variable sizes the badge's box and the icon inside it.
    const icon = getAlertBadge() as SVGElement;
    const box = icon.parentElement as HTMLElement;
    await expect(getComputedStyle(box).width).toBe("14px");
    await expect(getComputedStyle(box).top).toBe("4px");
    await expect(icon.getBoundingClientRect().width).toBeCloseTo(14, 0);
    // Without withAlertClick the badge is a named image, not a button.
    await expect(icon).toHaveAttribute("role", "img");
    await expect(icon).toHaveAccessibleName("Alert");
  },
  parameters: {
    docs: {
      description: {
        story: `The variables are listed under CSS variables on this page. One instance, with \`alert\` on: the red exclamation mark on the button's rim is the alert badge, there so its size and offset variables show. Open the menu to see the item padding and the lower group's background.`,
      },
      source: {
        code: `<div
  style={{
    "--main-button-mobile-button-color": "#7c3aed",
    "--main-button-mobile-icon-fill": "#ffffff",
    "--main-button-mobile-badge-size": "14px",
    "--main-button-mobile-badge-offset": "4px",
    "--main-button-mobile-dropdown-item-padding": "8px 20px",
    "--main-button-mobile-button-options-background-color": "#5b21b6",
  }}
>
  <MainButtonMobile alert actionOptions={actionOptions} buttonOptions={buttonOptions} />
</div>`,
      },
    },
  },
};
