import type { Meta, StoryObj } from "@storybook/react-vite";
import type { CSSProperties, ComponentProps } from "react";

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
import RoomType from "@onlyoffice/apps-ui-kit/components/room-type";
import { RoomsType } from "@onlyoffice/apps-ui-kit/enums";

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
    disabledPublicRoom: {
      control: "boolean",
      description: "Whether the public room type is disabled",
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

export const CssCustomization = {
  render: () => (
    <div
      style={
        {
          width: "320px",
          "--room-type-item-bg": "#e6f3fb",
          "--room-type-item-border": "#0082c9",
          "--room-type-item-hover-bg": "#cde7f5",
          "--room-type-item-radius": "12px",
          "--room-type-item-padding": "12px",
        } as CSSProperties
      }
    >
      <RoomType
        roomType={RoomsType.FormRoom}
        type="listItem"
        isOpen={false}
        selectedId="room-1"
        onClick={() => {}}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `CSS Custom Properties for external customization:

| Variable | Description | Default |
|----------|-------------|---------|
| \`--room-type-item-bg\` | List/display item background | theme |
| \`--room-type-item-border\` | Item border color | theme gray |
| \`--room-type-item-hover-bg\` | Hover background | theme |
| \`--room-type-item-radius\` | Border radius | \`6px\` |
| \`--room-type-item-padding\` | Item padding | \`16px\` |
| \`--room-type-description-color\` | Description text color | theme gray |`,
      },
    },
  },
};
