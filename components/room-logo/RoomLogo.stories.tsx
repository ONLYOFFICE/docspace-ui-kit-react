import type { CSSProperties, ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";

import { RoomsType } from "../../enums";

import { RoomLogoPure } from "./RoomLogo";

const meta = {
  title: "UI/Data display/RoomLogo",
  component: RoomLogoPure,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
    layout: "centered",
  },
  argTypes: {
    type: {
      control: "select",
      options: Object.values(RoomsType).filter((v) => typeof v === "number"),
      description:
        "Which room type's glyph to draw. An unknown value, or none, renders an empty box of the logo's size.",
      table: {
        defaultValue: { summary: "undefined" },
      },
    },
    isArchive: {
      control: "boolean",
      description:
        "Draws the archive glyph instead, whatever `type` says. It wins over every other flag.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isTemplate: {
      control: "boolean",
      description:
        "Draws the generic template glyph, ignoring `type`. Checked after `isArchive`.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isTemplateRoom: {
      control: "boolean",
      description:
        "Draws the template variant of `type`'s glyph. The four AI types have no variant and keep their plain glyph.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    withCheckbox: {
      control: "boolean",
      description:
        "Renders a checkbox next to the glyph. The stylesheet hides it, so it only becomes visible under a rule of yours.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isChecked: {
      control: "boolean",
      description:
        "Ticks that checkbox; `false` leaves it empty. A click flips the box itself until this prop next changes.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isIndeterminate: {
      control: "boolean",
      description:
        "Whether that checkbox shows the mixed state instead of a tick.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    onChange: {
      action: "changed",
      description:
        "Called by the checkbox, and by a tap on the glyph. The glyph calls it only where `react-device-detect` reports a mobile device.",
    },
    id: {
      control: "text",
      description: "`id` of the outer element.",
    },
    className: {
      control: "text",
      description:
        "Added before the component's own classes, on the outer element.",
    },
    style: {
      control: "object",
      description: "Inline style of the outer element.",
    },
  },
} satisfies Meta<typeof RoomLogoPure>;

type Story = StoryObj<ComponentProps<typeof RoomLogoPure>>;

export default meta;

// The glyph is told apart by its SVG markup.
const glyphsOf = (canvasElement: HTMLElement) =>
  Array.from(canvasElement.querySelectorAll(".room-logo_icon")).map(
    (svg) => svg.innerHTML,
  );

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
  name: "Default",
  render: (args) => <RoomLogoPure {...args} />,
  args: {
    type: RoomsType.CustomRoom,
    isArchive: false,
    withCheckbox: false,
    isChecked: false,
    isIndeterminate: false,
    onChange: fn(),
  },
  play: async ({ canvasElement }) => {
    await expect(glyphsOf(canvasElement)).toHaveLength(1);
    // No checkbox unless asked for.
    await expect(canvasElement.querySelector(".room-logo_checkbox")).toBeNull();
  },
  parameters: {
    docs: {
      description: {
        story:
          "The glyph of a custom room at its standard 32px size, with no flag set and no checkbox.",
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
    { type: RoomsType.InstructionsRoom, label: "Instructions" },
    { type: RoomsType.KnowledgeRoom, label: "Knowledge" },
    { type: RoomsType.AiProjectRoom, label: "AI project" },
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
  name: "All room types",
  render: () => <AllRoomTypesTemplate />,
  play: async ({ canvasElement }) => {
    // A glyph of its own for each of the nine types.
    const glyphs = glyphsOf(canvasElement);
    await expect(glyphs).toHaveLength(9);
    await expect(new Set(glyphs).size).toBe(9);
  },
  parameters: {
    docs: {
      description: {
        story:
          "All nine room types side by side, each labelled, with a glyph of its own.",
      },
      source: {
        code: `<RoomLogo type={RoomsType.EditingRoom} />
<RoomLogo type={RoomsType.CustomRoom} />
<RoomLogo type={RoomsType.PublicRoom} />
<RoomLogo type={RoomsType.VirtualDataRoom} />
<RoomLogo type={RoomsType.FormRoom} />
<RoomLogo type={RoomsType.AIRoom} />
<RoomLogo type={RoomsType.InstructionsRoom} />
<RoomLogo type={RoomsType.KnowledgeRoom} />
<RoomLogo type={RoomsType.AiProjectRoom} />`,
      },
    },
  },
};

export const ArchiveState: Story = {
  name: "Archived",
  render: (args) => <RoomLogoPure {...args} />,
  args: {
    type: RoomsType.CustomRoom,
    isArchive: true,
  },
  play: async ({ canvasElement }) => {
    await expect(glyphsOf(canvasElement)).toHaveLength(1);
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
    { type: RoomsType.InstructionsRoom, label: "Instructions" },
    { type: RoomsType.KnowledgeRoom, label: "Knowledge" },
    { type: RoomsType.AiProjectRoom, label: "AI project" },
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
  name: "Template variants",
  render: () => <TemplateRoomTypesTemplate />,
  play: async ({ canvasElement }) => {
    // Five template variants plus the four AI glyphs, which have none.
    const glyphs = glyphsOf(canvasElement);
    await expect(glyphs).toHaveLength(9);
    await expect(new Set(glyphs).size).toBe(9);
  },
  parameters: {
    docs: {
      description: {
        story:
          "The template variant of each room type's glyph (`isTemplateRoom`), so a template still says which kind of room it creates. The four AI types have no variant and keep their plain glyph.",
      },
      source: {
        code: `<RoomLogo type={RoomsType.EditingRoom} isTemplateRoom />
<RoomLogo type={RoomsType.CustomRoom} isTemplateRoom />
<RoomLogo type={RoomsType.PublicRoom} isTemplateRoom />
<RoomLogo type={RoomsType.VirtualDataRoom} isTemplateRoom />
<RoomLogo type={RoomsType.FormRoom} isTemplateRoom />
<RoomLogo type={RoomsType.AIRoom} isTemplateRoom />
<RoomLogo type={RoomsType.InstructionsRoom} isTemplateRoom />
<RoomLogo type={RoomsType.KnowledgeRoom} isTemplateRoom />
<RoomLogo type={RoomsType.AiProjectRoom} isTemplateRoom />`,
      },
    },
  },
};

export const TemplateState: Story = {
  name: "Template",
  render: (args) => <RoomLogoPure {...args} />,
  args: {
    type: RoomsType.CustomRoom,
    isTemplate: true,
  },
  play: async ({ canvasElement }) => {
    await expect(glyphsOf(canvasElement)).toHaveLength(1);
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
  name: "With checkbox",
  render: (args) => <SelectableTemplate {...args} />,
  args: {
    type: RoomsType.EditingRoom,
    withCheckbox: true,
    isChecked: false,
    isIndeterminate: false,
    onChange: fn(),
  },
  play: async ({ args, canvasElement, userEvent }) => {
    const checkbox = canvasElement.querySelector(
      ".room-logo_checkbox",
    ) as HTMLElement;
    await expect(checkbox).toBeVisible();
    await userEvent.click(checkbox);
    await expect(args.onChange).toHaveBeenCalledTimes(1);
  },
  parameters: {
    docs: {
      description: {
        story:
          "An empty checkbox in place of the glyph, as a row in selection mode shows it (`withCheckbox`). The component renders the checkbox hidden. The story adds the rule that swaps them, as a host must.",
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
  name: "Checkbox ticked",
  render: (args) => <SelectableTemplate {...args} />,
  args: {
    type: RoomsType.EditingRoom,
    withCheckbox: true,
    isChecked: true,
    onChange: fn(),
  },
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector(
      ".room-logo_checkbox input[type='checkbox']",
    ) as HTMLInputElement;
    await expect(input.checked).toBe(true);
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
  name: "CSS customization",
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
  play: async ({
    canvasElement,
  }: Parameters<NonNullable<Story["play"]>>[0]) => {
    const box = canvasElement.querySelector(
      ".room-logo_icon-container",
    ) as HTMLElement;
    await expect(Math.round(box.getBoundingClientRect().width)).toBe(40);
  },
  parameters: {
    docs: {
      description: {
        story: `A 40px box with a round glyph, from both variables set on a wrapper around the component.`,
      },
      source: {
        code: `<div style={{ "--room-logo-size": "40px", "--room-logo-radius": "50%" }}>
  <RoomLogo type={RoomsType.FormRoom} />
</div>`,
      },
    },
  },
};
