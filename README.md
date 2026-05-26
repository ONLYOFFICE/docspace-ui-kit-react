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
  EmailInput,
  EmptyScreenContainer,
  EmptyView,
  FieldContainer,
  FileInput,
  FilterInput,
  Heading,
  HelpButton,
  IconButton,
  InputBlock,
  Label,
  Link,
  Loader,
  LoaderWrapper,
  LoadingButton,
  MCPIcon,
  ModalDialog,
  Portal,
  ProgressBar,
  PublicRoomBar,
  RadioButton,
  RadioButtonGroup,
  RectangleSkeleton,
  RoomIcon,
  RoomLogo,
  Row,
  RowContainer,
  RowContent,
  Scrollbar,
  SearchInput,
  SelectedItem,
  SelectionArea,
  Selector,
  Slider,
  SnackBar,
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
  TopLoaderService,
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
import { AccessRightSelect } from "@docspace/ui-kit/components/access-right-select";
import { Aside, AsideHeader } from "@docspace/ui-kit/components/aside";
import { Avatar } from "@docspace/ui-kit/components/avatar";
import { Backdrop } from "@docspace/ui-kit/components/backdrop";
import { Badge } from "@docspace/ui-kit/components/badge";
import { Button, ButtonSize } from "@docspace/ui-kit/components/button";
import { Calendar } from "@docspace/ui-kit/components/calendar";
import { CategoryItem } from "@docspace/ui-kit/components/category-item";
import { Checkbox } from "@docspace/ui-kit/components/checkbox";
import { CircleSkeleton } from "@docspace/ui-kit/components/circle";
import { ColorInput } from "@docspace/ui-kit/components/color-input";
import { ColorPicker } from "@docspace/ui-kit/components/color-picker";
import { ComboBox } from "@docspace/ui-kit/components/combobox";
import { ContextMenu } from "@docspace/ui-kit/components/context-menu";
import { ContextMenuButton, ContextMenuButtonDisplayType } from "@docspace/ui-kit/components/context-menu-button";
import { DatePicker } from "@docspace/ui-kit/components/date-picker";
import { DateTimePicker } from "@docspace/ui-kit/components/date-time-picker";
import { DragAndDrop } from "@docspace/ui-kit/components/drag-and-drop";
import { DropDown } from "@docspace/ui-kit/components/drop-down";
import { DropDownItem } from "@docspace/ui-kit/components/drop-down-item";
import { Dropzone } from "@docspace/ui-kit/components/dropzone";
import { EmailInput } from "@docspace/ui-kit/components/email-input";
import { EmptyScreenContainer } from "@docspace/ui-kit/components/empty-screen-container";
import { EmptyView } from "@docspace/ui-kit/components/empty-view";
import { ErrorContainer } from "@docspace/ui-kit/components/error-container";
import { FieldContainer } from "@docspace/ui-kit/components/field-container";
import { FileInput } from "@docspace/ui-kit/components/file-input";
import { FilterInput } from "@docspace/ui-kit/components/filter";
import { FloatingButton, FloatingButtonIcons } from "@docspace/ui-kit/components/floating-button";
import { FormWrapper } from "@docspace/ui-kit/components/form-wrapper";
import { Heading, HeadingLevel, HeadingSize } from "@docspace/ui-kit/components/heading";
import { HelpButton } from "@docspace/ui-kit/components/help-button";
import { IconButton } from "@docspace/ui-kit/components/icon-button";
import { ImageEditor } from "@docspace/ui-kit/components/image-editor";
import { InfiniteLoaderComponent } from "@docspace/ui-kit/components/infinite-loader";
import { InputBlock } from "@docspace/ui-kit/components/input-block";
import { Label } from "@docspace/ui-kit/components/label";
import { Link, LinkType, LinkTarget } from "@docspace/ui-kit/components/link";
import { LinkWithDropdown } from "@docspace/ui-kit/components/link-with-dropdown";
import { Loader, LoaderTypes } from "@docspace/ui-kit/components/loader";
import { LoaderWrapper } from "@docspace/ui-kit/components/loader-wrapper";
import { LoadingButton } from "@docspace/ui-kit/components/loading-button";
import { MainButton } from "@docspace/ui-kit/components/main-button";
import { MainButtonMobile } from "@docspace/ui-kit/components/main-button-mobile";
import { MCPIcon, MCPIconSize } from "@docspace/ui-kit/components/mcp-icon";
import { ModalDialog, ModalDialogType } from "@docspace/ui-kit/components/modal-dialog";
import { Navigation } from "@docspace/ui-kit/components/navigation";
import { OperationsProgressButton } from "@docspace/ui-kit/components/operations-progress-button";
import { Paging } from "@docspace/ui-kit/components/paging";
import { PasswordInput } from "@docspace/ui-kit/components/password-input";
import { Portal } from "@docspace/ui-kit/components/portal";
import { PortalLogo } from "@docspace/ui-kit/components/portal-logo";
import { ProgressBar, PreparationPortalProgress } from "@docspace/ui-kit/components/progress-bar";
import { PublicRoomBar } from "@docspace/ui-kit/components/public-room-bar";
import { RadioButton } from "@docspace/ui-kit/components/radio-button";
import { RadioButtonGroup } from "@docspace/ui-kit/components/radio-button-group";
import { RectangleSkeleton } from "@docspace/ui-kit/components/rectangle";
import { RoomIcon } from "@docspace/ui-kit/components/room-icon";
import { RoomLogo } from "@docspace/ui-kit/components/room-logo";
import { Row, RowContainer, RowContent } from "@docspace/ui-kit/components/rows";
import { Scrollbar } from "@docspace/ui-kit/components/scrollbar";
import { SearchInput } from "@docspace/ui-kit/components/search-input";
import { Section } from "@docspace/ui-kit/components/section";
import { SelectedItem } from "@docspace/ui-kit/components/selected-item";
import { SelectionArea } from "@docspace/ui-kit/components/selection-area";
import { Selector, SelectorAccessRightsMode } from "@docspace/ui-kit/components/selector";
import { Slider } from "@docspace/ui-kit/components/slider";
import { SnackBar } from "@docspace/ui-kit/components/snackbar";
import { StatusMessage } from "@docspace/ui-kit/components/status-message";
import { TabItem } from "@docspace/ui-kit/components/tab-item";
import { TableContainer, TableBody, TableRow, TableHeader, TableGroupMenu, TableCell } from "@docspace/ui-kit/components/table";
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
import { TopLoaderService } from "@docspace/ui-kit/components/top-loading-indicator";
import { BaseTile, FileTile, FolderTile, RoomTile, TemplateTile, TileContainer, TileContent } from "@docspace/ui-kit/components/tiles";
```

### Import contexts and hooks

```js
import { ThemeProvider, useTheme } from "@docspace/ui-kit/context/ThemeContext";
import { InterfaceDirectionProvider, useInterfaceDirection } from "@docspace/ui-kit/context/InterfaceDirectionContext";

import { useAnimation } from "@docspace/ui-kit/hooks/useAnimation";
import { useDebounce } from "@docspace/ui-kit/hooks/useDebounce";
import { useEventListener } from "@docspace/ui-kit/hooks/useEventListener";
import { useIsomorphicLayoutEffect } from "@docspace/ui-kit/hooks/useIsomorphicLayoutEffect";
```

### Import providers

```js
import { Providers } from "@docspace/ui-kit/providers";
import { ApiProvider, useApi } from "@docspace/ui-kit/providers/api";
import { ErrorBoundary } from "@docspace/ui-kit/providers/error-boundary";
import { TranslationProvider, useI18N } from "@docspace/ui-kit/providers/translation";
import { ThemeProvider } from "@docspace/ui-kit/providers/theme";
import type { TTranslations } from "@docspace/ui-kit/providers/translation";
```

### Import errors

```js
import { Error401, Error403, Error404, ErrorOfflineContainer, ErrorInvalidLink, ErrorUnavailable, AccessRestricted } from "@docspace/ui-kit/errors";
```

### Import utilities

```js
import { isMobile, isTablet, isDesktop, checkIsSSR } from "@docspace/ui-kit/utils";
import { IconSizeType, isIconSizeType } from "@docspace/ui-kit/utils/common-icons-style";
import DomHelpers from "@docspace/ui-kit/utils/dom-helpers";
import { useClickOutside } from "@docspace/ui-kit/utils/use-click-outside";
import { getCommonTranslation } from "@docspace/ui-kit/utils/i18n";
import { combineUrl } from "@docspace/ui-kit/utils/combineUrl";
import { getCookie, setCookie, deleteCookie } from "@docspace/ui-kit/utils/cookie";
import { parseAddress, parseAddresses, EmailSettings } from "@docspace/ui-kit/utils/email";
```

### Import enums, constants, and types

```js
import { ShareAccessRights, EmployeeType, RoomsType, ThemeKeys, FileType, FolderType } from "@docspace/ui-kit/enums";
import { LOADER_STYLE, OPERATIONS_NAME, EMPTY_ARRAY, EMPTY_OBJECT } from "@docspace/ui-kit/constants";
import type { TFile, TFolder, TUser, TFileSecurity, TFolderSecurity, TRoomSecurity } from "@docspace/ui-kit/types";
```

## Components

| Component | Description |
|-----------|-------------|
| [AccessRightSelect](./components/access-right-select/README.md) | Dropdown selector for managing access rights and permissions on resources |
| [AddButton](./components/add-button/README.md) | Button component for adding items with optional label, loading state, and accent styling |
| AppLoader | Full-page loading spinner displayed during application initialization |
| Article | Responsive sidebar panel with header, main button, and body sections for navigation |
| [Aside](./components/aside/README.md) | Sliding panel component for displaying side content like settings, details, or forms |
| [AsideHeader](./components/aside/aside-header/README.md) | Header component for aside panels with optional back/close buttons, custom icons, and loading states |
| [Avatar](./components/avatar/README.md) | Component for displaying user or group avatars with images, initials, icons, and role indicators |
| [Backdrop](./components/backdrop/README.md) | Customizable overlay for modals, dialogs, and aside components with touch support |
| [Badge](./components/badge/README.md) | Versatile badge for notifications, status markers, or interactive elements with various display modes |
| [Button](./components/button/README.md) | Versatile button component with primary/secondary variants, multiple sizes, loading states, and tooltip support |
| [Calendar](./components/calendar/README.md) | Custom calendar component for date selection |
| CategoryItem | Navigation link item with optional badge and arrow indicator for menu hierarchies |
| [Chat](./ai-agent/chat/README.md) | AI chat interface with streaming responses, message history, file attachments, and AI tools integration |
| [Checkbox](./components/checkbox/README.md) | Customizable checkbox with indeterminate and error states |
| [CircleSkeleton](./components/circle/README.md) | Circular skeleton loader for avatar and icon placeholders |
| [ColorInput](./components/color-input/README.md) | Text input for entering and validating color values |
| [ColorPicker](./components/color-picker/README.md) | Interactive color selection component for choosing colors visually |
| [ComboBox](./components/combobox/README.md) | Combo box combining text input with dropdown list, supporting search and custom styling |
| [ContextMenu](./components/context-menu/README.md) | Context menu for displaying contextual actions with submenus, headers, toggles, and hotkeys |
| [ContextMenuButton](./components/context-menu-button/README.md) | Button for displaying context menu actions on list items with dropdown support |
| [DatePicker](./components/date-picker/README.md) | Date picker input component for selecting dates |
| [DateTimePicker](./components/date-time-picker/README.md) | Combined date and time input component |
| [DragAndDrop](./components/drag-and-drop/README.md) | File drag-and-drop handler for upload operations |
| [DropDown](./components/drop-down/README.md) | Dropdown component for menus, options, and contextual content with auto-positioning |
| [DropDownItem](./components/drop-down-item/README.md) | Dropdown item for menus and lists with separator, header, submenu, and toggle support |
| Dropzone | Interactive file drop area with visual feedback and file type restrictions |
| [EmailInput](./components/email-input/README.md) | Email address input with built-in validation and error reporting |
| [EmptyScreenContainer](./components/empty-screen-container/README.md) | Component for displaying empty states with image, text, and action buttons |
| [EmptyView](./components/empty-view/README.md) | Empty state component with icon, title, description, and interactive options |
| [ErrorContainer](./components/error-container/README.md) | Full-page error display with decorative background, message, and action button |
| [FieldContainer](./components/field-container/README.md) | Container wrapper for form fields with consistent spacing and styling |
| [FileInput](./components/file-input/README.md) | File entry field |
| FilterInput | Filter component with search, sorting, and view options for data filtering |
| [FloatingButton](./components/floating-button/README.md) | Circular floating action button with progress indicator and alert icon |
| FormWrapper | Wrapper for form elements providing consistent form styling and layout |
| [Heading](./components/heading/README.md) | Heading text structured in levels with customizable sizes and types |
| [HelpButton](./components/help-button/README.md) | Info icon button that triggers a tooltip with help content |
| [IconButton](./components/icon-button/README.md) | Button component displaying an icon with hover, click, and disabled states |
| ImageEditor | Image cropping and editing component with file upload and preview support |
| InfiniteLoader | Virtualized infinite scroll container for loading items progressively |
| [InputBlock](./components/input-block/README.md) | Input component combining text input with optional icon and children elements |
| [Label](./components/label/README.md) | Form label with required indicator and tooltip support |
| [Link](./components/link/README.md) | Hyperlink component with page and action types |
| [LinkWithDropdown](./components/link-with-dropdown/README.md) | Link that opens a dropdown menu with additional options |
| [Loader](./components/loader/README.md) | Loading indicator with multiple animation types |
| [LoaderWrapper](./components/loader-wrapper/README.md) | Wrapper that dims children and blocks interactions during loading |
| LoadingButton | Circular button with animated progress bar and completion indicator |
| [MainButton](./components/main-button/README.md) | Primary action button with optional dropdown menu for desktop |
| [MainButtonMobile](./components/main-button-mobile/README.md) | Floating action button with expandable menu for mobile interface |
| [MCPIcon](./components/mcp-icon/README.md) | Icon component for MCP (Model Context Protocol) with image or text fallback |
| [ModalDialog](./components/modal-dialog/README.md) | Versatile modal dialog component supporting both modal and aside (side panel) display types with keyboard shortcuts |
| Navigation | Breadcrumb navigation with expandable hierarchical sections |
| OperationsProgressButton | Operation progress tracker for multiple concurrent operations with error checking |
| [Paging](./components/paging/README.md) | Pagination controls for navigating through pages of data |
| [PasswordInput](./components/password-input/README.md) | Password input with strength validation, generator, and reveal/hide toggle |
| [Portal](./components/portal/README.md) | Renders children into a different DOM node |
| [PortalLogo](./components/portal-logo/README.md) | Responsive logo component with fallback handling |
| [ProgressBar](./components/progress-bar/README.md) | Visual progress indicator bar and portal preparation progress display |
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
| [Section](./components/section/README.md) | Page layout with header, filter, body, footer, info panel, and operations progress sections |
| [SelectedItem](./components/selected-item/README.md) | Component for displaying selected items with remove functionality |
| [SelectionArea](./components/selection-area/README.md) | Mouse-driven rectangular selection area for selecting multiple items |
| [Selector](./components/selector/README.md) | Dropdown selector with access rights modes for item selection with permissions |
| [Slider](./components/slider/README.md) | Range input slider with optional fill visualization and RTL support |
| SnackBar | Toast notification component for temporary messages and alerts |
| [StatusMessage](./components/status-message/README.md) | Animated status message component for displaying error and warning messages |
| [TabItem](./components/tab-item/README.md) | Tab navigation component with active states, multi-select, and disabled state support |
| TableContainer | Modular table with body, row, header, group menu, and cell sub-components |
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
| TopLoaderService | Top page progress bar service with `start()`, `end()`, `cancel()` static methods |
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

## Hooks

| Hook | Description |
|------|-------------|
| useAnimation | Manages animation state with phases (none/start/progress/finish), dispatches custom window events, and returns refs and `triggerAnimation()` |
| useDebounce | Debounces callback execution with configurable delay and automatic cleanup on unmount |
| useEventListener | Typed event listener hook for Window, HTML/SVG elements, Document, and MediaQueryList with automatic cleanup |
| useIsomorphicLayoutEffect | SSR-safe effect hook — uses `useLayoutEffect` in browser, `useEffect` on server |

## Providers

Composed providers that wrap your application with error handling, API access, translations, and theming.

| Provider | Description |
|----------|-------------|
| [Providers](./providers/README.md) | All-in-one composition of ErrorBoundary, ApiProvider, TranslationProvider, and ThemeProvider |
| [ApiProvider](./providers/api/README.md) | Creates React Context with `profilesApi` and `commonSettingsApi` from `@onlyoffice/docspace-api-sdk` |
| [ErrorBoundary](./providers/error-boundary/README.md) | Class component that catches render errors with custom fallback UI and `onError` callback |
| [TranslationProvider](./providers/translation/README.md) | Wraps `I18nextProvider` and initializes i18next with translation resources |
| [ThemeProvider](./providers/theme/README.md) | Resolves theme (Base/Dark/System), fetches color themes, monitors system preferences |

### Quick Start

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
>
  <App />
</Providers>
```

See [Providers with i18n](#providers-with-i18n) for full internationalization guide.

## Errors

Pre-built error page components that wrap `ErrorContainer` with localized messages via `getCommonTranslation`.

| Component | Translation Key | Description |
|-----------|:---------------:|-------------|
| Error401 | `Error401Text` | Unauthorized access error |
| Error403 | `Error403Text` | Forbidden access error |
| Error404 | `Error404Text` | Page not found error |
| ErrorOfflineContainer | `ErrorOfflineText` | Offline / no connection error |
| ErrorInvalidLink | `InvalidLink`, `LinkDoesNotExist` | Invalid or expired link error |
| ErrorUnavailable | `ErrorDeactivatedText` | Portal deactivated error |
| AccessRestricted | `AccessDenied`, `PortalRestriction` | Access restricted error |

```js
import { Error401, Error403, Error404 } from "@docspace/ui-kit/errors";
```

## Utilities

| Utility | Description |
|---------|-------------|
| [common-icons-style](./utils/common-icons-style/README.md) | Styled-components CSS helper for consistent icon sizing with `IconSizeType` enum |
| [combineUrl](./utils/combineUrl) | Merges base URL with path segments, handling trailing/leading slashes |
| [common](./utils/common.ts) | `getUserTypeTranslation` for employee role types, `RoomsTypeValues`, `RoomsTypes` helpers |
| [context](./utils/context.ts) | React context with optional `sectionWidth` and `sectionHeight` |
| [cookie](./utils/cookie) | `getCookie`, `setCookie`, `deleteCookie` — cookie management with `asc_language` special handling |
| [date](./utils/date) | Date utilities: formatting, arithmetic, comparison, duration, timezone, and parsing |
| [device](./utils/device/README.md) | Device detection utilities: `isMobile`, `isTablet`, `isDesktop`, `checkIsSSR` |
| [dom-helpers](./utils/dom-helpers/README.md) | DOM utilities for viewport, element positioning, scrollbar width, and z-index management |
| [edge-scrolling](./utils/edge-scrolling) | Auto-scrolls when mouse is near viewport edges — used for drag-and-drop operations |
| [email](./utils/email) | Email parsing and validation: `parseAddress`, `parseAddresses`, `EmailSettings`, `isValidDomainName` |
| [get-system-theme](./utils/get-system-theme) | Returns system theme preference (Dark or Base) from AscDesktopEditor or `prefers-color-scheme` |
| [get-text-color](./utils/get-text-color/README.md) | Determines optimal text color (black/white) for a background based on perceived brightness |
| [getFilesFromEvent](./utils/getFilesFromEvent) | Converts drag/drop/paste/input events to File arrays with recursive directory handling |
| [getLogoUrl](./utils/getLogoUrl) | Generates logo URL using `WhiteLabelLogoType` enum with culture and theme parameters |
| [hasOwnProperty](./utils/hasOwnProperty) | Safe `Object.hasOwn` check with try-catch that handles null/undefined |
| [i18n](./utils/i18n) | `getCommonTranslation(key)` — retrieves localized strings from `window.i18n` |
| [openingNewTab](./utils/openingNewTab) | Detects middle-click / Ctrl+Click / Cmd+Click to open URLs in new tabs |
| [trim-separator](./utils/trim-separator/README.md) | Cleans up context menu arrays by removing redundant separators and disabled items |
| [use-click-outside](./utils/use-click-outside/README.md) | React hook for detecting clicks outside an element, useful for dropdowns and modals |
| [uuid](./utils/uuid/README.md) | UUID v4 generation utility for unique identifiers |
| [add-log](./utils/add-log) | Conditionally logs to the browser console or accumulates messages in `window.logs` based on `ClientConfig` settings |
| [getTitleWithoutExtension](./utils/getTitleWithoutExtension) | Strips the file extension from a title string, returning the bare name |
| [image-helpers](./utils/image-helpers) | Generates Maps of file extension → SVG icon URL for 24 / 32 / 64 / 96 px icon sizes across document and folder types |
| [presentInArray](./utils/presentInArray) | Checks whether a string exists in an array with optional case-insensitive comparison |
| [socket](./utils/socket) | `SocketHelper` singleton for managing WebSocket connections, event subscriptions, and message emission with typed event/command enums |
| [typeGuards](./utils/typeGuards) | Type guard that checks whether a value is a Next.js `StaticImageData` object (`src`, `height`, `width`) |

## Enums

Shared enums available from `@docspace/ui-kit/enums`:

| Enum | Values |
|------|--------|
| `ShareAccessRights` | None, FullAccess, ReadOnly, DenyAccess, Varies, Review, Comment, FormFilling, CustomFilter, RoomManager, Editing, Collaborator |
| `EmployeeType` | Owner, Admin, RoomAdmin, User, Guest |
| `RoomsType` | PublicRoom, FormRoom, EditingRoom, VirtualDataRoom, CustomRoom, AIRoom |
| `EmployeeStatus` | Active, Disabled, Pending |
| `FileType` | Unknown, Archive, Video, Audio, Image, Spreadsheet, Presentation, Document, etc. |
| `FolderType` | DEFAULT, CommonDocuments, MyDocuments, Favorites, Recent, Trash, Archive, Rooms, etc. |
| `ThemeKeys` | BaseStr, DarkStr, SystemStr |

## Constants

Shared constants from `@docspace/ui-kit/constants`:

| Constant | Description |
|----------|-------------|
| `LOADER_STYLE` | Skeleton loading configuration (width, opacity, speed) |
| `OPERATIONS_NAME` | Operation type identifiers (trash, download, copy, move, convert) |
| `ROOM_ACTION_KEYS` | Room editing action keys |
| `EMPTY_ARRAY` | Frozen empty array for stable references |
| `EMPTY_OBJECT` | Frozen empty object for stable references |
| `FUNCTION_EMPTY` | No-op function |
| `LANGUAGE` | Cookie name constant: `"asc_language"` |

## Types

Key TypeScript types from `@docspace/ui-kit/types`:

| Type | Description |
|------|-------------|
| `TFile` | Comprehensive file object with security, status, and metadata |
| `TFolder` | Folder object with security and access rights |
| `TUser` | User/employee data including avatar, status, admin flags, quota |
| `TCreatedBy` | Author info: avatar, displayName, id, profileUrl |
| `TLogo` | Logo object with multiple sizes |
| `TFileSecurity` | Detailed file access rights |
| `TFolderSecurity` | Detailed folder access rights |
| `TRoomSecurity` | Detailed room access rights |
| `TViewAs` | View mode: `"tile"`, `"table"`, `"row"`, `"settings"`, `"profile"` |

## Selectors

| Variant | Item type | Description |
|---------|-----------|-------------|
| **Users Selector** | `TSelectorItemUser` | Picks workspace members; rows show avatar, role badge, employee type label, and group membership |
| **Groups Selector** | `TSelectorItemGroup` | Picks user groups; distinguishes regular groups from system-managed ones |
| **Files Selector** | `TSelectorItemFile` | Picks files; rows show file-type icon and extension label |
| **Folders Selector** | `TSelectorItemFolder` | Picks folders; rows show folder icon with nested file and subfolder counts |
| **Rooms Selector** | `TSelectorItemRoom` | Picks rooms; rows show room icon, cover image, tags, and room-type badge |
| **MCP Selector** | `TSelectorItemMCP` | Picks Model Context Protocol agents; rows show agent icon and name |

## i18n Setup

Several components support automatic localization from `window.i18n`. This includes:
- **Toast** - automatic titles for success/error/warning/info notifications
- **DropDownItem** - beta and paid badge labels
- **Selector** - empty screen texts, button labels, and error messages
- **Error pages** - all error messages (Error401, Error403, Error404, etc.)

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

## Providers with i18n

The `Providers` component integrates i18next for full internationalization support. This is the recommended approach for applications that need proper i18n with React hooks (`useTranslation`), automatic language detection, and the `window.i18n` bridge for standalone components.

### How It Works

1. **TranslationProvider** initializes an i18next instance with your translations
2. It wraps children in `I18nextProvider` from `react-i18next`
3. It also sets `window.i18n.t` and `window.i18n.loaded` so standalone components (Toast, DropDownItem, Selector, Error pages) can read translations without React context

### Translation Data Structure

Translations use a `TTranslations` type — a nested `Map`:

```typescript
type TTranslations = Map<
  string,                              // language code (e.g., "en", "ru", "fr")
  Map<
    string,                            // namespace (always "Common")
    Record<string, string>             // key-value translation pairs
  >
>;
```

### Step-by-Step Setup

#### 1. Import locale files

The library ships with locale files for 32 languages under `@docspace/ui-kit/locales/`:

```typescript
import enCommon from "@docspace/ui-kit/locales/en/Common.json";
import ruCommon from "@docspace/ui-kit/locales/ru/Common.json";
import deCommon from "@docspace/ui-kit/locales/de/Common.json";
import frCommon from "@docspace/ui-kit/locales/fr/Common.json";
// ... add as many languages as you need
```

Available locales: `ar-SA`, `az`, `bg`, `cs`, `de`, `el-GR`, `en`, `es`, `fi`, `fr`, `hy-AM`, `it`, `ja-JP`, `ko-KR`, `lo-LA`, `lv`, `nl`, `pl`, `pt`, `pt-BR`, `ro`, `ru`, `si`, `sk`, `sl`, `sq-AL`, `sr-Cyrl-RS`, `sr-Latn-RS`, `tr`, `uk-UA`, `vi`, `zh-CN`.

#### 2. Build the translations map

```typescript
import type { TTranslations } from "@docspace/ui-kit/providers/translation";

const translations: TTranslations = new Map([
  ["en", new Map([["Common", enCommon]])],
  ["ru", new Map([["Common", ruCommon]])],
  ["de", new Map([["Common", deCommon]])],
  ["fr", new Map([["Common", frCommon]])],
]);
```

#### 3. Wrap your app with Providers

```tsx
import { Providers } from "@docspace/ui-kit/providers";

function App() {
  return (
    <Providers
      url="https://your-docspace.com"
      apiKey="your-api-key"
      translations={translations}
      locale="en"
      initialTheme="BaseStr"
      errorFallback={(error) => <div>Error: {error.message}</div>}
      onError={(error, errorInfo) => console.error(error, errorInfo)}
    >
      <YourApp />
    </Providers>
  );
}
```

#### 4. Use translations in components

Inside the provider tree, use `react-i18next` hooks:

```tsx
import { useTranslation } from "react-i18next";

function MyComponent() {
  const { t } = useTranslation("Common");

  return (
    <div>
      <h1>{t("Settings")}</h1>
      <button>{t("SaveButton")}</button>
      <button>{t("CancelButton")}</button>
    </div>
  );
}
```

### Language Resolution

The `TranslationProvider` resolves the active language in this priority order:

1. `locale` prop (explicit override)
2. `user.cultureName` (from user profile)
3. `settings.culture` (from portal settings)
4. `"en"` (fallback)

If `settings` and `user` are not passed as props, they are fetched automatically from the DocSpace API using the `url` and `apiKey` provided.

### Props Reference

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `url` | `string` | Yes | Base URL of the DocSpace API |
| `apiKey` | `string` | Yes | API key for authentication |
| `translations` | `TTranslations` | No | Translation resources map |
| `locale` | `string` | No | Locale override (e.g., `"en"`, `"ru"`) |
| `settings` | `SettingsDto` | No | Portal settings (fetched from API if not provided) |
| `user` | `EmployeeFullDto` | No | Current user (fetched from API if not provided) |
| `initialTheme` | `ThemeKeys` | No | Initial theme: `"BaseStr"`, `"DarkStr"`, `"SystemStr"` |
| `systemTheme` | `ThemeKeys` | No | Override for system theme detection |
| `colorTheme` | `CustomColorThemesSettingsDto` | No | Color theme data |
| `errorFallback` | `ReactNode \| ((error: Error) => ReactNode)` | No | Custom error UI |
| `onError` | `(error: Error, errorInfo: ErrorInfo) => void` | No | Error callback |
| `children` | `ReactNode` | Yes | Child components |

### Using Individual Providers

You can also use sub-providers individually for more control:

```tsx
import { ApiProvider } from "@docspace/ui-kit/providers/api";
import { TranslationProvider } from "@docspace/ui-kit/providers/translation";
import { ThemeProvider } from "@docspace/ui-kit/providers/theme";
import { ErrorBoundary } from "@docspace/ui-kit/providers/error-boundary";

<ErrorBoundary fallback={<ErrorPage />}>
  <ApiProvider url="https://your-docspace.com" apiKey="your-api-key">
    <TranslationProvider
      translations={translations}
      locale="en"
      settings={settings}
      user={user}
    >
      <ThemeProvider initialTheme="BaseStr" locale="en">
        <App />
      </ThemeProvider>
    </TranslationProvider>
  </ApiProvider>
</ErrorBoundary>
```

### Using the useApi hook

Inside `ApiProvider`, access API clients via the `useApi` hook:

```tsx
import { useApi } from "@docspace/ui-kit/providers/api";

function MyComponent() {
  const { profilesApi, commonSettingsApi } = useApi();

  useEffect(() => {
    profilesApi.getSelfProfile().then((res) => {
      console.log(res.data.response);
    });
  }, [profilesApi]);
}
```
