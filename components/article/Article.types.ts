import { DeviceType } from "../../enums";
import { TUser } from "../../types";

import { ContextMenuModel } from "../context-menu";

export type TToggleArticleOpen = () => void;

export type ArticleHeaderProps = {
  /** Whether the panel is expanded. It is the width switch — 243px when set, 60px when not — and it is written back through `setShowText` on mount and on every device change. */
  showText: boolean;
  children: React.ReactNode;
  onIconClick: () => void;
  /** Called when the logo in the panel's header is clicked. */
  onLogoClickAction?: () => void;
  /** Renders the burger and logo as skeletons instead of images. */
  isBurgerLoading: boolean;
  /** Tells the header that the `Article.Header` slot carries its own markup, which changes the header's own padding. */
  withCustomArticleHeader: boolean;
  /** Which layout to render. The panel is a portal into `#root` on `mobile`, a collapsible sidebar on `tablet` and a fixed column on `desktop`; nothing here measures the viewport. */
  currentDeviceType: DeviceType;
  /** Shows the back button in the header, and a second one above the body on anything wider than a phone. */
  showBackButton: boolean;
  /** Router push used by the back button and the dev tools entry. Without it those elements navigate nowhere. */
  navigate?: (path: string) => void;
  /** Called by the back button instead of navigating. */
  onBack?: () => void;
};

export type ArticleAppsProps = {
  showText: boolean;
  withDevTools: boolean;
  withCustomSlot: boolean;
  /** Name shown in the "download the apps" block at the foot of the panel. */
  logoText: string;
  /** Address behind the desktop application link. */
  downloaddesktopUrl: string;
  /** Address behind the Android link. */
  officeforandroidUrl: string;
  /** Address behind the iOS link. */
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
  /** Called by the burger in the header, and by the backdrop on a phone. It is expected to flip `articleOpen`. */
  toggleArticleOpen: TToggleArticleOpen;
  /** Not read at this level. The component passes its own `/developer-tools` path to the bar. */
  path?: string;
  navigate?: (path: string) => void;
};

export type ArticleZendeskProps = {
  /** Locale handed to the Zendesk widget. */
  languageBaseName: string;
  /** Address the Zendesk widget pre-fills. */
  zendeskEmail: string;
  /** Name the Zendesk widget shows for the visitor. */
  chatDisplayName: string;
  /** Whether a main button belongs above the body. Without it the `Article.MainButton` slot is not rendered on anything but a phone. */
  withMainButton?: boolean;
  /** Whether the panel is in its narrow, overlay-capable mode. It is written back through `setIsMobileArticle` on mount and on every device change. */
  isMobileArticle: boolean;
  /** Key of the Zendesk account. The live chat block loads a third-party script with it. */
  zendeskKey: string;
  /** Whether an upload or other progress indicator is on screen, which moves the live chat bubble up. */
  showProgress: boolean;
  /** Whether the live chat bubble is expanded. */
  isShowLiveChat: boolean;
  /** Whether the info panel is open, which moves the live chat bubble clear of it. */
  isInfoPanelVisible?: boolean;
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

export type ArticleProps = ArticleProfileProps &
  ArticleZendeskProps &
  ArticleHideMenuButtonProps &
  Omit<ArticleDevToolsBarProps, "withCustomSlot"> &
  Omit<ArticleHeaderProps, "children" | "onClick" | "onIconClick"> &
  Omit<ArticleAppsProps, "withDevTools" | "withCustomSlot"> & {
    /** Called on mount and on every device change with the width the component has decided on. Wire it to the state behind `showText` or the panel never changes width. */
    setShowText: (value: boolean) => void;
    /** Called on mount and on every device change. Wire it to the state behind `isMobileArticle`. */
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

    /** Whether the live chat bubble may be rendered at all. It is also suppressed on a mobile user agent. */
    isLiveChatAvailable: boolean;

    /** Replaces the body, the apps block and the profile block with skeletons. The header and the slots are still rendered. */
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
    /** Extra content between the body and the apps block. Its presence also shifts the collapse handle and the developer tools entry. */
    customSlot?: React.ReactNode;
  };
