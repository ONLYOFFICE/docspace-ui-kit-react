# Portal

A component that renders children into a DOM node outside the parent component's DOM hierarchy using React Portals.

## Usage

```js
import { Portal } from "@docspace/ui-kit";
```

### Basic Example

```jsx
<Portal
  element={<div className="modal">Modal content</div>}
  visible={true}
/>
```

### Custom Container

```jsx
const [container, setContainer] = useState(null);

<div ref={setContainer}>
  <Portal
    element={<div>Content rendered in custom container</div>}
    appendTo={container}
  />
</div>
```

### Conditional Rendering

```jsx
<Portal
  element={<div className="tooltip">Tooltip content</div>}
  visible={isTooltipVisible}
/>
```

## Properties

| Props      | Type              | Required | Default         | Description                                      |
| ---------- | :---------------- | :------: | :-------------- | :----------------------------------------------- |
| `element`  | `React.ReactNode` |    ✓     | -               | The React node to be rendered inside the portal  |
| `visible`  | `boolean`         |    -     | `true`          | Whether the portal content should be visible     |
| `appendTo` | `HTMLElement`     |    -     | `document.body` | The DOM element to append the portal to          |

## Use Cases

### Modals and Dialogs

```jsx
<Portal
  element={
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Modal Title</h2>
        <p>Modal body content</p>
      </div>
    </div>
  }
  visible={isModalOpen}
/>
```

### Tooltips

```jsx
<Portal
  element={
    <div style={{ position: 'absolute', top: tooltipY, left: tooltipX }}>
      Tooltip text
    </div>
  }
  visible={showTooltip}
/>
```

### Dropdown Menus

```jsx
<Portal
  element={
    <ul className="dropdown-menu" style={{ top: menuY, left: menuX }}>
      <li>Option 1</li>
      <li>Option 2</li>
    </ul>
  }
  visible={isMenuOpen}
/>
```

## Notes

- Portal content is rendered outside the parent DOM hierarchy but maintains React context
- Useful for avoiding CSS overflow/z-index issues with modals, tooltips, and dropdowns
- Supports SSR - safely checks for DOM availability before rendering
- The `visible` prop controls mounting/unmounting of portal content
