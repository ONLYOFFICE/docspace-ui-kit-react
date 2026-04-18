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
                disableSettings={
                  (infoPanelVisible || hideColumns || isIndexEditingModeProp) ??
                  false
                }
              />
            </TooltipContainer>
          ) : null}
        </div>
      </div>

      <div className={styles.emptyTableContainer} />
    </>
  );
};
