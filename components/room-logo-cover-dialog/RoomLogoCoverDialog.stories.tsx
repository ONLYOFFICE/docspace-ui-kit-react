import type { ComponentProps } from "react";
import { useEffect, useState } from "react";
import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen, waitFor, within } from "storybook/test";

import type { TTranslation } from "../../utils";
import type { ICover } from "../../types";
import type { TColorScheme } from "../../providers/theme/themes";
import { Button, ButtonSize } from "../button";

import enCommon from "../../locales/en/Common.json";

import { RoomLogoCoverDialog } from ".";

// The dialog takes its translator as a prop rather than using the hook, so
// the stories hand it the kit's own English bundle: every key it asks for is
// in `Common`.
const common = enCommon as Record<string, string>;
const t = ((key: string) =>
  common[key.replace(/^Common:/, "")] ?? key) as TTranslation;

// The 56 covers the portal serves from `files/rooms/covers`, copied from the
// server (products/ASC.Files/Core/Covers/default). `data` is the inline SVG
// markup, which is what that endpoint returns.
const coverFiles = import.meta.glob<string>(
  "../../test/fixtures/room-covers/*.svg",
  { query: "?raw", import: "default", eager: true },
);

const covers: ICover[] = Object.entries(coverFiles)
  .map(([path, data]) => ({
    id: path.replace(/^.*\//, "").replace(/\.svg$/, ""),
    data,
  }))
  .sort((a, b) => a.id.localeCompare(b.id));

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
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
    docs: {
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
        "Translation function for the heading, the buttons and the picker labels, all `Common` keys the kit ships.",
    },
    visible: {
      control: "boolean",
      description:
        "Whether the dialog is on screen. Opening it remounts the picker, which discards whatever was chosen last time.",
    },
    covers: {
      control: false,
      description:
        "The cover icons to offer. Each carries raw SVG markup that is injected into the page, so take them only from a source you trust. An empty array leaves the icon picker out.",
    },
    title: {
      control: "text",
      description:
        "Room title, used for the initials drawn on the preview when no icon is chosen.",
      table: { defaultValue: { summary: '""' } },
    },
    initialColor: {
      control: "text",
      description:
        "Colour selected when the dialog opens, as `#rrggbb`. Defaults to the first of the kit's logo colours.",
      table: { defaultValue: { summary: "#FF6680" } },
    },
    initialCover: {
      control: false,
      description:
        "Cover selected when the dialog opens, or `null` for the initials.",
      table: { defaultValue: { summary: "null" } },
    },
    isBaseTheme: {
      control: "boolean",
      description:
        "Whether the preview is drawn for the light theme. Taken from the theme context when it is not passed.",
      table: { defaultValue: { summary: "from the theme" } },
    },
    currentColorScheme: {
      control: "object",
      description:
        "The portal's accent colours, used to tint the hovered and selected icon. Without it those states have no accent.",
    },
    onClose: {
      action: "onClose",
      description:
        "Called by the cancel button, the header cross, Escape and the backdrop — but not while the colour picker is open, which swallows all four.",
    },
    onApply: {
      action: "onApply",
      description:
        "Called with the chosen colour and cover when apply is clicked. The dialog does not close itself.",
    },
  },
} satisfies Meta<typeof RoomLogoCoverDialog>;

type Story = StoryObj<ComponentProps<typeof RoomLogoCoverDialog>>;

export default meta;

// The dialog is portalled and stays mounted while closed.
const dialog = async () => {
  const element = screen.getByTestId("room_logo_cover_dialog");
  const content = within(element).getByTestId("modal-dialog");
  await waitFor(() => expect(content).toBeVisible());
  return within(content);
};

const dialogClosed = () =>
  waitFor(() =>
    expect(
      within(screen.getByTestId("room_logo_cover_dialog")).getByTestId(
        "modal-dialog",
      ),
    ).not.toBeVisible(),
  );

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
  name: "Default",
  render: (args) => <RoomLogoCoverDialogDemo {...args} />,
  args: {
    visible: true,
    isBaseTheme: true,
  },
  play: async ({ args, userEvent }) => {
    const modal = await dialog();
    await expect(modal.getByText("Room cover")).toBeVisible();
    // The first colour is chosen to begin with.
    await expect(modal.getByTestId("color_item_selected_0")).toBeVisible();

    await userEvent.click(modal.getByTestId("color_item_3"));
    await expect(modal.getByTestId("color_item_selected_3")).toBeVisible();
    await userEvent.click(modal.getByTestId("room_logo_cover_icon_2"));
    await userEvent.click(modal.getByRole("button", { name: "Apply" }));
    await expect(args.onApply).toHaveBeenCalledWith(
      "#61C059",
      expect.objectContaining({ id: covers[2].id }),
    );
    await dialogClosed();
  },
  parameters: {
    docs: {
      description: {
        story:
          "The dialog as it opens for a room with no logo yet: the first preset colour, no icon and no title. Apply and cancel close it, and the button behind reopens it.",
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
  name: "Room with a logo",
  render: (args) => <RoomLogoCoverDialogDemo {...args} />,
  args: {
    ...Default.args,
    initialCover: covers[1],
    initialColor: "#4781D1",
  },
  play: async ({ args, userEvent }) => {
    const modal = await dialog();
    // A colour outside the palette shows as the custom one.
    await expect(modal.getByTestId("color_item_custom_selected")).toBeVisible();
    await expect(modal.getByTestId("room_logo_cover_icon_1").className).toMatch(
      /isSelected/,
    );
    // Applying unchanged returns the preset.
    await userEvent.click(modal.getByRole("button", { name: "Apply" }));
    await expect(args.onApply).toHaveBeenCalledWith(
      "#4781D1",
      expect.objectContaining({ id: covers[1].id }),
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "The dialog for a room that already has a logo: its icon is on the tile (`initialCover`). Its colour is not a preset, so it sits after them as a swatch with a pencil (`initialColor`).",
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
  name: "Initials from the title",
  render: (args) => <RoomLogoCoverDialogDemo {...args} />,
  args: {
    ...Default.args,
    title: "Quarterly reports",
  },
  play: async ({ userEvent }) => {
    const modal = await dialog();
    const preview = (
      await waitFor(() => modal.getByText("Room cover"))
    ).closest('[data-testid="modal-dialog"]') as HTMLElement;
    const logo = preview.querySelector(".room-logo-container") as HTMLElement;
    // Without an icon the preview shows the title's initials.
    await expect(logo).toHaveTextContent("QR");
    // An icon replaces them.
    await userEvent.click(modal.getByTestId("room_logo_cover_icon_0"));
    await waitFor(() => expect(logo).not.toHaveTextContent("QR"));
  },
  parameters: {
    docs: {
      description: {
        story:
          "With no icon chosen the tile carries the room's initials, here QR for a room called Quarterly reports (`title`). A chosen icon replaces them; the without-icon chip brings them back.",
      },
      source: {
        code: `<RoomLogoCoverDialog {...dialogProps} title="Quarterly reports" />`,
      },
    },
  },
};

export const WithAccentColors: Story = {
  name: "Accent colours",
  render: (args) => <RoomLogoCoverDialogDemo {...args} />,
  args: {
    ...Default.args,
    initialCover: covers[1],
    currentColorScheme: accentScheme,
  },
  play: async () => {
    const modal = await dialog();
    // The selected icon is tinted with the accent.
    const selected = modal.getByTestId("room_logo_cover_icon_1");
    await expect(selected.style.getPropertyValue("--icon-selected-bg")).toBe(
      "rgb(71 129 209 / 20%)",
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "The chosen icon on a tint of the portal's accent colour (`currentColorScheme`). Without a colour scheme the chosen icon looks like the rest.",
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
  name: "Colour only",
  render: (args) => <RoomLogoCoverDialogDemo {...args} covers={[]} />,
  args: {
    ...Default.args,
    title: "Quarterly reports",
  },
  play: async ({ args, userEvent }) => {
    const modal = await dialog();
    await expect(
      modal.queryByTestId("room_logo_cover_without_icon"),
    ).toBeNull();
    await expect(modal.queryByTestId("room_logo_cover_icon_0")).toBeNull();
    await userEvent.click(modal.getByRole("button", { name: "Cancel" }));
    await expect(args.onClose).toHaveBeenCalledTimes(1);
    await dialogClosed();
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
  name: "On a phone",
  render: (args) => <RoomLogoCoverDialogDemo {...args} />,
  decorators: [withPhoneFrame],
  globals: { viewport: { value: "mobile2", isRotated: false } },
  args: {
    ...Default.args,
    title: "Quarterly reports",
  },
  play: async ({ args, userEvent }) => {
    const modal = await dialog();
    await userEvent.click(modal.getByTestId("color_item_1"));
    await userEvent.click(modal.getByRole("button", { name: "Apply" }));
    await expect(args.onApply).toHaveBeenCalledWith("#FF8F40", null);
  },
  parameters: {
    docs: {
      description: {
        story:
          "At a phone width the dialog opens as a side panel. Its plus button opens the colour picker in a modal of its own.",
      },
      source: {
        code: `<RoomLogoCoverDialog {...dialogProps} title="Quarterly reports" />`,
      },
      story: { inline: true },
    },
  },
};
