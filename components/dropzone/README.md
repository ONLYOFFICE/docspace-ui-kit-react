# Dropzone

A file upload area that supports drag-and-drop. Built on top of `react-dropzone`, it displays instructional text and accepted file types, and shows a loading indicator during upload.

## Usage

```tsx
import Dropzone from "@docspace/ui-kit/components/dropzone";

<Dropzone
  isLoading={false}
  accept={["image/png", "image/jpeg"]}
  onDrop={(files) => handleUpload(files)}
  linkMainText="Click to upload"
  linkSecondaryText="or drag and drop"
  exstsText="PNG, JPG up to 10 MB"
/>
```

## Properties

| Prop                | Type                        | Default     | Description                                        |
|---------------------|-----------------------------|-------------|----------------------------------------------------|
| `isLoading`         | `boolean`                   | —           | Shows a loading spinner instead of the drop area   |
| `isDisabled`        | `boolean`                   | `false`     | Disables click and keyboard interactions           |
| `accept`            | `string \| string[]`        | —           | Accepted MIME types for file uploads               |
| `onDrop`            | `(files: File[]) => void`   | —           | Callback when files are dropped or selected        |
| `maxFiles`          | `number`                    | `0`         | Maximum number of files (0 = unlimited)            |
| `linkMainText`      | `string`                    | —           | Primary instructional text (displayed as a link)   |
| `linkSecondaryText` | `string`                    | —           | Secondary instructional text                       |
| `exstsText`         | `string`                    | —           | Text describing supported file types               |
| `dataTestId`        | `string`                    | `"dropzone"`| Test ID for automated testing                      |

## Examples

### Loading State

```tsx
<Dropzone
  isLoading
  accept="image/*"
  linkMainText="Uploading..."
  linkSecondaryText=""
  exstsText=""
/>
```

### Disabled Dropzone

```tsx
<Dropzone
  isLoading={false}
  isDisabled
  accept={[".pdf", ".docx"]}
  linkMainText="Upload document"
  linkSecondaryText="or drag and drop"
  exstsText="PDF, DOCX up to 50 MB"
/>
```
