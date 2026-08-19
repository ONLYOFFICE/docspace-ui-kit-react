/*
 * Copyright (C) Ascensio System SIA, 2009-2026
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation, together with the
 * additional terms provided in the LICENSE file.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For
 * details, see the GNU AGPL at: https://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA by email at info@onlyoffice.com
 * or by postal mail at 20A-6 Ernesta Birznieka-Upisha Street, Riga,
 * LV-1050, Latvia, European Union.
 *
 * The interactive user interfaces in modified versions of the Program
 * are required to display Appropriate Legal Notices in accordance with
 * Section 5 of the GNU AGPL version 3.
 *
 * No trademark rights are granted under this License.
 *
 * All non-code elements of the Product, including illustrations,
 * icon sets, and technical writing content, are licensed under the
 * Creative Commons Attribution-ShareAlike 4.0 International License:
 * https://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 * This license applies only to such non-code elements and does not
 * modify or replace the licensing terms applicable to the Program's
 * source code, which remains licensed under the GNU Affero General
 * Public License v3.
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { ComponentProps, CSSProperties } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import type { RoomTileProps } from "./RoomTile.types";

import { useState } from "react";
import PublicRoomIconReactSvg from "../../../assets/icons/32/room/public.svg";
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

export const CssCustomization: Story = {
	render: () => (
		<div
			style={
				{
					"--tile-bg": "#e6f3fb",
					"--tile-border-style": "1px solid #0082c9",
					"--tile-radius": "16px",
					"--tile-hover-bg": "#cce5f6",
					"--tile-icon-color": "#0082c9",
					"--tile-tag-hover-bg": "#cce5f6",
				} as CSSProperties
			}
		>
			<div style={{ maxWidth: "300px", margin: "30px" }}>
				<RoomTile
					item={{
						id: "room-1",
						title: "Sample Room",
						roomType: "collaboration",
						tags: [{ label: "Collaboration", roomType: RoomsType.EditingRoom }],
						contextOptions,
					}}
					element={element}
					contextOptions={contextOptions}
					badges={badges}
					thumbnailClick={() => {}}
					getContextModel={() => contextOptions}
					selectTag={() => {}}
					selectOption={() => {}}
					getRoomTypeName={(type: string) => type}
					columnCount={1}
				>
					<TileContent>
						<Link>Sample Room</Link>
					</TileContent>
				</RoomTile>
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: `CSS Custom Properties for external customization:

| Variable | Description | Default |
|----------|-------------|---------|
| \`--tile-bg\` | Tile background color | theme-based |
| \`--tile-border-style\` | Tile border | theme-based |
| \`--tile-radius\` | Tile border radius | \`12px\` |
| \`--tile-hover-bg\` | Hover/checked background | theme-based |
| \`--tile-icon-color\` | Icon button color | theme-based |
| \`--tile-tag-hover-bg\` | Tag background on hover/checked | theme-based |`,
			},
		},
	},
};
