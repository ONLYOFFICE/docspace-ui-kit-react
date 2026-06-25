# EmptyView

A component for displaying empty states with customizable icons, titles, descriptions, and interactive options. Use it to guide users when no content is available.

## Features

- **Visual Feedback**: Display an icon to illustrate the empty state
- **Flexible Content**: Support for title and description text
- **Multiple Option Types**: Links, buttons, and interactive items
- **Router Agnostic**: Pass your own router Link component via `LinkRouter` prop
- **Context Menu Support**: Items can have context menus

## Installation

```tsx
import { EmptyView } from "@docspace/ui-kit/components/empty-view";
```

For applications using react-router, use the shared wrapper which provides the Link component:

```tsx
import { EmptyView } from "@docspace/ui-kit/components/empty-view";
```

## Usage

```tsx
// Basic empty state
<EmptyView
  icon={<EmptyFolderIcon />}
  title="This folder is empty"
  description="Upload files or create new documents to get started"
  options={null}
/>

// With link options (requires LinkRouter prop or shared wrapper)
<EmptyView
  icon={<NoResultsIcon />}
  title="No results found"
  description="Try adjusting your search or filter"
  options={[
    {
      key: "clear-filter",
      icon: <ClearIcon />,
      to: "/files",
      description: "Clear filter",
    },
  ]}
  LinkRouter={Link}
/>

// With button option
<EmptyView
  icon={<WelcomeIcon />}
  title="Welcome"
  description="Get started by creating your first item"
  options={[
    {
      key: "create",
      type: "button",
      title: "Create New",
      onClick: handleCreate,
    },
  ]}
/>

// With item options
<EmptyView
  icon={<EmptyIcon />}
  title="No items"
  description="Choose how to add content"
  options={[
    {
      key: "upload",
      title: "Upload files",
      description: "Upload from your device",
      icon: <UploadIcon />,
      onClick: handleUpload,
    },
    {
      key: "create",
      title: "Create document",
      description: "Create a new document",
      icon: <CreateIcon />,
      onClick: handleCreate,
    },
  ]}
/>
```

## Properties

| Prop          | Type                              | Required | Default | Description                                    |
| ------------- | --------------------------------- | :------: | ------- | ---------------------------------------------- |
| `title`       | `string`                          |    ✓     | -       | Main title text displayed below the icon       |
| `description` | `ReactNode`                       |    ✓     | -       | Description text or content                    |
| `icon`        | `ReactElement`                    |    ✓     | -       | Icon component to display                      |
| `options`     | `EmptyViewOptionsType \| null`    |    ✓     | -       | Array of interactive options (can be null)     |
| `LinkRouter`  | `ComponentType<LinkRouterProps>`  |    -     | -       | Router Link component for navigation links     |

## Option Types

Options array can contain three types of elements:

### Link Option

Used for navigation links. Requires `LinkRouter` prop to be set.

| Prop          | Type                                    | Required | Default | Description                        |
| ------------- | --------------------------------------- | :------: | ------- | ---------------------------------- |
| `key`         | `React.Key`                             |    ✓     | -       | Unique identifier                  |
| `to`          | `string`                                |    ✓     | -       | Target route or URL                |
| `icon`        | `ReactElement`                          |    ✓     | -       | Icon to display                    |
| `description` | `string`                                |    ✓     | -       | Link text                          |
| `state`       | `unknown`                               |    -     | -       | State to pass to the router        |
| `onClick`     | `MouseEventHandler<HTMLAnchorElement>`  |    -     | -       | Click handler                      |
| `className`   | `string`                                |    -     | -       | Additional CSS class               |
| `isNext`      | `boolean`                               |    -     | -       | Use regular link instead of router |

### Button Option

Used for action buttons.

| Prop        | Type                            | Required | Default | Description          |
| ----------- | ------------------------------- | :------: | ------- | -------------------- |
| `key`       | `React.Key`                     |    ✓     | -       | Unique identifier    |
| `type`      | `"button"`                      |    ✓     | -       | Must be `"button"`   |
| `title`     | `string`                        |    ✓     | -       | Button label         |
| `onClick`   | `MouseEventHandler<HTMLElement>`|    -     | -       | Click handler        |
| `className` | `string`                        |    -     | -       | Additional CSS class |

### Item Option

Used for clickable list items with optional context menu.

| Prop          | Type                            | Required | Default | Description                  |
| ------------- | ------------------------------- | :------: | ------- | ---------------------------- |
| `key`         | `React.Key`                     |    ✓     | -       | Unique identifier            |
| `title`       | `string`                        |    ✓     | -       | Item title                   |
| `description` | `ReactNode`                     |    ✓     | -       | Item description             |
| `icon`        | `ReactElement`                  |    ✓     | -       | Icon to display              |
| `onClick`     | `(event) => void`               |    -     | -       | Click handler                |
| `disabled`    | `boolean`                       |    -     | `false` | Disable the item             |
| `model`       | `ContextMenuModel[]`            |    -     | -       | Context menu configuration   |

## Examples

### Filter Empty State

```tsx
import { EmptyView } from "@docspace/ui-kit/components/empty-view";
import EmptyFilterIcon from "PUBLIC_DIR/images/emptyFilter/empty.filter.svg";
import ClearFilterIcon from "PUBLIC_DIR/images/clear.empty.filter.svg";

const FilterEmptyState = ({ onClearFilter }) => (
  <EmptyView
    icon={<EmptyFilterIcon />}
    title="No results matching your search"
    description="Try adjusting your filter options"
    options={[
      {
        key: "clear",
        icon: <ClearFilterIcon />,
        to: "/files",
        description: "Clear filter",
      },
    ]}
  />
);
```

### Welcome State with Actions

```tsx
import { EmptyView } from "@docspace/ui-kit";

const WelcomeState = ({ onUpload, onCreate }) => (
  <EmptyView
    icon={<WelcomeIcon />}
    title="Welcome to your workspace"
    description="Get started by uploading files or creating documents"
    options={[
      {
        key: "upload",
        title: "Upload files",
        description: "Upload from your device",
        icon: <UploadIcon />,
        onClick: onUpload,
      },
      {
        key: "create",
        title: "Create document",
        description: "Start with a blank document",
        icon: <DocumentIcon />,
        onClick: onCreate,
      },
    ]}
  />
);
```

## Styling

The component uses CSS modules. Available CSS classes for customization:

- `.wrapper` - Main container
- `.header` - Header section containing icon and text
- `.headerTitle` - Title text
- `.subheading` - Description text
- `.body` - Options container
- `.link` - Link option styling
- `.button` - Button option styling
- `.itemWrapper` - Item option container
