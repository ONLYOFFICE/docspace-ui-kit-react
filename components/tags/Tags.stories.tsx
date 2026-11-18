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
      description: "Tags to lay out. A bare string is treated as `{ label }`.",
    },
    columnCount: {
      control: "number",
      description:
        "How many tags are drawn before the rest collapse into one overflow tag. `-1` draws all of them.",
    },
    showCreateTag: {
      control: "boolean",
      description:
        "Whether a plus tag is drawn for creating a new one. It comes after the overflow tag when the tags overflow.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    removeTagIcon: {
      control: "boolean",
      description:
        "Passed to the overflow drop-down, where it removes the leading margin of each entry.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    onSelectTag: {
      action: "tag selected",
      description:
        "Called with `{ label, roomType, providerType }` when a tag, or an entry of the overflow drop-down, is clicked or activated with Enter or Space. A tag with its own `TagType.onClick` calls that instead.",
    },
    onMouseEnter: {
      action: "mouse enter",
      description:
        "Called when the pointer enters any tag. It is not told which one.",
    },
    onMouseLeave: {
      action: "mouse leave",
      description: "Called when the pointer leaves any tag.",
    },
    onOptionTagClick: {
      control: false,
      description:
        'Called when the overflow tag or the create tag is clicked, with `"overflow"` or `"create"` to say which. Passing it replaces the built-in drop-down.',
    },
    optionTagRef: {
      control: false,
      description:
        "Ref to the overflow tag, for a menu of your own anchored to it. When there is no overflow tag it points at the create tag.",
    },
    ariaLabel: {
      control: "text",
      description:
        'Accessible name of the row, which is a `role="group"`. Defaults to the translated `Common:Tags` ("Tags").',
      table: {
        defaultValue: { summary: '"Tags" (translated)' },
      },
    },
    createTagLabel: {
      control: "text",
      description:
        'Accessible name and `title` of the plus tag drawn by `showCreateTag`. Defaults to the translated "Add".',
    },
    id: {
      control: "text",
      description: "Applied to the outermost element.",
    },
    className: {
      control: "text",
      description: "Applied to the outermost element.",
    },
    style: {
      control: "object",
      description: "Applied to the outermost element as inline style.",
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

    // Every tag is a button on the tab order, and Enter selects it.
    await expect(canvas.getByRole("group", { name: "Tags" })).toBeVisible();
    canvas.getByRole("button", { name: "Design" }).focus();
    await userEvent.tab();
    const development = canvas.getByRole("button", { name: "Development" });
    await expect(development).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(args.onSelectTag).toHaveBeenLastCalledWith(
      expect.objectContaining({ label: "Development" }),
    );
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
  name: "Five tags",
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
  name: "With overflow",
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

    // The same from the keyboard: Enter on "..." moves the focus to the
    // first entry, the arrows move it, and Enter selects.
    const more = canvas.getByRole("button", { name: "..." });
    await expect(more).toHaveAttribute("aria-haspopup", "listbox");
    more.focus();
    await userEvent.keyboard("{Enter}");
    await expect(more).toHaveAttribute("aria-expanded", "true");
    await waitFor(() =>
      expect(screen.getAllByTestId("tag_dropdown_item")[0]).toHaveFocus(),
    );
    await userEvent.keyboard("{ArrowDown}{ArrowDown}{Enter}");
    await expect(args.onSelectTag).toHaveBeenLastCalledWith(
      expect.objectContaining({ label: "Tag6" }),
    );
    await expect(more).toHaveFocus();
  },
  parameters: {
    docs: {
      description: {
        story:
          "Three tags and a `...` tag, which lists the other three in a drop-down. Picking an entry calls `onSelectTag`.",
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
  name: "Tag objects",
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
          "Tags built from objects, for looks a plain string cannot ask for. **Design** has an icon, **Review** a suffix, and the third is only its icon (`isThirdParty`).",
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
  name: "All shown",
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
          "All five tags at their natural width, with no overflow tag (`columnCount={-1}`). Tags that do not fit are cut off at the container edge.",
      },
      source: {
        code: `<Tags tags={["Tag1", "Tag2", "Tag3", "Tag4", "Tag5"]} columnCount={-1} onSelectTag={handleSelect} />`,
      },
    },
  },
};

export const WithCreateTag: Story = {
  name: "With a create tag",
  render: (args) => <Tags {...args} />,
  args: {
    tags: ["Design", "Development"],
    columnCount: 3,
    showCreateTag: true,
    onOptionTagClick: fn(),
  },
  play: async ({ args, canvas, userEvent }) => {
    // The plus tag comes last, named by createTagLabel (the translated
    // "Add" by default) and with a test id of its own.
    const row = canvas.getByTestId("tags");
    const plus = row.lastElementChild as HTMLElement;
    await expect(plus).toHaveAttribute("data-testid", "tag_item_create");
    await expect(plus).toHaveAccessibleName(/\S/);
    await expect(plus).toHaveAttribute("role", "button");
    await userEvent.click(plus);
    await expect(args.onOptionTagClick).toHaveBeenCalledTimes(1);
    await expect(args.onSelectTag).not.toHaveBeenCalled();
  },
  parameters: {
    docs: {
      description: {
        story:
          "A plus tag after the two tags, which calls `onOptionTagClick` (`showCreateTag`). Once the tags overflow it stays, after the overflow tag.",
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
  name: "Own overflow menu",
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
          "Two tags and a `+1` count instead of `...`, for hidden tags in a menu of your own. The count calls `onOptionTagClick`, and `optionTagRef` points at it.",
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
  name: "CSS variables",
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
        story: `A row whose overflow menu entries start 24px from the menu's edge, from the variable set on the document.`,
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
