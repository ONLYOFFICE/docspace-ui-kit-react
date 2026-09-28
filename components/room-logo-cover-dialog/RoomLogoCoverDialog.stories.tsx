import type { ComponentProps } from "react";
import { useEffect, useState } from "react";
import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import type { TTranslation } from "../../utils";
import type { ICover } from "../../types";
import type { TColorScheme } from "../../providers/theme/themes";
import { Button, ButtonSize } from "../button";

import { RoomLogoCoverDialog } from ".";

// The dialog takes its translator as a prop rather than using the hook, so the
// stories supply a stub that echoes the key.
const t = ((key: string) => key.replace("Common:", "")) as TTranslation;

// `data` is inline SVG markup, which is what the portal serves for covers.
const cover = (id: string, glyph: string): ICover => ({
  id,
  data: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><text x="16" y="22" font-size="18" text-anchor="middle">${glyph}</text></svg>`,
});

const covers: ICover[] = [
  cover("folder", "F"),
  cover("chart", "C"),
  cover("book", "B"),
  cover("star", "S"),
];

const accentScheme: TColorScheme = {
  main: { accent: "#4781D1", buttons: "#5299E0" },
};

// The dialog picks its aside layout from window.innerWidth, so on Docs the
// story runs in a phone-sized frame of its own.
const withPhoneFrame: Decorator = (Story, context) => {
  if (context.viewMode !== "docs") return <Story />;

  return (
    <iframe
      title={context.name}
      src={`iframe.html?viewMode=story&id=${context.id}`}
      style={{ width: 414, height: 760, border: 0 }}
    />
  );
};

const meta = {
  title: "UI/Overlays/RoomLogoCoverDialog",
  component: RoomLogoCoverDialog,
  parameters: {
    docs: {
      description: {
        component: `Dialog for choosing a room's generated logo: a colour and an optional icon, over a live preview of the tile.

### Features

- **Colour Selection**: Picks one of nine preset colours, or a custom colour chosen in a colour picker that opens from the plus button
- **Custom Colour Swatch**: Keeps a colour outside the presets as an extra swatch after them, with a pencil button to change it again
- **Cover Selection**: Draws the chosen icon on the tile; clicking the chosen icon again, or "without icon", goes back to the initials
- **Live Preview**: Shows the resulting room logo as the selection changes
- **Initials Fallback**: Draws the first and last initials of the room title on the tile while no icon is chosen
- **Accent Tint**: Highlights the hovered and the chosen icon in the portal's accent colour when one is passed
- **Result On Apply**: Hands the chosen colour and icon to the caller when apply is clicked and leaves saving and closing to it
- **Phone Layout**: Switches to a full-screen panel on a phone, with the colour picker in a modal of its own

### Usage

\`\`\`tsx
import { RoomLogoCoverDialog } from "@onlyoffice/apps-ui-kit/components/room-logo-cover-dialog";

const [visible, setVisible] = useState(false);

<RoomLogoCoverDialog
  t={t}
  visible={visible}
  covers={covers}
  title="Quarterly reports"
  onClose={() => setVisible(false)}
  onApply={(color, cover) => {
    saveLogo(color, cover);
    setVisible(false);
  }}
/>
\`\`\`

\`\`\`tsx
// Reopen with what the room already has
<RoomLogoCoverDialog
  {...dialogProps}
  initialColor="#4781D1"
  initialCover={roomCover}
  currentColorScheme={colorScheme}
/>
\`\`\``,
      },
      // Every story opens a modal over the whole page, so on Docs each gets
      // a document of its own.
      story: { inline: false, height: "760px" },
    },
  },
  args: {
    onClose: fn(),
    onApply: fn(),
  },
  argTypes: {
    t: {
      control: false,
      description:
        "Translation function. The dialog asks it for the heading, the button labels and the picker labels, some of them outside the `Common` namespace the kit ships",
    },
    visible: {
      control: "boolean",
      description:
        "Whether the dialog is on screen. Opening it again discards whatever was chosen the last time",
    },
    covers: {
      control: false,
      description:
        "The icons to offer, each as raw SVG markup that is written into the page as it is. An empty array leaves the icon picker out",
    },
    title: {
      control: "text",
      description:
        "Room title, whose first and last initials are drawn on the preview while no icon is chosen",
      table: { defaultValue: { summary: '""' } },
    },
    initialColor: {
      control: "text",
      description:
        "Colour selected when the dialog opens, as `#rrggbb`. A colour outside the presets appears as an extra swatch after them",
      table: { defaultValue: { summary: "#FF6680" } },
    },
    initialCover: {
      control: false,
      description:
        "Icon selected when the dialog opens, or `null` for the initials",
      table: { defaultValue: { summary: "null" } },
    },
    isBaseTheme: {
      control: "boolean",
      description:
        "Whether the preview tile is drawn for the light theme. Taken from the theme when it is not passed",
      table: { defaultValue: { summary: "from the theme" } },
    },
    currentColorScheme: {
      control: "object",
      description:
        "The portal's accent colours; the hovered and the chosen icon are drawn in `main.accent`. Without it neither is highlighted",
    },
    onClose: {
      action: "onClose",
      description:
        "Called by the cancel button, the header cross, Escape and a click outside the dialog, but not while the colour picker is open",
    },
    onApply: {
      action: "onApply",
      description:
        "Called with the chosen colour and icon, or `null` for the initials, when apply is clicked. The dialog does not close itself",
    },
  },
} satisfies Meta<typeof RoomLogoCoverDialog>;

type Story = StoryObj<ComponentProps<typeof RoomLogoCoverDialog>>;

export default meta;

type DemoProps = Pick<
  ComponentProps<typeof RoomLogoCoverDialog>,
  | "visible"
  | "title"
  | "initialColor"
  | "initialCover"
  | "isBaseTheme"
  | "currentColorScheme"
  | "onClose"
  | "onApply"
> & { covers?: ICover[] };

const RoomLogoCoverDialogDemo = ({
  visible,
  covers: coverList = covers,
  onClose,
  onApply,
  ...rest
}: DemoProps) => {
  const [isVisible, setIsVisible] = useState(!!visible);

  useEffect(() => {
    setIsVisible(!!visible);
  }, [visible]);

  return (
    <>
      <Button
        label="Open dialog"
        size={ButtonSize.small}
        onClick={() => setIsVisible(true)}
      />
      <RoomLogoCoverDialog
        {...rest}
        t={t}
        visible={isVisible}
        covers={coverList}
        onClose={() => {
          onClose?.();
          setIsVisible(false);
        }}
        onApply={(color, cover) => {
          onApply?.(color, cover);
          setIsVisible(false);
        }}
      />
    </>
  );
};

export const Default: Story = {
  render: (args) => <RoomLogoCoverDialogDemo {...args} />,
  args: {
    visible: true,
    isBaseTheme: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "The dialog as it opens for a room with no logo yet: the first preset colour, no icon and no title. Pick a colour and an icon to watch the preview change, and apply or cancel to see the callbacks in the Actions panel; the button reopens it.",
      },
      source: {
        code: `<RoomLogoCoverDialog
  t={t}
  visible={visible}
  covers={covers}
  onClose={() => setVisible(false)}
  onApply={(color, cover) => setVisible(false)}
/>`,
      },
    },
  },
};

export const WithPreselectedCover: Story = {
  render: (args) => <RoomLogoCoverDialogDemo {...args} />,
  args: {
    ...Default.args,
    initialCover: covers[1],
    initialColor: "#4781D1",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Reopening the dialog for a room that already has a logo: its icon is on the tile and its colour, which is not one of the presets, sits as an extra swatch after them with a pencil to change it (`initialCover`, `initialColor`).",
      },
      source: {
        code: `<RoomLogoCoverDialog
  {...dialogProps}
  initialCover={covers[1]}
  initialColor="#4781D1"
/>`,
      },
    },
  },
};

export const InitialsFromTitle: Story = {
  render: (args) => <RoomLogoCoverDialogDemo {...args} />,
  args: {
    ...Default.args,
    title: "Quarterly reports",
  },
  parameters: {
    docs: {
      description: {
        story:
          "With no icon chosen the tile carries the room's initials, here QR for a room called Quarterly reports (`title`). Pick an icon and it replaces them; the without-icon chip brings them back.",
      },
      source: {
        code: `<RoomLogoCoverDialog {...dialogProps} title="Quarterly reports" />`,
      },
    },
  },
};

export const WithAccentColors: Story = {
  render: (args) => <RoomLogoCoverDialogDemo {...args} />,
  args: {
    ...Default.args,
    initialCover: covers[1],
    currentColorScheme: accentScheme,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Pass the portal's colour scheme so the chosen icon sits on a tint of its accent colour; without it the chosen icon looks like the rest (`currentColorScheme`).",
      },
      source: {
        code: `<RoomLogoCoverDialog
  {...dialogProps}
  initialCover={covers[1]}
  currentColorScheme={{ main: { accent: "#4781D1" } }}
/>`,
      },
    },
  },
};

export const WithoutIconPicker: Story = {
  render: (args) => <RoomLogoCoverDialogDemo {...args} covers={[]} />,
  args: {
    ...Default.args,
    title: "Quarterly reports",
  },
  parameters: {
    docs: {
      description: {
        story:
          "When there are no icons to offer, the icon picker is left out and the dialog chooses only the colour behind the initials (`covers={[]}`).",
      },
      source: {
        code: `<RoomLogoCoverDialog {...dialogProps} covers={[]} />`,
      },
    },
  },
};

export const OnPhone: Story = {
  render: (args) => <RoomLogoCoverDialogDemo {...args} />,
  decorators: [withPhoneFrame],
  globals: { viewport: { value: "mobile2", isRotated: false } },
  args: {
    ...Default.args,
    title: "Quarterly reports",
  },
  parameters: {
    docs: {
      description: {
        story:
          "On a phone the dialog becomes a full-screen panel, with the preview and the icons centred, and the plus button opens the colour picker in a modal of its own.",
      },
      source: {
        code: `<RoomLogoCoverDialog {...dialogProps} title="Quarterly reports" />`,
      },
      story: { inline: true },
    },
  },
};
