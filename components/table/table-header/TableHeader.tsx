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

import classNames from "classnames";

import { TableHeaderProps } from "../Table.types";
import styles from "./TableHeader.module.scss";
import { TableHeaderCell } from "../sub-components/table-header-cell";
import { TableSettings } from "../sub-components/table-settings";
import { TooltipContainer } from "../../tooltip";
import { useInterfaceDirection } from "../../../context/InterfaceDirectionContext";
import { useTableHeaderPosition } from "./hooks/use-table-header-position";
import { useTableHeaderResize } from "./hooks/use-table-header-resize";
import { getNextColumn } from "./TableHeader.utils";

export const TableHeader = (props: TableHeaderProps) => {
  const {
    columns,
    sortBy,
    sorted,
    isLengthenHeader,
    sortingVisible = true,
    infoPanelVisible = false,
    showSettings = true,
    tagRef,
    settingsTitle,
    isIndexEditingMode: isIndexEditingModeProp,
    columnStorageName,
    columnInfoPanelStorageName,
    containerRef,
    useReactWindow = false,
    resetColumnsSize,
    setHideColumns: setHideColumnsProp,
    withoutWideColumn = false,
  } = props;

  const { isRTL } = useInterfaceDirection();

  const { hideColumns, onPointerDown, headerRef } = useTableHeaderResize({
    columns,
    infoPanelVisible: infoPanelVisible ?? false,
    columnStorageName,
    columnInfoPanelStorageName,
    containerRef,
    useReactWindow: useReactWindow ?? false,
    resetColumnsSize,
    setHideColumnsProp,
    withoutWideColumn: withoutWideColumn ?? false,
    isIndexEditingMode: isIndexEditingModeProp,
    isRTL,
    sortBy,
    sorted,
  });

  useTableHeaderPosition(headerRef);

  return (
    <>
      <div
        id="table-container_caption-header"
        className={classNames(styles.tableHeader, "table-container_header", {
          "lengthen-header": isLengthenHeader,
        })}
        ref={headerRef}
        data-testid="table-header"
      >
        <div className={styles.tableHeaderRow}>
          {columns.map((column, index) => {
            const nextColumn = getNextColumn(columns, index, hideColumns);
            const resizable = nextColumn ? nextColumn.resizable : false;

            return (
              <TableHeaderCell
                key={column.key ?? "empty-cell"}
                index={index}
                column={column}
                sorted={sorted || false}
                sortBy={sortBy || ""}
                resizable={resizable}
                defaultSize={column.defaultSize}
                onPointerDown={onPointerDown}
                sortingVisible={sortingVisible || false}
                tagRef={tagRef}
                testId={`column-${column.key}`}
              />
            );
          })}

          {showSettings ? (
            <TooltipContainer
              as="div"
              data-testid="settings-block"
              className={styles.tableHeaderSettings}
              title={settingsTitle}
            >
              <TableSettings
                columns={columns}
                disableSettings={hideColumns || Boolean(isIndexEditingModeProp)}
              />
            </TooltipContainer>
          ) : null}
        </div>
      </div>

      <div className={styles.emptyTableContainer} />
    </>
  );
};
