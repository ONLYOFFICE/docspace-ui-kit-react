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

import type { FileTileProps } from "./FileTile.types";

import { useState } from "react";

import WordSvgUrl from "../../../assets/icons/32/word.svg";

import ImageReactSvg from "../../../assets/emptyview/empty.rooms.root.light.svg";
import LockedReact12Svg from "../../../assets/icons/12/lock.react.svg";
import { Link } from "../../link";
import { Badge } from "../../badge";
import { IconSizeType } from "../../../utils";
import { FileType } from "../../../enums";

import { FileTile } from ".";
import { TileContent } from "../tile-content";
import { IconButton } from "../../icon-button";

const wordElement = <WordSvgUrl />;

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
      isVersionBadge
      className="badge badge-version badge-version-current tablet-badge icons-group"
      backgroundColor="#A3A9AE"
      label="New"
      title="my badge"
      style={{
        width: "max-content",
      }}
      onClick={() => {}}
    />
  </div>
);

const contentElement = (
  <div className="badges">
    <IconButton
      iconNode={<LockedReact12Svg />}
      className="badge lock-file icons-group file-locked"
      size={IconSizeType.medium}
      data-id="file-lock"
      data-locked={false}
      onClick={() => {}}
      color="#A3A9AE"
      isDisabled={false}
      hoverColor="accent"
      title="Lock file"
    />
  </div>
);

const meta = {
  title: "UI/Tiles/FileTile",
  component: FileTile,
  parameters: {
    docs: {
      description: {
        component: `File tile component for displaying file information in a tile format.

### Features

- **File Preview**: Displays file icon and optional thumbnail preview
- **Selectable**: Supports checked/selected state with checkbox
- **Drag Support**: Built-in drag and drop functionality
- **Progress State**: Loading indicator for file operations
- **Badges**: Display status badges (e.g., "New", version info)
- **Content Elements**: Lock icons and other file status indicators
- **Context Menu**: Right-click context menu for file actions

### Usage

\`\`\`tsx
import { FileTile } from "@docspace/ui-kit/components/tiles/file-tile";
import { TileContent } from "@docspace/ui-kit/components/tiles/tile-content";

<FileTile
  item={{ id: "1", title: "Document.docx", fileExst: ".docx", fileType: FileType.Document }}
  element={<WordIcon />}
  contextOptions={options}
  onSelect={handleSelect}
>
  <TileContent><Link>Document.docx</Link></TileContent>
</FileTile>
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
    isDragging: {
      control: "boolean",
      description: "Whether the tile is currently being dragged",
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
  },
} satisfies Meta<typeof FileTile>;

type Story = StoryObj<ComponentProps<typeof FileTile>>;

export default meta;

const Template = ({ checked: initialChecked, ...args }: FileTileProps) => {
  const [checked, setChecked] = useState(initialChecked);

  const onSelect = (isSelected: boolean) => {
    setChecked(isSelected);
  };

  return (
    <div style={{ maxWidth: "300px", margin: "30px" }}>
      <FileTile {...args} checked={checked} onSelect={onSelect}>
        <TileContent>
          <Link>File Content</Link>
        </TileContent>
      </FileTile>
    </div>
  );
};

export const Default: Story = {
  render: Template,
  args: {
    item: {
      id: "file-1",
      title: "Document.docx",
      fileExst: ".docx",
      fileType: FileType.Document,
      contextOptions: ["copy-to", "move-to"],
    },
    element: wordElement,
    contextOptions,
    contentElement,
    badges,
    temporaryIcon: <ImageReactSvg />,
    onSelect: () => {},
    thumbnailClick: () => {},
    setSelection: () => {},
    withCtrlSelect: () => {},
    withShiftSelect: () => {},
    getContextModel: () => contextOptions,
  },
  parameters: {
    docs: {
      description: {
        story: "Basic file tile with selection functionality",
      },
      source: {
        code: `<FileTile
  item={{ id: "file-1", title: "Document.docx", fileExst: ".docx", fileType: FileType.Document }}
  element={<WordSvgUrl />}
  contextOptions={contextOptions}
  contentElement={contentElement}
  badges={badges}
  temporaryIcon={<ImageReactSvg />}
  onSelect={handleSelect}
>
  <TileContent><Link>File Content</Link></TileContent>
</FileTile>`,
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
        story: "File tile in checked state",
      },
      source: {
        code: `<FileTile
  item={{ id: "file-1", title: "Document.docx", fileExst: ".docx", fileType: FileType.Document }}
  element={<WordSvgUrl />}
  contextOptions={contextOptions}
  checked={true}
  onSelect={handleSelect}
>
  <TileContent><Link>File Content</Link></TileContent>
</FileTile>`,
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
        story: "File tile showing progress state",
      },
      source: {
        code: `<FileTile
  item={{ id: "file-1", title: "Document.docx", fileExst: ".docx", fileType: FileType.Document }}
  element={<WordSvgUrl />}
  contextOptions={contextOptions}
  inProgress={true}
>
  <TileContent><Link>File Content</Link></TileContent>
</FileTile>`,
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
        <FileTile
          item={{
            id: "file-1",
            title: "Document.docx",
            fileExst: ".docx",
            fileType: FileType.Document,
            contextOptions: ["copy-to", "move-to"],
          }}
          element={wordElement}
          contextOptions={contextOptions}
          temporaryIcon={<ImageReactSvg />}
          onSelect={() => {}}
          getContextModel={() => contextOptions}
        >
          <TileContent>
            <Link>Document.docx</Link>
          </TileContent>
        </FileTile>
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
| \`--file-tile-border-style\` | FileTile-specific border (overrides \`--tile-border-style\`) | theme-based |
| \`--tile-border-style\` | Shared tile border fallback | theme-based |
| \`--tile-radius\` | Tile border radius | \`12px\` |
| \`--tile-hover-bg\` | Hover/checked background | theme-based |
| \`--tile-icon-color\` | Icon button color | theme-based |
| \`--tile-icon-display\` | Show/hide the file icon (\`flex\` or \`none\`) | \`flex\` |
| \`--tile-hotkey-color\` | Hotkey navigation border color | theme-based |
| \`--tile-badge-bg\` | Badge background color | theme-based |
| \`--tile-badge-radius\` | Badge border radius | \`3px\` |
| \`--tile-badge-box-shadow\` | Badge box shadow | theme-based |
| \`--tile-text-size\` | File name font size | \`14px\` |
| \`--tile-text-weight\` | File name font weight | \`normal\` |
| \`--tile-text-color\` | File name text color | theme-based |
| \`--tile-text-line-height\` | File name line height | \`16px\` |
| \`--tile-hover-text-decoration\` | Text decoration on hover | theme-based |
| \`--tile-bottom-padding-inline\` | Inline padding of the bottom info section | \`0\` |
| \`--tile-thumbnail-padding-inline\` | Horizontal inset of thumbnail inside container | \`0\` |
| \`--tile-thumbnail-height\` | Height of the thumbnail container | \`156px\` |
| \`--tile-thumbnail-bg\` | Thumbnail background color | transparent |
| \`--tile-thumbnail-image-radius\` | Thumbnail image border radius | theme-based |
| \`--tile-thumbnail-image-hover-bg\` | Thumbnail background on tile hover | transparent |
| \`--tile-thumbnail-transition\` | Thumbnail background transition | \`background 0.2s\` |
| \`--tile-option-button-padding-end\` | Trailing padding of the context menu button | \`16px\` |
| \`--tile-grid-padding-inline\` | Horizontal padding applied to the grid container | \`0\` |
| \`--tile-min-width\` | Minimum tile width in the grid | \`clamp(216px, 13.4vw, 360px)\` |`,
      },
      source: {
        code: `// Nextcloud-style flat tiles — no border, hidden icon, padding
<div style={{
  "--tile-bg": "transparent",
  "--file-tile-border-style": "none",
  "--tile-radius": "8px",
  "--tile-hover-bg": "#f5f5f5",
  "--tile-icon-display": "none",
  "--tile-bottom-padding-inline": "16px",
  "--tile-thumbnail-padding-inline": "16px",
  "--tile-text-weight": "400",
  "--tile-text-color": "#222222",
  "--tile-badge-box-shadow": "none",
  "--tile-min-width": "198px",
}}>
  <FileTile item={item} element={element} contextOptions={options} onSelect={handleSelect}>
    <TileContent><Link>Document.docx</Link></TileContent>
  </FileTile>
</div>`,
      },
    },
  },
};
