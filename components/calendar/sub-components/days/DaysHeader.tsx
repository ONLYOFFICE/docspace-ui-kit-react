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
import { HeaderButtons } from "../header-buttons/HeaderButtons";
import { DaysHeaderProps } from "../../Calendar.types";
import styles from "../../Calendar.module.scss";
import {
  subtractFromDate,
  addToDate,
  endOf,
  startOf,
  formatDate,
} from "../../../../utils/date";

export const DaysHeader = ({
  observedDate,
  setObservedDate,
  setSelectedScene,
  minDate,
  maxDate,
  isMobile,
  locale,
}: DaysHeaderProps) => {
  const onTitleClick = () =>
    setSelectedScene((prevSelectedScene) => prevSelectedScene + 1);

  const onLeftClick = () =>
    setObservedDate(
      (prevObservedDate) => subtractFromDate(prevObservedDate, 1, "months")!,
    );

  const onRightClick = () =>
    setObservedDate(
      (prevObservedDate) => addToDate(prevObservedDate, 1, "months")!,
    );

  const isLeftDisabled =
    endOf(subtractFromDate(observedDate, 1, "months")!, "month")! < minDate;
  const isRightDisabled =
    startOf(addToDate(observedDate, 1, "months")!, "month")! > maxDate;

  const monthName = formatDate(observedDate, "MMMM", { locale });

  return (
    <div className={styles.headerContainer}>
      <h2
        onClick={onTitleClick}
        className={classNames(styles.title, "days-header")}
      >
        {monthName.charAt(0).toUpperCase() + monthName.substring(1)}{" "}
        {formatDate(observedDate, "yyyy", { locale })}
        <span className={styles.headerActionIcon} />
      </h2>
      <HeaderButtons
        onLeftClick={onLeftClick}
        onRightClick={onRightClick}
        isLeftDisabled={isLeftDisabled}
        isRightDisabled={isRightDisabled}
        isMobile={isMobile}
      />
    </div>
  );
};
