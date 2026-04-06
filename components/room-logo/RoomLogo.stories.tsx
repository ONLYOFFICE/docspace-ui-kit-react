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

import { RoomsType } from "../../enums";

import { RoomLogoPure } from "./RoomLogo";

const meta = {
  title: "UI/Data display/RoomLogo",
  component: RoomLogoPure,
  parameters: {
    docs: {
      description: {
        component: `Displays the default room logo icon based on room type, with support for archive, template, and checkbox states.

### Features

- **Room Type Icons**: Different SVG icons for each room type (Editing, Custom, Public, VirtualData, Form, AI)
- **Archive State**: Dedicated archive icon
- **Template Support**: Template-specific icons for each room type
- **Checkbox Integration**: Optional checkbox overlay for selection in row/tile views

### Usage

\`\`\`tsx
import { RoomLogo } from "@docspace/ui-kit/components/room-logo";
import { RoomsType } from "@docspace/ui-kit/enums";

// Basic room logo
<RoomLogo type={RoomsType.CustomRoom} />

// Archive room
<RoomLogo type={RoomsType.CustomRoom} isArchive />

// With checkbox
<RoomLogo type={RoomsType.EditingRoom} withCheckbox isChecked={false} onChange={handleChange} />
\`\`\``,
      },
    },
    layout: "centered",
  },
  argTypes: {
    type: {
      control: "select",
      options: Object.values(RoomsType).filter((v) => typeof v === "number"),
      description: "Room type determining which icon to display",
    },
    isArchive: {
      control: "boolean",
      description: "Show archive icon",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isTemplate: {
      control: "boolean",
      description: "Show template room icon",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isTemplateRoom: {
      control: "boolean",
      description: "Show template-specific variant of the room type icon",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    withCheckbox: {
      control: "boolean",
      description: "Show checkbox overlay for selection",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isChecked: {
      control: "boolean",
      description: "Checkbox checked state",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isIndeterminate: {
      control: "boolean",
      description: "Checkbox indeterminate state",
      table: {
        defaultValue: { summary: "false" },
      },
    },
  },
} satisfies Meta<typeof RoomLogoPure>;

type Story = StoryObj<ComponentProps<typeof RoomLogoPure>>;

export default meta;

const Wrapper = (props: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
        gridGap: "16px",
        alignItems: "center",
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
  render: (args) => <RoomLogoPure {...args} />,
  args: {
    type: RoomsType.CustomRoom,
    isArchive: false,
    withCheckbox: false,
    isChecked: false,
    isIndeterminate: false,
  },
};

const AllRoomTypesTemplate = () => {
  const types = [
    { type: RoomsType.EditingRoom, label: "Editing" },
    { type: RoomsType.CustomRoom, label: "Custom" },
    { type: RoomsType.PublicRoom, label: "Public" },
    { type: RoomsType.VirtualDataRoom, label: "Virtual Data" },
    { type: RoomsType.FormRoom, label: "Form" },
    { type: RoomsType.AIRoom, label: "AI" },
  ];

  return (
    <Wrapper>
      {types.map(({ type, label }) => (
        <LabeledItem key={label} label={label}>
          <RoomLogoPure type={type} />
        </LabeledItem>
      ))}
    </Wrapper>
  );
};

export const AllRoomTypes: Story = {
  render: () => <AllRoomTypesTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "All available room type icons: Editing, Custom, Public, Virtual Data, Form, and AI.",
      },
      source: {
        code: `<RoomLogo type={RoomsType.EditingRoom} />
<RoomLogo type={RoomsType.CustomRoom} />
<RoomLogo type={RoomsType.PublicRoom} />
<RoomLogo type={RoomsType.VirtualDataRoom} />
<RoomLogo type={RoomsType.FormRoom} />
<RoomLogo type={RoomsType.AIRoom} />`,
      },
    },
  },
};

export const ArchiveState: Story = {
  render: (args) => <RoomLogoPure {...args} />,
  args: {
    type: RoomsType.CustomRoom,
    isArchive: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Archive icon displayed for archived rooms regardless of room type.",
      },
      source: {
        code: `<RoomLogo type={RoomsType.CustomRoom} isArchive />`,
      },
    },
  },
};

const TemplateRoomTypesTemplate = () => {
  const types = [
    { type: RoomsType.EditingRoom, label: "Editing" },
    { type: RoomsType.CustomRoom, label: "Custom" },
    { type: RoomsType.PublicRoom, label: "Public" },
    { type: RoomsType.VirtualDataRoom, label: "Virtual Data" },
    { type: RoomsType.FormRoom, label: "Form" },
  ];

  return (
    <Wrapper>
      {types.map(({ type, label }) => (
        <LabeledItem key={label} label={label}>
          <RoomLogoPure type={type} isTemplateRoom />
        </LabeledItem>
      ))}
    </Wrapper>
  );
};

export const TemplateRoomTypes: Story = {
  render: () => <TemplateRoomTypesTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Template-specific icons for each room type, shown when isTemplateRoom is enabled.",
      },
      source: {
        code: `<RoomLogo type={RoomsType.EditingRoom} isTemplateRoom />
<RoomLogo type={RoomsType.CustomRoom} isTemplateRoom />
<RoomLogo type={RoomsType.PublicRoom} isTemplateRoom />
<RoomLogo type={RoomsType.VirtualDataRoom} isTemplateRoom />
<RoomLogo type={RoomsType.FormRoom} isTemplateRoom />`,
      },
    },
  },
};

export const TemplateState: Story = {
  render: (args) => <RoomLogoPure {...args} />,
  args: {
    type: RoomsType.CustomRoom,
    isTemplate: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Generic template icon for template rooms.",
      },
      source: {
        code: `<RoomLogo type={RoomsType.CustomRoom} isTemplate />`,
      },
    },
  },
};

export const WithCheckbox: Story = {
  render: (args) => <RoomLogoPure {...args} />,
  args: {
    type: RoomsType.EditingRoom,
    withCheckbox: true,
    isChecked: false,
    isIndeterminate: false,
    onChange: () => console.log("Checkbox changed"),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Room logo with an integrated checkbox for row/tile selection in list views.",
      },
      source: {
        code: `<RoomLogo
  type={RoomsType.EditingRoom}
  withCheckbox
  isChecked={false}
  onChange={handleChange}
/>`,
      },
    },
  },
};

export const CheckboxChecked: Story = {
  render: (args) => <RoomLogoPure {...args} />,
  args: {
    type: RoomsType.EditingRoom,
    withCheckbox: true,
    isChecked: true,
    onChange: () => console.log("Checkbox changed"),
  },
  parameters: {
    docs: {
      description: {
        story: "Room logo with checkbox in checked state.",
      },
      source: {
        code: `<RoomLogo
  type={RoomsType.EditingRoom}
  withCheckbox
  isChecked
  onChange={handleChange}
/>`,
      },
    },
  },
};

export const CssCustomization = {
  render: () => (
    <div
      style={{ display: "flex", flexDirection: "column", gap: "16px" }}
    >
      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        <span style={{ fontSize: "12px", color: "#666", width: "80px" }}>Default</span>
        <div style={{ display: "flex", gap: "8px" }}>
          <RoomLogoPure type={RoomsType.FormRoom} />
          <RoomLogoPure type={RoomsType.EditingRoom} />
          <RoomLogoPure type={RoomsType.CustomRoom} />
        </div>
      </div>
      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        <span style={{ fontSize: "12px", color: "#666", width: "80px" }}>Rounded</span>
        <div
          style={
            {
              display: "flex",
              gap: "8px",
              "--room-logo-size": "40px",
              "--room-logo-radius": "50%",
            } as CSSProperties
          }
        >
          <RoomLogoPure type={RoomsType.FormRoom} />
          <RoomLogoPure type={RoomsType.EditingRoom} />
          <RoomLogoPure type={RoomsType.CustomRoom} />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `CSS Custom Properties for external customization:

| Variable | Description | Default |
|----------|-------------|---------|
| \`--room-logo-size\` | Icon container size | \`32px\` |
| \`--room-logo-radius\` | Icon border radius | \`6px\` |`,
      },
    },
  },
};
