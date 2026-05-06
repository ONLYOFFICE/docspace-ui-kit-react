# NavMenu

Sidebar navigation menu with collapsible groups and sub-items. Supports light/dark themes, RTL layout, and externally controlled active state.

## Usage

```tsx
import { NavMenu } from "@docspace/ui-kit/components/nav-menu";
import type { NavMenuGroup } from "@docspace/ui-kit/components/nav-menu";

import FolderIconUrl from "@docspace/ui-kit/assets/icons/16/catalog.folder.react.svg?url";
import TrashIconUrl from "@docspace/ui-kit/assets/icons/16/catalog.trash.react.svg?url";

const groups: NavMenuGroup[] = [
  {
    id: "main",
    label: "My Files",
    items: [
      {
        id: "documents",
        label: "Documents",
        icon: FolderIconUrl,
        onClick: (item) => console.log("clicked", item.id),
        children: [
          {
            id: "trash",
            label: "Trash",
            icon: TrashIconUrl,
            onClick: (sub) => console.log("clicked", sub.id),
          },
        ],
      },
    ],
  },
];

<NavMenu
  groups={groups}
  activeItemId="documents"
  defaultExpandedId="documents"
/>
```

## Features

- **Groups**: items are organized into named groups with a section label
- **Collapsible sub-items**: clicking an item with children expands the list with a smooth animation
- **Single expanded section**: opening a new section automatically collapses the previously expanded one
- **Open-only animation**: expanding is animated (0.25s ease-in-out), collapsing is instant
- **Active item**: controlled via `activeItemId`, highlights the icon with the accent color
- **Icons**: accepted as a URL string (`icon`) or a React node (`iconNode`)
- **Badge**: numeric, icon, or custom component badge on any item via `showBadge` + `labelBadge` / `badgeComponent`; badge click is isolated from item click via `onClickBadge`
- **RTL**: uses CSS logical properties (`padding-inline-start/end`)
- **Themes**: light/dark support via CSS custom properties
- **Accessibility**: `aria-expanded` on items with children, semantic markup (`nav`, `ul`, `li`, `button`)
- **forwardRef** on the root `<nav>` element

## Properties

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `groups` | `NavMenuGroup[]` | — | Array of groups containing navigation items |
| `activeItemId` | `string` | — | `id` of the currently active item or sub-item |
| `defaultExpandedId` | `string` | — | `id` of the item expanded by default |
| `withAnimation` | `boolean` | `false` | Enables progress-bar animation on item click |
| `className` | `string` | — | Additional CSS class on the root element |
| `LinkRouter` | `React.ComponentType<LinkRouterProps>` | — | Router link component; when provided, items with `linkData` render as links instead of buttons |
| `iconOnly` | `boolean` | `false` | Collapses the menu to icons only — hides text labels, badges, and group labels; sub-items are not rendered |

## Types

```ts
type NavMenuLinkData = {
  path: string;
  state?: unknown;
};

type NavMenuGroup = {
  id: string;
  label: string;
  items: NavMenuItem[];
};

type NavMenuItem = {
  id: string;
  label: string;
  icon?: string;                          // SVG file URL (import with ?url)
  iconNode?: React.ReactNode;
  onClick?: (item: NavMenuItem) => void;
  children?: NavSubItem[];
  showBadge?: boolean;                    // Show a badge on the item
  labelBadge?: string | number;           // Numeric or text badge label
  badgeComponent?: React.ReactNode;       // Custom badge component (overrides labelBadge)
  onClickBadge?: (id: string) => void;   // Called with item id; does not trigger onClick
  linkData?: NavMenuLinkData;             // When set and LinkRouter provided, renders as a link
};

type NavSubItem = {
  id: string;
  label: string;
  icon?: string;
  iconNode?: React.ReactNode;
  onClick?: (item: NavSubItem) => void;
  linkData?: NavMenuLinkData;
};
```

## Badge

Set `showBadge: true` on any `NavMenuItem` to display a badge after the item label.

```tsx
// Numeric badge
{ id: "rooms", label: "Rooms", showBadge: true, labelBadge: 5 }

// Custom badge component (e.g. "new" tag)
{ id: "agents", label: "Agents", showBadge: true, badgeComponent: <Badge label="new" /> }

// With click handler (does not trigger item's onClick)
{
  id: "files",
  label: "Files",
  showBadge: true,
  labelBadge: 12,
  onClickBadge: (id) => console.log("badge clicked on", id),
}
```

## Icon-only mode

Set `iconOnly` to collapse the menu to icons. Text labels, badges, and group labels are hidden;
sub-items are not rendered. Items still fire `onClick`.

```tsx
<NavMenu groups={groups} activeItemId={activeId} iconOnly />
```

In icon-only mode each button receives a `title` attribute equal to the item label, providing
a native hover tooltip. Pair with a toggle button to let users expand and collapse the sidebar.

## CSS Custom Properties

The component can be customized via CSS variables on a parent element:

| Variable | Description |
|----------|-------------|
| `--nav-menu-group-label-color` | Group label text color |
| `--nav-menu-item-text-color` | Item text color |
| `--nav-menu-item-icon-color` | Icon fill color in default state |
| `--nav-menu-item-icon-active-color` | Icon fill color for the active item |
| `--nav-menu-item-bg-hover` | Background color on hover |
| `--nav-menu-item-bg-active` | Background color for the active item |
