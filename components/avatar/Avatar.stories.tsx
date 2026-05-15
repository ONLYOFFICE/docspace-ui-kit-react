/*
 * Copyright (C) Ascensio System SIA, 2009-2026
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation, together with the
 * additional terms provided in the LICENSE file.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For
 * details, see the GNU AGPL at: https://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA by email at info@onlyoffice.com
 * or by postal mail at 20A-6 Ernesta Birznieka-Upisha Street, Riga,
 * LV-1050, Latvia, European Union.
 *
 * The interactive user interfaces in modified versions of the Program
 * are required to display Appropriate Legal Notices in accordance with
 * Section 5 of the GNU AGPL version 3.
 *
 * No trademark rights are granted under this License.
 *
 * All non-code elements of the Product, including illustrations,
 * icon sets, and technical writing content, are licensed under the
 * Creative Commons Attribution-ShareAlike 4.0 International License:
 * https://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 * This license applies only to such non-code elements and does not
 * modify or replace the licensing terms applicable to the Program's
 * source code, which remains licensed under the GNU Affero General
 * Public License v3.
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { CSSProperties, ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import AtReactSvgUrl from "../../assets/@.react.svg?url";

import { AvatarPure, AvatarRole, AvatarSize } from ".";

const meta = {
  title: "UI/Data display/Avatar",
  component: AvatarPure,
  parameters: {
    docs: {
      description: {
        component: `A component for displaying user or group avatars with support for images, initials, icons, role indicators, and editing functionality.

### Features

- **Multiple Display Modes**: Images, initials, icons, or default placeholder
- **Six Sizes**: min (32px), small (36px), base (40px), medium (48px), big (80px), max (124px)
- **Role Indicators**: Owner, admin, guest, user, manager, collaborator badges
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

type Story = StoryObj<ComponentProps<typeof AvatarPure>>;

export default meta;

const Wrapper = (props: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
        flexWrap: "wrap",
      }}
    >
      {props.children}
    </div>
  );
};

const LabeledItem = (props: { label: string; children: React.ReactNode }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
      }}
    >
      {props.children}
      <span style={{ fontSize: "12px", color: "#666" }}>{props.label}</span>
    </div>
  );
};

export const Default: Story = {
  render: (args) => <AvatarPure {...args} />,
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
  render: (args) => <AvatarPure {...args} />,
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
      source: {
        code: `<Avatar
  size={AvatarSize.max}
  role={AvatarRole.admin}
  source="https://example.com/photo.jpg"
  userName="John Smith"
  tooltipContent="John Smith - Administrator"
  withTooltip
/>`,
      },
    },
  },
};

export const WithInitials: Story = {
  render: (args) => <AvatarPure {...args} />,
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
      source: {
        code: `<Avatar
  size={AvatarSize.max}
  role={AvatarRole.guest}
  userName="John Doe"
  withTooltip
  tooltipContent="John Doe - Guest"
/>`,
      },
    },
  },
};

export const WithIcon: Story = {
  render: (args) => <AvatarPure {...args} />,
  args: {
    size: AvatarSize.max,
    role: AvatarRole.user,
    source: AtReactSvgUrl,
    userName: "",
    editing: false,
    hideRoleIcon: false,
  },
  parameters: {
    docs: {
      description: {
        story: "Avatar displaying an SVG icon instead of an image or initials.",
      },
      source: {
        code: `<Avatar
  size={AvatarSize.max}
  role={AvatarRole.user}
  source={iconUrl}
/>`,
      },
    },
  },
};

const AllSizesTemplate = () => {
  const sizes = Object.values(AvatarSize);

  return (
    <Wrapper>
      {sizes.map((size) => (
        <LabeledItem key={size} label={size}>
          <AvatarPure
            size={size}
            role={AvatarRole.admin}
            userName="John Doe"
            hideRoleIcon={size === AvatarSize.min}
          />
        </LabeledItem>
      ))}
    </Wrapper>
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
      source: {
        code: `<Avatar size={AvatarSize.min} role={AvatarRole.admin} userName="John Doe" />
<Avatar size={AvatarSize.small} role={AvatarRole.admin} userName="John Doe" />
<Avatar size={AvatarSize.base} role={AvatarRole.admin} userName="John Doe" />
<Avatar size={AvatarSize.medium} role={AvatarRole.admin} userName="John Doe" />
<Avatar size={AvatarSize.big} role={AvatarRole.admin} userName="John Doe" />
<Avatar size={AvatarSize.max} role={AvatarRole.admin} userName="John Doe" />`,
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
    <Wrapper>
      {roles.map(({ role, label }) => (
        <LabeledItem key={label} label={label}>
          <AvatarPure size={AvatarSize.big} role={role} userName={label} />
        </LabeledItem>
      ))}
    </Wrapper>
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
      source: {
        code: `<Avatar size={AvatarSize.big} role={AvatarRole.owner} userName="Owner" />
<Avatar size={AvatarSize.big} role={AvatarRole.admin} userName="Admin" />
<Avatar size={AvatarSize.big} role={AvatarRole.user} userName="User" />
<Avatar size={AvatarSize.big} role={AvatarRole.guest} userName="Guest" />
<Avatar size={AvatarSize.big} role={AvatarRole.manager} userName="Manager" />
<Avatar size={AvatarSize.big} role={AvatarRole.collaborator} userName="Collaborator" />
<Avatar size={AvatarSize.big} role={AvatarRole.none} userName="None" />`,
      },
    },
  },
};

export const GroupAvatar: Story = {
  render: (args) => <AvatarPure {...args} />,
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
      source: {
        code: `<Avatar
  size={AvatarSize.max}
  role={AvatarRole.none}
  userName="Project Team"
  isGroup
  hideRoleIcon
/>`,
      },
    },
  },
};

export const EditingMode: Story = {
  render: (args) => <AvatarPure {...args} />,
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
      source: {
        code: `<Avatar
  size={AvatarSize.max}
  role={AvatarRole.owner}
  userName="Jane Smith"
  editing
  hideRoleIcon
  hasAvatar={false}
/>`,
      },
    },
  },
};

export const EditingWithAvatar: Story = {
  render: (args) => <AvatarPure {...args} />,
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
      source: {
        code: `<Avatar
  size={AvatarSize.max}
  role={AvatarRole.owner}
  source="https://example.com/photo.jpg"
  userName="Jane Smith"
  editing
  hideRoleIcon
  hasAvatar
/>`,
      },
    },
  },
};

export const WithCustomRoleIcon: Story = {
  render: (args) => <AvatarPure {...args} />,
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
      source: {
        code: `<Avatar
  size={AvatarSize.max}
  role={AvatarRole.admin}
  userName="Custom Role"
  roleIcon={<CustomRoleIcon />}
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
          display: "flex",
          gap: "16px",
          alignItems: "center",
          "--avatar-radius": "8px",
          "--avatar-initials-weight": "400",
          "--avatar-initials-bg": "#7c3aed",
        } as CSSProperties
      }
    >
      <AvatarPure size={AvatarSize.big} userName="John Doe" role={AvatarRole.admin} />
      <AvatarPure size={AvatarSize.big} userName="Jane Smith" role={AvatarRole.user} />
      <AvatarPure size={AvatarSize.medium} userName="AB" role={AvatarRole.guest} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `CSS Custom Properties for external customization:

| Variable | Description | Default |
|----------|-------------|---------|
| \`--avatar-radius\` | Border radius | \`50%\` |
| \`--avatar-bg\` | Background color (no image/initials) | theme token |
| \`--avatar-initials-bg\` | Background color when showing initials | theme token |
| \`--avatar-initials-weight\` | Font weight of initials | \`600\` |`,
      },
    },
  },
};

export const DefaultSource: Story = {
  render: (args) => <AvatarPure {...args} />,
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
      source: {
        code: `<Avatar
  size={AvatarSize.max}
  role={AvatarRole.user}
  isDefaultSource
/>`,
      },
    },
  },
};
