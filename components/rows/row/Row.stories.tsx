import type { ComponentProps } from "react";
import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";

import React from "react";
import { expect, fn, screen, waitFor, within } from "storybook/test";
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
        "Whether the row's checkbox is ticked. Its **presence** is what renders the checkbox at all — passing `checked={false}` gives an unticked box, omitting the prop gives none.",
    },
    indeterminate: {
      control: "boolean",
      description:
        "Draws the checkbox as partly ticked, for a group that is half-selected.",
    },
    isDisabled: {
      control: "boolean",
      description: "Disables the checkbox, and nothing else about the row.",
    },
    element: {
      control: "select",
      options: ["", "Avatar", "Icon", "ComboBox"],
      description:
        "Element at the start of the row — an avatar or a file icon. Like `checked`, its presence is what reserves the space.",
    },
    mode: {
      control: "select",
      options: ["default", "modern"],
      description:
        "`modern` moves the checkbox on top of the start element, so it needs both `checked` and `element` to render either.",
      table: {
        defaultValue: { summary: '"default"' },
      },
    },
    children: {
      control: false,
      description:
        "The row's content, normally a `RowContent`. The row reads `item` off this element's props to build the header of its context menu.",
    },
    contextOptions: {
      control: "object",
      description:
        "Items of the context menu. They may be given here or as `data.contextOptions`, which wins; an empty list renders no button.",
    },
    getContextModel: {
      control: false,
      description:
        "Builds the context menu's items when it opens, instead of `contextOptions`.",
    },
    data: {
      control: "object",
      description:
        "Arbitrary payload handed back to `onSelect`. Its `contextOptions`, if it has any, are the ones the menu uses.",
    },
    contextTitle: {
      control: "text",
      description: "Hover tooltip and accessible name of the context button.",
    },
    badgesComponent: {
      control: false,
      description:
        "Element placed before `contentElement`, for badges of your own.",
    },
    contentElement: {
      control: false,
      description:
        "Element placed before the context button, after the badges.",
    },
    inProgress: {
      control: "boolean",
      description:
        "Replaces the checkbox and the start element with a spinner.",
    },
    isIndexEditingMode: {
      control: "boolean",
      description:
        "Replaces the context button with the up and down arrows of index editing.",
    },
    withoutBorder: {
      control: "boolean",
      description: "Removes the row's bottom border.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isRoom: {
      control: "boolean",
      description:
        "Tells the context menu that this row is a room, which changes its header.",
    },
    isArchive: {
      control: "boolean",
      description: "Tells the context menu that the room is archived.",
    },
    badgeUrl: {
      control: "text",
      description: "URL of the badge image shown in the context menu's header.",
    },
    className: {
      control: "text",
      description: "Applied to the row element.",
    },
    dataTestId: {
      control: "text",
      description: "Value of `data-testid` on the row.",
      table: {
        defaultValue: { summary: '"row"' },
      },
    },
    onSelect: {
      control: false,
      description:
        "Called with the new checked state and whatever `data` holds. In the modern mode on a touch device, a tap on the start element calls it with `true`.",
    },
    onRowClick: {
      control: false,
      description:
        "Called by a click on the content, and in the default mode on the start element. The checkbox and the context button do not call it.",
    },
    onContextClick: {
      control: false,
      description:
        "Called when the context menu is asked for, with `true` for a right-click.",
    },
    rowContextClose: {
      control: false,
      description: "Called when the context menu closes.",
    },
    onChangeIndex: {
      control: false,
      description: "Called with the direction when an index arrow is clicked.",
    },
    id: {
      control: false,
      description:
        "Ignored. Nothing reads this prop and no `id` reaches the DOM.",
    },
    style: {
      control: false,
      description:
        "Ignored. Nothing reads this prop and no inline style reaches the DOM.",
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

// The menu is portalled and fades in.
const menuItem = async (name: string) => {
  const item = await screen.findByRole("menuitem", { name });
  await waitFor(() => expect(item).toBeVisible());
  return item;
};

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
  name: "Ticked, with an avatar",
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
  play: async ({ args, canvas, userEvent }) => {
    const row = canvas.getByTestId("row");
    await expect(row).toHaveClass("checked");
    await expect(within(row).getByTestId("avatar")).toBeVisible();

    // The checkbox asks for the opposite of its state.
    const checkbox = within(row).getByRole("checkbox");
    await expect(checkbox).toBeChecked();
    await userEvent.click(checkbox);
    await expect(args.onSelect).toHaveBeenCalledWith(false, undefined);

    await userEvent.click(within(row).getByText("Sample text"));
    await expect(args.onRowClick).toHaveBeenCalled();

    // The menu button opens the menu beside it.
    await userEvent.click(within(row).getByTestId("context-menu-button"));
    await expect(args.onContextClick).toHaveBeenCalledWith(false);
    await expect(await menuItem("Edit")).toBeVisible();
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(args.rowContextClose).toHaveBeenCalled());
  },
  parameters: {
    docs: {
      description: {
        story:
          "A ticked row with an avatar, as a file list shows it. The checkbox calls `onSelect`, the text calls `onRowClick`. The three-dot button or a right-click anywhere on the row opens the menu.",
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
  name: "Icon in the checkbox's place",
  render: renderSelectable,
  args: {
    mode: "modern",
    checked: false,
    element: "Icon" as unknown as RowProps["element"],
    onSelect: fn(),
  },
  play: async ({ args, canvas, userEvent }) => {
    const row = canvas.getByTestId("row");
    // The icon holds the place; the checkbox shows on a CSS hover.
    const icon = row.querySelector(".styled-element") as HTMLElement;
    await expect(icon).toBeVisible();
    const checkbox = within(row).getByRole("checkbox", { hidden: true });
    await userEvent.click(checkbox);
    await expect(args.onSelect).toHaveBeenCalledWith(true, undefined);
  },
  parameters: {
    docs: {
      description: {
        story:
          'A row whose icon stands where the checkbox would be, so an unselected list shows no empty boxes (`mode="modern"`). On hover the checkbox takes the icon\'s place, and stays once ticked.',
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
  name: "Half-ticked",
  render: (args) => <Template {...args} />,
  args: {
    checked: false,
    indeterminate: true,
    element: "Icon" as unknown as RowProps["element"],
  },
  play: async ({ canvas }) => {
    await expect(
      within(canvas.getByTestId("row")).getByRole("checkbox"),
    ).toBePartiallyChecked();
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
  name: "Checkbox disabled",
  render: (args) => <Template {...args} />,
  args: {
    checked: false,
    isDisabled: true,
    element: "Icon" as unknown as RowProps["element"],
    onRowClick: fn(),
  },
  play: async ({ args, canvas, userEvent }) => {
    const row = canvas.getByTestId("row");
    await expect(within(row).getByRole("checkbox")).toBeDisabled();
    // The text still reaches onRowClick.
    await userEvent.click(within(row).getByText("Sample text"));
    await expect(args.onRowClick).toHaveBeenCalled();
  },
  parameters: {
    docs: {
      description: {
        story:
          "A row that cannot be selected: the checkbox is greyed out and ignores clicks (`isDisabled`). A click on the text still reaches `onRowClick`, and the three-dot menu still opens.",
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
  name: "Busy",
  render: (args) => <Template {...args} />,
  args: {
    checked: false,
    inProgress: true,
    element: "Icon" as unknown as RowProps["element"],
  },
  play: async ({ canvas }) => {
    const row = canvas.getByTestId("row");
    await expect(row.querySelector(".row-progress-loader")).not.toBeNull();
    await expect(
      within(row).queryByRole("checkbox", { hidden: true }),
    ).toBeNull();
    await expect(within(row).getByText("Sample text")).toBeVisible();
  },
  parameters: {
    docs: {
      description: {
        story:
          "A busy row, for example while its file is copied: a spinner stands in for the checkbox and the icon (`inProgress`). The text and the three-dot button stay.",
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
  name: "Index editing",
  render: (args) => <Template {...args} />,
  args: {
    checked: false,
    isIndexEditingMode: true,
    element: "Icon" as unknown as RowProps["element"],
    onChangeIndex: fn(),
  },
  play: async ({ args, canvas, userEvent }) => {
    const row = canvas.getByTestId("row");
    // The arrows replace the three-dot button.
    await expect(within(row).queryByTestId("context-menu-button")).toBeNull();
    await userEvent.click(within(row).getByTestId("index-up-icon"));
    await userEvent.click(within(row).getByTestId("index-down-icon"));
    const calls = (args.onChangeIndex as ReturnType<typeof fn>).mock.calls;
    await expect(calls).toHaveLength(2);
    await expect(calls[0][0]).not.toBe(calls[1][0]);
  },
  parameters: {
    docs: {
      description: {
        story:
          "A row whose place in a hand-ordered list is being changed: an up and a down arrow replace the three-dot button (`isIndexEditingMode`). Each arrow calls `onChangeIndex` with its direction; moving the row is up to the host.",
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
  name: "With badges",
  render: (args) => <Template {...args} />,
  args: {
    checked: false,
    element: "Icon" as unknown as RowProps["element"],
    badgesComponent: <Badge label="New" />,
    contentElement: <Text fontSize="12px">2 versions</Text>,
  },
  play: async ({ canvas }) => {
    const row = canvas.getByTestId("row");
    const badge = within(row).getByText("New").getBoundingClientRect();
    const note = within(row).getByText("2 versions").getBoundingClientRect();
    const menu = within(row)
      .getByTestId("context-menu-button")
      .getBoundingClientRect();
    // Both before the three-dot button, the badge first.
    await expect(badge.right).toBeLessThanOrEqual(note.left);
    await expect(note.right).toBeLessThanOrEqual(menu.left);
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
  name: "Without a divider",
  render: () => <WithoutBorderTemplate />,
  play: async ({ canvas }) => {
    // The divider is drawn by ::after.
    const [withDivider, withoutDivider] = canvas.getAllByTestId("row");
    await expect(getComputedStyle(withDivider, "::after").content).toBe('""');
    await expect(getComputedStyle(withoutDivider, "::after").content).toBe(
      "none",
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Two rows: **With a divider** keeps the one-pixel line under it, **Without a divider** drops it (`withoutBorder`). The last row of a list usually needs none.",
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
  name: "Menu header on a phone",
  globals: { viewport: { value: "mobile1", isRotated: false } },
  decorators: [withPhoneFrame],
  render: () => <ContextMenuHeaderTemplate />,
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(
      within(canvas.getByTestId("row")).getByTestId("context-menu-button"),
    );
    await expect(await menuItem("Delete")).toBeVisible();
    await expect(screen.getAllByRole("menuitem")).toHaveLength(7);
  },
  parameters: {
    docs: {
      description: {
        story:
          "A row on a phone-sized screen with a seven-item menu. Opened, the menu rises from the bottom under a header reading **Quarterly report.docx**. The header comes from the content's `item` prop.",
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
  name: "Right to left",
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
  play: async ({ canvas }) => {
    // The checkbox at the right edge, the menu at the left.
    const row = canvas.getByTestId("row");
    const checkbox = within(row).getByRole("checkbox").getBoundingClientRect();
    const menu = within(row)
      .getByTestId("context-menu-button")
      .getBoundingClientRect();
    await expect(checkbox.left).toBeGreaterThan(menu.right);
  },
  parameters: {
    noPadding: true,
    docs: {
      description: {
        story:
          "The row in a right-to-left interface: the checkbox and the icon sit at the right edge. The badge and the three-dot button sit at the left edge.",
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
