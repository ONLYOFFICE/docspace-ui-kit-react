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

import { Label } from "../label";
import { HelpButton } from "../help-button";
import { Text } from "../text";

import { FieldContainerProps } from "./FieldContainer.types";
import styles from "./FieldContainer.module.scss";

const displayInlineBlock = { display: "inline-block" };

const FieldContainer = ({
  isVertical,
  maxLabelWidth = "110px",
  className,
  id,
  style,
  errorMessageWidth = "293px",
  removeMargin = false,
  labelVisible = false,
  inlineHelpButton,
  isRequired,
  labelText,
  tooltipMaxWidth,
  tooltipContent,
  tooltipClass,
  place = "bottom",
  hasError,
  children,
  errorMessage,
  errorColor,
  dataTestId,
}: FieldContainerProps) => {
  const containerStyle = {
    ...style,
    "--label-width": maxLabelWidth,
  } as React.CSSProperties;

  const errorContainerStyle = {
    ...style,
    "--error-width": errorMessageWidth,
    "--error-color": errorColor,
  } as React.CSSProperties;

  return (
    <div
      className={classNames(
        styles.container,
        {
          [styles.vertical]: isVertical,
          [styles.horizontal]: !isVertical,
          [styles.noMargin]: removeMargin,
        },
        className,
      )}
      id={id}
      style={containerStyle}
      data-testid={dataTestId ?? "field-container"}
      data-vertical={isVertical}
      data-label-width={maxLabelWidth}
    >
      {labelVisible ? (
        !inlineHelpButton ? (
          <div className={styles.fieldLabelIcon}>
            <Label
              isRequired={isRequired}
              text={labelText}
              truncate
              className={styles.fieldLabel}
              tooltipMaxWidth={tooltipMaxWidth}
              htmlFor=""
            />
            {tooltipContent ? (
              <HelpButton
                className={classNames(styles.iconButton, tooltipClass)}
                tooltipContent={tooltipContent}
                place={place}
                dataTestId={
                  dataTestId ? `${dataTestId}_help_button` : undefined
                }
              />
            ) : null}
          </div>
        ) : (
          <div className={styles.fieldLabelIcon}>
            <Label
              isRequired={isRequired}
              htmlFor=""
              text={labelText}
              truncate
              className={styles.fieldLabel}
            >
              {tooltipContent ? (
                <HelpButton
                  className={classNames(styles.iconButton, tooltipClass)}
                  tooltipContent={tooltipContent}
                  place={place}
                  style={displayInlineBlock}
                  offsetRight={0}
                  dataTestId={
                    dataTestId ? `${dataTestId}_help_button` : undefined
                  }
                />
              ) : null}
            </Label>
          </div>
        )
      ) : null}

      <div className={`${styles.fieldBody} field-body`}>
        {children}
        {hasError && errorMessage ? (
          <Text
            className={styles.errorContainer}
            style={errorContainerStyle}
            fontSize="12px"
            color={errorColor}
          >
            {errorMessage}
          </Text>
        ) : null}
      </div>
    </div>
  );
};

export { FieldContainer };
