import type { CSSProperties, ComponentProps } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

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
      description: {
        component: `A round button fixed to the corner of a phone or tablet screen that opens a menu of creating actions.

### Features

- **Floating Button**: Shows a round plus button that turns into a minus while its menu is open
- **Dropdown Menu**: Opens a menu above the button whose items carry an icon, a label and an optional second line
- **Two Groups**: Draws a second group of items under the first on a background of its own, or on the plain menu background
- **Submenu Support**: Expands an item's nested items in place under it, optionally open from the start
- **Alert Badge**: Marks the closed button with a badge whose click can be reported to the host
- **Single Action Mode**: Calls one click handler instead of opening the menu when the menu is turned off
- **Dismissal**: Closes the menu on a click outside it, on choosing an item and on the browser's Back button

### Accessibility

The component relies on the roles of the parts it is built from:

- **Button name**: The round button is announced as "plus button" while the menu is closed and "minus button" while it is open, in English whatever the interface language
- **Menu roles**: The open menu is announced as a listbox and each item in it as an option

### Usage

\`\`\`tsx
import { MainButtonMobile } from "@onlyoffice/apps-ui-kit/components/main-button-mobile";

// Menu of creating actions
<MainButtonMobile
  actionOptions={[
    { key: "doc", label: "New document", icon: FolderIcon, onClick: ({ action }) => create(action), action: "doc" },
    { key: "folder", label: "New folder", icon: FolderIcon },
  ]}
/>

// A second group under the first
<MainButtonMobile
  actionOptions={actionOptions}
  buttonOptions={[
    { key: "upload", label: "Upload files", icon: FolderIcon, onClick: handleUpload },
  ]}
/>

// One action, no menu
<MainButtonMobile withMenu={false} onClick={handleUpload} />
\`\`\``,
      },
    },
  },
  argTypes: {
    actionOptions: {
      control: "object",
      description:
        "Items of the upper group of the menu. An item with `items` becomes a submenu that expands in place; its handler is called with the item's `action`",
    },
    buttonOptions: {
      control: "object",
      description:
        "Items of the lower group, drawn on a background of their own. An item with `items` becomes a submenu",
    },
    opened: {
      control: "boolean",
      description:
        "Whether the menu is open. The button still toggles it on its own, so it changes back without telling you",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    alert: {
      control: "boolean",
      description:
        "Shows an alert badge on the button while the menu is closed",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    withAlertClick: {
      control: "boolean",
      description: "Whether a click on the alert badge calls `onAlertClick`",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    withMenu: {
      control: "boolean",
      description:
        "Whether the button opens the menu. When off, a click calls `onClick` and the menu never opens",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    withoutButton: {
      control: "boolean",
      description:
        "Draws the lower group on the plain grey background instead of its own blue one; nothing is hidden",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isOpenButton: {
      control: "boolean",
      description:
        "Whether `onClose` is called at all. It then fires on every toggle, including the one that opens the menu",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    manualWidth: {
      control: "text",
      description:
        "Width of the menu as a CSS length, never wider than the window less 48px",
      table: {
        defaultValue: { summary: "400px" },
      },
    },
    dropdownStyle: {
      control: "object",
      description:
        "Inline style of the menu. The height is measured from the items and overrides any height given here",
    },
    style: {
      control: "object",
      description:
        "Inline style of the wrapper that carries the button and the menu, applied after its own z-index",
    },
    className: {
      control: "text",
      description: "Class of the wrapper that carries the button and the menu",
    },
    onClick: {
      action: "onClick",
      description:
        "Called with the click event when the button is clicked, and only while `withMenu` is off",
    },
    onClose: {
      action: "onClose",
      description:
        "Called on every toggle of the menu, opening included, and only while `isOpenButton` is set",
    },
    onAlertClick: {
      action: "onAlertClick",
      description:
        "Called when the alert badge is clicked, and only while `withAlertClick` is set",
    },
    ref: {
      control: false,
      description:
        "Handle exposing `contains(target)` and `getButtonElement()`, for telling whether a click landed on the button",
    },
    title: {
      control: false,
      description:
        "Ignored. Nothing reads this prop; the groups have no heading",
    },
    percent: {
      control: false,
      description:
        "Ignored. Nothing reads this prop; the button draws no progress",
    },
    withButton: {
      control: false,
      description: "Ignored. Nothing reads this prop",
    },
    onUploadClick: {
      control: false,
      description:
        "Ignored. Nothing reads this prop; the button's own handler is `onClick`",
    },
    sectionWidth: {
      control: false,
      description: "Ignored. Nothing reads this prop",
    },
    mainButtonRef: {
      control: false,
      description:
        "Ignored. The component keeps its own element ref; use `ref` to reach the button",
    },
  },
} satisfies Meta<typeof MainButtonMobile>;

type Story = StoryObj<ComponentProps<typeof MainButtonMobile>>;

export default meta;

export const Default: Story = {
  args: {
    opened: false,
    alert: false,
    withMenu: true,
    style: cornerStyle,
    actionOptions,
    buttonOptions,
  },
  parameters: {
    docs: {
      description: {
        story:
          "The button in the corner of the screen with both groups of items. Tap it to open the menu, tap outside or pick an item to close it, and change any other prop live in the Controls panel below.",
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
  args: {
    alert: true,
    withAlertClick: true,
    style: cornerStyle,
    actionOptions,
  },
  parameters: {
    docs: {
      description: {
        story:
          "A badge on the closed button draws attention to something waiting for the user (`alert`). Click the badge to see `onAlertClick` in the Actions panel, which is called only while `withAlertClick` is set; the badge is hidden while the menu is open.",
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
  args: {
    withMenu: false,
    style: cornerStyle,
  },
  parameters: {
    docs: {
      description: {
        story:
          "For a screen with only one thing to create, the button runs that action directly (`withMenu`). Click it to see `onClick` in the Actions panel; no menu opens.",
      },
      source: {
        code: `<MainButtonMobile withMenu={false} onClick={handleUpload} />`,
      },
    },
  },
};

export const CssCustomization: Story = {
  render: () => (
    <div
      style={
        {
          "--main-button-mobile-button-color": "#7c3aed",
          "--main-button-mobile-icon-fill": "#ffffff",
          "--main-button-mobile-badge-size": "14px",
          "--main-button-mobile-badge-offset": "8px",
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
  parameters: {
    docs: {
      description: {
        story: `CSS Custom Properties for external customization:

| Variable | Description | Default |
|----------|-------------|---------|
| \`--main-button-mobile-button-color\` | Button background color | theme-based |
| \`--main-button-mobile-icon-fill\` | Fill of the plus and minus | theme-based |
| \`--main-button-mobile-z-index\` | Stack order of the button against its open menu; below \`202\` the open menu covers the button, so the example leaves it alone | \`1010\` |
| \`--main-button-mobile-badge-size\` | Alert badge size | \`12px\` |
| \`--main-button-mobile-badge-offset\` | Alert badge inset from the button's top trailing corner | \`10px\` |
| \`--main-button-mobile-dropdown-item-padding\` | Padding of one menu item | \`6px 23px\` |
| \`--main-button-mobile-button-options-background-color\` | Background of the lower group of items | theme-based |

One instance, with the alert badge on so the badge variables show. Open the menu to see the item padding and the lower group's background.`,
      },
      source: {
        code: `<div
  style={{
    "--main-button-mobile-button-color": "#7c3aed",
    "--main-button-mobile-icon-fill": "#ffffff",
    "--main-button-mobile-badge-size": "14px",
    "--main-button-mobile-badge-offset": "8px",
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
