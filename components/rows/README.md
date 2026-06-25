# Rows

A set of components for rendering items in a row-based list layout. Provides `Row`, `RowContent`, and `RowContainer` along with skeleton placeholders for loading states.

## Usage

```tsx
import { Row, RowContent, RowContainer } from "@docspace/ui-kit/components/rows";

<RowContainer>
  <Row
    checked={isSelected}
    onSelect={handleSelect}
    contextOptions={contextMenuItems}
    element={<Avatar />}
  >
    <RowContent>
      <span>Item Title</span>
      <span>Additional Info</span>
    </RowContent>
  </Row>
</RowContainer>
```

## Exports

- **`Row`** — A single row with checkbox, element slot, content area, and context menu
- **`RowContent`** — Content layout inside a row (title + side elements)
- **`RowContainer`** — Wrapper that manages the list of rows
- **`IndexIconButtons`** — Index editing buttons for VDR indexing mode
- **`RowSkeleton`** — Single row skeleton placeholder
- **`RowsSkeleton`** — Multiple row skeleton placeholders

## Row Properties

| Prop                     | Type                                  | Default     | Description                                          |
|--------------------------|---------------------------------------|-------------|------------------------------------------------------|
| `checked`                | `boolean`                             | —           | Checkbox checked state                               |
| `children`               | `ReactElement`                        | —           | Row content (typically `RowContent`)                 |
| `element`                | `ReactElement`                        | —           | Element displayed in the first slot (e.g., avatar)   |
| `contentElement`         | `ReactNode`                           | —           | Additional content element                           |
| `contextOptions`         | `ContextMenuModel[]`                  | —           | Context menu items                                   |
| `onSelect`               | `(checked, data?) => void`            | —           | Selection change callback                            |
| `onRowClick`             | `(e: MouseEvent) => void`             | —           | Click handler for the row (excluding checkbox/menu)  |
| `getContextModel`        | `() => ContextMenuModel[]`            | —           | Dynamic context menu model getter                    |
| `mode`                   | `"modern" \| "default"`               | —           | Row display mode                                     |
| `withoutBorder`          | `boolean`                             | —           | Removes row borders                                  |
| `inProgress`             | `boolean`                             | —           | Shows a loading indicator                            |
| `isIndexEditingMode`     | `boolean`                             | —           | Enables VDR index editing controls                   |
| `badgesComponent`        | `ReactNode`                           | —           | Badges displayed in the row                          |
| `isDisabled`             | `boolean`                             | —           | Disables the row checkbox                            |

## Examples

### Basic Row List

```tsx
<RowContainer>
  {items.map((item) => (
    <Row
      key={item.id}
      element={<Icon />}
      contextOptions={item.contextOptions}
    >
      <RowContent>
        <span>{item.title}</span>
      </RowContent>
    </Row>
  ))}
</RowContainer>
```

### Loading State

```tsx
import { RowsSkeleton } from "@docspace/ui-kit/components/rows";

<RowsSkeleton count={5} />
```
