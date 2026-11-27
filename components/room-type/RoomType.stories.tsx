import type { Meta, StoryObj } from "@storybook/react-vite";
import type { CSSProperties, ComponentProps } from "react";
import { expect, fn } from "storybook/test";

import { RoomsType } from "../../enums";

import RoomType from ".";

const meta = {
  title: "UI/Data display/RoomType",
  component: RoomType,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
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
          [RoomsType.InstructionsRoom]: "InstructionsRoom",
          [RoomsType.KnowledgeRoom]: "KnowledgeRoom",
          [RoomsType.AiProjectRoom]: "AiProjectRoom",
        },
      },
      options: Object.values(RoomsType).filter((v) => typeof v === "number"),
      description:
        "Which room type the row describes: its glyph, title and description. An unknown value, or none, leaves both texts and the glyph box empty.",
    },
    isOpen: {
      control: "boolean",
      description:
        "Whether the row is drawn as opened: an accent border on `dropdownButton`, and its arrow turned the other way.",
    },
    type: {
      control: "select",
      options: ["listItem", "dropdownButton", "dropdownItem"],
      description:
        "Which layout to render: a bordered card with an arrow, a dropdown's collapsed button, or a borderless dropdown entry.",
      table: {
        defaultValue: { summary: "listItem" },
      },
    },
    id: {
      control: "text",
      description: "`id` of the outer element.",
    },
    selectedId: {
      control: "text",
      description:
        "Written to `data-selected-id` and read by nothing else. Required all the same.",
    },
    onClick: {
      action: "clicked",
      description:
        "Called with the event on a click anywhere in the row, once per click. Enter and Space click the row too. A disabled row never calls it; `dropdownButton` has no disabled state.",
    },
    disabledFormRoom: {
      control: "boolean",
      description:
        "Greys the row out while `roomType` is `FormRoom`, marks it `aria-disabled` and stops it calling `onClick`. The `dropdownButton` layout ignores it.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    disabledPublicRoom: {
      control: "boolean",
      description:
        "Greys the row out while `roomType` is `PublicRoom`, marks it `aria-disabled` and stops it calling `onClick`. The `dropdownButton` layout ignores it.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isTemplate: {
      control: "boolean",
      description:
        'Replaces the title and the description with the "from template" wording, whatever `roomType` says, and switches the glyph to the template one.',
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isTemplateRoom: {
      control: "boolean",
      description:
        "Switches the glyph to the template variant of `roomType` without touching the texts.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isFormSection: {
      control: "boolean",
      description:
        "Uses the form-space wording for the title and the description instead of the room type's.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
  },
} satisfies Meta<typeof RoomType>;

type Story = StoryObj<ComponentProps<typeof RoomType>>;

export default meta;

const titleOf = (row: HTMLElement) =>
  row.querySelector(".choose_room-title-text")?.textContent ?? "";

const arrowOf = (row: HTMLElement) =>
  row.querySelector(".choose_room-forward_btn") as HTMLElement;

export const Default: Story = {
  name: "Default",
  render: (args) => <RoomType {...args} />,
  args: {
    roomType: RoomsType.EditingRoom,
    isOpen: false,
    type: "listItem",
    selectedId: "room-1",
    onClick: fn(),
  },
  play: async ({ args, canvas, userEvent }) => {
    const row = canvas.getByTestId("room-type-list-item");
    await expect(titleOf(row)).not.toBe("");
    await expect(row).toHaveAttribute("data-selected-id", "room-1");
    // One call per click, on the arrow as anywhere else in the row.
    await userEvent.click(arrowOf(row));
    await expect(args.onClick).toHaveBeenCalledTimes(1);
    // The row is the one tab stop - the arrow inside is not - and Enter
    // or Space activates it.
    await expect(row).toHaveAttribute("role", "button");
    await expect(row.querySelector("[tabindex]")).toBeNull();
    row.focus();
    await expect(row).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard(" ");
    await expect(args.onClick).toHaveBeenCalledTimes(3);
  },
  parameters: {
    docs: {
      description: {
        story:
          "A collaboration room card as it appears in a list of room types to choose from.",
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
  name: "Dropdown button",
  render: (args) => <RoomType {...args} />,
  args: {
    roomType: RoomsType.PublicRoom,
    isOpen: true,
    type: "dropdownButton",
    selectedId: "room-2",
    onClick: fn(),
  },
  play: async ({ args, canvas, userEvent }) => {
    const button = canvas.getByTestId("room-type-dropdown-button");
    await expect(button.className).toMatch(/isOpen/);
    await expect(button).toHaveAttribute("aria-expanded", "true");
    // The accent border needs no portal: with no --accent-main it is the
    // theme's accent, not the text colour.
    const style = getComputedStyle(button);
    await expect(style.borderTopColor).not.toBe(style.color);
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
    button.focus();
    await userEvent.keyboard("{Enter}");
    await expect(args.onClick).toHaveBeenCalledTimes(2);
  },
  parameters: {
    docs: {
      description: {
        story:
          "The collapsed button at the top of a picker, drawn open (`isOpen`): the border takes the accent colour and the arrow points up. Closed, the arrow points down.",
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
  name: "Dropdown entry",
  render: (args) => <RoomType {...args} />,
  args: {
    roomType: RoomsType.CustomRoom,
    isOpen: false,
    type: "dropdownItem",
    selectedId: "room-3",
    onClick: fn(),
  },
  play: async ({ args, canvas, userEvent }) => {
    const entry = canvas.getByTestId("room-type-dropdown-item");
    await userEvent.click(entry);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
    entry.focus();
    await userEvent.keyboard(" ");
    await expect(args.onClick).toHaveBeenCalledTimes(2);
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
      RoomsType.InstructionsRoom,
      RoomsType.KnowledgeRoom,
      RoomsType.AiProjectRoom,
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
  name: "All room types",
  render: (args) => <RoomTypesTemplate {...args} />,
  args: {
    isOpen: false,
    type: "listItem",
    selectedId: "",
    onClick: fn(),
  },
  play: async ({ canvas }) => {
    // Nine types, each with a name of its own.
    const titles = canvas.getAllByTestId("room-type-list-item").map(titleOf);
    await expect(titles).toHaveLength(9);
    await expect(new Set(titles).size).toBe(9);
    await expect(titles.every(Boolean)).toBe(true);
  },
  parameters: {
    docs: {
      description: {
        story:
          "All nine room types, each with its own glyph, name and description (`roomType`), as a room-type picker lists them.",
      },
      source: {
        code: `{[
  RoomsType.FormRoom,
  RoomsType.EditingRoom,
  RoomsType.PublicRoom,
  RoomsType.CustomRoom,
  RoomsType.VirtualDataRoom,
  RoomsType.AIRoom,
  RoomsType.InstructionsRoom,
  RoomsType.KnowledgeRoom,
  RoomsType.AiProjectRoom,
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
  name: "Disabled",
  render: (args) => <DisabledStateTemplate {...args} />,
  args: {
    isOpen: false,
    selectedId: "",
    onClick: fn(),
  },
  play: async ({ args, canvas, userEvent }) => {
    const card = canvas.getByTestId("room-type-list-item");
    const entry = canvas.getByTestId("room-type-dropdown-item");
    for (const row of [card, entry]) {
      await expect(row).toHaveAttribute("aria-disabled", "true");
    }
    // Shown and still focusable, but neither calls onClick, by pointer or
    // by key.
    await userEvent.click(card);
    await userEvent.click(entry);
    card.focus();
    await expect(card).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(args.onClick).not.toHaveBeenCalled();
  },
  parameters: {
    docs: {
      description: {
        story: `Two rows for room types the user may not create, shown but refusing the click and the keys:

- **Form Filling Space** — a list card on a grey background, with no hover change and no pointer cursor (\`disabledFormRoom\`)
- **Public room** — a dropdown entry with its glyph and text faded (\`disabledPublicRoom\`)`,
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
  name: "From a template",
  render: (args) => <FromTemplateTemplate {...args} />,
  args: {
    isOpen: false,
    type: "listItem",
    selectedId: "room-1",
    onClick: fn(),
  },
  play: async ({ canvas }) => {
    // isTemplate rewords the row; isTemplateRoom keeps the room's name.
    const [fromTemplate, templateRoom] = canvas
      .getAllByTestId("room-type-list-item")
      .map(titleOf);
    await expect(fromTemplate).not.toBe(templateRoom);
  },
  parameters: {
    docs: {
      description: {
        story: `The two ways a template shows up in a picker:

- **From template** — the entry that starts a room from a template, with template wording and glyph (\`isTemplate\`)
- **Collaboration room** — a room type offered from a template: the glyph changes, the texts stay (\`isTemplateRoom\`)`,
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
  name: "Form space",
  render: (args) => <RoomType {...args} />,
  args: {
    roomType: RoomsType.FormRoom,
    isOpen: false,
    type: "listItem",
    selectedId: "form-space",
    isFormSection: true,
    onClick: fn(),
  },
  play: async ({ canvas }) => {
    await expect(titleOf(canvas.getByTestId("room-type-list-item"))).not.toBe(
      "",
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "The row worded for a form space rather than a room, for a picker opened from the forms section (`isFormSection`). With `isTemplate` it takes the form-space template wording.",
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
  name: "Right to left",
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
  play: async ({ canvas }) => {
    // Under RTL the forward arrow sits on the left of the text.
    const row = canvas.getByTestId("room-type-list-item");
    const text = row.querySelector(".choose_room-info_wrapper") as HTMLElement;
    await expect(
      arrowOf(row).getBoundingClientRect().right,
    ).toBeLessThanOrEqual(text.getBoundingClientRect().left);
  },
  parameters: {
    noPadding: true,
    docs: {
      // Framed, because an inline RTL story flips the whole Docs page.
      story: { inline: false, height: "96px" },
      description: {
        story:
          "The card in a right-to-left interface. The glyph moves to the right edge and the text aligns right. The forward arrow sits on the left, pointing left.",
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
  name: "CSS customization",
  render: () => (
    <div
      style={
        {
          width: "320px",
          "--room-type-item-bg": "light-dark(#e6f3fb, #16303e)",
          "--room-type-item-border": "#0082c9",
          "--room-type-item-hover-bg": "light-dark(#cde7f5, #1f4a61)",
          "--room-type-item-radius": "12px",
          "--room-type-item-padding": "12px",
          "--room-type-description-color": "light-dark(#0a5a8a, #5cb8e8)",
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
  play: async ({ canvas }: Parameters<NonNullable<Story["play"]>>[0]) => {
    const row = getComputedStyle(canvas.getByTestId("room-type-list-item"));
    await expect(row.backgroundColor).toBe("rgb(230, 243, 251)");
    await expect(row.borderTopLeftRadius).toBe("12px");
  },
  parameters: {
    docs: {
      description: {
        story: `A card in blue with rounder corners and wider gaps, from every overridable variable set on a wrapper. A hover swaps in \`--room-type-item-hover-bg\`.`,
      },
      source: {
        code: `<div
  style={{
    "--room-type-item-bg": "light-dark(#e6f3fb, #16303e)",
    "--room-type-item-border": "#0082c9",
    "--room-type-item-hover-bg": "light-dark(#cde7f5, #1f4a61)",
    "--room-type-item-radius": "12px",
    "--room-type-item-padding": "12px",
    "--room-type-description-color": "light-dark(#0a5a8a, #5cb8e8)",
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
