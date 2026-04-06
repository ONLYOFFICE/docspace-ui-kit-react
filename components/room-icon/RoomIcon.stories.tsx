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

import type { CSSProperties, ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import PlanetIcon from "../../assets/icons/12/planet.react.svg?url";
import PlusSvgUrl from "../../assets/icons/16/button.plus.react.svg?url";
import EditPenSvgUrl from "../../assets/pencil.react.svg?url";
import styles from "./RoomIcon.stories.module.scss";

import { RoomIcon } from ".";

const meta = {
  title: "UI/Data display/RoomIcon",
  component: RoomIcon,
  parameters: {
    docs: {
      description: {
        component: `Versatile room icon component for displaying room avatars with support for images, colors, badges, editing capabilities, and various states.

### Features

- **Color Backgrounds**: Display colored initials from room titles
- **Three Sizes**: 32px, 48px, and 96px
- **Badge Support**: Optional badge icons with tooltips
- **Editing Mode**: Built-in edit dropdown with upload/edit actions
- **States**: Archive, template, empty, and hover states

### Usage

\`\`\`tsx
import { RoomIcon } from "@docspace/ui-kit/components/room-icon";

// Basic room icon
<RoomIcon title="My Room" color="4781D1" size="48px" showDefault />

// With badge
<RoomIcon title="Public" color="3B72A7" size="96px" badgeUrl={iconUrl} showDefault />

// With editing
<RoomIcon title="Editable" size="96px" color="4781D1" withEditing model={menuModel} showDefault />
\`\`\``,
      },
    },
  },
  argTypes: {
    title: {
      control: "text",
      description: "Room title (used for generating initials)",
    },
    color: {
      control: "color",
      description: "Background color (hex without #)",
    },
    size: {
      control: "select",
      options: ["32px", "48px", "96px"],
      description: "Icon size",
      table: {
        defaultValue: { summary: "32px" },
      },
    },
    radius: {
      control: "text",
      description: "Border radius",
      table: {
        defaultValue: { summary: "6px" },
      },
    },
    showDefault: {
      control: "boolean",
      description: "Show default state with initials",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isArchive: {
      control: "boolean",
      description: "Archive state styling",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isTemplate: {
      control: "boolean",
      description: "Template room styling",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    withEditing: {
      control: "boolean",
      description: "Enable edit mode with dropdown",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isEmptyIcon: {
      control: "boolean",
      description: "Show empty icon placeholder",
      table: {
        defaultValue: { summary: "false" },
      },
    },
  },
} satisfies Meta<typeof RoomIcon>;

type RoomIconProps = ComponentProps<typeof RoomIcon>;
type Story = StoryObj<RoomIconProps>;

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

const mockModel = [
  {
    label: "Upload",
    icon: PlusSvgUrl,
    key: "upload",
    onClick: () => console.log("Upload clicked"),
  },
  {
    label: "Edit",
    icon: EditPenSvgUrl,
    key: "edit",
    onClick: () => console.log("Edit clicked"),
  },
];

export const Default: Story = {
  render: (args: RoomIconProps) => (
    <RoomIcon
      {...args}
      className={`${styles.roomTitle} ${styles.roomBackground}`}
    />
  ),
  args: {
    title: "Test Room",
    size: "96px",
    color: "4781D1",
    radius: "6px",
    showDefault: true,
  },
};

const SizesTemplate = () => {
  return (
    <Wrapper>
      <RoomIcon title="S" color="4781D1" size="32px" showDefault />
      <RoomIcon title="M" color="4781D1" size="48px" showDefault />
      <RoomIcon title="L" color="4781D1" size="96px" showDefault />
    </Wrapper>
  );
};

export const Sizes: Story = {
  render: () => <SizesTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "All available icon sizes: 32px (small), 48px (medium), and 96px (large).",
      },
      source: {
        code: `<RoomIcon title="S" color="4781D1" size="32px" showDefault />
<RoomIcon title="M" color="4781D1" size="48px" showDefault />
<RoomIcon title="L" color="4781D1" size="96px" showDefault />`,
      },
    },
  },
};

const ColorsTemplate = () => {
  return (
    <Wrapper>
      <RoomIcon title="Blue" color="4781D1" size="48px" showDefault />
      <RoomIcon title="Green" color="2DB482" size="48px" showDefault />
      <RoomIcon title="Orange" color="F97A0B" size="48px" showDefault />
      <RoomIcon title="Purple" color="533ED1" size="48px" showDefault />
      <RoomIcon title="Red" color="F2675A" size="48px" showDefault />
    </Wrapper>
  );
};

export const Colors: Story = {
  render: () => <ColorsTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Room icons with different background colors.",
      },
      source: {
        code: `<RoomIcon title="Blue" color="4781D1" size="48px" showDefault />
<RoomIcon title="Green" color="2DB482" size="48px" showDefault />
<RoomIcon title="Orange" color="F97A0B" size="48px" showDefault />
<RoomIcon title="Purple" color="533ED1" size="48px" showDefault />
<RoomIcon title="Red" color="F2675A" size="48px" showDefault />`,
      },
    },
  },
};

export const WithEditing: Story = {
  render: (args: RoomIconProps) => (
    <div style={{ height: "200px" }}>
      <RoomIcon
        {...args}
        className={`${styles.roomTitle} ${styles.roomBackground}`}
      />
    </div>
  ),
  args: {
    title: "Editable",
    size: "96px",
    color: "4781D1",
    radius: "6px",
    showDefault: true,
    withEditing: true,
    model: mockModel,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Room icon with editing enabled. Hover to see the edit overlay with dropdown menu.",
      },
      source: {
        code: `<RoomIcon
  title="Editable"
  size="96px"
  color="4781D1"
  withEditing
  model={menuModel}
  showDefault
/>`,
      },
    },
  },
};

export const EmptyState: Story = {
  render: (args: RoomIconProps) => (
    <div style={{ height: "200px" }}>
      <RoomIcon {...args} />
    </div>
  ),
  args: {
    title: "",
    size: "96px",
    isEmptyIcon: true,
    model: mockModel,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Empty icon placeholder state, typically used when no room image has been set yet.",
      },
      source: {
        code: `<RoomIcon title="" size="96px" isEmptyIcon model={menuModel} />`,
      },
    },
  },
};

export const Archive: Story = {
  render: (args: RoomIconProps) => (
    <RoomIcon {...args} className={styles.roomTitle} />
  ),
  args: {
    title: "Archived",
    size: "96px",
    color: "A3A9AE",
    radius: "6px",
    showDefault: true,
    isArchive: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Archived room with muted styling to indicate inactive state.",
      },
      source: {
        code: `<RoomIcon title="Archived" size="96px" color="A3A9AE" isArchive showDefault />`,
      },
    },
  },
};

export const WithBadge: Story = {
  render: (args: RoomIconProps) => (
    <div style={{ position: "relative", width: "120px", height: "120px" }}>
      <RoomIcon {...args} className={styles.roomTitle} />
    </div>
  ),
  args: {
    title: "Public",
    color: "3B72A7",
    size: "96px",
    radius: "6px",
    badgeUrl: PlanetIcon,
    onBadgeClick: () => console.log("Badge clicked"),
    showDefault: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Room icon with a badge indicator, useful for showing public/shared status.",
      },
      source: {
        code: `<RoomIcon
  title="Public"
  color="3B72A7"
  size="96px"
  badgeUrl={planetIconUrl}
  onBadgeClick={handleBadgeClick}
  showDefault
/>`,
      },
    },
  },
};

export const WithTooltip: Story = {
  render: (args: RoomIconProps) => (
    <div style={{ position: "relative", width: "120px", height: "120px" }}>
      <RoomIcon {...args} className={styles.roomTitle} />
    </div>
  ),
  args: {
    title: "Tooltip",
    color: "2DB482",
    size: "96px",
    radius: "6px",
    badgeUrl: PlanetIcon,
    onBadgeClick: () => console.log("Badge clicked"),
    tooltipContent: "This room is publicly accessible",
    tooltipId: "room-tooltip",
    showDefault: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Room icon with a badge that shows a tooltip on hover for additional context.",
      },
      source: {
        code: `<RoomIcon
  title="Tooltip"
  color="2DB482"
  size="96px"
  badgeUrl={planetIconUrl}
  tooltipContent="This room is publicly accessible"
  tooltipId="room-tooltip"
  showDefault
/>`,
      },
    },
  },
};

export const Template: Story = {
  render: (args: RoomIconProps) => (
    <RoomIcon {...args} className={styles.roomTitle} />
  ),
  args: {
    title: "Template",
    color: "533ED1",
    size: "96px",
    radius: "6px",
    isTemplate: true,
    showDefault: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Template room icon with specialized styling.",
      },
      source: {
        code: `<RoomIcon title="Template" color="533ED1" size="96px" isTemplate showDefault />`,
      },
    },
  },
};

export const WithHover: Story = {
  render: (args: RoomIconProps) => (
    <div style={{ height: "200px" }}>
      <RoomIcon
        {...args}
        className={`${styles.roomTitle} ${styles.roomBackground}`}
      />
    </div>
  ),
  args: {
    title: "Hover",
    size: "96px",
    color: "4781D1",
    radius: "6px",
    showDefault: true,
    hoverSrc: "https://picsum.photos/200",
    model: mockModel,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Room icon with a hover effect that reveals a preview image on mouse over.",
      },
      source: {
        code: `<RoomIcon
  title="Hover"
  size="96px"
  color="4781D1"
  hoverSrc="https://example.com/preview.jpg"
  model={menuModel}
  showDefault
/>`,
      },
    },
  },
};

export const LongTitle: Story = {
  render: (args: RoomIconProps) => (
    <RoomIcon
      {...args}
      className={`${styles.roomTitle} ${styles.roomBackground}`}
    />
  ),
  args: {
    title: "Very Long Room Name That Should Be Truncated",
    size: "48px",
    color: "F97A0B",
    radius: "6px",
    showDefault: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Room icon with a long title to demonstrate initial truncation behavior.",
      },
      source: {
        code: `<RoomIcon
  title="Very Long Room Name That Should Be Truncated"
  size="48px"
  color="F97A0B"
  showDefault
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
          gap: "24px",
          alignItems: "center",
        } as CSSProperties
      }
    >
      <RoomIcon title="NC" size="96px" color="0082c9" radius="50%" showDefault />
      <div
        style={
          {
            "--room-icon-empty-radius": "50%",
            "--room-icon-dashed-border": "2px dashed #0082c9",
          } as CSSProperties
        }
      >
        <RoomIcon title="" size="96px" isEmptyIcon model={mockModel} />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `CSS Custom Properties for external customization:

| Variable | Description | Default |
|----------|-------------|---------|
| \`--room-icon-bg\` | Icon fill/background overlay color | theme white/black |
| \`--room-icon-button-icon-color\` | Button icon color | theme gray |
| \`--room-icon-bg-opacity\` | Background overlay opacity | \`1\` / \`0.1\` |
| \`--room-icon-edit-bg\` | Edit icon background | theme gray-light-mid |
| \`--room-icon-empty-radius\` | Empty placeholder border radius | \`10px\` |
| \`--room-icon-dashed-border\` | Empty placeholder border | theme dashed gray |`,
      },
    },
  },
};
