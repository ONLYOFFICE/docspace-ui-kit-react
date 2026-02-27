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
import type { ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import EmptyRoomsLightSvg from "../../assets/empty.rooms.root.light.svg";
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
