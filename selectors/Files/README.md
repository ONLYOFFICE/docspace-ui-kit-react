# Files Selector

A comprehensive file and folder browser selector for navigating the DocSpace file system. Supports rooms, folders, files, and AI agents with breadcrumb navigation, search, and filtering.

## What It Does

- Provides a full file-system browser within a selector panel (Aside or embedded)
- Navigates through rooms, folders, and files with breadcrumb trail
- Supports tree folder roots: Recent, Favorites, AI Agents
- Handles file type filtering (documents, images, PDFs, spreadsheets, etc.)
- Supports room creation via `withCreate` + `createDefineRoomLabel`/`createDefineRoomType`
- Real-time updates via WebSocket subscriptions
- Renders in a Portal on mobile/tablet devices
- Supports SSR initialization with pre-fetched data
- Validates folder write access via `checkCreating` (creates and deletes a test file)
- Handles third-party storage providers
- Supports file selection with detailed info (extension, type, viewUrl)

## Import

```tsx
import FilesSelector from "@docspace/ui-kit/selectors/Files";
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `onSubmit` | `(selectedItemId, folderTitle, isPublic, breadCrumbs, fileName, isChecked, selectedTreeNode, selectedFileInfo, isInsideKnowledge, isInsideResultStorage) => void` | Yes | Callback on submit with full context |
| `onCancel` | `() => void` | Yes | Callback to close/cancel the selector |
| `getIsDisabled` | `(isFirstLoad, isSelectedParentFolder, ...) => boolean` | Yes | Function to determine if submit is disabled |
| `getFilesArchiveError` | `(name: string) => string` | Yes | Error message generator for archived items |
| `disabledItems` | `(string \| number)[]` | Yes | IDs of folders that cannot be selected as targets |
| `isRoomsOnly` | `boolean` | Yes | Restrict navigation to rooms level only |
| `isThirdParty` | `boolean` | Yes | Whether navigating third-party storage |
| `currentFolderId` | `number \| string` | Yes | Initial folder to open |
| `rootFolderType` | `FolderType` | Yes | Root folder type for context |
| `isPanelVisible` | `boolean` | Yes | Controls visibility of the selector panel |
| `currentDeviceType` | `DeviceType` | Yes | Current device type for responsive behavior |
| `filesSettings` / `getIcon` | `FilesSettingsDto` / `TGetIcon` | One required | File settings or icon resolver function |
| `submitButtonLabel` | `string` | Yes | Text for the submit button |
| `cancelButtonLabel` | `string` | Yes | Text for the cancel button |
| `withBreadCrumbs` | `boolean` | Yes | Show breadcrumb navigation |
| `withoutBackButton` | `boolean` | Yes | Hide the back button |
| `withSearch` | `boolean` | Yes | Enable search functionality |
| `withCancelButton` | `boolean` | Yes | Show cancel button |
| `withFooterInput` | `boolean` | Yes | Show input field in footer |
| `withFooterCheckbox` | `boolean` | Yes | Show checkbox in footer |
| `footerInputHeader` | `string` | Yes | Header text for footer input |
| `currentFooterInputValue` | `string` | Yes | Default value for footer input |
| `footerCheckboxLabel` | `string` | Yes | Label for footer checkbox |
| `descriptionText` | `string` | Yes | Description text shown in the selector |
| `withCreate` | `boolean` | Yes | Enable room/folder creation |
| `embedded` | `boolean` | No | Render without Aside wrapper |
| `treeFolders` | `FolderDtoInteger[]` | No | Tree folder structure for root navigation |
| `roomType` | `RoomType \| RoomType[]` | No | Filter rooms by type |
| `filterParam` | `string \| number` | No | File type filter |
| `shareKey` | `string` | No | Share key for public access |
| `withInit` | `boolean` | No | SSR initialization mode |
| `disableBySecurity` | `string` | No | Security key to disable items |

## Usage

```tsx
import FilesSelector from "@docspace/ui-kit/selectors/Files";

const MoveDialog = () => {
  const handleSubmit = (
    selectedItemId,
    folderTitle,
    isPublic,
    breadCrumbs,
    fileName,
    isChecked,
  ) => {
    moveFiles(selectedItemId, fileName);
  };

  return (
    <FilesSelector
      isPanelVisible={true}
      currentFolderId={folderId}
      rootFolderType={FolderType.VirtualRooms}
      currentDeviceType={DeviceType.desktop}
      filesSettings={filesSettings}
      disabledItems={[currentFolderId]}
      isRoomsOnly={false}
      isThirdParty={false}
      withBreadCrumbs
      withSearch
      withoutBackButton={false}
      withCancelButton
      withCreate={false}
      withFooterInput
      withFooterCheckbox={false}
      submitButtonLabel="Move here"
      cancelButtonLabel="Cancel"
      footerInputHeader="File name"
      currentFooterInputValue={fileName}
      footerCheckboxLabel=""
      descriptionText=""
      onSubmit={handleSubmit}
      onCancel={handleClose}
      getIsDisabled={getIsDisabled}
      getFilesArchiveError={getArchiveError}
    />
  );
};
```

## Key Files

| File | Description |
|------|-------------|
| `index.tsx` | Main component orchestrating rooms, files, agents navigation |
| `FilesSelector.types.ts` | TypeScript definitions for all props and helper types |
| `FilesSelector.utils.ts` | `getFilterParams` — maps filter params to API filter types |
| `hooks/useFilesHelper.ts` | Hook for fetching and managing file/folder lists |
| `hooks/useRootHelper.tsx` | Hook for root-level tree folder navigation |
| `hooks/useSelectorState.ts` | Hook managing selector state (breadcrumbs, items, selection) |
| `hooks/useSelectorBody.tsx` | Hook composing the Selector UI body with all props |
