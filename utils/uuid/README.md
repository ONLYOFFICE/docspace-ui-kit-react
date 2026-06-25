# UUID

Utility function for generating UUID v4 (Universally Unique Identifier) strings.

## Installation

```typescript
import { uuid } from "@docspace/ui-kit/utils/uuid";
```

## Function

### `uuid()`

Generates a random UUID v4 string.

**Returns:** `string` - A UUID v4 formatted string

**Example:**

```typescript
const id = uuid();
console.log(id); // "550e8400-e29b-41d4-a716-446655440000"
```

## UUID v4 Format

The generated UUID follows the standard v4 format:

```
xxxxxxxx-xxxx-4xxx-xxxx-xxxxxxxxxxxx
```

- 32 hexadecimal characters (0-9, a-f)
- 4 hyphens separating 5 groups
- Version indicator "4" at position 14
- Total length: 36 characters

### Structure

| Group | Length | Example |
|-------|--------|---------|
| 1 | 8 chars | `550e8400` |
| 2 | 4 chars | `e29b` |
| 3 | 4 chars | `41d4` (starts with "4") |
| 4 | 4 chars | `a716` |
| 5 | 12 chars | `446655440000` |

## Usage Examples

### Generate Unique Component Keys

```typescript
import { uuid } from "@docspace/ui-kit/utils/uuid";

function TodoList({ items }) {
  const [todos, setTodos] = useState(
    items.map((item) => ({ ...item, id: uuid() }))
  );

  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  );
}
```

### Create Unique Identifiers for DOM Elements

```typescript
import { uuid } from "@docspace/ui-kit/utils/uuid";

function FormField({ label, children }) {
  const id = useMemo(() => uuid(), []);

  return (
    <div>
      <label htmlFor={id}>{label}</label>
      {cloneElement(children, { id })}
    </div>
  );
}
```

### Generate Session or Request IDs

```typescript
import { uuid } from "@docspace/ui-kit/utils/uuid";

function createSession() {
  return {
    sessionId: uuid(),
    createdAt: Date.now(),
  };
}

async function fetchWithRequestId(url: string) {
  const requestId = uuid();

  return fetch(url, {
    headers: {
      "X-Request-ID": requestId,
    },
  });
}
```

### Track Items in State

```typescript
import { uuid } from "@docspace/ui-kit/utils/uuid";

interface Notification {
  id: string;
  message: string;
  type: "info" | "success" | "error";
}

function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (message: string, type: Notification["type"]) => {
    setNotifications((prev) => [...prev, { id: uuid(), message, type }]);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return { notifications, addNotification, removeNotification };
}
```

### Generate Temporary File Names

```typescript
import { uuid } from "@docspace/ui-kit/utils/uuid";

function generateTempFileName(extension: string) {
  return `temp_${uuid()}.${extension}`;
}

const tempFile = generateTempFileName("json");
// "temp_550e8400-e29b-41d4-a716-446655440000.json"
```

## Notes

- Uses `Math.random()` for random number generation
- Suitable for client-side unique identifiers
- Not cryptographically secure - do not use for security-sensitive applications
- Each call generates a new unique identifier

## Related

- [RFC 4122 - UUID Specification](https://www.ietf.org/rfc/rfc4122.txt)
- [MDN: crypto.randomUUID()](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID) - Native browser alternative (requires secure context)
