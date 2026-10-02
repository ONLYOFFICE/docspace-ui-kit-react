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
  /** Whether the button opens the menu itself. With `false` it only calls the click handler and the menu is yours to open. */
  withMenu?: boolean;
  /** Passed to the context menu, which uses it to decide whether the trash warning belongs in the header. */
  isTrashFolder?: boolean;
  isMobile: boolean;
  isMobileOnly?: boolean;
  id: string;
  /** Title of the context menu's mobile header, and the native tooltip of the plus button. The component passes the folder's `title` here. */
  title?: string;
  /** Called when the context menu closes. Supplied internally to close the breadcrumb drop box with it. */
  onCloseDropBox?: () => void;
  /** Called when the context button is clicked, before the menu opens. */
  onContextOptionsClick?: () => void;
  /** Runs the one-off guidance animation on the context button and returns its cleanup. It is called once, while `guidAnimationVisible` is set and the menu is closed. */
  contextButtonAnimation?: (
    setAnimationClasses: (classes: string[]) => void,
  ) => () => void;
  /** Whether the guidance animation should play. Opening the menu ends it. */
  guidAnimationVisible?: boolean;
  /** Called with `false` when the guidance animation is reset or the button unmounts. */
  setGuidAnimationVisible?: (visible: boolean) => void;
  /** Not read at this level. The component computes its own value from the viewport and the menu header. */
  ignoreChangeView?: boolean;
  /** Header of the folder's context menu, used where the menu opens as a mobile sheet. */
  contextMenuHeader?: HeaderType;
};

export type TPlusButtonProps = {
  className: string;
  getData: TGetContextMenuModel;
  /** Whether the button opens the menu itself. With `false` it only calls `onPlusClick`. Defaults to `true` in both buttons that read it. */
  withMenu?: boolean;
  /** `id` of the plus button's icon element. */
  id?: string;
  /** Native tooltip of the plus button; the component passes `titles.actions` here. */
  title?: string;
  /** Called on click instead of opening the menu, and only while `withMenu` is `false`. */
  onPlusClick?: VoidFunction;
  /** Whether the kit is rendered inside the portal's iframe. It hides the plus, context and tariff elements and widens the menu's offset. */
  isFrame?: boolean;
  /** Called when the plus menu closes. Supplied internally. */
  onCloseDropBox?: () => void;
  /** Ref of the plus button's wrapper, used both to anchor its menu and as the guidance anchor. */
  forwardedRef?: React.RefObject<HTMLDivElement | null>;
};

export type TToggleInfoPanelButtonProps = {
  /** Whether the current folder is the root of its tree. It hides the back arrow, keeps the drop box shut and drops the title icon. */
  isRootFolder: boolean;
  /** Whether the info panel is open; it is the toggle's pressed state and reaches the container as `data-is-info-panel-visible`. */
  isInfoPanelVisible: boolean;
  /** Called when the info panel toggle is clicked. */
  toggleInfoPanel: (e?: React.MouseEvent) => void;
  id?: string;
  /** Native tooltips of the buttons — info panel, AI chat, plus menu, context menu — and the text and icon of the warning chip. Nothing here is translated for you. */
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
  className?: string;
  /** Text of the small badge next to the title. It sits next to the room title when one is shown, and next to the folder name otherwise. */
  badgeLabel?: string;
  /** Replaces the heading's `title` attribute — the native tooltip on the folder name. It is dropped when the room title is shown above. */
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
  /** Shows the logo block at the start of the header. A string is used as the logo's `src`; `true` shows only the burger logo. */
  withLogo: boolean | string;
  /** Which layout to render: it decides the breakpoint-dependent behaviour rather than a media query, so a wrong value shows the wrong buttons at the right width. */
  currentDeviceType: DeviceType;
};

export type TRowData = [TNavigationItem[], TOnNavigationItemClick, TRowParam];

export type TControlButtonProps = Omit<TToggleInfoPanelButtonProps, "id"> &
  Omit<TPlusButtonProps, "getData" | "className"> &
  Omit<TContextButtonProps, "getData" | "className" | "id"> & {
    /** Whether the person may create anything here. It is one of two conditions for the plus button; `isPlusButtonVisible` is the other, and both must hold. */
    canCreate: boolean;
    /** Returns the model of the folder's context menu. **It is called on every render**, whether or not the button is shown, so it has to be cheap and free of side effects. */
    getContextOptionsFolder: TGetContextMenuModel;
    /** Returns the model of the plus button's menu. It is called on every render of that button. */
    getContextOptionsPlus: TGetContextMenuModel;
    /** Not read. Nothing in this component or its children destructures it. */
    isEmptyFilesList?: boolean;
    /** Closes the breadcrumb drop box after the info panel is toggled from inside it. Supplied internally; a value you pass is overwritten. */
    toggleDropBox?: () => void;
    /** Whether the viewport is a desktop one. It is derived from `currentDeviceType` and passed down; your own value is overwritten. */
    isDesktop: boolean;
    /** Hides the folder's context button and shows a second one that is rendered only when at least one option is enabled. */
    isPublicRoom?: boolean;
    /** Adds a 16px inline-start margin to the button row, to clear the title next to it. */
    showTitle?: boolean;
    /** Label of the extra button at the end of the row. Without it the button is not rendered, and it is also hidden inside a frame and in the root folder. */
    navigationButtonLabel?: string;
    /** Called when that extra button is clicked. */
    onNavigationButtonClick?: () => void;
    /** Portal element for the tariff notice. It is cloned with the folder's `title` added as a prop, so the element has to tolerate one. Hidden inside a frame. */
    tariffBar?: React.ReactElement;
    /** Not read. Nothing in this component or its children destructures it. */
    isEmptyPage?: boolean;
    /** Rendered as-is at the end of the button row, after the tariff notice. */
    analyzeResponsesButton?: React.ReactNode;
    /** Opens/closes the AI chat panel. The button is not rendered without it,
     * which keeps every host that has no AI chat surface unchanged. */
    toggleChatPanel?: (e?: React.MouseEvent) => void;
    /** Drives the pressed state of the AI chat button */
    isChatPanelVisible?: boolean;
    /** Hides the AI chat button even when `toggleChatPanel` is passed */
    hideChatButton?: boolean;

    /** Whether the viewport is narrower than a desktop. It is derived from `currentDeviceType`; your own value is overwritten. */
    isMobile?: boolean;
    /** Whether the viewport is a phone. It is derived from `currentDeviceType`; your own value is overwritten. */
    isMobileOnly?: boolean;
    /** Ref attached to the plus button's wrapper, for a guidance overlay to anchor to. */
    addButtonRef?: RefObject<HTMLDivElement | null>;
    /** Ref attached to the extra navigation button. */
    buttonRef?: React.RefObject<HTMLButtonElement>;
    /** **Required for the context button to appear at all.** It is not defaulted: leave it out and the folder's context menu is never rendered, whatever `getContextOptionsFolder` returns. */
    isContextButtonVisible?: boolean;
    /** **Required for the plus button to appear at all.** It is not defaulted: leave it out and no plus button is rendered, even with `canCreate`. */
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
    /** Whether the info panel is open, which the toggle uses for its pressed state. */
    isInfoPanelVisible: boolean;
    /** Whether the host is the desktop application, which only changes the drop box's own padding. */
    isDesktopClient: boolean;
    /** URL of the logo shown in the collapsed header. It is an `<img src>`, not an icon name. */
    burgerLogo: string;
    /** The title block rendered inside the open drop box. Supplied internally. */
    navigationTitleContainerNode: React.ReactNode;
    /** Closes the drop box. Supplied internally. */
    onCloseDropBox: () => void;
    /** Controls rendering of title/header inside DropBox; defaults to true */
    showTitleInDropBox?: boolean;
  };

export type TNavigationProps = Omit<
  TDropBoxProps,
  | "dropBoxWidth"
  | "sectionHeight"
  | "onCloseDropBox"
  | "onClickAvailable"
  | "isDesktopClient"
  | "isTabletView"
  | "navigationTitleContainerNode"
> &
  Omit<TControlButtonProps, "isMobile"> &
  Omit<
    TTextProps,
    "isOpen" | "title" | "className" | "isRootFolderTitle" | "onClick"
  > & {
    /** Not read. Nothing destructures it. */
    showText: boolean;
    /** Name of the current folder, shown as the header's heading and used as the context menu's title. */
    title: string;
    /** Called with a crumb's id when one is chosen from the drop box, and when the room title above the heading is clicked. */
    onClickFolder: TOnNavigationItemClick;

    /** Not read. Nothing destructures it. */
    clearTrash: () => void;
    /** Not read. Nothing destructures it. */
    showFolderInfo: () => void;
    /** Not read. Nothing destructures it. */
    isCurrentFolderInfo: boolean;

    /** Not read. Nothing destructures it. */
    isRoom: boolean;
    /** **A flag, despite its type.** Its truthiness hides the info panel toggle, and a function is always truthy — passing the callback the type asks for hides the button. It is never called. */
    hideInfoPanel?: () => void;
    /** URL of the logo shown at the start of the header when `withLogo` is set. It is an `<img src>`. */
    burgerLogo: string;
    /** Shows the room's title above the folder's own, as a second clickable line. It is ignored in the root folder, on a phone, and when there is neither a `rootRoomTitle` nor more than one crumb. */
    showRootFolderTitle: boolean;
    /** URL of the small icon before the title. It is hidden in the root folder. */
    titleIcon: string;
    /** Title of the room shown above the folder name. Without it the second-to-last crumb's title is used. */
    rootRoomTitle: string;
    /** Written to the container as `data-show-navigation-button`, which only affects the stylesheet. The button itself is governed by `navigationButtonLabel`. */
    showNavigationButton: boolean;
    /** Text of the tooltip on the title icon. Without it no tooltip element is rendered. */
    titleIconTooltip?: string;
    /** Called when the logo is clicked. Only reachable while `withLogo` is set. */
    onLogoClick?: () => void;
    /** Header of the folder's context menu, used on mobile where the menu opens as a sheet. */
    contextMenuHeader?: HeaderType;
    /** Shows the back arrow even in the root folder, where it is otherwise hidden. */
    showBackButton?: boolean;
    /** Replaces the heading's `title` attribute — the native tooltip on the folder name. It is dropped when the room title is shown above. */
    titleTooltip?: string;
  };
