import React from "react";
import { isMobile } from "react-device-detect";

import { Portal } from "../portal";

import { DeviceType } from "../../enums";
import { ArticleProfileLoader } from "./skeletons";

import { Backdrop } from "../backdrop";
import { Scrollbar } from "../scrollbar";

import SubArticleHeader from "./sub-components/Header";
import ArticleProfile from "./sub-components/Profile";
import ArticleLiveChat from "./sub-components/LiveChat";
import ArticleApps from "./sub-components/Apps";
import ArticleCustomSlot from "./sub-components/CustomSlot";
import ArticleDevToolsBar from "./sub-components/DevToolsBar";
import HideArticleMenuButton from "./sub-components/HideMenuButton";
import BackButton from "./sub-components/BackButton";

import { pickAriaProps } from "../../utils/aria-props";
import styles from "./Article.module.scss";
import { HEADER_NAME, MAIN_BUTTON_NAME, BODY_NAME } from "./Article.constants";
import { ArticleProps } from "./Article.types";

const ArticleHeader = ({
  children: _children,
}: {
  children: React.ReactNode;
}) => null;
ArticleHeader.displayName = HEADER_NAME;

const ArticleMainButton = ({
  children: _children,
}: {
  children?: React.ReactNode;
}) => null;
ArticleMainButton.displayName = MAIN_BUTTON_NAME;

const ArticleBody = ({ children: _children }: { children: React.ReactNode }) =>
  null;
ArticleBody.displayName = BODY_NAME;

const Article = ({
  showText,
  setShowText,
  articleOpen,
  toggleShowText,
  toggleArticleOpen,
  setIsMobileArticle,
  children,

  withMainButton,
  isInfoPanelVisible,
  infoPanelWidth,

  hideProfileBlock,
  hideAppsBlock,

  setArticleOpen,

  isLiveChatAvailable,
  isShowLiveChat,

  onLogoClickAction,

  currentDeviceType,
  showArticleLoader,
  isAdmin,
  withCustomArticleHeader,

  isBurgerLoading,

  languageBaseName,
  isMobileArticle,
  zendeskKey,
  showProgress,
  user,
  getActions,
  onProfileClick,
  logoText,

  limitedAccessDevToolsForUsers,

  downloaddesktopUrl,
  officeforandroidUrl,
  officeforiosUrl,
  showBackButton,
  navigate,
  onBack,
  customSlot,
  ...rest
}: ArticleProps) => {
  const [articleHeaderContent, setArticleHeaderContent] =
    React.useState<null | React.JSX.Element>(null);
  const [articleMainButtonContent, setArticleMainButtonContent] =
    React.useState<null | React.JSX.Element>(null);
  const [articleBodyContent, setArticleBodyContent] =
    React.useState<null | React.JSX.Element>(null);

  const onMobileBack = React.useCallback(() => {
    // close article

    if (currentDeviceType !== DeviceType.mobile) return;
    setArticleOpen(false);
  }, [setArticleOpen, currentDeviceType]);

  React.useEffect(() => {
    window.addEventListener("popstate", onMobileBack);
    return () => window.removeEventListener("popstate", onMobileBack);
  }, [onMobileBack]);

  React.useEffect(() => {
    // A value that is not JSON counts as its raw text; blocked storage, as an
    // absent key.
    let showArticle: unknown = true;
    try {
      const item = localStorage.getItem("showArticle") || "{}";
      showArticle = item;
      showArticle = JSON.parse(item);
    } catch {
      // keep the fallback above
    }

    if (currentDeviceType === DeviceType.mobile) {
      setShowText(true);
      setIsMobileArticle(true);

      return;
    }

    if (currentDeviceType === DeviceType.tablet) {
      setIsMobileArticle(true);

      if (showArticle) return;

      setShowText(false);

      return;
    }

    setShowText(true);
    setIsMobileArticle(false);
  }, [setShowText, setIsMobileArticle, currentDeviceType]);

  React.useEffect(() => {
    React.Children.forEach(children, (child) => {
      const childType =
        child && child.type && (child.type.displayName || child.type.name);

      switch (childType) {
        case Article.Header.displayName:
          setArticleHeaderContent(child);
          break;
        case Article.MainButton.displayName:
          setArticleMainButtonContent(child);
          break;
        case Article.Body.displayName:
          setArticleBodyContent(child);
          break;
        default:
          break;
      }
    });
  }, [children]);

  const hideDevTools =
    user?.isVisitor ||
    (!isAdmin && limitedAccessDevToolsForUsers) ||
    window.location.pathname.includes("developer-tools") ||
    (window.location.pathname.includes("management") &&
      !window.location.pathname.includes("profile")) ||
    window.location.pathname.includes("accounts");

  const pathDevTools = "/developer-tools";

  const articleComponent = (
    <>
      <div
        {...pickAriaProps(rest)}
        id="article-container"
        data-show-text={showText ? "true" : "false"}
        data-open={articleOpen ? "true" : "false"}
        data-with-main-button={withMainButton ? "true" : "false"}
        className={styles.article}
        data-testid="article"
      >
        <SubArticleHeader
          showText={showText}
          onLogoClickAction={onLogoClickAction}
          currentDeviceType={currentDeviceType}
          withCustomArticleHeader={withCustomArticleHeader}
          isBurgerLoading={isBurgerLoading}
          onIconClick={toggleArticleOpen}
          showBackButton={showBackButton}
          navigate={navigate}
          onBack={onBack}
        >
          {articleHeaderContent ? articleHeaderContent.props.children : null}
        </SubArticleHeader>

        {articleMainButtonContent &&
        withMainButton &&
        currentDeviceType !== DeviceType.mobile ? (
          <div
            className={styles.articleMainButton}
            data-mobile-article={isMobileArticle ? "true" : "false"}
          >
            {articleMainButtonContent.props.children}
          </div>
        ) : null}

        <Scrollbar
          className="article-body__scrollbar"
          scrollClass="article-scroller"
        >
          {showBackButton && currentDeviceType !== DeviceType.mobile ? (
            <BackButton
              showText={showText}
              currentDeviceType={currentDeviceType}
              onLogoClickAction={onLogoClickAction}
              isLoading={isBurgerLoading}
              navigate={navigate}
              onBack={onBack}
            />
          ) : null}
          {articleBodyContent
            ? // `hasCustomSlot` is for a component child to read; a DOM element
              // (`<nav>`) would only render it as an unknown attribute, which
              // React warns about.
              typeof articleBodyContent.props.children.type === "string"
              ? articleBodyContent.props.children
              : React.cloneElement(articleBodyContent.props.children, {
                  hasCustomSlot: !!customSlot,
                })
            : null}
          {!showArticleLoader ? (
            <>
              {customSlot ? (
                <ArticleCustomSlot
                  withDevTools={!hideDevTools}
                  showBackButton={showBackButton}
                  showText={showText}
                >
                  {customSlot}
                </ArticleCustomSlot>
              ) : null}
              {!hideDevTools ? (
                <ArticleDevToolsBar
                  withCustomSlot={!!customSlot}
                  articleOpen={articleOpen}
                  currentDeviceType={currentDeviceType}
                  toggleArticleOpen={toggleArticleOpen}
                  showText={showText}
                  path={pathDevTools}
                  navigate={navigate}
                />
              ) : null}
              {!hideAppsBlock ? (
                <ArticleApps
                  withDevTools={!hideDevTools}
                  withCustomSlot={!!customSlot}
                  showText={showText}
                  logoText={logoText}
                  downloaddesktopUrl={downloaddesktopUrl}
                  officeforandroidUrl={officeforandroidUrl}
                  officeforiosUrl={officeforiosUrl}
                />
              ) : null}
              {!isMobile && isLiveChatAvailable ? (
                <ArticleLiveChat
                  languageBaseName={languageBaseName}
                  zendeskKey={zendeskKey}
                  isShowLiveChat={isShowLiveChat}
                  withFloatingButton={
                    (!!withMainButton &&
                      !!articleMainButtonContent &&
                      isMobileArticle) ||
                    showProgress
                  }
                  isInfoPanelVisible={isInfoPanelVisible}
                  infoPanelWidth={infoPanelWidth}
                />
              ) : null}
            </>
          ) : null}
        </Scrollbar>
        {!showArticleLoader ? (
          <HideArticleMenuButton
            showText={showText}
            toggleShowText={toggleShowText}
            hideProfileBlock={hideProfileBlock}
            withCustomSlot={!!customSlot}
          />
        ) : null}

        {!hideProfileBlock && currentDeviceType !== DeviceType.mobile ? (
          showArticleLoader ? (
            <ArticleProfileLoader showText={showText} />
          ) : (
            <ArticleProfile
              showText={showText}
              currentDeviceType={currentDeviceType}
              user={user}
              getActions={getActions}
              onProfileClick={onProfileClick}
            />
          )
        ) : null}
      </div>
      {articleOpen && currentDeviceType === DeviceType.mobile ? (
        <Backdrop
          onClick={toggleArticleOpen}
          visible
          zIndex={210}
          withBackground
        />
      ) : null}

      {articleMainButtonContent && currentDeviceType === DeviceType.mobile ? (
        <div
          className={styles.articleMainButton}
          data-mobile-article={isMobileArticle ? "true" : "false"}
        >
          {articleMainButtonContent.props.children}
        </div>
      ) : null}
    </>
  );

  const renderPortalArticle = () => {
    const rootElement = document.getElementById("root");

    return (
      <Portal
        element={articleComponent}
        appendTo={rootElement || undefined}
        visible
      />
    );
  };

  return currentDeviceType === DeviceType.mobile
    ? renderPortalArticle()
    : articleComponent;
};

Article.Header = ArticleHeader;
Article.MainButton = ArticleMainButton;
Article.Body = ArticleBody;

export default Article;
export { ArticleProfile };
export type { ArticleProfileProps, ArticleProps } from "./Article.types";
