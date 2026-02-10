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
  Aside,
  AsideHeader,
  Avatar,
  Backdrop,
  Badge,
  Button,
  Calendar,
  Checkbox,
  CircleSkeleton,
  ComboBox,
  ContextMenu,
  ContextMenuButton,
  DatePicker,
  DateTimePicker,
  DropDown,
  DropDownItem,
  EmptyScreenContainer,
  EmptyView,
  FileInput,
  Heading,
  IconButton,
  InputBlock,
  Label,
  Link,
  Loader,
  LoaderWrapper,
  MCPIcon,
  ModalDialog,
  Portal,
  PublicRoomBar,
  RadioButton,
  RadioButtonGroup,
  RectangleSkeleton,
  RoomIcon,
  RoomLogo,
  Scrollbar,
  SearchInput,
  SelectedItem,
  Row,
  RowContainer,
  RowContent,
  StatusMessage,
  TabItem,
  Tabs,
  Tag,
  Tags,
  Text,
  TextInput,
  Textarea,
  ThemeProvider,
  TimePicker,
  Toast,
  toastr,
  ToggleButton,
  Tooltip,
  BaseTile,
  FileTile,
  FolderTile,
  RoomTile,
  TemplateTile,
  TileContainer,
  TileContent,
} from "@docspace/ui-kit";
```

### Import specific components

```js
import { Aside, AsideHeader } from "@docspace/ui-kit/components/aside";
import { Avatar } from "@docspace/ui-kit/components/avatar";
import { Backdrop } from "@docspace/ui-kit/components/backdrop";
import { Badge } from "@docspace/ui-kit/components/badge";
import { Button, ButtonSize } from "@docspace/ui-kit/components/button";
import { Calendar } from "@docspace/ui-kit/components/calendar";
import { Checkbox } from "@docspace/ui-kit/components/checkbox";
import { CircleSkeleton } from "@docspace/ui-kit/components/circle";
import { ComboBox } from "@docspace/ui-kit/components/combobox";
import { ContextMenu } from "@docspace/ui-kit/components/context-menu";
import { ContextMenuButton, ContextMenuButtonDisplayType } from "@docspace/ui-kit/components/context-menu-button";
import { DatePicker } from "@docspace/ui-kit/components/date-picker";
import { DateTimePicker } from "@docspace/ui-kit/components/date-time-picker";
import { DropDown } from "@docspace/ui-kit/components/drop-down";
import { DropDownItem } from "@docspace/ui-kit/components/drop-down-item";
import { EmptyScreenContainer } from "@docspace/ui-kit/components/empty-screen-container";
import { EmptyView } from "@docspace/ui-kit/components/empty-view";
import { FileInput } from "@docspace/ui-kit/components/file-input";
import { Heading, HeadingLevel, HeadingSize } from "@docspace/ui-kit/components/heading";
import { IconButton } from "@docspace/ui-kit/components/icon-button";
import { InputBlock } from "@docspace/ui-kit/components/input-block";
import { Label } from "@docspace/ui-kit/components/label";
import { Link, LinkType, LinkTarget } from "@docspace/ui-kit/components/link";
import { Loader, LoaderTypes } from "@docspace/ui-kit/components/loader";
import { LoaderWrapper } from "@docspace/ui-kit/components/loader-wrapper";
import { MCPIcon, MCPIconSize } from "@docspace/ui-kit/components/mcp-icon";
import { ModalDialog, ModalDialogType } from "@docspace/ui-kit/components/modal-dialog";
import { Portal } from "@docspace/ui-kit/components/portal";
import { PublicRoomBar } from "@docspace/ui-kit/components/public-room-bar";
import { Row, RowContainer, RowContent } from "@docspace/ui-kit/components/rows";
import { RadioButton } from "@docspace/ui-kit/components/radio-button";
import { RadioButtonGroup } from "@docspace/ui-kit/components/radio-button-group";
import { RectangleSkeleton } from "@docspace/ui-kit/components/rectangle";
import { RoomIcon } from "@docspace/ui-kit/components/room-icon";
import { RoomLogo } from "@docspace/ui-kit/components/room-logo";
import { Scrollbar } from "@docspace/ui-kit/components/scrollbar";
import { SearchInput } from "@docspace/ui-kit/components/search-input";
import { SelectedItem } from "@docspace/ui-kit/components/selected-item";
import { StatusMessage } from "@docspace/ui-kit/components/status-message";
import { TabItem } from "@docspace/ui-kit/components/tab-item";
import { Tabs, TabsTypes } from "@docspace/ui-kit/components/tabs";
import { Tag } from "@docspace/ui-kit/components/tag";
import { Tags } from "@docspace/ui-kit/components/tags";
import { Text } from "@docspace/ui-kit/components/text";
import { TextInput, InputSize, InputType } from "@docspace/ui-kit/components/text-input";
import { Textarea } from "@docspace/ui-kit/components/textarea";
import { ThemeProvider } from "@docspace/ui-kit/components/theme-provider";
import { TimePicker } from "@docspace/ui-kit/components/time-picker";
import { Toast, toastr } from "@docspace/ui-kit/components/toast";
import { ToggleButton } from "@docspace/ui-kit/components/toggle-button";
import { Tooltip, TooltipContainer, withTooltip } from "@docspace/ui-kit/components/tooltip";
import { BaseTile, FileTile, FolderTile, RoomTile, TemplateTile, TileContainer, TileContent } from "@docspace/ui-kit/components/tiles";
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
| [AddButton](./components/add-button/README.md) | Button component for adding items with optional label, loading state, and accent styling |
| [Aside](./components/aside/README.md) | Sliding panel component for displaying side content like settings, details, or forms |
| [AsideHeader](./components/aside/aside-header/README.md) | Header component for aside panels with optional back/close buttons, custom icons, and loading states |
| [Avatar](./components/avatar/README.md) | Component for displaying user or group avatars with images, initials, icons, and role indicators |
| [Backdrop](./components/backdrop/README.md) | Customizable overlay for modals, dialogs, and aside components with touch support |
| [Badge](./components/badge/README.md) | Versatile badge for notifications, status markers, or interactive elements with various display modes |
| [Button](./components/button/README.md) | Versatile button component with primary/secondary variants, multiple sizes, loading states, and tooltip support |
| [Calendar](./components/calendar/README.md) | Custom calendar component for date selection |
| [Checkbox](./components/checkbox/README.md) | Customizable checkbox with indeterminate and error states |
| [CircleSkeleton](./components/circle/README.md) | Circular skeleton loader for avatar and icon placeholders |
| [ComboBox](./components/combobox/README.md) | Combo box combining text input with dropdown list, supporting search and custom styling |
| [ContextMenu](./components/context-menu/README.md) | Context menu for displaying contextual actions with submenus, headers, toggles, and hotkeys |
| [ContextMenuButton](./components/context-menu-button/README.md) | Button for displaying context menu actions on list items with dropdown support |
| [DatePicker](./components/date-picker/README.md) | Date picker input component for selecting dates |
| [DateTimePicker](./components/date-time-picker/README.md) | Combined date and time input component |
| [DropDown](./components/drop-down/README.md) | Dropdown component for menus, options, and contextual content with auto-positioning |
| [DropDownItem](./components/drop-down-item/README.md) | Dropdown item for menus and lists with separator, header, submenu, and toggle support |
| [EmptyScreenContainer](./components/empty-screen-container/README.md) | Component for displaying empty states with image, text, and action buttons |
| [EmptyView](./components/empty-view/README.md) | Empty state component with icon, title, description, and interactive options |
| [FileInput](./components/file-input/README.md) | File entry field |
| [Heading](./components/heading/README.md) | Heading text structured in levels with customizable sizes and types |
| [IconButton](./components/icon-button/README.md) | Button component displaying an icon with hover, click, and disabled states |
| [InputBlock](./components/input-block/README.md) | Input component combining text input with optional icon and children elements |
| [Label](./components/label/README.md) | Form label with required indicator and tooltip support |
| [Link](./components/link/README.md) | Hyperlink component with page and action types |
| [Loader](./components/loader/README.md) | Loading indicator with multiple animation types |
| [LoaderWrapper](./components/loader-wrapper/README.md) | Wrapper that dims children and blocks interactions during loading |
| [MCPIcon](./components/mcp-icon/README.md) | Icon component for MCP (Model Context Protocol) with image or text fallback |
| [ModalDialog](./components/modal-dialog/README.md) | Versatile modal dialog component supporting both modal and aside (side panel) display types with keyboard shortcuts |
| [Portal](./components/portal/README.md) | Renders children into a different DOM node |
| [PublicRoomBar](./components/public-room-bar/README.md) | Information bar for public room notifications with header, body text, and close button |
| [RadioButton](./components/radio-button/README.md) | Radio button component with customizable labels and styles |
| [RadioButtonGroup](./components/radio-button-group/README.md) | Group of radio buttons with horizontal/vertical layouts and text labels |
| [RectangleSkeleton](./components/rectangle/README.md) | Rectangular skeleton loader for text, buttons, and content placeholders |
| [RoomIcon](./components/room-icon/README.md) | Room icon component with support for images, colors, badges, editing, and various states |
| [RoomLogo](./components/room-logo/README.md) | Room logo component displaying room type icons with archive, template, and checkbox support |
| [Row](./components/rows/row/README.md) | Versatile list row with checkbox, context menu, badges, and modern/default layouts for file or member listings |
| [RowContainer](./components/rows/row-container/README.md) | Wrapper for rendering multiple rows with optional `react-window` virtualization and infinite loading |
| [RowContent](./components/rows/row-content/README.md) | Layout helper that arranges row title, icons, and side sections while generating tablet-friendly summaries |
| [Scrollbar](./components/scrollbar/README.md) | Custom scrollbar component with auto-hide, RTL support, and flexible styling options |
| [SearchInput](./components/search-input/README.md) | Search input component with auto-refresh, clear button, and debounce support |
| [SelectedItem](./components/selected-item/README.md) | Component for displaying selected items with remove functionality |
| [StatusMessage](./components/status-message/README.md) | Animated status message component for displaying error and warning messages |
| [TabItem](./components/tab-item/README.md) | Tab navigation component with active states, multi-select, and disabled state support |
| [Tabs](./components/tabs/README.md) | Tab container component with primary/secondary themes, sticky positioning, and content management |
| [Tag](./components/tag/README.md) | Tag component for displaying virtual room tags |
| [Tags](./components/tags/README.md) | Container component for displaying multiple tags |
| [Text](./components/text/README.md) | Typography component with various styling options |
| [TextInput](./components/text-input/README.md) | Input field for single-line strings with masking support |
| [Textarea](./components/textarea/README.md) | Multi-line text input with JSON formatting, line numbers, and copy functionality |
| [ThemeProvider](./components/theme-provider/README.md) | Provider component for theme management with styled-components integration |
| [TimePicker](./components/time-picker/README.md) | Time input component for selecting time values |
| [Toast](./components/toast/README.md) | Notification component with success, error, warning, and info variants (see [i18n Setup](#i18n-setup)) |
| [ToggleButton](./components/toggle-button/README.md) | Customizable toggle button with loading and disabled states |
| [Tooltip](./components/tooltip/README.md) | Customizable tooltip with multiple trigger options |
| [BaseTile](./components/tiles/base-tile/README.md) | Base tile component providing foundational structure for all tile components |
| [FileTile](./components/tiles/file-tile/README.md) | File tile component for displaying file information with thumbnail preview |
| [FolderTile](./components/tiles/folder-tile/README.md) | Folder tile component with support for compact and big folder views |
| [RoomTile](./components/tiles/room-tile/README.md) | Room tile component for displaying room information with tags and metadata |
| [TemplateTile](./components/tiles/template-tile/README.md) | Template tile component with owner and storage metadata |
| [TileContainer](./components/tiles/tile-container/README.md) | Container for organizing tiles in a grid layout with automatic categorization |
| [TileContent](./components/tiles/tile-content/README.md) | Content wrapper component for tile children with consistent styling |

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
| [get-text-color](./utils/get-text-color/README.md) | Determines optimal text color (black/white) for a background based on perceived brightness |
| [trim-separator](./utils/trim-separator/README.md) | Cleans up context menu arrays by removing redundant separators and disabled items |
| [use-click-outside](./utils/use-click-outside/README.md) | React hook for detecting clicks outside an element, useful for dropdowns and modals |
| [uuid](./utils/uuid/README.md) | UUID v4 generation utility for unique identifiers |

## i18n Setup

Several components support automatic localization from `window.i18n`. This includes:
- **Toast** - automatic titles for success/error/warning/info notifications
- **DropDownItem** - beta and paid badge labels
- **Selector** - empty screen texts, button labels, and error messages

### Setup

Set up `window.i18n` with your translations:

```typescript
window.i18n = {
  loaded: {
    "en/Common.json": {
      data: {
        // Toast titles
        Done: "Done",
        Warning: "Warning",
        Alert: "Alert",
        Info: "Info",
        // DropDownItem badges
        BetaLabel: "Beta",
        Paid: "Paid",
        // Selector
        ClearFilter: "Clear filter",
        Back: "Back",
        ContainsSpecCharacter: "Contains special characters",
        NoRoomsFound: "No rooms found",
        SelectorFormRoomEmptyScreenDescription: "Create a form filling room...",
        SelectorVDREmptyScreenDescription: "Create a virtual data room...",
        CreateFormFillingRoom: "Create form filling room",
        CreateVirtualDataRoom: "Create virtual data room",
        // FileInput
        NotSupportedFormat: "Sorry, this file format isn't supported",
      },
    },
    "ru/Common.json": {
      data: {
        Done: "Готово",
        Warning: "Предупреждение",
        Alert: "Внимание",
        Info: "Информация",
        BetaLabel: "Бета",
        Paid: "Платно",
        ClearFilter: "Очистить фильтр",
        Back: "Назад",
        // ... other translations
      },
    },
    // Add more languages as needed
  },
};
```

### Language Detection

Components read the language from the `asc_language` cookie. The language mapping:

- `en-US`, `en-GB` → `en`
- Other values are used as-is (e.g., `ru`, `de`, `fr`)

### Translation Keys by Component

| Component | Translation Keys |
|-----------|------------------|
| Toast | `Done`, `Warning`, `Alert`, `Info` |
| DropDownItem | `BetaLabel`, `Paid` |
| Selector | `ClearFilter`, `Back`, `ContainsSpecCharacter`, `NoRoomsFound`, `SelectorFormRoomEmptyScreenDescription`, `SelectorVDREmptyScreenDescription`, `CreateFormFillingRoom`, `CreateVirtualDataRoom` |

### Using getCommonTranslation utility

You can import and use the `getCommonTranslation` utility directly:

```typescript
import { getCommonTranslation } from "@docspace/ui-kit/utils";

const title = getCommonTranslation("Done"); // Returns localized "Done" or undefined
const label = getCommonTranslation("BetaLabel"); // Returns localized "BetaLabel" or undefined
```
