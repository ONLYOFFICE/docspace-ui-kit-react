// (c) Copyright Ascensio System SIA 2009-2026
//
// This program is a free software product.
// You can redistribute it and/or modify it under the terms
// of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
// Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
// to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
// any third-party rights.
//
// This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
// the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
//
// You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
//
// The  interactive user interfaces in modified source and object code versions of the Program must
// display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
//
// Pursuant to Section 7(b) of the License you must retain the original Product logo when
// distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
// trademark law for use of our trademarks.
//
// All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
// content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
// International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode

import type { ComponentProps } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Tag } from ".";

const meta = {
  title: "UI/Data display/Tag",
  component: Tag,
  parameters: {
    docs: {
      description: {
        component: `A tag component for displaying categorized labels, filters, or status indicators.

### Features

- **New Tag State**: Visual indicator for newly created tags with a delete button
- **Disabled State**: Prevents interaction and applies disabled styling
- **Deleted State**: Strikethrough styling for removed tags
- **Click Handler**: Callback when the tag body is clicked
- **Delete Handler**: Callback when the delete button is clicked (new tags only)
- **Max Width**: Configurable maximum width with text truncation
- **Icon Support**: Display SVG icons or third-party provider icons

### Accessibility

- \`aria-label\`: Set from the tag label text
- \`aria-disabled\`: Indicates when the tag is disabled

### Usage

\`\`\`tsx
import { Tag } from "@docspace/ui-kit/components/tag";

// Basic tag
<Tag tag="category" label="Design" />

// New tag with delete
<Tag tag="new" label="New Tag" isNewTag onDelete={(tag) => console.log(tag)} />

// Clickable tag
<Tag tag="filter" label="React" onClick={({ label }) => console.log(label)} />
\`\`\``,
      },
    },
    design: {
      type: "figma",
      url: "https://www.figma.com/file/ZiW5KSwb4t7Tj6Nz5TducC/UI-Kit-DocSpace-1.0.0?type=design&node-id=62-2597&mode=design&t=TBNCKMQKQMxr44IZ-0",
    },
  },
  argTypes: {
    tag: {
      control: "text",
      description: "Identifier for the tag type or category",
    },
    label: {
      control: "text",
      description: "Display text for the tag",
    },
    isNewTag: {
      control: "boolean",
      description: "Marks the tag as newly created and shows delete button",
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
      description: "Displays the tag with deleted/strikethrough styling",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    tagMaxWidth: {
      control: "text",
      description: "Maximum width of the tag (CSS value)",
    },
    onClick: {
      action: "clicked",
      description: "Callback when the tag is clicked",
    },
    onDelete: {
      action: "deleted",
      description: "Callback when the delete button is clicked",
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

const NewTagTemplate = () => {
  return (
    <Wrapper>
      <Tag
        tag="react"
        label="React"
        isNewTag
        onDelete={() => alert("Delete: React")}
      />
      <Tag
        tag="typescript"
        label="TypeScript"
        isNewTag
        onDelete={() => alert("Delete: TypeScript")}
      />
      <Tag
        tag="nodejs"
        label="Node.js"
        isNewTag
        onDelete={() => alert("Delete: Node.js")}
      />
    </Wrapper>
  );
};

const ClickableTemplate = () => {
  return (
    <Wrapper>
      <Tag
        tag="design"
        label="Design"
        onClick={() => alert("Clicked: Design")}
      />
      <Tag
        tag="development"
        label="Development"
        onClick={() => alert("Clicked: Development")}
      />
      <Tag
        tag="marketing"
        label="Marketing"
        onClick={() => alert("Clicked: Marketing")}
      />
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
        story:
          "All tag states: default, new (with delete button), disabled, and deleted.",
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
  render: () => <NewTagTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Tags marked as newly created with a delete button. Click the X to trigger the onDelete callback.",
      },
      source: {
        code: `<Tag tag="react" label="React" isNewTag onDelete={(tag) => console.log(tag)} />
<Tag tag="typescript" label="TypeScript" isNewTag onDelete={(tag) => console.log(tag)} />`,
      },
    },
  },
};

export const ClickableTags: Story = {
  render: () => <ClickableTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Tags with click handlers. Clicking the tag triggers the onClick callback with tag event data.",
      },
      source: {
        code: `<Tag tag="design" label="Design" onClick={({ label }) => console.log(label)} />
<Tag tag="development" label="Development" onClick={({ label }) => console.log(label)} />`,
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
