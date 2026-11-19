import type { CSSProperties, ComponentProps } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, waitFor, within } from "storybook/test";

import CatalogFolderIcon from "../../assets/icons/16/catalog.folder.react.svg";
import CatalogFolderReactSvgUrl from "../../assets/icons/16/catalog.folder.react.svg?url";

import { Tag } from ".";

const meta = {
  title: "UI/Data display/Tag",
  component: Tag,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
    design: {
      type: "figma",
      url: "https://www.figma.com/file/ZiW5KSwb4t7Tj6Nz5TducC/UI-Kit-DocSpace-1.0.0?type=design&node-id=62-2597&mode=design&t=TBNCKMQKQMxr44IZ-0",
    },
  },
  argTypes: {
    tag: {
      control: "text",
      description:
        "Identifier of the tag. It is handed to `onDelete`, and it is the text shown when `label` is left out.",
    },
    label: {
      control: "text",
      description:
        "Text of the tag. It is also the `title` attribute and the accessible name.",
    },
    isNewTag: {
      control: "boolean",
      description:
        'Whether the tag is drawn in its "new" colours. It is also what makes the delete cross appear.',
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isDisabled: {
      control: "boolean",
      description:
        "Whether the tag is inert, with a dashed border and a greyed label. Pointer events are dropped in CSS as well, so hover does nothing either.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isDeleted: {
      control: "boolean",
      description:
        "Whether the tag counts as removed: `onClick` stops firing, the border greys out and the label is struck through.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    tagMaxWidth: {
      control: "text",
      description:
        "`max-width` of the tag, as a CSS length — `Tags` passes a percentage of its own width.",
    },
    icon: {
      control: false,
      description:
        "Glyph before the label: an SVG URL, or a component rendered as a 12px icon.",
    },
    iconClassName: {
      control: "text",
      description: "Applied to that glyph.",
    },
    withLabel: {
      control: "boolean",
      description:
        "Whether the label is rendered. Turn it off for a tag that is only its icon.",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    labelSuffix: {
      control: "text",
      description: "Extra text after the label, inside the same line.",
    },
    labelSuffixColor: {
      control: "color",
      description: "CSS colour of that suffix.",
    },
    isLast: {
      control: "boolean",
      description:
        "Whether the trailing margin is dropped, for the last tag in a row.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isDefault: {
      control: false,
      description:
        "Ignored. Nothing reads this prop on a single tag; it is `TagType.isDefault` that `Tags` acts on.",
    },
    roomType: {
      control: "number",
      description:
        "Passed straight back through `onClick`. The component itself does nothing with it.",
    },
    providerType: {
      control: "number",
      description:
        "Passed straight back through `onClick`. The component itself does nothing with it.",
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
      description:
        "Merged into the outermost element's inline style, before `tagMaxWidth` is applied.",
    },
    dataTestId: {
      control: "text",
      description: "`data-testid` of the outermost element.",
      table: {
        defaultValue: { summary: '"tag_item"' },
      },
    },
    ref: {
      control: false,
      description: "Ref to the outermost element.",
    },
    onClick: {
      action: "clicked",
      description:
        "Called on a click anywhere in the tag, with `{ label, roomType, providerType }` — not with the DOM event.",
    },
    onDelete: {
      action: "deleted",
      description:
        "Called with `tag` when the cross is clicked. The cross is only rendered when `isNewTag` is set as well.",
    },
    onMouseEnter: {
      action: "mouseEntered",
      description: "Called when the pointer enters the tag.",
    },
    onMouseLeave: {
      action: "mouseLeft",
      description: "Called when the pointer leaves the tag.",
    },
  },
} satisfies Meta<typeof Tag>;

type Story = StoryObj<ComponentProps<typeof Tag>>;

export default meta;

const Wrapper = (props: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "8px",
        alignItems: "center",
      }}
    >
      {props.children}
    </div>
  );
};

const rect = (element: Element) => element.getBoundingClientRect();

export const Default: Story = {
  render: (args) => <Tag {...args} />,
  args: {
    tag: "script",
    label: "Script",
    tagMaxWidth: "160px",
  },
  play: async ({ canvas }) => {
    const tag = canvas.getByLabelText("Script");
    await expect(tag).toHaveTextContent("Script");
    await expect(rect(tag).width).toBeLessThanOrEqual(160);
    // A plain tag carries no delete cross.
    await expect(within(tag).queryByTestId("icon-button")).toBeNull();
  },
  parameters: {
    docs: {
      description: {
        story:
          "A plain tag with a label, the starting point for every other state.",
      },
      source: {
        code: `<Tag tag="script" label="Script" tagMaxWidth="160px" />`,
      },
    },
  },
};

const StatesTemplate = () => {
  return (
    <Wrapper>
      <Tag tag="default" label="Default" />
      <Tag tag="new" label="New Tag" isNewTag onDelete={() => {}} />
      <Tag tag="disabled" label="Disabled" isDisabled />
      <Tag tag="deleted" label="Deleted" isDeleted />
    </Wrapper>
  );
};

const NewTagTemplate = ({ onDelete }: ComponentProps<typeof Tag>) => {
  return (
    <Wrapper>
      <Tag tag="drafts" label="Drafts" isNewTag onDelete={onDelete} />
      <Tag tag="review" label="Review" isNewTag onDelete={onDelete} />
      <Tag tag="archive" label="Archive" isNewTag onDelete={onDelete} />
    </Wrapper>
  );
};

const ClickableTemplate = ({ onClick }: ComponentProps<typeof Tag>) => {
  return (
    <Wrapper>
      <Tag tag="design" label="Design" onClick={onClick} />
      <Tag tag="development" label="Development" onClick={onClick} />
      <Tag tag="marketing" label="Marketing" onClick={onClick} />
    </Wrapper>
  );
};

const MaxWidthTemplate = () => {
  return (
    <Wrapper>
      <Tag tag="short" label="Short" tagMaxWidth="80px" />
      <Tag
        tag="long"
        label="This is a very long tag label that will be truncated"
        tagMaxWidth="160px"
      />
      <Tag tag="wide" label="Wide tag with more space" tagMaxWidth="250px" />
    </Wrapper>
  );
};

export const States: Story = {
  name: "States",
  render: () => <StatesTemplate />,
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText("Disabled")).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    // Only the new tag, which has onDelete, draws a delete cross.
    for (const label of ["Default", "Disabled", "Deleted"]) {
      await expect(
        within(canvas.getByLabelText(label)).queryByTestId("icon-button"),
      ).not.toBeInTheDocument();
    }
    await expect(
      within(canvas.getByLabelText("New Tag")).getByTestId("icon-button"),
    ).toBeInTheDocument();
    // A deleted tag strikes its label through; a disabled one greys it.
    const labelOf = (name: string) =>
      within(canvas.getByLabelText(name)).getByText(name);
    await expect(
      getComputedStyle(labelOf("Deleted")).textDecorationLine,
    ).toContain("line-through");
    await expect(getComputedStyle(labelOf("Disabled")).color).not.toBe(
      getComputedStyle(labelOf("Default")).color,
    );
  },
  parameters: {
    docs: {
      description: {
        story: `The four looks a tag can take:

- **Default** — a bordered tag
- **New Tag** — filled, with a delete cross (\`isNewTag\` with \`onDelete\`)
- **Disabled** — a dashed border and a grey label; hover and clicks do nothing (\`isDisabled\`)
- **Deleted** — a grey border and a struck-through label; clicks skip \`onClick\` (\`isDeleted\`)`,
      },
      source: {
        code: `<Tag tag="default" label="Default" />
<Tag tag="new" label="New Tag" isNewTag onDelete={() => {}} />
<Tag tag="disabled" label="Disabled" isDisabled />
<Tag tag="deleted" label="Deleted" isDeleted />`,
      },
    },
  },
};

export const NewTags: Story = {
  name: "Removable",
  render: (args) => <NewTagTemplate {...args} />,
  args: { onDelete: fn() },
  play: async ({ args, canvas, userEvent }) => {
    // The cross is the tag's only button; onDelete gets the identifier,
    // not the label.
    const review = canvas.getByLabelText("Review");
    await userEvent.click(within(review).getByTestId("icon-button"));
    await expect(args.onDelete).toHaveBeenCalledWith("review");
  },
  parameters: {
    docs: {
      description: {
        story:
          "Tags the user has just added, each with a cross that removes it (`isNewTag`, `onDelete`). `onDelete` receives the tag's identifier, not its label.",
      },
      source: {
        code: `<Tag tag="drafts" label="Drafts" isNewTag onDelete={(tag) => console.log(tag)} />
<Tag tag="review" label="Review" isNewTag onDelete={(tag) => console.log(tag)} />
<Tag tag="archive" label="Archive" isNewTag onDelete={(tag) => console.log(tag)} />`,
      },
    },
  },
};

export const ClickableTags: Story = {
  name: "Clickable",
  render: (args) => <ClickableTemplate {...args} />,
  args: { onClick: fn() },
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByLabelText("Design"));
    // An object naming the tag, not the DOM event.
    await expect(args.onClick).toHaveBeenCalledWith(
      expect.objectContaining({ label: "Design" }),
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Tags that act as filters and highlight on hover (`onClick`). A click passes a `{ label }` object to `onClick`, not the DOM event.",
      },
      source: {
        code: `<Tag tag="design" label="Design" onClick={({ label }) => console.log(label)} />
<Tag tag="development" label="Development" onClick={({ label }) => console.log(label)} />
<Tag tag="marketing" label="Marketing" onClick={({ label }) => console.log(label)} />`,
      },
    },
  },
};

export const MaxWidthVariants: Story = {
  name: "Width caps",
  render: () => <MaxWidthTemplate />,
  play: async ({ canvas }) => {
    const widths: Record<string, number> = {
      Short: 80,
      "This is a very long tag label that will be truncated": 160,
      "Wide tag with more space": 250,
    };
    for (const [label, max] of Object.entries(widths)) {
      await expect(
        rect(canvas.getByLabelText(label)).width,
      ).toBeLessThanOrEqual(max);
    }
    // The long label is cut with an ellipsis.
    const long = canvas.getByText(
      "This is a very long tag label that will be truncated",
    );
    await expect(long.scrollWidth).toBeGreaterThan(long.clientWidth);
  },
  parameters: {
    docs: {
      description: {
        story:
          "Tags capped at 80, 160 and 250px (`tagMaxWidth`). A label past its cap ends with an ellipsis.",
      },
      source: {
        code: `<Tag tag="short" label="Short" tagMaxWidth="80px" />
<Tag tag="long" label="This is a very long tag label..." tagMaxWidth="160px" />
<Tag tag="wide" label="Wide tag with more space" tagMaxWidth="250px" />`,
      },
    },
  },
};

export const IconOnly: Story = {
  name: "Icon only",
  render: () => (
    <Wrapper>
      <Tag
        tag="url"
        label="Folder from a URL"
        icon={CatalogFolderReactSvgUrl}
        withLabel={false}
      />
      <Tag
        tag="component"
        label="Folder component"
        icon={CatalogFolderIcon}
        withLabel={false}
      />
    </Wrapper>
  ),
  play: async ({ canvas }) => {
    // Only the glyph shows; the hidden label still names the tag.
    for (const label of ["Folder from a URL", "Folder component"]) {
      const tag = canvas.getByLabelText(label);
      // The URL glyph is fetched and inlined after mounting.
      await waitFor(() => expect(tag.querySelector("svg, img")).not.toBeNull());
      await expect(tag).not.toHaveTextContent(label);
    }
  },
  parameters: {
    docs: {
      description: {
        story: `Two tags that are only a glyph (\`withLabel={false}\`); the hidden label still names each for screen readers:

- **First tag** — the glyph loaded from an SVG file (\`icon\` as a URL)
- **Second tag** — the same glyph passed as a React component (\`icon\` as a component)`,
      },
      source: {
        code: `<Tag tag="url" label="Folder from a URL" icon={folderIconUrl} withLabel={false} />
<Tag tag="component" label="Folder component" icon={FolderIcon} withLabel={false} />`,
      },
    },
  },
};

export const WithLabelSuffix: Story = {
  name: "With a count",
  render: (args) => <Tag {...args} />,
  args: {
    tag: "reports",
    label: "Reports",
    labelSuffix: " (12)",
    labelSuffixColor: "#A3A9AE",
  },
  play: async ({ canvas }) => {
    const tag = canvas.getByLabelText(/Reports/);
    await expect(tag).toHaveTextContent("Reports (12)");
    await expect(within(tag).getByText("(12)")).toHaveStyle({
      color: "rgb(163, 169, 174)",
    });
  },
  parameters: {
    docs: {
      description: {
        story:
          "A count after the label, in a quieter colour (`labelSuffix`, `labelSuffixColor`).",
      },
      source: {
        code: `<Tag tag="reports" label="Reports" labelSuffix=" (12)" labelSuffixColor="#A3A9AE" />`,
      },
    },
  },
};

export const CssCustomization: Story = {
  name: "CSS variables",
  play: async ({ canvas }) => {
    const custom = canvas.getByLabelText("Custom Tag");
    await expect(custom).toHaveStyle({
      backgroundColor: "rgb(237, 231, 246)",
      borderRadius: "16px",
      // --tag-height is a max-height; the content stays 28px tall.
      maxHeight: "30px",
    });
    // --tag-spacing-end: the room left before the next tag.
    await expect(
      Math.round(
        rect(canvas.getByLabelText("Second Tag")).left - rect(custom).right,
      ),
    ).toBe(16);
    // --tag-text-color and --tag-size reach the label.
    await expect(within(custom).getByText("Custom Tag")).toHaveStyle({
      color: "rgb(106, 27, 154)",
      fontSize: "14px",
    });
  },
  render: () => (
    <div
      style={
        {
          display: "flex",
          "--tag-bg": "light-dark(#EDE7F6, #2a2147)",
          "--tag-border-style": "1px solid #9C27B0",
          "--tag-radius": "16px",
          "--tag-inner-padding": "4px 14px",
          "--tag-height": "30px",
          "--tag-spacing-end": "16px",
          "--tag-text-color": "#6A1B9A",
          "--tag-size": "14px",
        } as CSSProperties
      }
    >
      <Tag tag="custom" label="Custom Tag" />
      <Tag tag="second" label="Second Tag" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `Two tags under a wrapper that sets eight variables. The second shows the space \`--tag-spacing-end\` leaves after **Custom Tag**.`,
      },
      source: {
        code: `<div
  style={{
    display: "flex",
    "--tag-bg": "light-dark(#EDE7F6, #2a2147)",
    "--tag-border-style": "1px solid #9C27B0",
    "--tag-radius": "16px",
    "--tag-inner-padding": "4px 14px",
    "--tag-height": "30px",
    "--tag-spacing-end": "16px",
    "--tag-text-color": "#6A1B9A",
    "--tag-size": "14px",
  }}
>
  <Tag tag="custom" label="Custom Tag" />
  <Tag tag="second" label="Second Tag" />
</div>`,
      },
    },
  },
};
