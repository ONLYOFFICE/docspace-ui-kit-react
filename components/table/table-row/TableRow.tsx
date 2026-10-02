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
