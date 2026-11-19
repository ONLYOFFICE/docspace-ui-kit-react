import type { ComponentProps, CSSProperties } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fireEvent, fn, screen, waitFor, within } from "storybook/test";

import type { FileTileProps } from "./FileTile.types";

import { useState } from "react";

import WordSvgUrl from "../../../assets/icons/32/word.svg";

import ImageReactSvg from "../../../assets/emptyview/empty.rooms.root.light.svg";
import LockedReact12Svg from "../../../assets/icons/12/lock.react.svg";
import { Link, LinkType } from "../../link";
import { globalColors } from "../../../providers/theme";
import { Badge } from "../../badge";
import { IconSizeType } from "../../../utils";
import { FileType } from "../../../enums";

import { FileTile } from ".";
import { TileContent } from "../tile-content";
import RenameField from "../../../.storybook/utils/RenameField";
import { IconButton } from "../../icon-button";

const wordElement = <WordSvgUrl />;

// A bundled preview image, so the screenshots do not depend on a network host.
const thumbnail = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="160"><rect width="320" height="160" fill="#f3f4f4"/><rect x="40" y="24" width="240" height="136" fill="#ffffff"/><rect x="64" y="48" width="120" height="8" fill="#a3a9ae"/><rect x="64" y="68" width="192" height="6" fill="#d0d5da"/><rect x="64" y="84" width="176" height="6" fill="#d0d5da"/><rect x="64" y="100" width="184" height="6" fill="#d0d5da"/></svg>',
)}`;

const onCopyOption = fn();
const onBadgeClick = fn();
const onLockClick = fn();

// The menu is portalled and fades in.
const menuItem = async (name: string) => {
  const item = await screen.findByRole("menuitem", { name });
  await waitFor(() => expect(item).toBeVisible());
  return item;
};

const contextOptions = [
  {
    id: "option_copy-to",
    key: "copy-to",
    label: "Copy",
    onClick: onCopyOption,
    disabled: false,
  },
  {
    id: "option_move-to",
    key: "move-to",
    label: "Move to",
    onClick: fn(),
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
      onClick={onBadgeClick}
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
      onClick={onLockClick}
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
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
  },
  argTypes: {
    checked: {
      control: "boolean",
      description:
        "Ticks the checkbox, shows it in place of the icon and tints the whole tile. The tile holds no state; pass back what `onSelect` reports.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isDragging: {
      control: "boolean",
      description:
        "Marks the tile as being dragged: hovering the icon does not swap it for the checkbox. It does not dim the tile.",
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
    isActive: {
      control: "boolean",
      description:
        "Keeps the hover tint and the underlined name on the tile being acted on, after the pointer leaves it.",
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
        "Renaming state: removes the icon and the checkbox, so the content gets the name row.",
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
    isHighlight: {
      control: "boolean",
      description:
        "Fades `--highlightColor` out of the name row once, on mount, to point at a matched file. The kit sets no such colour, so nothing shows until you set one.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    item: {
      control: "object",
      description:
        "The file the tile stands for, passed back through the callbacks. A `contextOptions` key on it is what draws the three-dot button.",
    },
    children: {
      control: false,
      description:
        "The tile's content. Only the first element is rendered, in the row beside the icon; the rest are dropped.",
    },
    element: {
      control: false,
      description:
        "The icon beside the checkbox. Without it neither the icon nor the checkbox is rendered at all.",
    },
    thumbnail: {
      control: "text",
      description:
        "Address of the preview image. When it fails to load, the tile draws a plugin's `fileTileIcon` or `temporaryIcon` instead.",
    },
    temporaryIcon: {
      control: false,
      description:
        "Drawn when there is no `thumbnail`: a URL is fetched as an SVG, an element is rendered as given.",
    },
    badges: {
      control: false,
      description:
        "Badges drawn in a row in the thumbnail's top end corner. Give them the class `badges` so a click on them does not select the tile.",
    },
    contentElement: {
      control: false,
      description:
        "Quick-action buttons, stacked in a column in the thumbnail's top start corner.",
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
        "Called with the new checked state and the `item`, from the checkbox or a plain click. A tap on the icon calls it too, in a window 600px wide or narrower.",
    },
    setSelection: {
      description:
        "Called with an empty array before a plain click selects the tile, unless the click landed on an image, an input or an SVG shape.",
    },
    withCtrlSelect: {
      description:
        "Called with the `item` on a Ctrl- or Cmd-click, instead of selecting.",
    },
    withShiftSelect: {
      description:
        "Called with the `item` on a Shift-click, instead of selecting.",
    },
    thumbnailClick: {
      description:
        "Called with the event when the thumbnail area is clicked. The tile's own click handler runs as well.",
    },
    tileContextClick: {
      description:
        "Called before the menu opens, with `true` when the trigger was a right-click.",
    },
    hideContextMenu: {
      description: "Called when the menu closes.",
    },
    forwardRef: {
      control: false,
      description:
        "Attached to the outer element, and clicked by the component itself on a right-click before the menu is mounted.",
    },
    dataTestId: {
      control: "text",
      description: "Value of `data-testid` on the outer element.",
      table: {
        defaultValue: { summary: '"tile"' },
      },
    },
    thumbSize: {
      control: false,
      description:
        "Ignored. Only its difference from `null` is tested, which a `number | undefined` always satisfies, so the branch it guards is unreachable.",
    },
    contextButtonSpacerWidth: {
      control: false,
      description: "Ignored. Nothing reads it.",
    },
    sideColor: {
      control: false,
      description: "Ignored. Nothing reads it.",
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
          {args.isEdit ? (
            <RenameField title={args.item.title} />
          ) : (
            <Link
              type={LinkType.page}
              title={args.item.title}
              fontWeight={600}
              isTextOverflow
            >
              {args.item.title.replace(/\.[^.]+$/, "")}
              <span style={{ color: globalColors.gray }}>
                {args.item.fileExst}
              </span>
            </Link>
          )}
        </TileContent>
      </FileTile>
    </div>
  );
};

export const Default: Story = {
  name: "Placeholder picture",
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
  beforeEach: () => {
    onCopyOption.mockClear();
    onBadgeClick.mockClear();
  },
  play: async ({ args, canvas, userEvent }) => {
    const tile = canvas.getByTestId("tile");
    const content = within(tile).getByText("Document");

    // A click on the tile selects it, alone.
    await userEvent.click(content);
    await expect(args.setSelection).toHaveBeenCalledWith([]);
    await expect(args.onSelect).toHaveBeenCalledWith(
      true,
      expect.objectContaining({ id: "file-1" }),
    );

    // Ctrl and Shift add to the selection instead.
    fireEvent.click(content, { ctrlKey: true, detail: 1 });
    await expect(args.withCtrlSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: "file-1" }),
    );
    fireEvent.click(content, { shiftKey: true, detail: 1 });
    await expect(args.withShiftSelect).toHaveBeenCalledTimes(1);

    // A badge is not a selection click.
    const selections = (args.onSelect as ReturnType<typeof fn>).mock.calls
      .length;
    await userEvent.click(within(tile).getByText("New"));
    await expect(onBadgeClick).toHaveBeenCalledTimes(1);
    await expect(args.onSelect).toHaveBeenCalledTimes(selections);

    await userEvent.click(within(tile).getByTestId("file-thumbnail"));
    await expect(args.thumbnailClick).toHaveBeenCalled();

    await userEvent.click(within(tile).getByTestId("context-menu-button"));
    await expect(args.tileContextClick).toHaveBeenCalledWith(false);
    await userEvent.click(await menuItem("Copy"));
    await expect(onCopyOption).toHaveBeenCalledTimes(1);
  },
  parameters: {
    docs: {
      description: {
        story:
          "A document with no preview: a placeholder picture, a badge and a quick action over it, and the name row with the menu. A plain click selects the tile; a Ctrl-, Cmd- or Shift-click goes to `withCtrlSelect` or `withShiftSelect`.",
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
  <TileContent>
    <Link type="page" title="Document.docx" fontWeight={600} isTextOverflow>
      Document<span style={{ color: "#A3A9AE" }}>.docx</span>
    </Link>
  </TileContent>
</FileTile>`,
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
          "A selected file: the checkbox stays ticked in place of the icon, and the whole tile is tinted (`checked`).",
      },
      source: {
        code: `<FileTile
  item={{ id: "file-1", title: "Document.docx", fileExst: ".docx", fileType: FileType.Document, contextOptions: ["copy-to", "move-to"] }}
  element={<WordSvgUrl />}
  contextOptions={contextOptions}
  checked={true}
  onSelect={handleSelect}
>
  <TileContent>
    <Link type="page" title="Document.docx" fontWeight={600} isTextOverflow>
      Document<span style={{ color: "#A3A9AE" }}>.docx</span>
    </Link>
  </TileContent>
</FileTile>`,
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
    isBlockingOperation: true,
  },
  play: async ({ canvas }) => {
    const tile = canvas.getByTestId("tile");
    await expect(
      within(tile).queryByRole("checkbox", { hidden: true }),
    ).toBeNull();
    await expect(tile.querySelector('[class*="loader"]')).not.toBeNull();
    // The pointer does not reach a blocked tile.
    await expect(getComputedStyle(tile).pointerEvents).toBe("none");
  },
  parameters: {
    docs: {
      description: {
        story:
          "A file that is busy, being uploaded or converted: a small loader stands where the icon and the checkbox were (`inProgress`). The pointer does not reach it (`isBlockingOperation`).",
      },
      source: {
        code: `<FileTile
  item={{ id: "file-1", title: "Document.docx", fileExst: ".docx", fileType: FileType.Document, contextOptions: ["copy-to", "move-to"] }}
  element={<WordSvgUrl />}
  contextOptions={contextOptions}
  inProgress={true}
  isBlockingOperation={true}
>
  <TileContent>
    <Link type="page" title="Document.docx" fontWeight={600} isTextOverflow>
      Document<span style={{ color: "#A3A9AE" }}>.docx</span>
    </Link>
  </TileContent>
</FileTile>`,
      },
    },
  },
};

export const WithThumbnail: Story = {
  name: "With a preview",
  render: Template,
  args: {
    ...Default.args,
    thumbnail,
  },
  play: async ({ canvas }) => {
    const preview = within(canvas.getByTestId("tile")).getByTestId(
      "file-thumbnail",
    );
    await expect(preview.tagName).toBe("IMG");
    await expect(preview).toHaveAttribute("src", thumbnail);
  },
  parameters: {
    docs: {
      description: {
        story:
          "A document with a preview: the image fills the upper part, cropped from the top, and the badges sit over it (`thumbnail`). An image that fails to load gives way to `temporaryIcon`.",
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
  <TileContent>
    <Link type="page" title="Document.docx" fontWeight={600} isTextOverflow>
      Document<span style={{ color: "#A3A9AE" }}>.docx</span>
    </Link>
  </TileContent>
</FileTile>`,
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
  <TileContent>
    <Link type="page" title="Document.docx" fontWeight={600} isTextOverflow>
      Document<span style={{ color: "#A3A9AE" }}>.docx</span>
    </Link>
  </TileContent>
</FileTile>`,
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
  <TileContent>
    <div style={{ display: "flex", gap: 4 }}>
      <TextInput value={title} onChange={onRename} scale />
      <Button size={ButtonSize.small} icon={<CheckIcon />} onClick={onSave} />
      <Button size={ButtonSize.small} icon={<CrossIcon />} onClick={onCancel} />
    </div>
  </TileContent>
</FileTile>`,
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
          "--tile-height": "240px",
          "--tile-hover-bg": "light-dark(#cce5f6, #1f4a61)",
          "--tile-hover-text-decoration": "none",
          "--tile-badge-bg": "light-dark(#e6f3fb, #16303e)",
          "--tile-badge-radius": "8px",
          "--tile-badge-box-shadow": "0 2px 8px rgba(0,130,201,0.3)",
          "--tile-text-size": "13px",
          "--tile-text-weight": "600",
          "--tile-text-color": "light-dark(#004d77, #7cc3ea)",
          "--tile-text-line-height": "20px",
          "--tile-bottom-padding-inline": "8px",
          "--tile-thumbnail-padding-inline": "16px",
          "--tile-thumbnail-height": "140px",
          "--tile-thumbnail-image-radius": "8px",
          "--tile-thumbnail-image-hover-bg": "light-dark(#e6f3fb, #16303e)",
          "--tile-thumbnail-transition": "background 0.6s",
          "--tile-option-button-margin-end": "0px",
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
  play: async ({ canvas }) => {
    const [document, report] = canvas.getAllByTestId("tile");
    const tile = getComputedStyle(document);
    await expect(tile.backgroundColor).toBe("rgb(244, 249, 253)");
    await expect(tile.borderTopLeftRadius).toBe("16px");
    await expect(tile.height).toBe("240px");
    await expect(
      getComputedStyle(within(document).getByTestId("file-thumbnail"))
        .borderTopLeftRadius,
    ).toBe("8px");
    const hotkey = getComputedStyle(report);
    await expect(hotkey.borderTopWidth).toBe("2px");
    await expect(hotkey.borderTopColor).toBe("rgb(224, 102, 46)");
  },
  parameters: {
    docs: {
      description: {
        story: `Two tiles under wrappers that set the variables.
- **Document.docx** — a preview, a badge and a quick action, for the rest of the variables.
- **Report.docx** — \`showHotkeyBorder\` for \`--tile-hotkey-color\`. Its own wrapper sets a thicker \`--file-tile-border-style\` and hides the icon with \`--tile-icon-display\`.

\`--highlightColor\` is left out: the highlight plays once, on mount.`,
      },
      source: {
        code: `<div style={{
  "--tile-bg": "light-dark(#f4f9fd, #132530)",
  "--tile-border-style": "1px solid #0082c9",
  "--tile-radius": "16px",
  "--tile-height": "240px",
  "--tile-hover-bg": "light-dark(#cce5f6, #1f4a61)",
  "--tile-hover-text-decoration": "none",
  "--tile-badge-bg": "light-dark(#e6f3fb, #16303e)",
  "--tile-badge-radius": "8px",
  "--tile-badge-box-shadow": "0 2px 8px rgba(0,130,201,0.3)",
  "--tile-text-size": "13px",
  "--tile-text-weight": "600",
  "--tile-text-color": "light-dark(#004d77, #7cc3ea)",
  "--tile-text-line-height": "20px",
  "--tile-bottom-padding-inline": "8px",
  "--tile-thumbnail-padding-inline": "16px",
  "--tile-thumbnail-height": "140px",
  "--tile-thumbnail-image-radius": "8px",
  "--tile-thumbnail-image-hover-bg": "light-dark(#e6f3fb, #16303e)",
  "--tile-thumbnail-transition": "background 0.6s",
  "--tile-option-button-margin-end": "0px",
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
