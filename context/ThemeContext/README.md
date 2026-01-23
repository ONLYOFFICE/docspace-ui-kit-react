# ThemeContext

React Context for managing application theme state and color schemes in DocSpace UI Kit.

## Features

- **Theme Management**: Switch between Base (light) and Dark themes
- **Color Scheme Support**: Custom accent colors and button colors
- **Type-Safe**: Full TypeScript support with defined types
- **Simple API**: Easy-to-use hook for accessing theme state
- **React 19**: Uses modern React `use()` hook for context consumption

## Installation

```tsx
import { ThemeProvider, useTheme, type TTheme, type TColorScheme } from "@docspace/ui-kit/context";
```

## Usage

### Basic Setup

Wrap your application with the `ThemeProvider`:

```tsx
import { ThemeProvider } from "@docspace/ui-kit/context";

function App() {
  return (
    <ThemeProvider theme="Base">
      <YourApplication />
    </ThemeProvider>
  );
}
```

### Using the Theme Hook

Access the current theme in any component:

```tsx
import { useTheme } from "@docspace/ui-kit/context";

function MyComponent() {
  const { theme, isBase } = useTheme();

  return (
    <div className={isBase ? "light-mode" : "dark-mode"}>
      Current theme: {theme}
    </div>
  );
}
```

### With Custom Color Scheme

Provide a custom color scheme for brand customization:

```tsx
import { ThemeProvider, type TColorScheme } from "@docspace/ui-kit/context";

const customColorScheme: TColorScheme = {
  id: 1,
  name: "Brand Colors",
  main: {
    accent: "#4B72D6",
    buttons: "#4B72D6",
  },
  text: {
    accent: "#FFFFFF",
    buttons: "#FFFFFF",
  },
};

function App() {
  return (
    <ThemeProvider theme="Base" currentColorScheme={customColorScheme}>
      <YourApplication />
    </ThemeProvider>
  );
}
```

## API Reference

### Types

#### `TTheme`

```tsx
type TTheme = "Base" | "Dark";
```

Available theme options:
- `"Base"` - Light theme
- `"Dark"` - Dark theme

#### `TColorScheme`

```tsx
type TColorScheme = {
  id: number;                    // Unique identifier
  name: string;                  // Color scheme name
  main: {
    accent: string;              // Main accent color (hex)
    buttons: string;             // Primary button color (hex)
  };
  text: {
    accent: string;              // Text color for accent elements (hex)
    buttons: string;             // Text color for buttons (hex)
  };
};
```

### Components

#### `ThemeProvider`

Provider component that makes theme context available to child components.

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `theme` | `TTheme` | Yes | Current theme ("Base" or "Dark") |
| `currentColorScheme` | `TColorScheme` | No | Custom color scheme configuration |
| `children` | `ReactNode` | Yes | Child components |

**Example:**

```tsx
<ThemeProvider theme="Dark" currentColorScheme={myColorScheme}>
  <App />
</ThemeProvider>
```

### Hooks

#### `useTheme()`

Hook to access the current theme context.

**Returns:**

```tsx
{
  theme: TTheme;                      // Current theme
  isBase: boolean;                    // true if theme is "Base"
  currentColorScheme?: TColorScheme;  // Current color scheme (if provided)
}
```

**Example:**

```tsx
const { theme, isBase, currentColorScheme } = useTheme();

if (isBase) {
  // Light theme logic
} else {
  // Dark theme logic
}

if (currentColorScheme) {
  // Use custom colors
  const accentColor = currentColorScheme.main.accent;
}
```

## Examples

### Dynamic Theme Switching

```tsx
import { useState } from "react";
import { ThemeProvider, type TTheme } from "@docspace/ui-kit/context";

function App() {
  const [theme, setTheme] = useState<TTheme>("Base");

  const toggleTheme = () => {
    setTheme(theme === "Base" ? "Dark" : "Base");
  };

  return (
    <ThemeProvider theme={theme}>
      <button onClick={toggleTheme}>
        Switch to {theme === "Base" ? "Dark" : "Light"} Mode
      </button>
      <YourApplication />
    </ThemeProvider>
  );
}
```

### Conditional Styling Based on Theme

```tsx
import { useTheme } from "@docspace/ui-kit/context";

function Card() {
  const { isBase } = useTheme();

  return (
    <div
      style={{
        backgroundColor: isBase ? "#ffffff" : "#1a1a1a",
        color: isBase ? "#000000" : "#ffffff",
      }}
    >
      Card content
    </div>
  );
}
```

### Using Color Scheme in Components

```tsx
import { useTheme } from "@docspace/ui-kit/context";
import { Button } from "@docspace/ui-kit/components/button";

function CustomButton() {
  const { currentColorScheme } = useTheme();

  return (
    <Button
      primary
      label="Branded Button"
      style={{
        backgroundColor: currentColorScheme?.main.buttons,
        color: currentColorScheme?.text.buttons,
      }}
    />
  );
}
```

### Multiple Color Schemes

```tsx
import { useState } from "react";
import { ThemeProvider, type TColorScheme } from "@docspace/ui-kit/context";

const colorSchemes: TColorScheme[] = [
  {
    id: 1,
    name: "Blue",
    main: { accent: "#4B72D6", buttons: "#4B72D6" },
    text: { accent: "#FFFFFF", buttons: "#FFFFFF" },
  },
  {
    id: 2,
    name: "Green",
    main: { accent: "#22C55E", buttons: "#22C55E" },
    text: { accent: "#FFFFFF", buttons: "#FFFFFF" },
  },
  {
    id: 3,
    name: "Purple",
    main: { accent: "#A855F7", buttons: "#A855F7" },
    text: { accent: "#FFFFFF", buttons: "#FFFFFF" },
  },
];

function App() {
  const [selectedScheme, setSelectedScheme] = useState(colorSchemes[0]);

  return (
    <ThemeProvider theme="Base" currentColorScheme={selectedScheme}>
      <select onChange={(e) => setSelectedScheme(colorSchemes[Number(e.target.value)])}>
        {colorSchemes.map((scheme, index) => (
          <option key={scheme.id} value={index}>
            {scheme.name}
          </option>
        ))}
      </select>
      <YourApplication />
    </ThemeProvider>
  );
}
```

## Best Practices

1. **Single Provider**: Place `ThemeProvider` at the root of your application
2. **Persistent Theme**: Store theme preference in localStorage or user settings
3. **Type Safety**: Always use the `TTheme` and `TColorScheme` types for type safety
4. **Color Scheme Validation**: Validate hex color strings in color schemes
5. **Accessibility**: Ensure sufficient color contrast in custom color schemes
6. **Performance**: Memoize color scheme objects to prevent unnecessary re-renders

## Notes

- The context uses React 19's `use()` hook instead of `useContext()`
- Theme changes trigger re-renders only in components that consume the context
- Color schemes are optional and can be added dynamically
- The `isBase` helper makes conditional logic cleaner than checking `theme === "Base"`

## Related

- [InterfaceDirectionContext](../InterfaceDirectionContext/README.md) - For RTL/LTR direction management
- [Button Component](../../components/button/README.md) - Uses theme context for styling
- [Themes](../../themes/README.md) - Theme configuration and color definitions
