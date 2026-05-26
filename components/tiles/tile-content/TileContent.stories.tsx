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

import WordSvgUrl from "../../../assets/icons/32/word.svg";

import { TileContent } from ".";
import { BaseTile } from "../base-tile";
import { Link } from "../../link";
import { Text } from "../../text";
import { Badge } from "../../badge";

const element = <WordSvgUrl />;

const mockContextOptions = [
	{ key: "edit", label: "Edit" },
	{ key: "delete", label: "Delete" },
];

const meta = {
	title: "UI/Tiles/TileContent",
	component: TileContent,
	parameters: {
		docs: {
			description: {
				component: `Content wrapper component for tile items, handles layout and spacing.

### Features

- **Flexible Layout**: Wraps any content within a tile structure
- **Text Overflow**: Handles long text with ellipsis truncation
- **Composable**: Works with Link, Text, Badge, and other components
- **Consistent Spacing**: Provides uniform padding and alignment within tiles

### Usage

\`\`\`tsx
import { TileContent } from "@docspace/ui-kit/components/tiles/tile-content";
import { BaseTile } from "@docspace/ui-kit/components/tiles/base-tile";

<BaseTile item={item} element={icon} topContent={
  <TileContent>
    <Link>Document.docx</Link>
  </TileContent>
} />
\`\`\``,
			},
		},
	},
	decorators: [
		(Story) => (
			<div style={{ maxWidth: "300px", margin: "20px" }}>
				<BaseTile
					item={{ id: "1", title: "Document.docx" }}
					contextOptions={mockContextOptions}
					element={element}
					topContent={<Story />}
				/>
			</div>
		),
	],
} satisfies Meta<typeof TileContent>;

type Story = StoryObj<ComponentProps<typeof TileContent>>;

export default meta;

export const Default: Story = {
	args: {
		children: <Link>Document.docx</Link>,
	},
	parameters: {
		docs: {
			description: {
				story: "Basic tile content with a link inside BaseTile",
			},
			source: {
				code: `<TileContent>
  <Link>Document.docx</Link>
</TileContent>`,
			},
		},
	},
};

export const WithText: Story = {
	args: {
		children: (
			<Text fontSize="14px" fontWeight={600}>
				My Document
			</Text>
		),
	},
	parameters: {
		docs: {
			description: {
				story: "Tile content with text component inside BaseTile",
			},
			source: {
				code: `<TileContent>
  <Text fontSize="14px" fontWeight={600}>My Document</Text>
</TileContent>`,
			},
		},
	},
};

export const WithMultipleElements: Story = {
	args: {
		children: (
			<div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
				<Link>Document.docx</Link>
				<Badge label="New" backgroundColor="#4781D1" color="#fff" />
			</div>
		),
	},
	parameters: {
		docs: {
			description: {
				story: "Tile content with multiple child elements",
			},
			source: {
				code: `<TileContent>
  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
    <Link>Document.docx</Link>
    <Badge label="New" backgroundColor="#4781D1" color="#fff" />
  </div>
</TileContent>`,
			},
		},
	},
};

export const CssCustomization: Story = {
	// Story-level decorator wraps OUTSIDE the meta decorator (which already
	// embeds TileContent inside BaseTile), so CSS vars cascade into BaseTile.
	decorators: [
		(Story) => (
			<div
				style={
					{
						"--tile-bg": "#e6f3fb",
						"--tile-border-style": "1px solid #0082c9",
						"--tile-radius": "16px",
						"--tile-hover-bg": "#cce5f6",
						"--tile-icon-color": "#0082c9",
					} as CSSProperties
				}
			>
				<Story />
			</div>
		),
	],
	args: {
		children: <Link>Document.docx</Link>,
	},
	parameters: {
		docs: {
			description: {
				story: `TileContent is a structural wrapper — its appearance is inherited from the parent BaseTile. CSS Custom Properties are set on the BaseTile container:

| Variable | Description | Default |
|----------|-------------|---------|
| \`--tile-bg\` | Tile background color | theme-based |
| \`--tile-border-style\` | Tile border | theme-based |
| \`--tile-radius\` | Tile border radius | \`12px\` |
| \`--tile-hover-bg\` | Hover/checked background | theme-based |
| \`--tile-icon-color\` | Icon button color | theme-based |

See **BaseTile**, **FileTile**, **FolderTile**, or **RoomTile** CSS Custom Properties stories for the full list.`,
			},
		},
	},
};
