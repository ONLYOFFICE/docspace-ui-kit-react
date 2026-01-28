# ContextMenu

Context menu component for displaying contextual actions. Supports submenus, headers, separators, toggles, badges, hotkeys, and mobile-responsive layouts.

## Usage

```tsx
import { ContextMenu } from "@docspace/ui-kit/components/context-menu";
import type { ContextMenuModel, ContextMenuRefType } from "@docspace/ui-kit/components/context-menu";

const menuRef = useRef<ContextMenuRefType>(null);

const model: ContextMenuModel[] = [
  { key: "edit", label: "Edit", icon: editIcon, onClick: handleEdit },
  { key: "copy", label: "Copy", icon: copyIcon, onClick: handleCopy },
  { key: "sep1", isSeparator: true },
  { key: "delete", label: "Delete", icon: deleteIcon, onClick: handleDelete },
];

<ContextMenu ref={menuRef} model={model} />

// Show menu programmatically
const handleRightClick = (e: React.MouseEvent) => {
  menuRef.current?.show(e);
};
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `model` | `ContextMenuModel[]` | - | Array of menu items |
| `header` | `HeaderType` | - | Header with icon, title, and optional avatar |
| `id` | `string` | `"contextMenu"` | Unique identifier |
| `className` | `string` | - | Additional CSS class |
| `style` | `CSSProperties` | - | Inline styles |
| `global` | `boolean` | - | Attach menu to document |
| `withBackdrop` | `boolean` | `true` | Show backdrop overlay |
| `ignoreChangeView` | `boolean` | - | Ignore mobile view restrictions |
| `autoZIndex` | `boolean` | - | Automatic z-index layering |
| `baseZIndex` | `number` | - | Base z-index value |
| `appendTo` | `HTMLElement` | - | DOM element to mount menu |
| `onShow` | `(e) => void` | - | Callback when menu shows |
| `onHide` | `(e) => void` | - | Callback when menu hides |
| `containerRef` | `RefObject<HTMLDivElement>` | - | Reference to container |
| `scaled` | `boolean` | - | Scale width by container |
| `fillIcon` | `boolean` | - | Fill icons with default colors |
| `getContextModel` | `() => ContextMenuModel[]` | - | Dynamic model getter |
| `leftOffset` | `number` | - | Left position offset |
| `rightOffset` | `number` | - | Right position offset |
| `isRoom` | `boolean` | - | Room context styling |
| `isArchive` | `boolean` | - | Archive context styling |
| `badgeUrl` | `string` | - | Badge icon URL |
| `headerOnlyMobile` | `boolean` | - | Show header only on mobile |
| `maxHeightLowerSubmenu` | `number` | - | Max height for lower submenus |
| `showDisabledItems` | `boolean` | - | Show disabled items |
| `withHotkeys` | `boolean` | - | Enable keyboard navigation |
| `withoutBackHeaderButton` | `boolean` | - | Hide back button in header |
| `dataTestId` | `string` | - | Test ID |

## Types

### ContextMenuModel

```ts
type ContextMenuModel = ContextMenuType | SeparatorType;
```

### ContextMenuType

```ts
type ContextMenuType = {
  key: string | number;
  label: string | ReactNode;
  icon?: string;
  disabled?: boolean;
  onClick?: (value, item?) => void;
  items?: ContextMenuModel[];       // Submenu items
  url?: string;                      // External link
  target?: string;                   // Link target
  isHeader?: boolean;                // Header item
  isLoader?: boolean;                // Show loader
  onLoad?: () => Promise<ContextMenuModel[]>;  // Async load
  withToggle?: boolean;              // Toggle switch
  checked?: boolean;                 // Toggle state
  badgeLabel?: string;               // Badge text
  isPaidBadge?: boolean;             // Paid feature badge
  className?: string;
  style?: CSSProperties;
  dataTestId?: string;
};
```

### SeparatorType

```ts
type SeparatorType = {
  key: string | number;
  isSeparator: true;
  disabled?: boolean;
};
```

### HeaderType

```ts
type HeaderType = {
  title: string;
  icon?: string;
  avatar?: string;
  logo?: string;
  badgeUrl?: string;
};
```

### ContextMenuRefType

```ts
type ContextMenuRefType = {
  show: (e: MouseEvent) => void;
  hide: (e: MouseEvent | Event) => void;
  toggle: (e: MouseEvent | Event) => boolean | undefined;
  menuRef: RefObject<HTMLDivElement>;
};
```

## CSS Variables

The component uses CSS variables for theming, defined locally within the component:

| Variable | Light | Dark | Description |
|----------|-------|------|-------------|
| `--context-menu-background` | `#ffffff` | `#333333` | Menu background |
| `--context-menu-border` | `none` | `1px solid #474747` | Menu border |
| `--context-menu-header-border` | `1px solid #eceef1` | `1px solid #474747` | Header border |
| `--context-menu-box-shadow` | `0px 8px 16px 0px rgba(...)` | `0px 8px 16px 0px rgba(...)` | Box shadow |
| `--context-menu-header-text-color` | `#333333` | `#ffffff` | Header text color |
| `--context-menu-header-text-margin` | `0 0 0 8px` | `0 0 0 8px` | Header text margin |
| `--context-menu-submenu-list-margin` | `4px` | `4px` | Submenu margin |
| `--context-menu-button-border` | `#d0d5da` | `#858585` | Button border |
| `--context-menu-button-hover-border` | `#a3a9ae` | `#858585` | Button hover border |
| `--sub-menu-item-background-color` | `#ffffff` | `#333333` | Item background |
| `--sub-menu-item-hover-background-color` | `#f8f9f9` | `#3d3d3d` | Item hover background |
| `--sub-menu-item-disabled-color` | `#a3a9ae` | `#a3a9ae` | Disabled item color |
| `--sub-menu-item-disabled-background-color` | `#ffffff` | `#333333` | Disabled item background |
| `--drop-down-item-hover-color` | `#f8f9f9` | `#3d3d3d` | Dropdown item hover |

## Examples

### Basic Menu

```tsx
const model = [
  { key: "edit", label: "Edit", onClick: () => {} },
  { key: "copy", label: "Copy", onClick: () => {} },
  { key: "delete", label: "Delete", onClick: () => {} },
];

<ContextMenu model={model} />
```

### With Icons

```tsx
const model = [
  { key: "edit", label: "Edit", icon: editIcon, onClick: handleEdit },
  { key: "copy", label: "Copy", icon: copyIcon, onClick: handleCopy },
];

<ContextMenu model={model} fillIcon />
```

### With Separators

```tsx
const model = [
  { key: "edit", label: "Edit", onClick: handleEdit },
  { key: "copy", label: "Copy", onClick: handleCopy },
  { key: "sep", isSeparator: true },
  { key: "delete", label: "Delete", onClick: handleDelete },
];

<ContextMenu model={model} />
```

### With Header

```tsx
const header = {
  title: "Document.pdf",
  icon: "/icons/pdf.svg",
};

<ContextMenu model={model} header={header} />
```

### With Submenu

```tsx
const model = [
  { key: "edit", label: "Edit", onClick: handleEdit },
  {
    key: "share",
    label: "Share",
    items: [
      { key: "email", label: "Email", onClick: handleEmail },
      { key: "link", label: "Copy Link", onClick: handleLink },
    ],
  },
];

<ContextMenu model={model} />
```

### With Toggle

```tsx
const model = [
  {
    key: "notifications",
    label: "Notifications",
    withToggle: true,
    checked: isEnabled,
    onClick: () => setIsEnabled(!isEnabled),
  },
];

<ContextMenu model={model} />
```

### With Badge

```tsx
const model = [
  {
    key: "premium",
    label: "Premium Feature",
    badgeLabel: "PRO",
    isPaidBadge: true,
    onClick: handlePremium,
  },
];

<ContextMenu model={model} />
```

### Programmatic Control

```tsx
const menuRef = useRef<ContextMenuRefType>(null);

const handleContextMenu = (e: React.MouseEvent) => {
  e.preventDefault();
  menuRef.current?.show(e);
};

<div onContextMenu={handleContextMenu}>
  Right-click me
</div>

<ContextMenu ref={menuRef} model={model} />
```

### With Hotkeys

```tsx
<ContextMenu model={model} withHotkeys />
```

### Async Loading

```tsx
const model = [
  {
    key: "share",
    label: "Share with...",
    isLoader: true,
    onLoad: async () => {
      const users = await fetchUsers();
      return users.map(u => ({
        key: u.id,
        label: u.name,
        onClick: () => shareWith(u.id),
      }));
    },
  },
];

<ContextMenu model={model} />
```
