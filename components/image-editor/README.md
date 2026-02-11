# ImageEditor

A component for uploading, cropping, and previewing images. Combines an image cropper with zoom controls and a preview tile. Commonly used for editing user avatars and room logos.

## Usage

```tsx
import { ImageEditor } from "@docspace/ui-kit/components/image-editor";

<ImageEditor
  t={t}
  image={{ uploadedFile: file, zoom: 1, x: 0, y: 0 }}
  onChangeImage={handleChangeImage}
  Preview={<AvatarPreview src={previewSrc} />}
  setPreview={setPreviewSrc}
  isDisabled={false}
  editorBorderRadius={50}
  onChangeFile={handleFileChange}
/>
```

## Features

- **Image cropping**: Drag-to-reposition with zoom slider
- **Live preview**: Real-time preview tile alongside the cropper
- **Delete button**: `ButtonDelete` sub-component for removing the uploaded image
- **Configurable border radius**: Supports circular and rounded-rectangle crops
- **Rescaling control**: Optional `disableImageRescaling` flag

## Sub-components

- **ImageCropper** — Canvas-based cropper with zoom and pan
- **ButtonDelete** — Button to remove the current image

## Properties

| Prop                           | Type                                           | Default | Description                                      |
|--------------------------------|------------------------------------------------|---------|--------------------------------------------------|
| `t`                            | `TTranslation`                                 | —       | Translation function for i18n                    |
| `image`                        | `TImage`                                       | —       | Current image state (file, zoom, x, y)           |
| `onChangeImage`                | `(image: TImage) => void`                      | —       | Callback when image state changes                |
| `Preview`                      | `React.ReactNode`                              | —       | Preview element rendered beside the cropper      |
| `setPreview`                   | `(preview: string) => void`                    | —       | Callback to update the preview data URL          |
| `isDisabled`                   | `boolean`                                      | —       | Disables all editing interactions                |
| `editorBorderRadius`           | `number`                                       | —       | Border radius of the crop area in pixels         |
| `onChangeFile`                 | `(e: ChangeEvent<HTMLInputElement>) => void`   | —       | Callback when a new file is selected             |
| `classNameWrapperImageCropper` | `string`                                       | —       | CSS class for the cropper wrapper                |
| `className`                    | `string`                                       | —       | CSS class for the root element                   |
| `disableImageRescaling`        | `boolean`                                      | —       | Disables automatic image rescaling               |
| `maxImageSize`                 | `number`                                       | —       | Maximum allowed image size                       |

## TImage Type

```ts
type TImage = {
  uploadedFile?: string | File;
  zoom: number;
  x: number;
  y: number;
};
```
