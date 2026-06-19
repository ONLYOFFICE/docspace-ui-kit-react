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

import React, { useCallback } from "react";

import { Consumer, DomHelpers } from "../../utils";
import { Backdrop } from "../backdrop";

import ArrowButton from "./sub-components/ArrowBtn";
import ControlButtons from "./sub-components/ControlBtn";
import ToggleInfoPanelButton from "./sub-components/ToggleInfoPanelBtn";
import NavigationLogo from "./sub-components/LogoBlock";
import DropBox from "./sub-components/DropBox";

import NavigationText from "./sub-components/Text";

import { DeviceType } from "../../enums";
import styles from "./Navigation.module.scss";
import { TNavigationProps } from "./Navigation.types";
import Badges from "./sub-components/Badges";

const Navigation = ({
  isRootFolder,
  title,
  canCreate,
  onClickFolder,
  navigationItems,
  getContextOptionsPlus,
  getContextOptionsFolder,
  onBackToParentFolder,
  isTrashFolder,
  toggleInfoPanel,
  isInfoPanelVisible,
  titles,
  withMenu,
  onPlusClick,
  isEmptyPage,
  isDesktop: isDesktopClient,
  isFrame,
  hideInfoPanel,
  showRootFolderTitle,
  withLogo,
  burgerLogo,
  isPublicRoom,
  titleIcon,
  titleIconTooltip,
  currentDeviceType,
  rootRoomTitle,
  showTitle,
  navigationButtonLabel,
  onNavigationButtonClick,
  tariffBar,
  showNavigationButton,
  badgeLabel,
  onContextOptionsClick,
  onLogoClick,
  buttonRef,
  addButtonRef,
  contextButtonAnimation,
  guidAnimationVisible,
  setGuidAnimationVisible,
  isContextButtonVisible,
  isPlusButtonVisible,
  showBackButton,
  contextMenuHeader,
  analyzeResponsesButton,
  aiChatButton,
  titleTooltip,

  ...rest
}: TNavigationProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [firstClick, setFirstClick] = React.useState(true);
  const [dropBoxWidth, setDropBoxWidth] = React.useState(0);

  const dropBoxRef = React.useRef<HTMLDivElement | null>(null);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  const isDesktop = currentDeviceType === DeviceType.desktop;

  const toggleDropBox = useCallback(() => {
    if (navigationItems?.length === 0) return;
    if (isRootFolder) return setIsOpen(false);
    setIsOpen((prev) => !prev);

    if (containerRef.current)
      setDropBoxWidth(DomHelpers.getOuterWidth(containerRef.current));

    setFirstClick(true);
  }, [isRootFolder, navigationItems?.length]);

  const onCloseDropBox = () => {
    if (isOpen) setIsOpen(false);
  };

  const onMissClick = React.useCallback(
    (e: MouseEvent) => {
      const path = e.composedPath && e.composedPath();

      if (!firstClick) {
        if (dropBoxRef.current && !path.includes(dropBoxRef.current))
          toggleDropBox();
      } else {
        setFirstClick((prev) => !prev);
      }
    },
    [firstClick, toggleDropBox, setFirstClick],
  );

  const onClickAvailable = React.useCallback(
    (id: number | string, isRootRoom: boolean, isRootTemplates?: boolean) => {
      onClickFolder?.(id, isRootRoom, isRootTemplates);
      toggleDropBox();
    },
    [onClickFolder, toggleDropBox],
  );

  const onResize = React.useCallback(() => {
    if (containerRef.current)
      setDropBoxWidth(DomHelpers.getOuterWidth(containerRef.current));
  }, []);

  React.useEffect(() => {
    if (isOpen) {
      window.addEventListener("click", onMissClick);
      window.addEventListener("resize", onResize);
    } else {
      window.removeEventListener("click", onMissClick);
      window.removeEventListener("resize", onResize);
      setFirstClick(true);
    }

    return () => {
      window.removeEventListener("click", onMissClick);
      window.removeEventListener("resize", onResize);
    };
  }, [isOpen, onResize, onMissClick]);

  React.useEffect(() => {
    if (!navigationItems?.length) {
      setIsOpen(false);
    }
  }, [navigationItems]);

  const onBackToParentFolderAction = React.useCallback(() => {
    setIsOpen((val) => !val);
    onBackToParentFolder?.();
  }, [onBackToParentFolder]);

  const showRootFolderNavigation =
    !isRootFolder &&
    showRootFolderTitle &&
    ((navigationItems && navigationItems.length > 1) || rootRoomTitle) &&
    currentDeviceType !== DeviceType.mobile;

  const navigationTitleNode = (
    <div className="title-block">
      <NavigationText
        className="title-block-text"
        title={title}
        isOpen={false}
        isRootFolder={isRootFolder}
        onClick={toggleDropBox}
        isRootFolderTitle={false}
        badgeLabel={!showRootFolderNavigation ? badgeLabel : ""}
        titleTooltip={!showRootFolderNavigation ? titleTooltip : undefined}
      />
    </div>
  );

  const onTextClick = React.useCallback(() => {
    onClickFolder(navigationItems[navigationItems.length - 2].id, false, false);
    setIsOpen(false);
  }, [navigationItems, onClickFolder]);

  const navigationTitleContainerNode = showRootFolderNavigation ? (
    <div className="title-container">
      <div className="badges-container">
        <Badges
          titleIcon={titleIcon}
          isRootFolder={isRootFolder}
          titleIconTooltip={titleIconTooltip}
        />
        <NavigationText
          className="room-title"
          title={
            rootRoomTitle || navigationItems[navigationItems.length - 2].title
          }
          isOpen={isOpen}
          isRootFolder={isRootFolder}
          isRootFolderTitle
          onClick={onTextClick}
          badgeLabel={badgeLabel}
        />
      </div>
      {navigationTitleNode}
    </div>
  ) : (
    <div className="badges-container">
      <Badges
        titleIcon={titleIcon}
        isRootFolder={isRootFolder}
        titleIconTooltip={titleIconTooltip}
      />
      {navigationTitleNode}
    </div>
  );

  const haveItems = !!navigationItems?.length;

  return (
    <Consumer>
      {(context) => (
        <>
          {isOpen && haveItems ? (
            <>
              <Backdrop
                visible={isOpen}
                withBackground={false}
                withoutBackground
                zIndex={400}
                onClick={onCloseDropBox}
              />

              <DropBox
                {...rest}
                isDesktop={isDesktop}
                ref={dropBoxRef}
                dropBoxWidth={dropBoxWidth}
                sectionHeight={context.sectionHeight || 0}
                isRootFolder={isRootFolder}
                onBackToParentFolder={onBackToParentFolderAction}
                canCreate={canCreate}
                navigationItems={navigationItems}
                getContextOptionsFolder={getContextOptionsFolder}
                getContextOptionsPlus={getContextOptionsPlus}
                toggleDropBox={toggleDropBox}
                toggleInfoPanel={toggleInfoPanel}
                isInfoPanelVisible={isInfoPanelVisible}
                onClickAvailable={onClickAvailable}
                isDesktopClient={isDesktopClient}
                withLogo={withLogo}
                burgerLogo={burgerLogo}
                currentDeviceType={currentDeviceType}
                navigationTitleContainerNode={navigationTitleContainerNode}
                onCloseDropBox={onCloseDropBox}
                isFrame={isFrame}
                isContextButtonVisible={isContextButtonVisible}
                isPublicRoom={isPublicRoom}
                isPlusButtonVisible={isPlusButtonVisible}
              />
            </>
          ) : null}
          <div
            ref={containerRef}
            className={styles.container}
            data-is-root-folder={isRootFolder ? "true" : "false"}
            data-is-show-back-button={showBackButton ? "true" : "false"}
            data-is-trash-folder={isTrashFolder ? "true" : "false"}
            data-is-desktop={isDesktop ? "true" : "false"}
            data-is-desktop-client={isDesktopClient ? "true" : "false"}
            data-is-info-panel-visible={isInfoPanelVisible ? "true" : "false"}
            data-with-logo={withLogo ? "true" : "false"}
            data-is-frame={isFrame ? "true" : "false"}
            data-is-public-room={isPublicRoom ? "true" : "false"}
            data-show-navigation-button={
              showNavigationButton ? "true" : "false"
            }
            data-is-drop-box-component="false"
          >
            {withLogo ? (
              <NavigationLogo
                className="navigation-logo"
                logo={typeof withLogo === "string" ? withLogo : ""}
                burgerLogo={burgerLogo}
                onClick={onLogoClick}
              />
            ) : null}
            <ArrowButton
              isRootFolder={isRootFolder}
              showBackButton={showBackButton}
              onBackToParentFolder={onBackToParentFolder}
            />

            {showTitle ? navigationTitleContainerNode : null}

            <ControlButtons
              buttonRef={buttonRef}
              addButtonRef={addButtonRef}
              isRootFolder={isRootFolder}
              canCreate={canCreate}
              getContextOptionsFolder={getContextOptionsFolder}
              getContextOptionsPlus={getContextOptionsPlus}
              toggleInfoPanel={toggleInfoPanel}
              isInfoPanelVisible={isInfoPanelVisible}
              isDesktop={isDesktop}
              titles={titles}
              withMenu={withMenu}
              onPlusClick={onPlusClick}
              isFrame={isFrame}
              isPublicRoom={isPublicRoom}
              isTrashFolder={isTrashFolder}
              showTitle={showTitle}
              navigationButtonLabel={navigationButtonLabel}
              onNavigationButtonClick={onNavigationButtonClick}
              tariffBar={tariffBar}
              title={title}
              isEmptyPage={isEmptyPage}
              onContextOptionsClick={onContextOptionsClick}
              isMobile={currentDeviceType !== DeviceType.desktop}
              isMobileOnly={currentDeviceType === DeviceType.mobile}
              contextButtonAnimation={contextButtonAnimation}
              guidAnimationVisible={guidAnimationVisible}
              setGuidAnimationVisible={setGuidAnimationVisible}
              isContextButtonVisible={isContextButtonVisible}
              isPlusButtonVisible={isPlusButtonVisible}
              contextMenuHeader={contextMenuHeader}
              analyzeResponsesButton={analyzeResponsesButton}
            />
          </div>
          <div className={styles.buttonsContainer}>
            {aiChatButton}
            {isDesktop && !hideInfoPanel ? (
              <ToggleInfoPanelButton
                id="info-panel-toggle--open"
                isRootFolder={isRootFolder}
                toggleInfoPanel={toggleInfoPanel}
                isInfoPanelVisible={isInfoPanelVisible}
                titles={titles}
              />
            ) : null}
          </div>
        </>
      )}
    </Consumer>
  );
};

export default React.memo(Navigation);
