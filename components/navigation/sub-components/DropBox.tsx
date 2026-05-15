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
import { VariableSizeList } from "react-window";

import { DeviceType } from "../../../enums";

import { Scrollbar } from "../../scrollbar";

import styles from "../Navigation.module.scss";
import { TDropBoxProps } from "../Navigation.types";
import { useInterfaceDirection } from "../../../context/InterfaceDirectionContext";

import NavigationLogo from "./LogoBlock";
import ArrowButton from "./ArrowBtn";
import ControlButtons from "./ControlBtn";
import Row from "./Row";

const DropBox = ({
  ref,
  sectionHeight,
  dropBoxWidth,
  isRootFolder,
  onBackToParentFolder,
  canCreate,
  navigationItems,
  getContextOptionsFolder,
  getContextOptionsPlus,
  toggleDropBox,
  toggleInfoPanel,
  onClickAvailable,
  isInfoPanelVisible,
  isDesktop,
  isDesktopClient,
  withLogo,
  burgerLogo,
  isFrame,
  currentDeviceType,
  navigationTitleContainerNode,
  onCloseDropBox,
  isContextButtonVisible,
  isPublicRoom,

  isPlusButtonVisible,
  showTitleInDropBox,
}: TDropBoxProps) => {
  const [dropBoxHeight, setDropBoxHeight] = React.useState(0);
  const { interfaceDirection } = useInterfaceDirection();

  const countItems = navigationItems.length;

  const getItemSize = useCallback(
    (index: number): number => {
      if (index === countItems - 1) return 51;
      return currentDeviceType !== DeviceType.desktop ? 36 : 30;
    },
    [countItems, currentDeviceType],
  );

  React.useEffect(() => {
    const itemsHeight = navigationItems.map((item, index) =>
      getItemSize(index),
    );

    const currentHeight = itemsHeight.reduce((a, b) => a + b);

    // Reserve header height only when title is shown
    let navHeight = showTitleInDropBox === false ? 0 : 41;

    if (currentDeviceType === DeviceType.tablet) {
      navHeight = showTitleInDropBox === false ? 0 : 49;
    }

    if (currentDeviceType === DeviceType.mobile) {
      navHeight = showTitleInDropBox === false ? 0 : 45;
    }

    if (!sectionHeight || sectionHeight <= 0) {
      // Fallback for Storybook/no layout context
      setDropBoxHeight(Math.max(1, currentHeight));
    } else {
      const candidate =
        currentHeight + navHeight > sectionHeight
          ? sectionHeight - navHeight - 20
          : currentHeight;
      setDropBoxHeight(Math.max(1, candidate));
    }
  }, [
    sectionHeight,
    currentDeviceType,
    navigationItems,
    getItemSize,
    showTitleInDropBox,
  ]);

  const isTabletView = currentDeviceType === DeviceType.tablet;

  return (
    <div
      ref={ref}
      className={styles.box}
      data-with-logo={withLogo ? "true" : "false"}
      data-is-frame={isFrame ? "true" : "false"}
      style={
        {
          "--drop-box-width": `${dropBoxWidth}px`,
          "--drop-box-height":
            sectionHeight && sectionHeight > 0 && sectionHeight < dropBoxHeight
              ? `${sectionHeight}px`
              : null,
          // Explicit height when no sectionHeight provided (Storybook)
          height:
            (!sectionHeight || sectionHeight <= 0) && dropBoxHeight
              ? `${dropBoxHeight}px`
              : undefined,
        } as React.CSSProperties
      }
    >
      <div
        className={styles.container}
        data-is-drop-box-component="true"
        data-is-desktop-client={isDesktopClient ? "true" : "false"}
        data-with-logo={!!withLogo && isTabletView ? "true" : "false"}
        data-is-desktop={isDesktop ? "true" : "false"}
        data-is-frame={isFrame ? "true" : "false"}
        data-is-frame-logo={isFrame && withLogo ? "true" : "false"}
        data-is-root-folder={isRootFolder ? "true" : "false"}
      >
        {withLogo ? (
          <NavigationLogo
            burgerLogo={burgerLogo}
            className="navigation-logo drop-box-logo"
          />
        ) : null}
        <ArrowButton
          isRootFolder={isRootFolder}
          onBackToParentFolder={onBackToParentFolder}
        />

        {showTitleInDropBox !== false ? navigationTitleContainerNode : null}

        <ControlButtons
          isDesktop={isDesktop}
          isMobile={currentDeviceType !== DeviceType.desktop}
          isRootFolder={isRootFolder}
          canCreate={canCreate}
          getContextOptionsFolder={getContextOptionsFolder}
          getContextOptionsPlus={getContextOptionsPlus}
          toggleInfoPanel={toggleInfoPanel}
          toggleDropBox={toggleDropBox}
          isInfoPanelVisible={isInfoPanelVisible}
          onCloseDropBox={onCloseDropBox}
          showTitle
          isContextButtonVisible={isContextButtonVisible}
          isPublicRoom={isPublicRoom}
          isPlusButtonVisible={isPlusButtonVisible}
        />
      </div>

      <VariableSizeList
        direction={interfaceDirection}
        height={dropBoxHeight}
        width="auto"
        itemCount={countItems}
        itemSize={getItemSize}
        itemData={[
          navigationItems,
          onClickAvailable,
          { withLogo: !!withLogo, currentDeviceType },
        ]}
        outerElementType={Scrollbar}
      >
        {Row}
      </VariableSizeList>
    </div>
  );
};

DropBox.displayName = "DropBox";

export default React.memo(DropBox);
