import type { Meta, StoryObj } from "@storybook/react-vite";
import type { CSSProperties, ComponentProps } from "react";
import { fn } from "storybook/test";

import { RoomsType } from "../../enums";

import RoomType from ".";

const meta = {
  title: "UI/Data display/RoomType",
  component: RoomType,
  parameters: {
    docs: {
      description: {
        component: `Offers one kind of room as a selectable row, with its glyph, its translated name and a short description, for a room-type picker.

### Features

- **Room Types**: Shows the glyph, the translated name and the description of each of the six room types
- **Three Layouts**: Renders as a bordered card in a list, as the collapsed button of a dropdown, or as a borderless entry inside that dropdown
- **Open State**: Turns the dropdown button's border to the accent colour and points its arrow up instead of down while open
- **Disabled Rows**: Greys out the form room or the public room row on request and stops it answering clicks, in the list and dropdown-entry layouts
- **Template Variants**: Replaces both lines with the "from template" wording and the glyph with its template variant, or swaps only the glyph for a room made from a template
- **Form Space Wording**: Uses the form-space title and description in place of the room type's own
- **Single Click Target**: Calls the click handler once per click wherever in the row it lands, the arrow included
- **Right-To-Left Support**: Moves the forward arrow to the left edge and mirrors it in a right-to-left interface

### Accessibility

The row is a plain \`div\` with a click handler; the component adds one state attribute of its own:

- **\`aria-disabled\`**: Set on a greyed-out list or dropdown-entry row, so screen readers announce it as unavailable
- **No keyboard access**: The row has no role, no \`tabIndex\` and no key handler, so the consumer must wrap it in a button or give the surrounding list its own keyboard handling

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
\`\`\`

\`\`\`tsx
// The collapsed button of a picker, opening a list of dropdownItem rows
<RoomType
  roomType={picked}
  type="dropdownButton"
  isOpen={open}
  selectedId={picked}
  onClick={() => setOpen((value) => !value)}
/>
\`\`\``,
      },
    },
  },
  argTypes: {
    roomType: {
      control: {
        type: "select",
        labels: {
          [RoomsType.FormRoom]: "FormRoom",
          [RoomsType.EditingRoom]: "EditingRoom",
          [RoomsType.CustomRoom]: "CustomRoom",
          [RoomsType.PublicRoom]: "PublicRoom",
          [RoomsType.VirtualDataRoom]: "VirtualDataRoom",
          [RoomsType.AIRoom]: "AIRoom",
        },
      },
      options: Object.values(RoomsType).filter((v) => typeof v === "number"),
      description:
        "Which room type the row describes. It picks the glyph, the title and the description; an unknown value leaves both lines empty",
    },
    isOpen: {
      control: "boolean",
      description:
        "Draws the row as opened: on a dropdown button the border turns to the accent colour and the arrow points up instead of down. The other layouts look the same either way",
    },
    type: {
      control: "select",
      options: ["listItem", "dropdownButton", "dropdownItem"],
      description:
        "Which layout to render: a bordered card with a forward arrow, the collapsed button of a dropdown with a down arrow, or a borderless entry with no arrow",
      table: {
        defaultValue: { summary: "listItem" },
      },
    },
    id: {
      control: "text",
      description: "`id` of the outer element",
    },
    selectedId: {
      control: "text",
      description:
        "Written to the row's `data-selected-id` attribute and read by nothing else. Required all the same",
    },
    onClick: {
      action: "clicked",
      description:
        "Called with the event when the row is clicked, once per click wherever inside the row it lands. A disabled row does not call it",
    },
    disabledFormRoom: {
      control: "boolean",
      description:
        "Greys the row out while `roomType` is `FormRoom`, marks it `aria-disabled` and stops it calling `onClick`. The dropdown button ignores it",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    disabledPublicRoom: {
      control: "boolean",
      description:
        "Greys the row out while `roomType` is `PublicRoom`, marks it `aria-disabled` and stops it calling `onClick`. The dropdown button ignores it",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isTemplate: {
      control: "boolean",
      description:
        'Replaces the title and the description with the "from template" wording, whatever `roomType` says, and switches the glyph to the template one',
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isTemplateRoom: {
      control: "boolean",
      description:
        "Switches the glyph to the template variant of `roomType` without touching the texts",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isFormSection: {
      control: "boolean",
      description:
        "Uses the form-space wording for the title and the description instead of the room type's; with `isTemplate` it becomes the form-space template wording",
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
    onClick: fn(),
  },
  parameters: {
    docs: {
      description: {
        story:
          "A single card as it appears in a list of room types to choose from; pick another type or layout in the Controls panel below.",
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
    onClick: fn(),
  },
  parameters: {
    docs: {
      description: {
        story:
          "The collapsed button at the top of a picker, drawn open: the border takes the accent colour and the arrow points up (`isOpen`). Clear `isOpen` in the Controls panel to see it closed, arrow pointing down.",
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
    onClick: fn(),
  },
  parameters: {
    docs: {
      description: {
        story:
          "An entry inside the picker's dropdown: no border and no arrow, only a background on hover.",
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

const RoomTypesTemplate = (args: ComponentProps<typeof RoomType>) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
    {[
      RoomsType.FormRoom,
      RoomsType.EditingRoom,
      RoomsType.PublicRoom,
      RoomsType.CustomRoom,
      RoomsType.VirtualDataRoom,
      RoomsType.AIRoom,
    ].map((roomType) => (
      <RoomType
        key={roomType}
        {...args}
        roomType={roomType}
        selectedId={roomType}
      />
    ))}
  </div>
);

export const RoomTypes: Story = {
  render: (args) => <RoomTypesTemplate {...args} />,
  args: {
    isOpen: false,
    type: "listItem",
    selectedId: "",
    onClick: fn(),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Every room type the row can describe, each with its own glyph, name and description (`roomType`) — what a room-type picker lists.",
      },
      source: {
        code: `{[
  RoomsType.FormRoom,
  RoomsType.EditingRoom,
  RoomsType.PublicRoom,
  RoomsType.CustomRoom,
  RoomsType.VirtualDataRoom,
  RoomsType.AIRoom,
].map((roomType) => (
  <RoomType
    key={roomType}
    roomType={roomType}
    isOpen={false}
    selectedId={roomType}
    onClick={() => onPick(roomType)}
  />
))}`,
      },
    },
  },
};

const DisabledStateTemplate = (args: ComponentProps<typeof RoomType>) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
    <RoomType
      {...args}
      roomType={RoomsType.FormRoom}
      type="listItem"
      selectedId="form-room"
      disabledFormRoom
    />
    <RoomType
      {...args}
      roomType={RoomsType.PublicRoom}
      type="dropdownItem"
      selectedId="public-room"
      disabledPublicRoom
    />
  </div>
);

export const DisabledState: Story = {
  render: (args) => <DisabledStateTemplate {...args} />,
  args: {
    isOpen: false,
    selectedId: "",
    onClick: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: `Rows for a room type the user may not create right now, shown but refusing the click:

- **Form Filling Space** — a list card on a grey background, with no hover change and no pointer cursor (\`disabledFormRoom\`)
- **Public room** — a dropdown entry with its glyph and text faded (\`disabledPublicRoom\`)

Click either one: the Actions panel stays empty.`,
      },
      source: {
        code: `<RoomType
  roomType={RoomsType.FormRoom}
  isOpen={false}
  selectedId="form-room"
  onClick={handleClick}
  disabledFormRoom
/>
<RoomType
  roomType={RoomsType.PublicRoom}
  type="dropdownItem"
  isOpen={false}
  selectedId="public-room"
  onClick={handleClick}
  disabledPublicRoom
/>`,
      },
    },
  },
};

const FromTemplateTemplate = (args: ComponentProps<typeof RoomType>) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
    <RoomType {...args} roomType={RoomsType.EditingRoom} isTemplate />
    <RoomType {...args} roomType={RoomsType.EditingRoom} isTemplateRoom />
  </div>
);

export const FromTemplate: Story = {
  render: (args) => <FromTemplateTemplate {...args} />,
  args: {
    isOpen: false,
    type: "listItem",
    selectedId: "room-1",
    onClick: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: `The two ways a template shows up in a picker:

- **From template** — the entry that starts a room from a template: both lines take the template wording and the glyph its template form (\`isTemplate\`)
- **Collaboration room** — a room type offered from a template: the glyph changes, the name and description stay (\`isTemplateRoom\`)`,
      },
      source: {
        code: `<RoomType
  roomType={RoomsType.EditingRoom}
  isOpen={false}
  selectedId="room-1"
  onClick={handleClick}
  isTemplate
/>
<RoomType
  roomType={RoomsType.EditingRoom}
  isOpen={false}
  selectedId="room-1"
  onClick={handleClick}
  isTemplateRoom
/>`,
      },
    },
  },
};

export const FormSpace: Story = {
  render: (args) => <RoomType {...args} />,
  args: {
    roomType: RoomsType.FormRoom,
    isOpen: false,
    type: "listItem",
    selectedId: "form-space",
    isFormSection: true,
    onClick: fn(),
  },
  parameters: {
    docs: {
      description: {
        story:
          "The row worded for a form space rather than a room, for a picker opened from the forms section (`isFormSection`). Turn on `isTemplate` in the Controls panel below to see the form-space template wording.",
      },
      source: {
        code: `<RoomType
  roomType={RoomsType.FormRoom}
  isOpen={false}
  selectedId="form-space"
  onClick={handleClick}
  isFormSection
/>`,
      },
    },
  },
};

export const RightToLeft: Story = {
  render: (args) => (
    <div dir="rtl">
      <RoomType {...args} />
    </div>
  ),
  globals: { direction: "rtl" },
  args: {
    roomType: RoomsType.EditingRoom,
    isOpen: false,
    type: "listItem",
    selectedId: "room-1",
    onClick: fn(),
  },
  parameters: {
    noPadding: true,
    docs: {
      // Framed, because an inline RTL story flips the whole Docs page.
      story: { inline: false, height: "96px" },
      description: {
        story:
          "The card in a right-to-left interface: the glyph moves to the right edge, the text aligns right and the forward arrow sits on the left, pointing left.",
      },
      source: {
        code: `<div dir="rtl">
  <RoomType
    roomType={RoomsType.EditingRoom}
    isOpen={false}
    selectedId="room-1"
    onClick={handleClick}
  />
</div>`,
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
          "--room-type-description-color": "#0a5a8a",
          "--room-type-gap": "20px",
        } as CSSProperties
      }
    >
      <RoomType
        roomType={RoomsType.FormRoom}
        type="listItem"
        isOpen={false}
        selectedId="room-1"
        onClick={fn()}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `CSS Custom Properties for external customization:

| Variable | Description | Default |
|----------|-------------|---------|
| \`--room-type-item-bg\` | Background of the row in every layout; a disabled row keeps its grey | theme-based |
| \`--room-type-item-border\` | Border colour of the list card and the dropdown button; the dropdown entry has no border | theme-based |
| \`--room-type-item-hover-bg\` | Background while the pointer is over the row | theme-based |
| \`--room-type-item-radius\` | Corner radius of the list card and the dropdown button | \`6px\` |
| \`--room-type-item-padding\` | Inner padding of the row | \`16px\` |
| \`--room-type-gap\` | Gap between the glyph, the text and the arrow | \`12px\` |
| \`--room-type-description-color\` | Colour of the description line | theme-based |

The card sets every variable in the table; hover it to see \`--room-type-item-hover-bg\`.`,
      },
      source: {
        code: `<div
  style={{
    "--room-type-item-bg": "#e6f3fb",
    "--room-type-item-border": "#0082c9",
    "--room-type-item-hover-bg": "#cde7f5",
    "--room-type-item-radius": "12px",
    "--room-type-item-padding": "12px",
    "--room-type-description-color": "#0a5a8a",
    "--room-type-gap": "20px",
  }}
>
  <RoomType
    roomType={RoomsType.FormRoom}
    isOpen={false}
    selectedId="room-1"
    onClick={handleClick}
  />
</div>`,
      },
    },
  },
};
