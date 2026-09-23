# Components

Every component this package ships, what it is for, and how it is imported. The tables below
are generated from the metadata block of each component's README by `pnpm readme:catalogue` —
to change a row, change that README.

Two things to read before picking one:

- **Import by subpath.** `@onlyoffice/apps-ui-kit/components/<folder>` resolves for every
  component and keeps your bundle to what you use. `components/index.ts` re-exports all 98
  folders, but `export *` carries a folder's named exports and drops its default — so nine
  components are reachable only through their subpath, and only as a default import:
  `AppLoader`, `Article`, `Dropzone`, `Navigation`, `OperationsProgressButton`,
  `PublicRoomBar`, `QuantityPicker`, `RoomType` and `Section`. The Import column below says
  which is which for every component, including the nested ones, whose names reach the barrel
  through their parent.
- **Public versus portal-internal.** A portal-internal component needs DocSpace context — a
  translation function, a portal store, a device type it is told about — and will not work in a
  standalone app. [`public-api.md`](public-api.md) is the full account.

New to the package? [`getting-started.md`](getting-started.md) covers the two providers, the CSS
model and the two layout rules first.

## Which one do I want

### The close calls

| You want                                     | Use                                                 | Not                                                                              |
| -------------------------------------------- | --------------------------------------------------- | -------------------------------------------------------------------------------- |
| A dialog in the middle of the screen         | `ModalDialog`                                       | `Aside`, which is the same dialog docked to the edge                             |
| A panel sliding in from the side             | `Aside`, or `ModalDialog` with `displayType` aside  | `Section`'s info panel, which is part of the portal layout                       |
| A menu under a control                       | `DropDown` with `DropDownItem`                      | `ContextMenu`, which is the right-click menu and positions itself at the pointer |
| A line of text                               | `Text`                                              | `Heading`, which carries the heading sizes and weights                           |
| A caption above a field                      | `FieldContainer`, which draws one                   | `Label` on its own, unless the field is outside a container                      |
| A spinner while something loads              | `Loader` with an explicit `type`                    | the default `Loader`, which renders its label as text and no spinner             |
| Placeholder shapes while a list loads        | `RectangleSkeleton`, `CircleSkeleton`               | `Loader`, which says "busy" rather than "this is the shape of what is coming"    |
| A measurable percentage                      | `ProgressBar`                                       | `TopLoaderService`, whose numbers are invented by a timer                        |
| A page-wide wait with no number              | `TopLoaderService`                                  | `AppLoader`, which covers the screen and blocks nothing                          |
| A table of data with columns                 | `components/table`                                  | `Rows`, which is the portal's file list and reads children by index              |
| A grid of cards                              | `Tiles`                                             | `Rows` in a wider container                                                      |
| "Nothing here yet" in a page                 | `EmptyView`                                         | `EmptyScreenContainer`, the older portal one                                     |
| A message that goes away by itself           | `toastr` plus one mounted `Toast`                   | `StatusMessage`, which stays until you clear it                                  |
| A message that stays until the state changes | `StatusMessage`                                     | `Toast`, which is transient by design                                            |
| A banner the reader can close                | `Snackbar`, `ColumnarInfoBar`                       | `StatusMessage`, which has no close control                                      |
| An upload area with a file dialog            | `Dropzone`                                          | `DragAndDrop`, which has no dialog and no filtering                              |
| An existing element to accept dropped files  | `DragAndDrop`                                       | `Dropzone`, which draws a bordered area of its own                               |
| A search field                               | `SearchInput` — its `onChange` receives the string  | `TextInput`, whose `onChange` receives the event                                 |
| Yes or no                                    | `ToggleButton` in a wrapper with a size, `Checkbox` | `ToggleButton` alone, which has no size of its own                               |

### The prop that shows and hides it

There is no single name. Guessing wrong is silent — the prop is ignored and nothing is logged:

| Prop      | Components                                                                                |
| --------- | ----------------------------------------------------------------------------------------- |
| `visible` | `Aside`, `ModalDialog`, `Backdrop`, `Portal`, `AvatarEditorDialog`, `RoomLogoCoverDialog` |
| `isOpen`  | `HelpButton`, `LinkWithDropdown`, `Tooltip`, `CollapsibleCard`                            |
| `opened`  | `ComboBox`, `ContextMenuButton`, `MainButtonMobile`                                       |
| `open`    | `DropDown`                                                                                |

The catalogue below repeats it per component, and `check-readme` verifies each entry against the
component's real props.

<!-- catalogue:start -->

_Generated by `pnpm readme:catalogue` from the metadata block of each component README. Do not edit; edit the README._

### Interactive elements

| Component                                                        | Status          | Import            | Shown and hidden by | What it is for                                                                                                  |
| ---------------------------------------------------------------- | --------------- | ----------------- | ------------------- | --------------------------------------------------------------------------------------------------------------- |
| [ActionButton](../components/action-button/README.md)            | public          | barrel or subpath | –                   | Small tinted button for a secondary action, optionally rendered as another element.                             |
| [AddButton](../components/add-button/README.md)                  | public          | barrel or subpath | –                   | Square icon button with an optional label beside it, for adding one more of something.                          |
| [Button](../components/button/README.md)                         | public          | barrel or subpath | –                   | Labelled action button with an optional icon, a loading state and a tooltip, in a primary or secondary variant. |
| [ContextMenuButton](../components/context-menu-button/README.md) | public          | barrel or subpath | `opened`            | Icon that opens a menu of actions, built afresh from a callback each time it is clicked.                        |
| [DragAndDrop](../components/drag-and-drop/README.md)             | public          | barrel or subpath | –                   | Wrapper that turns whatever is inside it into a drop target for files, with no interface of its own.            |
| [Dropzone](../components/dropzone/README.md)                     | public          | subpath only      | –                   | Dashed upload area with a picture, a prompt and a format list, which turns into a loader while the upload runs. |
| [FloatingButton](../components/floating-button/README.md)        | public          | barrel or subpath | –                   | Round corner badge that shows the progress of a background operation and opens its panel.                       |
| [HelpButton](../components/help-button/README.md)                | public          | barrel or subpath | `isOpen`            | Info icon that opens an explanation on click, for a label that needs more than a label.                         |
| [IconButton](../components/icon-button/README.md)                | public          | barrel or subpath | –                   | Icon that acts as a button, with hover and pressed colours and an optional tooltip.                             |
| [ImageEditor](../components/image-editor/README.md)              | portal-internal | barrel or subpath | –                   | Crop window with drag, zoom and a replace control, for turning an uploaded picture into an avatar or a logo.    |
| [LinkWithDropdown](../components/link-with-dropdown/README.md)   | public          | barrel or subpath | `isOpen`            | Dashed link that opens a menu under itself.                                                                     |
| [MainButton](../components/main-button/README.md)                | public          | barrel or subpath | –                   | Accent button at the top of a side menu that opens a menu of the things a user can create.                      |
| [MainButtonMobile](../components/main-button-mobile/README.md)   | public          | barrel or subpath | `opened`            | Floating round button in the corner of the screen that opens a full-width sheet of actions.                     |

### Form controls

| Component                                                        | Status | Import            | Shown and hidden by | What it is for                                                                                                       |
| ---------------------------------------------------------------- | ------ | ----------------- | ------------------- | -------------------------------------------------------------------------------------------------------------------- |
| [AccessRightSelect](../components/access-right-select/README.md) | public | barrel or subpath | –                   | Drop-down for choosing an access level, with an icon, a description and a paid badge on each row.                    |
| [Calendar](../components/calendar/README.md)                     | public | barrel or subpath | –                   | Month grid for picking a day, with month and year views behind it.                                                   |
| [Checkbox](../components/checkbox/README.md)                     | public | barrel or subpath | –                   | Checkbox with a label, an indeterminate state and an optional help button.                                           |
| [ColorInput](../components/color-input/README.md)                | public | barrel or subpath | –                   | Hex field with a swatch that opens a colour picker.                                                                  |
| [ColorPicker](../components/color-picker/README.md)              | public | barrel or subpath | –                   | Saturation square with a hue strip for choosing a colour, with or without a hex field and buttons.                   |
| [ComboBox](../components/combobox/README.md)                     | public | barrel or subpath | `opened`            | Button showing the current choice, with a list of options under it.                                                  |
| [DatePicker](../components/date-picker/README.md)                | public | barrel or subpath | –                   | Button that becomes a removable chip once a date is chosen, with a calendar behind it.                               |
| [DateTimePicker](../components/date-time-picker/README.md)       | public | barrel or subpath | –                   | A date chip and a time beside it, editable in place.                                                                 |
| [EmailInput](../components/email-input/README.md)                | public | barrel or subpath | –                   | Text field that parses what is typed as an email address and colours itself when it does not parse.                  |
| [FieldContainer](../components/field-container/README.md)        | public | barrel or subpath | –                   | Layout wrapper for one form field: an optional label with a help tooltip, the control itself, and its error message. |
| [FileInput](../components/file-input/README.md)                  | public | barrel or subpath | –                   | Read-only field with a folder icon that opens the file dialog and accepts a drop.                                    |
| [FormWrapper](../components/form-wrapper/README.md)              | public | barrel or subpath | –                   | White card of a fixed width that the portal's sign-in and wizard forms sit on.                                       |
| [InputBlock](../components/input-block/README.md)                | public | barrel or subpath | –                   | Text field with an icon at the end and room for a prefix before it, inside one border.                               |
| [Label](../components/label/README.md)                           | public | barrel or subpath | –                   | Caption for a form field, with an optional required asterisk and an error colour.                                    |
| [PasswordInput](../components/password-input/README.md)          | public | barrel or subpath | –                   | Password field with a reveal eye, a strength tooltip and a generator.                                                |
| [QuantityPicker](../components/quantity-picker/README.md)        | public | subpath only      | –                   | Minus and plus around a number, with an optional slider and quick-add chips.                                         |
| [RadioButton](../components/radio-button/README.md)              | public | barrel or subpath | –                   | One option of a single-choice set, drawn as a labelled circle.                                                       |
| [RadioButtonGroup](../components/radio-button-group/README.md)   | public | barrel or subpath | –                   | A set of radio buttons built from an array, with the selected value handled for you.                                 |
| [SearchInput](../components/search-input/README.md)              | public | barrel or subpath | –                   | Search field with a magnifier, an optional clear button and a debounced change callback.                             |
| [Slider](../components/slider/README.md)                         | public | barrel or subpath | –                   | Range input with the kit's own track and handle.                                                                     |
| [Textarea](../components/textarea/README.md)                     | public | barrel or subpath | –                   | Multi-line text field that grows with its content, with optional line numbers, a copy button and a JSON mode.        |
| [TextInput](../components/text-input/README.md)                  | public | barrel or subpath | –                   | Controlled single-line text field in three fixed widths, with optional masking, error and warning states.            |
| [TimePicker](../components/time-picker/README.md)                | public | barrel or subpath | –                   | Two small fields, hours and minutes, that move the caret along as you type.                                          |
| [ToggleButton](../components/toggle-button/README.md)            | public | barrel or subpath | –                   | Switch for one on/off setting, with an optional label beside it.                                                     |

### Overlays

| Component                                                             | Status          | Import            | Shown and hidden by | What it is for                                                                                                            |
| --------------------------------------------------------------------- | --------------- | ----------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| [Aside](../components/aside/README.md)                                | public          | barrel or subpath | `visible`           | Panel that slides in from the side of the viewport, with a header and a scrolling body.                                   |
| [AsideHeader](../components/aside/aside-header/README.md)             | public          | barrel or subpath | –                   | Title bar of a side panel or a dialog, with a back arrow, extra icons and the close cross.                                |
| [AvatarEditorDialog](../components/avatar-editor-dialog/README.md)    | portal-internal | barrel or subpath | `visible`           | Modal that frames an uploaded picture: the kit's crop window between a title and a save and cancel pair.                  |
| [Backdrop](../components/backdrop/README.md)                          | public          | barrel or subpath | `visible`           | Full-screen layer behind an overlay, transparent by default, that catches the click meant to close it.                    |
| [ContextMenu](../components/context-menu/README.md)                   | public          | barrel or subpath | –                   | Menu opened at the pointer through a ref, with submenus, a mobile sheet form and working keyboard navigation.             |
| [DropDown](../components/drop-down/README.md)                         | public          | barrel or subpath | `open`              | Menu anchored to a control, rendered in a portal and positioned against the element you point it at.                      |
| [DropDownItem](../components/drop-down-item/README.md)                | public          | barrel or subpath | –                   | One row of a dropdown menu: a label, an optional icon and badges, or a separator.                                         |
| [ModalDialog](../components/modal-dialog/README.md)                   | public          | barrel or subpath | `visible`           | Dialog rendered in a portal, as a centred modal or a side panel, assembled from Header, Body, Footer and Container slots. |
| [RoomLogoCoverDialog](../components/room-logo-cover-dialog/README.md) | portal-internal | barrel or subpath | `visible`           | Dialog for a room's generated logo: a colour from the palette and an optional glyph, over a live preview.                 |
| [Selector](../components/selector/README.md)                          | public          | barrel or subpath | –                   | Panel for picking one or many things out of a list too long to render at once.                                            |
| [Tooltip](../components/tooltip/README.md)                            | public          | barrel or subpath | `isOpen`            | Floating hint attached to one or more anchors, rendered in a portal and positioned to stay in the viewport.               |

### Data display

| Component                                                     | Status          | Import            | Shown and hidden by | What it is for                                                                                                  |
| ------------------------------------------------------------- | --------------- | ----------------- | ------------------- | --------------------------------------------------------------------------------------------------------------- |
| [Avatar](../components/avatar/README.md)                      | public          | barrel or subpath | –                   | Round picture of a person or a group, falling back to initials, with an optional role badge and an edit menu.   |
| [Badge](../components/badge/README.md)                        | public          | barrel or subpath | –                   | Small coloured pill for a count or a short marker, announced as a live status region.                           |
| [BaseTile](../components/tiles/base-tile/README.md)           | public          | barrel or subpath | –                   | The tile shell: an icon that turns into a checkbox, a slot for the content, a three-dot menu and a lower half.  |
| [Card](../components/card/README.md)                          | public          | barrel or subpath | –                   | Grey panel with an optional header row, for a block of related information.                                     |
| [CategoryItem](../components/category-item/README.md)         | public          | barrel or subpath | –                   | Settings-page entry: a linked title, a line of explanation, an arrow, and an optional paid badge.               |
| [CollapsibleCard](../components/collapsible-card/README.md)   | public          | barrel or subpath | `isOpen`            | Panel whose header is a button that expands and collapses the body under it.                                    |
| [FileTile](../components/tiles/file-tile/README.md)           | public          | barrel or subpath | –                   | Tile for a document: a thumbnail with badges over it, and a name row with a checkbox and a menu.                |
| [FolderTile](../components/tiles/folder-tile/README.md)       | public          | barrel or subpath | –                   | Tile for a folder, as a single name row or, with one flag, a tall card with a picture on top.                   |
| [Heading](../components/heading/README.md)                    | public          | barrel or subpath | –                   | Section title rendered as a real heading element, sized by a preset rather than by its level.                   |
| [MCPIcon](../components/mcp-icon/README.md)                   | public          | barrel or subpath | –                   | Square icon for an MCP server: its logo, or the first letter of its name on a grey tile.                        |
| [PortalLogo](../components/portal-logo/README.md)             | portal-internal | barrel or subpath | –                   | The portal's white-label logo, fetched from the DocSpace server and swapped for the theme.                      |
| [QuickActions](../components/quick-actions/README.md)         | public          | barrel or subpath | –                   | Horizontal strip of large icon tiles that scrolls when the tiles no longer fit.                                 |
| [RoomIcon](../components/room-icon/README.md)                 | public          | barrel or subpath | –                   | Square room tile that shows the room's logo, or its initials on a colour when there is none.                    |
| [RoomLogo](../components/room-logo/README.md)                 | public          | barrel or subpath | –                   | Fixed 32px glyph saying which kind of room this is, with an optional selection checkbox.                        |
| [RoomTile](../components/tiles/room-tile/README.md)           | public          | barrel or subpath | –                   | Tile for a room: the logo and name on top, and the room's tags along the bottom.                                |
| [RoomType](../components/room-type/README.md)                 | portal-internal | subpath only      | –                   | Row offering one kind of room, with its glyph, its translated name and its description.                         |
| [Row](../components/rows/row/README.md)                       | public          | barrel or subpath | –                   | One row of the file list: an optional checkbox, a start element, the content and a context menu.                |
| [RowContainer](../components/rows/row-container/README.md)    | public          | barrel or subpath | –                   | Scrolling list the rows go in, virtualised and paged in as the user reaches the end.                            |
| [RowContent](../components/rows/row-content/README.md)        | public          | barrel or subpath | –                   | The text of a row, laid out by the position of its children rather than by named slots.                         |
| [Rows](../components/rows/README.md)                          | public          | barrel or subpath | –                   | The file list of the DocSpace portal, in three parts: the container, the row and the row's content.             |
| [SelectedItem](../components/selected-item/README.md)         | public          | barrel or subpath | –                   | Chip with a cross, for a value the user has picked and can take back.                                           |
| [Table](../components/table/README.md)                        | public          | barrel or subpath | –                   | Columnar list with resizable, sortable and hideable columns, laid out by a CSS grid the header writes.          |
| [Tag](../components/tag/README.md)                            | public          | barrel or subpath | –                   | Small outlined label for one keyword, clickable and optionally removable.                                       |
| [Tags](../components/tags/README.md)                          | public          | barrel or subpath | –                   | One row of tags that keeps to its width, collapsing the rest into an overflow tag.                              |
| [TemplateTile](../components/tiles/template-tile/README.md)   | public          | barrel or subpath | –                   | Tile for a room template: the name on top, and an owner and storage pair along the bottom.                      |
| [Text](../components/text/README.md)                          | public          | barrel or subpath | –                   | Body text at the kit's size and weight, rendered through whichever element you name.                            |
| [TileContainer](../components/tiles/tile-container/README.md) | public          | barrel or subpath | –                   | Grid that sorts the tiles it is given into rooms, templates, folders and files and gives two of them a heading. |
| [TileContent](../components/tiles/tile-content/README.md)     | public          | barrel or subpath | –                   | The title slot of a tile: three nested wrappers that give the name its width and its truncation.                |
| [Tiles](../components/tiles/README.md)                        | public          | barrel or subpath | –                   | The card view of the DocSpace listing: a sorting container, four kinds of tile and the slot their names go in.  |

### Layout

| Component                                                              | Status          | Import            | Shown and hidden by | What it is for                                                                                                   |
| ---------------------------------------------------------------------- | --------------- | ----------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------- |
| [Article](../components/article/README.md)                             | portal-internal | subpath only      | –                   | DocSpace's left panel: a fixed column with a header slot, a main button, a scrolling body and the profile block. |
| [EmptyScreenContainer](../components/empty-screen-container/README.md) | public          | barrel or subpath | –                   | Centred empty state: an illustration, a heading, up to two lines of explanation and a column of actions.         |
| [EmptyView](../components/empty-view/README.md)                        | public          | barrel or subpath | –                   | Centred empty state with an icon, a title, a description and a list of things the user can do next.              |
| [ErrorContainer](../components/error-container/README.md)              | public          | barrel or subpath | –                   | Full-screen error page: an animated landscape, a heading, an explanation and one action button.                  |
| [Portal](../components/portal/README.md)                               | public          | barrel or subpath | `visible`           | Renders a node into another part of the document, after mount, keeping it inside the React tree.                 |
| [Scrollbar](../components/scrollbar/README.md)                         | public          | barrel or subpath | –                   | Scrolling region with the kit's own thin tracks, which fade out when nothing is happening.                       |
| [Section](../components/section/README.md)                             | portal-internal | subpath only      | –                   | DocSpace's page body: a sticky header and filter, a scrolling body, and the info and chat panels beside it.      |
| [SelectionArea](../components/selection-area/README.md)                | public          | barrel or subpath | –                   | Rubber-band selection: a dragged rectangle that reports which items it covers, frame by frame.                   |
| [ThemeProviderComponent](../components/theme-provider/README.md)       | public          | barrel or subpath | –                   | The older theme provider: it writes the theme onto the document and supplies the kit's theme context.            |

### Navigation

| Component                                                  | Status          | Import            | Shown and hidden by | What it is for                                                                                                       |
| ---------------------------------------------------------- | --------------- | ----------------- | ------------------- | -------------------------------------------------------------------------------------------------------------------- |
| [FilterInput](../components/filter/README.md)              | portal-internal | barrel or subpath | –                   | The bar above a file listing: search, a filter panel, a sort menu, a view switch and the chips for what is in force. |
| [Link](../components/link/README.md)                       | public          | barrel or subpath | –                   | Anchor styled to the kit's conventions, for navigation or for an in-place action.                                    |
| [Navigation](../components/navigation/README.md)           | portal-internal | subpath only      | –                   | The file manager's header: breadcrumb title, back arrow, and the row of buttons that acts on the current folder.     |
| [NavMenu](../components/nav-menu/README.md)                | public          | barrel or subpath | –                   | Sidebar navigation: groups of items, each with an optional sub-menu, a badge and a collapsed rail form.              |
| [Paging](../components/paging/README.md)                   | public          | barrel or subpath | –                   | Previous and next buttons with a page selector between them and a page-size selector at the end.                     |
| [TabItem](../components/tab-item/README.md)                | public          | barrel or subpath | –                   | Rounded pill that fills in when it is selected.                                                                      |
| [Tabs](../components/tabs/README.md)                       | public          | barrel or subpath | –                   | Sticky tab bar that scrolls sideways and renders the selected tab's content under itself.                            |
| [TwoStateToggle](../components/two-state-toggle/README.md) | portal-internal | barrel or subpath | –                   | Pill that switches the portal between its classic view and the new dashboard.                                        |

### Feedback

| Component                                                                      | Status          | Import            | Shown and hidden by | What it is for                                                                                                 |
| ------------------------------------------------------------------------------ | --------------- | ----------------- | ------------------- | -------------------------------------------------------------------------------------------------------------- |
| [AppLoader](../components/app-loader/README.md)                                | public          | subpath only      | –                   | The blank first screen: a fixed sheet over the whole viewport with the kit's rombs animation on it.            |
| [CircleSkeleton](../components/circle/README.md)                               | public          | barrel or subpath | –                   | Round loading placeholder with a sweeping highlight, for an avatar or an icon that has not arrived yet.        |
| [ColumnarInfoBar](../components/columnar-info-bar/README.md)                   | public          | barrel or subpath | –                   | Bar of label-and-value columns for context the reader does not have to act on.                                 |
| [InfiniteLoader](../components/infinite-loader/README.md)                      | public          | barrel or subpath | –                   | Virtualised list or grid that asks for the next page as the user scrolls towards the end.                      |
| [Loader](../components/loader/README.md)                                       | public          | barrel or subpath | –                   | Spinner in one of four animations, for work whose duration is unknown.                                         |
| [LoaderWrapper](../components/loader-wrapper/README.md)                        | public          | barrel or subpath | –                   | Dims whatever is inside it and stops the mouse reaching it while something is loading.                         |
| [LoadingButton](../components/loading-button/README.md)                        | public          | barrel or subpath | –                   | 16px progress ring with a cross in the middle, for cancelling what it is measuring.                            |
| [OperationsProgressButton](../components/operations-progress-button/README.md) | portal-internal | subpath only      | –                   | Corner badge that reports every background operation of the portal and lists them when there is more than one. |
| [ProgressBar](../components/progress-bar/README.md)                            | public          | barrel or subpath | –                   | A labelled bar for an operation whose progress you can measure, with a status or error line under it.          |
| [PublicRoomBar](../components/public-room-bar/README.md)                       | public          | subpath only      | –                   | Grey note above a screen's content: an icon, a bold line and a paragraph, with an optional close cross.        |
| [RectangleSkeleton](../components/rectangle/README.md)                         | public          | barrel or subpath | –                   | Rectangular loading placeholder with a sweeping highlight, sized to the content it stands in for.              |
| [SnackBar](../components/snackbar/README.md)                                   | public          | barrel or subpath | –                   | Full-width notification bar that sits at the top of a section until it is dismissed.                           |
| [StatusMessage](../components/status-message/README.md)                        | public          | barrel or subpath | –                   | A full-width bar with a danger glyph that fades one message out before fading the next one in.                 |
| [Toast](../components/toast/README.md)                                         | public          | barrel or subpath | –                   | Container the transient notifications are stacked in, driven by the imperative `toastr`.                       |
| [TopLoaderService](../components/top-loading-indicator/README.md)              | public          | barrel or subpath | –                   | The thin bar at the top of the page, driven by three static calls rather than by React.                        |

<!-- catalogue:end -->
