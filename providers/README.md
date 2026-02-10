# Providers

All-in-one composition of `ErrorBoundary`, `ApiProvider`, `TranslationProvider`, and `ThemeProvider`.

## Architecture

```
Providers
 └─ ErrorBoundary        (errorFallback, onError)
     └─ ApiProvider          (url, apiKey)
         └─ TranslationProvider  (settings, user, locale, translations)
             └─ ThemeProvider     (initialTheme, systemTheme, colorTheme, locale)
                 └─ children
```

If `settings` or `user` are not provided as props, they are fetched automatically from the API.

## Props

| Prop            | Type              | Required | Description                                              |
| --------------- | ----------------- | -------- | -------------------------------------------------------- |
| `url`           | `string`          | Yes      | Base URL of the DocSpace API                             |
| `apiKey`        | `string`          | Yes      | API key for authentication                               |
| `errorFallback` | `ReactNode \| ((error: Error) => ReactNode)` | No | Custom error fallback UI              |
| `onError`       | `(error: Error, errorInfo: ErrorInfo) => void` | No | Callback when an error is caught     |
| `settings`      | `SettingsDto`     | No       | Portal settings (fetched if not provided)                |
| `user`          | `EmployeeFullDto` | No       | Current user (fetched if not provided)                   |
| `locale`        | `string`          | No       | Locale override                                          |
| `translations`  | `TTranslations`   | No       | Translation resources map                                |
| `initialTheme`  | `ThemeKeys`       | No       | Initial theme (`BaseStr`, `DarkStr`, `SystemStr`)        |
| `systemTheme`   | `ThemeKeys`       | No       | Override for system theme                                |
| `colorTheme`    | `CustomColorThemesSettingsDto` | No | Color theme data                           |
| `children`      | `React.ReactNode` | Yes      | Child components                                         |

## Usage

```tsx
import { Providers } from "@docspace/ui-kit/providers";
import enCommon from "@docspace/ui-kit/locales/en/Common.json";
import type { TTranslations } from "@docspace/ui-kit/providers/translation";

const translations: TTranslations = new Map([
  ["en", new Map([["Common", enCommon]])],
]);

<Providers
  url="https://your-docspace.com"
  apiKey="your-api-key"
  translations={translations}
  locale="en"
  errorFallback={(error) => <div>Error: {error.message}</div>}
  onError={(error, errorInfo) => console.error(error, errorInfo)}
>
  <App />
</Providers>
```

## Sub-providers

- **[ErrorBoundary](./error-boundary/README.md)** — Error catching and fallback UI
- **[ApiProvider](./api/README.md)** — API client instances
- **[TranslationProvider](./translation/README.md)** — i18next integration
- **[ThemeProvider](./theme/README.md)** — Theme resolution and styling
