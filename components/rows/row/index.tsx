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

"use client";

import equal from "fast-deep-equal";
import classNames from "classnames";
import React, { useRef } from "react";
import { isMobile } from "react-device-detect"; // TODO: isDesktop=true for IOS(Firefox & Safari)

import { VDRIndexingAction } from "../../../enums";
import { isMobile as isMobileUtils } from "../../../utils/device";

import { Checkbox } from "../../checkbox";
import {
  ContextMenuButton,
  ContextMenuButtonDisplayType,
} from "../../context-menu-button";
import { ContextMenu, ContextMenuRefType } from "../../context-menu";
import { Loader, LoaderTypes } from "../../loader";
import { IndexIconButtons } from "./sub-components/index-icon-buttons";

import { RowProps } from "./Row.types";
import { hasOwnProperty } from "../../../utils";
import styles from "./Row.module.scss";

const Row = React.memo((props: RowProps) => {
  const {
    checked,
    children,
    contentElement,
    contextButtonSpacerWidth = "26px",
    data,
    element,
    indeterminate,
    onSelect,
    onRowClick,
    onContextClick,
    onChangeIndex,

    getContextModel,
    isRoom,
    withoutBorder = false,
    contextTitle,
    badgesComponent,
    isArchive,
    mode = "default",
    inProgress,
    rowContextClose,
    className,
    badgeUrl,
    isDisabled,
    isIndexEditingMode,
    dataTestId,
  } = props;

  const cm = useRef<ContextMenuRefType>(null);
  const row = useRef<null | HTMLDivElement>(null);

  const renderCheckbox = hasOwnProperty(props, "checked");

  const renderElement = hasOwnProperty(props, "element");

  const renderContentElement = hasOwnProperty(props, "contentElement");

  const contextData = data?.contextOptions ? data : props;

  const renderContext =
    hasOwnProperty(contextData, "contextOptions") &&
    contextData &&
    contextData.contextOptions &&
    contextData.contextOptions.length > 0;

  const changeCheckbox = () => {
    onSelect?.(!checked, data);
  };

  const getOptions = () => {
    onContextClick?.();
    return contextData.contextOptions || [];
  };

  const onContextMenu = (e: React.MouseEvent) => {
    onContextClick?.(e.button === 2);
    if (!cm.current?.menuRef.current) {
      if (row.current) row.current.click(); // TODO: need fix context menu to global
    }
    if (cm.current) cm.current.show(e);
  };

  let contextMenuHeader;
  if (React.isValidElement(children) && children.props.item) {
    const coverValue = children.props.item.logo?.cover;
    let coverObject;

    // Handle both string and object types for cover
    if (coverValue) {
      if (typeof coverValue === "string") {
        // If cover is a string, create an ICover object with the string as data
        coverObject = {
          data: coverValue,
          id: "",
        };
      } else if (typeof coverValue === "object") {
        // If cover is already an object with data and id
        coverObject = coverValue;
      }
    }

    contextMenuHeader = {
      icon: children.props.item.icon,
      avatar: children.props.item.avatar,
      title: children.props.item.title
        ? children.props.item.title
        : children.props.item.displayName || "",
      color: children.props.item.logo?.color,
      logo: children.props.item.logo?.medium,
      cover: coverObject,
      original: "",
      large: "",
      medium: "",
      small: "",
    };
  }

  const onElementClick = () => {
    if (!isMobile) return;

    onSelect?.(true, data);
  };

  const changeIndex = (
    e: React.MouseEvent<HTMLElement>,
    action: VDRIndexingAction,
  ) => {
    e.stopPropagation();
    onChangeIndex?.(action);
  };

  return (
    <div
      ref={row}
      onContextMenu={onContextMenu}
      className={classNames(
        styles.row,
        checked ? "checked" : "",
        {
          [styles.withoutBorder]: withoutBorder,
          [styles.modern]: mode === "modern",
          [styles.checked]: checked,
          [styles.mobile]: isMobile,
        },
        className,
      )}
      data-testid={dataTestId ?? "row"}
    >
      {inProgress ? (
        <Loader
          className={classNames(
            styles.rowProgressLoader,
            "row-progress-loader",
          )}
          color=""
          size="20px"
          type={LoaderTypes.track}
        />
      ) : (
        <>
          {mode === "default" && renderCheckbox ? (
            <div
              className={classNames(
                styles.checkboxElement,
                { [styles.isIndexEditingMode]: isIndexEditingMode },
                "not-selectable",
              )}
            >
              <Checkbox
                className="checkbox"
                isChecked={checked}
                isIndeterminate={indeterminate}
                onChange={changeCheckbox}
                isDisabled={isDisabled}
              />
            </div>
          ) : null}
          {mode === "modern" && renderCheckbox && renderElement ? (
            <div
              className={classNames(
                styles.checkboxElement,
                {
                  [styles.isIndexEditingMode]: isIndexEditingMode,
                  [styles.modern]: mode === "modern",
                  [styles.checked]: checked,
                },
                "not-selectable styled-checkbox-container",
              )}
            >
              <div
                onClick={onElementClick}
                className={classNames(styles.element, "styled-element")}
              >
                {element}
              </div>
              <Checkbox
                className={classNames(styles.checkbox, "checkbox")}
                isChecked={checked}
                isIndeterminate={indeterminate}
                onChange={changeCheckbox}
                isDisabled={isDisabled}
              />
            </div>
          ) : null}

          {mode === "default" && renderElement ? (
            <div
              onClick={onRowClick}
              className={classNames(styles.element, "styled-element")}
            >
              {element}
            </div>
          ) : null}
        </>
      )}

      <div
        className={classNames(styles.content, "row_content")}
        onClick={onRowClick}
      >
        {children}
      </div>
      <div
        className={classNames(styles.optionButton, "row_context-menu-wrapper")}
        style={{ ["--manual-width" as string]: contextButtonSpacerWidth }}
      >
        {badgesComponent || null}
        {renderContentElement ? (
          <div className={styles.contentElement}>{contentElement}</div>
        ) : null}
        {isIndexEditingMode ? (
          <IndexIconButtons
            onUpIndexClick={(e: React.MouseEvent<HTMLElement>) =>
              changeIndex(e, VDRIndexingAction.HigherIndex)
            }
            onDownIndexClick={(e: React.MouseEvent<HTMLElement>) =>
              changeIndex(e, VDRIndexingAction.LowerIndex)
            }
          />
        ) : (
          <>
            {renderContext ? (
              <ContextMenuButton
                isFill
                className="expandButton"
                getData={getOptions}
                directionX="right"
                displayType={ContextMenuButtonDisplayType.toggle}
                onClick={onContextMenu}
                title={contextTitle}
              />
            ) : (
              <div className="expandButton"> </div>
            )}
            <ContextMenu
              getContextModel={getContextModel}
              model={contextData.contextOptions || []}
              ref={cm}
              header={contextMenuHeader}
              withBackdrop={isMobileUtils()}
              onHide={rowContextClose}
              isRoom={isRoom}
              isArchive={isArchive}
              badgeUrl={badgeUrl}
            />
          </>
        )}
      </div>
    </div>
  );
}, equal);

export { Row };
