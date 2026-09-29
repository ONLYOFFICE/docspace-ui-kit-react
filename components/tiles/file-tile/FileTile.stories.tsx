import type { ComponentProps, CSSProperties } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

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

// A bundled preview image, so the screenshots do not depend on a network host.
const thumbnail = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="160"><rect width="320" height="160" fill="#f3f4f4"/><rect x="40" y="24" width="240" height="136" fill="#ffffff"/><rect x="64" y="48" width="120" height="8" fill="#a3a9ae"/><rect x="64" y="68" width="192" height="6" fill="#d0d5da"/><rect x="64" y="84" width="176" height="6" fill="#d0d5da"/><rect x="64" y="100" width="184" height="6" fill="#d0d5da"/></svg>',
)}`;

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
        component: `The card for one document in a tile listing: a preview over the file's name, with a checkbox, badges and a menu.

### Features

- **Thumbnail Preview**: Shows the file's preview image in the upper part, and a placeholder icon when there is none or it fails to load
- **Click To Select**: Selects the tile on a plain click, and from the checkbox that takes the icon's place on hover
- **Multi-Select Clicks**: Hands Ctrl- or Cmd-clicks and Shift-clicks to callbacks of their own instead of selecting
- **Badges and Quick Actions**: Draws badges in the top end corner of the preview and a column of quick-action buttons in the top start corner
- **Progress Loader**: Replaces the icon and the checkbox with a small loader while the file is busy
- **Actions Menu**: Opens the file's menu from a three-dot button, drawn when the item carries a \`contextOptions\` key, and on right-click when \`getContextModel\` is given
- **Hotkey Outline**: Turns the tile's border the accent colour to mark the tile the keyboard is on
- **Renaming State**: Drops the icon and the checkbox while the file is renamed

### Usage

\`\`\`tsx
import { FileTile } from "@onlyoffice/apps-ui-kit/components/tiles/file-tile";
import { TileContent } from "@onlyoffice/apps-ui-kit/components/tiles/tile-content";

<FileTile
  item={{ id: "1", title: "Document.docx", fileExst: ".docx", fileType: FileType.Document }}
  element={<WordIcon />}
  contextOptions={options}
  onSelect={handleSelect}
>
  <TileContent><Link>Document.docx</Link></TileContent>
</FileTile>

// With a preview image and a handler for Ctrl-clicks
<FileTile item={file} element={<WordIcon />} contextOptions={options} thumbnail={file.thumbnailUrl} withCtrlSelect={addToSelection}>
  <TileContent><Link>{file.title}</Link></TileContent>
</FileTile>
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
    isDragging: {
      control: "boolean",
      description:
        "Marks the tile as being dragged; the checkbox then no longer replaces the icon on hover, and nothing else changes",
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
    isActive: {
      control: "boolean",
      description:
        "Keeps the hover tint and the underlined name on the tile being acted on",
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
        "Removes the icon and the checkbox while the file is renamed",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isBlockingOperation: {
      control: "boolean",
      description:
        "Meant to stop the tile reacting to the pointer during an operation; it currently changes nothing",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isHighlight: {
      control: "boolean",
      description:
        "Fades a colour out of the lower part once, over two seconds, to point at a file that was just matched; the kit defines no colour for it (see CSS Customization)",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    item: {
      control: "object",
      description:
        "The file the tile stands for, passed back through the callbacks. A `contextOptions` key on it is what draws the three-dot button; `isPlugin` with `fileTileIcon` puts that icon in place of the preview",
    },
    children: {
      control: false,
      description:
        "The name row beside the icon, usually a `TileContent`; only the first element is shown",
    },
    element: {
      control: false,
      description:
        "The file-type icon beside the name; without it the tile has neither the icon nor the checkbox",
    },
    thumbnail: {
      control: "text",
      description:
        "Address of the preview image, drawn across the upper part; the tile falls back to `temporaryIcon` when it fails to load",
    },
    temporaryIcon: {
      control: false,
      description:
        "Placeholder drawn at the bottom of the upper part when there is no preview: an element as given, or the address of an SVG",
    },
    badges: {
      control: false,
      description:
        "Badges in the top end corner of the preview; give their wrapper the class `badges` so clicking them does not select the tile",
    },
    contentElement: {
      control: false,
      description:
        "A column of quick-action buttons in the top start corner of the preview",
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
    thumbnailClick: {
      description:
        "Called with the event when the preview is clicked; the tile's own click handling runs as well",
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
    thumbSize: {
      control: false,
      description: "Ignored: no value of it changes the tile",
    },
    contextButtonSpacerWidth: {
      control: false,
      description:
        "Ignored: it lands on the outer element as an unknown attribute",
    },
    sideColor: {
      control: false,
      description:
        "Ignored: it lands on the outer element as an unknown attribute",
    },
  },
  args: {
    onSelect: fn(),
    setSelection: fn(),
    withCtrlSelect: fn(),
    withShiftSelect: fn(),
    thumbnailClick: fn(),
    tileContextClick: fn(),
    hideContextMenu: fn(),
  },
} satisfies Meta<typeof FileTile>;

type Story = StoryObj<ComponentProps<typeof FileTile>>;

export default meta;

const Template = ({
  checked: initialChecked,
  onSelect: onSelectArg,
  ...args
}: FileTileProps) => {
  const [checked, setChecked] = useState(initialChecked);

  const onSelect: FileTileProps["onSelect"] = (isSelected, item) => {
    setChecked(isSelected);
    onSelectArg?.(isSelected, item);
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
    getContextModel: () => contextOptions,
  },
  parameters: {
    docs: {
      description: {
        story:
          "A document with no preview yet: a placeholder picture, a badge and a quick action over it, and the name row with the menu. Click the tile to select it, Ctrl- or Shift-click it to see the other callbacks in the Actions panel, and change any other prop live in the Controls panel below.",
      },
      source: {
        code: `<FileTile
  item={{ id: "file-1", title: "Document.docx", fileExst: ".docx", fileType: FileType.Document, contextOptions: ["copy-to", "move-to"] }}
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
        story:
          "A selected file, as it looks among others the reader has picked: the checkbox stays ticked in place of the icon and the whole tile is tinted (`checked`).",
      },
      source: {
        code: `<FileTile
  item={{ id: "file-1", title: "Document.docx", fileExst: ".docx", fileType: FileType.Document, contextOptions: ["copy-to", "move-to"] }}
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
        story:
          "A file that is busy, being uploaded or converted: a small loader stands where the icon and the checkbox were (`inProgress`).",
      },
      source: {
        code: `<FileTile
  item={{ id: "file-1", title: "Document.docx", fileExst: ".docx", fileType: FileType.Document, contextOptions: ["copy-to", "move-to"] }}
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

export const WithThumbnail: Story = {
  render: Template,
  args: {
    ...Default.args,
    thumbnail,
  },
  parameters: {
    docs: {
      description: {
        story:
          "A document with a preview: the image fills the upper part, cropped from the top, and the badges sit over it (`thumbnail`). If the image fails to load, the placeholder from `temporaryIcon` takes its place.",
      },
      source: {
        code: `<FileTile
  item={{ id: "file-1", title: "Document.docx", fileExst: ".docx", contextOptions: ["copy-to", "move-to"] }}
  element={<WordSvgUrl />}
  contextOptions={contextOptions}
  thumbnail={thumbnailUrl}
  temporaryIcon={<ImageReactSvg />}
  badges={badges}
>
  <TileContent><Link>File Content</Link></TileContent>
</FileTile>`,
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
        code: `<FileTile
  item={{ id: "file-1", title: "Document.docx", fileExst: ".docx", contextOptions: ["copy-to", "move-to"] }}
  element={<WordSvgUrl />}
  contextOptions={contextOptions}
  temporaryIcon={<ImageReactSvg />}
  showHotkeyBorder
>
  <TileContent><Link>File Content</Link></TileContent>
</FileTile>`,
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
          "A file whose name is being edited: the icon and the checkbox go, so the name row can hold a text field (`isEdit`).",
      },
      source: {
        code: `<FileTile
  item={{ id: "file-1", title: "Document.docx", fileExst: ".docx", contextOptions: ["copy-to", "move-to"] }}
  element={<WordSvgUrl />}
  contextOptions={contextOptions}
  temporaryIcon={<ImageReactSvg />}
  isEdit
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
          "--tile-bg": "#f4f9fd",
          "--tile-border-style": "1px solid #0082c9",
          "--tile-radius": "16px",
          "--tile-height": "240px",
          "--tile-hover-bg": "#cce5f6",
          "--tile-hover-text-decoration": "none",
          "--tile-badge-bg": "#e6f3fb",
          "--tile-badge-radius": "8px",
          "--tile-badge-box-shadow": "0 2px 8px rgba(0,130,201,0.3)",
          "--tile-text-size": "13px",
          "--tile-text-weight": "600",
          "--tile-text-color": "#004d77",
          "--tile-text-line-height": "20px",
          "--tile-bottom-padding-inline": "8px",
          "--tile-thumbnail-padding-inline": "16px",
          "--tile-thumbnail-height": "140px",
          "--tile-thumbnail-image-radius": "8px",
          "--tile-thumbnail-image-hover-bg": "#e6f3fb",
          "--tile-thumbnail-transition": "background 0.6s",
          "--tile-option-button-padding-end": "8px",
          "--tile-hotkey-color": "#e0662e",
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
          thumbnail={thumbnail}
          badges={badges}
          contentElement={contentElement}
          getContextModel={() => contextOptions}
        >
          <TileContent>
            <Link>Document.docx</Link>
          </TileContent>
        </FileTile>
      </div>
      <div
        style={
          {
            maxWidth: "300px",
            margin: "30px",
            "--file-tile-border-style": "2px solid",
            "--tile-icon-display": "none",
          } as CSSProperties
        }
      >
        <FileTile
          item={{
            id: "file-2",
            title: "Report.docx",
            fileExst: ".docx",
            fileType: FileType.Document,
            contextOptions: ["copy-to", "move-to"],
          }}
          element={wordElement}
          contextOptions={contextOptions}
          temporaryIcon={<ImageReactSvg />}
          showHotkeyBorder
          getContextModel={() => contextOptions}
        >
          <TileContent>
            <Link>Report.docx</Link>
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
| \`--tile-bg\` | Background of the tile | theme-based |
| \`--tile-border-style\` | Border of the tile, shared with the other tiles | theme-based |
| \`--file-tile-border-style\` | Border of a file tile only; wins over \`--tile-border-style\` | theme-based |
| \`--tile-radius\` | Corner radius of the tile | \`12px\` |
| \`--tile-height\` | Height of the whole tile | \`222px\` |
| \`--tile-hover-bg\` | Background of the name row on hover, and of the whole tile when checked | theme-based |
| \`--tile-hover-text-decoration\` | Decoration of the name on hover | theme-based |
| \`--tile-icon-display\` | \`display\` of the icon and checkbox box; \`none\` hides both | \`flex\` |
| \`--tile-hotkey-color\` | Border colour while \`showHotkeyBorder\` is on | theme-based |
| \`--tile-badge-bg\` | Background of each badge and quick action over the preview | theme-based |
| \`--tile-badge-radius\` | Corner radius of each badge and quick action | \`3px\` |
| \`--tile-badge-box-shadow\` | Shadow of each badge and quick action | theme-based |
| \`--tile-text-size\` | Font size of the name | \`14px\` |
| \`--tile-text-weight\` | Font weight of the name | \`normal\` |
| \`--tile-text-color\` | Colour of the name | inherited |
| \`--tile-text-line-height\` | Line height of the name | \`16px\` |
| \`--tile-bottom-padding-inline\` | Side padding of the name row | \`0\` |
| \`--tile-thumbnail-padding-inline\` | Side inset of the preview image | \`0\` |
| \`--tile-thumbnail-height\` | Height of the preview image | \`100%\` |
| \`--tile-thumbnail-image-radius\` | Corner radius of the preview image | the tile's top corners |
| \`--tile-thumbnail-image-hover-bg\` | Background of the upper part on hover | the tile background |
| \`--tile-thumbnail-transition\` | Transition of the upper part's background | \`background 0.2s\` |
| \`--tile-option-button-padding-end\` | End padding of the three-dot button | \`16px\` |
| \`--highlightColor\` | Colour that fades out of the name row while \`isHighlight\` plays; the kit sets none, so without it nothing shows | none |

Two instances:
- **Document.docx** — a preview, a badge and a quick action, for every variable except \`--file-tile-border-style\`, \`--tile-icon-display\`, \`--tile-hotkey-color\` and \`--highlightColor\`; hover it for the hover variables.
- **Report.docx** — \`showHotkeyBorder\`, for \`--tile-hotkey-color\`, in a wrapper of its own that sets \`--file-tile-border-style\` to a thicker border and \`--tile-icon-display\` to \`none\`.

\`--highlightColor\` is not set here: the highlight plays once, on mount, and is gone before a reader looks.`,
      },
      source: {
        code: `<div style={{
  "--tile-bg": "#f4f9fd",
  "--tile-border-style": "1px solid #0082c9",
  "--tile-radius": "16px",
  "--tile-height": "240px",
  "--tile-hover-bg": "#cce5f6",
  "--tile-hover-text-decoration": "none",
  "--tile-badge-bg": "#e6f3fb",
  "--tile-badge-radius": "8px",
  "--tile-badge-box-shadow": "0 2px 8px rgba(0,130,201,0.3)",
  "--tile-text-size": "13px",
  "--tile-text-weight": "600",
  "--tile-text-color": "#004d77",
  "--tile-text-line-height": "20px",
  "--tile-bottom-padding-inline": "8px",
  "--tile-thumbnail-padding-inline": "16px",
  "--tile-thumbnail-height": "140px",
  "--tile-thumbnail-image-radius": "8px",
  "--tile-thumbnail-image-hover-bg": "#e6f3fb",
  "--tile-thumbnail-transition": "background 0.6s",
  "--tile-option-button-padding-end": "8px",
  "--tile-hotkey-color": "#e0662e",
}}>
  <FileTile item={file} element={<WordIcon />} contextOptions={options} thumbnail={thumbnailUrl} badges={badges} contentElement={quickActions}>
    <TileContent><Link>Document.docx</Link></TileContent>
  </FileTile>

  <div style={{ "--file-tile-border-style": "2px solid", "--tile-icon-display": "none" }}>
    <FileTile item={report} element={<WordIcon />} contextOptions={options} showHotkeyBorder>
      <TileContent><Link>Report.docx</Link></TileContent>
    </FileTile>
  </div>
</div>`,
      },
    },
  },
};
