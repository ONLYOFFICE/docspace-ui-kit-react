# Button

A versatile button component for triggering actions on a page. Supports multiple variants, sizes, states, and styling options.

## Features

- **Two Variants**: Primary and Secondary styles
- **Four Sizes**: extraSmall, small, normal, and medium
- **Icon Support**: Display icons alongside text
- **Loading State**: Show loading indicator during async operations
- **Tooltip Support**: Display helpful text on hover
- **Filled Variants**: Additional styling options with filled and filledStroke
- **Full Width**: Scale to 100% width when needed
- **Accessibility**: Built-in ARIA attributes for screen readers

## Installation

```tsx
import { Button, ButtonSize } from "@docspace/ui-kit/components/button";
```

## Usage

```tsx
// Basic secondary button
<Button label="Cancel" onClick={handleCancel} />

// Primary button
<Button primary label="Save" onClick={handleSave} />

// Button with icon
<Button
  primary
  icon={<SaveIcon />}
  label="Save Changes"
  onClick={handleSave}
/>

// Loading state
<Button
  primary
  isLoading
  label="Saving..."
/>

// Button with tooltip
<Button
  label="Help"
  tooltipText="Click here for assistance"
  onClick={showHelp}
/>

// Full width button
<Button
  primary
  scale
  size={ButtonSize.medium}
  label="Continue"
/>

// Disabled button
<Button
  label="Submit"
  isDisabled
/>
```

## Properties

| Prop           | Type                                      | Default    | Description                                                                                                                        |
| -------------- | ----------------------------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `label`        | `string`                                  | Required   | Text content displayed inside the button                                                                                           |
| `primary`      | `boolean`                                 | `false`    | When true, applies primary button styling with brand colors                                                                        |
| `size`         | `ButtonSize`                              | `normal`   | Controls button dimensions (`extraSmall`, `small`, `normal`, `medium`). Normal size is 36px height on Desktop, 40px on Touchscreen |
| `scale`        | `boolean`                                 | `false`    | When true, button width expands to fill its container (width: 100%)                                                                |
| `icon`         | `ReactNode`                               | -          | Optional icon element rendered before the label                                                                                    |
| `filled`       | `boolean`                                 | `false`    | Applies filled variant styling                                                                                                     |
| `filledStroke` | `boolean`                                 | `false`    | Applies filled variant with stroke/border styling                                                                                  |
| `isDisabled`   | `boolean`                                 | `false`    | Disables button interactions and shows disabled state                                                                              |
| `isLoading`    | `boolean`                                 | `false`    | Shows loading spinner and disables button interactions                                                                             |
| `isHovered`    | `boolean`                                 | `false`    | Forces hover state display (for demonstration purposes)                                                                            |
| `isClicked`    | `boolean`                                 | `false`    | Forces active/clicked state display (for demonstration purposes)                                                                   |
| `onClick`      | `(e: React.MouseEvent) => void`           | -          | Click event handler function                                                                                                       |
| `tooltipText`  | `string`                                  | -          | Text displayed in tooltip on hover                                                                                                 |
| `className`    | `string`                                  | -          | Additional CSS classes to apply                                                                                                    |
| `id`           | `string`                                  | -          | HTML id attribute                                                                                                                  |
| `style`        | `CSSProperties`                           | -          | Custom inline styles                                                                                                               |
| `minWidth`     | `string`                                  | -          | Sets minimum button width (CSS value, e.g., "120px")                                                                               |
| `title`        | `string`                                  | -          | HTML title attribute (prefer `tooltipText` for better tooltip support)                                                             |
| `tabIndex`     | `number`                                  | -          | Overrides the default tab order                                                                                                    |
| `type`         | `'button' \| 'submit' \| 'reset'`         | `'button'` | HTML button type attribute                                                                                                         |
| `testId`       | `string`                                  | `'button'` | Test ID for automated testing                                                                                                      |
| `ref`          | `React.Ref<HTMLElement>`                  | -          | Ref to access the DOM element                                                                                                      |
| `aria-label`   | `string`                                  | -          | ARIA label for accessibility                                                                                                       |
| `aria-disabled`| `'true' \| 'false'`                       | -          | ARIA disabled state                                                                                                                |
| `aria-busy`    | `'true' \| 'false'`                       | -          | ARIA busy state (automatically set when isLoading)                                                                                 |

## Button Sizes

The `ButtonSize` enum provides four size options:

```tsx
ButtonSize.extraSmall // Smallest size
ButtonSize.small      // Small size
ButtonSize.normal     // Default size (36px height on desktop)
ButtonSize.medium     // Largest size (40px height on desktop)
```

## Examples

### Button Variants

```tsx
// Primary button - for main actions
<Button primary label="Save Changes" />

// Secondary button - for secondary actions
<Button label="Cancel" />

// Filled variant
<Button filled label="Custom Style" />

// Filled with stroke
<Button filledStroke label="Emphasized" />
```

### Different Sizes

```tsx
<Button size={ButtonSize.extraSmall} label="Extra Small" />
<Button size={ButtonSize.small} label="Small" />
<Button size={ButtonSize.normal} label="Normal" />
<Button size={ButtonSize.medium} label="Medium" />
```

### With Icons

```tsx
import SaveIcon from "PUBLIC_DIR/images/save.react.svg";
import DeleteIcon from "PUBLIC_DIR/images/delete.react.svg";

<Button
  primary
  icon={<SaveIcon />}
  label="Save"
/>

<Button
  icon={<DeleteIcon />}
  label="Delete"
/>
```

### Loading State

```tsx
function SaveButton() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await saveData();
    setIsSaving(false);
  };

  return (
    <Button
      primary
      isLoading={isSaving}
      label={isSaving ? "Saving..." : "Save"}
      onClick={handleSave}
    />
  );
}
```

### With Tooltips

```tsx
<Button
  label="Help"
  tooltipText="Click for documentation"
/>

<Button
  primary
  icon={<InfoIcon />}
  label="Information"
  tooltipText="View detailed information"
/>
```

### Full Width Buttons

```tsx
// Useful for mobile layouts or modal footers
<Button
  primary
  scale
  label="Continue"
  size={ButtonSize.medium}
/>
```

### Disabled State

```tsx
<Button
  primary
  isDisabled
  label="Submit"
  onClick={handleSubmit}
/>
```

### Form Submission

```tsx
<form onSubmit={handleSubmit}>
  <Button
    primary
    type="submit"
    label="Submit Form"
    size={ButtonSize.normal}
  />
</form>
```

## Accessibility

The Button component includes built-in accessibility features:

- **ARIA Labels**: Automatically uses the `label` prop as `aria-label`
- **ARIA States**: Sets `aria-disabled` when disabled and `aria-busy` when loading
- **Keyboard Navigation**: Fully keyboard accessible with proper focus states
- **Screen Reader Support**: All states are properly announced to screen readers

```tsx
<Button
  label="Delete Item"
  aria-label="Delete selected item from list"
  onClick={handleDelete}
/>
```

## Best Practices

1. **Use Primary Buttons Sparingly**: Limit to 1-2 primary buttons per screen for main actions
2. **Provide Clear Labels**: Use action-oriented labels like "Save", "Cancel", "Submit"
3. **Show Loading States**: Always use `isLoading` during async operations
4. **Add Tooltips for Context**: Use `tooltipText` to provide additional context when helpful
5. **Proper Sizing**: Use appropriate sizes based on context (smaller for toolbars, larger for primary CTAs)
6. **Disable Appropriately**: Use `isDisabled` when actions are not available rather than hiding buttons

## Styling

The Button component uses CSS modules for styling. You can customize appearance by:

1. **Using the `className` prop**: Add custom CSS classes
2. **Using the `style` prop**: Apply inline styles
3. **Using variants**: Choose between primary, filled, or filledStroke variants

```tsx
<Button
  primary
  label="Custom Button"
  className="my-custom-button"
  style={{ marginTop: '10px' }}
/>
```