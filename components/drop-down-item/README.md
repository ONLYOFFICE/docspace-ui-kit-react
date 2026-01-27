# DropDownItem

A versatile dropdown item component used for menus, lists, and selection interfaces. Supports various display modes including separator, header, submenu, and interactive states.

## Usage

```jsx
import { DropDownItem } from "@docspace/ui-kit/components/drop-down-item";
import SettingsIcon from "PUBLIC_DIR/images/settings.react.svg?url";

const MyComponent = () => {
  return (
    <DropDownItem
      label="Settings"
      icon={SettingsIcon}
      onClick={() => console.log("clicked")}
    />
  );
};
```

## Properties

### Display and Layout

| Name          | Type    | Default | Description                                              |
|---------------|---------|---------|----------------------------------------------------------|
| isSeparator   | boolean | false   | Renders the item as a separator line                     |
| isHeader      | boolean | false   | Renders the item as a header with special styling        |
| isModern      | boolean | false   | Uses modern compact styling with minimal padding         |
| textOverflow  | boolean | false   | Truncates text with ellipsis when it overflows           |
| height        | number  | -       | Custom height in pixels                                  |
| heightTablet  | number  | -       | Custom height for tablet devices in pixels               |
| minWidth      | string  | -       | Minimum width of the item                                |

### Icon Related

| Name            | Type                                      | Default | Description                                              |
|-----------------|-------------------------------------------|---------|----------------------------------------------------------|
| icon            | string \| ReactElement \| ElementType     | -       | URL or component for the icon                            |
| fillIcon        | boolean                                   | true    | Fills icon with current text color                       |
| withoutIcon     | boolean                                   | false   | Hides icon even when provided                            |
| withHeaderArrow | boolean                                   | false   | Shows back arrow when item is a header                   |
| headerArrowAction | () => void                              | -       | Callback when header arrow is clicked                    |

### Content

| Name              | Type            | Default | Description                                    |
|-------------------|-----------------|---------|------------------------------------------------|
| label             | string \| ReactNode | ""   | Primary text content                           |
| children          | ReactNode       | -       | Additional content after the label             |
| additionalElement | ReactNode       | -       | Element rendered at the end of the item        |

### State and Interaction

| Name              | Type    | Default | Description                                    |
|-------------------|---------|---------|------------------------------------------------|
| disabled          | boolean | false   | Disables the item                              |
| isActive          | boolean | false   | Shows active/pressed state                     |
| isSelected        | boolean | false   | Shows selected state                           |
| isActiveDescendant| boolean | false   | Keyboard navigation active state               |
| noHover           | boolean | false   | Disables hover effect                          |
| noActive          | boolean | false   | Disables active state styling                  |
| isSubMenu         | boolean | false   | Shows submenu arrow                            |

### Badge Props

| Name        | Type    | Default | Description                                    |
|-------------|---------|---------|------------------------------------------------|
| isBeta      | boolean | false   | Shows beta badge                               |
| betaLabel   | string  | -       | Label text for beta badge                      |
| isPaidBadge | boolean | false   | Shows paid/premium badge                       |
| paidLabel   | string  | -       | Label text for paid badge                      |
| badgeLabel  | string  | -       | Alternative label for paid badge               |

### Toggle Props

| Name       | Type    | Default | Description                                    |
|------------|---------|---------|------------------------------------------------|
| withToggle | boolean | false   | Shows toggle switch at the end                 |
| checked    | boolean | false   | Toggle checked state                           |

### Event Handlers

| Name                | Type                                      | Default | Description                              |
|---------------------|-------------------------------------------|---------|------------------------------------------|
| onClick             | (e: MouseEvent \| ChangeEvent) => void    | -       | Click handler                            |
| onMouseDown         | (e: MouseEvent) => void                   | -       | Mouse down handler                       |
| onClickSelectedItem | () => void                                | -       | Handler when selected item is clicked    |
| setOpen             | (open: boolean) => void                   | -       | Controls parent dropdown open state      |

### Styling

| Name      | Type            | Default          | Description                              |
|-----------|-----------------|------------------|------------------------------------------|
| className | string          | -                | CSS class name                           |
| style     | CSSProperties   | -                | Inline styles                            |
| id        | string          | -                | HTML ID attribute                        |
| tabIndex  | number          | -1               | Tab index for keyboard navigation        |
| testId    | string          | "drop-down-item" | Test ID for the component                |
| tooltip   | string          | -                | Tooltip text (shown when disabled)       |

## Styling

The component uses CSS modules with CSS variables for theming:

```css
--drop-down-item-icon-color
--drop-down-item-icon-color-disabled
--drop-down-item-hover-color
--drop-down-min-width
--dropdown-item-separator-border
--dropdown-item-disabled-color
--dropdown-item-selected-color
```

## Examples

### Basic Item
```jsx
<DropDownItem label="Click me" onClick={() => {}} />
```

### Item with Icon
```jsx
<DropDownItem
  label="Settings"
  icon={SettingsIcon}
  onClick={() => {}}
/>
```

### Separator
```jsx
<DropDownItem isSeparator />
```

### Header
```jsx
<DropDownItem
  label="Menu Header"
  isHeader
/>
```

### Header with Back Arrow
```jsx
<DropDownItem
  label="Back"
  isHeader
  withHeaderArrow
  headerArrowAction={() => goBack()}
/>
```

### Submenu Item
```jsx
<DropDownItem
  label="More Options"
  icon={MoreIcon}
  isSubMenu
/>
```

### Item with Toggle
```jsx
<DropDownItem
  label="Dark Mode"
  withToggle
  checked={isDarkMode}
  onClick={() => toggleDarkMode()}
/>
```

### Item with Beta Badge
```jsx
<DropDownItem
  label="AI Assistant"
  icon={AIIcon}
  isBeta
  betaLabel="Beta"
/>
```

### Item with Paid Badge
```jsx
<DropDownItem
  label="Advanced Analytics"
  icon={ChartIcon}
  isPaidBadge
  paidLabel="Pro"
/>
```

### Disabled Item with Tooltip
```jsx
<DropDownItem
  label="Unavailable Feature"
  disabled
  tooltip="Upgrade to access this feature"
/>
```

### Item with Keyboard Shortcut
```jsx
<DropDownItem
  label="Save"
  icon={SaveIcon}
  additionalElement={<span>Ctrl+S</span>}
/>
```

### Selected Item
```jsx
<DropDownItem
  label="Option 1"
  isSelected
/>
```

### Text Overflow
```jsx
<DropDownItem
  label="This is a very long label that will be truncated"
  textOverflow
  minWidth="200px"
/>
```
