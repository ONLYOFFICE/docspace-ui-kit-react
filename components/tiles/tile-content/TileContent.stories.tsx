import type { ComponentProps, CSSProperties } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, within } from "storybook/test";

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
        "Called when anything inside the slot is clicked; the type declares no parameter, but it receives the React mouse event",
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
    // A story's own decorators render inside this one, so variables meant for
    // the tile around the slot come in through `parameters.tileVariables`.
    (Story, { parameters }) => (
      <div
        style={{
          maxWidth: "300px",
          margin: "20px",
          ...(parameters.tileVariables as CSSProperties | undefined),
        }}
      >
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
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByText("Document.docx"));
    await expect(args.onClick).toHaveBeenCalledTimes(1);
    // The handler gets the click event, whatever the type says.
    const [event] = (args.onClick as ReturnType<typeof fn>).mock.calls[0] as [
      { type: string },
    ];
    await expect(event.type).toBe("click");
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
  play: async ({ canvas }) => {
    await expect(canvas.getByText("My Document")).toBeVisible();
    await expect(canvas.queryByRole("link")).toBeNull();
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
  play: async ({ canvas }) => {
    const name = canvas.getByText("Document.docx").getBoundingClientRect();
    const badge = canvas.getByText("New").getBoundingClientRect();
    await expect(badge.left).toBeGreaterThanOrEqual(name.right);
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
  play: async ({ canvasElement }) => {
    // The slot takes the child's containerWidth; the name is cut off.
    const slot = canvasElement.querySelector(
      ".row-main-wrapper",
    ) as HTMLElement;
    await expect(slot.style.width).toBe("120px");
    const name = within(canvasElement).getByText(
      "Quarterly report with a long name.docx",
    );
    await expect(name.scrollWidth).toBeGreaterThan(name.clientWidth);
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
  args: {
    children: <Link>Document.docx</Link>,
  },
  play: async ({ canvas }) => {
    const tile = getComputedStyle(canvas.getByTestId("tile"));
    await expect(tile.backgroundColor).toBe("rgb(230, 243, 251)");
    await expect(tile.borderTopLeftRadius).toBe("16px");
    await expect(tile.borderTopColor).toBe("rgb(0, 130, 201)");
  },
  parameters: {
    tileVariables: {
      "--tile-bg": "#e6f3fb",
      "--tile-border-style": "1px solid #0082c9",
      "--tile-radius": "16px",
      "--tile-hover-bg": "#cce5f6",
    } as CSSProperties,
    docs: {
      description: {
        story: `TileContent reads no variables of its own -- the tile's variables it sits in are listed under CSS variables on the BaseTile, FileTile, FolderTile and RoomTile pages. This example sets four of the BaseTile ones on a wrapper; hover the tile to see the hover background.`,
      },
    },
  },
};
