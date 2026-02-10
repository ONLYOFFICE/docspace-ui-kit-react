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

import type { Meta, StoryObj } from "@storybook/react-vite";

import AtReactSvgUrl from "../../assets/@.react.svg?url";

import { AvatarPure, AvatarRole, AvatarSize } from ".";

const meta = {
  title: "Components/UI/Avatar",
  component: AvatarPure,
  parameters: {
    docs: {
      description: {
        component: `A component for displaying user or group avatars with support for images, initials, icons, role indicators, and editing functionality.

### Features

- **Multiple Display Modes**: Images, initials, icons, or default placeholder
- **Six Sizes**: min (32px), small (36px), base (40px), medium (48px), big (80px), max (124px)
- **Role Indicators**: Owner, admin, guest, user badges
- **Group Avatars**: Specialized styling for group representations
- **Editing Support**: Built-in edit mode with dropdown menu
- **Tooltips**: Optional role tooltips on hover

### Usage

\`\`\`tsx
import { Avatar, AvatarSize, AvatarRole } from "@docspace/ui-kit/components/avatar";

// Avatar with image
<Avatar
  size={AvatarSize.max}
  role={AvatarRole.admin}
  source="https://example.com/photo.jpg"
  userName="John Smith"
/>

// Avatar with initials
<Avatar
  size={AvatarSize.medium}
  role={AvatarRole.user}
  userName="John Doe"
/>
\`\`\``,
      },
    },
    design: {
      type: "figma",
      url: "https://www.figma.com/file/ZiW5KSwb4t7Tj6Nz5TducC/UI-Kit-DocSpace-1.0.0?type=design&node-id=878-37278&mode=design&t=TBNCKMQKQMxr44IZ-0",
    },
    layout: "centered",
  },
  argTypes: {
    size: {
      control: "select",
      options: Object.values(AvatarSize),
      description: "Size of the avatar",
      table: {
        defaultValue: { summary: "medium" },
      },
    },
    role: {
      control: "select",
      options: Object.values(AvatarRole),
      description: "User role for badge display",
      table: {
        defaultValue: { summary: "user" },
      },
    },
    source: {
      control: "text",
      description: "Image URL or SVG path",
    },
    userName: {
      control: "text",
      description: "User name for initials generation",
    },
    editing: {
      control: "boolean",
      description: "Enable edit mode (only works with size='max')",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    hideRoleIcon: {
      control: "boolean",
      description: "Hide the role indicator badge",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    withTooltip: {
      control: "boolean",
      description: "Show tooltip on role icon hover",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    tooltipContent: {
      control: "text",
      description: "Content for the tooltip",
    },
    isGroup: {
      control: "boolean",
      description: "Display as group avatar (uppercase initials)",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isDefaultSource: {
      control: "boolean",
      description: "Show default avatar when source is blank",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    noClick: {
      control: "boolean",
      description: "Disable click interactions",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    editAction: { action: "editAction" },
    onClick: { action: "onClick" },
    onChangeFile: { action: "onChangeFile" },
  },
} satisfies Meta<typeof AvatarPure>;

type Story = StoryObj<typeof AvatarPure>;

export default meta;

export const Default: Story = {
  args: {
    size: AvatarSize.max,
    role: AvatarRole.user,
    source: "",
    userName: "",
    editing: false,
    hideRoleIcon: false,
    tooltipContent: "",
    withTooltip: false,
  },
};

export const WithImage: Story = {
  args: {
    size: AvatarSize.max,
    role: AvatarRole.admin,
    source:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
    userName: "John Smith",
    editing: false,
    hideRoleIcon: false,
    tooltipContent: "John Smith - Administrator",
    withTooltip: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Avatar displaying an image with admin role badge and tooltip on hover.",
      },
    },
  },
};

export const WithInitials: Story = {
  args: {
    size: AvatarSize.max,
    role: AvatarRole.guest,
    source: "",
    userName: "John Doe",
    editing: false,
    hideRoleIcon: false,
    tooltipContent: "John Doe - Guest",
    withTooltip: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Avatar showing initials generated from the user name. Uses first letter of first two words (JD).",
      },
    },
  },
};

export const WithIcon: Story = {
  args: {
    size: AvatarSize.max,
    role: AvatarRole.user,
    source: AtReactSvgUrl,
    userName: "",
    editing: false,
    hideRoleIcon: false,
    tooltipContent: "",
    withTooltip: false,
  },
  parameters: {
    docs: {
      description: {
        story: "Avatar displaying an SVG icon instead of an image or initials.",
      },
    },
  },
};

const AllSizesTemplate = () => {
  const sizes = Object.values(AvatarSize);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
        flexWrap: "wrap",
      }}
    >
      {sizes.map((size) => (
        <div
          key={size}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <AvatarPure
            size={size}
            role={AvatarRole.admin}
            userName="John Doe"
            hideRoleIcon={size === AvatarSize.min}
          />
          <span style={{ fontSize: "12px", color: "#666" }}>{size}</span>
        </div>
      ))}
    </div>
  );
};

export const AllSizes: Story = {
  render: () => <AllSizesTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "All available avatar sizes: min (32px), small (36px), base (40px), medium (48px), big (80px), max (124px).",
      },
    },
  },
};

const AllRolesTemplate = () => {
  const roles = [
    { role: AvatarRole.owner, label: "Owner" },
    { role: AvatarRole.admin, label: "Admin" },
    { role: AvatarRole.user, label: "User" },
    { role: AvatarRole.guest, label: "Guest" },
    { role: AvatarRole.manager, label: "Manager" },
    { role: AvatarRole.collaborator, label: "Collaborator" },
    { role: AvatarRole.none, label: "None" },
  ];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "24px",
        flexWrap: "wrap",
      }}
    >
      {roles.map(({ role, label }) => (
        <div
          key={label}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <AvatarPure size={AvatarSize.big} role={role} userName={label} />
          <span style={{ fontSize: "12px", color: "#666" }}>{label}</span>
        </div>
      ))}
    </div>
  );
};

export const AllRoles: Story = {
  render: () => <AllRolesTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "All available role badges: owner (crown), admin, user, guest, manager, collaborator, and none.",
      },
    },
  },
};

export const GroupAvatar: Story = {
  args: {
    size: AvatarSize.max,
    role: AvatarRole.none,
    source: "",
    userName: "Project Team",
    isGroup: true,
    hideRoleIcon: true,
    tooltipContent: "Project Team Group",
    withTooltip: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Group avatar with uppercase initials and specialized background color. Role icons are typically hidden for groups.",
      },
    },
  },
};

export const EditingMode: Story = {
  args: {
    size: AvatarSize.max,
    role: AvatarRole.owner,
    source: "",
    userName: "Jane Smith",
    editing: true,
    hideRoleIcon: true,
    hasAvatar: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Avatar in editing mode showing the plus button for upload. Only available at max size.",
      },
    },
  },
};

export const EditingWithAvatar: Story = {
  args: {
    size: AvatarSize.max,
    role: AvatarRole.owner,
    source:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
    userName: "Jane Smith",
    editing: true,
    hideRoleIcon: true,
    hasAvatar: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Avatar in editing mode with existing image showing pencil edit button.",
      },
    },
  },
};

export const WithCustomRoleIcon: Story = {
  args: {
    size: AvatarSize.max,
    role: AvatarRole.admin,
    source: "",
    userName: "Custom Role",
    roleIcon: (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: "10px",
          fontWeight: "bold",
        }}
      >
        VIP
      </div>
    ),
    hideRoleIcon: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Avatar with a custom role icon element instead of the default role badges.",
      },
    },
  },
};

export const DefaultSource: Story = {
  args: {
    size: AvatarSize.max,
    role: AvatarRole.user,
    source: "",
    userName: "",
    isDefaultSource: true,
    hideRoleIcon: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Avatar showing the default placeholder image when no source or userName is provided.",
      },
    },
  },
};

const AvatarListTemplate = () => {
  const users = [
    { id: 1, name: "Alice Johnson", role: AvatarRole.owner },
    { id: 2, name: "Bob Smith", role: AvatarRole.admin },
    { id: 3, name: "Carol White", role: AvatarRole.user },
    { id: 4, name: "David Brown", role: AvatarRole.guest },
    { id: 5, name: "Eve Davis", role: AvatarRole.collaborator },
  ];

  return (
    <div style={{ display: "flex", gap: "8px" }}>
      {users.map((user) => (
        <AvatarPure
          key={user.id}
          size={AvatarSize.small}
          role={user.role}
          userName={user.name}
          hideRoleIcon
        />
      ))}
    </div>
  );
};

export const AvatarList: Story = {
  render: () => <AvatarListTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Example of avatars in a list layout. Role icons are hidden for compact display.",
      },
    },
  },
};

const AvatarStackTemplate = () => {
  const users = [
    { id: 1, name: "Alice Johnson" },
    { id: 2, name: "Bob Smith" },
    { id: 3, name: "Carol White" },
    { id: 4, name: "David Brown" },
  ];

  return (
    <div style={{ display: "flex", paddingLeft: "20px" }}>
      {users.map((user, index) => (
        <div
          key={user.id}
          style={{
            marginLeft: index === 0 ? 0 : "-12px",
            zIndex: users.length - index,
            border: "2px solid white",
            borderRadius: "50%",
          }}
        >
          <AvatarPure
            size={AvatarSize.base}
            role={AvatarRole.none}
            userName={user.name}
            hideRoleIcon
          />
        </div>
      ))}
    </div>
  );
};

export const AvatarStack: Story = {
  render: () => <AvatarStackTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Stacked avatars with overlap effect, commonly used to show participants or collaborators.",
      },
    },
  },
};
