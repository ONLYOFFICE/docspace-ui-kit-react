import type { CSSProperties, ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { SelectionAreaProps } from "./SelectionArea.types";

import { useState } from "react";

import { SelectionArea } from "./SelectionArea";
import styles from "./SelectionArea.stories.module.scss";

const meta = {
  title: "UI/Layout/SelectionArea",
  component: SelectionArea,
  tags: ["!autodocs"],
  parameters: {
    docs: {
      description: {
        component: `SelectionArea enables drag-to-select functionality for lists of items in tile or row views.

### Features

- **Drag-to-select**: Click and drag to select multiple items at once
- **Drag threshold**: Draws the rectangle only after the pointer has moved 10 pixels from where the left button went down, so a plain click selects nothing
- **Tile/Row views**: Supports both tile grid and row list layouts
- **Scroll support**: Selection rectangle follows scroll position
- **Multi-type item support**: Handle different item types with varying heights
- **Full-set reporting**: Hands \`onMove\` every covered and every uncovered item on each animation frame of the drag, and keeps no selection of its own
- **Start area**: Starts a drag only on a left-button press inside the element with the id \`sectionScroll\`, and never on an element inside one with the \`not-selectable\` class
- **Right-to-left tiles**: Mirrors the column order of the tile grid when the interface direction is right-to-left

### Usage

Tile grid:

\`\`\`tsx
import { SelectionArea } from "@onlyoffice/apps-ui-kit/components/selection-area";

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
\`\`\`

Row list, where each row holds a child with the \`value\` attribute:

\`\`\`tsx
<div id="sectionScroll" className="my-scroll">
  <div className="my-items">
    {rows.map((row, index) => (
      <div key={row.id} className="selectable-item">
        <span className="item-name" value={\`row_\${index}\`}>
          {row.title}
        </span>
      </div>
    ))}
  </div>
  <SelectionArea
    viewAs="row"
    containerClass="my-scroll"
    itemsContainerClass="my-items"
    selectableClass="selectable-item"
    scrollClass="my-scroll"
    itemClass="item-name"
    onMove={handleMove}
  />
</div>
\`\`\``,
      },
    },
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
        "Called on every animation frame of a drag with every covered item (`added`) and every uncovered one (`removed`). The story uses it to highlight the covered items",
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

const SelectionTemplate = ({
  gridClassName = styles.itemsContainer,
  ...args
}: SelectionAreaProps & { gridClassName?: string }) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleMove = ({
    added,
    removed,
  }: {
    added: Element[];
    removed: Element[];
  }) => {
    setSelectedItems((prev) => {
      const newItems = [...prev];

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
  parameters: {
    docs: {
      description: {
        story: `CSS Custom Properties for external customization:

| Variable | Description | Default |
|----------|-------------|---------|
| \`--selection-area-bg\` | Selection rectangle fill | \`rgba(68, 170, 255, 0.5)\` |
| \`--selection-area-border\` | Selection rectangle border | \`1px solid #5299e0\` |
| \`--selection-area-z-index\` | Stack order | \`1000\` |

The example sets all three on a wrapper; drag across the tiles to see the fill and the border.`,
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
