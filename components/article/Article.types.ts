import { DeviceType } from "../../enums";
import { TUser } from "../../types";

import { ContextMenuModel } from "../context-menu";

export type TToggleArticleOpen = () => void;

export type ArticleHeaderProps = {
  showText: boolean;
  children: React.ReactNode;
  onIconClick: () => void;
  onLogoClickAction?: () => void;
  isBurgerLoading: boolean;
  withCustomArticleHeader: boolean;
  currentDeviceType: DeviceType;
  showBackButton: boolean;
  navigate?: (path: string) => void;
  onBack?: () => void;
};


export type ArticleAppsProps = {
  showText: boolean;
  withDevTools: boolean;
  withCustomSlot: boolean;
  logoText: string;
  downloaddesktopUrl: string;
  officeforandroidUrl: string;
  officeforiosUrl: string;
};

export type ArticleHideMenuButtonProps = {
  showText: boolean;
  toggleShowText: VoidFunction;
  hideProfileBlock: boolean;
  withCustomSlot: boolean;
};

export type ArticleDevToolsBarProps = {
  showText: boolean;
  articleOpen: boolean;
  withCustomSlot: boolean;
  currentDeviceType: DeviceType;
  toggleArticleOpen: TToggleArticleOpen;
  path?: string;
  navigate?: (path: string) => void;
};

export type ArticleZendeskProps = {
  languageBaseName: string;
  zendeskEmail: string;
  chatDisplayName: string;
  withMainButton?: boolean;
  isMobileArticle: boolean;
  zendeskKey: string;
  showProgress: boolean;
  isShowLiveChat: boolean;
  isInfoPanelVisible?: boolean;
};

export type ArticleProfileProps = {
  user?: TUser;
  showText: boolean;
  getActions?: (
    t?: (key: string, options?: Record<string, string | number>) => string,
  ) => ContextMenuModel[];
  onProfileClick?: (obj: { originalEvent: React.MouseEvent }) => void;
  currentDeviceType: DeviceType;
};

export type ArticleProps = ArticleProfileProps &
  ArticleZendeskProps &
  ArticleHideMenuButtonProps &
  Omit<ArticleDevToolsBarProps, "withCustomSlot"> &
  Omit<ArticleHeaderProps, "children" | "onClick" | "onIconClick"> &
  Omit<ArticleAppsProps, "withDevTools" | "withCustomSlot"> & {
    setShowText: (value: boolean) => void;
    setIsMobileArticle: (value: boolean) => void;
    children: React.JSX.Element[];

    hideAppsBlock: boolean;

    setArticleOpen: (value: boolean) => void;
    withSendAgain: boolean;
    mainBarVisible: boolean;

    isLiveChatAvailable: boolean;

    showArticleLoader?: boolean;
    isAdmin: boolean;

    isNonProfit?: boolean;
    isGracePeriod?: boolean;
    isFreeTariff?: boolean;
    isPaymentPageAvailable?: boolean;
    isLicenseDateExpired?: boolean;
    isTrial?: boolean;
    standalone?: boolean;
    currentTariffPlanTitle?: string;
    trialDaysLeft?: number;

    limitedAccessDevToolsForUsers: boolean;
    customSlot?: React.ReactNode;
  };
