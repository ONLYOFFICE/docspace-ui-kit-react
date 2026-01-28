# trimSeparator

Utility function for cleaning up context menu arrays by removing redundant separators, disabled items, and optimizing separator placement for better UX.

## Usage

```ts
import { trimSeparator } from "@docspace/ui-kit/utils/trim-separator";

const menuItems = [
  { key: "edit", label: "Edit" },
  { key: "sep1", isSeparator: true },
  { key: "disabled", label: "Disabled", disabled: true },
  { key: "sep2", isSeparator: true },
  { key: "delete", label: "Delete" },
];

const cleanedItems = trimSeparator(menuItems);
// Result: [{ key: "edit" }, { isSeparator: true }, { key: "delete" }]
```

## API

```ts
trimSeparator(array: ContextMenuModel[]): ContextMenuModel[]
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `array` | `ContextMenuModel[]` | Array of context menu items |

### Returns

Returns a cleaned `ContextMenuModel[]` with:
- No leading separators
- No trailing separators
- No consecutive separators
- No disabled items

## Behavior

### Basic Cleaning

The function performs these operations:
1. Removes disabled items (`disabled: true`)
2. Removes leading separators
3. Removes trailing separators
4. Collapses consecutive separators into one

### Smart Separator Optimization

When the menu has **fewer than 6 non-separator items**, the function applies additional optimization:

- Removes all separators **except** those immediately before destructive actions
- Destructive actions include:
  - `delete`
  - `remove-from-recent`
  - `remove-shared-folder-or-file`
  - `remove-shared-room`
  - `unsubscribe`

This ensures destructive actions remain visually separated from other actions for safety, while reducing visual clutter in small menus.

## Examples

### Basic Cleanup

```ts
const input = [
  { key: "sep", isSeparator: true },
  { key: "edit", label: "Edit" },
  { key: "sep", isSeparator: true },
  { key: "sep", isSeparator: true },
  { key: "copy", label: "Copy" },
  { key: "sep", isSeparator: true },
];

trimSeparator(input);
// Result: [{ key: "edit" }, { isSeparator: true }, { key: "copy" }]
```

### Disabled Item Removal

```ts
const input = [
  { key: "edit", label: "Edit" },
  { key: "share", label: "Share", disabled: true },
  { key: "copy", label: "Copy" },
];

trimSeparator(input);
// Result: [{ key: "edit" }, { key: "copy" }]
```

### Destructive Action Separator (Small Menu)

```ts
const input = [
  { key: "edit", label: "Edit" },
  { key: "copy", label: "Copy" },
  { key: "sep", isSeparator: true },
  { key: "delete", label: "Delete" },
];

trimSeparator(input);
// Result: [{ key: "edit" }, { key: "copy" }, { isSeparator: true }, { key: "delete" }]
// Separator before "delete" is preserved for safety
```

### Large Menu (6+ Items)

```ts
const input = [
  { key: "item1", label: "Item 1" },
  { key: "item2", label: "Item 2" },
  { key: "sep", isSeparator: true },
  { key: "item3", label: "Item 3" },
  { key: "item4", label: "Item 4" },
  { key: "sep", isSeparator: true },
  { key: "item5", label: "Item 5" },
  { key: "item6", label: "Item 6" },
];

trimSeparator(input);
// All separators preserved (6+ non-separator items)
```

## Use Cases

- Cleaning dynamically generated context menus
- Removing separators that became redundant after conditional item filtering
- Ensuring consistent separator placement across different menu configurations
- Maintaining visual separation for dangerous/destructive actions
