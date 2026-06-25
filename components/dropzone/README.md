# Dropzone

A file upload area that supports drag-and-drop. Built on top of `react-dropzone`, it displays instructional text and accepted file types, and shows a loading indicator during upload. Supports both file and folder upload modes with single or multiple item selection.

## Usage

```tsx
import Dropzone from "@docspace/ui-kit/components/dropzone";

<Dropzone
  isLoading={false}
  accept={["image/png", "image/jpeg"]}
  onDrop={(files) => handleUpload(files)}
  linkMainText="Click to upload"
  linkSecondaryText="or drag and drop"
  exstsText="PNG, JPG"
  fullExstsText="PNG, JPG, GIF, BMP, WEBP."
  formatsPlusBadgeValue={3}
/>
```

## Properties

| Prop                   | Type                        | Default     | Description                                                              |
|------------------------|-----------------------------|-------------|--------------------------------------------------------------------------|
| `isLoading`            | `boolean`                   | —           | Shows a loading spinner instead of the drop area                         |
| `isDisabled`           | `boolean`                   | `false`     | Disables click and keyboard interactions                                 |
| `isFolderUpload`       | `boolean`                   | `false`     | Enables folder upload mode instead of file upload                        |
| `isMultipleUpload`     | `boolean`                   | `true`      | Allows multiple files/folders. When `false`, only one item is accepted   |
| `onSingleUploadError`  | `() => void`                | —           | Called when user tries to upload multiple items in single upload mode    |
| `accept`               | `string \| string[]`        | —           | Accepted MIME types for file uploads (not applied in folder mode)        |
| `onDrop`               | `(files: File[]) => void`   | —           | Callback when files are dropped or selected                              |
| `maxFiles`             | `number`                    | `0`         | Maximum number of files (0 = unlimited)                                  |
| `linkMainText`         | `string`                    | —           | Primary instructional text (displayed as link)                           |
| `linkSecondaryText`    | `string`                    | —           | Secondary instructional text                                             |
| `exstsText`            | `string`                    | —           | Short text describing supported file types                               |
| `fullExstsText`        | `string`                    | —           | Full list of file types (shown in expandable dropdown)                   |
| `formatsPlusBadgeValue`| `number`                    | —           | Badge showing count of additional formats (e.g., +5)                     |
| `icon`                 | `string`                    | —           | Optional icon URL to display                                             |
| `iconClassName`        | `string`                    | —           | Optional className for the icon                                          |
| `className`            | `string`                    | —           | Optional className for the dropzone container                            |
| `loaderClassName`      | `string`                    | —           | Optional className for the loader                                        |
| `getFilesFromEvent`    | `function`                  | —           | Custom function to get files from drop event                             |
| `dataTestId`           | `string`                    | `"dropzone"`| Test ID for automated testing                                            |

## Examples

### Basic File Upload

```tsx
<Dropzone
  isLoading={false}
  accept={["image/png", "image/jpeg"]}
  onDrop={(files) => handleUpload(files)}
  linkMainText="Upload"
  linkSecondaryText="or drag and drop files here"
  exstsText="PNG, JPG"
/>
```

### Folder Upload

```tsx
<Dropzone
  isLoading={false}
  isFolderUpload
  onDrop={(files) => handleUpload(files)}
  linkMainText="Upload folder"
  linkSecondaryText="or drag and drop folders here"
  exstsText="Upload entire folders with their structure"
/>
```

### Single File Upload

```tsx
<Dropzone
  isLoading={false}
  isMultipleUpload={false}
  accept={[".pdf", ".docx"]}
  onDrop={(files) => handleUpload(files)}
  onSingleUploadError={() => alert("Only one file allowed")}
  linkMainText="Upload single file"
  linkSecondaryText="or drag file here"
  exstsText="PDF, DOCX"
/>
```

### Single Folder Upload

```tsx
<Dropzone
  isLoading={false}
  isFolderUpload
  isMultipleUpload={false}
  onDrop={(files) => handleUpload(files)}
  onSingleUploadError={() => alert("Only one folder allowed")}
  linkMainText="Upload single folder"
  linkSecondaryText="or drag folder here"
  exstsText="Only one folder can be uploaded"
/>
```

### With Format Dropdown

```tsx
<Dropzone
  isLoading={false}
  accept={[".doc", ".docx", ".pdf", ".txt", ".rtf"]}
  onDrop={(files) => handleUpload(files)}
  linkMainText="Upload"
  linkSecondaryText="or drop file here"
  exstsText="DOC, DOCX, PDF"
  fullExstsText="DOC, DOCX, PDF, TXT, RTF."
  formatsPlusBadgeValue={2}
/>
```

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

## Notes

- **Folder Upload Mode**: When `isFolderUpload` is `true`, the `accept` filter is not applied — all files inside the folder are uploaded.
- **Single Upload Mode**: When `isMultipleUpload` is `false`, only one file or folder can be uploaded. If the user tries to upload multiple items, `onSingleUploadError` is called and the upload is cancelled.
- **Browser Limitations**: Multiple folder selection via the system dialog is not supported by browsers. However, multiple folders can be uploaded via drag-and-drop.
