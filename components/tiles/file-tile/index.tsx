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

import React, { useRef, useState } from "react";
import { ReactSVG } from "react-svg";
import classNames from "classnames";

import { Checkbox } from "../../checkbox";
import {
  ContextMenuButton,
  ContextMenuButtonDisplayType,
} from "../../context-menu-button";
import { ContextMenu, ContextMenuRefType } from "../../context-menu";
import { HeaderType } from "../../context-menu/ContextMenu.types";
import { Link, LinkType } from "../../link";
import { Loader, LoaderTypes } from "../../loader";

import { useCommonTranslation, isMobile, isTablet } from "../../../utils";
import { hasOwnProperty } from "../../../utils/hasOwnProperty";

import { FileChildProps, FileTileProps } from "./FileTile.types";

import styles from "./FileTile.module.scss";

const svgLoader = () => <div style={{ width: "96px" }} />;

const FileTile = ({
  checked,
  children,
  contextOptions,
  contentElement,
  inProgress,
  item,
  element,
  onSelect,
  setSelection,
  temporaryIcon,
  thumbnail,
  thumbSize,
  isHighlight,
  isBlockingOperation,
  showHotkeyBorder,
  isDragging,
  isActive,
  thumbnailClick,
  withCtrlSelect,
  withShiftSelect,
  tileContextClick,
  getContextModel,
  hideContextMenu,
  badges,
  isEdit,
  forwardRef,
  dataTestId,
  ...rest
}: FileTileProps) => {
  const t = useCommonTranslation();
  const childrenArray = React.Children.toArray(children);
  const [FilesTileContent] = childrenArray;

  const [errorLoadSrc, setErrorLoadSrc] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const cm = useRef<ContextMenuRefType>(null);

  const onHover = () => {
    setIsHovered(true);
  };

  const onLeave = () => {
    setIsHovered(false);
  };

  const renderContext =
    hasOwnProperty(item, "contextOptions") &&
    contextOptions &&
    contextOptions.length > 0;

  const firstChild = childrenArray[0] as React.ReactElement<FileChildProps>;
  const contextMenuHeader: HeaderType | undefined =
    React.isValidElement(firstChild) && firstChild.props?.item
      ? {
          title: firstChild.props.item.title || "",
          icon: firstChild.props.item.icon,
          original: firstChild.props.item.logo?.original || "",
          large: firstChild.props.item.logo?.large || "",
          medium: firstChild.props.item.logo?.medium || "",
          small: firstChild.props.item.logo?.small || "",
          color: firstChild.props.item.logo?.color,
          cover: firstChild.props.item.logo?.cover
            ? typeof firstChild.props.item.logo.cover === "string"
              ? {
                  data: firstChild.props.item.logo.cover,
                  id: "",
                }
              : firstChild.props.item.logo.cover
            : undefined,
        }
      : undefined;

  const getOptions = () => {
    if (tileContextClick) {
      tileContextClick();
    }
    return contextOptions;
  };

  const onContextMenu = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (tileContextClick) {
      tileContextClick(e.button === 2);
    }

    if (!cm.current?.menuRef.current && forwardRef?.current) {
      forwardRef.current.click();
    }

    if (getContextModel && cm.current) {
      cm.current.show(e);
    }
  };

  const onError = () => {
    setErrorLoadSrc(true);
  };

  const getIconFile = () => {
    const icon = item.isPlugin
      ? item.fileTileIcon
      : thumbnail && !errorLoadSrc
        ? thumbnail
        : temporaryIcon;

    const isIconElement = React.isValidElement(icon);

    return (
      <Link type={LinkType.page}>
        {thumbnail && !errorLoadSrc ? (
          thumbSize !== null ? (
            <img
              src={thumbnail}
              className={styles.thumbnailImage}
              alt="Thumbnail-img"
              onError={onError}
              data-testid="file-thumbnail"
            />
          ) : (
            <ReactSVG
              className={styles.temporaryIcon}
              src=""
              loading={svgLoader}
              data-testid="file-thumbnail"
            />
          )
        ) : isIconElement ? (
          <div className={styles.temporaryIcon} data-testid="file-thumbnail">
            {icon}
          </div>
        ) : (
          <ReactSVG
            className={styles.temporaryIcon}
            src={(icon as string) ?? ""}
            loading={svgLoader}
            data-testid="file-thumbnail"
          />
        )}
      </Link>
    );
  };

  const icon = getIconFile();

  const onFileClick = (e: React.MouseEvent) => {
    if (e.ctrlKey || e.metaKey) {
      if (withCtrlSelect) {
        withCtrlSelect(item);
      }
      e.preventDefault();
      return;
    }

    if (e.shiftKey) {
      if (withShiftSelect) {
        withShiftSelect(item);
      }
      e.preventDefault();
      return;
    }

    if (
      e.detail === 1 &&
      !(e.target as HTMLElement).closest(".badges") &&
      !(e.target as HTMLElement).closest(".item-file-name") &&
      !(e.target as HTMLElement).closest(".tag") &&
      !(e.target as HTMLElement).closest(`.${styles.checkbox}`) &&
      !(e.target as HTMLElement).closest(".not-selectable") &&
      !(e.target as HTMLElement).closest(".expandButton") &&
      !(e.target as HTMLElement).closest(".p-contextmenu")
    ) {
      if (
        (e.target as HTMLElement).nodeName !== "IMG" &&
        (e.target as HTMLElement).nodeName !== "INPUT" &&
        (e.target as HTMLElement).nodeName !== "rect" &&
        (e.target as HTMLElement).nodeName !== "path" &&
        (e.target as HTMLElement).nodeName !== "svg"
      ) {
        if (setSelection) {
          setSelection([]);
        }
      }

      if (onSelect) {
        onSelect(!checked, item);
      }
    }
  };

  const onFileIconClick = () => {
    if (!isMobile()) return;

    if (onSelect) {
      onSelect(true, item);
    }
  };

  const onCheckboxClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSelect) {
      onSelect(e.target.checked, item);
    }
  };

  const isImageOrMedia =
    item?.viewAccessibility?.ImageView || item?.viewAccessibility?.MediaView;

  const isTouchDevice =
    typeof window !== "undefined" &&
    ("ontouchstart" in window || navigator.maxTouchPoints > 0);

  const fileTileClassNames = classNames(styles.fileTile, {
    [styles.isBlocked]: isBlockingOperation,
    [styles.showHotkeyBorder]: showHotkeyBorder,
    [styles.isDragging]: isDragging,
    [styles.isActive]: isActive,
    [styles.checked]: checked,
    [styles.isEdit]: isEdit,
    [styles.isTouchDevice]: isTouchDevice || isMobile() || isTablet(),
  });

  const iconClassNames = classNames(styles.icon, {
    [styles.checked]: checked,
  });

  const iconContainerClassNames = classNames(styles.iconContainer, {
    [styles.isDragging]: isDragging,
    [styles.inProgress]: inProgress,
    [styles.checked]: checked,
  });

  const checkboxClassNames = classNames(styles.checkbox, {
    [styles.checked]: checked,
  });

  const fileTileTopClassNames = classNames(styles.fileTileTop, {
    [styles.isImageOrMedia]: isImageOrMedia,
  });

  const fileTileBottomClassNames = classNames(styles.fileTileBottom, {
    [styles.isHighlight]: isHighlight,
  });

  const contentClassNames = classNames(styles.content, "content", {
    [styles.isHovered]: isHovered,
  });

  return (
    <div
      {...rest}
      ref={forwardRef}
      className={fileTileClassNames}
      onContextMenu={onContextMenu}
      onClick={onFileClick}
      data-testid={dataTestId ?? "tile"}
    >
      <div className={fileTileTopClassNames} onClick={thumbnailClick}>
        {icon}
      </div>

      {contentElement ? (
        <div
          className={classNames(styles.icons, styles.isQuickButtons)}
          onMouseEnter={onHover}
          onMouseLeave={onLeave}
        >
          {contentElement}
        </div>
      ) : null}
      <div
        className={classNames(styles.icons, styles.isBadges)}
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
      >
        {badges}
      </div>

      <div className={fileTileBottomClassNames}>
        {element && !isEdit ? (
          !inProgress ? (
            <div
              className={iconContainerClassNames}
              onMouseEnter={onHover}
              onMouseLeave={onLeave}
            >
              <div className={iconClassNames} onClick={onFileIconClick}>
                {element}
              </div>
              <Checkbox
                isChecked={checked}
                onChange={onCheckboxClick}
                className={checkboxClassNames}
              />
            </div>
          ) : (
            <Loader
              className={styles.loader}
              color=""
              size="20px"
              type={LoaderTypes.track}
              data-testid="loader"
            />
          )
        ) : null}

        <div className={contentClassNames}>{FilesTileContent}</div>

        <div
          className={styles.optionButton}
          onMouseEnter={onHover}
          onMouseLeave={onLeave}
        >
          {renderContext ? (
            <ContextMenuButton
              isFill
              className={classNames(styles.expandButton, "expandButton")}
              directionX="left"
              getData={getOptions}
              displayType={ContextMenuButtonDisplayType.toggle}
              onClick={(e) => {
                e.stopPropagation();
                onContextMenu(e);
              }}
              title={t("TitleShowActions")}
            />
          ) : (
            <div className="expandButton" />
          )}
          <ContextMenu
            model={contextOptions}
            onHide={hideContextMenu}
            getContextModel={getContextModel}
            ref={cm}
            header={contextMenuHeader}
            withBackdrop={isMobile()}
          />
        </div>
      </div>
    </div>
  );
};

export { FileTile };
