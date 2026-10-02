import type React from "react";
import type {
  EmployeeStatus,
  EmployeeType,
  RoomType,
  FileShare,
  FileType,
  FolderType,
  FileEntryDtoIntegerAllOfSecurity,
} from "@onlyoffice/docspace-api-sdk";

import type {
  ICover,
  MergeTypes,
  Nullable,
  WithFlag,
  TUserGroup,
} from "../../types";

import type { AvatarRole } from "../avatar";
import type { TTabItem } from "../tabs";

import type { SelectorAccessRightsMode } from "./Selector.enums";

// header
export type THeaderBackButton =
  | {
      /** Called by the back arrow. */
      onBackClick: () => void;
      /**
       * Whether to hide the back arrow. The arrow is drawn only when this is
       * literally `false`; leaving the prop out hides it, as does `true`.
       */
      withoutBackButton: false;
      /** Whether the line under the header is removed. */
      withoutBorder: boolean;
    }
  | {
      /** Called by the back arrow. */
      onBackClick?: undefined;
      /**
       * Whether to hide the back arrow. The arrow is drawn only when this is
       * literally `false`; leaving the prop out hides it, as does `true`.
       */
      withoutBackButton?: undefined;
      /** Whether the line under the header is removed. */
      withoutBorder?: undefined;
    };

export type TInfoBarData = {
  /** Bold first line of the bar. */
  title: string;
  /** Everything under the title. */
  description: React.ReactNode;
  /** Applied to the bar. */
  className?: string;
  /** Icon on the left: a URL for `<img>`, or an element rendered as it is. */
  icon?: string | React.ReactElement;
  /** Called by the bar's own cross. Without it no cross is drawn. */
  onClose?: VoidFunction;
};

export type TInfoBar = {
  /** Whether a dismissable bar is shown above the list. */
  withInfoBar?: boolean;
  /** What that bar says. Nothing is drawn without it. */
  infoBarData?: TInfoBarData;
};

export type InfoBarProps = {
  ref?: React.RefObject<HTMLDivElement | null>;
  visible: boolean;
  className?: string;
};

export type BreadCrumbsProps = {
  visible?: boolean;
};

export type HeaderProps = {
  /** Title of the panel. */
  headerLabel: string;
  /** Called by the closing cross. */
  onCloseClick: () => void;
  /**
   * Whether the closing cross is drawn.
   * @default true
   */
  isCloseable?: boolean;
} & THeaderBackButton;

export type TSelectorHeader = WithFlag<
  "withHeader",
  {
    /**
     * Whether the panel has a header bar. It only accepts `true` — leave it out
     * for a selector with no header of its own.
     */
    withHeader: true;
    /** The header's own props. Required once `withHeader` is set. */
    headerProps: HeaderProps;
  }
>;

// bread crumbs
type TOnBreadCrumbClick = ({
  e,
  open,
  item,
}: {
  e: React.MouseEvent;
  open: boolean;
  item: TBreadCrumb;
}) => void;

export type TBreadCrumb = {
  /** Identifies the crumb; it is what `onSelectBreadCrumb` is handed back. */
  id: string | number;
  /** Text of the crumb. */
  label: string;
  /** Whether the crumb stands for a room, which draws the room's logo. */
  isRoom?: boolean;
  /** Whether the crumb stands for an agent, which draws the agent's icon. */
  isAgent?: boolean;
  /** Smallest width this crumb may shrink to, as a CSS length. */
  minWidth?: string;
  /** Which room icon to draw, when `isRoom` is set. */
  roomType?: RoomType;
  /** Whether the room is shared, which adds the badge on its logo. */
  shared?: boolean;
  /** Called instead of the default navigation when this crumb is clicked. */
  onClick?: TOnBreadCrumbClick;
  /** Root section the crumb belongs to, which picks its icon. */
  rootFolderType?: FolderType;
};

export type TDisplayedItem = {
  id: string | number;
  label: string;
  isArrow: boolean;
  isList: boolean;
  isRoom?: boolean;
  isAgent?: boolean;
  roomType?: RoomType;
  shared?: boolean;
  rootFolderType?: FolderType;
  listItems?: TBreadCrumb[];
};

export type TSelectorBreadCrumbs = WithFlag<
  "withBreadCrumbs",
  {
    /**
     * Whether the folder trail is shown above the list. It only accepts `true`.
     */
    withBreadCrumbs: true;
    /** Whether to replace the trail with `breadCrumbsLoader`. */
    isBreadCrumbsLoading: boolean;
    /** The trail, outermost first. The last entry is the current folder. */
    breadCrumbs: TBreadCrumb[];
    /** Shown in place of the trail while it loads; `BreadCrumbsLoader` fits. */
    breadCrumbsLoader: React.ReactNode;
    /**
     * Called with the crumb that was clicked. Navigating is your job: fetch that
     * folder and hand back new `items` and `breadCrumbs`.
     */
    onSelectBreadCrumb: (item: TBreadCrumb) => void;
    /**
     * Ignored. Selector overwrites it with its own `isLoading` before the trail
     * ever sees it; the type demands the field all the same.
     */
    bodyIsLoading: boolean;
  }
>;

// tabs
export type TSelectorTabs = WithFlag<
  "withTabs",
  {
    /** Whether a tab strip is shown above the list. It only accepts `true`. */
    withTabs: true;
    /** The tabs, in order. */
    tabsData: TTabItem[];
    /**
     * Id of the open tab. Selector keeps one selection per tab id and adds them
     * all up, so switching tabs does not drop what was ticked on the other.
     */
    activeTabId: string;
  }
>;

// select all
export type SelectAllProps = {
  show: boolean;
  isLoading: boolean;
  rowLoader: React.ReactNode;
};

export type TSelectorSelectAll = WithFlag<
  "withSelectAll",
  {
    /**
     * Whether the "select all" row sits above the list. It only accepts `true`,
     * and the row appears only with `isMultiSelect` and only while no search is
     * running.
     */
    withSelectAll: true;
    /** Text of that row. */
    selectAllLabel: string;
    /** URL of the icon beside it. */
    selectAllIcon: string;
    /**
     * Called when the row is clicked. Selector ticks and unticks the loaded
     * items itself; this is a notification, not the implementation.
     */
    onSelectAll: () => void;
  }
>;
// search
export type SearchProps = {
  isSearch: boolean;
};

export type TSelectorSearch = WithFlag<
  "withSearch",
  {
    /**
     * Whether the list can be searched. It only accepts `true`. The box hides
     * itself while the list is empty and no search is running, so an empty
     * folder shows the empty screen rather than a search over nothing.
     */
    withSearch: true;
    /** Shown in place of the box while `isSearchLoading` is set. */
    searchLoader: React.ReactNode;
    /** Whether to replace the box with `searchLoader`. */
    isSearchLoading: boolean;
    /** Placeholder of the box. */
    searchPlaceholder?: string;
    /** Text in the box. Searching is yours to do; this is what is displayed. */
    searchValue?: string;
    /**
     * Called with the trimmed query once typing stops. Call the callback to put
     * the selector into its searching state, which is what swaps the empty
     * screen for the search one. An empty query calls `onClearSearch` instead.
     */
    onSearch: (value: string, callback?: VoidFunction) => void;
    /**
     * Called by the box's cross and by the empty screen's "clear filter" link.
     * Call the callback to take the selector out of its searching state.
     */
    onClearSearch: (callback?: VoidFunction) => void;
  }
>;

// empty screen form room
export type EmptyScreenFormRoomProps = {
  onCreateClickAction: VoidFunction;
  createDefineRoomType: RoomType;
};

// empty screen
export type EmptyScreenProps = {
  withSearch: boolean;

  items: TSelectorItem[];
  inputItemVisible: boolean;

  hideBackButton?: boolean;
};

export type TSelectorEmptyScreen = {
  /**
   * Picture for the empty folder. A string is used as an `<img>` source, an
   * element is rendered as it is.
   */
  emptyScreenImage: string | React.ReactElement;
  /** Heading for the empty folder. */
  emptyScreenHeader: string;
  /** Paragraph under that heading. */
  emptyScreenDescription: string;

  /** The same picture, for a search that found nothing. */
  searchEmptyScreenImage: string | React.ReactElement;
  /** Heading for a search that found nothing. */
  searchEmptyScreenHeader: string;
  /** Paragraph under that heading. */
  searchEmptyScreenDescription: string;
};

// Pagination

type TSelectorPagination = {
  /** The page of items loaded so far, in the order they are shown. */
  items: TSelectorItem[];
  /**
   * Skeleton for a row that has not arrived yet, and for the whole body during
   * the initial load. `RowLoader` from this folder fits.
   */
  rowLoader: React.ReactNode;
  /** Whether another page can be fetched. */
  hasNextPage: boolean;
  /** Whether a page request is in flight, which suppresses another one. */
  isNextPageLoading: boolean;
  /** How many items exist in total, which is what the scrollbar is sized from. */
  totalItems: number;
  /** Initial load: the body is replaced with a skeleton loader */
  isLoading: boolean;
  /** Content refresh: the current body stays on screen dimmed; wins over isLoading */
  isContentLoading?: boolean;
};

// NewItem
export type NewItemProps = {
  label: string;
  style: React.CSSProperties;
  dropDownItems?: React.ReactElement[];
  onCreateClick?: VoidFunction;
  hotkey?: string;
  inputItemVisible?: boolean;
  listHeight: number;
};

// NewItemDropDown
export type NewItemDropDownProps = {
  dropDownItems: React.ReactElement[];
  isEmpty?: boolean;
  onCloseDropDown: (e?: MouseEvent) => void;
  listHeight?: number;
};

// InputItem
type TBaseInputProps = {
  style: React.CSSProperties;
  placeholder?: string;
  color?: string;
  icon?: string | React.ReactElement;
};

export type InputItemProps = TBaseInputProps & {
  defaultInputValue: string;
  onAcceptInput: (value: string) => void;
  onCancelInput: VoidFunction;
  roomType?: RoomType;
  cover?: ICover;
  setInputItemVisible: (value: boolean) => void;
  setSavedInputValue: (value: Nullable<string>) => void;
};

// submit button
export type TOnSubmit = (
  selectedItems: TSelectorItem[],
  access: TAccessRight | null,
  fileName: string,
  isFooterCheckboxChecked: boolean,
) => void | Promise<void>;

export type TSelectorSubmitButton = {
  /**
   * Text of the primary button. In multi-select the count is appended in
   * brackets, so pass "Add", not "Add (3)".
   */
  submitButtonLabel: string;
  /**
   * Whether the primary button is dead. With `withFooterInput` an empty input
   * disables it too, whatever this says.
   */
  disableSubmitButton: boolean;
  /**
   * Called with everything the footer holds. Return a promise and the button
   * shows its spinner until it settles. Enter fires it as well.
   */
  onSubmit: TOnSubmit;
  /** `id` attribute of the primary button. */
  submitButtonId?: string;
};

type TSelectorFooterSubmitButton = Omit<TSelectorSubmitButton, "onSubmit"> & {
  onSubmit: (item?: TSelectorItem | React.MouseEvent) => Promise<void>;
};

// cancel button

export type TSelectorCancelButton = WithFlag<
  "withCancelButton",
  {
    /**
     * Whether a second, non-primary button sits in the footer. It only accepts
     * `true`.
     */
    withCancelButton: true;
    /** Text of that button. */
    cancelButtonLabel: string;
    /**
     * Called by that button — and by Escape, which Selector listens for on the
     * window whether or not the button is there.
     */
    onCancel: () => void;
    /** `id` attribute of that button. */
    cancelButtonId?: string;
  }
>;

// access rights

export type TAccessRight = {
  /** Identifies the entry within the drop-down. */
  key: string;
  /** Text of the entry. */
  label: string;
  /** Second line under the label, in the detailed mode. */
  description?: string;
  /** The value handed back to you; the component never reads it. */
  access: string | number;
  /** Whether this entry is a divider rather than a choice. */
  isSeparator?: boolean;
};

type TWithAccessRightsProps = {
  /**
   * Whether the footer carries an access drop-down. It only accepts `true`.
   */
  withAccessRights: true;
  /** The choices in that drop-down. */
  accessRights: TAccessRight[];
  /**
   * The chosen access. Selector copies it into its own state on mount and
   * whenever this changes, and hands that copy to `onSubmit`.
   */
  selectedAccessRight: TAccessRight | null;
  /** Called when the choice changes. */
  onAccessRightsChange: (access: TAccessRight) => void;
  /** Whether each entry shows its `description`. */
  accessRightsMode?: SelectorAccessRightsMode;
};

type TAsideCommonProps = {
  /** Whether the backdrop behind the aside is transparent. */
  withoutBackground?: boolean;
  /** Ignored. Nothing reads this prop. */
  withBlur?: boolean;
};

export type TSelectorWithAside =
  | ({
      /**
       * Whether Selector wraps itself in a backdrop and an `Aside`. It is the
       * only way the component becomes a panel; on its own it is a plain box
       * that fills its parent.
       */
      useAside: true;
      /** Called by the backdrop and by the aside. Required once `useAside` is set. */
      onClose: VoidFunction;
    } & TAsideCommonProps)
  | ({
      /**
       * Whether Selector wraps itself in a backdrop and an `Aside`. It is the
       * only way the component becomes a panel; on its own it is a plain box
       * that fills its parent.
       */
      useAside?: false;
      /** Called by the backdrop and by the aside. Required once `useAside` is set. */
      onClose?: VoidFunction;
    } & TAsideCommonProps);

export type TSelectorAccessRights = WithFlag<
  "withAccessRights",
  TWithAccessRightsProps
>;

export type AccessSelectorProps = Omit<
  TWithAccessRightsProps,
  "withAccessRights"
> & {
  footerRef: React.RefObject<HTMLDivElement | null>;
};

// footer input

export type TSelectorInput = WithFlag<
  "withFooterInput",
  {
    /**
     * Whether the footer carries a text field — the "save as" name. It only
     * accepts `true`, and it makes the footer 145px instead of 73px.
     */
    withFooterInput: true;
    /** Label above that field. */
    footerInputHeader: string;
    /**
     * Initial text of the field. Selector owns the value from then on and hands
     * the edited one to `onSubmit`; changing this prop later does nothing.
     */
    currentFooterInputValue: string;
  }
>;

export type TSelectorFooterInput = TSelectorInput & {
  setNewFooterInputValue: React.Dispatch<React.SetStateAction<string>>;
  withErrorFooter?: boolean;
};

// footer checkbox

export type TSelectorCheckbox = WithFlag<
  "withFooterCheckbox",
  {
    /**
     * Whether the footer carries a checkbox. It only accepts `true`, and it
     * makes the footer 110px, or 181px alongside `withFooterInput`.
     */
    withFooterCheckbox: true;
    /** Label beside that checkbox. */
    footerCheckboxLabel: string;
    /**
     * Initial state of the checkbox. Selector owns it from then on and hands the
     * current value to `onSubmit`; changing this prop later does nothing.
     */
    isChecked: boolean;
  }
>;

export type TSelectorFooterCheckbox = TSelectorCheckbox & {
  setIsFooterCheckboxChecked: React.Dispatch<React.SetStateAction<boolean>>;
};

export type TSelectorInfo = WithFlag<
  "withInfo",
  {
    /**
     * Whether a tinted note sits between the search box and the list. It only
     * accepts `true`, and the note is hidden during the initial load.
     */
    withInfo: true;
    /** Text of that note. */
    infoText: string;
    /** Whether an icon is drawn beside the text. */
    withInfoBadge?: boolean;
  }
>;

export type TRenderCustomItem = (
  label: string,
  role?: string,
  email?: string,
  isGroup?: boolean,
  status?: EmployeeStatus,
  id?: string | number,
) => React.ReactNode | null;

export type SelectorProps = TSelectorHeader &
  TInfoBar &
  TSelectorInfo &
  TSelectorTabs &
  TSelectorSelectAll &
  TSelectorEmptyScreen &
  TSelectorSearch &
  TSelectorBreadCrumbs &
  TSelectorSubmitButton &
  TSelectorCancelButton &
  TSelectorAccessRights &
  TSelectorInput &
  TSelectorCheckbox &
  TSelectorWithAside &
  TSelectorPagination & {
    /** Applied to the outermost element. */
    id?: string;
    /** Applied to the outermost element. */
    className?: string;
    /** Applied to the outermost element. */
    style?: React.CSSProperties;

    /**
     * Called when a row is clicked, before Selector updates its own selection.
     * The third argument submits with that one item, which is how a double click
     * confirms a choice.
     */
    onSelect?: (
      item: TSelectorItem,
      isDoubleClick: boolean,
      doubleClickCallback: () => Promise<void>,
    ) => void;

    /** Whether rows carry checkboxes and more than one can be ticked. */
    isMultiSelect: boolean;
    /** Whether an item's own `disableMultiSelect` is overruled. */
    forceIsMultiSelect?: boolean;
    /**
     * Items to start out ticked, matched by `id`. Selector copies them into its
     * own state; it is a starting point, not a controlled value.
     */
    selectedItems?: TSelectorItem[];
    /**
     * Largest number of items that may be ticked at once. Beyond it the
     * unticked rows go grey and stop responding, with no message of their own.
     */
    maxSelectedItems?: number;

    /** Whether to skip the `loadNextPage(0)` call Selector makes on mount. */
    disableFirstFetch?: boolean;
    /**
     * Called with the index to start from when the list nears its end, and once
     * with 0 on mount unless `disableFirstFetch` is set. Append to `items`.
     */
    loadNextPage: (startIndex: number) => Promise<void>;

    /** Replaces the text of a row, keeping its avatar, checkbox and layout. */
    renderCustomItem?: TRenderCustomItem;

    /** Whether the footer stays put instead of appearing with the first tick. */
    alwaysShowFooter?: boolean;
    /** A line of bold text above the list. It costs the list 32px of height. */
    descriptionText?: string;

    /** Whether the body keeps its 16px of padding at the top. */
    withPadding?: boolean;
    /**
     * Rendered between the breadcrumbs and the search box. Selector clones it to
     * attach a ref and subtracts its measured height from the list.
     */
    injectedElement?: React.ReactElement;

    /**
     * Whether to render every item as plain markup instead of virtualising. The
     * list needs a measured height, which server rendering cannot give it.
     */
    isSSR?: boolean;
    /** The one ticked item outside multi-select, matched by `id`. */
    selectedItem?: TSelectorItem | null; // no multiSelect only
    /**
     * `data-testid` of the outermost element.
     * @default "selector"
     */
    dataTestId?: string;

    /** Whether the empty screen's "back" link is hidden. */
    hideBackButton?: boolean;
    /**
     * Matched against the footer input on every keystroke. A match marks the
     * field as in error and shows the kit's "contains special characters" line —
     * so it describes what is *forbidden*, not what is allowed.
     */
    folderFormValidation?: RegExp;

    /** Whether a file's extension is drawn after its name, in a dimmer colour. */
    displayFileExtension?: boolean;
  };

export type BodyProps = TSelectorInfo &
  TSelectorPagination & {
    footerVisible: boolean;
    withHeader?: boolean;
    withPadding?: boolean;

    value?: string;

    isMultiSelect: boolean;
    forceIsMultiSelect?: boolean;

    inputItemVisible: boolean;
    setInputItemVisible: (value: boolean) => void;

    renderCustomItem?: TRenderCustomItem;
    onSelect: (item: TSelectorItem, isDoubleClick: boolean) => void;

    loadMoreItems: (startIndex: number) => void;

    withFooterInput?: boolean;
    withFooterCheckbox?: boolean;
    withErrorFooter?: boolean;
    descriptionText?: string;
    withInfoBadge?: boolean;
    injectedElement?: React.ReactElement;

    isSSR?: boolean;
    hideBackButton?: boolean;
    isLimitReached?: boolean;

    displayFileExtension?: boolean;
  };

export type FooterProps = TSelectorFooterSubmitButton &
  TSelectorCancelButton &
  TSelectorAccessRights &
  TSelectorFooterInput &
  TSelectorFooterCheckbox & {
    isMultiSelect: boolean;
    selectedItemsCount: number;
    requestRunning?: boolean;
    withErrorFooter?: boolean;
  };

type TSelectorItemEmpty = {
  avatar?: undefined;
  color?: undefined;
  hasAvatar?: undefined;
  icon?: undefined;
  iconOriginal?: undefined;
  role?: undefined;
  email?: undefined;
  groups?: undefined;
  isOwner?: undefined;
  isAdmin?: undefined;
  isVisitor?: undefined;
  isCollaborator?: undefined;
  isRoomAdmin?: undefined;
  status?: undefined;
  access?: undefined;
  fileExst?: undefined;
  fileType?: undefined;
  shared?: undefined;
  parentId?: undefined;
  rootFolderType?: undefined;
  security?: undefined;
  isFolder?: undefined;
  filesCount?: undefined;
  foldersCount?: undefined;
  roomType?: undefined;
  private?: undefined;
  isGroup?: undefined;
  name?: undefined;
  isCreateNewItem?: undefined;
  onCreateClick?: undefined;
  hotkey?: undefined;
  onBackClick?: undefined;
  dropDownItems?: undefined;
  isInputItem?: undefined;
  defaultInputValue?: undefined;
  onAcceptInput?: undefined;
  onCancelInput?: undefined;
  placeholder?: undefined;
  cover?: undefined;
  userType?: undefined;
  isMCP?: undefined;

  isRoomsOnly?: undefined;
  createDefineRoomType?: undefined;
  isSystem?: undefined;
};

export type SpecialFolderScope = {
  kind: "recent" | "favorites";
  folderId: number | string;
  section: "files" | "rooms" | "forms" | "agents";
  /**
   * Folder types the Recent/Favorites aggregate is scoped to, so each section
   * only shows its own content. The server binds this to a `List<FolderType>`
   * and keeps an entry when any ancestor of its parent has one of these types,
   * so a section made of several room types passes them all.
   */
  folderType?: number | number[];
};

export type TSelectorItemUser = MergeTypes<
  TSelectorItemEmpty,
  {
    /** Shown under the name, and handed to `renderCustomItem`. */
    email: string;
    /** Whether the user owns the portal. */
    isOwner: boolean;
    /** Whether the user is a full admin. */
    isAdmin: boolean;
    /** Whether the user is a guest. */
    isVisitor: boolean;
    /** Whether the user is a power user. */
    isCollaborator: boolean;
    /** Whether the user administers a room. */
    isRoomAdmin: boolean;
    /** URL of the avatar picture. An empty string draws the default one. */
    avatar: string;
    /** URL of the small avatar, where one is rendered at that size. */
    avatarSmall?: string;
    /** Login name, where the row shows one. */
    userName?: string;
    /** Whether the user has a picture at all, which picks the fallback. */
    hasAvatar: boolean;
    /** Badge drawn on the avatar. */
    role: AvatarRole;
    /** Which type label is drawn — translated through the app's i18n instance. */
    userType: EmployeeType;
    /** Groups the user belongs to. */
    groups?: TUserGroup[];
    /** Whether the account is active, pending or disabled. */
    status: EmployeeStatus;
    /** The user's current access, where the row shows one. */
    access?: FileShare | string | number;
  }
>;

export type TSvgComponent = React.FC<React.SVGProps<SVGSVGElement>>;

export type TSelectorItemFile = MergeTypes<
  TSelectorItemEmpty,
  {
    /** Extension including the dot; shown after the name with `displayFileExtension`. */
    fileExst: string;
    /** Which kind of document it is, which picks the icon. */
    fileType: FileType;
    /** Whether the file is a form. */
    isForm?: boolean;
    /** Backing table of an external data source, for form rows. */
    externalDbTableName?: string | null;
    /** Folder the file sits in. */
    parentId: string | number;
    /** Root section it belongs to. */
    rootFolderType: string | number;
    /** What the current user may do with it. */
    security: FileEntryDtoIntegerAllOfSecurity;
    /** The icon: a URL, or an SVG component the row renders itself. */
    icon: TSvgComponent | string;
  }
>;

export type TSelectorItemFolder = MergeTypes<
  TSelectorItemEmpty,
  {
    /** Marks the row as a folder, which lets a click open it. */
    isFolder: boolean;
    /** Folder this one sits in. */
    parentId: string | number;
    /** Root section it belongs to. */
    rootFolderType: string | number;
    /** How many files it holds. */
    filesCount: number;
    /** How many sub-folders it holds. */
    foldersCount: number;
    /** What the current user may do with it. */
    security: FileEntryDtoIntegerAllOfSecurity;
    /** The icon: a URL, or an SVG component the row renders itself. */
    icon?: TSvgComponent | string;
    /** Picture drawn instead of the folder icon. */
    avatar?: string | React.ReactElement;
  }
>;

export type TSelectorItemRoom = MergeTypes<
  TSelectorItemEmpty,
  {
    /** Marks the row as openable, as a folder is. */
    isFolder: boolean;
    /** Which room it is, which picks the default logo. */
    roomType: RoomType;
    /** Whether the room is shared, which adds the badge on its logo. */
    shared: boolean;
    /** Folder the room sits in. */
    parentId: string | number;
    /** Root section it belongs to. */
    rootFolderType: string | number;
    /** How many files it holds. */
    filesCount: number;
    /** How many sub-folders it holds. */
    foldersCount: number;
    /** What the current user may do with it. */
    security: FileEntryDtoIntegerAllOfSecurity;
    /** URL of the room's own logo. */
    icon?: string;
    /** Colour of the generated logo, when there is no picture. */
    color?: string;
    /** URL of the logo before cropping. */
    iconOriginal?: string;
    /** The room's cover art, which replaces the generated logo. */
    cover?: ICover;
    /** The room's tags. */
    tags?: string[];
    /** The room's title, where it differs from `label`. */
    title?: string;
    /** Whether the room is private, which adds the shield badge. */
    private?: boolean;
  }
>;

export type TSelectorItemGroup = MergeTypes<
  TSelectorItemEmpty,
  {
    /** Marks the row as a group, which draws the group avatar. */
    isGroup: boolean;
    /**
     * Whether this is a built-in group such as Everyone. System rows are sorted
     * to the top and a divider is inserted under the first of them.
     */
    isSystem?: boolean;
    /** Name of the group. */
    name: string;
  }
>;

export type TSelectorItemMCP = MergeTypes<
  TSelectorItemEmpty,
  {
    /** Marks the row as an MCP server, which draws the server tile. */
    isMCP: boolean;
    /**
     * A URL for remotely hosted icons, or a rendered element for the ones
     * bundled as SVG components (see utils/ai/getServerIcon).
     */
    icon?: string | React.ReactElement;
  }
>;

export type TSelectorItemNew = MergeTypes<
  TSelectorItemEmpty,
  {
    /**
     * Marks the row as the "create new" entry. It must be first in `items`, and
     * it is what the empty screen turns into its create link.
     */
    isCreateNewItem: boolean;
    /** Shortcut printed on the right of the row. */
    hotkey?: string;
    /** Entries of a menu opened instead of calling `onCreateClick`. */
    dropDownItems?: React.ReactElement[];
    /** Called when the row is clicked, unless `dropDownItems` is set. */
    onCreateClick?: VoidFunction;
    /** Called by the empty screen's "back" link. */
    onBackClick: VoidFunction;

    /** Whether only rooms may be created here, which picks the form-room empty screen. */
    isRoomsOnly?: boolean;
    /** Which room the create link makes, for that empty screen. */
    createDefineRoomType?: RoomType;
  }
>;

export type TSelectorItemInput = MergeTypes<
  TSelectorItemEmpty,
  {
    /**
     * Marks the row as the inline name field. It must be second in `items`,
     * right after the "create new" row, and it takes over the whole body while
     * it is there.
     */
    isInputItem: boolean;
    /** Text the field starts with. */
    defaultInputValue: string;
    /** Icon beside the field: a URL, or an element rendered as it is. */
    icon?: string | React.ReactElement;
    /** Colour of the generated logo beside the field. */
    color?: string;
    /** Which room logo to draw beside the field. */
    roomType?: RoomType;
    /** Cover art drawn beside the field. */
    cover?: ICover;
    /** Placeholder of the field. */
    placeholder?: string;

    /** Called with the typed name when the tick is clicked or Enter pressed. */
    onAcceptInput: (value: string) => void;
    /** Called when the cross is clicked or Escape pressed. */
    onCancelInput: VoidFunction;
  }
>;

type TSelectorItemType =
  | TSelectorItemUser
  | TSelectorItemFile
  | TSelectorItemFolder
  | TSelectorItemRoom
  | TSelectorItemGroup
  | TSelectorItemNew
  | TSelectorItemInput
  | TSelectorItemMCP;

export type TSelectorItem = TSelectorItemType & {
  /** Text of the row. The only field every kind of item must carry. */
  label: string;

  /** React key of the row. */
  key?: string;
  /**
   * Identifies the item. Selection is matched on it throughout, so two rows
   * sharing an id tick and untick together.
   */
  id?: string | number;
  /** Full name, where it differs from `label`. */
  displayName?: string;
  /**
   * Whether the row starts out ticked. Selector recomputes it from
   * `selectedItems` and its own state, so setting it here is a starting point.
   */
  isSelected?: boolean;
  /** Whether the row is greyed out and ignores clicks. */
  isDisabled?: boolean;
  /** Text shown at the end of a disabled row, saying why. */
  disabledText?: string;
  /** Tooltip about the file's lifetime. */
  lifetimeTooltip?: string | null;
  /** Link the row's title opens. */
  viewUrl?: string;
  /** Whether the room is a template, which changes its logo. */
  isTemplate?: boolean;
  /** The current user's access to that template. */
  templateAccess?: FileShare;
  /** Whether the current user owns that template. */
  templateIsOwner?: boolean;
  /** Whether this row stays single-select while the rest are not. */
  disableMultiSelect?: boolean;
  /** Renders the row as a thin divider, 16px tall, that cannot be clicked. */
  isSeparator?: boolean;
  /** Makes that divider a section break, 25px tall. */
  isSectionSeparator?: boolean;
  /** Overrules this row's own `disableMultiSelect`. */
  forceIsMultiSelect?: boolean;
  /** Marks the row as a virtual folder such as Recent or Favorites. */
  specialFolderScope?: SpecialFolderScope;
};

export type Data = {
  items: TSelectorItem[];
  onSelect?: (item: TSelectorItem, isDoubleClick: boolean) => void;
  isMultiSelect: boolean;
  isItemLoaded: (index: number) => boolean;
  rowLoader: React.ReactNode;
  renderCustomItem?: TRenderCustomItem;
  setInputItemVisible: (value: boolean) => void;
  inputItemVisible: boolean;
  savedInputValue: Nullable<string>;
  setSavedInputValue: (value: Nullable<string>) => void;
  listHeight: number;
  isLimitReached?: boolean;
  displayFileExtension?: boolean;
  forceIsMultiSelect?: boolean;
};

export interface ItemProps {
  index: number;
  style: React.CSSProperties;
  data: Data;
}

export type ProvidersProps = {
  emptyScreenProps: TSelectorEmptyScreen;
  breadCrumbsProps: TSelectorBreadCrumbs;
  infoBarProps: TInfoBar;
  searchProps: TSelectorSearch;
  selectAllProps: TSelectorSelectAll & {
    isAllChecked: boolean;
    isAllIndeterminate: boolean;
  };
  tabsProps: TSelectorTabs;
};
