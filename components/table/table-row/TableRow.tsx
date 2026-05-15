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

import React, { useCallback, useRef } from "react";
import classNames from "classnames";
import equal from "fast-deep-equal";

import { ContextMenu, ContextMenuRefType } from "../../context-menu";
import {
  ContextMenuButton,
  ContextMenuButtonDisplayType,
} from "../../context-menu-button";
import { hasOwnProperty } from "../../../utils";
import { EMPTY_ARRAY } from "../../../constants";

import { TableCell } from "../sub-components/table-cell";
import { TableRowProps } from "../Table.types";
import styles from "./TableRow.module.scss";

const TableRow = React.memo((props: TableRowProps) => {
  const {
    fileContextClick,
    onHideContextMenu,
    children,
    contextOptions,
    className,
    style,
    selectionProp,
    title,
    getContextModel,
    badgeUrl,
    isIndexEditingMode,
    forwardedRef,
    checked,
    isActive,
    dragging,
    hideColumns,
    onClick,
    onDoubleClick,
    contextMenuCellStyle,
    dataTestId = "table-row",
    contextMenuTestId,
    onMouseEnter,
    onMouseLeave,
  } = props;

  const cm = useRef<ContextMenuRefType>(null);
  const row = useRef<HTMLDivElement | null>(null);

  const onContextMenu = useCallback(
    (e: React.MouseEvent) => {
      fileContextClick?.(e.button === 2);
      if (cm.current && !cm.current?.menuRef.current) {
        row.current?.click();
      }
      if (cm.current) cm.current.show(e);
    },
    [cm, fileContextClick, row],
  );

  const renderContext =
    hasOwnProperty(props, "contextOptions") &&
    contextOptions &&
    contextOptions.length > 0;

  const getOptions = useCallback(() => {
    fileContextClick?.();
    return contextOptions || EMPTY_ARRAY;
  }, [fileContextClick, contextOptions]);

  const tableRowClasses = classNames(
    styles.tableRow,
    className,
    "table-container_row",
    checked ? "checked" : "",
    {
      [styles.isIndexEditingMode]: isIndexEditingMode,
      [styles.isActive]: isActive,
      [styles.checked]: checked,
      [styles.dragging]: dragging,
      [styles.hideColumns]: hideColumns,
    },
  );

  return (
    <div
      onContextMenu={onContextMenu}
      className={tableRowClasses}
      ref={forwardedRef}
      style={style}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      data-testid={dataTestId ?? "table-row"}
    >
      {children}
      {isIndexEditingMode ? null : (
        <div className="context-menu-container">
          <TableCell
            {...selectionProp}
            forwardedRef={row}
            className={classNames(
              selectionProp?.className,
              "table-container_row-context-menu-wrapper",
            )}
            style={contextMenuCellStyle}
          >
            <>
              <ContextMenu
                onHide={onHideContextMenu}
                ref={cm}
                model={contextOptions || []}
                getContextModel={getContextModel}
                withBackdrop
                badgeUrl={badgeUrl}
                dataTestId={contextMenuTestId}
              />
              {renderContext ? (
                <ContextMenuButton
                  isFill
                  className="expandButton"
                  getData={getOptions}
                  directionX="right"
                  displayType={ContextMenuButtonDisplayType.toggle}
                  onClick={onContextMenu}
                  onClose={onHideContextMenu}
                  title={title}
                />
              ) : (
                <div className="expandButton"> </div>
              )}
            </>
          </TableCell>
        </div>
      )}
    </div>
  );
}, equal);

export { TableRow };
