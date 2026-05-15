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

import React from "react";
import classNames from "classnames";
import equal from "fast-deep-equal/react";

import { TableCellProps } from "../../Table.types";
import styles from "./TableCell.module.scss";

const TableCell = React.memo((props: TableCellProps) => {
  const {
    className,
    forwardedRef,
    style,
    checked,
    hasAccess,
    children,
    value,
    dataTestId,
    documentTitle,
  } = props;

  const classes = classNames(
    styles.tableCell,
    className,
    "table-container_cell",
    {
      [styles.checked]: checked,
      [styles.hasAccess]: hasAccess,
    },
  );

  const cellTestId = dataTestId ?? "table-cell";

  return (
    <div
      data-testid={cellTestId}
      className={classes}
      ref={forwardedRef}
      style={style}
      // @ts-expect-error: value used by DnD and maybe somewhere else;
      // TODO: Refactor logic to use data-value
      value={value}
      data-document-title={documentTitle}
    >
      {children}
    </div>
  );
}, equal);

export { TableCell };
