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
import { ReactSVG } from "react-svg";
import CrossReactSvgUrl from "../../assets/icons/12/cross.react.svg";
import { IconButton } from "../icon-button";
import { TooltipContainer } from "../tooltip";

import type { SelectedItemProps } from "./SelectedItem.types";
import styles from "./SelectedItem.module.scss";

export type { SelectedItemProps };

export const SelectedItemPure = (props: SelectedItemProps) => {
  const {
    label,
    onClose,
    isDisabled = false,
    onClick,
    isInline = true,
    className,
    id,
    propKey,
    group,
    forwardedRef,
    classNameCloseButton,
    hideCross,
    title,
    dataTestId,
    icon,
    isActive,
  } = props;
  if (!label) return null;

  const onCloseClick = (e: React.MouseEvent) => {
    if (!isDisabled) onClose(propKey, label, group || "", e);
  };

  const handleOnClick = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.target as HTMLElement;

    if (!isDisabled && !target.classList.contains("selected-tag-removed"))
      onClick?.(propKey, label, group, e);
  };

  const selectedItemClassNames = [
    styles.selectedItem,
    isInline && styles.isInline,
    isDisabled && styles.disabled,
    isActive && styles.isActive,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const labelClassNames = [
    styles.label,
    "selected-item_label",
    isDisabled && styles.disabled,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <TooltipContainer
      as="div"
      onClick={handleOnClick}
      className={selectedItemClassNames}
      id={id}
      ref={forwardedRef}
      data-testid={dataTestId ?? "selected-item"}
      title={title}
    >
      {icon ? (
        typeof icon === "string" ? (
          <ReactSVG className={styles.icon} src={icon} />
        ) : (
          <span className={styles.icon}>{React.createElement(icon)}</span>
        )
      ) : null}
      <div className={labelClassNames}>{label}</div>
      {!hideCross ? (
        <IconButton
          className={`selected-tag-removed ${classNameCloseButton}`}
          iconNode={<CrossReactSvgUrl />}
          size={12}
          onClick={onCloseClick}
          isFill
          isDisabled={isDisabled}
        />
      ) : null}
    </TooltipContainer>
  );
};

const SelectedItem = React.memo(SelectedItemPure);

export { SelectedItem };
