# Table

A compound table component for displaying data in a columnar layout with resizable columns, sortable headers, group selection menu, and virtualized scrolling via `react-virtualized`.

## Usage

```tsx
import {
  TableContainer,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableGroupMenu,
} from "@docspace/ui-kit/components/table";

<TableContainer forwardedRef={containerRef} useReactWindow>
  <TableHeader
    containerRef={containerRef}
    columns={columns}
    columnStorageName="myTableColumns"
    sectionWidth={sectionWidth}
    useReactWindow
    showSettings
  />
  <TableBody
    columnStorageName="myTableColumns"
    fetchMoreFiles={loadMore}
    filesLength={items.length}
    hasMoreFiles={hasMore}
    itemCount={totalCount}
    itemHeight={48}
    useReactWindow
  >
    {items.map((item) => (
      <TableRow key={item.id} contextOptions={item.contextOptions}>
        <TableCell>{item.name}</TableCell>
        <TableCell>{item.date}</TableCell>
        <TableCell>{item.size}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</TableContainer>
```

## Features

- **Resizable columns**: Drag column borders to resize; sizes persist to storage
- **Sortable headers**: Click column headers to sort; visual sort direction indicator
- **Column settings**: Toggle column visibility via a settings dropdown
- **Group selection menu**: Bulk action toolbar with checkbox, action buttons, and info panel toggle
- **Virtualized body**: Efficient rendering of large datasets via `react-virtualized`
- **Context menu**: Right-click or button-triggered context menu per row
- **Responsive**: Adapts column layout when the info panel is visible

## Sub-components

- **`TableContainer`** — Root wrapper element
- **`TableHeader`** — Column headers with resize handles and sort indicators
- **`TableBody`** — Virtualized scrollable body with infinite loading
- **`TableRow`** — Single data row with context menu support
- **`TableCell`** — Individual cell within a row
- **`TableGroupMenu`** — Bulk selection toolbar
- **`TableSettings`** — Column visibility settings dropdown

## Key Properties

### TableHeader

| Prop                   | Type                | Default | Description                                |
|------------------------|---------------------|---------|--------------------------------------------|
| `columns`              | `TTableColumn[]`    | —       | Column definitions                         |
| `columnStorageName`    | `string`            | —       | Storage key for persisting column sizes    |
| `sectionWidth`         | `number`            | —       | Available width for the table              |
| `sortBy`               | `string`            | —       | Currently sorted column key                |
| `sorted`               | `boolean`           | —       | Whether sorting is active                  |
| `useReactWindow`       | `boolean`           | —       | Enables virtualized rendering              |
| `showSettings`         | `boolean`           | —       | Shows the column settings button           |

### TableBody

| Prop                   | Type                                    | Default | Description                                |
|------------------------|-----------------------------------------|---------|--------------------------------------------|
| `fetchMoreFiles`       | `(params: IndexRange) => Promise<void>` | —       | Callback to load more rows                 |
| `filesLength`          | `number`                                | —       | Number of currently loaded rows            |
| `hasMoreFiles`         | `boolean`                               | —       | Whether more rows are available            |
| `itemCount`            | `number`                                | —       | Total row count                            |
| `itemHeight`           | `number`                                | —       | Height of each row in pixels               |
| `useReactWindow`       | `boolean`                               | —       | Enables virtualized rendering              |

### TableRow

| Prop                   | Type                      | Default | Description                                |
|------------------------|---------------------------|---------|--------------------------------------------|
| `contextOptions`       | `ContextMenuModel[]`      | —       | Context menu items for the row             |
| `getContextModel`      | `() => ContextMenuModel[]`| —       | Dynamic context menu model getter          |
| `checked`              | `boolean`                 | —       | Whether the row is selected                |
| `dragging`             | `boolean`                 | —       | Whether the row is being dragged           |
