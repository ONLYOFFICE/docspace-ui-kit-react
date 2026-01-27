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
import { Button, Label, Text, Link, Portal, Tooltip, TextInput, Textarea, Loader, Checkbox, ThemeProvider, Scrollbar, TabItem, Tabs, ToggleButton, Toast, toastr } from "@docspace/ui-kit";
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
import { Textarea } from "@docspace/ui-kit/components/textarea";
import { Loader, LoaderTypes } from "@docspace/ui-kit/components/loader";
import { Checkbox } from "@docspace/ui-kit/components/checkbox";
import { Scrollbar } from "@docspace/ui-kit/components/scrollbar";
import { TabItem } from "@docspace/ui-kit/components/tab-item";
import { Tabs, TabsTypes } from "@docspace/ui-kit/components/tabs";
import { ThemeProvider } from "@docspace/ui-kit/components/theme-provider";
import { ToggleButton } from "@docspace/ui-kit/components/toggle-button";
import { Toast, toastr } from "@docspace/ui-kit/components/toast";
```

### Import contexts and hooks

```js
import { ThemeProvider, useTheme } from "@docspace/ui-kit/context/ThemeContext";
import { InterfaceDirectionProvider, useInterfaceDirection } from "@docspace/ui-kit/context/InterfaceDirectionContext";
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
| [TabItem](./components/tab-item/README.md) | Tab navigation component with active states, multi-select, and disabled state support |
| [Tabs](./components/tabs/README.md) | Tab container component with primary/secondary themes, sticky positioning, and content management |
| [Text](./components/text/README.md) | Typography component with various styling options |
| [TextInput](./components/text-input/README.md) | Input field for single-line strings with masking support |
| [Textarea](./components/textarea/README.md) | Multi-line text input with JSON formatting, line numbers, and copy functionality |
| [ThemeProvider](./components/theme-provider/README.md) | Provider component for theme management with styled-components integration |
| [Toast](./components/toast/README.md) | Notification component with success, error, warning, and info variants |
| [ToggleButton](./components/toggle-button/README.md) | Customizable toggle button with loading and disabled states |
| [Tooltip](./components/tooltip/README.md) | Customizable tooltip with multiple trigger options |

## Contexts

| Context | Description |
|---------|-------------|
| [ThemeContext](./context/ThemeContext/README.md) | Theme management context with support for Base/Dark themes and custom color schemes |
| [InterfaceDirectionContext](./context/InterfaceDirectionContext/README.md) | Interface direction context for managing LTR/RTL layout support |
