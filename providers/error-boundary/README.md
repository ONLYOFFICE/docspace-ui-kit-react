# ErrorBoundary

Catches JavaScript errors anywhere in the child component tree and renders a fallback UI instead of crashing the whole application.

## Props

| Prop       | Type                                              | Required | Description                                              |
| ---------- | ------------------------------------------------- | -------- | -------------------------------------------------------- |
| `fallback` | `ReactNode \| ((error: Error) => ReactNode)`      | No       | Custom fallback UI; defaults to `ErrorContainer`         |
| `onError`  | `(error: Error, errorInfo: ErrorInfo) => void`     | No       | Callback invoked when an error is caught                 |
| `children` | `React.ReactNode`                                  | Yes      | Child components to monitor for errors                   |

## Usage

### Default fallback

When no `fallback` is provided, a built-in `ErrorContainer` is rendered with the error message.

```tsx
import { ErrorBoundary } from "@docspace/ui-kit/providers/error-boundary";

<ErrorBoundary>
  <App />
</ErrorBoundary>
```

### Custom fallback (ReactNode)

```tsx
<ErrorBoundary fallback={<div>Something went wrong. Please reload.</div>}>
  <App />
</ErrorBoundary>
```

### Custom fallback (render function)

The render function receives the caught `Error`, so the fallback can display dynamic details.

```tsx
<ErrorBoundary
  fallback={(error) => <div>Error: {error.message}</div>}
  onError={(error, errorInfo) => sendCrashReport(error, errorInfo)}
>
  <App />
</ErrorBoundary>
```

## How it works

1. Uses a React class component with `getDerivedStateFromError` to catch render errors
2. Calls the optional `onError` callback inside `componentDidCatch` for error reporting
3. Renders the `fallback` prop (or the default `ErrorContainer`) when an error is caught
4. Renders `children` normally when no error has occurred
