import type { ComponentProps, CSSProperties } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fireEvent, fn, screen, waitFor, within } from "storybook/test";

import type { BaseTileProps } from "./BaseTile.types";

import { useState } from "react";

import WordSvgUrl from "../../../assets/icons/32/word.svg";
import PdfSvgUrl from "../../../assets/icons/32/pdf.svg";
import SlideSvgUrl from "../../../assets/icons/32/slide.svg";
import { Link } from "../../link";

import { BaseTile } from ".";
import { TileContent } from "../tile-content";

const wordElement = <WordSvgUrl />;

const onEditOption = fn();
const onDeleteOption = fn();

// The menu is portalled and fades in.
const menuItem = async (name: string) => {
  const item = await screen.findByRole("menuitem", { name });
  await waitFor(() => expect(item).toBeVisible());
  return item;
};

const contextOptions = [
  {
    id: "option_edit",
    key: "edit",
    label: "Edit",
    onClick: onEditOption,
    disabled: false,
  },
  {
    id: "option_delete",
    key: "delete",
    label: "Delete",
    onClick: onDeleteOption,
    disabled: false,
  },
];

const meta = {
  title: "UI/Tiles/BaseTile",
  component: BaseTile,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
  },
  argTypes: {
    checked: {
      control: "boolean",
      description:
        "Ticks the checkbox and keeps it in place of the icon, with the hover background",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isActive: {
      control: "boolean",
      description:
        "Keeps the hover background on the tile being acted on, with no checkbox",
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
    showHotkeyBorder: {
      control: "boolean",
      description:
        "Draws an accent border around the tile, to mark the one the keyboard is on",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isEdit: {
      control: "boolean",
      description:
        "Removes the icon and the checkbox and the hover background, leaving the top row to its content while the item is renamed",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isBlockingOperation: {
      control: "boolean",
      description:
        "Stops the tile from reacting to hover, clicks and right-clicks; it looks the same",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    indeterminate: {
      control: "boolean",
      description:
        "Draws the checkbox with a dash instead of a tick, for a partly selected item",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    item: {
      control: "object",
      description:
        "The item the tile stands for: passed back through `onSelect`, and its title and logo head the menu. A `contextOptions` key on it is what draws the three-dot button",
    },
    element: {
      control: false,
      description:
        "The icon in the corner; without it the tile has neither the icon nor the checkbox",
    },
    topContent: {
      control: false,
      description: "The title row beside the icon, usually a `TileContent`",
    },
    bottomContent: {
      control: false,
      description: "The second row under the title, 24px high",
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
        "Called with the new checked state and the item when the checkbox is clicked, or when the icon is tapped on a phone",
    },
    onRoomClick: {
      description: "Called with the click event on any click on the tile",
    },
    onHover: {
      description: "Called when the pointer enters the tile",
    },
    onLeave: {
      description: "Called when the pointer leaves the tile",
    },
    tileContextClick: {
      description:
        "Called just before the menu opens, with `true` when a right-click opened it",
    },
    hideContextMenu: {
      description: "Called when the menu closes",
    },
    badgeUrl: {
      control: "text",
      description: "Image drawn as a badge in the menu's header",
    },
    className: {
      control: "text",
      description: "Class added after the component's own on the outer element",
    },
    dataTestId: {
      control: "text",
      description: "Value of `data-testid` on the outer element",
      table: {
        defaultValue: { summary: '"tile"' },
      },
    },
    checkboxContainerRef: {
      control: false,
      description: "Ref to the element holding the icon and the checkbox",
    },
    forwardRef: {
      control: false,
      description:
        "Ref to an element of your own that the tile clicks on a right-click when its menu is not mounted yet",
    },
    thumbnailClick: {
      control: false,
      description: "Ignored: the tile never calls it",
    },
  },
  args: {
    onSelect: fn(),
    onRoomClick: fn(),
    onHover: fn(),
    onLeave: fn(),
    tileContextClick: fn(),
    hideContextMenu: fn(),
  },
} satisfies Meta<typeof BaseTile>;

type Story = StoryObj<ComponentProps<typeof BaseTile>>;

export default meta;

const Template = ({
  checked: initialChecked,
  onSelect: onSelectArg,
  ...args
}: BaseTileProps) => {
  const [checked, setChecked] = useState(initialChecked);

  const onSelect: BaseTileProps["onSelect"] = (isSelected, item) => {
    setChecked(isSelected);
    onSelectArg?.(isSelected, item);
  };

  return (
    <div style={{ maxWidth: "300px", margin: "30px" }}>
      <BaseTile {...args} checked={checked} onSelect={onSelect} />
    </div>
  );
};

export const Default: Story = {
  render: Template,
  args: {
    item: {
      id: "tile-1",
      title: "Document.docx",
      fileExst: ".docx",
    },
    element: wordElement,
    contextOptions,
    topContent: (
      <TileContent>
        <Link>Document.docx</Link>
      </TileContent>
    ),
    getContextModel: () => contextOptions,
  },
  beforeEach: () => {
    onDeleteOption.mockClear();
  },
  play: async ({ args, canvas, userEvent }) => {
    const tile = canvas.getByTestId("tile");
    await userEvent.hover(tile);
    await expect(args.onHover).toHaveBeenCalled();

    // The checkbox, shown in place of the icon on a CSS hover, reports the
    // new state with the item.
    const checkbox = within(tile).getByRole("checkbox", { hidden: true });
    await userEvent.click(checkbox);
    await expect(args.onSelect).toHaveBeenCalledWith(
      true,
      expect.objectContaining({ id: "tile-1" }),
    );
    await expect(checkbox).toBeChecked();

    await userEvent.click(within(tile).getByText("Document.docx"));
    await expect(args.onRoomClick).toHaveBeenCalled();

    // A right click opens the menu.
    fireEvent.contextMenu(tile, { button: 2 });
    await expect(args.tileContextClick).toHaveBeenCalledWith(true);
    await userEvent.click(await menuItem("Delete"));
    await expect(onDeleteOption).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(args.hideContextMenu).toHaveBeenCalled());
  },
  parameters: {
    docs: {
      description: {
        story:
          "A document as a tile: its icon, its name, and a checkbox that takes the icon's place on hover. Tick it, right-click the tile for its menu, and change any other prop live in the Controls panel below.",
      },
      source: {
        code: `<BaseTile
  item={{ id: "tile-1", title: "Document.docx", fileExst: ".docx" }}
  element={<WordSvgUrl />}
  contextOptions={contextOptions}
  topContent={<TileContent><Link>Document.docx</Link></TileContent>}
  onSelect={handleSelect}
  getContextModel={() => contextOptions}
/>`,
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
          "A selected tile, as it looks among others the reader has picked: the checkbox stays ticked in place of the icon and the background stays tinted (`checked`).",
      },
      source: {
        code: `<BaseTile
  item={{ id: "tile-1", title: "Document.docx", fileExst: ".docx" }}
  element={<WordSvgUrl />}
  contextOptions={contextOptions}
  topContent={<TileContent><Link>Document.docx</Link></TileContent>}
  checked={true}
  onSelect={handleSelect}
/>`,
      },
    },
  },
};

export const Active: Story = {
  render: Template,
  args: {
    ...Default.args,
    isActive: true,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByTestId("tile").className).toMatch(/isActive/);
  },
  parameters: {
    docs: {
      description: {
        story:
          "The tile whose menu is open or that an action is running on keeps the hover background after the pointer leaves, so the reader can tell which one it is (`isActive`).",
      },
      source: {
        code: `<BaseTile
  item={{ id: "tile-1", title: "Document.docx", fileExst: ".docx" }}
  element={<WordSvgUrl />}
  contextOptions={contextOptions}
  topContent={<TileContent><Link>Document.docx</Link></TileContent>}
  isActive={true}
/>`,
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
  play: async ({ canvas }) => {
    // A loader in place of the icon and the checkbox.
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
          "A tile whose item is busy, being copied or converted: a small loader stands where the icon and the checkbox were (`inProgress`).",
      },
      source: {
        code: `<BaseTile
  item={{ id: "tile-1", title: "Document.docx", fileExst: ".docx" }}
  element={<WordSvgUrl />}
  contextOptions={contextOptions}
  topContent={<TileContent><Link>Document.docx</Link></TileContent>}
  inProgress={true}
/>`,
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
  play: async ({ canvas }) => {
    await expect(canvas.getByTestId("tile").className).toMatch(
      /showHotkeyBorder/,
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "The tile the keyboard is on while the reader moves through the grid with the arrow keys: an accent border marks it (`showHotkeyBorder`). The tile does not handle the keys itself.",
      },
      source: {
        code: `<BaseTile
  item={{ id: "tile-1", title: "Document.docx", fileExst: ".docx" }}
  element={<WordSvgUrl />}
  contextOptions={contextOptions}
  topContent={<TileContent><Link>Document.docx</Link></TileContent>}
  showHotkeyBorder={true}
/>`,
      },
    },
  },
};

export const WithBottomContent: Story = {
  render: Template,
  args: {
    ...Default.args,
    topContent: (
      <TileContent>
        <Link>Document.docx</Link>
      </TileContent>
    ),
    bottomContent: (
      <div style={{ padding: "8px", fontSize: "12px", color: "#666" }}>
        Additional information
      </div>
    ),
  },
  play: async ({ canvas }) => {
    const details = canvas.getByText("Additional information");
    await expect(details.getBoundingClientRect().top).toBeGreaterThanOrEqual(
      canvas.getByText("Document.docx").getBoundingClientRect().bottom,
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "A tile with a second row under the title, for tags or a line of details (`bottomContent`).",
      },
      source: {
        code: `<BaseTile
  item={{ id: "tile-1", title: "Document.docx", fileExst: ".docx" }}
  element={<WordSvgUrl />}
  contextOptions={contextOptions}
  topContent={<TileContent><Link>Document.docx</Link></TileContent>}
  bottomContent={<div>Additional information</div>}
/>`,
      },
    },
  },
};

export const WithMenuButton: Story = {
  render: Template,
  args: {
    ...Default.args,
    item: {
      id: "tile-1",
      title: "Document.docx",
      fileExst: ".docx",
      contextOptions: [],
    } as BaseTileProps["item"],
  },
  play: async ({ args, canvas, userEvent }) => {
    // The three-dot button opens the same menu.
    const button = within(canvas.getByTestId("tile")).getByTestId(
      "context-menu-button",
    );
    await userEvent.click(button);
    await expect(await menuItem("Edit")).toBeVisible();
    await expect(args.tileContextClick).toHaveBeenCalled();
  },
  parameters: {
    docs: {
      description: {
        story:
          "A tile whose actions are reachable without a right-click: the three-dot button opens the same menu. It is drawn only when the item carries a `contextOptions` key of its own, whatever the `contextOptions` prop holds.",
      },
      source: {
        code: `<BaseTile
  item={{ id: "tile-1", title: "Document.docx", fileExst: ".docx", contextOptions: [] }}
  element={<WordSvgUrl />}
  contextOptions={contextOptions}
  topContent={<TileContent><Link>Document.docx</Link></TileContent>}
  getContextModel={() => contextOptions}
/>`,
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
          "A tile whose name is being edited: the icon and the checkbox go, so the title row can hold a text field across the tile, and hovering no longer tints it (`isEdit`).",
      },
      source: {
        code: `<BaseTile
  item={{ id: "tile-1", title: "Document.docx", fileExst: ".docx" }}
  element={<WordSvgUrl />}
  contextOptions={contextOptions}
  topContent={<TileContent><Link>Document.docx</Link></TileContent>}
  isEdit
/>`,
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
  play: async ({ canvas }) => {
    // The tile ignores the pointer altogether.
    await expect(
      getComputedStyle(canvas.getByTestId("tile")).pointerEvents,
    ).toBe("none");
  },
  parameters: {
    docs: {
      description: {
        story:
          "A tile an operation is running over, which must not be picked or opened until it ends: hover it, click it or right-click it and nothing happens (`isBlockingOperation`). It looks the same as an idle tile, so show the operation somewhere else.",
      },
      source: {
        code: `<BaseTile
  item={{ id: "tile-1", title: "Document.docx", fileExst: ".docx" }}
  element={<WordSvgUrl />}
  contextOptions={contextOptions}
  topContent={<TileContent><Link>Document.docx</Link></TileContent>}
  isBlockingOperation
/>`,
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
          "--tile-hotkey-color": "#00304d",
          "--tile-padding": "12px 0",
          "--tile-row-gap": "12px",
        } as CSSProperties
      }
    >
      <div style={{ maxWidth: "300px", margin: "30px" }}>
        <BaseTile
          item={
            {
              id: "tile-1",
              title: "Document.docx",
              fileExst: ".docx",
              contextOptions: [],
            } as BaseTileProps["item"]
          }
          element={wordElement}
          contextOptions={contextOptions}
          topContent={
            <TileContent>
              <Link>Document.docx</Link>
            </TileContent>
          }
          onSelect={fn()}
          getContextModel={() => contextOptions}
        />
      </div>
      <div style={{ maxWidth: "300px", margin: "30px" }}>
        <BaseTile
          item={{ id: "tile-2", title: "Report.docx", fileExst: ".docx" }}
          element={wordElement}
          contextOptions={contextOptions}
          topContent={
            <TileContent>
              <Link>Report.docx</Link>
            </TileContent>
          }
          showHotkeyBorder
        />
      </div>
    </div>
  ),
  play: async ({ canvas }) => {
    const [first, second] = canvas.getAllByTestId("tile");
    const tile = getComputedStyle(first);
    await expect(tile.backgroundColor).toBe("rgb(230, 243, 251)");
    await expect(tile.borderTopLeftRadius).toBe("16px");
    await expect(tile.rowGap).toBe("12px");
    await expect(getComputedStyle(second).borderTopColor).toBe(
      "rgb(0, 48, 77)",
    );
  },
  parameters: {
    docs: {
      description: {
        story: `Every overridable variable set on one wrapper -- the variables are listed under CSS variables on this page. The first tile shows every variable but the hotkey colour; hover it for the hover background. The second is there for \`--tile-hotkey-color\`, which only a tile with \`showHotkeyBorder\` draws.`,
      },
    },
  },
};
