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

import React from "react";
import type { CSSProperties, ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import EmptyRoomsLightSvg from "../../assets/emptyview/empty.rooms.root.light.svg";
import CrossSvg from "../../assets/icons/12/cross.react.svg";
import { EmptyView } from ".";
import type { EmptyViewProps } from "./EmptyView.types";
import type { LinkRouterProps, To } from "../../types";

const toHref = (to: To): string => {
  if (typeof to === "string") return to;
  const { pathname = "", search = "", hash = "" } = to;
  return `${pathname}${search}${hash}`;
};

const MockLinkRouter = ({ children, to, ...props }: LinkRouterProps) => (
  <a href={toHref(to)} {...props}>
    {children}
  </a>
);

const meta = {
  title: "UI/Layout components/EmptyView",
  component: EmptyView,
  parameters: {
    docs: {
      description: {
        component: `Empty state component with customizable icon, title, description, and action options for guiding users when no content is available.

### Features

- **Icon Display**: Customizable SVG icon for the empty state illustration
- **Action Options**: Supports multiple option types (items, links, buttons, separators, actions)
- **Router Integration**: Accepts a LinkRouter component for navigation options
- **Context Menu**: Items can include context menu configurations

### Usage

\`\`\`tsx
import { EmptyView } from "@docspace/ui-kit/components/empty-view";

// With link options
<EmptyView
  icon={<EmptyIcon />}
  title="Empty Folder"
  description="This folder is empty. Add files to get started."
  options={[
    { key: "upload", icon: <UploadIcon />, to: "/upload", description: "Upload files" },
  ]}
  LinkRouter={RouterLink}
/>

// Without options
<EmptyView
  icon={<SearchIcon />}
  title="No Results"
  description="No files matching your search criteria."
  options={null}
/>
\`\`\``,
      },
    },
  },
  argTypes: {
    title: {
      control: "text",
      description: "Main title text displayed below the icon",
    },
    description: {
      control: "text",
      description: "Subheading description text",
    },
    icon: {
      description: "Icon element displayed at the top",
      control: false,
    },
    options: {
      description:
        "Array of action options (items, links, buttons, separators, or actions)",
      control: false,
    },
    className: {
      control: "text",
      description: "Optional CSS class name for the wrapper",
    },
    bodyClassName: {
      control: "text",
      description: "Optional CSS class name for the options body section",
    },
  },
} satisfies Meta<typeof EmptyView>;

type Story = StoryObj<ComponentProps<typeof EmptyView>>;

export default meta;

const Template = ({ ...args }: EmptyViewProps) => {
  return <EmptyView {...args} LinkRouter={MockLinkRouter} />;
};

export const Default: Story = {
  render: Template,
  args: {
    icon: <EmptyRoomsLightSvg />,
    title: "Empty Folder",
    description: "This folder is empty. Add files or folders to get started.",
    options: [
      {
        key: "upload",
        icon: <CrossSvg />,
        to: "#",
        description: "Clear Filter",
        onClick: () => console.log("Upload clicked"),
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          "Default empty view with an icon, title, description, and a link option for navigation.",
      },
      source: {
        code: `<EmptyView
  icon={<EmptyRoomsIcon />}
  title="Empty Folder"
  description="This folder is empty. Add files or folders to get started."
  options={[
    { key: "upload", icon: <UploadIcon />, to: "/upload", description: "Clear Filter" },
  ]}
  LinkRouter={RouterLink}
/>`,
      },
    },
  },
};

export const NoOptions: Story = {
  render: Template,
  args: {
    icon: <EmptyRoomsLightSvg />,
    title: "No Files Found",
    description: "There are no files matching your search criteria.",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Empty view without any action options, displaying only the header with icon, title, and description.",
      },
      source: {
        code: `<EmptyView
  icon={<SearchIcon />}
  title="No Files Found"
  description="There are no files matching your search criteria."
  options={null}
/>`,
      },
    },
  },
};

export const CssCustomization: Story = {
  render: () => (
    <div
      style={
        {
          "--empty-view-title-color": "#0082c9",
          "--empty-view-header-font-size": "18px",
          "--empty-view-link-accent": "#0082c9",
          "--empty-view-link-background": "#e6f3fb",
          "--empty-view-link-hover-background": "#cce5f6",
          "--empty-view-link-radius": "50px",
          "--empty-view-link-padding": "8px 16px",
          "--empty-view-link-text-size": "14px",
          "--empty-view-item-radius": "12px",
          "--empty-view-item-hover-background": "#e6f3fb",
          "--empty-view-item-gap": "16px",
          "--empty-view-width": "400px",
          "--empty-view-gap": "12px",
        } as CSSProperties
      }
    >
      <EmptyView
        icon={<EmptyRoomsLightSvg />}
        title="No Files Found"
        description="Upload or create files to get started."
        options={[
          {
            key: "upload",
            icon: <CrossSvg />,
            to: "#",
            description: "Upload files",
          },
          {
            key: "create",
            icon: <CrossSvg />,
            to: "#",
            description: "Create new document",
          },
        ]}
        LinkRouter={MockLinkRouter}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `CSS Custom Properties for external customization:

| Variable | Description | Default |
|----------|-------------|---------|
| \`--empty-view-title-color\` | Title text color | theme black/white |
| \`--empty-view-header-font-size\` | Title font size | \`16px\` |
| \`--empty-view-desc-color\` | Description text color | theme gray |
| \`--empty-view-link-accent\` | Link text and icon color | theme accent |
| \`--empty-view-link-background\` | Link button background | theme background |
| \`--empty-view-link-hover-background\` | Link hover background | theme hover |
| \`--empty-view-link-radius\` | Link button border-radius | \`6px\` |
| \`--empty-view-link-padding\` | Link button padding | \`6px 10px\` |
| \`--empty-view-link-text-size\` | Link font size | \`13px\` |
| \`--empty-view-link-text-weight\` | Link font weight | \`600\` |
| \`--empty-view-item-radius\` | Item row border-radius | \`6px\` |
| \`--empty-view-item-padding\` | Item row padding | \`12px 16px\` |
| \`--empty-view-item-gap\` | Gap between icon and text | \`20px\` |
| \`--empty-view-icon-size\` | Item icon size | \`36px\` |
| \`--empty-view-item-hover-background\` | Item hover background | theme hover |
| \`--empty-view-item-title-color\` | Item title color | theme black/white |
| \`--empty-view-item-desc-color\` | Item description color | theme gray |
| \`--empty-view-divider-color\` | Separator color | theme gray |
| \`--empty-view-width\` | Container max-width | \`480px\` |
| \`--empty-view-gap\` | Gap between sections | \`18px\` |
| \`--empty-view-padding-top\` | Top padding | \`61px\` |`,
      },
    },
  },
};

export const WithMultipleOptions: Story = {
  render: Template,
  args: {
    icon: <EmptyRoomsLightSvg />,
    title: "Get Started",
    description: "Choose an action to begin working with your workspace.",
    options: [
      {
        key: "create",
        icon: <CrossSvg />,
        to: "/create",
        description: "Create a new document",
      },
      {
        key: "upload",
        icon: <CrossSvg />,
        to: "/upload",
        description: "Upload files from your computer",
      },
      {
        key: "import",
        icon: <CrossSvg />,
        to: "/import",
        description: "Import from external storage",
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          "Empty view with multiple link options for different actions the user can take.",
      },
      source: {
        code: `<EmptyView
  icon={<EmptyIcon />}
  title="Get Started"
  description="Choose an action to begin working with your workspace."
  options={[
    { key: "create", icon: <CreateIcon />, to: "/create", description: "Create a new document" },
    { key: "upload", icon: <UploadIcon />, to: "/upload", description: "Upload files" },
    { key: "import", icon: <ImportIcon />, to: "/import", description: "Import from external storage" },
  ]}
  LinkRouter={RouterLink}
/>`,
      },
    },
  },
};
