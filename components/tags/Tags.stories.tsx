import { useEffect, useRef } from "react";

import type { ComponentProps, ReactElement } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen, waitFor } from "storybook/test";

import FolderIcon from "../../assets/icons/16/catalog.folder.react.svg";

import { Tags } from ".";

const meta = {
  title: "UI/Data display/Tags",
  component: Tags,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
    design: {
      type: "figma",
      url: "https://www.figma.com/file/ZiW5KSwb4t7Tj6Nz5TducC/UI-Kit-DocSpace-1.0.0?type=design&node-id=62-2597&mode=design&t=TBNCKMQKQMxr44IZ-0",
    },
  },
  argTypes: {
    tags: {
      description:
        "Tags to lay out: plain strings, or objects with a label and an optional icon, suffix or icon-only look",
    },
    columnCount: {
      control: "number",
      description:
        "How many tags are drawn before the rest collapse into one overflow tag; -1 draws all of them",
    },
    showCreateTag: {
      control: "boolean",
      description:
        "Draws a plus tag after the others, or before them when every tag is shown; it disappears as soon as the tags overflow",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    removeTagIcon: {
      control: "boolean",
      description:
        "Removes the leading margin of each entry in the overflow drop-down, so the entry text starts at the menu's edge",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    onSelectTag: {
      action: "tag selected",
      description:
        "Called with the tag's label (and its passed-through numbers) when a tag or an entry of the overflow drop-down is clicked",
    },
    onMouseEnter: {
      action: "mouse enter",
      description:
        "Called when the pointer enters any tag; it is not told which one",
    },
    onMouseLeave: {
      action: "mouse leave",
      description: "Called when the pointer leaves any tag",
    },
    onOptionTagClick: {
      control: false,
      description:
        "Called when the overflow tag or the plus tag is clicked; passing it turns the overflow tag into a +N count with no drop-down",
    },
    optionTagRef: {
      control: false,
      description:
        "Ref to the overflow tag, for anchoring a menu of your own to it",
    },
    id: {
      control: "text",
      description: "Applied to the outermost element",
    },
    className: {
      control: "text",
      description: "Applied to the outermost element",
    },
    style: {
      control: "object",
      description:
        "Inline style of the outermost element; its width is the width the tags share",
    },
  },
  args: {
    onSelectTag: fn(),
  },
} satisfies Meta<typeof Tags>;

type Story = StoryObj<ComponentProps<typeof Tags>>;

export default meta;

export const Default: Story = {
  render: (args) => <Tags {...args} />,
  args: {
    tags: ["Design", "Development"],
    columnCount: 2,
  },
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByTestId("tag_item_Design"));
    await expect(args.onSelectTag).toHaveBeenCalledWith(
      expect.objectContaining({ label: "Design" }),
    );
    await expect(canvas.getByTestId("tag_item_Development")).toBeVisible();
  },
};

const CustomOptionTagTemplate = (args: ComponentProps<typeof Tags>) => {
  const optionRef = useRef<HTMLDivElement>(null);
  return <Tags {...args} optionTagRef={optionRef} />;
};

const withRoomBelow = (height: number) => (Story: () => ReactElement) => (
  <div style={{ height, paddingTop: 20 }}>
    <Story />
  </div>
);

export const MultipleTags: Story = {
  render: (args) => <Tags {...args} />,
  args: {
    tags: ["Draft", "Review", "Contract", "Invoice", "Archive"],
    columnCount: 5,
  },
  play: async ({ canvas }) => {
    // Every tag fits, so there is no overflow tag.
    await expect(canvas.getByTestId("tags").children).toHaveLength(5);
    await expect(canvas.queryByTestId("tag_item_...")).toBeNull();
  },
  parameters: {
    docs: {
      description: {
        story:
          "Five tags side by side, each given an equal share of the row, for when the column count leaves room for all of them.",
      },
      source: {
        code: `<Tags
  tags={["Draft", "Review", "Contract", "Invoice", "Archive"]}
  columnCount={5}
  onSelectTag={handleSelect}
/>`,
      },
    },
  },
};

export const WithOverflow: Story = {
  render: (args) => <Tags {...args} />,
  decorators: [withRoomBelow(150)],
  args: {
    tags: ["Tag1", "Tag2", "Tag3", "Tag4", "Tag5", "Tag6"],
    style: { width: "250px" },
    columnCount: 3,
  },
  play: async ({ args, canvas, userEvent }) => {
    // Three tags, then "..." for the rest.
    await expect(canvas.getByTestId("tag_item_Tag3")).toBeVisible();
    await expect(canvas.queryByTestId("tag_item_Tag4")).toBeNull();

    await userEvent.click(canvas.getByLabelText("..."));
    const entries = await screen.findAllByTestId("tag_dropdown_item");
    await expect(entries.map((entry) => entry.textContent)).toEqual([
      "Tag4",
      "Tag5",
      "Tag6",
    ]);

    // The entry's text takes no pointer events, so a click lands on the
    // entry itself, which carries the label; the menu then closes.
    await userEvent.click(entries[1]);
    await expect(args.onSelectTag).toHaveBeenCalledWith(
      expect.objectContaining({ label: "Tag5" }),
    );
    await waitFor(() => {
      const open = screen
        .queryAllByTestId("tag_dropdown_item")
        .filter((entry) => entry.checkVisibility());
      expect(open).toHaveLength(0);
    });
  },
  parameters: {
    docs: {
      description: {
        story:
          "Three tags and a `...` tag; click it to list the other three in a drop-down, and click an entry to select it (`onSelectTag`). Switch `removeTagIcon` in the Controls panel below to see the entries lose their leading margin.",
      },
      source: {
        code: `<Tags
  tags={["Tag1", "Tag2", "Tag3", "Tag4", "Tag5", "Tag6"]}
  style={{ width: "250px" }}
  columnCount={3}
  onSelectTag={handleSelect}
/>`,
      },
    },
  },
};

export const WithTagObjects: Story = {
  render: (args) => <Tags {...args} />,
  args: {
    tags: [
      { label: "Design", icon: FolderIcon },
      { label: "Review", labelSuffix: " (3)" },
      { label: "Storage", icon: FolderIcon, isThirdParty: true },
    ],
    columnCount: 3,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByTestId("tag_item_Review")).toHaveTextContent(
      "Review (3)",
    );
    // isThirdParty draws the icon alone; the label stays its name.
    const storage = canvas.getByLabelText("Storage");
    await expect(storage).not.toHaveTextContent("Storage");
    await expect(storage.querySelector("svg")).not.toBeNull();
  },
  parameters: {
    docs: {
      description: {
        story:
          "**Design** carries an icon before its label, **Review** a suffix after it, and the third tag is only its icon at a fixed width (`isThirdParty`) — the looks a plain string cannot ask for.",
      },
      source: {
        code: `<Tags
  tags={[
    { label: "Design", icon: FolderIcon },
    { label: "Review", labelSuffix: " (3)" },
    { label: "Storage", icon: FolderIcon, isThirdParty: true },
  ]}
  columnCount={3}
  onSelectTag={handleSelect}
/>`,
      },
    },
  },
};

export const ShowAll: Story = {
  render: (args) => <Tags {...args} />,
  args: {
    tags: ["Tag1", "Tag2", "Tag3", "Tag4", "Tag5"],
    columnCount: -1,
  },
  play: async ({ canvas }) => {
    // -1 draws every tag and no overflow tag.
    await expect(canvas.getByTestId("tags").children).toHaveLength(5);
    await expect(canvas.queryByLabelText("...")).toBeNull();
  },
  parameters: {
    docs: {
      description: {
        story:
          "All five tags at their natural width with no overflow tag, for a place where every tag must stay visible (`columnCount={-1}`); tags that do not fit are cut off at the container edge.",
      },
      source: {
        code: `<Tags tags={["Tag1", "Tag2", "Tag3", "Tag4", "Tag5"]} columnCount={-1} onSelectTag={handleSelect} />`,
      },
    },
  },
};

export const WithCreateTag: Story = {
  render: (args) => <Tags {...args} />,
  args: {
    tags: ["Design", "Development"],
    columnCount: 3,
    showCreateTag: true,
    onOptionTagClick: fn(),
  },
  play: async ({ args, canvas, userEvent }) => {
    // The plus tag comes last. Its label is empty, so it is found by
    // its test id; it has no accessible name.
    const row = canvas.getByTestId("tags");
    const plus = row.lastElementChild as HTMLElement;
    await expect(plus).toHaveAttribute("data-testid", "tag_item_");
    await userEvent.click(plus);
    await expect(args.onOptionTagClick).toHaveBeenCalledTimes(1);
    await expect(args.onSelectTag).not.toHaveBeenCalled();
  },
  parameters: {
    docs: {
      description: {
        story:
          "A plus tag after the two tags, for offering to add one more (`showCreateTag`); clicking it calls `onOptionTagClick`, and it disappears once the tags overflow.",
      },
      source: {
        code: `<Tags
  tags={["Design", "Development"]}
  columnCount={3}
  showCreateTag
  onSelectTag={handleSelect}
  onOptionTagClick={openCreateDialog}
/>`,
      },
    },
  },
};

export const WithCustomOptionTag: Story = {
  render: (args) => <CustomOptionTagTemplate {...args} />,
  decorators: [withRoomBelow(100)],
  args: {
    tags: ["Tag1", "Tag2", "Tag3"],
    columnCount: 2,
    onOptionTagClick: fn(),
    style: { width: "150px" },
  },
  play: async ({ args, canvas, userEvent }) => {
    // With onOptionTagClick the overflow tag is a +N count with no menu.
    await userEvent.click(canvas.getByLabelText("+1"));
    await expect(args.onOptionTagClick).toHaveBeenCalledTimes(1);
    await expect(screen.queryByTestId("tag_dropdown_item")).toBeNull();
  },
  parameters: {
    docs: {
      description: {
        story:
          "Two tags and a `+1` count instead of `...`, for when the hidden tags belong in a menu of your own: clicking the count opens no drop-down and calls `onOptionTagClick`, and `optionTagRef` points at it for anchoring.",
      },
      source: {
        code: `const optionRef = useRef(null);
<Tags
  tags={["Tag1", "Tag2", "Tag3"]}
  columnCount={2}
  onSelectTag={handleSelect}
  optionTagRef={optionRef}
  onOptionTagClick={openTagMenu}
  style={{ width: "150px" }}
/>`,
      },
    },
  },
};

const CssCustomizationTemplate = (args: ComponentProps<typeof Tags>) => {
  // The drop-down is portalled to the body, so only a document-level value reaches it.
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--tags-overflow-text-margin", "24px");
    return () => {
      root.style.removeProperty("--tags-overflow-text-margin");
    };
  }, []);
  return <Tags {...args} />;
};

export const CssCustomization: Story = {
  render: (args) => <CssCustomizationTemplate {...args} />,
  args: {
    tags: ["Draft", "Review", "Contract", "Invoice"],
    columnCount: 3,
    style: { width: "200px" },
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByLabelText("..."));
    const [entry] = await screen.findAllByTestId("tag_dropdown_item");
    const text = entry.firstElementChild as HTMLElement;
    await expect(getComputedStyle(text).marginInlineStart).toBe("24px");
  },
  parameters: {
    docs: {
      // Own document: the variable is set on <html> and would indent every story's drop-down.
      story: { inline: false, height: "180px" },
      description: {
        story: `The variable is listed under CSS variables on this page. The example sets it to 24px on the document; click the \`...\` tag to see the entry **Invoice** start further from the menu's edge.`,
      },
      source: {
        code: `:root {
  --tags-overflow-text-margin: 24px;
}

<Tags
  tags={["Draft", "Review", "Contract", "Invoice"]}
  columnCount={3}
  style={{ width: "200px" }}
  onSelectTag={handleSelect}
/>`,
      },
    },
  },
};
