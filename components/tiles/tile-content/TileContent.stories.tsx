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
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
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
        story: `TileContent reads no variables of its own -- the tile's variables it sits in are listed under CSS variables on the BaseTile, FileTile, FolderTile and RoomTile pages. This example sets four of the BaseTile ones on a wrapper; hover the tile to see the hover background.`,
      },
    },
  },
};
