# Dropzone

A file upload area that supports drag-and-drop. Built on top of `react-dropzone`, it displays instructional text and accepted file types, and shows a loading indicator during upload. Supports separate file and folder upload links with expandable format dropdown.

## Usage

```tsx
import Dropzone from "@docspace/ui-kit/components/dropzone";

<Dropzone
  isLoading={false}
  accept={["image/png", "image/jpeg"]}
  onDrop={(files) => handleUpload(files)}
  linkMainTextForFiles="Click to upload"
  linkSecondaryText="or drag and drop"
  exstsText="PNG, JPG"
  fullExstsText="PNG, JPG, GIF, BMP, WEBP."
  formatsPlusBadgeValue={3}
/>
```

## Properties

| Prop                     | Type                        | Default     | Description                                                    |
|--------------------------|-----------------------------|-------------|----------------------------------------------------------------|
| `isLoading`              | `boolean`                   | —           | Shows a loading spinner instead of the drop area               |
| `isDisabled`             | `boolean`                   | `false`     | Disables click and keyboard interactions                       |
| `accept`                 | `string \| string[]`        | —           | Accepted MIME types for file uploads                           |
| `onDrop`                 | `(files: File[]) => void`   | —           | Callback when files are dropped or selected                    |
| `maxFiles`               | `number`                    | `0`         | Maximum number of files (0 = unlimited)                        |
| `linkMainTextForFiles`   | `string`                    | —           | Primary instructional text for file upload (displayed as link) |
| `linkMainTextForFolders` | `string`                    | —           | Text for folder upload link (enables separate file/folder mode)|
| `linkSecondaryText`      | `string`                    | —           | Secondary instructional text                                   |
| `exstsText`              | `string`                    | —           | Short text describing supported file types                     |
| `fullExstsText`          | `string`                    | —           | Full list of file types (shown in expandable dropdown)         |
| `formatsPlusBadgeValue`  | `number`                    | —           | Badge showing count of additional formats (e.g., +5)           |
| `icon`                   | `string`                    | —           | Optional icon URL to display                                   |
| `iconClassName`          | `string`                    | —           | Optional className for the icon                                |
| `className`              | `string`                    | —           | Optional className for the dropzone container                  |
| `loaderClassName`        | `string`                    | —           | Optional className for the loader                              |
| `getFilesFromEvent`      | `function`                  | —           | Custom function to get files from drop event                   |
| `dataTestId`             | `string`                    | `"dropzone"`| Test ID for automated testing                                  |

## Examples

### Basic Usage

```tsx
<Dropzone
  isLoading={false}
  accept={["image/png", "image/jpeg"]}
  onDrop={(files) => handleUpload(files)}
  linkMainTextForFiles="Upload"
  linkSecondaryText="or drag and drop"
  exstsText="PNG, JPG"
/>
```

### With Format Dropdown

```tsx
<Dropzone
  isLoading={false}
  accept={[".doc", ".docx", ".pdf", ".txt", ".rtf"]}
  onDrop={(files) => handleUpload(files)}
  linkMainTextForFiles="Upload"
  linkSecondaryText="or drop file here"
  exstsText="DOC, DOCX, PDF"
  fullExstsText="DOC, DOCX, PDF, TXT, RTF."
  formatsPlusBadgeValue={2}
/>
```

### File and Folder Upload

```tsx
<Dropzone
  isLoading={false}
  accept="*"
  onDrop={(files) => handleUpload(files)}
  linkMainTextForFiles="Upload files"
  linkMainTextForFolders="upload folder"
  linkSecondaryText="or drag and drop"
  exstsText="All file types"
/>
```

### Loading State

```tsx
<Dropzone
  isLoading
  accept="image/*"
  linkMainTextForFiles="Uploading..."
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
  linkMainTextForFiles="Upload document"
  linkSecondaryText="or drag and drop"
  exstsText="PDF, DOCX up to 50 MB"
/>
```
