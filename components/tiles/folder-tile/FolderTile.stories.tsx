import type { ComponentProps, CSSProperties } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

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
        component: `The card for one folder in a tile listing: a single name row with an icon, a checkbox and a menu, or a taller card with a picture above that row.

### Features

- **Folder Icon**: Shows the folder icon beside the name and swaps it for a checkbox on hover
- **Click To Select**: Selects the tile on a plain click or from the checkbox, and hands Ctrl-, Cmd- and Shift-clicks to callbacks of their own
- **Indeterminate Checkbox**: Draws the checkbox half-filled, for a folder whose contents are only partly selected
- **Progress Loader**: Replaces the icon and the checkbox with a small loader while the folder is busy
- **Badges**: Places badges at the end of the name row, next to the menu, or over the picture in the tall layout
- **Tall Layout**: Puts a picture above the name row instead of drawing the row alone
- **Actions Menu**: Opens the folder's menu from a three-dot button, drawn when the item carries a \`contextOptions\` key, and on right-click when \`getContextModel\` is given
- **Hotkey Outline**: Turns the tile's border the accent colour to mark the tile the keyboard is on

### Usage

\`\`\`tsx
import { FolderTile } from "@onlyoffice/apps-ui-kit/components/tiles/folder-tile";
import { TileContent } from "@onlyoffice/apps-ui-kit/components/tiles/tile-content";

<FolderTile
  item={{ id: "1", title: "My Folder", isFolder: true }}
  element={<FolderIcon />}
  contextOptions={options}
  onSelect={handleSelect}
>
  <TileContent><Link>My Folder</Link></TileContent>
</FolderTile>

// The tall layout, with a picture above the name row
<FolderTile item={folder} element={<FolderIcon />} contextOptions={options} isBigFolder temporaryIcon={<FolderPicture />}>
  <TileContent><Link>{folder.title}</Link></TileContent>
</FolderTile>
\`\`\``,
      },
    },
  },
  argTypes: {
    checked: {
      control: "boolean",
      description:
        "Ticks the checkbox and keeps it in place of the icon, and tints the whole tile",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    inProgress: {
      control: "boolean",
      description: "Replaces the icon and the checkbox with a small loader",
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
    isBigFolder: {
      control: "boolean",
      description:
        "Switches from the single 64px row to a 220px card with a picture above the row",
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
    isActive: {
      control: "boolean",
      description:
        "Keeps the hover tint and the underlined name on the tile being acted on",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isDragging: {
      control: "boolean",
      description:
        "Marks the tile as being dragged; hovering it then neither tints it nor swaps the icon for the checkbox",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isEdit: {
      control: "boolean",
      description:
        "Removes the icon and the checkbox while the folder is renamed, and stops hovering from tinting the tile",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    item: {
      control: "object",
      description:
        "The folder the tile stands for, passed back through the callbacks. A `contextOptions` key on it is what draws the three-dot button",
    },
    children: {
      control: false,
      description:
        "The name row beside the icon, usually a `TileContent`; only the first element is shown",
    },
    element: {
      control: false,
      description:
        "The folder icon beside the name; without it the tile has neither the icon nor the checkbox",
    },
    temporaryIcon: {
      control: false,
      description:
        "The picture of the tall layout, drawn at the bottom of its upper part: an element as given, or the address of an SVG",
    },
    badges: {
      control: false,
      description:
        "Badges at the end of the name row, or in the top end corner of the picture in the tall layout; give their wrapper the class `badges` so clicking them does not select the tile",
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
    onSelect: {
      description:
        "Called with the new checked state and the item on a plain click on the tile, from the checkbox, and when the icon is tapped on a phone",
    },
    setSelection: {
      description:
        "Called with an empty list just before a plain click selects the tile, unless the click landed on an image, an input or an icon",
    },
    withCtrlSelect: {
      description:
        "Called with the item on a Ctrl- or Cmd-click, which then does not select the tile",
    },
    withShiftSelect: {
      description:
        "Called with the item on a Shift-click, which then does not select the tile",
    },
    tileContextClick: {
      description:
        "Called just before the menu opens, with `true` when a right-click opened it",
    },
    hideContextMenu: {
      description: "Called when the menu closes",
    },
    forwardRef: {
      control: false,
      description:
        "Ref to the outer element, which the tile also clicks on a right-click when its menu is not mounted yet",
    },
    dataTestId: {
      control: "text",
      description: "Value of `data-testid` on the outer element",
      table: {
        defaultValue: { summary: '"tile"' },
      },
    },
    thumbnailClick: {
      control: false,
      description: "Ignored: nothing in the tile calls it",
    },
    contextMenuHeader: {
      control: false,
      description:
        "Ignored: the menu's header is built from the first child's `item`",
    },
    dragging: {
      control: false,
      description: "Ignored: `isDragging` is the one that is read",
    },
  },
  args: {
    onSelect: fn(),
    setSelection: fn(),
    withCtrlSelect: fn(),
    withShiftSelect: fn(),
    tileContextClick: fn(),
    hideContextMenu: fn(),
  },
} satisfies Meta<typeof FolderTile>;

type Story = StoryObj<ComponentProps<typeof FolderTile>>;

export default meta;

const Template = ({
  checked: initialChecked,
  onSelect: onSelectArg,
  ...args
}: FolderTileProps) => {
  const [checked, setChecked] = useState(initialChecked);

  const onSelect: FolderTileProps["onSelect"] = (isSelected, item) => {
    setChecked(isSelected);
    onSelectArg?.(isSelected, item);
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
    getContextModel: () => contextOptions,
  },
  parameters: {
    docs: {
      description: {
        story:
          "A folder as a single row: the icon, the name, and a badge beside the menu. Click the tile to select it, Ctrl- or Shift-click it to see the other callbacks in the Actions panel, and change any other prop live in the Controls panel below.",
      },
      source: {
        code: `<FolderTile
  item={{ id: "folder-1", title: "My Folder", isFolder: true, contextOptions: ["copy-to", "move-to"] }}
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
    getContextModel: () => contextOptions,
  },
  parameters: {
    docs: {
      description: {
        story:
          "The tall layout, for a grid where folders should stand out as much as files: a picture on top with the badge in its corner, and the name row below it (`isBigFolder`, `temporaryIcon`).",
      },
      source: {
        code: `<FolderTile
  item={{ id: "folder-1", title: "My Folder", isFolder: true, contextOptions: ["copy-to", "move-to"] }}
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
        story:
          "A selected folder, as it looks among others the reader has picked: the checkbox stays ticked in place of the icon and the whole tile is tinted (`checked`).",
      },
      source: {
        code: `<FolderTile
  item={{ id: "folder-1", title: "My Folder", isFolder: true, contextOptions: ["copy-to", "move-to"] }}
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
        story:
          "A folder that is busy, being copied or moved: a small loader stands where the icon and the checkbox were (`inProgress`).",
      },
      source: {
        code: `<FolderTile
  item={{ id: "folder-1", title: "My Folder", isFolder: true, contextOptions: ["copy-to", "move-to"] }}
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
        code: `<FolderTile
  item={{ id: "folder-1", title: "My Folder", isFolder: true, contextOptions: ["copy-to", "move-to"] }}
  element={<Folder32ReactSvg />}
  contextOptions={contextOptions}
  badges={badges}
  showHotkeyBorder
>
  <TileContent><Link>Folder Content</Link></TileContent>
</FolderTile>`,
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
          "A folder whose name is being edited: the icon and the checkbox go, so the name row can hold a text field, and hovering no longer tints the tile (`isEdit`).",
      },
      source: {
        code: `<FolderTile
  item={{ id: "folder-1", title: "My Folder", isFolder: true, contextOptions: ["copy-to", "move-to"] }}
  element={<Folder32ReactSvg />}
  contextOptions={contextOptions}
  badges={badges}
  isEdit
>
  <TileContent><Link>Folder Content</Link></TileContent>
</FolderTile>`,
      },
    },
  },
};

export const RightToLeft: Story = {
  render: (args) => (
    <div dir="rtl">
      <Template {...args} />
    </div>
  ),
  globals: { direction: "rtl" },
  args: {
    ...Default.args,
  },
  parameters: {
    noPadding: true,
    docs: {
      // Framed: an inline RTL story would flip the whole Docs page.
      story: { inline: false, height: "150px" },
      description: {
        story:
          'The same row in a right-to-left layout: the icon moves to the right-hand end, the name is aligned right after it, and the badge and the three-dot button move to the left edge. The wrapper carries `dir="rtl"` for the layout; the side the three-dot menu opens on comes from the theme\'s `interfaceDirection` (the Direction toolbar).',
      },
      source: {
        code: `<div dir="rtl">
  <FolderTile item={folder} element={<Folder32ReactSvg />} contextOptions={contextOptions} badges={badges}>
    <TileContent><Link>Folder Content</Link></TileContent>
  </FolderTile>
</div>`,
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
          "--tile-hover-text-decoration": "none",
          "--tile-hotkey-color": "#e0662e",
          "--tile-badge-bg": "#e6f3fb",
          "--tile-badge-radius": "8px",
          "--tile-badge-box-shadow": "0 2px 8px rgba(0,130,201,0.3)",
          "--tile-text-size": "13px",
          "--tile-text-weight": "600",
          "--tile-text-color": "#004d77",
          "--tile-text-line-height": "20px",
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
          badges={badges}
          getContextModel={() => contextOptions}
        >
          <TileContent>
            <Link>My Folder</Link>
          </TileContent>
        </FolderTile>
      </div>
      <div style={{ maxWidth: "300px", margin: "30px" }}>
        <FolderTile
          item={{
            id: "folder-2",
            title: "Projects",
            isFolder: true,
            contextOptions: ["copy-to", "move-to"],
          }}
          element={element}
          contextOptions={contextOptions}
          badges={badges}
          isBigFolder
          temporaryIcon={<ImageReactSvg />}
          getContextModel={() => contextOptions}
        >
          <TileContent>
            <Link>Projects</Link>
          </TileContent>
        </FolderTile>
      </div>
      <div
        style={
          {
            maxWidth: "300px",
            margin: "30px",
            "--folder-tile-border-style": "2px solid",
          } as CSSProperties
        }
      >
        <FolderTile
          item={{
            id: "folder-3",
            title: "Archive",
            isFolder: true,
            contextOptions: ["copy-to", "move-to"],
          }}
          element={element}
          contextOptions={contextOptions}
          showHotkeyBorder
          getContextModel={() => contextOptions}
        >
          <TileContent>
            <Link>Archive</Link>
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
| \`--tile-bg\` | Background of the tall layout, and of the box behind the icon on hover; the single row has none of its own | theme-based |
| \`--tile-border-style\` | Border of the tile, shared with the other tiles | theme-based |
| \`--folder-tile-border-style\` | Border of a folder tile only; wins over \`--tile-border-style\` | theme-based |
| \`--tile-radius\` | Corner radius of the tile | \`12px\` |
| \`--tile-hover-bg\` | Background of the tile on hover and when checked | theme-based |
| \`--tile-hover-text-decoration\` | Decoration of the name on hover | theme-based |
| \`--tile-hotkey-color\` | Border colour while \`showHotkeyBorder\` is on | theme-based |
| \`--tile-badge-bg\` | Background of each badge over the picture (tall layout only) | theme-based |
| \`--tile-badge-radius\` | Corner radius of each badge over the picture (tall layout only) | \`4px\` |
| \`--tile-badge-box-shadow\` | Shadow of each badge over the picture (tall layout only) | theme-based |
| \`--tile-text-size\` | Font size of the name | \`14px\` |
| \`--tile-text-weight\` | Font weight of the name | \`normal\` |
| \`--tile-text-color\` | Colour of the name | inherited |
| \`--tile-text-line-height\` | Line height of the name | \`16px\` |

Three instances:
- **My Folder** — the single row, for the border, radius and name variables; hover it for \`--tile-hover-bg\`, \`--tile-hover-text-decoration\` and \`--tile-bg\` behind the icon.
- **Projects** — the tall layout (\`isBigFolder\`), for \`--tile-bg\` and the badge variables.
- **Archive** — \`showHotkeyBorder\`, for \`--tile-hotkey-color\`, in a wrapper of its own that sets \`--folder-tile-border-style\` to a thicker border.

> **Note:** \`--folder-tile-border-style\` and \`--file-tile-border-style\` allow per-component border control
> while sharing the \`--tile-border-style\` fallback between both tile types.`,
      },
      source: {
        code: `<div style={{
  "--tile-bg": "#f4f9fd",
  "--tile-border-style": "1px solid #0082c9",
  "--tile-radius": "16px",
  "--tile-hover-bg": "#cce5f6",
  "--tile-hover-text-decoration": "none",
  "--tile-hotkey-color": "#e0662e",
  "--tile-badge-bg": "#e6f3fb",
  "--tile-badge-radius": "8px",
  "--tile-badge-box-shadow": "0 2px 8px rgba(0,130,201,0.3)",
  "--tile-text-size": "13px",
  "--tile-text-weight": "600",
  "--tile-text-color": "#004d77",
  "--tile-text-line-height": "20px",
}}>
  <FolderTile item={folder} element={<FolderIcon />} contextOptions={options} badges={badges}>
    <TileContent><Link>My Folder</Link></TileContent>
  </FolderTile>

  <FolderTile item={projects} element={<FolderIcon />} contextOptions={options} badges={badges} isBigFolder temporaryIcon={<FolderPicture />}>
    <TileContent><Link>Projects</Link></TileContent>
  </FolderTile>

  <div style={{ "--folder-tile-border-style": "2px solid" }}>
    <FolderTile item={archive} element={<FolderIcon />} contextOptions={options} showHotkeyBorder>
      <TileContent><Link>Archive</Link></TileContent>
    </FolderTile>
  </div>
</div>`,
      },
    },
  },
};
