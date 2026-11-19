import type { ComponentProps, CSSProperties } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen, waitFor, within } from "storybook/test";

import type { RoomTileProps } from "./RoomTile.types";

import { useState } from "react";
import PublicRoomIconReactSvg from "../../../assets/icons/32/room/public.svg";
import UnpinReactSvg from "../../../assets/unpin.react.svg";
import CatalogFolderReactSvgUrl from "../../../assets/icons/16/catalog.folder.react.svg?url";

import { RoomsType } from "../../../enums";

import { Link, LinkType } from "../../link";
import { Text } from "../../text";
import { IconButton } from "../../icon-button";
import { IconSizeType } from "../../../utils";

import { RoomTile } from ".";
import { TileContent } from "../tile-content";
import RenameField from "../../../.storybook/utils/RenameField";

const element = <PublicRoomIconReactSvg />;

const onPinBadge = fn();
const onDeleteOption = fn();

// The menu is portalled and fades in.
const menuItem = async (name: string) => {
  const item = await screen.findByRole("menuitem", { name });
  await waitFor(() => expect(item).toBeVisible());
  return item;
};

const badges = (
  <div className="badges">
    <IconButton
      onClick={onPinBadge}
      className="badge icons-group is-pinned tablet-badge tablet-pinned"
      iconNode={<UnpinReactSvg />}
      size={IconSizeType.medium}
    />
  </div>
);

const contextOptions = [
  {
    id: "option_edit",
    key: "edit",
    label: "Edit",
    onClick: fn(),
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

const meta = {
  title: "UI/Tiles/RoomTile",
  component: RoomTile,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
  },
  argTypes: {
    checked: {
      control: "boolean",
      description:
        "Ticks the checkbox and keeps it in place of the logo, and tints the tile and its tags.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isActive: {
      control: "boolean",
      description:
        "Keeps the hover background and the tag tint on the tile being acted on.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isBlockingOperation: {
      control: "boolean",
      description:
        "Stops the tile answering hover, clicks and right-clicks while an operation runs over it. The tile looks the same as an idle one.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    indeterminate: {
      control: "boolean",
      description:
        "Draws the checkbox half-filled. It shows while the checkbox does: on hover, or when the tile is checked.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    inProgress: {
      control: "boolean",
      description:
        "Replaces the logo and the checkbox with a small loader, and sets `aria-busy` on the tile.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    showHotkeyBorder: {
      control: "boolean",
      description:
        "Draws the accent border that marks the tile the keyboard is on.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isEdit: {
      control: "boolean",
      description:
        "Renaming state: removes the logo and the checkbox, and stops hover from tinting the tile and its tags.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    item: {
      // The icons are data URIs too long to edit, and they stretch the table.
      control: false,
      description:
        "The room the tile stands for, passed back through the callbacks. Its `tags`, `providerType` and `isAIAgent` decide the tag row.",
    },
    children: {
      control: false,
      description:
        "The name beside the logo, usually a `TileContent`. Only the first element is rendered.",
    },
    element: {
      control: false,
      description:
        "The room logo beside the name. Without it the tile has neither the logo nor the checkbox.",
    },
    badges: {
      control: false,
      description:
        "Badges after the name. Give their wrapper the class `badges`, so a click on them does not open the room.",
    },
    columnCount: {
      control: "number",
      description:
        "How many columns the tag row fits into. The row shows as many tags as the width allows and folds the rest into a menu.",
    },
    contextOptions: {
      control: "object",
      description:
        "Draws the three-dot button when non-empty and `item` has a `contextOptions` key. The menu lists `getContextModel`'s entries, not these.",
    },
    getContextModel: {
      control: false,
      description:
        "Returns the menu's entries. Without it neither the three-dot button nor a right-click opens anything.",
    },
    getRoomTypeName: {
      control: false,
      description:
        "Turns a room type into the label of the tag a room without tags of its own gets. It receives the kit's translation function.",
    },
    customBottomContent: {
      control: false,
      description:
        "Draws the bottom row instead of the tags. It is called on every render with the hover state and the tags the tile worked out.",
    },
    onSelect: {
      description:
        "Called with the new checked state and the `item` when the checkbox changes, or when the logo is tapped at 600px or narrower.",
    },
    thumbnailClick: {
      description:
        "The room's open handler, called with the event on a click on the tile. Clicks on the checkbox, the tags, the badges and the menu do not reach it.",
    },
    selectTag: {
      description:
        "Called with `{ label, roomType, providerType }` when one of the room's own tags is clicked. The generated tags go to `selectOption`.",
    },
    selectOption: {
      description:
        "Called when a generated tag is clicked: `typeProvider` for the storage tag, `defaultTypeRoom` for the room-type tag.",
    },
    dataTestId: {
      control: "text",
      description: "Value of `data-testid` on the outer element.",
      table: {
        defaultValue: { summary: '"tile"' },
      },
    },
  },
  args: {
    onSelect: fn(),
    thumbnailClick: fn(),
    selectTag: fn(),
    selectOption: fn(),
  },
} satisfies Meta<typeof RoomTile>;

type Story = StoryObj<ComponentProps<typeof RoomTile>>;

export default meta;

const Template = ({
  checked: initialChecked,
  onSelect: onSelectArg,
  ...args
}: RoomTileProps) => {
  const [checked, setChecked] = useState(initialChecked);

  const onSelect: RoomTileProps["onSelect"] = (isSelected, item) => {
    setChecked(isSelected);
    onSelectArg?.(isSelected, item);
  };

  return (
    <div style={{ maxWidth: "300px", margin: "30px" }}>
      <RoomTile {...args} checked={checked} onSelect={onSelect}>
        <TileContent>
          {args.isEdit ? (
            <RenameField title={args.item.title} />
          ) : (
            <Link
              type={LinkType.page}
              fontSize="16px"
              lineHeight="22px"
              fontWeight={600}
              isTextOverflow
            >
              {args.item.title}
            </Link>
          )}
        </TileContent>
      </RoomTile>
    </div>
  );
};

export const Default: Story = {
  name: "Room with one tag",
  render: Template,
  args: {
    item: {
      id: "room-1",
      title: "Sample Room",
      roomType: "collaboration",
      tags: [
        {
          label: "Collaboration",
          roomType: RoomsType.EditingRoom,
        },
      ],
      contextOptions,
    },
    element,
    contextOptions,
    badges,
    getContextModel: () => contextOptions,
    getRoomTypeName: (type: string) => type,
    columnCount: 1,
  },
  beforeEach: () => {
    onPinBadge.mockClear();
    onDeleteOption.mockClear();
  },
  play: async ({ args, canvas, userEvent }) => {
    const tile = canvas.getByTestId("tile");
    // A click on the tile opens the room.
    await userEvent.click(within(tile).getByText("Sample Room"));
    await expect(args.thumbnailClick).toHaveBeenCalledTimes(1);

    // The tag and the badge have their own handlers; neither opens the room.
    // The label lets the pointer through to the tag, so click the tag.
    await userEvent.click(within(tile).getByTestId("tag_item_Collaboration"));
    await expect(args.selectTag).toHaveBeenCalledWith(
      expect.objectContaining({ label: "Collaboration" }),
    );
    await expect(args.thumbnailClick).toHaveBeenCalledTimes(1);
    const opened = (args.thumbnailClick as ReturnType<typeof fn>).mock.calls
      .length;
    await userEvent.click(
      within(tile.querySelector(".badges") as HTMLElement).getByTestId(
        "icon-button",
      ),
    );
    await expect(onPinBadge).toHaveBeenCalledTimes(1);
    await expect(args.thumbnailClick).toHaveBeenCalledTimes(opened);

    const checkbox = within(tile).getByRole("checkbox", { hidden: true });
    await userEvent.click(checkbox);
    await expect(args.onSelect).toHaveBeenCalledWith(
      true,
      expect.objectContaining({ id: "room-1" }),
    );
    await userEvent.click(checkbox);
    await expect(args.onSelect).toHaveBeenLastCalledWith(
      false,
      expect.objectContaining({ id: "room-1" }),
    );

    await userEvent.click(within(tile).getByTestId("context-menu-button"));
    await userEvent.click(await menuItem("Delete"));
    await expect(onDeleteOption).toHaveBeenCalledTimes(1);
  },
  parameters: {
    docs: {
      description: {
        story:
          "A room with one tag: the logo, the name with a pin badge, the three-dot button, and the tag row below. The checkbox replaces the logo on hover.",
      },
      source: {
        code: `<RoomTile
  item={{ id: "room-1", title: "Sample Room", roomType: "collaboration", tags: [...] }}
  element={<PublicRoomIconReactSvg />}
  contextOptions={contextOptions}
  badges={badges}
  getContextModel={() => contextOptions}
  getRoomTypeName={getRoomTypeName}
  columnCount={1}
  thumbnailClick={openRoom}
  onSelect={handleSelect}
>
  <TileContent>
    <Link type="page" fontSize="16px" lineHeight="22px" fontWeight={600} isTextOverflow>Sample Room</Link>
  </TileContent>
</RoomTile>`,
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
          "A selected room (`checked`). The ticked checkbox stays in place of the logo, and the tile and its tags are tinted.",
      },
      source: {
        code: `<RoomTile
  item={{ id: "room-1", title: "Sample Room", roomType: "collaboration", tags: [...] }}
  element={<PublicRoomIconReactSvg />}
  contextOptions={contextOptions}
  checked={true}
  onSelect={handleSelect}
>
  <TileContent>
    <Link type="page" fontSize="16px" lineHeight="22px" fontWeight={600} isTextOverflow>Sample Room</Link>
  </TileContent>
</RoomTile>`,
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
          "A room that is busy, being created or copied: a small loader stands where the logo and the checkbox were (`inProgress`).",
      },
      source: {
        code: `<RoomTile
  item={{ id: "room-1", title: "Sample Room", roomType: "collaboration", tags: [...] }}
  element={<PublicRoomIconReactSvg />}
  contextOptions={contextOptions}
  inProgress={true}
>
  <TileContent>
    <Link type="page" fontSize="16px" lineHeight="22px" fontWeight={600} isTextOverflow>Sample Room</Link>
  </TileContent>
</RoomTile>`,
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
    await expect(
      getComputedStyle(canvas.getByTestId("tile")).pointerEvents,
    ).toBe("none");
  },
  parameters: {
    docs: {
      description: {
        story:
          "A room an operation is running over (`isBlockingOperation`). The tile ignores the pointer until it ends, and it looks the same as an idle room, so show the operation somewhere else.",
      },
      source: {
        code: `<RoomTile
  item={{ id: "room-1", title: "Sample Room", roomType: "collaboration", tags: [...] }}
  element={<PublicRoomIconReactSvg />}
  contextOptions={contextOptions}
  isBlockingOperation={true}
>
  <TileContent>
    <Link type="page" fontSize="16px" lineHeight="22px" fontWeight={600} isTextOverflow>Sample Room</Link>
  </TileContent>
</RoomTile>`,
      },
    },
  },
};

export const GeneratedTags: Story = {
  name: "Tags made by the tile",
  render: Template,
  args: {
    ...Default.args,
    item: {
      id: "room-2",
      title: "Shared storage",
      roomType: String(RoomsType.EditingRoom),
      providerType: "1",
      thirdPartyIcon: CatalogFolderReactSvgUrl,
      contextOptions,
    },
    getRoomTypeName: () => "Collaboration",
  },
  play: async ({ args, canvas, userEvent }) => {
    const tile = canvas.getByTestId("tile");
    // Two tags made by the tile: the storage first, as its icon alone,
    // then the room type.
    const tags = within(tile).getAllByTestId(/^tag_item_/);
    await expect(tags).toHaveLength(2);
    await waitFor(() =>
      expect(tags[0].querySelector("svg, img")).not.toBeNull(),
    );
    await expect(tags[1]).toHaveTextContent("Collaboration");

    // Each reaches selectOption with which of the two it was; neither
    // reaches selectTag or opens the room.
    await userEvent.click(tags[0]);
    await expect(args.selectOption).toHaveBeenLastCalledWith({
      option: "typeProvider",
      value: "1",
    });
    tags[1].focus();
    await userEvent.keyboard("{Enter}");
    await expect(args.selectOption).toHaveBeenLastCalledWith({
      option: "defaultTypeRoom",
      value: String(RoomsType.EditingRoom),
    });
    await expect(args.selectTag).not.toHaveBeenCalled();
    await expect(args.thumbnailClick).not.toHaveBeenCalled();
  },
  parameters: {
    docs: {
      description: {
        story:
          "A room on a connected storage, with no tags of its own. The tile makes two tags: the storage as its icon alone (`providerType`, `thirdPartyIcon`), then the room type (`getRoomTypeName`). A click on either calls `selectOption`.",
      },
      source: {
        code: `<RoomTile
  item={{ id: "room-2", title: "Shared storage", roomType: "2", providerType: "1", thirdPartyIcon: storageIconUrl, contextOptions }}
  element={<PublicRoomIconReactSvg />}
  contextOptions={contextOptions}
  getRoomTypeName={() => "Collaboration"}
  selectOption={filterByOption}
  columnCount={1}
>
  <TileContent>
    <Link type="page" fontSize="16px" lineHeight="22px" fontWeight={600} isTextOverflow>Shared storage</Link>
  </TileContent>
</RoomTile>`,
      },
    },
  },
};

export const WithHotkeyBorder: Story = {
  name: "Keyboard border",
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
          "The tile the keyboard is on while the reader moves through the grid with the arrow keys: its border turns the accent colour (`showHotkeyBorder`). The tile does not handle the keys itself.",
      },
      source: {
        code: `<RoomTile
  item={{ id: "room-1", title: "Sample Room", roomType: "collaboration", tags: [...] }}
  element={<PublicRoomIconReactSvg />}
  contextOptions={contextOptions}
  showHotkeyBorder
>
  <TileContent>
    <Link type="page" fontSize="16px" lineHeight="22px" fontWeight={600} isTextOverflow>Sample Room</Link>
  </TileContent>
</RoomTile>`,
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
          "A room whose name is being edited (`isEdit`). The logo and the checkbox go, so the name can become a text field. The tile keeps its idle background under the pointer.",
      },
      source: {
        code: `<RoomTile
  item={{ id: "room-1", title: "Sample Room", roomType: "collaboration", tags: [...] }}
  element={<PublicRoomIconReactSvg />}
  contextOptions={contextOptions}
  isEdit
>
  <TileContent>
    <div style={{ display: "flex", gap: 4 }}>
      <TextInput value={title} onChange={onRename} scale />
      <Button size={ButtonSize.small} icon={<CheckIcon />} onClick={onSave} />
      <Button size={ButtonSize.small} icon={<CrossIcon />} onClick={onCancel} />
    </div>
  </TileContent>
</RoomTile>`,
      },
    },
  },
};

export const CustomBottomRow: Story = {
  name: "Custom bottom row",
  render: Template,
  args: {
    ...Default.args,
    customBottomContent: (isHovered, tags) => (
      <Text fontSize="12px">
        {isHovered ? "Open room" : `${tags.length} tag`}
      </Text>
    ),
  },
  play: async ({ canvas, userEvent }) => {
    const tile = canvas.getByTestId("tile");
    await expect(within(tile).getByText("1 tag")).toBeVisible();
    // The host's row follows the pointer.
    await userEvent.hover(tile);
    await expect(within(tile).getByText("Open room")).toBeVisible();
    await userEvent.unhover(tile);
    await expect(within(tile).getByText("1 tag")).toBeVisible();
  },
  parameters: {
    docs: {
      description: {
        story:
          "A room whose bottom row is the host's own (`customBottomContent`): a line that counts the tags and changes while the pointer is over the tile. The tile draws no tags.",
      },
      source: {
        code: `<RoomTile
  item={room}
  element={<PublicRoomIconReactSvg />}
  contextOptions={contextOptions}
  customBottomContent={(isHovered, tags) => (
    <Text fontSize="12px">{isHovered ? "Open room" : \`\${tags.length} tag\`}</Text>
  )}
>
  <TileContent>
    <Link type="page" fontSize="16px" lineHeight="22px" fontWeight={600} isTextOverflow>Sample Room</Link>
  </TileContent>
</RoomTile>`,
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
          "--tile-bg": "light-dark(#f4f9fd, #132530)",
          "--tile-border-style": "1px solid #0082c9",
          "--tile-radius": "16px",
          "--tile-hover-bg": "light-dark(#cce5f6, #1f4a61)",
          "--tile-icon-color": "#0082c9",
          "--tile-tag-hover-bg": "light-dark(#e6f3fb, #16303e)",
          "--tile-hotkey-color": "#e0662e",
          "--tile-padding": "12px 0",
          "--tile-row-gap": "12px",
        } as CSSProperties
      }
    >
      {[
        { id: "room-1", title: "Sample Room", showHotkeyBorder: false },
        { id: "room-2", title: "Team Room", showHotkeyBorder: true },
      ].map(({ id, title, showHotkeyBorder }) => (
        <div key={id} style={{ maxWidth: "300px", margin: "30px" }}>
          <RoomTile
            item={{
              id,
              title,
              roomType: "collaboration",
              tags: [
                { label: "Collaboration", roomType: RoomsType.EditingRoom },
              ],
              contextOptions,
            }}
            element={element}
            contextOptions={contextOptions}
            badges={badges}
            showHotkeyBorder={showHotkeyBorder}
            getContextModel={() => contextOptions}
            selectTag={fn()}
            selectOption={fn()}
            getRoomTypeName={(type: string) => type}
            columnCount={1}
          >
            <TileContent>
              <Link
                type={LinkType.page}
                fontSize="16px"
                lineHeight="22px"
                fontWeight={600}
                isTextOverflow
              >
                {title}
              </Link>
            </TileContent>
          </RoomTile>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    const [sample, team] = canvas.getAllByTestId("tile");
    await expect(getComputedStyle(sample).borderTopLeftRadius).toBe("16px");
    await expect(getComputedStyle(sample).rowGap).toBe("12px");
    await expect(getComputedStyle(team).borderTopColor).toBe(
      "rgb(224, 102, 46)",
    );
  },
  parameters: {
    docs: {
      description: {
        story: `The variables are listed under CSS variables on this page.

Two instances:
- **Sample Room** — every variable but the hotkey colour; \`--tile-hover-bg\` and \`--tile-tag-hover-bg\` show on hover.
- **Team Room** — \`showHotkeyBorder\`, for \`--tile-hotkey-color\`.`,
      },
      source: {
        code: `<div style={{
  "--tile-bg": "light-dark(#f4f9fd, #132530)",
  "--tile-border-style": "1px solid #0082c9",
  "--tile-radius": "16px",
  "--tile-hover-bg": "light-dark(#cce5f6, #1f4a61)",
  "--tile-icon-color": "#0082c9",
  "--tile-tag-hover-bg": "light-dark(#e6f3fb, #16303e)",
  "--tile-hotkey-color": "#e0662e",
  "--tile-padding": "12px 0",
  "--tile-row-gap": "12px",
}}>
  <RoomTile item={room} element={<RoomLogo />} contextOptions={options} badges={badges} columnCount={1}>
    <TileContent><Link type="page" fontSize="16px" lineHeight="22px" fontWeight={600}>Sample Room</Link></TileContent>
  </RoomTile>
  <RoomTile item={teamRoom} element={<RoomLogo />} contextOptions={options} badges={badges} columnCount={1} showHotkeyBorder>
    <TileContent><Link type="page" fontSize="16px" lineHeight="22px" fontWeight={600}>Team Room</Link></TileContent>
  </RoomTile>
</div>`,
      },
    },
  },
};
