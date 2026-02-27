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

import { Meta, StoryObj } from "@storybook/react-vite";

import { Tag } from ".";

const meta = {
  title: "UI/Data display/Tag",
  component: Tag,
  parameters: {
    docs: {
      description: {
        component: `
A flexible tag/label component for displaying categorized or status information.

## Features
- Multiple tag types and states
- New and deleted tag indicators
- Disabled state support
- Click and delete handlers
- Custom styling options
- Max width configuration
- Responsive design

## Usage
Used for displaying tags, labels, categories, filters, or status badges throughout the application.
`,
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
      description: "When true, marks the tag as newly created",
    },
    isDeleted: {
      control: "boolean",
      description: "When true, displays the tag with a deleted/strikethrough style",
    },
    isDisabled: {
      control: "boolean",
      description: "When true, disables the tag and prevents interactions",
    },
    tagMaxWidth: {
      control: "text",
      description: "Maximum width of the tag element (CSS width value)",
    },
    onClick: {
      action: "clicked",
      description: "Callback function when the tag is clicked",
    },
    onDelete: {
      action: "deleted",
      description: "Callback function when the delete button is clicked",
    },
    id: {
      control: "text",
      description: "HTML id attribute for the tag element",
    },
    className: {
      control: "text",
      description: "Custom CSS class names",
    },
    style: {
      control: "object",
      description: "Custom inline styles",
    },
  },
} satisfies Meta<typeof Tag>;
type Story = StoryObj<typeof Tag>;

export default meta;

export const Default: Story = {
  args: {
    tag: "script",
    label: "Script",
    isNewTag: false,
    isDisabled: false,
    onDelete: () => {},
    onClick: () => {},

    tagMaxWidth: "160px",
    id: "",
    className: "",
    style: { color: "red" },
  },
  parameters: {
    docs: {
      description: {
        story: "Default tag with standard styling. Shows a clickable tag with a delete button and custom red text color.",
      },
    },
  },
};

export const NewTag: Story = {
  args: {
    tag: "script",
    label: "Script",
    isNewTag: true,
    isDisabled: false,
    onDelete: () => {},
    onClick: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: "Tag marked as newly created. Shows a visual indicator to distinguish newly added tags from existing ones.",
      },
    },
  },
};

export const DeletedTag: Story = {
  args: {
    tag: "script",
    label: "Script",
    isNewTag: false,
    isDisabled: false,
    isDeleted: true,
    onDelete: () => {},
    onClick: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: "Tag marked as deleted. Shows strikethrough styling to indicate the tag has been deleted or is no longer active.",
      },
    },
  },
};

export const DisabledTag: Story = {
  args: {
    tag: "script",
    label: "No tag",
    isNewTag: false,
    isDisabled: true,
    onDelete: () => {},
    onClick: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: "Disabled tag that cannot be interacted with. Shows disabled styling and prevents click or delete actions.",
      },
    },
  },
};

export const TagWithCustomStyles: Story = {
  args: {
    tag: "custom",
    label: "Custom Styled Tag",
    isNewTag: false,
    isDisabled: false,
    onDelete: () => {},
    onClick: () => {},
    tagMaxWidth: "200px",
    style: { backgroundColor: "pink" },
  },
  parameters: {
    docs: {
      description: {
        story: "Tag with custom styling applied. Demonstrates how to customize the tag appearance with inline styles and max width.",
      },
    },
  },
};

export const TagWithClickHandler: Story = {
  args: {
    tag: "clickable",
    label: "Clickable Tag",
    isNewTag: false,
    isDisabled: false,
    onDelete: () => {},
    onClick: () => alert("Tag clicked!"),
    tagMaxWidth: "160px",
  },
  parameters: {
    docs: {
      description: {
        story: "Tag with an onClick handler. Clicking the tag itself (not the delete button) triggers a custom action or event.",
      },
    },
  },
};
