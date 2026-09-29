import type { ComponentProps } from "react";
import React, { useCallback, useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import type { TImage } from "../image-editor/ImageEditor.types";
import type { TTranslation } from "../../utils";
import { Button, ButtonSize } from "../button";

import { AvatarEditorDialog } from ".";

// The dialog takes its translator as a prop, so the stories pass the three English labels it asks for.
const LABELS: Record<string, string> = {
  "Common:SaveButton": "Save",
  "Common:CancelButton": "Cancel",
  "Common:ChooseAnother": "Choose another",
};
const t = ((key: string) => LABELS[key] ?? key) as TTranslation;

// A File, not a URL: the editor shows its zoom row only for a File.
const SAMPLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="640" viewBox="0 0 640 640"><rect width="640" height="640" fill="#9fc3e7"/><circle cx="460" cy="190" r="80" fill="#f5d67a"/><path d="M0 470 200 260 360 420 460 330 640 500V640H0Z" fill="#5b8f6a"/><path d="M0 560 180 430 340 540 500 450 640 540V640H0Z" fill="#3f6b4d"/></svg>`;
const createSampleImage = (): TImage => ({
  zoom: 1,
  x: 0.5,
  y: 0.5,
  uploadedFile: new File([SAMPLE_SVG], "landscape.svg", {
    type: "image/svg+xml",
  }),
});

const meta = {
  title: "UI/Overlays/AvatarEditorDialog",
  component: AvatarEditorDialog,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
    docs: {
      // The stories open a modal over the whole page, so inline they stack
      // on top of each other; on Docs each gets a document of its own.
      story: { inline: false, height: "760px" },
    },
  },
  argTypes: {
    t: {
      control: false,
      description:
        "Translation function; the dialog asks it for the save, cancel and choose-another labels",
    },
    visible: {
      control: "boolean",
      description: "Whether the dialog is on screen",
    },
    title: {
      control: "text",
      description: "Text of the dialog's header, shown as given",
    },
    image: {
      control: false,
      description:
        "The picture and its crop position and zoom, held by the caller; the body stays empty until it carries a file",
    },
    isLoading: {
      control: "boolean",
      description:
        "Shows a spinner on the save button and disables the editor and the cancel button; the header cross, Escape and the backdrop still close the dialog",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    editorBorderRadius: {
      control: "number",
      description:
        "Corner radius of the crop window in pixels on the editor's 648px canvas: 0 is a square, 324 a circle",
      table: {
        defaultValue: { summary: "110" },
      },
    },
    maxImageSize: {
      control: "number",
      description:
        "Deprecated and ignored; limit or compress the file in onChangeFile",
    },
    dataTestId: {
      control: "text",
      description: "Value of data-testid on the dialog",
    },
    onClose: {
      action: "onClose",
      description:
        "Called when the dialog is dismissed, after the image has been reset to an empty one",
    },
    onSave: {
      action: "onSave",
      description:
        "Called with the cropped image and its data: URL preview when Save is clicked; the dialog stays open",
    },
    onChangeImage: {
      action: "onChangeImage",
      description:
        "Called with a new image whenever the picture is dragged or zoomed; store it or nothing moves",
    },
    onChangeFile: {
      action: "onChangeFile",
      description:
        "Called with the change event of the file input when the user chooses another picture",
    },
  },
} satisfies Meta<typeof AvatarEditorDialog>;

type Story = StoryObj<ComponentProps<typeof AvatarEditorDialog>>;

export default meta;

type DemoProps = Partial<ComponentProps<typeof AvatarEditorDialog>>;

const AvatarEditorDialogDemo = ({
  visible,
  onClose,
  onSave,
  onChangeImage,
  onChangeFile,
  ...rest
}: DemoProps) => {
  const [isVisible, setIsVisible] = useState(!!visible);
  const [image, setImage] = useState<TImage>(createSampleImage);

  useEffect(() => {
    setIsVisible(!!visible);
  }, [visible]);

  const handleChangeImage = useCallback(
    (next: TImage) => {
      setImage(next);
      onChangeImage?.(next);
    },
    [onChangeImage],
  );

  const handleChangeFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChangeFile?.(e);
      const file = e.target.files?.[0];
      if (file) setImage((prev) => ({ ...prev, uploadedFile: file }));
    },
    [onChangeFile],
  );

  const open = () => {
    setImage(createSampleImage());
    setIsVisible(true);
  };

  return (
    <>
      <Button label="Open dialog" size={ButtonSize.small} onClick={open} />
      <AvatarEditorDialog
        {...rest}
        t={t}
        visible={isVisible}
        title={rest.title ?? ""}
        image={image}
        onClose={() => {
          onClose?.();
          setIsVisible(false);
        }}
        onSave={(cropped, preview) => {
          onSave?.(cropped, preview);
          setIsVisible(false);
        }}
        onChangeImage={handleChangeImage}
        onChangeFile={handleChangeFile}
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
  parameters: {
    docs: {
      description: {
        story:
          "The dialog as it opens on a chosen picture: drag the picture to frame it, zoom with the slider or the buttons, and press Save or Cancel. The story keeps the picture in its own state and closes the dialog from both handlers, as your code has to; reopen it with the button. Change any other prop live in the Controls panel below.",
      },
      source: {
        code: `const [visible, setVisible] = useState(true);
const [image, setImage] = useState<TImage>({
  zoom: 1,
  x: 0.5,
  y: 0.5,
  uploadedFile: file,
});

<AvatarEditorDialog
  t={t}
  visible={visible}
  title="Change avatar"
  image={image}
  onChangeImage={setImage}
  onChangeFile={handleChangeFile}
  onClose={() => setVisible(false)}
  onSave={(cropped, preview) => setVisible(false)}
/>`,
      },
    },
  },
};

export const Loading: Story = {
  render: (args) => <AvatarEditorDialogDemo {...args} />,
  args: {
    ...Default.args,
    isLoading: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "What the user sees while the cropped picture uploads: a spinner on Save and Cancel greyed out, while the picture no longer drags and the zoom row no longer responds (`isLoading`). The header cross, Escape and the backdrop still close the dialog, so guard `onClose` yourself if a close must wait for the upload.",
      },
      source: {
        code: `<AvatarEditorDialog
  t={t}
  visible
  title="Change avatar"
  image={image}
  isLoading={isUploading}
  onChangeImage={setImage}
  onChangeFile={handleChangeFile}
  onClose={() => {
    if (!isUploading) setVisible(false);
  }}
  onSave={handleSave}
/>`,
      },
    },
  },
};

export const SquareCrop: Story = {
  render: (args) => <AvatarEditorDialogDemo {...args} />,
  args: {
    ...Default.args,
    title: "Change cover",
    editorBorderRadius: 0,
  },
  parameters: {
    docs: {
      description: {
        story:
          "A crop window with square corners, for a picture that is not shown round, such as a logo or a cover (`editorBorderRadius` of 0). The radius is measured on the editor's 648px canvas: the default 110 gives rounded corners, 324 a circle.",
      },
      source: {
        code: `<AvatarEditorDialog
  t={t}
  visible
  title="Change cover"
  image={image}
  editorBorderRadius={0}
  onChangeImage={setImage}
  onChangeFile={handleChangeFile}
  onClose={handleClose}
  onSave={handleSave}
/>`,
      },
    },
  },
};
