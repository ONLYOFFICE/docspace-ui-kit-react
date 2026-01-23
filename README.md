# @docspace/ui-kit

UI component library for DocSpace.

## Requirements

- React >= 18.0.0
- React DOM >= 18.0.0

## Installation

```bash
pnpm add @docspace/ui-kit
```

## Usage

### Import from main entry

```js
import { Button, Label, Text, Link, Portal, Tooltip, TextInput, Loader, Checkbox, ThemeProvider, Scrollbar } from "@docspace/ui-kit";
```

### Import specific components

```js
import { Button, ButtonSize } from "@docspace/ui-kit/components/button";
import { Label } from "@docspace/ui-kit/components/label";
import { Text } from "@docspace/ui-kit/components/text";
import { Link, LinkType, LinkTarget } from "@docspace/ui-kit/components/link";
import { Portal } from "@docspace/ui-kit/components/portal";
import { Tooltip, TooltipContainer, withTooltip } from "@docspace/ui-kit/components/tooltip";
import { TextInput, InputSize, InputType } from "@docspace/ui-kit/components/text-input";
import { Loader, LoaderTypes } from "@docspace/ui-kit/components/loader";
import { Checkbox } from "@docspace/ui-kit/components/checkbox";
import { Scrollbar } from "@docspace/ui-kit/components/scrollbar";
import { ThemeProvider } from "@docspace/ui-kit/components/theme-provider";
```

### Import contexts and hooks

```js
import { ThemeProvider, useTheme } from "@docspace/ui-kit/context/ThemeContext";
```

### Import utilities

```js
import { isMobile, isTablet, isDesktop, checkIsSSR } from "@docspace/ui-kit/utils";
```

## Components

| Component | Description |
|-----------|-------------|
| [Button](./components/button/README.md) | Versatile button component with primary/secondary variants, multiple sizes, loading states, and tooltip support |
| [Checkbox](./components/checkbox/README.md) | Customizable checkbox with indeterminate and error states |
| [Label](./components/label/README.md) | Form label with required indicator and tooltip support |
| [Link](./components/link/README.md) | Hyperlink component with page and action types |
| [Loader](./components/loader/README.md) | Loading indicator with multiple animation types |
| [Portal](./components/portal/README.md) | Renders children into a different DOM node |
| [Scrollbar](./components/scrollbar/README.md) | Custom scrollbar component with auto-hide, RTL support, and flexible styling options |
| [Text](./components/text/README.md) | Typography component with various styling options |
| [TextInput](./components/text-input/README.md) | Input field for single-line strings with masking support |
| [ThemeProvider](./components/theme-provider/README.md) | Provider component for theme management with styled-components integration |
| [Tooltip](./components/tooltip/README.md) | Customizable tooltip with multiple trigger options |

## Contexts

| Context | Description |
|---------|-------------|
| [ThemeContext](./context/ThemeContext/README.md) | Theme management context with support for Base/Dark themes and custom color schemes |
