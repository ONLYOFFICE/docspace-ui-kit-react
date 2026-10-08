import type { CSSProperties, ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { SelectionAreaProps, TOnMove } from "./SelectionArea.types";

import { useState } from "react";
import { expect, fireEvent, fn, screen, waitFor } from "storybook/test";

import { SelectionArea } from "./SelectionArea";
import styles from "./SelectionArea.stories.module.scss";

const meta = {
  title: "UI/Layout/SelectionArea",
  component: SelectionArea,
  tags: ["!autodocs"],
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
  },
  argTypes: {
    viewAs: {
      control: "select",
      options: ["tile", "row"],
      description:
        "`tile` works out each item's place on a grid of columns and rows; any other value treats the items as one column of equal-height rows",
      table: {
        defaultValue: { summary: "undefined" },
      },
    },
    folderHeaderHeight: {
      control: "number",
      description:
        "Height in pixels of a header above the tiles, added to the top of the grid in tile view unless `isRooms` is set; tile view expects it to be set",
      table: {
        defaultValue: { summary: "undefined" },
      },
    },
    defaultHeaderHeight: {
      control: "number",
      description:
        "Height in pixels of one group heading in tile view, counted once for every group above an item's group",
      table: {
        defaultValue: { summary: "undefined" },
      },
    },
    countTilesInRow: {
      control: "number",
      description:
        "How many tiles fit in one row in tile view; without it no tile is ever covered",
      table: {
        defaultValue: { summary: "undefined" },
      },
    },
    isRooms: {
      control: "boolean",
      description:
        "In tile view, leaves `folderHeaderHeight` out of the grid's top edge",
      table: {
        defaultValue: { summary: "undefined" },
      },
    },
    arrayTypes: {
      control: "object",
      description:
        "One entry per group of items, in display order: the group name matched against the first part of an item's `value`, the gap between its rows, how many rows it takes and how many tile slots it leaves empty at the end",
      table: {
        defaultValue: { summary: "undefined" },
      },
    },
    containerClass: {
      control: false,
      description:
        "Class of the element the rectangle stays inside; the whole page when nothing carries it. Fixed by the story",
    },
    selectableClass: {
      control: false,
      description:
        "Class every selectable item carries, together with a `value` attribute shaped `group_…_index`. Fixed by the story",
    },
    scrollClass: {
      control: false,
      description:
        "Class of the scrolling element; when it scrolls, the rectangle's starting corner moves with the content. Fixed by the story",
    },
    itemsContainerClass: {
      control: false,
      description:
        "Class of the element the items sit in; its top-left corner, read when a drag starts, is where the first item is taken to be. Fixed by the story",
    },
    itemClass: {
      control: false,
      description:
        "In row view, the class of the child inside each item that carries the `value` attribute. Fixed by the story",
    },
    onMove: {
      control: false,
      description:
        "Called once with `clear: true` when a drag passes 10px, then on every animation frame with every covered item (`added`) and every uncovered one (`removed`). The story uses it to highlight the covered items",
    },
    startAreaSelector: {
      control: false,
      description:
        "CSS selector of the region a drag may start in; the default is the portal's `#sectionScroll`, which the story's wrapper carries",
      table: {
        defaultValue: { summary: '"#sectionScroll"' },
      },
    },
    onMouseDown: {
      action: "onMouseDown",
      description:
        "Called on every mouse-down anywhere in the document, before the component checks the button and where the press landed",
    },
  },
  decorators: [
    (S) => (
      <div id="sectionScroll" className={styles.container}>
        <S />
      </div>
    ),
  ],
} satisfies Meta<typeof SelectionArea>;

type Story = StoryObj<ComponentProps<typeof SelectionArea>>;

export default meta;

const centre = (el: Element) => {
  const { left, top, width, height } = el.getBoundingClientRect();
  return { x: left + width / 2, y: top + height / 2 };
};

// Presses on `from` and drags to `to`, the way the rectangle listens:
// mouse-down on the element, mouse-moves on the document. Returns the
// release, so a test can look at the rectangle while it is drawn.
const drag = async (from: Element, to: { x: number; y: number }) => {
  const start = centre(from);
  fireEvent.mouseDown(from, { button: 0, clientX: start.x, clientY: start.y });
  fireEvent.mouseMove(document, { clientX: to.x, clientY: to.y });
  fireEvent.mouseMove(document, { clientX: to.x + 1, clientY: to.y + 1 });
  return () => fireEvent.mouseUp(document);
};

const isSelected = (el: Element) => /selected/.test(el.className);

const SelectionTemplate = ({
  gridClassName = styles.itemsContainer,
  ...args
}: SelectionAreaProps & { gridClassName?: string }) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleMove = (move: TOnMove) => {
    args.onMove?.(move);
    const { added, removed, clear } = move;

    setSelectedItems((prev) => {
      // `clear` starts a new drag: the previous selection is dropped.
      const newItems = clear ? [] : [...prev];

      added.forEach((element) => {
        const valueElement =
          args.viewAs === "tile"
            ? element
            : element.getElementsByClassName(args.itemClass || "item-name")[0];

        const value = valueElement?.getAttribute("value");
        if (value && !newItems.includes(value)) {
          newItems.push(value);
        }
      });

      removed.forEach((element) => {
        const valueElement =
          args.viewAs === "tile"
            ? element
            : element.getElementsByClassName(args.itemClass || "item-name")[0];

        const value = valueElement?.getAttribute("value");
        if (value) {
          const index = newItems.indexOf(value);
          if (index > -1) {
            newItems.splice(index, 1);
          }
        }
      });

      return newItems;
    });
  };

  return (
    <>
      {args.viewAs === "tile" ? (
        <div className={gridClassName}>
          {Array.from({ length: 12 }).map((_, index) => (
            <div
              key={`item_${String(index)}`}
              className={`${styles.item} selectable-item ${selectedItems.includes(`item_${index}`) ? styles.selected : ""}`}
              {...({ value: `item_${index}` } as Record<string, string>)}
              data-id={`item_${index}`}
            >
              Item {index + 1}
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.rowList}>
          {Array.from({ length: 12 }).map((_, index) => (
            <div
              key={`row_${String(index)}`}
              className={`${styles.row} selectable-item ${selectedItems.includes(`row_${index}`) ? styles.selected : ""}`}
            >
              <span
                className="item-name"
                {...({ value: `row_${index}` } as Record<string, string>)}
              >
                Row {index + 1}
              </span>
            </div>
          ))}
        </div>
      )}

      <SelectionArea
        {...args}
        onMove={handleMove}
        containerClass={styles.container}
        itemsContainerClass={
          args.viewAs === "tile" ? gridClassName : styles.rowList
        }
        selectableClass="selectable-item"
        scrollClass={styles.container}
        itemClass="item-name"
      />
    </>
  );
};

export const Default: Story = {
  render: (args) => <SelectionTemplate {...args} />,
  args: {
    onMove: fn(),
    viewAs: "tile",
    folderHeaderHeight: 0,
    defaultHeaderHeight: 0,
    countTilesInRow: 4,
    arrayTypes: [
      {
        type: "item",
        itemHeight: 150,
        rowGap: 16,
      },
    ],
    isRooms: false,
  },
  play: async ({ args }) => {
    const tile = (n: number) => screen.getByText(`Item ${n}`);
    // A drag from tile 1 into tile 2 covers both, and nothing below.
    const release = await drag(tile(1), centre(tile(2)));
    await waitFor(() => expect(isSelected(tile(2))).toBe(true));
    await expect(isSelected(tile(1))).toBe(true);
    await expect(isSelected(tile(5))).toBe(false);
    // The first report of the drag is the one that clears the selection.
    await expect(args.onMove).toHaveBeenNthCalledWith(1, {
      added: [],
      removed: [],
      clear: true,
    });
    release();
    await expect(screen.getByTestId("selection-area")).not.toBeVisible();

    // A small drag inside one tile of the third column covers that tile
    // only: the column arithmetic lands on the right one.
    const releaseInside = await drag(tile(3), {
      x: centre(tile(3)).x + 20,
      y: centre(tile(3)).y + 20,
    });
    await waitFor(() => expect(isSelected(tile(3))).toBe(true));
    await expect([1, 2, 4].map((n) => isSelected(tile(n)))).toEqual([
      false,
      false,
      false,
    ]);
    releaseInside();
  },
  parameters: {
    docs: {
      description: {
        story:
          "A grid of tiles, the layout the rectangle's column and row arithmetic is built for. Click and drag across the items to select them; a covered tile turns blue. Change any other prop live in the Controls panel below.",
      },
      source: {
        code: `<SelectionArea
  viewAs="tile"
  containerClass="my-container"
  itemsContainerClass="my-items"
  selectableClass="selectable-item"
  scrollClass="my-scroll"
  itemClass="item-name"
  onMove={handleMove}
  countTilesInRow={4}
  arrayTypes={[{ type: "item", itemHeight: 150, rowGap: 16 }]}
/>`,
      },
    },
  },
};

export const RowView: Story = {
  render: (args) => <SelectionTemplate {...args} />,
  args: {
    viewAs: "row",
  },
  play: async () => {
    const row = (n: number) => screen.getByText(`Row ${n}`).parentElement!;
    // Only the vertical extent counts: a drag from row 1 down to row 3,
    // far to the side, covers rows 1 to 3.
    const end = centre(row(3));
    const release = await drag(row(1), { x: end.x + 300, y: end.y });
    await waitFor(() => expect(isSelected(row(3))).toBe(true));
    await expect([1, 2].map((n) => isSelected(row(n)))).toEqual([true, true]);
    await expect(isSelected(row(5))).toBe(false);
    release();
  },
  parameters: {
    docs: {
      description: {
        story:
          "A list of equal-height rows, where only the rectangle's vertical extent decides what is covered: drag down from any row and every row it crosses turns blue, however far to the side the pointer goes (`viewAs`). Each row keeps its `value` on a child, found by `itemClass`.",
      },
      source: {
        code: `<SelectionArea
  viewAs="row"
  containerClass="my-scroll"
  itemsContainerClass="my-items"
  selectableClass="selectable-item"
  scrollClass="my-scroll"
  itemClass="item-name"
  onMove={handleMove}
/>`,
      },
    },
  },
};

export const RightToLeft: Story = {
  render: (args) => (
    <div dir="rtl">
      <SelectionTemplate {...args} gridClassName={styles.exactGrid} />
    </div>
  ),
  globals: { direction: "rtl" },
  args: {
    ...Default.args,
  },
  play: async () => {
    const tile = (n: number) => screen.getByText(`Item ${n}`);
    // Under RTL the first tile is the rightmost; the mirrored column
    // order still lands on it.
    const release = await drag(tile(1), {
      x: centre(tile(1)).x - 20,
      y: centre(tile(1)).y + 20,
    });
    await waitFor(() => expect(isSelected(tile(1))).toBe(true));
    await expect(isSelected(tile(4))).toBe(false);
    release();
  },
  parameters: {
    docs: {
      // Framed: an inline RTL story would flip the whole Docs page.
      story: { inline: false, height: "640px" },
      description: {
        story:
          'The tile grid in a right-to-left layout: the first tile sits in the top right corner, and a drag across the right-hand column selects the first tile of each row. The wrapper carries `dir="rtl"` for the grid; the component mirrors its column order from the theme\'s `interfaceDirection` (the Direction toolbar).',
      },
      source: {
        code: `<div dir="rtl">
  <SelectionArea
    viewAs="tile"
    containerClass="my-container"
    itemsContainerClass="my-items"
    selectableClass="selectable-item"
    scrollClass="my-scroll"
    itemClass="item-name"
    onMove={handleMove}
    countTilesInRow={4}
    arrayTypes={[{ type: "item", itemHeight: 150, rowGap: 16 }]}
  />
</div>`,
      },
    },
  },
};

export const CssCustomization: Story = {
  render: (args) => (
    <div
      style={
        {
          "--selection-area-bg": "rgba(0, 130, 201, 0.25)",
          "--selection-area-border": "1px solid #0082c9",
          "--selection-area-z-index": "10",
        } as CSSProperties
      }
    >
      <SelectionTemplate {...args} />
    </div>
  ),
  args: {
    viewAs: "tile",
    folderHeaderHeight: 0,
    defaultHeaderHeight: 0,
    countTilesInRow: 4,
    arrayTypes: [{ type: "item", itemHeight: 150, rowGap: 16 }],
    isRooms: false,
  },
  play: async () => {
    // The rectangle shows only while a drag is under way.
    const area = screen.getByTestId("selection-area");
    await expect(area).not.toBeVisible();
    const release = await drag(
      screen.getByText("Item 1"),
      centre(screen.getByText("Item 6")),
    );
    await waitFor(() => expect(area).toBeVisible());
    await expect(getComputedStyle(area).backgroundColor).toBe(
      "rgba(0, 130, 201, 0.25)",
    );
    release();
    await expect(area).not.toBeVisible();
  },
  parameters: {
    docs: {
      description: {
        story: `All three variables set on one wrapper -- the variables are listed under CSS variables on this page. Drag across the tiles to see the fill and the border.`,
      },
      source: {
        code: `<div
  style={{
    "--selection-area-bg": "rgba(0, 130, 201, 0.25)",
    "--selection-area-border": "1px solid #0082c9",
    "--selection-area-z-index": "10",
  }}
>
  <SelectionArea
    viewAs="tile"
    containerClass="my-container"
    itemsContainerClass="my-items"
    selectableClass="selectable-item"
    scrollClass="my-scroll"
    itemClass="item-name"
    onMove={handleMove}
    countTilesInRow={4}
    arrayTypes={[{ type: "item", itemHeight: 150, rowGap: 16 }]}
  />
</div>`,
      },
    },
  },
};
