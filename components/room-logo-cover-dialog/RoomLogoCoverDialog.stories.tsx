import type { ComponentProps } from "react";
import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import type { TTranslation } from "../../utils";
import type { ICover } from "../../types";
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

const meta = {
  title: "UI/Overlays/RoomLogoCoverDialog",
  component: RoomLogoCoverDialog,
  parameters: {
    docs: {
      description: {
        component: `Dialog for choosing a room cover: a colour plus an optional glyph.

### Features

- **Colour selection**: picks from the palette, or a custom colour
- **Cover selection**: an optional glyph drawn over the colour; none is a valid choice
- **Live preview**: shows the resulting room logo as the selection changes
- **Theme aware**: \`isBaseTheme\` and \`currentColorScheme\` align the preview with the portal theme

### Usage

Controlled: the caller owns \`visible\` and receives the result through \`onApply(color, cover)\`. The stories below own that state and expose a button to reopen the dialog.`,
      },
    },
  },
  argTypes: {
    visible: { control: "boolean", description: "Whether the dialog is open" },
    title: { control: "text", description: "Optional heading override" },
    initialColor: { control: "text", description: "Colour selected on open" },
    isBaseTheme: {
      control: "boolean",
      description: "Renders the preview for the light theme",
    },
  },
} satisfies Meta<typeof RoomLogoCoverDialog>;

type Story = StoryObj<ComponentProps<typeof RoomLogoCoverDialog>>;

export default meta;

type DemoProps = Pick<
  ComponentProps<typeof RoomLogoCoverDialog>,
  "visible" | "title" | "initialColor" | "initialCover" | "isBaseTheme"
>;

const RoomLogoCoverDialogDemo = ({ visible, ...rest }: DemoProps) => {
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
        covers={covers}
        onClose={() => setIsVisible(false)}
        onApply={() => setIsVisible(false)}
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
};

export const WithPreselectedCover: Story = {
  render: (args) => <RoomLogoCoverDialogDemo {...args} />,
  args: {
    ...Default.args,
    initialCover: covers[1],
    initialColor: "#4781D1",
  },
};

export const CustomTitle: Story = {
  render: (args) => <RoomLogoCoverDialogDemo {...args} />,
  args: {
    ...Default.args,
    title: "Choose a template cover",
  },
};
