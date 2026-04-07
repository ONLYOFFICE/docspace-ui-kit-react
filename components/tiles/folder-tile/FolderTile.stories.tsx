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

import type { ComponentProps, CSSProperties } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import type { FolderTileProps } from "./FolderTile.types";

import { useState } from "react";

import Folder32ReactSvg from "../../../assets/icons/32/folder.svg";
import ImageReactSvg from "../../../assets/icons/96/folder.svg";
import { Link } from "../../link";
import { Badge } from "../../badge";

import { FolderTile } from ".";
import { TileContent } from "../tile-content";

const element = <Folder32ReactSvg />;

const contextOptions = [
  {
    id: "option_copy-to",
    key: "copy-to",
    label: "Copy",
    onClick: () => {},
    disabled: false,
  },
  {
    id: "option_move-to",
    key: "move-to",
    label: "Move to",
    onClick: () => {},
    disabled: false,
  },
];

const badges = (
  <div className="badges">
    <Badge
      noHover
      className="badge badge-version tablet-badge icons-group"
      backgroundColor="#A3A9AE"
      label="1"
      title="my badge"
      style={{
        width: "max-content",
      }}
      onClick={() => {}}
    />
  </div>
);

const meta = {
  title: "UI/Tiles/FolderTile",
  component: FolderTile,
  parameters: {
    docs: {
      description: {
        component: `Folder tile component for displaying folder information in a tile format.

### Features

- **Folder Icon**: Displays folder icon with optional large preview
- **Selectable**: Supports checked/selected state with checkbox
- **Indeterminate State**: Partial selection indicator for nested content
- **Progress State**: Loading indicator for folder operations
- **Badges**: Display status badges on the folder
- **Big Folder Mode**: Enlarged folder view with thumbnail preview
- **Context Menu**: Right-click context menu for folder actions

### Usage

\`\`\`tsx
import { FolderTile } from "@docspace/ui-kit/components/tiles/folder-tile";
import { TileContent } from "@docspace/ui-kit/components/tiles/tile-content";

<FolderTile
  item={{ id: "1", title: "My Folder", isFolder: true }}
  element={<FolderIcon />}
  contextOptions={options}
  onSelect={handleSelect}
>
  <TileContent><Link>My Folder</Link></TileContent>
</FolderTile>
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
    inProgress: {
      control: "boolean",
      description: "Whether the tile shows a loading/progress indicator",
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
} satisfies Meta<typeof FolderTile>;

type Story = StoryObj<ComponentProps<typeof FolderTile>>;

export default meta;

const Template = ({ checked: initialChecked, ...args }: FolderTileProps) => {
  const [checked, setChecked] = useState(initialChecked);

  const onSelect = (isSelected: boolean) => {
    setChecked(isSelected);
  };

  return (
    <div style={{ maxWidth: "300px", margin: "30px" }}>
      <FolderTile {...args} checked={checked} onSelect={onSelect}>
        <TileContent>
          <Link>Folder Content</Link>
        </TileContent>
      </FolderTile>
    </div>
  );
};

export const Default: Story = {
  render: Template,
  args: {
    item: {
      id: "folder-1",
      title: "My Folder",
      isFolder: true,
      contextOptions: ["copy-to", "move-to"],
    },
    element,
    contextOptions,
    badges,
    onSelect: () => {},
    setSelection: () => {},
    withCtrlSelect: () => {},
    withShiftSelect: () => {},
    getContextModel: () => contextOptions,
  },
  parameters: {
    docs: {
      description: {
        story: "Basic folder tile with selection functionality",
      },
      source: {
        code: `<FolderTile
  item={{ id: "folder-1", title: "My Folder", isFolder: true }}
  element={<Folder32ReactSvg />}
  contextOptions={contextOptions}
  badges={badges}
  onSelect={handleSelect}
>
  <TileContent><Link>Folder Content</Link></TileContent>
</FolderTile>`,
      },
    },
  },
};

export const Big: Story = {
  render: Template,
  args: {
    item: {
      id: "folder-1",
      title: "My Folder",
      isFolder: true,
      contextOptions: ["copy-to", "move-to"],
    },
    element,
    contextOptions,
    badges,
    isBigFolder: true,
    temporaryIcon: <ImageReactSvg />,
    onSelect: () => {},
    setSelection: () => {},
    withCtrlSelect: () => {},
    withShiftSelect: () => {},
    getContextModel: () => contextOptions,
  },
  parameters: {
    docs: {
      description: {
        story: "Big folder tile with selection functionality",
      },
      source: {
        code: `<FolderTile
  item={{ id: "folder-1", title: "My Folder", isFolder: true }}
  element={<Folder32ReactSvg />}
  contextOptions={contextOptions}
  badges={badges}
  isBigFolder={true}
  temporaryIcon={<ImageReactSvg />}
  onSelect={handleSelect}
>
  <TileContent><Link>Folder Content</Link></TileContent>
</FolderTile>`,
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
        story: "Folder tile in checked state",
      },
      source: {
        code: `<FolderTile
  item={{ id: "folder-1", title: "My Folder", isFolder: true }}
  element={<Folder32ReactSvg />}
  contextOptions={contextOptions}
  checked={true}
  onSelect={handleSelect}
>
  <TileContent><Link>Folder Content</Link></TileContent>
</FolderTile>`,
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
        story: "Folder tile in progress state",
      },
      source: {
        code: `<FolderTile
  item={{ id: "folder-1", title: "My Folder", isFolder: true }}
  element={<Folder32ReactSvg />}
  contextOptions={contextOptions}
  inProgress={true}
>
  <TileContent><Link>Folder Content</Link></TileContent>
</FolderTile>`,
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
          "--tile-hotkey-color": "#0082c9",
          "--tile-badge-bg": "#e6f3fb",
          "--tile-badge-radius": "6px",
          "--tile-badge-box-shadow": "0 2px 8px rgba(0,130,201,0.2)",
          "--tile-text-size": "13px",
        } as CSSProperties
      }
    >
      <div style={{ maxWidth: "300px", margin: "30px" }}>
        <FolderTile
          item={{
            id: "folder-1",
            title: "My Folder",
            isFolder: true,
            contextOptions: ["copy-to", "move-to"],
          }}
          element={element}
          contextOptions={contextOptions}
          onSelect={() => {}}
          getContextModel={() => contextOptions}
        >
          <TileContent>
            <Link>My Folder</Link>
          </TileContent>
        </FolderTile>
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
| \`--tile-badge-bg\` | Badge background color | theme-based |
| \`--tile-badge-radius\` | Badge border radius | \`4px\` |
| \`--tile-badge-box-shadow\` | Badge box shadow | theme-based |
| \`--tile-text-size\` | Folder name font size | \`14px\` |`,
      },
    },
  },
};
