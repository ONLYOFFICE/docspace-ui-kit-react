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

import React, { useRef } from "react";
import { useCommonTranslation, isMobile } from "../../../utils";
import classNames from "classnames";

import { Checkbox } from "../../checkbox";
import {
  ContextMenuButton,
  ContextMenuButtonDisplayType,
} from "../../context-menu-button";
import { ContextMenu, ContextMenuRefType } from "../../context-menu";
import { hasOwnProperty } from "../../../utils/hasOwnProperty";
import { HeaderType } from "../../context-menu/ContextMenu.types";
import { Loader, LoaderTypes } from "../../loader";

import { BaseTileProps, TileChildProps, ItemProps } from "./BaseTile.types";

import styles from "./BaseTile.module.scss";

export const BaseTile = ({
  checked,
  isActive,
  isBlockingOperation,
  item,
  onSelect,
  getContextModel,
  indeterminate,
  element,
  contextOptions,
  tileContextClick,
  hideContextMenu,
  inProgress,
  showHotkeyBorder,
  isEdit,
  topContent,
  bottomContent,
  onHover,
  onLeave,
  className,
  onRoomClick,
  checkboxContainerRef,
  forwardRef,
  dataTestId,
  badgeUrl,
}: BaseTileProps) => {
  const t = useCommonTranslation();
  const childrenArray = React.Children.toArray(topContent);

  const cmRef = useRef<ContextMenuRefType>(null);

  const renderContext =
    hasOwnProperty(item, "contextOptions") &&
    contextOptions &&
    contextOptions?.length > 0;

  const firstChild = childrenArray[0] as React.ReactElement<TileChildProps>;
  const childItem = React.isValidElement(firstChild)
    ? (firstChild.props as TileChildProps | undefined)?.item
    : undefined;

  const srcItem: ItemProps | undefined = childItem ?? item;

  const contextMenuHeader: HeaderType | undefined = srcItem
    ? {
        title: srcItem.title || srcItem.displayName || "",
        icon: srcItem.icon,
        original: srcItem.logo?.original || "",
        large: srcItem.logo?.large || "",
        medium: srcItem.logo?.medium || "",
        small: srcItem.logo?.small || "",
        color: srcItem.logo?.color,
        cover: srcItem.logo?.cover
          ? typeof srcItem.logo.cover === "string"
            ? {
                data: srcItem.logo.cover,
                id: "",
              }
            : srcItem.logo.cover
          : undefined,
      }
    : undefined;

  const getOptions = () => {
    if (tileContextClick) {
      tileContextClick();
    }
    return contextOptions;
  };

  const changeCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSelect?.(e.target.checked, item);
  };

  const onRoomIconClick = () => {
    if (!isMobile()) return;
    onSelect?.(true, item);
  };

  const onContextMenu = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (tileContextClick) {
      tileContextClick(e.button === 2);
    }

    if (!cmRef.current?.menuRef.current && forwardRef?.current) {
      forwardRef.current.click();
    }

    if (getContextModel && cmRef.current) {
      cmRef.current.show(e);
    }
  };

  const tileClassName = classNames(styles.baseTile, className, {
    [styles.checked]: checked,
    [styles.isActive]: isActive,
    [styles.isBlockingOperation]: isBlockingOperation,
    [styles.showHotkeyBorder]: showHotkeyBorder,
    [styles.isEdit]: isEdit,
  });

  const iconContainerClassNames = classNames(
    styles.iconContainer,
    "iconContainer",
    {
      [styles.inProgress]: inProgress,
    },
  );

  const iconClassNames = classNames(styles.icon, {
    [styles.checked]: checked,
  });

  const checkboxClassNames = classNames(styles.checkbox, "checkbox", {
    [styles.checked]: checked,
  });

  const contentClassNames = classNames(styles.content, "content");

  return (
    <div
      className={tileClassName}
      onClick={onRoomClick}
      onContextMenu={onContextMenu}
      data-testid={dataTestId ?? "tile"}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <div className={styles.topContent}>
        {element && !isEdit ? (
          !inProgress ? (
            <div className={iconContainerClassNames} ref={checkboxContainerRef}>
              <div className={iconClassNames} onClick={onRoomIconClick}>
                {element}
              </div>
              <Checkbox
                isChecked={checked}
                onChange={changeCheckbox}
                className={checkboxClassNames}
                isIndeterminate={indeterminate}
              />
            </div>
          ) : (
            <Loader
              className={styles.loader}
              color=""
              size="20px"
              type={LoaderTypes.track}
            />
          )
        ) : null}

        <div className={contentClassNames}>{topContent}</div>

        <div className={styles.optionButton}>
          {renderContext ? (
            <ContextMenuButton
              isFill
              className={classNames(styles.expandButton, "expandButton")}
              directionX="right"
              getData={getOptions}
              displayType={ContextMenuButtonDisplayType.toggle}
              onClick={(e) => {
                e.stopPropagation();
                onContextMenu(e);
              }}
              title={t("TitleShowFolderActions")}
            />
          ) : (
            <div className="expandButton" />
          )}
          <ContextMenu
            model={contextOptions}
            onHide={hideContextMenu}
            getContextModel={getContextModel}
            ref={cmRef}
            header={contextMenuHeader}
            withBackdrop
            ignoreChangeView={isMobile()}
            headerOnlyMobile
            badgeUrl={badgeUrl}
          />
        </div>
      </div>

      <div className={classNames(styles.bottomContent, "bottomContent")}>
        {bottomContent}
      </div>
    </div>
  );
};
