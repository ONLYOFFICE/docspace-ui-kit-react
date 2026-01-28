# ComboBox

A versatile and accessible combo box component that combines a text input with a dropdown list. It allows users to either type a value directly or choose from a predefined list of options. The component supports various display types, search functionality, and customizable styling options.

## Usage

```tsx
import { ComboBox, ComboBoxSize, ComboBoxDisplayType } from "@docspace/ui-kit/components/combobox";
import type { TOption, TComboboxProps } from "@docspace/ui-kit/components/combobox";

const options: TOption[] = [
  { key: 1, label: "Option 1" },
  { key: 2, label: "Option 2" },
  { key: 3, label: "Option 3" },
];

<ComboBox
  options={options}
  selectedOption={options[0]}
  onSelect={(option) => console.log("Selected:", option)}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `TOption[]` | - | **Required.** Array of options to display in the dropdown |
| `selectedOption` | `TOption` | - | **Required.** Currently selected option |
| `advancedOptions` | `ReactElement` | - | Displays advanced options content |
| `advancedOptionsCount` | `number` | - | Number of advanced options |
| `children` | `ReactNode` | - | Children elements |
| `className` | `string` | - | Additional CSS class |
| `dropDownClassName` | `string` | - | Class name for dropdown container |
| `comboIcon` | `string` | - | Icon for the combo button |
| `disableIconClick` | `boolean` | - | Disable icon click |
| `disableItemClick` | `boolean` | - | Disable item click |
| `disableItemClickFirstLevel` | `boolean` | - | Disable first level item click |
| `directionX` | `"left" \| "right"` | - | Horizontal direction of dropdown |
| `directionY` | `"top" \| "bottom"` | - | Vertical direction of dropdown |
| `displayType` | `ComboBoxDisplayType` | `"default"` | Component display type |
| `displaySelectedOption` | `boolean` | - | Display selected option |
| `displayArrow` | `boolean` | - | Display arrow |
| `dropDownMaxHeight` | `number` | `200` | Maximum height of dropdown in pixels |
| `dropDownTestId` | `string` | - | Test ID for dropdown |
| `showDisabledItems` | `boolean` | - | Shows disabled items when displayType !== toggle |
| `fillIcon` | `boolean` | - | Fill icon with default colors |
| `fixedDirection` | `boolean` | - | Fixed direction |
| `plusBadgeValue` | `number` | - | Value to display in the plus badge |
| `forceCloseClickOutside` | `boolean` | - | Force close on click outside |
| `hideMobileView` | `boolean` | - | Hide mobile view |
| `id` | `string` | - | Unique identifier |
| `dropDownId` | `string` | - | ID for dropdown container |
| `isAside` | `boolean` | - | Is aside mode |
| `isDisabled` | `boolean` | `false` | Disable the combobox |
| `isLoading` | `boolean` | `false` | Show loading state |
| `isDefaultMode` | `boolean` | - | Is default mode |
| `isMobileView` | `boolean` | - | Is mobile view |
| `isNoFixedHeightOptions` | `boolean` | - | Is no fixed height options |
| `manualWidth` | `string` | - | Manual width |
| `manualX` | `string` | - | Manual X position |
| `manualY` | `number \| string` | - | Manual Y position |
| `modernView` | `boolean` | - | Modern view styling |
| `noBorder` | `boolean` | `false` | Remove border from combobox |
| `offsetX` | `number` | - | Offset left |
| `opened` | `boolean` | - | Controlled open state |
| `optionStyle` | `CSSProperties` | - | Option style |
| `searchPlaceholder` | `string` | - | Placeholder text for search input |
| `scaled` | `boolean` | `true` | Enable scaling based on parent |
| `scaledOptions` | `boolean` | - | Scaled options |
| `setIsOpenItemAccess` | `(isOpen: boolean) => void` | - | Set is open item access callback |
| `size` | `ComboBoxSize` | `"base"` | Size of the combobox |
| `role` | `string` | - | ARIA role |
| `style` | `CSSProperties` | - | Inline styles |
| `tabIndex` | `number` | - | Tab index |
| `textOverflow` | `boolean` | - | Enable text overflow |
| `title` | `string` | - | Title attribute |
| `topSpace` | `number` | - | Top space |
| `type` | `TCombobox` | - | Type of the combobox |
| `usePortalBackdrop` | `boolean` | - | Use portal backdrop |
| `withBackdrop` | `boolean` | - | Show backdrop overlay |
| `withBackground` | `boolean` | - | With background |
| `withBlur` | `boolean` | - | With blur effect |
| `withLabel` | `boolean` | - | With label |
| `withoutBackground` | `boolean` | - | Without background |
| `withoutPadding` | `boolean` | - | Without padding |
| `withSearch` | `boolean` | `false` | Enable search functionality |
| `onBackdropClick` | `(e: Event) => void` | - | Callback on backdrop click |
| `onClickSelectedItem` | `(option: TOption) => void` | - | Callback on selected item click |
| `onSelect` | `(option: TOption) => void` | - | Callback when an option is selected |
| `onToggle` | `(e, isOpen: boolean) => void` | - | Callback on toggle |
| `shouldShowBackdrop` | `boolean` | - | Indicates if backdrop should be shown |
| `dataTestId` | `string` | - | Test ID |
| `noSelect` | `boolean` | - | Disables text selection |
| `useImageIcon` | `boolean` | - | Use an image icon |

## Types

### TOption

```ts
type TOption = TRegularOption | TSeparatorOption;

type TRegularOption = {
  key: string | number;
  label: string;
  icon?: string | React.ElementType | React.ReactElement;
  color?: string;
  backgroundColor?: string;
  border?: string;
  default?: boolean;
  disabled?: boolean;
  type?: string;
  description?: string;
  quota?: "free" | "paid";
  isSelected?: boolean;
  isBeta?: boolean;
  internal?: boolean;
  access?: ShareAccessRights;
  className?: string;
  title?: string;
  dataTestId?: string;
  action?: unknown;
  onClick?: (opt: TContextMenuValueTypeOnClick) => void;
  pageNumber?: number;
  count?: number;
  tooltip?: string;
  isSeparator?: boolean;
};

type TSeparatorOption = {
  key: string | number;
  isSeparator: true;
  // ... other optional properties
};
```

### ComboBoxDisplayType

```ts
enum ComboBoxDisplayType {
  default = "default",
  toggle = "toggle",
}
```

### ComboBoxSize

```ts
enum ComboBoxSize {
  base = "base",     // 173px
  middle = "middle", // 300px
  big = "big",       // 350px
  huge = "huge",     // 500px
  content = "content", // fit-content
}
```

## CSS Variables

The component uses CSS variables for theming, defined locally within the component:

| Variable | Light | Dark | Description |
|----------|-------|------|-------------|
| `--combobox-button-bg` | `#ffffff` | `#333333` | Button background |
| `--combobox-button-color` | `#333333` | `#858585` | Button text color |
| `--combobox-button-disabled-color` | `#a3a9ae` | `#858585` | Disabled button color |
| `--combobox-button-border` | `1px solid #a3a9ae` | `1px solid #474747` | Button border |
| `--combobox-button-open-border-color` | `var(--accent-main)` | `#ffffff` | Open state border color |
| `--combobox-button-disabled-border-color` | `#d0d5da` | `#474747` | Disabled border color |
| `--combobox-button-disabled-bg` | `#f8f9f9` | `#474747` | Disabled background |
| `--combobox-button-focus-bg-modern-view` | `#eceef1` | `#3d3d3d` | Modern view focus background |
| `--combobox-button-icon-button-color` | `#a3a9ae` | `#858585` | Icon button color |
| `--combobox-button-icon-button-hover-color` | `#657077` | `#ffffff` | Icon button hover color |
| `--combobox-button-hover-border-color` | `#a3a9ae` | `#858585` | Hover border color |
| `--combobox-button-hover-border-color-open` | `#4781d1` | `#ffffff` | Open state hover border color |
| `--combobox-button-hover-disabled-border-color` | `#d0d5da` | `#474747` | Disabled hover border color |
| `--combobox-button-hover-bg-modern-view` | `#d0d5da` | `#474747` | Modern view hover background |
| `--combobox-button-focus-open-border-color` | `var(--accent-main)` | `var(--combobox-button-hover-border-color)` | Focus open border color |
| `--combobox-label-selected-color` | `#333333` | `#ffffff` | Selected label color |
| `--combobox-label-disabled-color` | `#a3a9ae` | `#858585` | Disabled label color |
| `--combobox-label-alternative-color` | `#a3a9ae` | `#858585` | Alternative label color |
| `--combobox-plus-badge-bg-color` | `#a3a9ae` | `#858585` | Plus badge background |
| `--combobox-plus-badge-selected-bg-color` | `#657077` | `#5c5c5c` | Plus badge selected background |
| `--combobox-plus-badge-color` | `#ffffff` | `#333333` | Plus badge text color |
| `--combobox-children-button-color` | `#333333` | `#ffffff` | Children button color |
| `--combobox-children-button-disabled-color` | `#a3a9ae` | `#858585` | Children button disabled color |
| `--combobox-children-button-default-color` | `#a3a9ae` | `#ffffff` | Children button default color |
| `--combobox-children-button-default-disabled-color` | `#a3a9ae` | `#858585` | Children button default disabled color |
| `--combobox-children-button-selected-color` | `#333333` | `#ffffff` | Children button selected color |

## Examples

### Basic ComboBox

```tsx
const options: TOption[] = [
  { key: 1, label: "Option 1" },
  { key: 2, label: "Option 2" },
  { key: 3, label: "Option 3" },
];

<ComboBox
  options={options}
  selectedOption={options[0]}
  onSelect={(option) => setSelected(option)}
/>
```

### With Icons

```tsx
const options: TOption[] = [
  { key: "edit", label: "Edit", icon: editIcon },
  { key: "copy", label: "Copy", icon: copyIcon },
  { key: "delete", label: "Delete", icon: deleteIcon },
];

<ComboBox
  options={options}
  selectedOption={options[0]}
  onSelect={handleSelect}
  fillIcon
/>
```

### With Search

```tsx
<ComboBox
  options={options}
  selectedOption={selectedOption}
  onSelect={handleSelect}
  withSearch
  searchPlaceholder="Search options..."
/>
```

### With Separators

```tsx
const options: TOption[] = [
  { key: "edit", label: "Edit" },
  { key: "copy", label: "Copy" },
  { key: "sep1", isSeparator: true },
  { key: "delete", label: "Delete" },
];

<ComboBox
  options={options}
  selectedOption={options[0]}
  onSelect={handleSelect}
/>
```

### Different Sizes

```tsx
<ComboBox
  options={options}
  selectedOption={selectedOption}
  onSelect={handleSelect}
  size={ComboBoxSize.base}   // 173px
/>

<ComboBox
  options={options}
  selectedOption={selectedOption}
  onSelect={handleSelect}
  size={ComboBoxSize.middle} // 300px
/>

<ComboBox
  options={options}
  selectedOption={selectedOption}
  onSelect={handleSelect}
  size={ComboBoxSize.content} // fit-content
/>
```

### Modern View

```tsx
<ComboBox
  options={options}
  selectedOption={selectedOption}
  onSelect={handleSelect}
  modernView
/>
```

### No Border

```tsx
<ComboBox
  options={options}
  selectedOption={selectedOption}
  onSelect={handleSelect}
  noBorder
/>
```

### With Plus Badge

```tsx
<ComboBox
  options={options}
  selectedOption={selectedOption}
  onSelect={handleSelect}
  plusBadgeValue={5}
/>
```

### With Advanced Options

```tsx
<ComboBox
  options={options}
  selectedOption={selectedOption}
  onSelect={handleSelect}
  advancedOptions={
    <div>
      <button>Create new</button>
      <button>Import</button>
    </div>
  }
/>
```

### Controlled Open State

```tsx
const [isOpen, setIsOpen] = useState(false);

<ComboBox
  options={options}
  selectedOption={selectedOption}
  onSelect={handleSelect}
  opened={isOpen}
  onToggle={(e, open) => setIsOpen(open)}
/>
```

### Disabled State

```tsx
<ComboBox
  options={options}
  selectedOption={selectedOption}
  onSelect={handleSelect}
  isDisabled
/>
```

### Loading State

```tsx
<ComboBox
  options={options}
  selectedOption={selectedOption}
  onSelect={handleSelect}
  isLoading
/>
```

### Toggle Display Type

```tsx
<ComboBox
  options={options}
  selectedOption={selectedOption}
  onSelect={handleSelect}
  displayType={ComboBoxDisplayType.toggle}
/>
```

### Custom Dropdown Position

```tsx
<ComboBox
  options={options}
  selectedOption={selectedOption}
  onSelect={handleSelect}
  directionX="right"
  directionY="bottom"
  fixedDirection
/>
```

## Accessibility

The ComboBox component implements ARIA attributes and keyboard navigation for improved accessibility:

- `aria-expanded`: Indicates dropdown state
- `aria-haspopup`: Indicates popup presence
- `aria-label`: Provides component description
- `role="combobox"`: Identifies the component type

Keyboard support:
- `Enter/Space`: Open/close dropdown
- `Arrow Up/Down`: Navigate through options
- `Escape`: Close dropdown
- `Tab`: Focus next/previous element
