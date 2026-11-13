# MediaViewer

The module has two layers. `MediaViewer` shows a playlist it is handed and makes no request of its own. `MediaGallery` sits on top of it: given a folder, it reads the folder from the portal and drives the viewer itself.

## MediaGallery

The media files of one portal folder or room in the viewer, with previous / next navigation. It needs an `ApiProvider` above it and reads `GET /api/2.0/files/{folderId}` through `useApi().apiClient`, files only, `pageSize` at a time: the first page on mount, the next one when the viewer is three items from the end of what is loaded. Media is picked on the client by `viewAccessibility`, so a folder whose first pages hold none keeps loading until one turns up or the folder ends.

- The viewer is read-only (`isPublicFile`): no rename, delete, move or copy.
- Navigation does not wrap: the arrows do nothing on the first and the last file.
- `startFileId` is found only among the files already loaded; otherwise the first media file opens.
- A failed first request calls `onLoadError` and renders nothing; a failed later page keeps what is loaded and stops asking.
- A change of `folderId` or `requestToken` starts over.
- It renders the loader until the first answer, so the viewer itself never renders on the server.

| Property                | Type                                                            | Required | Default | Description                                                                |
| ----------------------- | --------------------------------------------------------------- | -------- | ------- | -------------------------------------------------------------------------- |
| `folderId`              | `NumberOrString`                                                | Yes      | -       | The folder or room whose media files are shown.                            |
| `t`                     | `TranslationType`                                               | Yes      | -       | Function for translating text.                                             |
| `getIcon`               | `(size: number, ext: string, ...arg: unknown[]) => string`      | Yes      | -       | Function to get the icon for a file based on its size and extension.       |
| `extsImagePreviewed`    | `string[]`                                                      | Yes      | -       | List of file extensions that can be previewed as images.                   |
| `requestToken`          | `string`                                                        | No       | -       | The key of a public room link, sent with every request as `Request-Token`. |
| `startFileId`           | `NumberOrString`                                                | No       | -       | The file to open first.                                                    |
| `pageSize`              | `number`                                                        | No       | `100`   | How many files one request asks for.                                       |
| `emptyContent`          | `React.ReactNode`                                               | No       | -       | Shown when the folder has no media files.                                  |
| `onDownload`            | `(file: TFile) => void`                                         | No       | -       | Called with the file to download. By default its `viewUrl` opens in place. |
| `onLoadError`           | `(error: unknown) => void`                                      | No       | -       | Called when the first request for the folder fails.                        |
| `currentDeviceType`     | `DeviceType`                                                    | No       | -       | Type of the current device.                                                |
| `autoPlay`              | `boolean`                                                       | No       | -       | Starts video and audio as soon as they open.                               |
| `decryptFile`           | `(params: DecryptFileParams) => Promise<DecryptedFile \| null>` | No       | -       | Decrypts an encrypted item, as for `MediaViewer`.                          |
| `resolveTitle`          | `(item) => string`                                              | No       | -       | Returns the title to show for an item, as for `MediaViewer`.               |
| `getPdfViewerScriptUrl` | `() => Promise<string>`                                         | No       | -       | Resolves the URL of the PDF viewer script, as for `MediaViewer`.           |
| `onClose`               | `VoidFunction`                                                  | No       | -       | Shows the close button and is called by it.                                |

```tsx
import { MediaGallery } from "@onlyoffice/apps-ui-kit/media-viewer";

<MediaGallery
  t={t}
  folderId={folderId}
  requestToken={publicRoomKey}
  getIcon={getIcon}
  extsImagePreviewed={filesSettings.extsImagePreviewed}
  emptyContent={<EmptyState />}
  onLoadError={showError}
/>;
```

## MediaViewer

A full-screen viewer for the images, video, audio and PDF files of a playlist, with previous / next navigation, a toolbar and a context menu. It is portal-internal: it reads portal file objects, but it makes no request of its own -- the playlist, the icons and the callbacks all come from the consumer.

## What the consumer supplies

- **Encrypted files.** The viewer holds no cryptography. For a playlist item marked `encrypted` it calls `decryptFile({ src, fileId, title, roomId, signal })` and shows the bytes that come back. Resolve with `null` to close the viewer, reject to show the decryption error. Without `decryptFile` an encrypted item shows that error.
- **Titles.** `resolveTitle` returns the title to show for an item when the consumer knows a better one than the playlist carries. Pass a stable reference: it is a dependency of the effect that loads the item.
- **PDF.** `getPdfViewerScriptUrl` resolves the URL of the PDF viewer script. Without it a PDF item shows the loading error.
- **Optional peers.** `@react-spring/web`, `@use-gesture/react`, `heic2any` and `utif` are optional peer dependencies of the package; an application that renders the viewer declares them.

## Properties

| Property                 | Type                                                                                                                                                          | Required | Default | Description                                                          |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------- | -------------------------------------------------------------------- |
| `t`                      | `TranslationType`                                                                                                                                             | Yes      | -       | Function for translating text.                                       |
| `files`                  | `TFile[]`                                                                                                                                                     | Yes      | -       | List of media files to be displayed.                                 |
| `visible`                | `boolean`                                                                                                                                                     | Yes      | -       | Specifies whether the media viewer is visible.                       |
| `playlistPos`            | `number`                                                                                                                                                      | Yes      | -       | Position of the current file in the playlist.                        |
| `isPreviewFile`          | `boolean`                                                                                                                                                     | Yes      | -       | Indicates if the current file is a preview.                          |
| `playlist`               | `PlaylistType[]`                                                                                                                                              | Yes      | -       | List of playlists.                                                   |
| `extsImagePreviewed`     | `string[]`                                                                                                                                                    | Yes      | -       | List of file extensions that can be previewed as images.             |
| `currentFileId`          | `NumberOrString`                                                                                                                                              | Yes      | -       | ID of the current file.                                              |
| `getIcon`                | `(size: number, ext: string, ...arg: unknown[]) => string`                                                                                                    | Yes      | -       | Function to get the icon for a file based on its size and extension. |
| `currentDeviceType`      | `DeviceType`                                                                                                                                                  | No       | -       | Type of the current device.                                          |
| `deleteDialogVisible`    | `boolean`                                                                                                                                                     | No       | -       | Specifies whether the delete dialog is visible.                      |
| `userAccess`             | `boolean`                                                                                                                                                     | No       | -       | Specifies whether the user has access.                               |
| `archiveRoomsId`         | `number`                                                                                                                                                      | No       | -       | ID of the archive room.                                              |
| `pluginContextMenuItems` | `{ key: string; value: { label: string; onClick: (id: number) => Promise<void>; icon: string; fileType?: ["video", "image"]; withActiveItem?: boolean; }[] }` | No       | -       | Context menu items for plugins.                                      |
| `onClose`                | `VoidFunction`                                                                                                                                                | No       | -       | Callback function called when the media viewer is closed.            |
| `onError`                | `VoidFunction`                                                                                                                                                | No       | -       | Callback function called when an error occurs.                       |
| `nextMedia`              | `VoidFunction`                                                                                                                                                | No       | -       | Callback function to view the next media file.                       |
| `prevMedia`              | `VoidFunction`                                                                                                                                                | No       | -       | Callback function to view the previous media file.                   |
| `onMoveAction`           | `VoidFunction`                                                                                                                                                | No       | -       | Callback function called on move action.                             |
| `onCopyAction`           | `VoidFunction`                                                                                                                                                | No       | -       | Callback function called on copy action.                             |
| `onCopyLink`             | `ContextMenuAction`                                                                                                                                           | No       | -       | Callback function called on copy link action.                        |
| `onDuplicate`            | `ContextMenuAction`                                                                                                                                           | No       | -       | Callback function called on duplicate action.                        |
| `onClickDownloadAs`      | `VoidFunction`                                                                                                                                                | No       | -       | Callback function called on "Download As" action.                    |
| `onClickDelete`          | `ContextMenuAction`                                                                                                                                           | No       | -       | Callback function called on delete action.                           |
| `onClickDownload`        | `ContextMenuAction`                                                                                                                                           | No       | -       | Callback function called on download action.                         |
| `onEmptyPlaylistError`   | `VoidFunction`                                                                                                                                                | No       | -       | Callback function called on an error when the playlist is empty.     |
| `onDelete`               | `(id: NumberOrString) => void`                                                                                                                                | No       | -       | Callback function called on delete action for a specific file.       |
| `onDownload`             | `(id: NumberOrString) => void`                                                                                                                                | No       | -       | Callback function called on download action for a specific file.     |
| `onChangeUrl`            | `(id: NumberOrString) => void`                                                                                                                                | No       | -       | Callback function called when the URL changes for a specific file.   |
| `onClickRename`          | `OmitSecondArg<ContextMenuAction>`                                                                                                                            | No       | -       | Callback function called on rename action.                           |
| `onPreviewClick`         | `OmitSecondArg<ContextMenuAction>`                                                                                                                            | No       | -       | Callback function called on preview click action.                    |
| `onClickLinkEdit`        | `OmitSecondArg<ContextMenuAction>`                                                                                                                            | No       | -       | Callback function called on link edit action.                        |
| `onShowInfoPanel`        | `OmitSecondArg<ContextMenuAction>`                                                                                                                            | No       | -       | Callback function called on show info panel action.                  |
| `setBufferSelection`     | `(file?: TFile\| null) => void`                                                                                                                               | No       | -       | Function to set the buffer selection for a file.                     |
| `setActiveFiles`         | `(files: number[], destId?: number) => void`                                                                                                                  | No       | -       | Function to set the active files based on their IDs.                 |

## Usage Example

```jsx
import React from "react";
import { MediaViewer } from "@onlyoffice/apps-ui-kit/media-viewer";

const MyComponent = () => {
  // Define required callback functions and other necessary data
  const handleNextMedia = () => {
    /* ... */
  };
  const handlePrevMedia = () => {
    /* ... */
  };
  // ...

  return (
    <MediaViewer
      t={translationTypeInstance}
      files={mediaFiles}
      visible={true}
      playlistPos={0}
      isPreviewFile={false}
      playlist={playlists}
      extsImagePreviewed={["jpg", "png"]}
      currentFileId={currentFileId}
      getIcon={getIconFunction}
      // ... (other properties)
      onClose={handleClose}
      onError={handleError}
      nextMedia={handleNextMedia}
      prevMedia={handlePrevMedia}
      // ... (other callbacks)
    />
  );
};

export default MyComponent;
```
