import type { CSSProperties, ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { RoomsType } from "../../enums";

import { RoomLogoPure } from "./RoomLogo";

const meta = {
  title: "UI/Data display/RoomLogo",
  component: RoomLogoPure,
  parameters: {
    docs: {
      description: {
        component: `Draws the stock glyph for a room type, for rooms that have no logo of their own.

### Features

- **Room Type Icons**: Draws a separate glyph for each room type (Editing, Custom, Public, Virtual Data, Form, AI)
- **Archive State**: Replaces the type's glyph with the archive glyph, whatever the type and the other flags say
- **Generic Template Glyph**: Draws one template glyph for every type when \`isTemplate\` is set
- **Template Variants**: Draws a template variant of each type's glyph, falling back to the plain glyph for the AI type, which has no variant
- **Empty Placeholder**: Keeps a blank box of the logo's size when the type is missing or unknown
- **Selection Checkbox**: Optional checkbox beside the glyph, hidden by the component's own stylesheet until a rule of yours reveals it
- **Tap To Select**: A tap on the glyph calls \`onChange\` on mobile devices only, so a row can be selected without reaching the checkbox

### Usage

\`\`\`tsx
import { RoomLogo } from "@onlyoffice/apps-ui-kit/components/room-logo";
import { RoomsType } from "@onlyoffice/apps-ui-kit/enums";

// Basic room logo
<RoomLogo type={RoomsType.CustomRoom} />

// Archive room
<RoomLogo type={RoomsType.CustomRoom} isArchive />

// Template variant of a room type
<RoomLogo type={RoomsType.FormRoom} isTemplateRoom />

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
      description:
        "Which room type's glyph to draw. A missing or unknown value draws nothing and leaves a blank box of the logo's size",
      table: {
        defaultValue: { summary: "undefined" },
      },
    },
    isArchive: {
      control: "boolean",
      description:
        "Draws the archive glyph instead of the type's glyph; wins over every other flag",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isTemplate: {
      control: "boolean",
      description:
        "Draws the generic template glyph, the same for every type; ignored when `isArchive` is set",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isTemplateRoom: {
      control: "boolean",
      description:
        "Draws the template variant of the type's glyph; the AI type has none and keeps its plain glyph",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    withCheckbox: {
      control: "boolean",
      description:
        "Renders a checkbox beside the glyph. The component's own stylesheet hides it, so it shows only under a rule of yours",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isChecked: {
      control: "boolean",
      description: "Whether that checkbox is ticked",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isIndeterminate: {
      control: "boolean",
      description:
        "Whether that checkbox shows the mixed state (a dash) instead of a tick",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    onChange: {
      action: "changed",
      description:
        "Called when the checkbox is clicked, and when the glyph is tapped on a mobile device; a click on the glyph on desktop does nothing",
    },
    isPrivacy: {
      control: false,
      description: "Accepted but ignored: nothing in the component reads it",
    },
    id: {
      control: "text",
      description: "`id` of the outer element",
    },
    className: {
      control: "text",
      description: "Class added to the outer element, before its own classes",
    },
    style: {
      control: "object",
      description: "Inline style of the outer element",
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
    onChange: fn(),
  },
  parameters: {
    docs: {
      description: {
        story:
          "The glyph of one room type at its standard size; pick another type or turn on a flag in the Controls panel below to see which glyph wins.",
      },
      source: {
        code: `<RoomLogo type={RoomsType.CustomRoom} />`,
      },
    },
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
          "Every room type side by side, labelled by type, to pick the glyph a list or a header needs for each kind of room.",
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
        story:
          "An archived room keeps one glyph whatever its type (`isArchive`), so a reader tells archived rooms apart from active ones at a glance.",
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
    { type: RoomsType.AIRoom, label: "AI" },
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
          "A template made from a room shows the template variant of that room's glyph (`isTemplateRoom`), so it still says which kind of room it creates. **AI** has no variant and keeps its plain glyph.",
      },
      source: {
        code: `<RoomLogo type={RoomsType.EditingRoom} isTemplateRoom />
<RoomLogo type={RoomsType.CustomRoom} isTemplateRoom />
<RoomLogo type={RoomsType.PublicRoom} isTemplateRoom />
<RoomLogo type={RoomsType.VirtualDataRoom} isTemplateRoom />
<RoomLogo type={RoomsType.FormRoom} isTemplateRoom />
<RoomLogo type={RoomsType.AIRoom} isTemplateRoom />`,
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
        story:
          "One template glyph for every type (`isTemplate`), for a place that lists templates without telling their room types apart; the `type` set here is ignored.",
      },
      source: {
        code: `<RoomLogo type={RoomsType.CustomRoom} isTemplate />`,
      },
    },
  },
};

// The stylesheet hides the checkbox; this rule stands in for the one a host adds to reveal it.
const revealCheckbox = `.room-logo-selectable .room-logo_icon-container { display: none; }
.room-logo-selectable .room-logo_checkbox { display: flex; margin: 0; }`;

const SelectableTemplate = (args: ComponentProps<typeof RoomLogoPure>) => (
  <>
    <style>{revealCheckbox}</style>
    <RoomLogoPure {...args} className="room-logo-selectable" />
  </>
);

export const WithCheckbox: Story = {
  render: (args) => <SelectableTemplate {...args} />,
  args: {
    type: RoomsType.EditingRoom,
    withCheckbox: true,
    isChecked: false,
    isIndeterminate: false,
    onChange: fn(),
  },
  parameters: {
    docs: {
      description: {
        story:
          "A row in selection mode swaps the glyph for a checkbox in the same box (`withCheckbox`). The component renders the checkbox hidden, so the story adds the rule that swaps them, as a host must; tick it, or set the mixed state in the Controls panel below.",
      },
      source: {
        code: `/* host stylesheet */
.selectable .room-logo_icon-container { display: none; }
.selectable .room-logo_checkbox { display: flex; margin: 0; }

<RoomLogo
  className="selectable"
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
  render: (args) => <SelectableTemplate {...args} />,
  args: {
    type: RoomsType.EditingRoom,
    withCheckbox: true,
    isChecked: true,
    onChange: fn(),
  },
  parameters: {
    docs: {
      description: {
        story:
          "A selected row keeps its checkbox ticked (`isChecked`), with the same host rule revealing it as in the story above.",
      },
      source: {
        code: `<RoomLogo
  className="selectable"
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
      style={
        {
          "--room-logo-size": "40px",
          "--room-logo-radius": "50%",
        } as CSSProperties
      }
    >
      <RoomLogoPure type={RoomsType.FormRoom} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `CSS Custom Properties for external customization:

| Variable | Description | Default |
|----------|-------------|---------|
| \`--room-logo-size\` | Width and height of the box the glyph sits in; the glyph keeps its drawn 32px size, so a larger value adds empty space around it | \`32px\` |
| \`--room-logo-radius\` | Corner radius of the glyph's rounded square | \`6px\` |

The example sets both on a wrapper: a 40px box with a round glyph.`,
      },
      source: {
        code: `<div style={{ "--room-logo-size": "40px", "--room-logo-radius": "50%" }}>
  <RoomLogo type={RoomsType.FormRoom} />
</div>`,
      },
    },
  },
};
