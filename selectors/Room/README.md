# Room Selector

A selector component for choosing rooms from the DocSpace system. Supports single-select and multi-select modes with search, filtering by room type, and real-time WebSocket updates.

## What It Does

- Displays a searchable, paginated list of DocSpace rooms
- Supports both single-select and multi-select modes
- Filters rooms by type (`roomType` prop) and search area
- Supports room creation via `withCreate` + `createDefineRoomLabel`/`createDefineRoomType`
- Excludes specific rooms via `excludeItems`
- Supports SSR initialization with pre-fetched data (`withInit`)
- Real-time updates via WebSocket subscriptions
- Optionally sorts selected items to the top of the list (`sortSelectedFirst`)
- Can disable submit until selection changes from initial state (`disableSubmitUntilChanged`)
- Optionally disables third-party storage rooms
- Renders in an Aside panel or inline

## Import

```tsx
import RoomSelector from "@docspace/ui-kit/selectors/Room";
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `onSubmit` | `(items: TSelectorItem[]) => void \| Promise<void>` | Yes | Callback with selected room(s) |
| `isMultiSelect` | `boolean` | Yes | Enable multi-select mode |
| `id` | `string` | No | HTML id attribute |
| `className` | `string` | No | CSS class name |
| `style` | `React.CSSProperties` | No | Inline styles |
| `roomType` | `RoomType \| RoomType[]` | No | Filter by room type(s) |
| `searchArea` | `SearchArea \| string` | No | Search scope (e.g., Templates) |
| `excludeItems` | `(number \| string \| undefined)[]` | No | Room IDs to exclude |
| `setIsDataReady` | `(value: boolean) => void` | No | Callback when data finishes loading |
| `submitButtonLabel` | `string` | No | Custom submit button text |
| `withPadding` | `boolean` | No | Add padding to the selector |
| `withSearch` | `boolean` | No | Enable search |
| `withCreate` | `boolean` | No | Enable room creation button |
| `createDefineRoomLabel` | `string` | No | Label for the create room button |
| `createDefineRoomType` | `RoomType` | No | Room type to create |
| `disableThirdParty` | `boolean` | No | Hide third-party storage rooms |
| `emptyScreenHeader` | `string` | No | Custom empty state header |
| `emptyScreenDescription` | `string` | No | Custom empty state description |
| `sortSelectedFirst` | `boolean` | No | Sort pre-selected items to the top |
| `disableSubmitUntilChanged` | `boolean` | No | Disable submit until selection differs from initial state |
| `selectedItems` | `TSelectorItem[]` | No | Initially selected items (for multi-select) |
| `disableFirstFetch` | `boolean` | No | Skip the initial data fetch |
| `forceIsMultiSelect` | `boolean` | No | Force multi-select UI behavior |
| `withHeader` | `boolean` | No | Show header |
| `headerProps` | `TSelectorHeaderProps` | No | Header configuration |
| `withCancelButton` | `boolean` | No | Show cancel button |
| `cancelButtonLabel` | `string` | No | Label for cancel button |
| `onCancel` | `() => void` | No | Callback on cancel |
| `useAside` | `boolean` | No | Render in an Aside panel |
| `onClose` | `() => void` | No | Close callback for Aside |
| `withInit` | `boolean` | No | SSR initialization mode |
| `initItems` | `FolderDtoInteger[]` | When `withInit=true` | Pre-fetched room items |
| `initTotal` | `number` | When `withInit=true` | Total room count |
| `initHasNextPage` | `boolean` | When `withInit=true` | Whether more pages exist |
| `initSearchValue` | `string` | No | Initial search value for SSR |

## Usage

### Single Select

```tsx
import RoomSelector from "@docspace/ui-kit/selectors/Room";

const SelectRoomDialog = () => {
  const handleSubmit = (items) => {
    const room = items[0];
    console.log("Selected room:", room.id, room.label);
  };

  return (
    <RoomSelector
      isMultiSelect={false}
      withSearch
      withHeader
      headerProps={{
        headerLabel: "Select Room",
        onCloseClick: handleClose,
      }}
      useAside
      onClose={handleClose}
      onSubmit={handleSubmit}
      withCancelButton
      cancelButtonLabel="Cancel"
      onCancel={handleClose}
    />
  );
};
```

### Multi Select with Pre-selection

```tsx
import RoomSelector from "@docspace/ui-kit/selectors/Room";

const GroupingPanel = () => {
  return (
    <RoomSelector
      isMultiSelect
      selectedItems={currentRooms}
      sortSelectedFirst
      disableSubmitUntilChanged
      withSearch
      roomType={RoomType.CustomRoom}
      onSubmit={handleSave}
      onClose={handleClose}
      useAside
    />
  );
};
```

## Key Files

| File | Description |
|------|-------------|
| `index.tsx` | Main component with room fetching, selection tracking, and rendering |
| `RoomSelector.types.ts` | TypeScript definitions for props including `TInitValue` for SSR |
| `RoomSelector.utils.ts` | `convertToItems` utility — transforms `FolderDtoInteger[]` into `TSelectorItem[]` with room metadata (logo, cover, tags, lifetime, etc.) |
