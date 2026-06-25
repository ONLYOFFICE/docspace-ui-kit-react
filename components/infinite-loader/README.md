# InfiniteLoader

A virtualized infinite-scrolling component that renders children in either a list or grid layout depending on the current view mode. Built on top of `react-virtualized`, it loads more items as the user scrolls.

## Usage

```tsx
import { InfiniteLoaderComponent } from "@docspace/ui-kit/components/infinite-loader";

<InfiniteLoaderComponent
  viewAs="row"
  hasMoreFiles={true}
  filesLength={items.length}
  itemCount={totalCount}
  loadMoreItems={fetchMore}
  itemSize={48}
>
  {items.map((item) => (
    <RowItem key={item.id} item={item} />
  ))}
</InfiniteLoaderComponent>
```

## Features

- **Dual layout**: Automatically switches between `ListComponent` (row view) and `GridComponent` (tile view)
- **Virtualized rendering**: Only renders visible items for optimal performance
- **Skeleton fallback**: Shows skeleton placeholders during fast scrolling
- **Scroll tracking**: Detects large scroll jumps and temporarily shows skeletons

## Properties

| Prop                          | Type                                    | Default | Description                                          |
|-------------------------------|-----------------------------------------|---------|------------------------------------------------------|
| `viewAs`                      | `TViewAs`                               | —       | View mode: `"row"` or `"tile"`                       |
| `hasMoreFiles`                | `boolean`                               | —       | Whether more items are available to load              |
| `filesLength`                 | `number`                                | —       | Current number of loaded items                       |
| `itemCount`                   | `number`                                | —       | Total number of items (loaded + not yet loaded)      |
| `loadMoreItems`               | `(params: IndexRange) => Promise<void>` | —       | Callback to load additional items                    |
| `itemSize`                    | `number`                                | —       | Height of each item in pixels (row view)             |
| `children`                    | `React.ReactNode[]`                     | —       | Array of child elements to render                    |
| `onScroll`                    | `() => void`                            | —       | Optional scroll event callback                       |
| `isLoading`                   | `boolean`                               | —       | When true, renders nothing (initial load)            |
| `columnStorageName`           | `string`                                | —       | Storage key for column configuration                 |
| `columnInfoPanelStorageName`  | `string`                                | —       | Storage key for info panel column configuration      |
| `className`                   | `string`                                | —       | Additional CSS class name                            |
| `infoPanelVisible`            | `boolean`                               | —       | Whether the info panel is visible                    |
| `countTilesInRow`             | `number`                                | —       | Number of tiles per row in grid view                 |
| `currentFolderId`             | `string \| number`                      | —       | Current folder identifier                            |
