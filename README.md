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
import {
  Badge,
  Button,
  Checkbox,
  CircleSkeleton,
  DropDownItem,
  Heading,
  Label,
  Link,
  Loader,
  Portal,
  RectangleSkeleton,
  Scrollbar,
  TabItem,
  Tabs,
  Text,
  TextInput,
  Textarea,
  ThemeProvider,
  Toast,
  toastr,
  ToggleButton,
  Tooltip,
} from "@docspace/ui-kit";
```

### Import specific components

```js
import { Button, ButtonSize } from "@docspace/ui-kit/components/button";
import { Label } from "@docspace/ui-kit/components/label";
import { Text } from "@docspace/ui-kit/components/text";
import { Heading, HeadingLevel, HeadingSize } from "@docspace/ui-kit/components/heading";
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
import { Badge } from "@docspace/ui-kit/components/badge";
import { DropDownItem } from "@docspace/ui-kit/components/drop-down-item";
import { Toast, toastr } from "@docspace/ui-kit/components/toast";
import { CircleSkeleton } from "@docspace/ui-kit/components/circle";
import { RectangleSkeleton } from "@docspace/ui-kit/components/rectangle";
```

### Import contexts and hooks

```js
import { ThemeProvider, useTheme } from "@docspace/ui-kit/context/ThemeContext";
import { InterfaceDirectionProvider, useInterfaceDirection } from "@docspace/ui-kit/context/InterfaceDirectionContext";
```

### Import utilities

```js
import { isMobile, isTablet, isDesktop, checkIsSSR } from "@docspace/ui-kit/utils";
import commonIconsStyles, { IconSizeType, isIconSizeType } from "@docspace/ui-kit/utils/common-icons-style";
import DomHelpers from "@docspace/ui-kit/utils/dom-helpers";
import { useClickOutside } from "@docspace/ui-kit/utils/use-click-outside";
```

## Components

| Component | Description |
|-----------|-------------|
| [Badge](./components/badge/README.md) | Versatile badge for notifications, status markers, or interactive elements with various display modes |
| [Button](./components/button/README.md) | Versatile button component with primary/secondary variants, multiple sizes, loading states, and tooltip support |
| [Checkbox](./components/checkbox/README.md) | Customizable checkbox with indeterminate and error states |
| [CircleSkeleton](./components/circle/README.md) | Circular skeleton loader for avatar and icon placeholders |
| [DropDownItem](./components/drop-down-item/README.md) | Dropdown item for menus and lists with separator, header, submenu, and toggle support |
| [Heading](./components/heading/README.md) | Heading text structured in levels with customizable sizes and types |
| [Label](./components/label/README.md) | Form label with required indicator and tooltip support |
| [Link](./components/link/README.md) | Hyperlink component with page and action types |
| [Loader](./components/loader/README.md) | Loading indicator with multiple animation types |
| [Portal](./components/portal/README.md) | Renders children into a different DOM node |
| [RectangleSkeleton](./components/rectangle/README.md) | Rectangular skeleton loader for text, buttons, and content placeholders |
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

## Utilities

| Utility | Description |
|---------|-------------|
| [common-icons-style](./utils/common-icons-style/README.md) | Styled-components CSS helper for consistent icon sizing with `IconSizeType` enum |
| [device](./utils/device/README.md) | Device detection utilities: `isMobile`, `isTablet`, `isDesktop`, `checkIsSSR` |
| [dom-helpers](./utils/dom-helpers/README.md) | DOM utilities for viewport, element positioning, scrollbar width, and z-index management |
| [use-click-outside](./utils/use-click-outside/README.md) | React hook for detecting clicks outside an element, useful for dropdowns and modals |
| [uuid](./utils/uuid/README.md) | UUID v4 generation utility for unique identifiers |
