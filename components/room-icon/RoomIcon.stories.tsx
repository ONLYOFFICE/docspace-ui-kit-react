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

import type { Meta, StoryObj } from "@storybook/react";

import PlanetIcon from "../../assets/icons/12/planet.react.svg?url";
import PlusSvgUrl from "../../assets/icons/16/button.plus.react.svg?url";
import EditPenSvgUrl from "../../assets/pencil.react.svg?url";
import styles from "./RoomIcon.stories.module.scss";

import { RoomIcon } from ".";
import type { RoomIconProps } from "./RoomIcon.types";

const meta: Meta<typeof RoomIcon> = {
  title: "components/Data Display/RoomIcon",
  component: RoomIcon,
  parameters: {
    docs: {
      description: {
        component:
          "Versatile room icon component for displaying room avatars with support for images, colors, badges, editing capabilities, and various states.",
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
    },
    radius: {
      control: "text",
      description: "Border radius",
    },
    showDefault: {
      control: "boolean",
      description: "Show default state with initials",
    },
    isArchive: {
      control: "boolean",
      description: "Archive state styling",
    },
    isTemplate: {
      control: "boolean",
      description: "Template room styling",
    },
    withEditing: {
      control: "boolean",
      description: "Enable edit mode with dropdown",
    },
    isEmptyIcon: {
      control: "boolean",
      description: "Show empty icon placeholder",
    },
  },
};

export default meta;
type Story = StoryObj<RoomIconProps>;

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
  args: {
    title: "Test Room",
    size: "96px",
    color: "4781D1",
    radius: "6px",
    showDefault: true,
  },
  render: (args: RoomIconProps) => (
    <div>
      <RoomIcon
        {...args}
        className={`${styles.roomTitle} ${styles.roomBackground}`}
      />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
      <RoomIcon title="S" color="4781D1" size="32px" showDefault />
      <RoomIcon title="M" color="4781D1" size="48px" showDefault />
      <RoomIcon title="L" color="4781D1" size="96px" showDefault />
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
      <RoomIcon title="Blue" color="4781D1" size="48px" showDefault />
      <RoomIcon title="Green" color="2DB482" size="48px" showDefault />
      <RoomIcon title="Orange" color="F97A0B" size="48px" showDefault />
      <RoomIcon title="Purple" color="533ED1" size="48px" showDefault />
      <RoomIcon title="Red" color="F2675A" size="48px" showDefault />
    </div>
  ),
};

export const WithEditing: Story = {
  args: {
    title: "Editable",
    size: "96px",
    color: "4781D1",
    radius: "6px",
    showDefault: true,
    withEditing: true,
    model: mockModel,
  },
  render: (args: RoomIconProps) => (
    <div style={{ height: "200px" }}>
      <RoomIcon
        {...args}
        className={`${styles.roomTitle} ${styles.roomBackground}`}
      />
    </div>
  ),
};

export const EmptyState: Story = {
  args: {
    title: "",
    size: "96px",
    isEmptyIcon: true,
    model: mockModel,
  },
  render: (args: RoomIconProps) => (
    <div style={{ height: "200px" }}>
      <RoomIcon {...args} />
    </div>
  ),
};

export const Archive: Story = {
  args: {
    title: "Archived",
    size: "96px",
    color: "A3A9AE",
    radius: "6px",
    showDefault: true,
    isArchive: true,
  },
  render: (args: RoomIconProps) => (
    <div>
      <RoomIcon {...args} className={styles.roomTitle} />
    </div>
  ),
};

export const WithBadge: Story = {
  args: {
    title: "Public",
    color: "3B72A7",
    size: "96px",
    radius: "6px",
    badgeUrl: PlanetIcon,
    onBadgeClick: () => console.log("Badge clicked"),
    showDefault: true,
  },
  render: (args: RoomIconProps) => (
    <div style={{ position: "relative", width: "120px", height: "120px" }}>
      <RoomIcon {...args} className={styles.roomTitle} />
    </div>
  ),
};

export const WithTooltip: Story = {
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
  render: (args: RoomIconProps) => (
    <div style={{ position: "relative", width: "120px", height: "120px" }}>
      <RoomIcon {...args} className={styles.roomTitle} />
    </div>
  ),
};

export const Template: Story = {
  args: {
    title: "Template",
    color: "533ED1",
    size: "96px",
    radius: "6px",
    isTemplate: true,
    showDefault: true,
  },
  render: (args: RoomIconProps) => (
    <div>
      <RoomIcon {...args} className={styles.roomTitle} />
    </div>
  ),
};

export const WithHover: Story = {
  args: {
    title: "Hover",
    size: "96px",
    color: "4781D1",
    radius: "6px",
    showDefault: true,
    hoverSrc: "https://picsum.photos/200",
    model: mockModel,
  },
  render: (args: RoomIconProps) => (
    <div style={{ height: "200px" }}>
      <RoomIcon
        {...args}
        className={`${styles.roomTitle} ${styles.roomBackground}`}
      />
    </div>
  ),
};

export const LongTitle: Story = {
  args: {
    title: "Very Long Room Name That Should Be Truncated",
    size: "48px",
    color: "F97A0B",
    radius: "6px",
    showDefault: true,
  },
  render: (args: RoomIconProps) => (
    <div>
      <RoomIcon
        {...args}
        className={`${styles.roomTitle} ${styles.roomBackground}`}
      />
    </div>
  ),
};
