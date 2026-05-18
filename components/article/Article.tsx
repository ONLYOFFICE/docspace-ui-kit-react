/*
 * Copyright (C) Ascensio System SIA, 2009-2026
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation, together with the
 * additional terms provided in the LICENSE file.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For
 * details, see the GNU AGPL at: https://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA by email at info@onlyoffice.com
 * or by postal mail at 20A-6 Ernesta Birznieka-Upisha Street, Riga,
 * LV-1050, Latvia, European Union.
 *
 * The interactive user interfaces in modified versions of the Program
 * are required to display Appropriate Legal Notices in accordance with
 * Section 5 of the GNU AGPL version 3.
 *
 * No trademark rights are granted under this License.
 *
 * All non-code elements of the Product, including illustrations,
 * icon sets, and technical writing content, are licensed under the
 * Creative Commons Attribution-ShareAlike 4.0 International License:
 * https://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 * This license applies only to such non-code elements and does not
 * modify or replace the licensing terms applicable to the Program's
 * source code, which remains licensed under the GNU Affero General
 * Public License v3.
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React from "react";
import { isMobile, isMobileOnly, isIOS } from "react-device-detect";

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
import { BackButton } from "./sub-components/BackButton";

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

  hideProfileBlock,
  hideAppsBlock,

  setArticleOpen,
  withSendAgain,
  mainBarVisible,

  isLiveChatAvailable,
  isShowLiveChat,

  onLogoClickAction,

  currentDeviceType,
  showArticleLoader,
  isAdmin,
  withCustomArticleHeader,

  isBurgerLoading,

  isNonProfit,
  isFreeTariff,
  isGracePeriod,
  isLicenseDateExpired,
  isPaymentPageAvailable,
  isTrial,
  standalone,
  currentTariffPlanTitle,
  trialDaysLeft,

  languageBaseName,
  zendeskEmail,
  isMobileArticle,
  chatDisplayName,
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
}: ArticleProps) => {
  const [articleHeaderContent, setArticleHeaderContent] =
    React.useState<null | React.JSX.Element>(null);
  const [articleMainButtonContent, setArticleMainButtonContent] =
    React.useState<null | React.JSX.Element>(null);
  const [articleBodyContent, setArticleBodyContent] =
    React.useState<null | React.JSX.Element>(null);
  const [_correctTabletHeight, setCorrectTabletHeight] = React.useState<
    null | number
  >(null);
  const updateSizeRef = React.useRef<null | ReturnType<typeof setTimeout>>(
    null,
  );

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
    const item = localStorage.getItem("showArticle") || "{}";

    const showArticle = JSON.parse(item);

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

  // TODO: make some better
  const onResize = React.useCallback(
    (e?: Event) => {
      let tableHeight = window.innerHeight;

      if (mainBarVisible) {
        const mainBar = document.getElementById("main-bar");

        if (mainBar) {
          if (!mainBar.offsetHeight) {
            updateSizeRef.current = setTimeout(() => onResize(), 0);
            return;
          }

          tableHeight -= mainBar.offsetHeight;
        }
      }

      setCorrectTabletHeight(tableHeight);
    },
    [mainBarVisible],
  );

  React.useEffect(() => {
    onResize();
    window.addEventListener("resize", onResize);
    if (isMobile && !isMobileOnly && isIOS) {
      window?.visualViewport?.addEventListener("resize", onResize);
    }
    return () => {
      window.removeEventListener("resize", onResize);
      window?.visualViewport?.removeEventListener("resize", onResize);
      if (updateSizeRef.current) clearTimeout(updateSizeRef.current);
    };
  }, [onResize]);

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
            ? React.cloneElement(articleBodyContent.props.children, {
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
                  isInfoPanelVisible={isInfoPanelVisible}
                  withMainButton={
                    withMainButton || false ? !!articleMainButtonContent : false
                  }
                  languageBaseName={languageBaseName}
                  zendeskEmail={zendeskEmail}
                  isMobileArticle={isMobileArticle}
                  chatDisplayName={chatDisplayName}
                  zendeskKey={zendeskKey}
                  showProgress={showProgress}
                  isShowLiveChat={isShowLiveChat}
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

export { Article };
