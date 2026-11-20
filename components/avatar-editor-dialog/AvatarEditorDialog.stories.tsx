import type { ComponentProps } from "react";
import React, { useCallback, useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen, waitFor, within } from "storybook/test";

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
        "Translation function, asked for `Common:SaveButton`, `Common:CancelButton` and `Common:ChooseAnother`.",
    },
    visible: {
      control: "boolean",
      description:
        "Puts the dialog on screen; while false it stays mounted but hidden.",
    },
    title: {
      control: "text",
      description:
        "Text of the dialog's header, and its accessible name. It is not translated for you.",
    },
    image: {
      control: false,
      description:
        "The picture and its crop, held in your state. The body is empty until `uploadedFile` is set.",
    },
    isLoading: {
      control: "boolean",
      description:
        "Puts the save button in its loading state and blocks the editor and every way to close the dialog.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    editorBorderRadius: {
      control: "number",
      description:
        "Corner radius of the crop window in pixels, on the editor's 648px canvas.",
      table: {
        defaultValue: { summary: "110" },
      },
    },
    maxImageSize: {
      control: "number",
      description:
        "Ignored. It is handed to the image editor, which does not read it either; check the file's size in `onChangeFile`.",
    },
    dataTestId: {
      control: "text",
      description: "Value of `data-testid` on the dialog.",
    },
    onClose: {
      action: "onClose",
      description:
        "Called on every way out, after the dialog has reset `image` to an empty, centred, unzoomed one.",
    },
    onSave: {
      action: "onSave",
      description:
        "Called with the cropped `image` and its `data:` URL preview when save is clicked. The dialog neither closes itself nor sets `isLoading`.",
    },
    onChangeImage: {
      action: "onChangeImage",
      description:
        "Called with a new `image` whenever the crop is dragged or the zoom changes. Apply it to your state or nothing moves.",
    },
    onChangeFile: {
      action: "onChangeFile",
      description:
        "Called with the change event of the hidden file input when another picture is chosen. Read the file and put it in `image.uploadedFile` yourself.",
    },
  },
  args: {
    onClose: fn(),
    onSave: fn(),
    onChangeImage: fn(),
    onChangeFile: fn(),
  },
} satisfies Meta<typeof AvatarEditorDialog>;

type Story = StoryObj<ComponentProps<typeof AvatarEditorDialog>>;

export default meta;

type DemoProps = Partial<ComponentProps<typeof AvatarEditorDialog>>;

// The dialog is portalled and stays mounted while closed.
const dialog = () => screen.getByTestId("modal-dialog");

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
  name: "Default",
  render: (args) => <AvatarEditorDialogDemo {...args} />,
  args: {
    visible: true,
    title: "Change avatar",
    editorBorderRadius: 110,
  },
  play: async ({ args, canvas, userEvent }) => {
    await waitFor(() => expect(dialog()).toBeVisible());
    const modal = within(dialog());
    await expect(modal.getByText("Change avatar")).toBeVisible();

    // The zoom buttons change the image through onChangeImage.
    const slider = await waitFor(() => modal.getByRole("slider"));
    await userEvent.click(modal.getByTestId("zoom_in_icon_button"));
    await waitFor(() => expect(slider).toHaveValue("1.5"));
    await expect(args.onChangeImage).toHaveBeenLastCalledWith(
      expect.objectContaining({ zoom: 1.5 }),
    );

    // Save hands over the image and the cropped preview.
    await userEvent.click(modal.getByRole("button", { name: "Save" }));
    await expect(args.onSave).toHaveBeenCalledWith(
      expect.objectContaining({ zoom: 1.5 }),
      expect.stringMatching(/^data:image\//),
    );
    await waitFor(() => expect(dialog()).not.toBeVisible());

    // Cancel clears the image and closes.
    await userEvent.click(canvas.getByRole("button", { name: "Open dialog" }));
    await waitFor(() => expect(dialog()).toBeVisible());
    await userEvent.click(
      within(dialog()).getByRole("button", { name: "Cancel" }),
    );
    await expect(args.onClose).toHaveBeenCalledTimes(1);
    await expect(args.onChangeImage).toHaveBeenLastCalledWith(
      expect.objectContaining({ uploadedFile: undefined, zoom: 1 }),
    );
    await waitFor(() => expect(dialog()).not.toBeVisible());
  },
  parameters: {
    docs: {
      description: {
        story:
          "The dialog open on a chosen picture: the crop window, the zoom row, and Save and Cancel below. The story keeps the picture in its own state and closes the dialog from both handlers, as your code has to.",
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
  name: "Saving",
  render: (args) => <AvatarEditorDialogDemo {...args} />,
  args: {
    ...Default.args,
    isLoading: true,
  },
  play: async ({ args, userEvent }) => {
    await waitFor(() => expect(dialog()).toBeVisible());
    const modal = within(dialog());
    // Nothing closes the dialog, and so resets the image, mid-upload.
    await userEvent.keyboard("{Escape}");
    await expect(args.onClose).not.toHaveBeenCalled();
    await expect(dialog()).toBeVisible();
    // The editor and Cancel are locked while the upload runs.
    await expect(modal.getByRole("button", { name: "Cancel" })).toBeDisabled();
    await expect(await waitFor(() => modal.getByRole("slider"))).toBeDisabled();
    await expect(modal.getByTestId("image-cropper")).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "The dialog while the picture uploads: a spinner on Save, with Cancel and the zoom row disabled and no header cross. Neither Escape nor the backdrop closes it.",
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
  name: "Square crop",
  render: (args) => <AvatarEditorDialogDemo {...args} />,
  args: {
    ...Default.args,
    title: "Change cover",
    editorBorderRadius: 0,
  },
  play: async () => {
    await waitFor(() => expect(dialog()).toBeVisible());
    await expect(within(dialog()).getByText("Change cover")).toBeVisible();
    await expect(
      within(dialog()).getByTestId("image-cropper").querySelector("canvas"),
    ).not.toBeNull();
  },
  parameters: {
    docs: {
      description: {
        story:
          "A crop window with square corners, for a logo or a cover, from `editorBorderRadius` of 0. On the 648px canvas, 110 gives rounded corners and 324 a circle.",
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
