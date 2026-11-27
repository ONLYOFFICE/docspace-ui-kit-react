import type { ComponentProps, CSSProperties } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fireEvent, fn, screen, waitFor, within } from "storybook/test";

import type { FolderTileProps } from "./FolderTile.types";

import { useState } from "react";

import Folder32ReactSvg from "../../../assets/icons/32/folder.svg";
import ImageReactSvg from "../../../assets/icons/96/folder.svg";
import { Link, LinkType } from "../../link";
import { Badge } from "../../badge";

import { FolderTile } from ".";
import { TileContent } from "../tile-content";
import RenameField from "../../../.storybook/utils/RenameField";

const element = <Folder32ReactSvg />;

const onCopyOption = fn();
const onBadgeClick = fn();

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
      className="badge badge-version tablet-badge icons-group"
      backgroundColor="#A3A9AE"
      label="1"
      title="my badge"
      style={{
        width: "max-content",
      }}
      onClick={onBadgeClick}
    />
  </div>
);

const meta = {
  title: "UI/Tiles/FolderTile",
  component: FolderTile,
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
    inProgress: {
      control: "boolean",
      description:
        "Replaces the icon and the checkbox with the kit's track loader.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    indeterminate: {
      control: "boolean",
      description: "Draws the checkbox in its indeterminate state.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isBigFolder: {
      control: "boolean",
      description:
        "Switches from the single row to a tall card, with a picture on top and the name row below it.",
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
    isActive: {
      control: "boolean",
      description:
        "Keeps the hover tint and the underlined name on the tile being acted on, after the pointer leaves it.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isDragging: {
      control: "boolean",
      description:
        "Marks the tile as being dragged: hovering it does not tint it, underline the name or swap the icon for the checkbox. It does not dim the tile.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isEdit: {
      control: "boolean",
      description:
        "Renaming state: removes the icon, the checkbox and the hover tint, so the content gets the name row.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    item: {
      control: "object",
      description:
        "The folder this tile stands for. Its `contextOptions` key — present or absent — is what decides whether the three-dot button appears.",
    },
    children: {
      control: false,
      description:
        "The tile's content. Only the first element is rendered; the rest are dropped.",
    },
    element: {
      control: false,
      description:
        "The icon beside the checkbox. Without it neither the icon nor the checkbox is rendered at all.",
    },
    temporaryIcon: {
      control: false,
      description:
        "The folder's picture, drawn only in the tall card: a URL is fetched as an SVG, an element is rendered as given.",
    },
    badges: {
      control: false,
      description:
        "Badges after the name, or in the picture's top end corner in the tall card. Give their wrapper the class `badges`, so a click on them does not select.",
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
          {args.isEdit ? (
            <RenameField title={args.item.title} />
          ) : (
            <Link type={LinkType.page} fontWeight={600} isTextOverflow>
              {args.item.title}
            </Link>
          )}
        </TileContent>
      </FolderTile>
    </div>
  );
};

export const Default: Story = {
  name: "Single row",
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
  beforeEach: () => {
    onCopyOption.mockClear();
    onBadgeClick.mockClear();
  },
  play: async ({ args, canvas, userEvent }) => {
    const tile = canvas.getByTestId("tile");
    const content = within(tile).getByText("My Folder");

    // A click selects the folder alone; Ctrl and Shift add to the selection.
    await userEvent.click(content);
    await expect(args.setSelection).toHaveBeenCalledWith([]);
    await expect(args.onSelect).toHaveBeenCalledWith(
      true,
      expect.objectContaining({ id: "folder-1" }),
    );
    fireEvent.click(content, { ctrlKey: true, detail: 1 });
    await expect(args.withCtrlSelect).toHaveBeenCalledTimes(1);
    fireEvent.click(content, { shiftKey: true, detail: 1 });
    await expect(args.withShiftSelect).toHaveBeenCalledTimes(1);

    // A badge is not a selection click.
    const selections = (args.onSelect as ReturnType<typeof fn>).mock.calls
      .length;
    await userEvent.click(within(tile).getByText("1"));
    await expect(onBadgeClick).toHaveBeenCalledTimes(1);
    await expect(args.onSelect).toHaveBeenCalledTimes(selections);

    await userEvent.click(within(tile).getByTestId("context-menu-button"));
    await expect(args.tileContextClick).toHaveBeenCalledWith(false);
    await userEvent.click(await menuItem("Copy"));
    await expect(onCopyOption).toHaveBeenCalledTimes(1);

    await userEvent.click(within(tile).getByRole("checkbox", { hidden: true }));
    await expect(args.onSelect).toHaveBeenLastCalledWith(
      false,
      expect.objectContaining({ id: "folder-1" }),
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "A folder as a single row: the icon, the name, and a badge beside the menu. A plain click selects the tile; a Ctrl-, Cmd- or Shift-click goes to `withCtrlSelect` or `withShiftSelect`.",
      },
      source: {
        code: `<FolderTile
  item={{ id: "folder-1", title: "My Folder", isFolder: true, contextOptions: ["copy-to", "move-to"] }}
  element={<Folder32ReactSvg />}
  contextOptions={contextOptions}
  badges={badges}
  onSelect={handleSelect}
>
  <TileContent><Link type="page" fontWeight={600} isTextOverflow>My Folder</Link></TileContent>
</FolderTile>`,
      },
    },
  },
};

export const Big: Story = {
  name: "Tall card",
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
  play: async ({ canvas }) => {
    // A big folder gets a picture above its row.
    const tile = canvas.getByTestId("tile");
    const picture = within(tile).getByTestId("file-thumbnail");
    await expect(picture.getBoundingClientRect().bottom).toBeLessThanOrEqual(
      within(tile).getByText("My Folder").getBoundingClientRect().top,
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "A folder as a tall card: a picture on top with the badge in its corner, and the name row below it (`isBigFolder`, `temporaryIcon`).",
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
  <TileContent><Link type="page" fontWeight={600} isTextOverflow>My Folder</Link></TileContent>
</FolderTile>`,
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
          "A selected folder: the checkbox stays ticked in place of the icon, and the whole tile is tinted (`checked`).",
      },
      source: {
        code: `<FolderTile
  item={{ id: "folder-1", title: "My Folder", isFolder: true, contextOptions: ["copy-to", "move-to"] }}
  element={<Folder32ReactSvg />}
  contextOptions={contextOptions}
  checked={true}
  onSelect={handleSelect}
>
  <TileContent><Link type="page" fontWeight={600} isTextOverflow>My Folder</Link></TileContent>
</FolderTile>`,
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
          "A folder that is busy, being copied or moved: a small loader stands where the icon and the checkbox were (`inProgress`).",
      },
      source: {
        code: `<FolderTile
  item={{ id: "folder-1", title: "My Folder", isFolder: true, contextOptions: ["copy-to", "move-to"] }}
  element={<Folder32ReactSvg />}
  contextOptions={contextOptions}
  inProgress={true}
>
  <TileContent><Link type="page" fontWeight={600} isTextOverflow>My Folder</Link></TileContent>
</FolderTile>`,
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
        code: `<FolderTile
  item={{ id: "folder-1", title: "My Folder", isFolder: true, contextOptions: ["copy-to", "move-to"] }}
  element={<Folder32ReactSvg />}
  contextOptions={contextOptions}
  badges={badges}
  showHotkeyBorder
>
  <TileContent><Link type="page" fontWeight={600} isTextOverflow>My Folder</Link></TileContent>
</FolderTile>`,
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
          "A folder whose name is being edited: the icon and the checkbox go, and hovering does not tint the tile. The name row holds a text field (`isEdit`).",
      },
      source: {
        code: `<FolderTile
  item={{ id: "folder-1", title: "My Folder", isFolder: true, contextOptions: ["copy-to", "move-to"] }}
  element={<Folder32ReactSvg />}
  contextOptions={contextOptions}
  badges={badges}
  isEdit
>
  <TileContent>
    <div style={{ display: "flex", gap: 4 }}>
      <TextInput value={title} onChange={onRename} scale />
      <Button size={ButtonSize.small} icon={<CheckIcon />} onClick={onSave} />
      <Button size={ButtonSize.small} icon={<CrossIcon />} onClick={onCancel} />
    </div>
  </TileContent>
</FolderTile>`,
      },
    },
  },
};

export const RightToLeft: Story = {
  name: "Right to left",
  render: (args) => (
    <div dir="rtl">
      <Template {...args} />
    </div>
  ),
  globals: { direction: "rtl" },
  play: async ({ canvas }) => {
    // The icon at the right-hand end, the name to its left.
    const tile = canvas.getByTestId("tile");
    const icon = (
      tile.querySelector('[class*="iconContainer"]') as HTMLElement
    ).getBoundingClientRect();
    const name = within(tile).getByText("My Folder").getBoundingClientRect();
    await expect(icon.left).toBeGreaterThanOrEqual(name.right);
  },
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
          "The same row in a right-to-left layout: the icon at the right-hand end, then the name, then the badge and the three-dot button. `dir=\"rtl\"` on a wrapper sets the layout; the menu's side follows the theme's interface direction.",
      },
      source: {
        code: `<div dir="rtl">
  <FolderTile item={folder} element={<Folder32ReactSvg />} contextOptions={contextOptions} badges={badges}>
    <TileContent><Link type="page" fontWeight={600} isTextOverflow>My Folder</Link></TileContent>
  </FolderTile>
</div>`,
      },
    },
  },
};

export const CssCustomization: Story = {
  name: "CSS variables",
  play: async ({ canvas }) => {
    const [folder, big] = canvas.getAllByTestId("tile");
    await expect(getComputedStyle(folder).borderTopLeftRadius).toBe("16px");
    // At rest the background shows on the big folder's picture block.
    const top = big.querySelector('[class*="fileTileTop"]') as HTMLElement;
    await expect(getComputedStyle(top).backgroundColor).toBe(
      "rgb(244, 249, 253)",
    );
    const name = within(folder).getAllByText("My Folder")[0];
    await expect(getComputedStyle(name).fontSize).toBe("13px");
  },
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
        story: `Three tiles under wrappers that set the variables.
- **My Folder** — the single row, for the border, radius and name variables; the hover ones show on hover.
- **Projects** — the tall card (\`isBigFolder\`), for \`--tile-bg\` and the badge variables.
- **Archive** — \`showHotkeyBorder\` for \`--tile-hotkey-color\`. Its own wrapper sets a thicker \`--folder-tile-border-style\`.`,
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
