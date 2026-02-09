# ApiProvider

Provides API client instances (`profilesApi`, `commonSettingsApi`) to the component tree via React Context.

## Props

| Prop       | Type              | Required | Description                          |
| ---------- | ----------------- | -------- | ------------------------------------ |
| `url`      | `string`          | Yes      | Base URL of the DocSpace API         |
| `apiKey`   | `string`          | Yes      | API key for authentication           |
| `children` | `React.ReactNode` | Yes      | Child components that consume the API |

## `useApi()` Hook

Returns an object with:

| Property             | Type                | Description                     |
| -------------------- | ------------------- | ------------------------------- |
| `profilesApi`        | `ProfilesApi`       | API client for user profiles    |
| `commonSettingsApi`  | `CommonSettingsApi` | API client for common settings  |

Throws an error if used outside of `ApiProvider`.

## Usage

```tsx
import { ApiProvider, useApi } from "@docspace/ui-kit/providers/api";

function App() {
  return (
    <ApiProvider url="https://your-docspace.com" apiKey="your-api-key">
      <MyComponent />
    </ApiProvider>
  );
}

function MyComponent() {
  const { profilesApi, commonSettingsApi } = useApi();

  // Use the API clients...
}
```
