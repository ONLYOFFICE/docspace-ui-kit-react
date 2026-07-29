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

import { isTablet } from "../../../utils";
import { Button, ButtonSize } from "../../button";

import styles from "../Navigation.module.scss";

import { TControlButtonProps } from "../Navigation.types";

import ToggleInfoPanelButton from "./ToggleInfoPanelBtn";
import PlusButton from "./PlusBtn";
import ContextButton from "./ContextBtn";
import WarningComponent from "./WarningComponent";

const ControlButtons = ({
  isRootFolder,
  isInfoPanelVisible,
  toggleInfoPanel,
  toggleDropBox,
  titles,

  // Plus button props
  canCreate,
  getContextOptionsPlus,
  withMenu,
  onPlusClick,
  isFrame,
  onCloseDropBox,

  // Context button props
  getContextOptionsFolder,
  isTrashFolder,
  isMobile,
  isMobileOnly,
  onContextOptionsClick,
  isPublicRoom,

  // Navigation button props
  navigationButtonLabel,
  onNavigationButtonClick,

  // Visibility controls
  isDesktop,
  showTitle,

  // Tariff bar
  tariffBar,
  title,

  // Guidance props
  addButtonRef,
  buttonRef,
  contextButtonAnimation,
  guidAnimationVisible,
  setGuidAnimationVisible,
  isContextButtonVisible,

  isPlusButtonVisible,
  contextMenuHeader,
  analyzeResponsesButton,
}: TControlButtonProps) => {
  const toggleInfoPanelAction = () => {
    toggleInfoPanel?.();
    toggleDropBox?.();
  };

  const isTabletView = isTablet();
  const contextOptionsFolder = getContextOptionsFolder();
  const containVisible = contextOptionsFolder.some((item) => !item.disabled);

  const renderNavigationButton = () => {
    if (!navigationButtonLabel || isFrame || isRootFolder) return null;

    return (
      <Button
        ref={buttonRef}
        className="navigation_button"
        testId="navigation_button"
        label={navigationButtonLabel}
        size={ButtonSize.extraSmall}
        onClick={onNavigationButtonClick}
      />
    );
  };

  const renderTariffBar = () => {
    if (!tariffBar || isFrame) return null;

    const cloneProps = { title };

    return (
      <div className={styles.tariffWrapper}>
        {React.cloneElement(tariffBar, cloneProps)}
      </div>
    );
  };

  const renderPlusButton = () => {
    if ((isMobile && !isFrame) || !canCreate) return null;

    return (
      <PlusButton
        forwardedRef={addButtonRef}
        id="header_add-button"
        className="add-button"
        getData={getContextOptionsPlus}
        withMenu={withMenu}
        onPlusClick={onPlusClick}
        isFrame={isFrame}
        title={titles?.actions}
        onCloseDropBox={onCloseDropBox}
      />
    );
  };

  const renderContextButton = (visible: boolean) => {
    // console.log(visible);

    if (!visible || isFrame) return null;

    return (
      <ContextButton
        id="header_optional-button"
        className="option-button"
        getData={getContextOptionsFolder}
        withMenu={withMenu}
        title={title}
        isTrashFolder={isTrashFolder}
        isMobile={isMobile || false}
        isMobileOnly={isMobileOnly || false}
        contextMenuHeader={contextMenuHeader}
        onCloseDropBox={onCloseDropBox}
        onContextOptionsClick={onContextOptionsClick}
        contextButtonAnimation={contextButtonAnimation}
        guidAnimationVisible={guidAnimationVisible}
        setGuidAnimationVisible={setGuidAnimationVisible}
        ignoreChangeView={!!(isMobile && !!contextMenuHeader)}
      />
    );
  };

  const renderToggleInfoPanel = () => {
    if (isDesktop) return null;

    return (
      <ToggleInfoPanelButton
        isRootFolder={isRootFolder}
        isInfoPanelVisible={isInfoPanelVisible}
        toggleInfoPanel={toggleInfoPanelAction}
        titles={titles}
      />
    );
  };

  const renderWarning = () => {
    if (!isDesktop || !titles?.warningText) return null;

    return (
      <WarningComponent
        title={titles?.warningText}
        icon={titles?.warningIcon}
      />
    );
  };

  return (
    <div
      id="control-buttons-container"
      className={styles.controlButtonContainer}
      data-is-frame={isFrame}
      data-show-title={showTitle}
    >
      {isPlusButtonVisible ? renderPlusButton() : null}
      {renderContextButton((isContextButtonVisible && !isPublicRoom) ?? false)}
      {renderToggleInfoPanel()}
      {renderContextButton((isPublicRoom && containVisible) ?? false)}
      {renderWarning()}
      {!isTabletView ? renderNavigationButton() : null}
      {renderTariffBar()}
      {analyzeResponsesButton ?? null}
      {isTabletView ? renderNavigationButton() : null}
    </div>
  );
};

export default ControlButtons;
