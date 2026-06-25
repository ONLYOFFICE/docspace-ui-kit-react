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

import { ButtonSize, Button } from "../button";
import { ComboBox, TOption } from "../combobox";

import { PagingProps } from "./Paging.types";
import styles from "./Paging.module.scss";

const Paging = (props: PagingProps) => {
  const {
    previousLabel,
    nextLabel,
    previousAction,
    nextAction,
    pageItems,
    countItems,
    openDirection,
    disablePrevious = false,
    disableNext = false,
    selectedPageItem,
    selectedCountItem,
    id,
    className,
    style,
    showCountItem = true,
    onSelectPage,
    onSelectCount,
    dataTestId,
  } = props;

  const onSelectPageAction = (option: TOption) => {
    onSelectPage?.(option);
  };

  const onSelectCountAction = (option: TOption) => {
    onSelectCount?.(option);
  };

  const setDropDownMaxHeight =
    pageItems && pageItems.length > 6 ? { dropDownMaxHeight: 200 } : {};

  return (
    <div
      data-testid={dataTestId ?? "paging"}
      id={id}
      className={classNames(styles.paging, className)}
      style={style}
    >
      <div className={styles.leftButtonsContainer}>
        <Button
          className={classNames(styles.prevButton, "not-selectable")}
          size={ButtonSize.small}
          scale
          label={previousLabel}
          onClick={previousAction}
          isDisabled={disablePrevious}
          testId="paging_previous_button"
        />
        {pageItems ? (
          <div className={styles.page}>
            <ComboBox
              isDisabled={disablePrevious ? disableNext : false}
              className={styles.manualWidth}
              directionY={openDirection}
              options={pageItems}
              onSelect={onSelectPageAction}
              scaledOptions={pageItems.length < 6}
              selectedOption={selectedPageItem}
              dataTestId="paging_page_items_combobox"
              {...setDropDownMaxHeight}
            />
          </div>
        ) : null}
        <Button
          className={classNames(styles.nextButton, "not-selectable")}
          size={ButtonSize.small}
          scale
          label={nextLabel}
          onClick={nextAction}
          isDisabled={disableNext}
          testId="paging_next_button"
        />
      </div>
      {showCountItem
        ? countItems && (
            <div className={styles.onPage}>
              <ComboBox
                className={styles.hideDisabled}
                directionY={openDirection}
                directionX="right"
                options={countItems}
                scaledOptions
                onSelect={onSelectCountAction}
                selectedOption={selectedCountItem}
                dataTestId="paging_count_items_combobox"
              />
            </div>
          )
        : null}
    </div>
  );
};

export { Paging };
