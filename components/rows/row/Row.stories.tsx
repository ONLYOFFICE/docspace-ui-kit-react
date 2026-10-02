import type { ComponentProps } from "react";
import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";

import React from "react";
import { fn } from "storybook/test";
import { useArgs } from "storybook/preview-api";

import CatalogFolderReactSvg from "../../../assets/icons/16/catalog.folder.react.svg";
import CatalogFolderReactSvgUrl from "../../../assets/icons/16/catalog.folder.react.svg?url";
import CheckReactSvgUrl from "../../../assets/check.react.svg?url";
import { IconSizeType } from "../../../utils";

import { Avatar, AvatarRole, AvatarSize } from "../../avatar";
import { Badge } from "../../badge";
import { ComboBox, ComboBoxSize, type TOption } from "../../combobox";
import { Text } from "../../text";

import { Row } from ".";
import type { RowItemType, RowProps } from "./Row.types";
import styles from "./row.stories.module.scss";

const meta = {
  title: "UI/Rows/Row",
  component: Row,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
  },
  argTypes: {
    checked: {
      control: "boolean",
      description:
        "Whether the checkbox is ticked. Passing the prop at all is what renders the checkbox: `false` gives an unticked box, leaving it out gives none",
    },
    indeterminate: {
      control: "boolean",
      description:
        "Draws the checkbox half-ticked, for a group that is partly selected",
    },
    isDisabled: {
      control: "boolean",
      description:
        "Greys out the checkbox and stops it from changing; the rest of the row stays clickable and the context menu still opens",
    },
    element: {
      control: "select",
      options: ["", "Avatar", "Icon", "ComboBox"],
      description:
        "Element at the start of the row, such as an avatar or a file icon. Passing the prop at all is what reserves its place",
    },
    mode: {
      control: "select",
      options: ["default", "modern"],
      description:
        "`modern` shows the start element in the checkbox's place and swaps it for the checkbox on hover or once the row is checked; it renders neither unless both `checked` and `element` are passed",
      table: {
        defaultValue: { summary: '"default"' },
      },
    },
    children: {
      control: false,
      description:
        "The row's content, normally a `RowContent`. The context menu's header is built from the `item` prop of this element",
    },
    contextOptions: {
      control: "object",
      description:
        "Items of the context menu. An empty list, or none, leaves an empty space where the three-dot button would be",
    },
    getContextModel: {
      control: false,
      description:
        "Builds the context menu's items at the moment it opens, in place of `contextOptions`",
    },
    data: {
      control: "object",
      description:
        "Any value handed back to `onSelect`. When it holds `contextOptions`, those are the menu's items instead of the row's own",
    },
    contextTitle: {
      control: "text",
      description: "Tooltip shown on hovering the three-dot button",
    },
    badgesComponent: {
      control: false,
      description:
        "Element placed after the content, before `contentElement`, for badges of your own",
    },
    contentElement: {
      control: false,
      description:
        "Element placed after the badges, right before the three-dot button",
    },
    contextButtonSpacerWidth: {
      control: "text",
      description:
        "Meant as the width kept for the three-dot button, as a CSS length; no style reads it at present, so changing it changes nothing on the page",
      table: {
        defaultValue: { summary: '"26px"' },
      },
    },
    inProgress: {
      control: "boolean",
      description:
        "Replaces the checkbox and the start element with a spinner; the content and the three-dot button stay",
    },
    isIndexEditingMode: {
      control: "boolean",
      description:
        "Replaces the three-dot button with an up and a down arrow for moving the row",
    },
    withoutBorder: {
      control: "boolean",
      description: "Removes the one-pixel divider under the row",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isRoom: {
      control: "boolean",
      description:
        "Draws the context menu's header in its room form, with the logo or cover from the content's `item`",
    },
    isArchive: {
      control: "boolean",
      description: "Draws the context menu's header in its archived form",
    },
    badgeUrl: {
      control: "text",
      description: "URL of a badge image shown in the context menu's header",
    },
    className: {
      control: "text",
      description: "Class added to the row element",
    },
    dataTestId: {
      control: "text",
      description: "Value of `data-testid` on the row element",
      table: {
        defaultValue: { summary: '"row"' },
      },
    },
    onSelect: {
      control: false,
      description:
        "Called when the checkbox is clicked, with the new checked state and the row's `data`; on a touch device a tap on the start element in the modern layout calls it with `true`",
    },
    onRowClick: {
      control: false,
      description:
        "Called on a click on the content, and in the default layout on the start element; a click on the checkbox, the badges or the three-dot button does not call it",
    },
    onContextClick: {
      control: false,
      description:
        "Called when the context menu is asked for, with `true` when that was a right-click",
    },
    rowContextClose: {
      control: false,
      description: "Called when the context menu closes",
    },
    onChangeIndex: {
      control: false,
      description:
        "Called with the direction when the up or down arrow of index editing is clicked",
    },
    id: {
      control: false,
      description: "Ignored: nothing reads it and no `id` reaches the page",
    },
    style: {
      control: false,
      description:
        "Ignored: nothing reads it and no inline style reaches the page",
    },
    item: {
      control: false,
      description:
        "Ignored: the context menu's header is read from the content's own `item` prop",
    },
  },
} satisfies Meta<typeof Row>;

type Story = StoryObj<ComponentProps<typeof Row>>;

export default meta;

const elementAvatar = (
  <Avatar
    size={AvatarSize.min}
    role={AvatarRole.user}
    source=""
    userName="Demo Avatar"
  />
);
const elementIcon = (
  <CatalogFolderReactSvg
    className={styles.catalogFolderIcon}
    data-size={IconSizeType.big}
  />
);

const renderElementComboBox = (onSelect?: (option?: TOption) => void) => (
  <ComboBox
    options={[
      {
        key: 1,
        label: "Open",
      },
      { key: 2, icon: CheckReactSvgUrl, label: "Closed" },
    ]}
    onSelect={(option?: TOption) => {
      onSelect?.(option);
    }}
    selectedOption={{
      key: 0,
      label: "",
    }}
    scaled={false}
    size={ComboBoxSize.content}
    isDisabled={false}
  />
);

const defaultContextOptions = [
  {
    key: "key1",
    label: "Edit",
  },
  {
    key: "key2",
    label: "Delete",
  },
];

const Template = ({
  onCheckedChange,
  ...args
}: RowProps & { onCheckedChange?: (checked: boolean) => void }) => {
  const { checked, element } = args;
  const getElementProps = (elementName?: string) =>
    elementName === "Avatar"
      ? { element: elementAvatar }
      : elementName === "Icon"
        ? { element: elementIcon }
        : elementName === "ComboBox"
          ? { element: renderElementComboBox() }
          : {};

  // The Controls-panel `element` argType is a select of option names, not a
  // real ReactElement -- Storybook injects the raw string control value at
  // runtime, overriding the RowProps.element (ReactElement) static type.
  const elementProps = getElementProps(element as unknown as string);
  const checkedProps = { checked };
  // Exclude the raw select-control string from the spread below -- only the
  // resolved ReactElement in `elementProps` should reach <Row>.
  const { element: _elementArg, ...restArgs } = args;
  return (
    <Row
      {...restArgs}
      key="1"
      {...checkedProps}
      {...elementProps}
      contextOptions={args.contextOptions ?? defaultContextOptions}
      onSelect={(value, data) => {
        args.onSelect?.(value, data);
        onCheckedChange?.(value);
      }}
    >
      <Text truncate>Sample text</Text>
    </Row>
  );
};

// The checkbox flips the `checked` arg, so a click ticks and unticks it.
const renderSelectable = (args: RowProps) => {
  const [, updateArgs] = useArgs<RowProps>();

  return (
    <Template
      {...args}
      onCheckedChange={(checked) => updateArgs({ checked })}
    />
  );
};

export const Default: Story = {
  render: renderSelectable,
  args: {
    checked: true,
    isIndexEditingMode: false,
    // Cast: the `element` argType is a Controls-panel select of option
    // names ("Avatar" | "Icon" | "ComboBox"), not a ReactElement -- see
    // Template, which resolves the selected name to the actual element.
    element: "Avatar" as unknown as RowProps["element"],
    contextTitle: "Actions",
    onSelect: fn(),
    onRowClick: fn(),
    onContextClick: fn(),
    rowContextClose: fn(),
  },
  parameters: {
    docs: {
      description: {
        story:
          "The row as a file list shows it: click the checkbox to tick and untick it, click the text, open the menu from the three-dot button or with a right-click anywhere on the row, and watch each call in the Actions panel. Change any other prop live in the Controls panel below.",
      },
      source: {
        code: `<Row
  checked={true}
  isIndexEditingMode={false}
  element={<Avatar size={AvatarSize.min} role={AvatarRole.user} userName="Demo Avatar" />}
  contextTitle="Actions"
  onSelect={(checked) => setChecked(checked)}
  onRowClick={handleRowClick}
  contextOptions={[
    { key: "key1", label: "Edit" },
    { key: "key2", label: "Delete" },
  ]}
>
  <Text truncate>Sample text</Text>
</Row>`,
      },
    },
  },
};

export const ModernLayout: Story = {
  render: renderSelectable,
  args: {
    mode: "modern",
    checked: false,
    element: "Icon" as unknown as RowProps["element"],
    onSelect: fn(),
  },
  parameters: {
    docs: {
      description: {
        story:
          'A row that keeps its start element where the checkbox would be, so an unselected list shows icons rather than a column of empty boxes (`mode="modern"`). Hover the icon and the checkbox takes its place; tick it and the checkbox stays. Both `checked` and `element` have to be passed, or neither is shown.',
      },
      source: {
        code: `<Row
  mode="modern"
  checked={false}
  element={<CatalogFolderReactSvg />}
  onSelect={(checked) => setChecked(checked)}
  contextOptions={contextOptions}
>
  <Text truncate>Sample text</Text>
</Row>`,
      },
    },
  },
};

export const IndeterminateState: Story = {
  render: (args) => <Template {...args} />,
  args: {
    checked: false,
    indeterminate: true,
    element: "Icon" as unknown as RowProps["element"],
  },
  parameters: {
    docs: {
      description: {
        story:
          "A half-ticked checkbox, for a row that stands for a group of which only some items are selected (`indeterminate`).",
      },
      source: {
        code: `<Row checked={false} indeterminate element={<CatalogFolderReactSvg />} contextOptions={contextOptions}>
  <Text truncate>Sample text</Text>
</Row>`,
      },
    },
  },
};

export const DisabledState: Story = {
  render: (args) => <Template {...args} />,
  args: {
    checked: false,
    isDisabled: true,
    element: "Icon" as unknown as RowProps["element"],
    onRowClick: fn(),
  },
  parameters: {
    docs: {
      description: {
        story:
          "A row that cannot be selected: the checkbox is greyed out and ignores clicks (`isDisabled`), while a click on the text still reaches `onRowClick` and the three-dot menu still opens.",
      },
      source: {
        code: `<Row checked={false} isDisabled element={<CatalogFolderReactSvg />} contextOptions={contextOptions}>
  <Text truncate>Sample text</Text>
</Row>`,
      },
    },
  },
};

export const LoadingState: Story = {
  render: (args) => <Template {...args} />,
  args: {
    checked: false,
    inProgress: true,
    element: "Icon" as unknown as RowProps["element"],
  },
  parameters: {
    docs: {
      description: {
        story:
          "A row that is busy, for example while its file is being copied: a spinner stands in for the checkbox and the icon (`inProgress`), and the text and the three-dot button stay as they are.",
      },
      source: {
        code: `<Row checked={false} inProgress element={<CatalogFolderReactSvg />} contextOptions={contextOptions}>
  <Text truncate>Sample text</Text>
</Row>`,
      },
    },
  },
};

export const IndexEditing: Story = {
  render: (args) => <Template {...args} />,
  args: {
    checked: false,
    isIndexEditingMode: true,
    element: "Icon" as unknown as RowProps["element"],
    onChangeIndex: fn(),
  },
  parameters: {
    docs: {
      description: {
        story:
          "A row whose place in a hand-ordered list is being changed: the three-dot button gives way to an up and a down arrow (`isIndexEditingMode`). Click either and the direction arrives in the Actions panel (`onChangeIndex`); moving the row is up to the host.",
      },
      source: {
        code: `<Row
  checked={false}
  isIndexEditingMode
  element={<CatalogFolderReactSvg />}
  onChangeIndex={(action) => moveRow(action)}
>
  <Text truncate>Sample text</Text>
</Row>`,
      },
    },
  },
};

export const WithBadges: Story = {
  render: (args) => <Template {...args} />,
  args: {
    checked: false,
    element: "Icon" as unknown as RowProps["element"],
    badgesComponent: <Badge label="New" />,
    contentElement: <Text fontSize="12px">2 versions</Text>,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Extra information at the end of the row, before the three-dot button: the **New** badge (`badgesComponent`) and the **2 versions** note after it (`contentElement`).",
      },
      source: {
        code: `<Row
  checked={false}
  element={<CatalogFolderReactSvg />}
  badgesComponent={<Badge label="New" />}
  contentElement={<Text fontSize="12px">2 versions</Text>}
  contextOptions={contextOptions}
>
  <Text truncate>Sample text</Text>
</Row>`,
      },
    },
  },
};

const WithoutBorderTemplate = () => (
  <div>
    <Row
      checked={false}
      element={elementIcon}
      contextOptions={defaultContextOptions}
    >
      <Text truncate>With a divider</Text>
    </Row>
    <Row
      checked={false}
      element={elementIcon}
      contextOptions={defaultContextOptions}
      withoutBorder
    >
      <Text truncate>Without a divider</Text>
    </Row>
  </div>
);

export const WithoutBorder: Story = {
  render: () => <WithoutBorderTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "The last row of a list, or a row that stands alone, usually needs no divider under it: **With a divider** keeps the one-pixel line, **Without a divider** drops it (`withoutBorder`).",
      },
      source: {
        code: `<Row checked={false} element={<CatalogFolderReactSvg />} contextOptions={contextOptions}>
  <Text truncate>With a divider</Text>
</Row>
<Row checked={false} element={<CatalogFolderReactSvg />} contextOptions={contextOptions} withoutBorder>
  <Text truncate>Without a divider</Text>
</Row>`,
      },
    },
  },
};

const ItemContent = ({ item }: { item: RowItemType }) => (
  <Text truncate>{item.title}</Text>
);

const longContextOptions = [
  "Open",
  "Edit",
  "Download",
  "Rename",
  "Move",
  "Copy",
  "Delete",
].map((label) => ({ key: label.toLowerCase(), label }));

const ContextMenuHeaderTemplate = () => (
  <Row
    checked={false}
    element={elementIcon}
    contextOptions={longContextOptions}
  >
    <ItemContent
      item={{ title: "Quarterly report.docx", icon: CatalogFolderReactSvgUrl }}
    />
  </Row>
);

// Docs ignores the viewport preset; give the story its own 320px frame there.
const withPhoneFrame: Decorator = (Story, context) => {
  if (context.viewMode !== "docs") return <Story />;

  return (
    <iframe
      title={context.name}
      src={`iframe.html?viewMode=story&id=${context.id}`}
      style={{ width: 320, height: 568, border: 0 }}
    />
  );
};

export const ContextMenuHeader: Story = {
  globals: { viewport: { value: "mobile1", isRotated: false } },
  decorators: [withPhoneFrame],
  render: () => <ContextMenuHeaderTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "A menu that names what it acts on, on a phone-sized screen: tap the three-dot button and a menu taller than 210px opens from the bottom of the screen under a header reading **Quarterly report.docx** with its icon. The row takes the header from the `item` prop of its content, so the content has to accept and carry one; a shorter menu, or any menu on a wide screen, opens beside the row without a header.",
      },
      source: {
        code: `const ItemContent = ({ item }: { item: RowItemType }) => (
  <Text truncate>{item.title}</Text>
);

<Row checked={false} element={<CatalogFolderReactSvg />} contextOptions={sevenItems}>
  <ItemContent item={{ title: "Quarterly report.docx", icon: folderIconUrl }} />
</Row>`,
      },
    },
  },
};

export const RightToLeft: Story = {
  render: (args) => (
    <div dir="rtl">
      <Row
        checked={args.checked}
        element={elementIcon}
        contextOptions={defaultContextOptions}
        badgesComponent={<Badge label="1" />}
      >
        <Text truncate>{"مستند"}</Text>
      </Row>
    </div>
  ),
  args: {
    checked: true,
  },
  globals: { direction: "rtl" },
  parameters: {
    noPadding: true,
    docs: {
      description: {
        story:
          "The row in a right-to-left interface: the checkbox and the icon move to the right edge, the text starts from the right, and the badge and the three-dot button sit at the left edge.",
      },
      source: {
        code: `<div dir="rtl">
  <Row checked element={<CatalogFolderReactSvg />} badgesComponent={<Badge label="1" />} contextOptions={contextOptions}>
    <Text truncate>Sample text</Text>
  </Row>
</div>`,
      },
      // Framed so the RTL direction it stamps on <html> stays out of the Docs page
      story: { inline: false, height: "82px" },
    },
  },
};
