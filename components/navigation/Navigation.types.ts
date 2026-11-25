import { RefObject } from "react";
import { DeviceType } from "../../enums";
import { TGetContextMenuModel } from "../context-menu";
import type { HeaderType } from "../context-menu";

export type TOnBackToParenFolder = () => void;

export type TTitles = {
  infoPanel?: string;
  aiChat?: string;
  actions?: string;
  contextMenu?: string;
  warningText?: string;
  warningIcon?: string;
};

export type TContextButtonProps = {
  className: string;
  getData: TGetContextMenuModel;
  /** Whether the plus and folder buttons open their menus. With `false` a
   * click only calls `onPlusClick` or `onContextOptionsClick`.
   * @default true */
  withMenu?: boolean;
  /** Shifts the folder menu further to the side of its button. Nothing else
   * in the header changes. */
  isTrashFolder?: boolean;
  isMobile: boolean;
  isMobileOnly?: boolean;
  id: string;
  /** Name of the current folder, shown as the heading. It is also the hover
   * tooltip of the folder button, and is added to `tariffBar` as a prop. */
  title?: string;
  /** Supplied internally to close the drop box when a menu closes. A value
   * you pass is ignored. */
  onCloseDropBox?: () => void;
  /** Called when the folder button is clicked, before its menu opens. */
  onContextOptionsClick?: () => void;
  /** Runs the one-off guidance animation on the folder button and returns
   * its cleanup. It is called once, while `guidAnimationVisible` is set and the
   * menu is closed. */
  contextButtonAnimation?: (
    setAnimationClasses: (classes: string[]) => void,
  ) => () => void;
  /** Whether the guidance animation should play. Opening the menu ends it. */
  guidAnimationVisible?: boolean;
  /** Called with `false` when the guidance animation is reset or the button unmounts. */
  setGuidAnimationVisible?: (visible: boolean) => void;
  /** Keeps the menu from turning into a sheet. Supplied internally, from the viewport and the menu header. */
  ignoreChangeView?: boolean;
  /** Header of the folder's context menu, used where the menu opens as a mobile sheet. */
  contextMenuHeader?: HeaderType;
  /** Accessible name of the folder button. Without it the button is named "More options". */
  ariaLabel?: string;
};

export type TPlusButtonProps = {
  className: string;
  getData: TGetContextMenuModel;
  /** Whether the plus and folder buttons open their menus. With `false` a
   * click only calls `onPlusClick` or `onContextOptionsClick`.
   * @default true */
  withMenu?: boolean;
  /** Id of the plus button's icon. Supplied internally as `header_add-button`. */
  id?: string;
  /** Name of the current folder, shown as the heading. It is also the hover
   * tooltip of the folder button, and is added to `tariffBar` as a prop. */
  title?: string;
  /** Called on click instead of opening the menu, and only while `withMenu` is `false`. */
  onPlusClick?: VoidFunction;
  /** Whether the header is inside an embedding frame. It hides the folder
   * button, the extra button and the tariff notice, and keeps the plus button
   * below desktop. */
  isFrame?: boolean;
  /** Supplied internally to close the drop box when a menu closes. A value
   * you pass is ignored. */
  onCloseDropBox?: () => void;
  /** Ref attached to the plus button's wrapper. Supplied internally from `addButtonRef`. */
  forwardedRef?: React.RefObject<HTMLDivElement | null>;
};

export type TToggleInfoPanelButtonProps = {
  /** Whether the current folder is the root of its tree. It hides the back arrow, keeps the drop box shut and drops the title icon. */
  isRootFolder: boolean;
  /** Whether the info panel is open, which draws its toggle pressed. */
  isInfoPanelVisible: boolean;
  /** Called when the info panel toggle is clicked. */
  toggleInfoPanel: (e?: React.MouseEvent) => void;
  id?: string;
  /** Texts of the header buttons. `infoPanel` and `actions` name the info panel
   * toggle and the plus, and are their hover tooltips; `contextMenu` names the
   * folder button. `aiChat` labels the AI chat button, and `warningText` and
   * `warningIcon` fill the warning chip. */
  titles?: TTitles;
};

export type TAiChatButtonProps = {
  isChatPanelVisible: boolean;
  toggleChatPanel: (e?: React.MouseEvent) => void;
  id?: string;
  titles?: TTitles;
};

export type TArrowButtonProps = {
  /** Whether the current folder is the root of its tree. It hides the back arrow, keeps the drop box shut and drops the title icon. */
  isRootFolder: boolean;
  /** Shows the back arrow even in the root folder, where it is otherwise hidden. */
  showBackButton?: boolean;
  /** Called when the back arrow is clicked. In the open drop box it also closes the box. */
  onBackToParentFolder: TOnBackToParenFolder;
};

export type TBadgesProps = {
  titleIcon: string;
  isRootFolder: boolean;
  titleIconTooltip?: string;
};

export type TTextProps = {
  title: string;
  isOpen: boolean;
  /** Whether the current folder is the root of its tree. It hides the back arrow, keeps the drop box shut and drops the title icon. */
  isRootFolder: boolean;
  isRootFolderTitle: boolean;
  onClick: () => void;
  /** Makes the title a keyboard button. */
  isButton?: boolean;
  /** Whether the drop box the title opens is open; unset on a title that opens none. */
  isExpanded?: boolean;
  className?: string;
  /** Text of the small badge after the title. It follows the room title when
   * one is shown, and the folder name otherwise. */
  badgeLabel?: string;
  /** Replaces the folder name's hover tooltip, which is otherwise the name
   * itself. It is dropped while the room title is shown. */
  titleTooltip?: string;
};

export type TNavigationLogoProps = {
  logo?: string;
  burgerLogo: string;
  className: string;
  onClick?: () => void;
};

export type TOnNavigationItemClick = (
  id: string | number,
  isRootRoom: boolean,
  isRootTemplates?: boolean,
) => void;

export type TNavigationItemProps = {
  id: string | number;
  title: string;
  isRoot: boolean;
  isRootRoom: boolean;
  onClick: TOnNavigationItemClick;
  withLogo: boolean | string;
  currentDeviceType: DeviceType;
  style?: React.CSSProperties;
  isRootTemplates?: boolean;
};

export type TNavigationItem = {
  id: string | number;
  title: string;
  isRootRoom: boolean;
  isRootTemplates?: boolean;
};

export type TRowParam = {
  /** Shows the logo block at the start of the header. A string is the
   * desktop image's URL; `true` shows only `burgerLogo`. */
  withLogo: boolean | string;
  /** Which layout to render. It decides which buttons appear in place of a
   * media query, so a wrong value shows the wrong buttons. */
  currentDeviceType: DeviceType;
};

export type TRowData = [TNavigationItem[], TOnNavigationItemClick, TRowParam];

export type TControlButtonProps = Omit<TToggleInfoPanelButtonProps, "id"> &
  Omit<TPlusButtonProps, "getData" | "className"> &
  Omit<TContextButtonProps, "getData" | "className" | "id" | "ariaLabel"> & {
    /** Whether the person may create anything here. It is one of two conditions for the plus button; `isPlusButtonVisible` is the other, and both must hold. */
    canCreate: boolean;
    /** Returns the model of the folder menu. **It is called on every
     * render**, whether or not the button is shown, so keep it cheap. */
    getContextOptionsFolder: TGetContextMenuModel;
    /** Returns the model of the plus button's menu. It is called on every render of that button. */
    getContextOptionsPlus: TGetContextMenuModel;
    /** Closes the breadcrumb drop box after the info panel is toggled from inside it. Supplied internally; a value you pass is overwritten. */
    toggleDropBox?: () => void;
    /** Whether the host is the desktop application. It only caps the drop
     * box's title row at 32px; the layout follows `currentDeviceType`. */
    isDesktop: boolean;
    /** Replaces the folder button with one that appears only when at least
     * one of its options is enabled. */
    isPublicRoom?: boolean;
    /** Shows the folder name and the room title. Without it only the arrow
     * and the buttons remain. */
    showTitle?: boolean;
    /** Label of the extra button at the end of the row. Without it the button is not rendered, and it is also hidden inside a frame and in the root folder. */
    navigationButtonLabel?: string;
    /** Called when that extra button is clicked. */
    onNavigationButtonClick?: () => void;
    /** Portal element for the tariff notice. It is cloned with the folder's `title` added as a prop, so the element has to tolerate one. Hidden inside a frame. */
    tariffBar?: React.ReactElement;
    /** Rendered as-is at the end of the button row, after the tariff notice. */
    analyzeResponsesButton?: React.ReactNode;
    /** Host controls drawn right before the context button, such as an
     * agent's chat toolbar. They, that button and the navigation button stay
     * in this order right after the title at every width. */
    beforeContextButton?: React.ReactNode;
    /** Called when the AI chat button is clicked. Without it the button is not
     * rendered. */
    toggleChatPanel?: (e?: React.MouseEvent) => void;
    /** Whether the AI chat panel is open, which draws its button pressed. */
    isChatPanelVisible?: boolean;
    /** Hides the AI chat button even when `toggleChatPanel` is set. */
    hideChatButton?: boolean;

    /** Whether the viewport is narrower than a desktop. It is derived from `currentDeviceType`; your own value is overwritten. */
    isMobile?: boolean;
    /** Whether the viewport is a phone. It is derived from
     * `currentDeviceType`; a value you pass is ignored. */
    isMobileOnly?: boolean;
    /** Ref attached to the plus button's wrapper, for a guidance overlay to anchor to. */
    addButtonRef?: RefObject<HTMLDivElement | null>;
    /** Ref attached to the extra navigation button. */
    buttonRef?: React.RefObject<HTMLButtonElement>;
    /** **Required for the folder button to appear at all.** Without it the
     * folder menu is never rendered, whatever `getContextOptionsFolder`
     * returns. */
    isContextButtonVisible?: boolean;
    /** **Required for the plus button to appear at all.** Without it no plus
     * button is rendered, even with `canCreate`. */
    isPlusButtonVisible?: boolean;
  };

export type TDropBoxProps = TArrowButtonProps &
  Omit<
    TControlButtonProps,
    | "isEmptyPage"
    | "tariffBar"
    | "onNavigationButtonClick"
    | "navigationButtonLabel"
    | "showTitle"
    | "isMobile"
    | "analyzeResponsesButton"
    | "beforeContextButton"
  > &
  TRowParam & {
    /** Ref of the drop box element. Supplied internally, so a ref you pass never reaches the DOM. */
    ref?: React.RefObject<HTMLDivElement | null>;
    /** Height in pixels the drop box may use, read from the enclosing `Section`'s context. Without a `Section` above it this is 0 and the list falls back to its own content height. */
    sectionHeight: number;
    /** Width in pixels of the drop box, measured from the header when it opens. */
    dropBoxWidth: number;

    /** The breadcrumb trail, outermost folder first. The last entry is the current folder; an empty list makes the title unclickable. */
    navigationItems: TNavigationItem[];
    /** Called with a crumb's id when it is chosen from the drop box. Supplied internally; it wraps `onClickFolder` and closes the box. */
    onClickAvailable: TOnNavigationItemClick;
    /** Whether the info panel is open, which draws its toggle pressed. */
    isInfoPanelVisible: boolean;
    /** Whether the host is the desktop application, which only caps the drop
     * box's title row at 32px. */
    isDesktopClient: boolean;
    /** URL of the logo shown below the desktop breakpoint while `withLogo` is
     * set. It is an `<img src>`, not an icon name. */
    burgerLogo: string;
    /** The title block rendered inside the open drop box. Supplied internally. */
    navigationTitleContainerNode: React.ReactNode;
    /** Closes the drop box. Supplied internally. */
    onCloseDropBox: () => void;
    /** Shows the title block at the top of the open drop box. Only `false`
     * hides it and frees the height it reserves.
     * @default true */
    showTitleInDropBox?: boolean;
  };

export type TNavigationProps = React.AriaAttributes &
  Omit<
    TDropBoxProps,
    | "dropBoxWidth"
    | "sectionHeight"
    | "onCloseDropBox"
    | "onClickAvailable"
    | "isDesktopClient"
    | "isTabletView"
    | "navigationTitleContainerNode"
    | "ref"
  > &
  Omit<
    TControlButtonProps,
    | "isMobile"
    | "isMobileOnly"
    | "toggleDropBox"
    | "onCloseDropBox"
    | "ignoreChangeView"
    | "id"
    | "forwardedRef"
  > &
  Omit<
    TTextProps,
    | "isOpen"
    | "title"
    | "className"
    | "isRootFolderTitle"
    | "onClick"
    | "isButton"
    | "isExpanded"
  > & {
    /** The header row element. */
    ref?: React.Ref<HTMLDivElement>;
    /** Name of the current folder, shown as the heading. It is also the hover
     * tooltip of the folder button, and is added to `tariffBar` as a prop. */
    title: string;
    /** Drawn in place of the current folder's heading, such as a menu that
     * switches to a sibling. It gets no navigation click handler, so the
     * breadcrumb drop box does not open from it. */
    titleContent?: React.ReactNode;
    /** Called with a crumb's id when one is chosen from the drop box, and when
     * the room title is clicked. */
    onClickFolder: TOnNavigationItemClick;

    /** Hides the info panel toggle on a desktop. */
    hideInfoPanel?: boolean;
    /** URL of the logo shown below the desktop breakpoint while `withLogo` is
     * set. It is an `<img src>`, not an icon name. */
    burgerLogo: string;
    /** Shows the room's title before the folder's own, as a second clickable
     * title. It is ignored in the root folder, on a phone, and when there is
     * neither a `rootRoomTitle` nor more than one crumb. */
    showRootFolderTitle: boolean;
    /** URL of the small icon before the title. It is hidden in the root folder. */
    titleIcon: string;
    /** Text of the room title before the folder name. Without it the
     * second-to-last crumb's title is used. */
    rootRoomTitle: string;
    /** Widens the header's last column to at least 186px for the extra
     * button. The button itself appears with `navigationButtonLabel`. */
    showNavigationButton: boolean;
    /** Text of the tooltip on the title icon. Without it no tooltip element is rendered. */
    titleIconTooltip?: string;
    /** Called when the logo is clicked. Only reachable while `withLogo` is set. */
    onLogoClick?: () => void;
    /** Header of the folder's context menu, used where the menu opens as a mobile sheet. */
    contextMenuHeader?: HeaderType;
    /** Shows the back arrow even in the root folder, where it is otherwise hidden. */
    showBackButton?: boolean;
    /** Replaces the folder name's hover tooltip, which is otherwise the name
     * itself. It is dropped while the room title is shown. */
    titleTooltip?: string;
  };
