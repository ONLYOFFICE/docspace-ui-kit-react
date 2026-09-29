import type { CSSProperties, ComponentProps } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import CatalogFolderReactSvgUrl from "../../assets/icons/16/catalog.folder.react.svg?url";

import { MainButton } from ".";

const itemsModel = [
  {
    key: 0,
    label: "New document",
    icon: CatalogFolderReactSvgUrl,
  },
  {
    key: 1,
    label: "New spreadsheet",
    icon: CatalogFolderReactSvgUrl,
  },
  {
    key: 2,
    label: "New presentation",
    icon: CatalogFolderReactSvgUrl,
  },
  {
    key: 3,
    label: "Master form",
    icon: CatalogFolderReactSvgUrl,
    items: [
      {
        key: 4,
        label: "From blank",
      },
      {
        key: 5,
        label: "From an existing text file",
      },
    ],
  },
  {
    key: 6,
    label: "New folder",
    icon: CatalogFolderReactSvgUrl,
  },
  {
    key: 7,
    isSeparator: true,
  },
  {
    key: 8,
    label: "Upload",
    icon: CatalogFolderReactSvgUrl,
  },
];

const meta = {
  title: "UI/Interactive elements/MainButton",
  component: MainButton,
  parameters: {
    docs: {
      description: {
        component: `Main action button with an optional dropdown menu. Typically used as the primary call-to-action in a sidebar or toolbar.

### Features

- **Dropdown Menu**: Built-in dropdown with configurable menu items
- **Nested Items**: Support for sub-menus within dropdown items
- **Separators**: Visual dividers between menu item groups
- **Icon Support**: Each menu item can have its own icon
- **Disabled State**: Dims the button to 60% opacity and drops the click, so the menu does not open and no callback runs
- **Action Callback**: Direct click handler when used without dropdown
- **Item Descriptions**: Lays out items that carry a description on two lines and lets the menu grow wider than the button to fit them
- **Hidden Arrow**: Leaves out the arrow beside the text while a click still opens the menu

### Usage

\`\`\`tsx
import { MainButton } from "@onlyoffice/apps-ui-kit/components/main-button";

// With dropdown menu
<MainButton
  text="Create new"
  model={[
    { key: 0, label: "New document", icon: FolderIcon },
    { key: 1, label: "New folder", icon: FolderIcon },
    { key: 2, isSeparator: true },
    { key: 3, label: "Upload", icon: FolderIcon },
  ]}
/>

// As a simple action button
<MainButton text="Click Me" isDropdown={false} onAction={handleClick} />
\`\`\``,
      },
    },
  },
  argTypes: {
    text: {
      control: "text",
      description:
        "Text drawn in the button. It is the whole label: the component takes no children",
      table: {
        defaultValue: { summary: '"Button"' },
      },
    },
    isDisabled: {
      control: "boolean",
      description:
        "Whether the button is inert: it dims to 60% opacity and a click neither opens the menu nor calls `onAction`",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isDropdown: {
      control: "boolean",
      description:
        "Whether a click opens the menu built from `model`, with an arrow beside the text. When off, the click calls `onAction` instead",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    opened: {
      control: false,
      description:
        "Ignored. Nothing reads this prop, and it reaches the button's element as an unknown attribute",
    },
    onAction: {
      action: "onAction",
      description:
        "Called with the click event when the button is clicked. Only reached while `isDropdown` is off",
    },
    model: {
      // The icons are data URIs too long to edit, and they stretch the table.
      control: false,
      description:
        "Items of the menu: a label with an optional icon and description, a separator, or a nested list under `items`. Required even when `isDropdown` is off and nothing reads it",
    },
    hideArrow: {
      control: "boolean",
      description:
        "Whether the arrow beside the text is left out. A click still opens the menu",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    className: {
      control: "text",
      description:
        "Class added to the button, after the component's own classes",
    },
    id: {
      control: "text",
      description: "Id of the button, not of the wrapper around it",
    },
    style: {
      control: "object",
      description: "Inline style of the button",
    },
    setRefMap: {
      control: false,
      description:
        "Called on mount and on every window resize with a key and the button's element, so a host can find the button, for example to point a guided tour at it",
    },
    anchorRef: {
      control: false,
      description:
        "Element the menu opens under and takes its width from. Without it the button's own box is used; pass an outer wrapper when the button sits inside a larger clickable area",
    },
  },
} satisfies Meta<typeof MainButton>;

type Story = StoryObj<ComponentProps<typeof MainButton>>;

export default meta;

const Wrapper = (props: { children: React.ReactNode }) => {
  return <div style={{ maxWidth: "210px" }}>{props.children}</div>;
};

export const Default: Story = {
  render: (args) => (
    <Wrapper>
      <MainButton {...args} />
    </Wrapper>
  ),
  args: {
    text: "Main Button",
    model: itemsModel,
  },
  parameters: {
    docs: {
      description: {
        story:
          "The button with its menu: click it to open the list of things to create, then change any other prop live in the Controls panel below.",
      },
      source: {
        code: `<MainButton text="Main Button" model={itemsModel} />`,
      },
    },
  },
};

const DisabledTemplate = () => {
  return (
    <Wrapper>
      <MainButton
        text="Disabled Button"
        isDisabled
        isDropdown={false}
        model={[]}
      />
    </Wrapper>
  );
};

export const Disabled: Story = {
  render: () => <DisabledTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "MainButton in a disabled state. The button cannot be interacted with and appears with reduced opacity.",
      },
      source: {
        code: `<MainButton text="Disabled Button" isDisabled isDropdown={false} model={[]} />`,
      },
    },
  },
};

const DisabledWithDropdownTemplate = () => {
  return (
    <div style={{ maxWidth: "310px" }}>
      <MainButton
        text="Disabled with Dropdown"
        isDropdown
        isDisabled
        model={itemsModel}
      />
    </div>
  );
};

export const DisabledWithDropdown: Story = {
  render: () => <DisabledWithDropdownTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "MainButton with a dropdown menu in a disabled state. Both the button and dropdown are non-interactive.",
      },
      source: {
        code: `<MainButton text="Disabled with Dropdown" isDropdown isDisabled model={itemsModel} />`,
      },
    },
  },
};

export const WithAction: Story = {
  render: (args) => (
    <Wrapper>
      <MainButton {...args} />
    </Wrapper>
  ),
  args: {
    text: "Click Me",
    isDropdown: false,
    model: [],
    onAction: fn(),
  },
  parameters: {
    docs: {
      description: {
        story:
          "For a single action that needs no menu: the button has no arrow, and a click is reported in the Actions panel instead of opening a list (`isDropdown={false}`, `onAction`).",
      },
      source: {
        code: `<MainButton text="Click Me" isDropdown={false} model={[]} onAction={handleClick} />`,
      },
    },
  },
};

const describedItemsModel = [
  {
    key: 0,
    label: "Blank document",
    icon: CatalogFolderReactSvgUrl,
    description: "Start from an empty page and add the content yourself.",
  },
  {
    key: 1,
    label: "From template",
    icon: CatalogFolderReactSvgUrl,
    description:
      "Pick a ready-made layout from the gallery and fill in its fields.",
  },
  {
    key: 2,
    label: "Upload file",
    icon: CatalogFolderReactSvgUrl,
    description: "Add a file from your device to the current folder.",
  },
];

const WithItemDescriptionsTemplate = () => {
  return (
    <Wrapper>
      <MainButton text="Create" model={describedItemsModel} />
    </Wrapper>
  );
};

export const WithItemDescriptions: Story = {
  render: () => <WithItemDescriptionsTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "For choices that need a word of explanation: click the button and each item shows its label with a description under it, while the menu grows wider than the button to fit the text (`description` on the items of `model`).",
      },
      source: {
        code: `<MainButton
  text="Create"
  model={[
    {
      key: 0,
      label: "Blank document",
      icon: FolderIcon,
      description: "Start from an empty page and add the content yourself.",
    },
    {
      key: 1,
      label: "From template",
      icon: FolderIcon,
      description: "Pick a ready-made layout from the gallery and fill in its fields.",
    },
  ]}
/>`,
      },
    },
  },
};

const WithDropdownTemplate = () => {
  return (
    <Wrapper>
      <MainButton text="Create new" model={itemsModel} />
    </Wrapper>
  );
};

export const WithDropdown: Story = {
  render: () => <WithDropdownTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "MainButton with a full dropdown menu including icons, nested sub-menus, and separators. Click the button to see the dropdown.",
      },
      source: {
        code: `<MainButton
  text="Create new"
  model={[
    { key: 0, label: "New document", icon: FolderIcon },
    { key: 1, label: "New spreadsheet", icon: FolderIcon },
    { key: 2, label: "New presentation", icon: FolderIcon },
    { key: 3, label: "Master form", icon: FolderIcon, items: [
      { key: 4, label: "From blank" },
      { key: 5, label: "From an existing text file" },
    ]},
    { key: 6, label: "New folder", icon: FolderIcon },
    { key: 7, isSeparator: true },
    { key: 8, label: "Upload", icon: FolderIcon },
  ]}
/>`,
      },
    },
  },
};

export const WithoutArrow: Story = {
  render: (args) => (
    <Wrapper>
      <MainButton {...args} />
    </Wrapper>
  ),
  args: {
    text: "Create new",
    model: itemsModel,
    hideArrow: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "For a button whose label alone says it opens a list: the arrow beside the text is gone, yet a click still opens the same menu (`hideArrow`).",
      },
      source: {
        code: `<MainButton text="Create new" model={itemsModel} hideArrow />`,
      },
    },
  },
};

// Framed on Docs, tall enough for the open menu: the theme provider stamps data-dir on <html>, which would flip the whole page.
export const RightToLeft: Story = {
  render: (args) => (
    <div dir="rtl">
      <Wrapper>
        <MainButton {...args} />
      </Wrapper>
    </div>
  ),
  args: {
    text: "\u062c\u062f\u064a\u062f",
    model: itemsModel,
  },
  globals: { direction: "rtl" },
  parameters: {
    noPadding: true,
    docs: {
      story: { inline: false, height: "304px" },
      description: {
        story:
          'The button in a right-to-left layout: the text moves to the right edge and the arrow to the left; click it and the menu opens with its icons on the right and the sub-menu chevron on the left. The wrapper carries `dir="rtl"`; the direction also comes from the theme\'s `interfaceDirection` (the Direction toolbar).',
      },
      source: {
        code: `<div dir="rtl">
  <MainButton text="\u062c\u062f\u064a\u062f" model={itemsModel} />
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
          "--main-button-bg": "#0082c9",
          "--main-button-color": "#ffffff",
          "--main-button-icon-color": "#ffffff",
          "--main-button-radius": "50px",
          "--main-button-text-size": "14px",
          "--main-button-text-weight": "600",
          "--main-button-text-line-height": "24px",
          "--main-button-inner-padding": "6px 20px",
        } as CSSProperties
      }
    >
      <Wrapper>
        <MainButton text="New" model={itemsModel} />
      </Wrapper>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `CSS Custom Properties for external customization:

| Variable | Description | Default |
|----------|-------------|---------|
| \`--main-button-bg\` | Button background color | theme-based (accent) |
| \`--main-button-color\` | Button text color | \`#ffffff\` |
| \`--main-button-icon-color\` | Arrow fill color | \`#ffffff\` |
| \`--main-button-radius\` | Border radius | \`3px\` |
| \`--main-button-inner-padding\` | Button padding | \`5px 14px 5px 12px\` |
| \`--main-button-text-size\` | Font size | \`16px\` |
| \`--main-button-text-weight\` | Font weight | \`700\` |
| \`--main-button-text-line-height\` | Line height | \`22px\` |

The example sets every variable on a wrapper around one button; click it to see the menu keep the button's new width.`,
      },
      source: {
        code: `<div
  style={{
    "--main-button-bg": "#0082c9",
    "--main-button-color": "#ffffff",
    "--main-button-icon-color": "#ffffff",
    "--main-button-radius": "50px",
    "--main-button-text-size": "14px",
    "--main-button-text-weight": "600",
    "--main-button-text-line-height": "24px",
    "--main-button-inner-padding": "6px 20px",
  }}
>
  <MainButton text="New" model={itemsModel} />
</div>`,
      },
    },
  },
};
