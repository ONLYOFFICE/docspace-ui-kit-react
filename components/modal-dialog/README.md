# ModalDialog

A versatile modal dialog component that supports both modal and aside (side panel) display types.

## Usage

```js
import { ModalDialog } from "@docspace/ui-kit/components/modal-dialog";
```

### Basic Example

```jsx
<ModalDialog visible={true} displayType="modal" onClose={() => {}}>
  <ModalDialog.Header>Change password</ModalDialog.Header>
  <ModalDialog.Body>
    <div>
      Send the password change instruction to the{" "}
      <a href="mailto:example@email.com">example@email.com</a>
    </div>
  </ModalDialog.Body>
  <ModalDialog.Footer>
    <Button
      label="Send"
      primary
      size="normal"
      onClick={() => {}}
    />
    <Button
      label="Cancel"
      size="normal"
      onClick={() => {}}
    />
  </ModalDialog.Footer>
</ModalDialog>
```

### Aside Example

```jsx
<ModalDialog 
  visible={true} 
  displayType="aside"
  withBodyScroll
  onClose={() => {}}
>
  <ModalDialog.Header>Side Panel</ModalDialog.Header>
  <ModalDialog.Body>
    {/* Long scrollable content */}
  </ModalDialog.Body>
</ModalDialog>
```

## Properties

| Props                | Type                    | Required | Default | Description                                                  |
| ------------------- | :---------------------- | :------: | :-----: | ------------------------------------------------------------ |
| `children`          | `ReactElement \| ReactElement[]` |    ✓     |    -    | Modal content components (Header, Body, Footer, Container)   |
| `visible`           | `boolean`               |    -     | `false` | Controls modal visibility                                    |
| `displayType`       | `ModalDialogType`       |    -     | `modal` | Display type (`modal` or `aside`)                           |
| `displayTypeDetailed`| `ModalDialogTypeDetailed`|    -    |    -    | Detailed display type for different screen sizes            |
| `onClose`           | `(e?: React.MouseEvent) => void` |    -     |    -    | Callback when modal is closed                               |
| `onBackClick`       | `() => void`            |    -     |    -    | Callback when Backspace key is pressed                      |
| `id`                | `string`                |    -     |    -    | HTML id attribute                                           |
| `className`         | `string`                |    -     |    -    | Custom CSS classes                                          |
| `style`             | `React.CSSProperties`   |    -     |    -    | Inline styles                                               |
| `zIndex`            | `number`                |    -     |  `310`  | CSS z-index for modal layering                              |
| `isLoading`         | `boolean`               |    -     | `false` | Shows loader in body                                        |
| `isCloseable`       | `boolean`               |    -     |  `true` | Controls if modal can be closed                             |
| `embedded`          | `boolean`               |    -     | `false` | Enables embedded mode (disables closing)                    |
| `dataTestId`        | `string`                |    -     | `modal` | Test id for testing                                         |

### Modal-only Properties

| Props              | Type      | Required | Default | Description                                           |
| ----------------- | :-------- | :------: | :-----: | ----------------------------------------------------- |
| `isLarge`         | `boolean` |    -     | `false` | Sets width: 520px and max-height: 400px               |
| `isHuge`          | `boolean` |    -     | `false` | Sets predefined huge size                             |
| `autoMaxWidth`    | `boolean` |    -     | `false` | Sets max-width: auto                                  |
| `autoMaxHeight`   | `boolean` |    -     | `false` | Sets max-height: auto                                 |
| `withFooterBorder`| `boolean` |    -     | `false` | Displays border between body and footer               |

### Aside-only Properties

| Props               | Type      | Required | Default | Description                                           |
| ------------------ | :-------- | :------: | :-----: | ----------------------------------------------------- |
| `withBodyScroll`   | `boolean` |    -     | `false` | Enables body scroll                                   |
| `isScrollLocked`   | `boolean` |    -     | `false` | Locks the scroll in body section                      |
| `containerVisible` | `boolean` |    -     | `false` | Shows Container instead of Header/Body/Footer         |

### Additional Properties

| Props                  | Type      | Required | Default | Description                                           |
| --------------------- | :-------- | :------: | :-----: | ----------------------------------------------------- |
| `withForm`            | `boolean` |    -     | `false` | Wraps content in form element                         |
| `onSubmit`            | `(e: React.FormEvent) => void` |    -     |    -    | Form submit handler                                   |
| `withoutPadding`      | `boolean` |    -     | `false` | Removes default padding from body                     |
| `withoutHeaderMargin` | `boolean` |    -     | `false` | Removes default margin from header                    |
| `hideContent`         | `boolean` |    -     | `false` | Hides modal content                                   |
| `isDoubleFooterLine`  | `boolean` |    -     | `false` | Displays double line in footer                        |
| `backdropVisible`     | `boolean` |    -     |  `true` | Controls the visibility of the backdrop overlay       |
| `closeOnBackdropClick`| `boolean` |    -     |  `true` | Disables closing the modal when backdrop is clicked   |
| `blur`                | `number`  |    -     |    -    | Sets backdrop blur value                              |
| `isInvitePanelLoader` | `boolean` |    -     | `false` | Shows invite panel loader                             |
| `withBodyScrollForcibly`| `boolean`|    -    | `false` | Forces body scroll regardless of display type         |
| `scrollbarCreateContext`| `boolean`|    -    | `false` | Creates context for scrollbar                         |
| `withBorder`          | `boolean` |    -     | `false` | Adds border to modal content                          |

## Sub-components

### ModalDialog.Header
Container for modal header content. Supports header icons, back button, and close button.

**Props (inherited from AsideHeader):**
- `header` - Header content (string or ReactNode)
- `headerIcons` - Array of icons to display
- `headerComponent` - Additional component to render
- `isBackButton` - Shows back button
- `withoutBorder` - Hides bottom border
- `headerHeight` - Custom header height

### ModalDialog.Body
Container for modal body content. Supports scrolling in aside mode.

### ModalDialog.Footer
Container for modal footer content, typically used for action buttons.

### ModalDialog.Container
Container for aside mode with `containerVisible` prop. Used to display custom content instead of Header/Body/Footer structure.

## Examples

### Modal with Form

```jsx
<ModalDialog 
  visible={true}
  withForm
  onSubmit={(e) => {
    e.preventDefault();
    // Handle form submission
  }}
>
  <ModalDialog.Header>Form Example</ModalDialog.Header>
  <ModalDialog.Body>
    <form>
      {/* Form fields */}
    </form>
  </ModalDialog.Body>
  <ModalDialog.Footer>
    <Button type="submit" label="Submit" primary />
  </ModalDialog.Footer>
</ModalDialog>
```

### Large Modal

```jsx
<ModalDialog 
  visible={true}
  isLarge
  withFooterBorder
>
  <ModalDialog.Header>Large Modal</ModalDialog.Header>
  <ModalDialog.Body>
    {/* Content */}
  </ModalDialog.Body>
  <ModalDialog.Footer>
    {/* Actions */}
  </ModalDialog.Footer>
</ModalDialog>
```

### Scrollable Aside Panel

```jsx
<ModalDialog 
  visible={true}
  displayType="aside"
  withBodyScroll
  isScrollLocked={false}
>
  <ModalDialog.Header>Scrollable Panel</ModalDialog.Header>
  <ModalDialog.Body>
    {/* Long scrollable content */}
  </ModalDialog.Body>
</ModalDialog>
```

### Embedded Modal

```jsx
<ModalDialog 
  visible={true}
  embedded
  onClose={() => {}}
>
  <ModalDialog.Header>Embedded Modal</ModalDialog.Header>
  <ModalDialog.Body>
    This modal cannot be closed by user actions
  </ModalDialog.Body>
</ModalDialog>
```

### Modal with Backdrop Control

```jsx
<ModalDialog 
  visible={true}
  backdropVisible={false}
  closeOnBackdropClick={false}
>
  <ModalDialog.Header>No Backdrop</ModalDialog.Header>
  <ModalDialog.Body>
    Modal without visible backdrop
  </ModalDialog.Body>
</ModalDialog>
```

### Aside with Container

```jsx
<ModalDialog 
  visible={true}
  displayType="aside"
  containerVisible
>
  <ModalDialog.Container>
    {/* Custom container content */}
  </ModalDialog.Container>
</ModalDialog>
```

## Keyboard Shortcuts

- **Escape/Esc** - Closes the modal (when `isCloseable` is true and not `embedded`)
- **Backspace** - Triggers `onBackClick` callback (when not focused on INPUT or TEXTAREA)
