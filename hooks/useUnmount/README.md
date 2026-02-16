# useUnmount Hook

React hook for executing cleanup functions when a component unmounts.

## Overview

`useUnmount` provides a simple and reliable way to run cleanup logic when a component is unmounted. It uses `useEffectEvent` to ensure that the latest version of the cleanup function is always called, without requiring it to be added to dependency arrays.

## Usage

```tsx
import { useUnmount } from '@docspace/ui-kit/hooks/useUnmount';

function Component() {
  useUnmount(() => {
    console.log('Component is unmounting');
  });

  return <div>Hello World</div>;
}
```

## API

### Parameters

- **`func`** (`VoidFunction`): The cleanup function to execute when the component unmounts.

### Return Value

This hook does not return any value.

## How It Works

1. The cleanup function is wrapped with `useEffectEvent` to create a stable event handler
2. An effect is set up that returns a cleanup function
3. When the component unmounts, the cleanup function executes the latest version of the provided function
4. The use of `useEffectEvent` ensures the latest closure values are captured without triggering re-renders

## Example: Save State Before Unmount

```tsx
function FormComponent() {
  const [formData, setFormData] = useState({ name: '', email: '' });

  useUnmount(() => {
    localStorage.setItem('formDraft', JSON.stringify(formData));
  });

  return (
    <form>
      <input
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Name"
      />
      <input
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="Email"
      />
    </form>
  );
}
```

## Example: Cleanup Resources

```tsx
function RealtimeData() {
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    wsRef.current = new WebSocket('wss://api.example.com/data');
  }, []);

  useUnmount(() => {
    if (wsRef.current) {
      wsRef.current.close();
    }
  });

  return <div>Receiving realtime data...</div>;
}
```

## Notes

- The cleanup function is only called once when the component unmounts
- Uses `useEffectEvent` internally to ensure the latest function version is called
- The cleanup function is not called during re-renders, only on unmount
- Ideal for cleanup operations that don't depend on specific prop/state changes
- Multiple `useUnmount` calls in the same component are independent
