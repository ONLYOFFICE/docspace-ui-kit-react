import type { ComponentProps } from "react";
import React, { useCallback, useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import type { TImage } from "../image-editor/ImageEditor.types";
import type { TTranslation } from "../../utils";
import { Button, ButtonSize } from "../button";

import { AvatarEditorDialog } from ".";

// The dialog takes its translator as a prop rather than using the hook, so the
// stories supply a stub that echoes the key -- enough to show which label is
// which without wiring i18n into Storybook.
const t = ((key: string) => key.replace("Common:", "")) as TTranslation;

const meta = {
  title: "UI/Overlays/AvatarEditorDialog",
  component: AvatarEditorDialog,
  parameters: {
    docs: {
      description: {
        component: `Modal wrapper around the image editor for choosing and cropping an avatar.

### Features

- **Crop and zoom**: hosts \`ImageEditor\`, keeping zoom and offset in the \`image\` value
- **Circular or square crop**: \`editorBorderRadius\` selects the mask
- **Size limit**: \`maxImageSize\` rejects oversized uploads
- **Loading state**: \`isLoading\` disables the save action while the upload is in flight

### Usage

Controlled: the caller owns \`visible\` and the \`image\` value, and receives the cropped result through \`onSave\`. The stories below own that state and expose a button to reopen the dialog after it closes.`,
      },
    },
  },
  argTypes: {
    visible: { control: "boolean", description: "Whether the dialog is open" },
    title: { control: "text", description: "Dialog heading" },
    isLoading: {
      control: "boolean",
      description: "Disables saving while busy",
    },
    editorBorderRadius: {
      control: "number",
      description: "Crop mask radius; 110 gives a circle at the default size",
    },
  },
} satisfies Meta<typeof AvatarEditorDialog>;

type Story = StoryObj<ComponentProps<typeof AvatarEditorDialog>>;

export default meta;

type DemoProps = Pick<
  ComponentProps<typeof AvatarEditorDialog>,
  "visible" | "title" | "isLoading" | "editorBorderRadius" | "maxImageSize"
>;

const AvatarEditorDialogDemo = ({ visible, ...rest }: DemoProps) => {
  const [isVisible, setIsVisible] = useState(!!visible);
  const [image, setImage] = useState<TImage>({ zoom: 1, x: 0.5, y: 0.5 });

  useEffect(() => {
    setIsVisible(!!visible);
  }, [visible]);

  const onChangeImage = useCallback((next: TImage) => setImage(next), []);

  const onChangeFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImage((prev) => ({ ...prev, uploadedFile: file }));
  }, []);

  return (
    <>
      <Button
        label="Open dialog"
        size={ButtonSize.small}
        onClick={() => setIsVisible(true)}
      />
      <AvatarEditorDialog
        {...rest}
        t={t}
        visible={isVisible}
        image={image}
        onClose={() => setIsVisible(false)}
        onSave={() => setIsVisible(false)}
        onChangeImage={onChangeImage}
        onChangeFile={onChangeFile}
      />
    </>
  );
};

export const Default: Story = {
  render: (args) => <AvatarEditorDialogDemo {...args} />,
  args: {
    visible: true,
    title: "Change avatar",
    editorBorderRadius: 110,
  },
};

export const Loading: Story = {
  render: (args) => <AvatarEditorDialogDemo {...args} />,
  args: {
    ...Default.args,
    isLoading: true,
  },
};

export const SquareCrop: Story = {
  render: (args) => <AvatarEditorDialogDemo {...args} />,
  args: {
    ...Default.args,
    title: "Change cover",
    editorBorderRadius: 0,
  },
};
