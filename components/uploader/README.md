# Uploader

A complete file upload component with chunked upload support, progress tracking, and file size validation. Built on top of the `Dropzone` component and DocSpace API SDK, it handles the entire upload workflow including session management, parallel chunk uploads, and folder structure preservation.

## Usage

```tsx
import { Uploader } from "@docspace/ui-kit/components/uploader";

<Uploader
  targetId="12345"
  accept=".pdf,.doc,.docx"
  shortText="PDF, DOC, DOCX"
  fullText="PDF, DOC, DOCX, XLS, XLSX"
  badgeValue={2}
  linkMainText="Upload files"
  secondaryText="or drag and drop files here"
  onUploadSuccess={(files) => console.log("Uploaded:", files)}
  onUploadError={(error) => console.error("Error:", error)}
/>
```

## Properties

| Prop                 | Type                                      | Default | Description                                                    |
|----------------------|-------------------------------------------|---------|----------------------------------------------------------------|
| `width`              | `string`                                  | `100%`  | Width of the uploader container                                |
| `height`             | `string`                                  | `100%`  | Height of the uploader container                               |
| `targetId`           | `string`                                  | —       | Target folder ID for uploads                                   |
| `accept`             | `string`                                  | —       | Accepted file types (e.g., `.pdf,.doc,.docx`)                  |
| `shortText`          | `string`                                  | —       | Short text displaying supported file extensions                |
| `fullText`           | `string`                                  | —       | Full list of extensions (shown in expandable dropdown)         |
| `badgeValue`         | `number`                                  | —       | Badge showing count of additional formats (e.g., +5)           |
| `linkMainText`       | `string`                                  | —       | Main text displayed in the dropzone                            |
| `secondaryText`      | `string`                                  | —       | Secondary text displayed in the dropzone                       |
| `extensionsText`     | `string`                                  | —       | Text displaying supported file extensions                      |
| `isFolderUpload`     | `boolean`                                 | `false` | Enables folder upload mode                                     |
| `isMultipleUpload`   | `boolean`                                 | `true`  | Allows multiple files/folders upload                           |
| `maxPerUploadSize`   | `string`                                  | —       | Maximum size per single upload (e.g., `10MB`)                  |
| `maxTotalUploadSize` | `string`                                  | —       | Maximum total upload size (e.g., `100MB`)                      |
| `filesSettings`      | `UploaderFilesSettings`                   | —       | Server file settings (chunk size, thread count, etc.)          |
| `onUploadProgress`   | `(data: UploadProgressData) => void`      | —       | Called on each upload progress update per file                 |
| `onUploadSuccess`    | `(data: unknown[]) => void`               | —       | Called when all files are uploaded successfully                |
| `onUploadError`      | `(data: { error: string }) => void`       | —       | Called when upload fails                                       |

## Examples

### Basic File Upload

```tsx
<Uploader
  targetId="12345"
  accept=".pdf,.doc,.docx"
  shortText="PDF, DOC, DOCX"
  linkMainText="Upload files"
  secondaryText="or drag and drop files here"
  onUploadSuccess={(files) => console.log("Uploaded:", files)}
/>
```

### Folder Upload

```tsx
<Uploader
  targetId="12345"
  accept="*"
  shortText="Any files"
  linkMainText="Upload folder"
  secondaryText="or drag and drop a folder here"
  isFolderUpload
/>
```

### With Size Limits

```tsx
<Uploader
  targetId="12345"
  accept=".pdf,.doc,.docx"
  shortText="PDF, DOC, DOCX"
  linkMainText="Upload files (max 10MB each)"
  secondaryText="or drag and drop files here"
  maxPerUploadSize="10MB"
  maxTotalUploadSize="100MB"
/>
```

### With Progress Tracking

```tsx
<Uploader
  targetId="12345"
  accept="*"
  shortText="Any files"
  linkMainText="Upload files"
  secondaryText="or drag and drop files here"
  onUploadProgress={({ sessionId, fileName, percent }) => {
    console.log(`${fileName}: ${percent}%`);
  }}
  onUploadSuccess={(files) => console.log("Done:", files)}
  onUploadError={({ error }) => console.error("Failed:", error)}
/>
```

## Notes

- **Chunked Upload**: Files are automatically split into chunks for reliable upload of large files. The chunk size is configurable via `filesSettings.chunkUploadSize`.
- **Parallel Upload**: Multiple chunks and files can be uploaded in parallel. Configure via `filesSettings.maxUploadThreadCount` and `filesSettings.maxUploadFilesCount`.
- **Folder Structure**: When uploading folders, the component preserves the folder structure by creating necessary directories on the server.
- **Size Validation**: Use `maxPerUploadSize` and `maxTotalUploadSize` to limit file sizes. Supports formats like `10MB`, `1GB`, `500KB`.
- **API Provider Required**: This component requires `ApiProvider` from `@docspace/ui-kit/providers/api` to be present in the component tree.
- **Toast Notifications**: The component shows toast notifications for success and error states. Ensure `Toast` component is rendered in your app.
