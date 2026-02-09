# RowContainer

Wrapper around `Row` items that optionally virtualizes scrolling lists via `react-window` and the shared `InfiniteLoaderComponent`.

## Import

```ts
import { RowContainer } from "@docspace/ui-kit/components/rows";
```

## Usage

```tsx
<RowContainer manualHeight="480px" useReactWindow={false}>
  {rows}
</RowContainer>
```

### Virtualized list with infinite loader

```tsx
<RowContainer
  manualHeight="520px"
  itemHeight={56}
  itemCount={items.length}
  filesLength={items.length}
  hasMoreFiles={hasNextPage}
  fetchMoreFiles={({ startIndex, stopIndex }) =>
    loadMore(startIndex, stopIndex)
  }
>
  {items.map((item) => (
    <Row key={item.id} {...rowProps(item)} />
  ))}
</RowContainer>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `React.ReactNode[]` | – | Rows rendered inside the container. When `useReactWindow` is `true`, they are passed to the shared `InfiniteLoaderComponent`. |
| `manualHeight` | `string` | – | Sets a fixed container height via the `--manual-height` CSS variable. |
| `itemHeight` | `number` | `50` | Height of a single row; required for accurate virtualization when `useReactWindow` is enabled. |
| `useReactWindow` | `boolean` | `true` | Toggles virtualization. When `false`, children render directly without `react-window`. |
| `id` | `string` | `"rowContainer"` | DOM id applied to the wrapper. |
| `className` | `string` | – | Custom class appended to the wrapper. |
| `style` | `React.CSSProperties` | – | Inline styles for the wrapper. Works together with `manualHeight`. |
| `onScroll` | `() => void` | – | Callback fired when the virtualized list scrolls. |
| `filesLength` | `number` | – | Current number of loaded items; forwarded to `InfiniteLoaderComponent`. |
| `itemCount` | `number` | – | Total item count known to the loader. |
| `fetchMoreFiles` | `(params: IndexRange) => Promise<void>` | – | Async loader fired by `InfiniteLoaderComponent` when more rows need to be fetched. |
| `hasMoreFiles` | `boolean` | – | Indicates whether there are more items to request. |
| `noSelect` | `boolean` | `false` | When `true`, disables text selection inside the container via a helper class. |
