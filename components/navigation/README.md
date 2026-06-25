# Navigation

The top navigation bar component that displays the current folder path with breadcrumb navigation, action buttons (create, context menu, info panel toggle), and an expandable dropdown for folder hierarchy.

## Usage

```tsx
import { Navigation } from "@docspace/ui-kit/components/navigation";

<Navigation
  title="My Documents"
  isRootFolder={false}
  isRootFolderTitle={false}
  canCreate={true}
  navigationItems={[
    { id: "1", title: "Root", isRootRoom: true },
    { id: "2", title: "My Documents", isRootRoom: false },
  ]}
  getContextOptionsFolder={getContextOptions}
  getContextOptionsPlus={getPlusOptions}
  onClickFolder={handleFolderClick}
  onBackToParentFolder={handleBack}
  toggleInfoPanel={toggleInfoPanel}
  isInfoPanelVisible={false}
  isDesktop={true}
  showText={true}
  burgerLogo="/logo.svg"
  // ...other required props
/>
```

## Features

- **Breadcrumb navigation**: Expandable dropdown showing the full folder path
- **Back button**: Arrow button to navigate to the parent folder
- **Create button** (Plus): Context menu for creating new items
- **Context menu button**: Folder-specific actions
- **Info panel toggle**: Show/hide the info panel
- **Title badges**: Icon badges next to the folder title
- **Responsive**: Adapts to desktop and mobile layouts
- **Trash warning**: Displays a warning bar when viewing the trash folder
- **Navigation button**: Optional action button with custom label
- **Tariff bar**: Optional tariff/plan information bar

## Sub-components

- **ArrowButton** — Back navigation arrow
- **ContextButton** — Folder context menu trigger
- **PlusButton** — Create new item menu trigger
- **ToggleInfoPanelButton** — Info panel visibility toggle
- **NavigationLogo** — Logo displayed in the dropdown
- **Text** — Title text with optional badge
- **DropBox** — Expandable breadcrumb dropdown

## Key Properties

| Prop                       | Type                          | Default | Description                                          |
|----------------------------|-------------------------------|---------|------------------------------------------------------|
| `title`                    | `string`                      | —       | Current folder title                                 |
| `isRootFolder`             | `boolean`                     | —       | Whether the current folder is the root               |
| `navigationItems`          | `TNavigationItem[]`           | —       | Breadcrumb path items                                |
| `onClickFolder`            | `TOnNavigationItemClick`      | —       | Callback when a breadcrumb item is clicked           |
| `onBackToParentFolder`     | `() => void`                  | —       | Callback for the back button                         |
| `canCreate`                | `boolean`                     | —       | Shows the plus/create button                         |
| `getContextOptionsFolder`  | `TGetContextMenuModel`        | —       | Returns context menu items for the folder            |
| `getContextOptionsPlus`    | `TGetContextMenuModel`        | —       | Returns context menu items for the plus button       |
| `isInfoPanelVisible`       | `boolean`                     | —       | Whether the info panel is currently visible          |
| `toggleInfoPanel`          | `(e?: MouseEvent) => void`    | —       | Toggles info panel visibility                        |
| `isDesktop`                | `boolean`                     | —       | Whether the current device is desktop                |
| `showText`                 | `boolean`                     | —       | Whether to show text labels                          |
| `burgerLogo`               | `string`                      | —       | Logo URL for the navigation dropdown                 |
| `titleIcon`                | `string`                      | —       | Icon displayed next to the title                     |
| `showRootFolderTitle`      | `boolean`                     | —       | Whether to show the root folder title                |
| `showNavigationButton`     | `boolean`                     | —       | Shows an additional navigation action button         |
| `navigationButtonLabel`    | `string`                      | —       | Label for the navigation action button               |
| `onNavigationButtonClick`  | `() => void`                  | —       | Callback for the navigation action button            |
