import type { ComponentProps } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor } from "storybook/test";

import { useCallback, useEffect, useState } from "react";

import type { TImage } from "./ImageEditor.types";

import SelectorPreviewSvgUrl from "../../assets/selector.form.room.empty.screen.light.react.svg?url";
import DefaultUserPhotoUrl from "../../assets/default_user_photo_size_82-82.png";
import { ImageEditor } from "./index";

const meta = {
  title: "UI/Interactive elements/ImageEditor",
  component: ImageEditor,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
  },
  argTypes: {
    t: {
      control: false,
      description:
        "Translation function, asked for the replace control's label, `Common:ChooseAnother`.",
    },
    image: {
      control: false,
      description:
        "The picture and its crop, held in your state. The whole editor renders nothing while `uploadedFile` is empty.",
    },
    onChangeImage: {
      control: false,
      description:
        "Called with a new `image` whenever the crop is dragged or the zoom changes. Apply it to your state or nothing moves.",
    },
    onChangeFile: {
      control: false,
      description:
        "Called with the change event of the hidden file input when another picture is chosen. Read the file and put it in `image.uploadedFile` yourself.",
    },
    Preview: {
      control: false,
      description:
        "Rendered beside the cropper, inside the wrapper that `classNameWrapperImageCropper` names: the place for a preview of the cropped result.",
    },
    setPreview: {
      control: false,
      description:
        "Called, at most every 300ms, with the cropped picture as a `data:` URL. A canvas tainted by a cross-origin image makes it stop silently.",
    },
    isDisabled: {
      control: "boolean",
      description:
        "Blocks dragging, zooming and the replace control's file dialog. Pass `false` when nothing is in flight.",
    },
    editorBorderRadius: {
      control: "number",
      description:
        "Corner radius of the crop window in pixels, measured on the 648px canvas. Half of it, 324, is a circle.",
    },
    disableImageRescaling: {
      control: "boolean",
      description:
        "Hides the zoom row and freezes the crop position, leaving the picture as it is.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    className: {
      control: "text",
      description: "Added to the outer element.",
    },
    classNameWrapperImageCropper: {
      control: "text",
      description:
        "Added to the element that wraps the cropper and `Preview`. It is the hook for laying those two out side by side.",
    },
    maxImageSize: {
      control: "number",
      description:
        "Ignored. Nothing in this folder reads it; check the file's size in `onChangeFile` instead.",
      table: {
        defaultValue: { summary: "undefined" },
      },
    },
  },
} satisfies Meta<typeof ImageEditor>;

type Story = StoryObj<ComponentProps<typeof ImageEditor>>;

export default meta;

type PlayContext = Parameters<NonNullable<Story["play"]>>[0];

// The zoom row appears once the picture has been loaded as a File.
const zoomSlider = ({ canvas }: PlayContext) =>
  waitFor(() => canvas.getByRole("slider"));

const ImageEditorDemo = ({
  editorBorderRadius,
  isDisabled,
  disableImageRescaling,
  asFile,
}: {
  editorBorderRadius?: number;
  isDisabled?: boolean;
  disableImageRescaling?: boolean;
  asFile?: boolean;
}) => {
  const [image, setImage] = useState<TImage>({
    uploadedFile: SelectorPreviewSvgUrl,
    zoom: 0.5,
    x: 0.5,
    y: 0,
  });
  const [preview, setPreview] = useState<React.ReactNode>(null);

  // The zoom row appears only for a File, so load the bundled picture as one.
  useEffect(() => {
    if (!asFile) return;
    fetch(SelectorPreviewSvgUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], "picture.svg", { type: blob.type });
        setImage({ uploadedFile: file, zoom: 1, x: 0.5, y: 0.5 });
      });
  }, [asFile]);

  const onChangeImage = useCallback((newImage: TImage) => {
    setImage(newImage);
  }, []);

  const onChangeFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setImage((prev) => ({ ...prev, uploadedFile: file }));
    }
  }, []);

  const handleSetPreview = useCallback((value: string) => {
    // Sized, as the README's example is: the data URL is the 648px canvas
    // times the device pixel ratio, and an unsized <img> shows all of it.
    setPreview(
      value ? <img src={value} alt="Preview" width={96} height={96} /> : null,
    );
  }, []);

  return (
    <div style={{ width: "100%", maxWidth: "800px" }}>
      <ImageEditor
        t={() => "choose another image"}
        image={image}
        onChangeImage={onChangeImage}
        onChangeFile={onChangeFile}
        Preview={preview}
        setPreview={handleSetPreview}
        editorBorderRadius={editorBorderRadius ?? 0}
        isDisabled={isDisabled ?? false}
        disableImageRescaling={disableImageRescaling}
      />
    </div>
  );
};

export const Default: Story = {
  name: "Default",
  render: (args) => (
    <ImageEditorDemo
      editorBorderRadius={args.editorBorderRadius}
      isDisabled={args.isDisabled}
      disableImageRescaling={args.disableImageRescaling}
    />
  ),
  args: {
    isDisabled: false,
    disableImageRescaling: false,
    editorBorderRadius: 8,
  },
  play: async ({ canvas, canvasElement, userEvent }) => {
    await expect(
      canvas.getByRole("region", { name: "Image editor" }),
    ).toBeVisible();
    await expect(canvas.getByTestId("change_image_button")).toHaveTextContent(
      "choose another image",
    );
    // A URL source has no zoom row; the crop is reported as a preview.
    await expect(canvas.queryByRole("slider")).toBeNull();
    await waitFor(() =>
      expect(canvas.getByRole("img", { name: "Preview" })).toBeVisible(),
    );

    // Choosing another image loads it as a File, which brings the zoom row.
    const input = canvasElement.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    const blob = await (await fetch(DefaultUserPhotoUrl)).blob();
    await userEvent.upload(
      input,
      new File([blob], "photo.png", { type: "image/png" }),
    );
    await waitFor(() => expect(canvas.getByRole("slider")).toBeVisible());
  },
  parameters: {
    docs: {
      description: {
        story:
          "A picture in a square window with slightly rounded corners, for a logo or a cover. The picture is a URL, not a `File`, so there is no zoom row.",
      },
      source: {
        code: `<ImageEditor
  t={(key) => key}
  image={image}
  onChangeImage={handleChangeImage}
  onChangeFile={handleChangeFile}
  Preview={preview}
  setPreview={handleSetPreview}
  isDisabled={false}
  editorBorderRadius={8}
/>`,
      },
    },
  },
};

export const ProfileAvatar: Story = {
  name: "Round crop",
  render: (args) => (
    <ImageEditorDemo
      editorBorderRadius={args.editorBorderRadius}
      isDisabled={args.isDisabled}
      disableImageRescaling={args.disableImageRescaling}
    />
  ),
  args: {
    isDisabled: false,
    disableImageRescaling: false,
    editorBorderRadius: 400,
  },
  play: async ({ canvas }) => {
    const cropper = canvas.getByTestId("image-cropper");
    await expect(cropper.querySelector("canvas")).not.toBeNull();
    await waitFor(() =>
      expect(canvas.getByRole("img", { name: "Preview" })).toBeVisible(),
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "A round crop window, the usual shape for a profile picture. An `editorBorderRadius` of half the 648px canvas or more makes a circle.",
      },
      source: {
        code: `<ImageEditor
  t={(key) => key}
  image={image}
  onChangeImage={handleChangeImage}
  onChangeFile={handleChangeFile}
  Preview={preview}
  setPreview={handleSetPreview}
  isDisabled={false}
  editorBorderRadius={400}
/>`,
      },
    },
  },
};

const fileSource = (extra: string) => `<ImageEditor
  t={(key) => key}
  image={{ uploadedFile: file, zoom: 1, x: 0.5, y: 0.5 }}
  onChangeImage={handleChangeImage}
  onChangeFile={handleChangeFile}
  Preview={preview}
  setPreview={handleSetPreview}
  editorBorderRadius={8}
${extra}
/>`;

export const WithZoomControls: Story = {
  name: "With zoom controls",
  render: (args) => (
    <ImageEditorDemo
      editorBorderRadius={args.editorBorderRadius}
      isDisabled={args.isDisabled}
      disableImageRescaling={args.disableImageRescaling}
      asFile
    />
  ),
  args: {
    isDisabled: false,
    disableImageRescaling: false,
    editorBorderRadius: 8,
  },
  play: async (context) => {
    const { canvas, userEvent } = context;
    const slider = await zoomSlider(context);
    await expect(slider).toHaveValue("1");
    // The buttons step the zoom by half.
    await userEvent.click(canvas.getByTestId("zoom_in_icon_button"));
    await waitFor(() => expect(slider).toHaveValue("1.5"));
    await userEvent.click(canvas.getByTestId("zoom_out_icon_button"));
    await waitFor(() => expect(slider).toHaveValue("1"));
  },
  parameters: {
    docs: {
      description: {
        story:
          "A picture given as a `File` gets a zoom row under the replace control. The slider zooms from 1x to 5x in fine steps, and the buttons by 0.5.",
      },
      source: {
        code: fileSource("  isDisabled={false}"),
      },
    },
  },
};

export const DisabledState: Story = {
  name: "Disabled",
  render: (args) => (
    <ImageEditorDemo
      editorBorderRadius={args.editorBorderRadius}
      isDisabled={args.isDisabled}
      disableImageRescaling={args.disableImageRescaling}
      asFile
    />
  ),
  args: {
    isDisabled: true,
    disableImageRescaling: false,
    editorBorderRadius: 8,
  },
  play: async (context) => {
    const { canvas } = context;
    const slider = await zoomSlider(context);
    await expect(canvas.getByTestId("image-cropper")).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    await expect(slider).toBeDisabled();
    await expect(canvas.getByTestId("zoom_in_icon_button")).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    await expect(slider).toHaveValue("1");
  },
  parameters: {
    docs: {
      description: {
        story:
          "The editor while a save is in flight: the zoom row is greyed out and the picture no longer drags. Choose another opens no file dialog.",
      },
      source: {
        code: fileSource("  isDisabled"),
      },
    },
  },
};

export const FixedFraming: Story = {
  name: "Fixed framing",
  render: (args) => (
    <ImageEditorDemo
      editorBorderRadius={args.editorBorderRadius}
      isDisabled={args.isDisabled}
      disableImageRescaling={args.disableImageRescaling}
      asFile
    />
  ),
  args: {
    isDisabled: false,
    disableImageRescaling: true,
    editorBorderRadius: 8,
  },
  play: async ({ canvas }) => {
    // Even a File gets no zoom row: the framing is fixed.
    await waitFor(() =>
      expect(canvas.getByRole("img", { name: "Preview" })).toBeVisible(),
    );
    await expect(canvas.queryByRole("slider")).toBeNull();
  },
  parameters: {
    docs: {
      description: {
        story:
          "The same `File` with its framing locked by `disableImageRescaling`: no zoom row, and dragging leaves the picture where it is.",
      },
      source: {
        code: fileSource("  isDisabled={false}\n  disableImageRescaling"),
      },
    },
  },
};
