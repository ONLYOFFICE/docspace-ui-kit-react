"use client";

import classNames from "classnames";

import { ContextMenu } from "../../../context-menu";
import {
  ContextMenuButton,
  ContextMenuButtonDisplayType,
} from "../../../context-menu-button";

import { useDataTableRowContext } from "../../DataTable.context";
import styles from "../../DataTable.module.scss";

/**
 * The menu of the row it sits in, with the button that opens it. The row
 * opens the same menu on a right-click. The button is drawn only while the
 * row's `contextMenu` has options; an empty `expandButton` keeps its place
 * otherwise, as in the old table.
 */
export const RowContextMenu = ({
  buttonTestId = "data-table-context-menu-button",
}: {
  /** Value of `data-testid` on the menu button. */
  buttonTestId?: string;
}) => {
  const row = useDataTableRowContext();
  if (!row) return null;

  const { contextMenu, menuRef, anchorRef, openMenu } = row;
  const options = contextMenu?.options;

  return (
    <div ref={anchorRef} className={styles.contextMenu}>
      <ContextMenu
        ref={menuRef}
        model={options ?? []}
        getContextModel={contextMenu?.getModel}
        onHide={contextMenu?.onClose}
        badgeUrl={contextMenu?.badgeUrl}
        dataTestId={contextMenu?.testId}
        withBackdrop
      />
      {options && options.length > 0 ? (
        <ContextMenuButton
          isFill
          className="expandButton"
          getData={() => options}
          directionX="right"
          displayType={ContextMenuButtonDisplayType.toggle}
          onClick={openMenu}
          onClose={contextMenu?.onClose}
          title={contextMenu?.title}
          testId={buttonTestId}
        />
      ) : (
        <div className={classNames(styles.contextMenuSpacer, "expandButton")} />
      )}
    </div>
  );
};
