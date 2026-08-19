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

import React, { useCallback, useState } from "react";
import classNames from "classnames";

import { TextInput } from "../text-input";
import { IconButton } from "../icon-button";

import { InputBlockProps } from "./InputBlock.types";
import styles from "./InputBlock.module.scss";

const InputBlock = React.memo(
  ({
    // Input props
    id,
    name,
    type,
    value = "",
    placeholder,
    tabIndex = -1,
    maxLength = 255,
    autoComplete = "off",
    mask,
    keepCharPositions = false,

    // State props
    hasError = false,
    hasWarning = false,
    isDisabled = false,
    isReadOnly,
    isAutoFocussed,
    scale = false,

    // Icon props
    iconName = "",
    iconNode,
    iconSize,
    iconColor,
    hoverColor,
    iconButtonClassName = "",
    isIconFill = false,
    noIcon = false,

    // Event handlers
    onChange,
    onIconClick,
    onBlur,
    onFocus,
    onKeyDown,
    onClick,

    // Style props
    size,
    className,
    style,

    // Other props
    children,
    forwardedRef,
    testId,
    dataTestId,
  }: InputBlockProps) => {
    const [isFocus, setIsFocus] = useState(isAutoFocussed);

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => onChange?.(e),
      [onChange],
    );

    const handleIconClick = useCallback(
      (e: React.MouseEvent) => onIconClick?.(e),
      [onIconClick],
    );

    const handleFocus = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocus(true);
        onFocus?.(e);
      },
      [onFocus],
    );

    const handleBlur = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocus(false);
        onBlur?.(e);
      },
      [onBlur],
    );

    const inputProps = {
      id,
      type,
      name,
      value,
      placeholder,
      maxLength,
      autoComplete,
      mask,
      keepCharPositions,
      isDisabled,
      hasError,
      hasWarning,
      isReadOnly,
      isAutoFocussed,
      scale,
      size,
      withBorder: false,
      forwardedRef,
      onClick,
      onBlur: handleBlur,
      onFocus: handleFocus,
      onKeyDown,
      tabIndex,
      onChange: handleChange,
      testId,
    };

    const inputGroupClassName = classNames(styles.inputGroup, className, {
      [styles.error]: hasError,
      [styles.warning]: hasWarning,
      [styles.disabled]: isDisabled,
    });

    return (
      <div
        className={inputGroupClassName}
        style={style}
        data-testid={dataTestId || "input-block"}
        data-size={size}
        data-scale={scale}
        data-error={hasError}
        data-focus={isFocus}
        data-warning={hasWarning}
        data-disabled={isDisabled}
      >
        {children ? (
          <div className={styles.prepend}>
            <div className={styles.childrenBlock}>{children}</div>
          </div>
        ) : null}

        <TextInput {...inputProps} />

        {!noIcon && !isDisabled ? (
          <div className="append">
            <div
              className={`${styles.iconBlock} ${iconButtonClassName} input-block-icon`}
              onClick={handleIconClick}
              data-size={size}
            >
              <IconButton
                size={iconSize || size}
                iconNode={iconNode}
                iconName={iconName}
                className="input-block-icon"
                isFill={isIconFill}
                isClickable={typeof onIconClick === "function"}
                color={iconColor}
                isDisabled={typeof onIconClick !== "function"}
                hoverColor={hoverColor}
              />
            </div>
          </div>
        ) : null}
      </div>
    );
  },
);

InputBlock.displayName = "InputBlock";

export { InputBlock };
export type { InputBlockProps };
