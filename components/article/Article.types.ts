import { DeviceType } from "../../enums";
import { TUser } from "../../types";

import { ContextMenuModel } from "../context-menu";

export type TToggleArticleOpen = () => void;

export type ArticleHeaderProps = {
  /** Whether the panel is expanded. It is the width switch — 243px when set, 60px when not — and it is written back through `setShowText` on mount and on every device change. */
  showText: boolean;
  children: React.ReactNode;
  onIconClick: () => void;
  /** Called when the logo, or the back button above the body, is clicked, before the panel navigates. */
  onLogoClickAction?: () => void;
  /** Renders the logo and the back button as skeletons. A custom header outranks it. */
  isBurgerLoading: boolean;
  /** Shows the `Article.Header` slot in the header row in place of the logo. Without it the slot is not rendered; a phone never shows it. */
  withCustomArticleHeader: boolean;
  /** Which layout to render. The panel is a portal into `#root` on `mobile`, a collapsible sidebar on `tablet` and a fixed column on `desktop`; nothing here measures the viewport. */
  currentDeviceType: DeviceType;
  /** Shows the back button in the header, and a second one above the body on anything wider than a phone. */
  showBackButton: boolean;
  /** Router push used by the logo, the back button and the developer tools entry. Without it they set `window.location`, which reloads the page. */
  navigate?: (path: string) => void;
  /** Called by the back button instead of navigating. */
  onBack?: () => void;
};

export type ArticleAppsProps = {
  showText: boolean;
  withDevTools: boolean;
  withCustomSlot: boolean;
  /** Organization name in the tooltips of the "download the apps" links. */
  logoText: string;
  /** Address behind the Windows, macOS and Linux links. Empty, those three links are not drawn. */
  downloaddesktopUrl: string;
  /** Address behind the Android link. Empty, the link is not drawn. */
  officeforandroidUrl: string;
  /** Address behind the iOS link. Empty, the link is not drawn. */
  officeforiosUrl: string;
};

export type ArticleHideMenuButtonProps = {
  showText: boolean;
  /** Called by the collapse handle at the foot of the panel. It is expected to flip `showText`; the panel does not collapse on its own. */
  toggleShowText: VoidFunction;
  /** Removes the profile block at the foot of the panel, and moves the collapse handle down to take its place. */
  hideProfileBlock: boolean;
  /** Not read. The component works out whether there is a custom slot from `customSlot` itself. */
  withCustomSlot: boolean;
};

export type ArticleDevToolsBarProps = {
  showText: boolean;
  /** Whether the panel is open over the page. It only matters on a phone, where the panel is a portal with a backdrop. */
  articleOpen: boolean;
  withCustomSlot: boolean;
  currentDeviceType: DeviceType;
  /** Called on a phone by the header's close button, the backdrop, the back button and the developer tools entry. It is expected to flip `articleOpen`. */
  toggleArticleOpen: TToggleArticleOpen;
  /** Not read at this level. The component passes its own `/developer-tools` path to the bar. */
  path?: string;
  navigate?: (path: string) => void;
};

export type ArticleZendeskProps = {
  /** Locale handed to the Zendesk widget. */
  languageBaseName: string;
  /** Key of the Zendesk account. The live chat block loads a third-party script with it. */
  zendeskKey: string;
  /** Whether the Zendesk widget is on the page. The script loads the first time this is true; from then on the "Live chat" switch shows and hides the widget through its API. */
  isShowLiveChat: boolean;
};

/** What `ArticleLiveChat` takes: the widget settings, plus the corner its launcher shares. */
export type ArticleLiveChatProps = ArticleZendeskProps & {
  /**
   * Something the app pins to the bottom inline-end corner - a create button,
   * an upload progress button - is on screen, so the launcher steps aside to
   * keep off it.
   */
  withFloatingButton?: boolean;
  /** The info panel is docked at the inline end, so the launcher moves clear of it. */
  isInfoPanelVisible?: boolean;
  /** Width in px of the open info or chat panel, or `0`, for the launcher to move clear of. Set, it wins over `isInfoPanelVisible`, which assumes `INFO_PANEL_WIDTH`. */
  infoPanelWidth?: number;
};

export type ArticleProfileProps = {
  /** The signed-in person, shown in the block at the foot of the panel. Its `isVisitor` also hides the developer tools entry. */
  user?: TUser;
  showText: boolean;
  /** Returns the model of the profile block's context menu. It is handed a translate function, which this package does not supply. */
  getActions?: (
    t?: (key: string, options?: Record<string, string | number>) => string,
  ) => ContextMenuModel[];
  /** Called when the profile block is clicked, with the original event wrapped in an object. */
  onProfileClick?: (obj: { originalEvent: React.MouseEvent }) => void;
  currentDeviceType: DeviceType;
};

export type ArticleProps = React.AriaAttributes &
  ArticleProfileProps &
  ArticleZendeskProps &
  ArticleHideMenuButtonProps &
  Omit<ArticleDevToolsBarProps, "withCustomSlot"> &
  Omit<ArticleHeaderProps, "children" | "onClick" | "onIconClick"> &
  Omit<ArticleAppsProps, "withDevTools" | "withCustomSlot"> & {
    /** Called on mount and on every device change: `true` on a desktop or a phone. On a tablet it gets `false`, and only while `showArticle` in local storage is falsy. */
    setShowText: (value: boolean) => void;
    /** Whether a main button belongs above the body. Without it the `Article.MainButton` slot is not rendered on anything but a phone. */
    withMainButton?: boolean;
    /** Removes the padding and margin around the main button, and moves the live chat launcher clear of it. The component writes it back through `setIsMobileArticle`. */
    isMobileArticle: boolean;
    /**
     * Whether an upload or other progress indicator is on screen.
     * @deprecated It goes in the next major. While it is set, the live chat launcher steps one button aside, as for a main button.
     */
    showProgress?: boolean;
    /** Whether the info panel is open. Above mobile the live chat launcher moves clear of it. */
    isInfoPanelVisible?: boolean;
    /** Width in px of the open info or chat panel, or `0`, for the live chat launcher to move clear of. Set, it wins over `isInfoPanelVisible`; pass it when the panels are resizable. */
    infoPanelWidth?: number;
    /** Called on mount and on every device change: `true` on a tablet or a phone, `false` on a desktop. Wire it to the state behind `isMobileArticle`. */
    setIsMobileArticle: (value: boolean) => void;
    /** The three slots, as an array. Each is `Article.Header`, `Article.MainButton` or `Article.Body`; anything else is dropped, and the slots are matched by display name, so a wrapper around one hides it. */
    children: React.JSX.Element[];

    /** Removes the "download the apps" block at the foot of the panel. */
    hideAppsBlock: boolean;

    /** Called with `false` when the browser goes back on a phone, to close the panel. */
    setArticleOpen: (value: boolean) => void;
    /** Not read. Nothing in the component uses it. */
    withSendAgain: boolean;
    /** Whether the portal's top bar is on screen. Its height is measured out of the window height on every resize — a measurement the component then does not use. */
    mainBarVisible: boolean;

    /** Whether the live chat is mounted at all. It is also suppressed on a mobile user agent. */
    isLiveChatAvailable: boolean;

    /** Replaces the profile block with a skeleton. It also removes the custom slot, the developer tools entry, the apps block, the live chat and the collapse handle. */
    showArticleLoader?: boolean;
    /** Whether the person is an administrator. With `limitedAccessDevToolsForUsers` it decides whether the developer tools entry is shown. */
    isAdmin: boolean;

    /** Not read. Nothing in the component uses it. */
    isNonProfit?: boolean;
    /** Not read. Nothing in the component uses it. */
    isGracePeriod?: boolean;
    /** Not read. Nothing in the component uses it. */
    isFreeTariff?: boolean;
    /** Not read. Nothing in the component uses it. */
    isPaymentPageAvailable?: boolean;
    /** Not read. Nothing in the component uses it. */
    isLicenseDateExpired?: boolean;
    /** Not read. Nothing in the component uses it. */
    isTrial?: boolean;
    /** Not read. Nothing in the component uses it. */
    standalone?: boolean;
    /** Not read. Nothing in the component uses it. */
    currentTariffPlanTitle?: string;
    /** Not read. Nothing in the component uses it. */
    trialDaysLeft?: number;

    /** Hides the developer tools entry from anyone who is not an administrator. */
    limitedAccessDevToolsForUsers: boolean;
    /** Extra content under the body, above the developer tools entry. Its presence also shifts the collapse handle and the developer tools entry. */
    customSlot?: React.ReactNode;
  };
