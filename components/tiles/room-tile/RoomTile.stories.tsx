// (c) Copyright Ascensio System SIA 2009-2026
//
// This program is a free software product.
// You can redistribute it and/or modify it under the terms
// of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
// Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
// to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
// any third-party rights.
//
// This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
// the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
//
// You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
//
// The  interactive user interfaces in modified source and object code versions of the Program must
// display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
//
// Pursuant to Section 7(b) of the License you must retain the original Product logo when
// distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
// trademark law for use of our trademarks.
//
// All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
// content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
// International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode

import type { ComponentProps } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import type { RoomTileProps } from "./RoomTile.types";

import { useState } from "react";
import PublicRoomIconReactSvg from "../../../assets/icons/32/room/public.react.svg";
import UnpinReactSvg from "../../../assets/unpin.react.svg";

import { RoomsType } from "../../../enums";

import { Link } from "../../link";
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
		docs: {
			description: {
				component: `Room tile component for displaying room information in a tile format.

### Features

- **Room Icon**: Displays room type icon with visual identity
- **Selectable**: Supports checked/selected state with checkbox
- **Active State**: Visual highlight for the currently active room
- **Blocking Operation**: Indicates when a room operation is in progress
- **Indeterminate State**: Partial selection indicator
- **Tags**: Display room type tags below the room title
- **Pin Badge**: Shows pinned state with unpin action
- **Context Menu**: Right-click context menu for room actions

### Usage

\`\`\`tsx
import { RoomTile } from "@docspace/ui-kit/components/tiles/room-tile";
import { TileContent } from "@docspace/ui-kit/components/tiles/tile-content";

<RoomTile
  item={{ id: "1", title: "Sample Room", roomType: "collaboration", tags: [] }}
  element={<PublicRoomIcon />}
  contextOptions={options}
  onSelect={handleSelect}
>
  <TileContent><Link>Room Content</Link></TileContent>
</RoomTile>
\`\`\``,
			},
		},
	},
	argTypes: {
		checked: {
			control: "boolean",
			description: "Whether the tile is selected/checked",
			table: {
				defaultValue: { summary: "false" },
			},
		},
		isActive: {
			control: "boolean",
			description: "Whether the tile is in active state",
			table: {
				defaultValue: { summary: "false" },
			},
		},
		isBlockingOperation: {
			control: "boolean",
			description:
				"Whether a blocking operation is in progress on the room",
			table: {
				defaultValue: { summary: "false" },
			},
		},
		indeterminate: {
			control: "boolean",
			description:
				"Whether the checkbox shows an indeterminate state for partial selection",
			table: {
				defaultValue: { summary: "false" },
			},
		},
	},
} satisfies Meta<typeof RoomTile>;

type Story = StoryObj<ComponentProps<typeof RoomTile>>;

export default meta;

const Template = ({ checked: initialChecked, ...args }: RoomTileProps) => {
	const [checked, setChecked] = useState(initialChecked);

	const onSelect = (isSelected: boolean) => {
		setChecked(isSelected);
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
		thumbnailClick: () => {},
		getContextModel: () => contextOptions,
		selectTag: () => {},
		selectOption: () => {},
		getRoomTypeName: (type: string) => type,
		columnCount: 1,
	},
	parameters: {
		docs: {
			description: {
				story: "Basic room tile with selection functionality",
			},
			source: {
				code: `<RoomTile
  item={{ id: "room-1", title: "Sample Room", roomType: "collaboration", tags: [...] }}
  element={<PublicRoomIconReactSvg />}
  contextOptions={contextOptions}
  badges={badges}
  getContextModel={() => contextOptions}
  columnCount={1}
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
				story: "Room tile in checked state",
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
				story: "Room tile showing progress state",
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
				story: "Room tile showing blocking operation state",
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
