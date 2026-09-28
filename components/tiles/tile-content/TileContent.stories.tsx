import type { ComponentProps, CSSProperties } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

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
        component: `The slot a tile puts its name in, so that every tile in the family lays its title out the same way.

### Features

- **Title Slot**: Holds the one element a tile shows as its name, in the row beside the icon
- **Full Width**: Stretches across the space the tile leaves between its icon and its menu button
- **Fixed Width**: Takes a fixed width from the child's own \`containerWidth\` prop, which the kit's \`Text\` and \`Link\` accept
- **Single-Line Text On Tablets**: Keeps plain text in the slot on one line, cut off with an ellipsis, between 600px and 1023px; a link inside a tile still wraps to two lines there
- **Title Font**: Sets 12px semibold text for anything inside that does not choose its own font
- **Richer Titles**: Takes a wrapper of your own when the name needs something beside it, such as a badge
- **Click Handler**: Calls \`onClick\` on any click inside the slot, with no argument

### Usage

\`\`\`tsx
import { TileContent } from "@onlyoffice/apps-ui-kit/components/tiles/tile-content";
import { BaseTile } from "@onlyoffice/apps-ui-kit/components/tiles/base-tile";

<BaseTile item={item} element={icon} topContent={
  <TileContent>
    <Link>Document.docx</Link>
  </TileContent>
} />

// A title with a fixed width, read from the child's containerWidth
<TileContent>
  <Text containerWidth="120px" truncate>Quarterly report.docx</Text>
</TileContent>
\`\`\``,
      },
    },
  },
  argTypes: {
    children: {
      control: false,
      description:
        "The one element shown as the tile's name; a `containerWidth` prop on it becomes the width of the slot",
    },
    onClick: {
      description:
        "Called with no argument when anything inside the slot is clicked",
    },
    className: {
      control: "text",
      description: "Class added after the component's own on the outer element",
    },
    id: {
      control: "text",
      description: "Value of `id` on the outer element",
    },
    style: {
      control: "object",
      description: "Inline style of the outer element",
    },
  },
  args: {
    onClick: fn(),
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
        story:
          "A file name as a link, the way a tile usually shows it. Click it to see `onClick` in the Actions panel, and change any other prop live in the Controls panel below.",
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
        story:
          "A name that should not look clickable, for an item the reader cannot open: plain `Text` in place of a link.",
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
        story:
          "A name with a badge beside it. The slot takes one element, so the name and the badge go inside a wrapper of your own.",
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

export const FixedTitleWidth: Story = {
  args: {
    children: (
      <Text containerWidth="120px" truncate>
        Quarterly report with a long name.docx
      </Text>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          "A name held to a set width whatever room the tile has, so the names in a grid end at the same point: the slot takes its width from the child's own `containerWidth` prop, and `truncate` on the `Text` cuts the rest off.",
      },
      source: {
        code: `<TileContent>
  <Text containerWidth="120px" truncate>
    Quarterly report with a long name.docx
  </Text>
</TileContent>`,
      },
    },
  },
};

export const CssCustomization: Story = {
  // This decorator wraps the meta one, so the variables reach the BaseTile around the slot.
  decorators: [
    (Story) => (
      <div
        style={
          {
            "--tile-bg": "#e6f3fb",
            "--tile-border-style": "1px solid #0082c9",
            "--tile-radius": "16px",
            "--tile-hover-bg": "#cce5f6",
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
        story: `CSS Custom Properties for external customization:

TileContent reads none of its own; the ones below belong to the BaseTile around it, set on a wrapper here. Hover the tile to see the hover background.

| Variable | Description | Default |
|----------|-------------|---------|
| \`--tile-bg\` | Tile background color | theme-based |
| \`--tile-border-style\` | Tile border | theme-based |
| \`--tile-radius\` | Tile border radius | \`12px\` |
| \`--tile-hover-bg\` | Background while hovered, checked or active | theme-based |

See **BaseTile**, **FileTile**, **FolderTile**, or **RoomTile** CSS Custom Properties stories for the full list.`,
      },
    },
  },
};
