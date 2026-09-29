import type { ComponentProps, CSSProperties } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import type { RoomTileProps } from "./RoomTile.types";

import { useState } from "react";
import PublicRoomIconReactSvg from "../../../assets/icons/32/room/public.svg";
import UnpinReactSvg from "../../../assets/unpin.react.svg";
import CatalogFolderReactSvgUrl from "../../../assets/icons/16/catalog.folder.react.svg?url";

import { RoomsType } from "../../../enums";

import { Link } from "../../link";
import { Text } from "../../text";
import { IconButton } from "../../icon-button";
import { IconSizeType } from "../../../utils";

import { RoomTile } from ".";
import { TileContent } from "../tile-content";

const element = <PublicRoomIconReactSvg />;

const badges = (
  <div className="badges">
    <IconButton
      onClick={() => {}}
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
    onClick: () => {},
    disabled: false,
  },
  {
    id: "option_delete",
    key: "delete",
    label: "Delete",
    onClick: () => {},
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
        "Ticks the checkbox and keeps it in place of the logo, and tints the tile and its tags",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isActive: {
      control: "boolean",
      description:
        "Keeps the hover background and the tag tint on the tile being acted on",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isBlockingOperation: {
      control: "boolean",
      description:
        "Stops the tile answering hover, clicks and right-clicks; it looks the same as an idle tile",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    indeterminate: {
      control: "boolean",
      description:
        "Draws the checkbox half-filled; it shows while the checkbox does, that is on hover or when the tile is checked",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    inProgress: {
      control: "boolean",
      description: "Replaces the logo and the checkbox with a small loader",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    showHotkeyBorder: {
      control: "boolean",
      description:
        "Turns the tile's border the accent colour, to mark the one the keyboard is on",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isEdit: {
      control: "boolean",
      description:
        "Removes the logo and the checkbox while the room is renamed, and stops hovering from tinting the tile",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    item: {
      // The icons are data URIs too long to edit, and they stretch the table.
      control: false,
      description:
        "The room the tile stands for, passed back through the callbacks. Its `tags`, `providerType` and `isAIAgent` decide the tag row; a `contextOptions` key on it is what draws the three-dot button",
    },
    children: {
      control: false,
      description:
        "The name beside the logo, usually a `TileContent`; only the first element is shown",
    },
    element: {
      control: false,
      description:
        "The room logo beside the name; without it the tile has neither the logo nor the checkbox",
    },
    badges: {
      control: false,
      description:
        "Badges after the name; give their wrapper the class `badges` so clicking them does not open the room",
    },
    columnCount: {
      control: "number",
      description:
        "How many columns the tag row has to fit into; the row shows as many tags as the width allows and folds the rest",
    },
    contextOptions: {
      control: "object",
      description: "Entries of the menu opened by the three-dot button",
    },
    getContextModel: {
      control: false,
      description:
        "Returns the entries of the menu opened by a right-click; without it a right-click opens nothing",
    },
    getRoomTypeName: {
      control: false,
      description:
        "Turns the room type into the label of the tag shown when the room has no tags of its own",
    },
    customBottomContent: {
      control: false,
      description:
        "Draws the bottom row instead of the tags; called on every render with the hover state and the tags the tile worked out",
    },
    onSelect: {
      description:
        "Called with the new checked state and the item from the checkbox, and when the logo is tapped on a phone",
    },
    thumbnailClick: {
      description:
        "Called with the event on a click anywhere on the tile except the checkbox, the tags, the badges and the menu; it is the room's open handler",
    },
    selectTag: {
      description:
        "Called with a clicked tag that carries a label and a room type; a plain text tag never reaches it",
    },
    selectOption: {
      description:
        "Called when the type tag or the third-party tag is clicked, with which of the two it was",
    },
    dataTestId: {
      control: "text",
      description: "Value of `data-testid` on the outer element",
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
          <Link>Room Content</Link>
        </TileContent>
      </RoomTile>
    </div>
  );
};

export const Default: Story = {
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
  parameters: {
    docs: {
      description: {
        story:
          "A room with one tag: the logo, the name with a pin badge, the menu, and the tag row below. Hover the logo and tick the checkbox to select the room, click anywhere else or on the tag to see the callbacks in the Actions panel, and change any other prop live in the Controls panel below.",
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
  <TileContent><Link>Room Content</Link></TileContent>
</RoomTile>`,
      },
    },
  },
};

export const Checked: Story = {
  render: Template,
  args: {
    ...Default.args,
    checked: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "A selected room, as it looks among others the reader has picked: the checkbox stays ticked in place of the logo and the tile and its tags are tinted (`checked`).",
      },
      source: {
        code: `<RoomTile
  item={{ id: "room-1", title: "Sample Room", roomType: "collaboration", tags: [...] }}
  element={<PublicRoomIconReactSvg />}
  contextOptions={contextOptions}
  checked={true}
  onSelect={handleSelect}
>
  <TileContent><Link>Room Content</Link></TileContent>
</RoomTile>`,
      },
    },
  },
};

export const InProgress: Story = {
  render: Template,
  args: {
    ...Default.args,
    inProgress: true,
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
  <TileContent><Link>Room Content</Link></TileContent>
</RoomTile>`,
      },
    },
  },
};

export const BlockingOperation: Story = {
  render: Template,
  args: {
    ...Default.args,
    isBlockingOperation: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "A room an operation is running over, which must not be picked or opened until it ends: hover it, click it or right-click it and nothing happens (`isBlockingOperation`). It looks the same as an idle room, so show the operation somewhere else.",
      },
      source: {
        code: `<RoomTile
  item={{ id: "room-1", title: "Sample Room", roomType: "collaboration", tags: [...] }}
  element={<PublicRoomIconReactSvg />}
  contextOptions={contextOptions}
  isBlockingOperation={true}
>
  <TileContent><Link>Room Content</Link></TileContent>
</RoomTile>`,
      },
    },
  },
};

export const GeneratedTags: Story = {
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
  parameters: {
    docs: {
      description: {
        story:
          "A room with no tags of its own, kept on a connected storage: the tile makes two tags for it: first the storage, drawn as its icon alone (`providerType`, `thirdPartyIcon`), then the room type (`getRoomTypeName`). Click either to see `selectOption` in the Actions panel.",
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
  <TileContent><Link>Room Content</Link></TileContent>
</RoomTile>`,
      },
    },
  },
};

export const WithHotkeyBorder: Story = {
  render: Template,
  args: {
    ...Default.args,
    showHotkeyBorder: true,
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
  <TileContent><Link>Room Content</Link></TileContent>
</RoomTile>`,
      },
    },
  },
};

export const RenamingState: Story = {
  render: Template,
  args: {
    ...Default.args,
    isEdit: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "A room whose name is being edited: the logo and the checkbox go, so the name can become a text field, and hovering no longer tints the tile (`isEdit`).",
      },
      source: {
        code: `<RoomTile
  item={{ id: "room-1", title: "Sample Room", roomType: "collaboration", tags: [...] }}
  element={<PublicRoomIconReactSvg />}
  contextOptions={contextOptions}
  isEdit
>
  <TileContent><Link>Room Content</Link></TileContent>
</RoomTile>`,
      },
    },
  },
};

export const CustomBottomRow: Story = {
  render: Template,
  args: {
    ...Default.args,
    customBottomContent: (isHovered, tags) => (
      <Text fontSize="12px">
        {isHovered ? "Open room" : `${tags.length} tag`}
      </Text>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          "A room whose bottom row is the host's own: here a line of text that counts the tags and changes when the pointer is over the tile (`customBottomContent`). The tile no longer draws its tags.",
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
  <TileContent><Link>Room Content</Link></TileContent>
</RoomTile>`,
      },
    },
  },
};

export const CssCustomization: Story = {
  render: () => (
    <div
      style={
        {
          "--tile-bg": "#f4f9fd",
          "--tile-border-style": "1px solid #0082c9",
          "--tile-radius": "16px",
          "--tile-hover-bg": "#cce5f6",
          "--tile-icon-color": "#0082c9",
          "--tile-tag-hover-bg": "#e6f3fb",
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
            selectTag={() => {}}
            selectOption={() => {}}
            getRoomTypeName={(type: string) => type}
            columnCount={1}
          >
            <TileContent>
              <Link>{title}</Link>
            </TileContent>
          </RoomTile>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `The variables are listed under CSS variables on this page.

Two instances:
- **Sample Room** — for every variable but the hotkey colour; hover it for \`--tile-hover-bg\` and \`--tile-tag-hover-bg\`.
- **Team Room** — \`showHotkeyBorder\`, for \`--tile-hotkey-color\`.`,
      },
      source: {
        code: `<div style={{
  "--tile-bg": "#f4f9fd",
  "--tile-border-style": "1px solid #0082c9",
  "--tile-radius": "16px",
  "--tile-hover-bg": "#cce5f6",
  "--tile-icon-color": "#0082c9",
  "--tile-tag-hover-bg": "#e6f3fb",
  "--tile-hotkey-color": "#e0662e",
  "--tile-padding": "12px 0",
  "--tile-row-gap": "12px",
}}>
  <RoomTile item={room} element={<RoomLogo />} contextOptions={options} badges={badges} columnCount={1}>
    <TileContent><Link>Sample Room</Link></TileContent>
  </RoomTile>
  <RoomTile item={teamRoom} element={<RoomLogo />} contextOptions={options} badges={badges} columnCount={1} showHotkeyBorder>
    <TileContent><Link>Team Room</Link></TileContent>
  </RoomTile>
</div>`,
      },
    },
  },
};
