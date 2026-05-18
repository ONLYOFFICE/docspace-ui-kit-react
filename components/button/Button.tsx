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

import type React from "react";
import classNames from "classnames";
import { Loader, LoaderTypes } from "../loader";
import { Tooltip, withTooltip } from "../tooltip";
import type { ButtonProps } from "./Button.types";
import { ButtonSize } from "./Button.enums";
import styles from "./Button.module.scss";

const Button = (props: React.PropsWithChildren<ButtonProps>) => {
  const {
    ref,
    label,
    primary,
    size = ButtonSize.normal,
    scale,
    icon,
    isDisabled,
    isLoading,
    isHovered,
    isClicked,
    className,
    testId = "button",
    type,
    id,
    minWidth,
    filled,
    filledStroke,
    accent,
    style,
    tooltipText,
    ...rest
  } = props;

  const buttonClasses = classNames(
    styles.button,
    {
      [styles.primary]: primary,
      [styles.scale]: scale,
      [styles[size]]: size,
      [styles.filled]: filled,
      [styles.filledStroke]: filledStroke,
      [styles.accent]: accent,
      [styles.isLoading]: isLoading,
      [styles.isHovered]: isHovered,
      [styles.isClicked]: isClicked,
      [styles.isDisabled]: isDisabled,
    },
    className,
  );

  const contentClasses = classNames(styles.buttonContent, {
    [styles.loading]: isLoading,
    "button-content": true,
  });

  const buttonStyle = minWidth ? { ...style, minWidth } : style;

  const tooltipId = tooltipText ? (id ?? "button-tooltip") : undefined;

  return (
    <>
      <button
        {...rest}
        id={id}
        ref={ref as React.Ref<HTMLButtonElement>}
        type={type === "submit" ? "submit" : "button"}
        className={buttonClasses}
        disabled={isDisabled || isLoading}
        data-testid={testId}
        data-size={size}
        aria-label={label}
        aria-disabled={isDisabled ? "true" : undefined}
        aria-busy={isLoading ? "true" : undefined}
        style={buttonStyle}
        data-tooltip-id={tooltipId}
        data-tooltip-content={tooltipText}
      >
        {isLoading ? (
          <Loader
            id={id}
            className={classNames(styles.loader, "loader", {
              [styles.primary]: primary,
            })}
            size="20px"
            type={LoaderTypes.track}
            label={label}
            primary={primary}
            isDisabled={isDisabled}
          />
        ) : null}
        <div className={contentClasses}>
          {icon ? (
            <div className={classNames(styles.icon, "icon")}>{icon}</div>
          ) : null}
          <span>{label}</span>
        </div>
      </button>
      {tooltipText ? (
        <Tooltip id={tooltipId} place="bottom" offset={10} float />
      ) : null}
    </>
  );
};

Button.displayName = "Button";

const ButtonWithTooltip = withTooltip(Button);
export { ButtonWithTooltip as Button };