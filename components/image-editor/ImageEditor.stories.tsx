import type { ComponentProps } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { useCallback, useEffect, useState } from "react";

import type { TImage } from "./ImageEditor.types";

import SelectorPreviewSvgUrl from "../../assets/selector.form.room.empty.screen.light.react.svg?url";
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
        "Translation function; the editor asks it for the Choose another label (`Common:ChooseAnother`)",
    },
    image: {
      control: false,
      description:
        "The picture (a `File` or a URL) with its zoom and crop position, held in your state; the editor renders nothing while the picture is empty",
    },
    onChangeImage: {
      control: false,
      description:
        "Called with a new `image` whenever the picture is dragged or zoomed; apply it to your state or nothing moves",
    },
    onChangeFile: {
      control: false,
      description:
        "Called with the change event of the hidden file input when another picture is chosen; put the file into `image` yourself",
    },
    Preview: {
      control: false,
      description:
        "Content rendered below the cropper, in the same wrapper, such as a preview of the cropped result",
    },
    setPreview: {
      control: false,
      description:
        "Called at most every 300ms with the cropped picture as a `data:` URL",
    },
    isDisabled: {
      control: "boolean",
      description:
        "Blocks dragging, zooming and choosing another file, and greys out the zoom row; required, so pass `false` when idle",
    },
    editorBorderRadius: {
      control: "number",
      description:
        "Corner radius of the crop window in pixels, measured on the 648px canvas shown at 368px; 324 or more makes a circle",
    },
    disableImageRescaling: {
      control: "boolean",
      description:
        "Hides the zoom row and freezes the crop position, leaving the picture framed as it is",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    className: {
      control: "text",
      description: "Class added to the outer element",
    },
    classNameWrapperImageCropper: {
      control: "text",
      description:
        "Class added to the element that wraps the cropper and `Preview`, for laying the two out side by side",
    },
    maxImageSize: {
      control: "number",
      description:
        "Deprecated, has no effect. Size limits and compression are the caller's job, in onChangeFile",
      table: {
        defaultValue: { summary: "undefined" },
      },
    },
  },
} satisfies Meta<typeof ImageEditor>;

type Story = StoryObj<ComponentProps<typeof ImageEditor>>;

export default meta;

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
    setPreview(value ? <img src={value} alt="Preview" /> : null);
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
  parameters: {
    docs: {
      description: {
        story:
          "A picture framed in a square window with slightly rounded corners, the starting point for a logo or a cover. Drag the picture to reframe it; the zoom row stays hidden because the picture is given as a URL, not a `File`. Change any other prop live in the Controls panel below.",
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
  parameters: {
    docs: {
      description: {
        story:
          "A round crop window, the shape a profile picture is usually cut to: any radius of half the 648px canvas or more (`editorBorderRadius`) turns the square into a circle.",
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
  parameters: {
    docs: {
      description: {
        story:
          "A picture given as a `File`, the way it arrives from a file input, gets the zoom row under the Choose another control: the slider zooms from 1x to 5x in fine steps, the minus and plus buttons by half a step each, and the preview below follows the crop (`setPreview`).",
      },
      source: {
        code: fileSource("  isDisabled={false}"),
      },
    },
  },
};

export const DisabledState: Story = {
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
  parameters: {
    docs: {
      description: {
        story:
          "The editor while a save is in flight: the zoom row is greyed out, the picture no longer drags and Choose another opens no picker (`isDisabled`).",
      },
      source: {
        code: fileSource("  isDisabled"),
      },
    },
  },
};

export const FixedFraming: Story = {
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
  parameters: {
    docs: {
      description: {
        story:
          "The same `File` with its framing locked: the zoom row is gone and dragging leaves the picture where it is, while Choose another still replaces it (`disableImageRescaling`).",
      },
      source: {
        code: fileSource("  isDisabled={false}\n  disableImageRescaling"),
      },
    },
  },
};
