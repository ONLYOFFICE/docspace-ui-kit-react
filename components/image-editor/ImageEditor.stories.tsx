// (c) Copyright Ascensio System SIA 2009-2026
//
// This program is a free software product.
// You can redistribute it and/or modify it under the terms
// of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
// Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
// to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
// any third-party rights.
//
// This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
// the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
//
// You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
//
// The  interactive user interfaces in modified source and object code versions of the Program must
// display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
//
// Pursuant to Section 7(b) of the License you must retain the original Product logo when
// distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
// trademark law for use of our trademarks.
//
// All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
// content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
// International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode

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
import { ImageEditor } from "@docspace/ui-kit/components/image-editor";

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
