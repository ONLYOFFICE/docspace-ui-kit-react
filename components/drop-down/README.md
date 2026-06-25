# DropDown

A flexible dropdown component for displaying menus, options, and contextual content. Supports automatic positioning, virtual scrolling for large lists, and customizable appearance.

## Features

- **Smart Positioning**: Automatically adjusts position based on viewport space
- **Two Modes**: Portal mode (default) and inline mode
- **Virtual Scrolling**: Efficiently renders large lists with react-window
- **RTL Support**: Full right-to-left layout support
- **Keyboard Navigation**: Navigate items with arrow keys
- **Click Outside**: Configurable click-outside handling
- **Backdrop Support**: Optional backdrop for modal-like behavior
- **Responsive**: Adapts to viewport changes and device orientation

## Installation

```tsx
import { DropDown } from "@docspace/ui-kit/components/drop-down";
import { DropDownItem } from "@docspace/ui-kit/components/drop-down-item";
```

## Usage

```tsx
// Basic dropdown with items
const [isOpen, setIsOpen] = useState(false);
const buttonRef = useRef<HTMLButtonElement>(null);

<Button ref={buttonRef} label="Open Menu" onClick={() => setIsOpen(true)} />
<DropDown
  open={isOpen}
  forwardedRef={buttonRef}
  clickOutsideAction={() => setIsOpen(false)}
>
  <DropDownItem label="Option 1" onClick={handleOption1} />
  <DropDownItem label="Option 2" onClick={handleOption2} />
  <DropDownItem label="Option 3" onClick={handleOption3} />
</DropDown>

// Dropdown with header and separator
<DropDown open={isOpen} forwardedRef={buttonRef}>
  <DropDownItem isHeader label="Actions" />
  <DropDownItem label="Edit" onClick={handleEdit} />
  <DropDownItem label="Duplicate" onClick={handleDuplicate} />
  <DropDownItem isSeparator />
  <DropDownItem label="Delete" onClick={handleDelete} />
</DropDown>

// Dropdown with max height (scrollable)
<DropDown
  open={isOpen}
  forwardedRef={buttonRef}
  maxHeight={200}
>
  {items.map((item) => (
    <DropDownItem key={item.id} label={item.name} onClick={() => selectItem(item)} />
  ))}
</DropDown>

// Dropdown opening upward
<DropDown
  open={isOpen}
  forwardedRef={buttonRef}
  directionY="top"
>
  <DropDownItem label="Option 1" />
  <DropDownItem label="Option 2" />
</DropDown>
```

## Properties

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | `false` | Controls whether the dropdown is visible |
| `children` | `ReactNode` | - | Content to render inside the dropdown (typically DropDownItem components) |
| `forwardedRef` | `RefObject<HTMLElement>` | - | Reference to the parent/trigger element for positioning |
| `directionX` | `'left' \| 'right'` | `'right'` | Horizontal opening direction relative to parent |
| `directionY` | `'top' \| 'bottom' \| 'both'` | `'bottom'` | Vertical opening direction relative to parent |
| `maxHeight` | `number` | - | Maximum height in pixels; enables scrolling when content exceeds |
| `manualWidth` | `string` | - | Custom width (e.g., "100%", "300px") |
| `manualX` | `string` | - | Custom horizontal position (non-portal mode only) |
| `manualY` | `string` | - | Custom vertical position (non-portal mode only) |
| `offsetX` | `number` | `0` | Horizontal offset from calculated position (portal mode only) |
| `clickOutsideAction` | `(e: Event, open: boolean) => void` | - | Callback when clicking outside the dropdown |
| `isDefaultMode` | `boolean` | `true` | Use portal mode (true) or inline mode (false) |
| `fixedDirection` | `boolean` | `false` | Disable automatic position adjustment |
| `showDisabledItems` | `boolean` | `false` | Show or hide disabled items |
| `enableKeyboardEvents` | `boolean` | `false` | Enable keyboard navigation |
| `zIndex` | `number` | - | Custom z-index value |
| `className` | `string` | - | Additional CSS classes |
| `style` | `CSSProperties` | - | Custom inline styles |
| `dataTestId` | `string` | `'dropdown'` | Test ID for automated testing |
| `appendTo` | `HTMLElement` | - | Custom container for portal rendering |
| `eventTypes` | `string \| string[]` | - | Event types to listen for click outside |
| `topSpace` | `number` | - | Minimum space from top of viewport |
| `backDrop` | `JSX.Element \| null` | - | Custom backdrop element |
| `isMobileView` | `boolean` | - | Enable mobile-optimized view |
| `isNoFixedHeightOptions` | `boolean` | - | Use variable height for items |

## Direction Options

### Horizontal Direction (directionX)

| Value | Description |
|-------|-------------|
| `'right'` | Opens aligned to parent's left edge (default) |
| `'left'` | Opens aligned to parent's right edge |

### Vertical Direction (directionY)

| Value | Description |
|-------|-------------|
| `'bottom'` | Opens below the parent element (default) |
| `'top'` | Opens above the parent element |
| `'both'` | Automatically chooses based on available space |

## Examples

### Basic Menu

```tsx
function MenuButton() {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <div style={{ position: "relative" }}>
      <Button
        ref={buttonRef}
        label="Actions"
        onClick={() => setIsOpen(true)}
      />
      <DropDown
        open={isOpen}
        forwardedRef={buttonRef}
        clickOutsideAction={() => setIsOpen(false)}
      >
        <DropDownItem label="Edit" onClick={() => { handleEdit(); setIsOpen(false); }} />
        <DropDownItem label="Share" onClick={() => { handleShare(); setIsOpen(false); }} />
        <DropDownItem label="Delete" onClick={() => { handleDelete(); setIsOpen(false); }} />
      </DropDown>
    </div>
  );
}
```

### With Headers and Separators

```tsx
<DropDown open={isOpen} forwardedRef={buttonRef}>
  <DropDownItem isHeader label="File Actions" />
  <DropDownItem label="Open" onClick={handleOpen} />
  <DropDownItem label="Download" onClick={handleDownload} />
  <DropDownItem isSeparator />
  <DropDownItem isHeader label="Edit Actions" />
  <DropDownItem label="Rename" onClick={handleRename} />
  <DropDownItem label="Move" onClick={handleMove} />
  <DropDownItem isSeparator />
  <DropDownItem label="Delete" onClick={handleDelete} />
</DropDown>
```

### Scrollable List

```tsx
<DropDown
  open={isOpen}
  forwardedRef={buttonRef}
  maxHeight={300}
  clickOutsideAction={() => setIsOpen(false)}
>
  {users.map((user) => (
    <DropDownItem
      key={user.id}
      label={user.name}
      onClick={() => selectUser(user)}
    />
  ))}
</DropDown>
```

### Custom Width

```tsx
<DropDown
  open={isOpen}
  forwardedRef={buttonRef}
  manualWidth="250px"
>
  <DropDownItem label="Short" />
  <DropDownItem label="This is a longer option that needs more space" />
</DropDown>
```

### Opening Upward

```tsx
// Useful when trigger is near bottom of viewport
<DropDown
  open={isOpen}
  forwardedRef={buttonRef}
  directionY="top"
>
  <DropDownItem label="Option 1" />
  <DropDownItem label="Option 2" />
</DropDown>
```

### With Keyboard Navigation

```tsx
<DropDown
  open={isOpen}
  forwardedRef={buttonRef}
  enableKeyboardEvents
  clickOutsideAction={() => setIsOpen(false)}
>
  <DropDownItem label="First" onClick={handleFirst} />
  <DropDownItem label="Second" onClick={handleSecond} />
  <DropDownItem label="Third" onClick={handleThird} />
</DropDown>
```

### Non-Portal Mode

```tsx
// Renders inline instead of in a portal
// Parent must have position: relative
<div style={{ position: "relative" }}>
  <Button ref={buttonRef} label="Menu" onClick={() => setIsOpen(true)} />
  <DropDown
    open={isOpen}
    forwardedRef={buttonRef}
    isDefaultMode={false}
    manualY="40px"
  >
    <DropDownItem label="Option 1" />
    <DropDownItem label="Option 2" />
  </DropDown>
</div>
```

## Positioning

The dropdown uses intelligent positioning:

1. **Portal Mode (default)**: Renders in a portal at the document body level, calculating absolute position based on the trigger element
2. **Inline Mode**: Renders as a sibling element, using CSS positioning relative to parent

### Automatic Repositioning

When `fixedDirection` is `false` (default), the dropdown automatically:
- Flips horizontally if it would overflow the viewport edge
- Flips vertically if there's more space above/below the trigger
- Adjusts position on window resize

## Accessibility

- Uses `role="listbox"` for proper ARIA semantics
- Keyboard navigation support with `enableKeyboardEvents`
- Focus management for accessible interactions
- Works with screen readers

## Best Practices

1. **Always provide a ref**: The `forwardedRef` prop is essential for proper positioning
2. **Handle click outside**: Use `clickOutsideAction` to close the dropdown when clicking elsewhere
3. **Use maxHeight for long lists**: Prevents the dropdown from extending beyond the viewport
4. **Position parent correctly**: When using inline mode, ensure parent has `position: relative`
5. **Consider mobile**: Use `isMobileView` for touch-optimized layouts

## Related Components

- [DropDownItem](../drop-down-item/README.md) - Individual items within a dropdown
- [Button](../button/README.md) - Common trigger element for dropdowns
- [Portal](../portal/README.md) - Underlying portal implementation
