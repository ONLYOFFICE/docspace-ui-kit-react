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
import type { ComponentProps } from "react";

import { RoomsType } from "../../enums";

import RoomType from ".";

const meta = {
  title: "UI/Data display/RoomType",
  component: RoomType,
  parameters: {
    docs: {
      description: {
        component: `Displays a room type option with icon, title, description, and navigation arrow.

### Features

- **Multiple Display Types**: Renders as list item, dropdown button, or dropdown item
- **Room Type Icons**: Shows appropriate icon for each room type via RoomLogo
- **Selection State**: Tracks selected room type via selectedId
- **Open/Closed State**: Visual toggle for expanded/collapsed state
- **Form Room Disabling**: Optionally disable the form room type
- **Template Support**: Supports template and template room variants

### Usage

\`\`\`tsx
import RoomType from "@docspace/ui-kit/components/room-type";
import { RoomsType } from "@docspace/ui-kit/enums";

<RoomType
  roomType={RoomsType.EditingRoom}
  isOpen={false}
  selectedId="room-1"
  onClick={handleClick}
/>
\`\`\``,
      },
    },
  },
  argTypes: {
    roomType: {
      control: "select",
      options: Object.values(RoomsType).filter((v) => typeof v === "number"),
      description: "The type of room to display",
    },
    isOpen: {
      control: "boolean",
      description:
        "Whether the room type item is in open/expanded state",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    type: {
      control: "select",
      options: ["listItem", "dropdownButton", "dropdownItem"],
      description: "Display variant of the room type component",
      table: {
        defaultValue: { summary: "listItem" },
      },
    },
    disabledFormRoom: {
      control: "boolean",
      description: "Whether the form room type is disabled",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isTemplate: {
      control: "boolean",
      description: "Whether to show template variant labels",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isTemplateRoom: {
      control: "boolean",
      description: "Whether this is a template room",
      table: {
        defaultValue: { summary: "false" },
      },
    },
  },
} satisfies Meta<typeof RoomType>;

type Story = StoryObj<ComponentProps<typeof RoomType>>;

export default meta;

export const Default: Story = {
  render: (args) => <RoomType {...args} />,
  args: {
    roomType: RoomsType.EditingRoom,
    isOpen: false,
    type: "listItem",
    selectedId: "room-1",
    onClick: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: "Default room type displayed as a list item.",
      },
      source: {
        code: `<RoomType
  roomType={RoomsType.EditingRoom}
  isOpen={false}
  type="listItem"
  selectedId="room-1"
  onClick={handleClick}
/>`,
      },
    },
  },
};

export const DropdownButton: Story = {
  render: (args) => <RoomType {...args} />,
  args: {
    roomType: RoomsType.PublicRoom,
    isOpen: true,
    type: "dropdownButton",
    selectedId: "room-2",
    onClick: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: "Room type rendered as a dropdown button in open state.",
      },
      source: {
        code: `<RoomType
  roomType={RoomsType.PublicRoom}
  isOpen={true}
  type="dropdownButton"
  selectedId="room-2"
  onClick={handleClick}
/>`,
      },
    },
  },
};

export const DropdownItem: Story = {
  render: (args) => <RoomType {...args} />,
  args: {
    roomType: RoomsType.CustomRoom,
    isOpen: false,
    type: "dropdownItem",
    selectedId: "room-3",
    onClick: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: "Room type rendered as a dropdown item.",
      },
      source: {
        code: `<RoomType
  roomType={RoomsType.CustomRoom}
  isOpen={false}
  type="dropdownItem"
  selectedId="room-3"
  onClick={handleClick}
/>`,
      },
    },
  },
};
