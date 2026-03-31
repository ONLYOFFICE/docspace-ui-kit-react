// (c) Copyright Ascensio System SIA 2009-2026
//
// This program is a free software product.
// You can redistribute it and/or modify it under the terms
// of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
// Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
// to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
// any third-party rights.
//
// This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
// the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
//
// You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
//
// The  interactive user interfaces in modified source and object code versions of the Program must
// display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
//
// Pursuant to Section 7(b) of the License you must retain the original Product logo when
// distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
// trademark law for use of our trademarks.
//
// All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
// content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
// International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode

import React, { useCallback, useRef } from "react";
import classNames from "classnames";

import { flexRender, type Row } from "@tanstack/react-table";

import {
  ContextMenu,
  type ContextMenuRefType,
} from "../context-menu";
import {
  ContextMenuButton,
  ContextMenuButtonDisplayType,
} from "../context-menu-button";
import type { ContextMenuModel } from "../context-menu";
import { TableCell } from "../table/sub-components/table-cell";

import styles from "./TanStackTable.module.scss";

export interface TanStackTableRowProps<TData> {
  /** TanStack Row instance */
  row: Row<TData>;
  /** Context menu options */
  contextOptions?: ContextMenuModel[];
  /** Dynamic context menu model getter */
  getContextModel?: () => ContextMenuModel[];
  /** Called when context menu triggers */
  fileContextClick?: (rightClick?: boolean) => void;
  /** Row click handler */
  onClick?: (e: React.MouseEvent) => void;
  /** Row double-click handler */
  onDoubleClick?: (e: React.MouseEvent) => void;
  /** Whether this row is selected */
  checked?: boolean;
  /** Whether this row is the active/focused row */
  isActive?: boolean;
  /** Additional CSS class */
  className?: string;
  /** data-testid attribute */
  dataTestId?: string;
  /** Children rendered after cells (badges, etc.) */
  children?: React.ReactNode;
}

export function TanStackTableRow<TData>({
  row,
  contextOptions,
  getContextModel,
  fileContextClick,
  onClick,
  onDoubleClick,
  checked,
  isActive,
  className,
  dataTestId = "table-row",
  children,
}: TanStackTableRowProps<TData>) {
  const cm = useRef<ContextMenuRefType>(null);
  const rowRef = useRef<HTMLDivElement | null>(null);

  const onContextMenu = useCallback(
    (e: React.MouseEvent) => {
      fileContextClick?.(e.button === 2);
      if (cm.current && !cm.current?.menuRef.current) {
        rowRef.current?.click();
      }
      if (cm.current) cm.current.show(e);
    },
    [fileContextClick],
  );

  const renderContext =
    contextOptions && contextOptions.length > 0;

  const getOptions = useCallback(() => {
    fileContextClick?.();
    return contextOptions ?? [];
  }, [fileContextClick, contextOptions]);

  const rowClasses = classNames(
    styles.tanstackTableRow,
    "table-container_row",
    "table-row",
    className,
    {
      [styles.isActive]: isActive,
      [styles.checked]: checked,
      checked: checked,
    },
  );

  return (
    <div
      onContextMenu={onContextMenu}
      className={rowClasses}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      data-testid={dataTestId}
    >
      {row.getVisibleCells().map((cell) => (
        <div key={cell.id} className="table-container_cell">
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </div>
      ))}

      {children}

      {renderContext ? (
        <TableCell
          forwardedRef={rowRef}
          className="table-container_row-context-menu-wrapper"
        >
          <ContextMenuButton
            className="table-container_row-context-menu-button"
            getData={getOptions}
            displayType={ContextMenuButtonDisplayType.toggle}
            onClick={onContextMenu}
            testId="context-menu-button"
          />
          <ContextMenu
            ref={cm}
            getContextModel={getContextModel ?? (() => contextOptions ?? [])}
            model={contextOptions ?? []}
          />
        </TableCell>
      ) : null}
    </div>
  );
}
