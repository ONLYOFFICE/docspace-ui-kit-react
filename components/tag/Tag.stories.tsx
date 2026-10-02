import type { CSSProperties, ComponentProps } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

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
        "Identifier of the tag: handed to `onDelete`, and shown as the text when `label` is left out",
    },
    label: {
      control: "text",
      description: "Text of the tag, also used as its accessible name",
    },
    isNewTag: {
      control: "boolean",
      description:
        'Draws the tag in its "new" colours; together with `onDelete` it also shows the delete cross',
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isDisabled: {
      control: "boolean",
      description: "Disables the tag and prevents interactions",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isDeleted: {
      control: "boolean",
      description:
        "Marks the tag as removed: the border greys out and `onClick` stops firing",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    tagMaxWidth: {
      control: "text",
      description: "Maximum width of the tag (CSS value)",
    },
    icon: {
      control: false,
      description:
        "Glyph before the label: an SVG URL, or a component rendered as a 12px icon",
    },
    iconClassName: {
      control: "text",
      description: "Class name applied to the glyph",
    },
    withLabel: {
      control: "boolean",
      description:
        "Whether the label is rendered; turn it off for a tag that is only its glyph",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    labelSuffix: {
      control: "text",
      description: "Extra text after the label, on the same line",
    },
    labelSuffixColor: {
      control: "color",
      description: "CSS colour of the label suffix",
    },
    isLast: {
      control: "boolean",
      description: "Drops the space after the tag, for the last tag in a row",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isDefault: {
      control: false,
      description: "Ignored: nothing on a single tag reads it",
    },
    roomType: {
      control: "number",
      description:
        "Number passed straight back through `onClick`; the tag itself does nothing with it",
    },
    providerType: {
      control: "number",
      description:
        "Number passed straight back through `onClick`; the tag itself does nothing with it",
    },
    id: {
      control: "text",
      description: "Id of the outermost element",
    },
    className: {
      control: "text",
      description: "Class name of the outermost element",
    },
    style: {
      control: "object",
      description:
        "Inline style of the outermost element; `tagMaxWidth` wins over its `maxWidth`",
    },
    dataTestId: {
      control: "text",
      description: "`data-testid` of the outermost element",
      table: {
        defaultValue: { summary: '"tag_item"' },
      },
    },
    ref: {
      control: false,
      description: "Ref to the outermost element",
    },
    onClick: {
      action: "clicked",
      description:
        "Called on a click anywhere in the tag with `{ label, roomType, providerType }`, not with the DOM event; silent while the tag is disabled or deleted",
    },
    onDelete: {
      action: "deleted",
      description:
        "Called with `tag` when the cross is clicked; the cross appears only on a new tag",
    },
    onMouseEnter: {
      action: "mouseEntered",
      description: "Called when the pointer enters the tag",
    },
    onMouseLeave: {
      action: "mouseLeft",
      description: "Called when the pointer leaves the tag",
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

export const Default: Story = {
  render: (args) => <Tag {...args} />,
  args: {
    tag: "script",
    label: "Script",
    tagMaxWidth: "160px",
  },
  parameters: {
    docs: {
      description: {
        story:
          "A plain tag with a label, the starting point for every other state; change any prop live in the Controls panel below.",
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
  render: () => <StatesTemplate />,
  parameters: {
    docs: {
      description: {
        story: `The four looks a tag can take, side by side, to pick the one that matches an item's status:

- **Default** — a bordered tag on the plain background
- **New Tag** — a filled tag with a delete cross after the label (\`isNewTag\` with \`onDelete\`)
- **Disabled** — a dashed border; the tag ignores hover and clicks (\`isDisabled\`)
- **Deleted** — a greyed-out border; clicks no longer reach \`onClick\` (\`isDeleted\`)`,
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
  render: (args) => <NewTagTemplate {...args} />,
  parameters: {
    docs: {
      description: {
        story:
          "Tags the user has just added and can still take back: click a cross to remove its tag, and the Actions panel shows the identifier `onDelete` receives.",
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
  render: (args) => <ClickableTemplate {...args} />,
  parameters: {
    docs: {
      description: {
        story:
          "Tags that act as filters: hover one to see it highlight, click it, and the Actions panel shows the `{ label }` object `onClick` receives instead of the DOM event.",
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
  render: () => <MaxWidthTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Tags with different max-width values. Long text is truncated with ellipsis when it exceeds the max width.",
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
  parameters: {
    docs: {
      description: {
        story: `A compact tag that is only a glyph marks where an item comes from without taking the width of a label; the hidden label still names the tag for screen readers (\`withLabel={false}\`):

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
  render: (args) => <Tag {...args} />,
  args: {
    tag: "reports",
    label: "Reports",
    labelSuffix: " (12)",
    labelSuffixColor: "#A3A9AE",
  },
  parameters: {
    docs: {
      description: {
        story:
          "A count after the label, in a quieter colour, tells the reader how many items the tag covers without a second element (`labelSuffix`, `labelSuffixColor`).",
      },
      source: {
        code: `<Tag tag="reports" label="Reports" labelSuffix=" (12)" labelSuffixColor="#A3A9AE" />`,
      },
    },
  },
};

export const CssCustomization: Story = {
  render: () => (
    <div
      style={
        {
          display: "flex",
          "--tag-bg": "#EDE7F6",
          "--tag-border-style": "1px solid #9C27B0",
          "--tag-radius": "16px",
          "--tag-inner-padding": "4px 14px",
          "--tag-height": "30px",
          "--tag-spacing-end": "16px",
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
        story: `Six variables set on one wrapper -- the variables are listed under CSS variables on this page. Both tags take every variable from the wrapper; the second is there to show the space \`--tag-spacing-end\` leaves after **Custom Tag**.`,
      },
      source: {
        code: `<div
  style={{
    display: "flex",
    "--tag-bg": "#EDE7F6",
    "--tag-border-style": "1px solid #9C27B0",
    "--tag-radius": "16px",
    "--tag-inner-padding": "4px 14px",
    "--tag-height": "30px",
    "--tag-spacing-end": "16px",
  }}
>
  <Tag tag="custom" label="Custom Tag" />
  <Tag tag="second" label="Second Tag" />
</div>`,
      },
    },
  },
};
