# ThemeProvider

Resolves the active theme (light, dark, or system) and provides it to child components through `ThemeProviderComponent` from styled-components.

## Props

| Prop           | Type              | Required | Description                                              |
| -------------- | ----------------- | -------- | -------------------------------------------------------- |
| `initialTheme` | `ThemeKeys`       | No       | The initial theme (`BaseStr`, `DarkStr`, `SystemStr`)    |
| `systemTheme`  | `ThemeKeys`       | No       | Override for the detected system theme                   |
| `colorTheme`   | `CustomColorThemesSettingsDto` | No | Color theme data; fetched from API if not provided |
| `locale`       | `string`          | No       | Locale for RTL detection and font family resolution      |
| `children`     | `React.ReactNode` | Yes      | Child components that receive theming                    |

## Usage

```tsx
import { ThemeProvider } from "@docspace/ui-kit/providers/theme";
import { ThemeKeys } from "@docspace/ui-kit/enums";

<ThemeProvider initialTheme={ThemeKeys.BaseStr} locale="en">
  <App />
</ThemeProvider>
```

## How it works

1. `useTheme` resolves the base theme (`Base` or `Dark`) from `initialTheme` / `systemTheme`
2. If `colorTheme` is not provided, it is fetched from the API
3. Font family and interface direction are determined from the `locale`
4. System theme changes are monitored via `matchMedia`
