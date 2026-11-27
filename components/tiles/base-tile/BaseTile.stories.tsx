import type { ComponentProps, CSSProperties } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen, waitFor, within } from "storybook/test";

import type { BaseTileProps } from "./BaseTile.types";

import { useState } from "react";

import PublicRoomIconReactSvg from "../../../assets/icons/32/room/public.svg";
import { RoomsType } from "../../../enums";
import { Link, LinkType } from "../../link";
import { Tags } from "../../tags";
import RenameField from "../../../.storybook/utils/RenameField";

import { BaseTile } from ".";
import { TileContent } from "../tile-content";

// The client never draws a BaseTile of its own: it is the frame RoomTile and
// TemplateTile fill. The stories fill it the way RoomTile does -- the room's
// logo, its name, the menu button and a row of tags -- so that each one shows
// a tile as a reader meets it.
const roomElement = <PublicRoomIconReactSvg />;

const roomTitle = (
  <TileContent>
    <Link
      type={LinkType.page}
      fontSize="16px"
      lineHeight="22px"
      fontWeight={600}
      isTextOverflow
    >
      Marketing
    </Link>
  </TileContent>
);

const onSelectTag = fn();

const roomTags = (
  <Tags
    columnCount={2}
    tags={[
      { label: "Public room", roomType: RoomsType.PublicRoom },
      "Campaigns",
      "Q4",
    ]}
    onSelectTag={onSelectTag}
  />
);

const onEditOption = fn();
const onDeleteOption = fn();

// The menu is portalled and fades in.
const menuItem = async (name: string) => {
  const item = await screen.findByRole("menuitem", { name });
  await waitFor(() => expect(item).toBeVisible());
  return item;
};

const contextOptions = [
  {
    id: "option_edit",
    key: "edit",
    label: "Edit",
    onClick: onEditOption,
    disabled: false,
  },
  {
    id: "option_delete",
    key: "delete",
    label: "Delete",
    onClick: onDeleteOption,
    disabled: false,
  },
];

// The `contextOptions` key on the item is what draws the three-dot button.
const roomItem = {
  id: "room-1",
  title: "Marketing",
  contextOptions,
} as BaseTileProps["item"];

// The code panel of every story: the Default tile plus that story's props.
const sourceOf = (extra = "") => `<BaseTile
  item={{ id: "room-1", title: "Marketing", contextOptions }}
  element={<PublicRoomIcon />}
  contextOptions={contextOptions}
  topContent={
    <TileContent>
      <Link type="page" fontSize="16px" lineHeight="22px" fontWeight={600} isTextOverflow>
        Marketing
      </Link>
    </TileContent>
  }
  bottomContent={<Tags columnCount={2} tags={tags} onSelectTag={selectTag} />}
  getContextModel={() => contextOptions}
  onSelect={handleSelect}${extra}
/>`;

const meta = {
  title: "UI/Tiles/BaseTile",
  component: BaseTile,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
  },
  argTypes: {
    checked: {
      control: "boolean",
      description:
        "Ticks the checkbox, shows it in place of the icon and tints the tile. The tile holds no state; pass back what `onSelect` reports.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isActive: {
      control: "boolean",
      description:
        "Keeps the hover tint on the tile being acted on, after the pointer leaves it.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    inProgress: {
      control: "boolean",
      description:
        "Replaces the icon and the checkbox with the kit's track loader.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    showHotkeyBorder: {
      control: "boolean",
      description:
        "Draws the accent outline that marks the tile the keyboard is on.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isEdit: {
      control: "boolean",
      description:
        "Renaming state: removes the icon, the checkbox and the hover tint, so `topContent` gets the whole row.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isBlockingOperation: {
      control: "boolean",
      description:
        "Stops hover, clicks and right-clicks reaching the tile while an operation runs over it. The tile looks the same.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    indeterminate: {
      control: "boolean",
      description: "Draws the checkbox in its indeterminate state.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    item: {
      control: "object",
      description:
        "The item this tile stands for. It is also what `onSelect` is called with, and the fallback source of the context menu's header.",
    },
    element: {
      control: false,
      description:
        "The icon in the corner. Without it neither the icon nor the checkbox is rendered at all.",
    },
    topContent: {
      control: false,
      description:
        "The upper half of the tile. Its first child is read for a nested `item`, which then takes over the context menu's header.",
    },
    bottomContent: {
      control: false,
      description:
        "The lower half of the tile — where the room tile puts its tags.",
    },
    contextOptions: {
      control: "object",
      description:
        "Draws the three-dot button when non-empty and `item` carries a `contextOptions` key. The menu lists `getContextModel`'s entries, not these.",
    },
    getContextModel: {
      control: false,
      description:
        "Builds the menu that the three-dot button and a right-click open. Without it neither opens a menu, whatever `contextOptions` holds.",
    },
    onSelect: {
      description:
        "Called with the new checked state and the `item`, from the checkbox. A tap on the icon calls it too, in a window 600px wide or narrower.",
    },
    onRoomClick: {
      description:
        "Called with the event on any click on the tile. It is the tile's `onClick`, not a room-specific one.",
    },
    onHover: {
      description: "Called when the pointer enters the tile.",
    },
    onLeave: {
      description: "Called when the pointer leaves the tile.",
    },
    tileContextClick: {
      description:
        "Called before the menu opens, with `true` when the trigger was a right-click.",
    },
    hideContextMenu: {
      description: "Called when the menu closes.",
    },
    badgeUrl: {
      control: "text",
      description:
        "Passed to the context menu, for the badge it draws in its header.",
    },
    className: {
      control: "text",
      description:
        "Added after the component's own classes on the outer element.",
    },
    dataTestId: {
      control: "text",
      description: "Value of `data-testid` on the outer element.",
      table: {
        defaultValue: { summary: '"tile"' },
      },
    },
    checkboxContainerRef: {
      control: false,
      description:
        "Attached to the element holding the icon and the checkbox, so a wrapper can tell clicks on it apart.",
    },
    forwardRef: {
      control: false,
      description:
        "A ref the component clicks on a right-click, before the menu is mounted. It is not attached to anything here.",
    },
  },
  args: {
    onSelect: fn(),
    onRoomClick: fn(),
    onHover: fn(),
    onLeave: fn(),
    tileContextClick: fn(),
    hideContextMenu: fn(),
  },
} satisfies Meta<typeof BaseTile>;

type Story = StoryObj<ComponentProps<typeof BaseTile>>;

export default meta;

const Template = ({
  checked: initialChecked,
  onSelect: onSelectArg,
  ...args
}: BaseTileProps) => {
  const [checked, setChecked] = useState(initialChecked);

  const onSelect: BaseTileProps["onSelect"] = (isSelected, item) => {
    setChecked(isSelected);
    onSelectArg?.(isSelected, item);
  };

  return (
    <div style={{ maxWidth: "300px", margin: "30px" }}>
      <BaseTile {...args} checked={checked} onSelect={onSelect} />
    </div>
  );
};

export const Default: Story = {
  name: "Room tile",
  render: Template,
  args: {
    item: roomItem,
    element: roomElement,
    contextOptions,
    topContent: roomTitle,
    bottomContent: roomTags,
    getContextModel: () => contextOptions,
  },
  beforeEach: () => {
    onEditOption.mockClear();
    onDeleteOption.mockClear();
    onSelectTag.mockClear();
  },
  play: async ({ args, canvas, userEvent }) => {
    const tile = canvas.getByTestId("tile");
    await userEvent.hover(tile);
    await expect(args.onHover).toHaveBeenCalled();

    // The checkbox, shown in place of the icon on a CSS hover, reports the
    // new state with the item.
    const checkbox = within(tile).getByRole("checkbox", { hidden: true });
    await userEvent.click(checkbox);
    await expect(args.onSelect).toHaveBeenCalledWith(
      true,
      expect.objectContaining({ id: "room-1" }),
    );
    await expect(checkbox).toBeChecked();
    await userEvent.click(checkbox);
    await expect(checkbox).not.toBeChecked();

    await userEvent.click(within(tile).getByText("Marketing"));
    await expect(args.onRoomClick).toHaveBeenCalled();

    // The label lets the pointer through to the tag, so click the tag.
    await userEvent.click(within(tile).getByTestId("tag_item_Campaigns"));
    await expect(onSelectTag).toHaveBeenCalledWith(
      expect.objectContaining({ label: "Campaigns" }),
    );

    // The three-dot button opens the menu...
    await userEvent.click(within(tile).getByTestId("context-menu-button"));
    await userEvent.click(await menuItem("Edit"));
    await expect(onEditOption).toHaveBeenCalledTimes(1);

    // ...and so does a right click.
    await userEvent.pointer({ keys: "[MouseRight]", target: tile });
    await expect(args.tileContextClick).toHaveBeenCalledWith(true);
    await userEvent.click(await menuItem("Delete"));
    await expect(onDeleteOption).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(args.hideContextMenu).toHaveBeenCalled());
  },
  parameters: {
    docs: {
      description: {
        story:
          "A room as a tile, filled the way `RoomTile` fills it: the logo, the name, the three-dot menu and a row of tags. The menu opens from the button or on a right-click. The button needs a `contextOptions` key on the item.",
      },
      source: {
        code: sourceOf(),
      },
    },
  },
};

export const Checked: Story = {
  name: "Selected",
  render: Template,
  args: {
    ...Default.args,
    checked: true,
  },
  play: async ({ canvas }) => {
    const tile = canvas.getByTestId("tile");
    await expect(tile.className).toMatch(/checked/);
    await expect(
      within(tile).getByRole("checkbox", { hidden: true }),
    ).toBeChecked();
  },
  parameters: {
    docs: {
      description: {
        story:
          "A selected tile: the checkbox stays ticked in place of the icon, and the tile stays tinted (`checked`).",
      },
      source: {
        code: sourceOf("\n  checked"),
      },
    },
  },
};

export const Active: Story = {
  name: "Being acted on",
  render: Template,
  args: {
    ...Default.args,
    isActive: true,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByTestId("tile").className).toMatch(/isActive/);
  },
  parameters: {
    docs: {
      description: {
        story:
          "The tile being acted on, such as the one whose menu is open. It keeps the hover tint after the pointer leaves (`isActive`).",
      },
      source: {
        code: sourceOf("\n  isActive"),
      },
    },
  },
};

export const InProgress: Story = {
  name: "Busy",
  render: Template,
  args: {
    ...Default.args,
    inProgress: true,
  },
  play: async ({ canvas }) => {
    // A loader in place of the icon and the checkbox.
    const tile = canvas.getByTestId("tile");
    await expect(
      within(tile).queryByRole("checkbox", { hidden: true }),
    ).toBeNull();
    await expect(tile.querySelector('[class*="loader"]')).not.toBeNull();
  },
  parameters: {
    docs: {
      description: {
        story:
          "A tile whose item is busy, being copied or converted: a small loader stands where the icon and the checkbox were (`inProgress`).",
      },
      source: {
        code: sourceOf("\n  inProgress"),
      },
    },
  },
};

export const WithHotkeyBorder: Story = {
  name: "Keyboard outline",
  render: Template,
  args: {
    ...Default.args,
    showHotkeyBorder: true,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByTestId("tile").className).toMatch(
      /showHotkeyBorder/,
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "The tile the keyboard is on while the reader moves through the grid with the arrow keys: an accent border marks it (`showHotkeyBorder`). The tile does not handle the keys itself.",
      },
      source: {
        code: sourceOf("\n  showHotkeyBorder"),
      },
    },
  },
};

export const WithCustomBottomContent: Story = {
  name: "Details in the lower half",
  render: Template,
  args: {
    ...Default.args,
    bottomContent: (
      <div
        style={{
          fontSize: "12px",
          lineHeight: "24px",
          color: "light-dark(#666, #a3a9ae)",
        }}
      >
        12 files, updated today
      </div>
    ),
  },
  play: async ({ canvas }) => {
    const details = canvas.getByText("12 files, updated today");
    await expect(details.getBoundingClientRect().top).toBeGreaterThanOrEqual(
      canvas.getByText("Marketing").getBoundingClientRect().bottom,
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "The second row holds whatever the tile is given, not only tags: here a line of details (`bottomContent`).",
      },
      source: {
        code: sourceOf().replace(
          /bottomContent=\{.*\}/,
          "bottomContent={<div>12 files, updated today</div>}",
        ),
      },
    },
  },
};

export const RenamingState: Story = {
  name: "Renaming",
  render: Template,
  args: {
    ...Default.args,
    isEdit: true,
    topContent: (
      <TileContent>
        <RenameField title="Marketing" />
      </TileContent>
    ),
  },
  play: async ({ canvas }) => {
    const tile = canvas.getByTestId("tile");
    await expect(tile.className).toMatch(/isEdit/);
    await expect(
      within(tile).queryByRole("checkbox", { hidden: true }),
    ).toBeNull();
  },
  parameters: {
    docs: {
      description: {
        story:
          "A tile whose name is being edited: the icon and the checkbox go, and hovering does not tint it. The title row holds a text field across the tile (`isEdit`).",
      },
      source: {
        code: sourceOf("\n  isEdit").replace(
          /topContent=\{[\s\S]*?\n  \}/,
          `topContent={
    <TileContent>
      <div style={{ display: "flex", gap: 4 }}>
        <TextInput value={title} onChange={onRename} scale />
        <Button size={ButtonSize.small} icon={<CheckIcon />} onClick={onSave} />
        <Button size={ButtonSize.small} icon={<CrossIcon />} onClick={onCancel} />
      </div>
    </TileContent>
  }`,
        ),
      },
    },
  },
};

export const BlockingOperation: Story = {
  name: "Blocked by an operation",
  render: Template,
  args: {
    ...Default.args,
    isBlockingOperation: true,
  },
  play: async ({ canvas }) => {
    // The tile ignores the pointer altogether.
    await expect(
      getComputedStyle(canvas.getByTestId("tile")).pointerEvents,
    ).toBe("none");
  },
  parameters: {
    docs: {
      description: {
        story:
          "A tile an operation is running over: hover, clicks and right-clicks do not reach it (`isBlockingOperation`). It looks like an idle tile, so show the operation somewhere else.",
      },
      source: {
        code: sourceOf("\n  isBlockingOperation"),
      },
    },
  },
};

export const CssCustomization: Story = {
  name: "CSS variables",
  render: () => (
    <div
      style={
        {
          "--tile-bg": "light-dark(#e6f3fb, #16303e)",
          "--tile-border-style": "1px solid #0082c9",
          "--tile-radius": "16px",
          "--tile-hover-bg": "light-dark(#cce5f6, #1f4a61)",
          "--tile-icon-color": "#0082c9",
          "--tile-hotkey-color": "light-dark(#00304d, #a8d8f2)",
          "--tile-padding": "12px 0",
          "--tile-row-gap": "12px",
        } as CSSProperties
      }
    >
      <div style={{ maxWidth: "300px", margin: "30px" }}>
        <BaseTile
          item={roomItem}
          element={roomElement}
          contextOptions={contextOptions}
          topContent={roomTitle}
          bottomContent={roomTags}
          onSelect={fn()}
          getContextModel={() => contextOptions}
        />
      </div>
      <div style={{ maxWidth: "300px", margin: "30px" }}>
        <BaseTile
          item={{ id: "room-2", title: "Sales" }}
          element={roomElement}
          contextOptions={contextOptions}
          topContent={
            <TileContent>
              <Link>Sales</Link>
            </TileContent>
          }
          showHotkeyBorder
        />
      </div>
    </div>
  ),
  play: async ({ canvas }) => {
    const [first, second] = canvas.getAllByTestId("tile");
    const tile = getComputedStyle(first);
    await expect(tile.backgroundColor).toBe("rgb(230, 243, 251)");
    await expect(tile.borderTopLeftRadius).toBe("16px");
    await expect(tile.rowGap).toBe("12px");
    await expect(getComputedStyle(second).borderTopColor).toBe(
      "rgb(0, 48, 77)",
    );
  },
  parameters: {
    docs: {
      description: {
        story: `Two tiles under one wrapper that sets every variable. The first shows all of them but the hotkey colour; the hover background shows on hover. The second has \`showHotkeyBorder\`, the only state that draws \`--tile-hotkey-color\`.`,
      },
    },
  },
};
