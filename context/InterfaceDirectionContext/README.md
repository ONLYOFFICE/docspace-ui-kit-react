# InterfaceDirectionContext

React context and hook for managing interface direction (LTR/RTL).

## Usage

### Provider

```tsx
import { InterfaceDirectionProvider } from './InterfaceDirectionContext';

function App() {
  return (
    <InterfaceDirectionProvider interfaceDirection="rtl">
      <YourComponents />
    </InterfaceDirectionProvider>
  );
}
```

### Hook

```tsx
import { useInterfaceDirection } from './InterfaceDirectionContext';

function MyComponent() {
  const { interfaceDirection, isRTL } = useInterfaceDirection();

  return (
    <div style={{ textAlign: isRTL ? 'right' : 'left' }}>
      Direction: {interfaceDirection}
    </div>
  );
}
```

## API

### `InterfaceDirectionProvider`
- `interfaceDirection`: `"ltr" | "rtl"` - Interface direction
- `children`: React children

### `useInterfaceDirection()`
Returns:
- `interfaceDirection`: `"ltr" | "rtl"` - Current direction
- `isRTL`: `boolean` - True if RTL

## Example

```tsx
function Navigation() {
  const { isRTL } = useInterfaceDirection();
  
  return (
    <nav style={{ 
      paddingLeft: isRTL ? 0 : '1rem',
      paddingRight: isRTL ? '1rem' : 0 
    }}>
      {/* content */}
    </nav>
  );
}
```

Default direction is `"ltr"`.
