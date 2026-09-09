import type { ComponentProps } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { useCallback, useState } from "react";

import type { TImage } from "./ImageEditor.types";

import "../../assets/selector.form.room.empty.screen.light.react.svg";
import { ImageEditor } from "./index";

const meta = {
  title: "UI/Interactive elements/ImageEditor",
  component: ImageEditor,
  parameters: {
    docs: {
      description: {
        component: `An image editor component that allows users to upload, crop, and zoom images.

### Features

- **Image Upload**: Upload images from the local filesystem
- **Crop & Zoom**: Crop and zoom uploaded images with interactive controls
- **Customizable Border Radius**: Configure editor border radius for square or circular crops
- **Max File Size**: Set a maximum allowed image file size
- **Image Rescaling**: Optionally disable image rescaling
- **Disabled State**: Disable the editor to prevent user interaction

### Usage

\`\`\`tsx
import { ImageEditor } from "@onlyoffice/apps-ui-kit/components/image-editor";

// Basic usage
<ImageEditor
  t={(key) => key}
  image={image}
  onChangeImage={handleChangeImage}
  onChangeFile={handleChangeFile}
/>

// Circular crop (profile avatar)
<ImageEditor
  t={(key) => key}
  image={image}
  onChangeImage={handleChangeImage}
  onChangeFile={handleChangeFile}
  editorBorderRadius={400}
/>

// With max image size and rescaling disabled
<ImageEditor
  t={(key) => key}
  image={image}
  onChangeImage={handleChangeImage}
  onChangeFile={handleChangeFile}
  maxImageSize={2097152}
  disableImageRescaling
/>
\`\`\``,
      },
    },
  },
  argTypes: {
    isDisabled: {
      control: "boolean",
      description: "Disable image editor",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    editorBorderRadius: {
      control: "number",
      description: "Border radius of the editor container in pixels",
      table: {
        defaultValue: { summary: "8" },
      },
    },
    disableImageRescaling: {
      control: "boolean",
      description: "Disable image rescaling",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    maxImageSize: {
      control: "number",
      description: "Maximum image size in bytes (default 1MB)",
      table: {
        defaultValue: { summary: "1048576" },
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
  maxImageSize,
}: {
  editorBorderRadius?: number;
  isDisabled?: boolean;
  disableImageRescaling?: boolean;
  maxImageSize?: number;
}) => {
  const [image, setImage] = useState<TImage>({
    uploadedFile:
      "../../assets/selector.form.room.empty.screen.light.react.svg",
    zoom: 0.5,
    x: 0.5,
    y: 0,
  });
  const [preview, setPreview] = useState<React.ReactNode>(null);

  const onChangeImage = useCallback((newImage: TImage) => {
    setImage(newImage);
  }, []);

  const onChangeFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.[0]) {
        const file = e.target.files[0];
        setImage((prev) => ({ ...prev, uploadedFile: file }));
      }
    },
    [],
  );

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
        maxImageSize={maxImageSize}
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
      maxImageSize={args.maxImageSize}
    />
  ),
  args: {
    isDisabled: false,
    disableImageRescaling: false,
    editorBorderRadius: 8,
    maxImageSize: 1048576,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Default image editor with standard rectangular crop area and default settings.",
      },
      source: {
        code: `<ImageEditor
  t={(key) => key}
  image={image}
  onChangeImage={handleChangeImage}
  onChangeFile={handleChangeFile}
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
      maxImageSize={args.maxImageSize}
    />
  ),
  args: {
    isDisabled: false,
    disableImageRescaling: false,
    editorBorderRadius: 400,
    maxImageSize: 1048576,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Image editor configured for profile avatar selection with a circular crop area (high border radius).",
      },
      source: {
        code: `<ImageEditor
  t={(key) => key}
  image={image}
  onChangeImage={handleChangeImage}
  onChangeFile={handleChangeFile}
  editorBorderRadius={400}
/>`,
      },
    },
  },
};
