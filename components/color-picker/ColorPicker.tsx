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

import { useState } from "react";
import { HexColorPicker, HexColorInput } from "react-colorful";
import classNames from "classnames";

import CrossIconSvg from "../../assets/icons/16/cross.react.svg";

import { Button, ButtonSize } from "../button";
import { Text } from "../text";
import { IconButton } from "../icon-button";
import { globalColors } from "../../providers/theme";
import { useCommonTranslation } from "../../utils";

import styles from "./ColorPicker.module.scss";
import { ColorPickerProps } from "./ColorPicker.types";

const ColorPicker = ({
  className,
  id,
  onClose = () => {},
  onApply = () => {},
  appliedColor = globalColors.lightBlueMain,
  applyButtonLabel = "Apply",
  cancelButtonLabel = "Cancel",
  isPickerOnly = false,
  handleChange,
  hexCodeLabel = "Hex code",
}: ColorPickerProps) => {
  const t = useCommonTranslation();
  const [color, setColor] = useState(() => appliedColor);

  const onColorChange = (newColor: string) => {
    setColor(newColor);
    if (handleChange) handleChange(newColor);
  };

  return (
    <div
      className={classNames(styles.wrapper, className)}
      id={id}
      data-testid="color-picker"
      role="dialog"
      aria-label="Color picker"
    >
      {isPickerOnly ? (
        <div className={styles.hexHeader}>
          <div className={styles.hexText}>
            <Text
              fontSize="16px"
              lineHeight="22px"
              fontWeight={700}
              truncate
              data-testid="color-picker-title"
            >
              {t("Custom")}
            </Text>
          </div>
          <div className={styles.hexClose}>
            <IconButton
              className={styles.tableHeaderIconButton}
              size={16}
              onClick={onClose}
              iconNode={<CrossIconSvg />}
              isFill
              data-testid="color-picker-close"
              aria-label="Close color picker"
            />
          </div>
        </div>
      ) : null}

      <div className={styles.hexColorPicker} data-testid="color-picker-content">
        <HexColorPicker
          color={color}
          onChange={onColorChange}
          aria-label="Color selector"
        />

        {!isPickerOnly ? (
          <div
            className={styles.hexValueContainer}
            data-testid="color-picker-hex-container"
          >
            <Text
              className={styles.hexValueLabel}
              data-testid="color-picker-hex-label"
            >
              {hexCodeLabel}:
            </Text>
            <HexColorInput
              prefixed
              color={color}
              onChange={onColorChange}
              className={styles.hexValue}
              data-testid="color-picker-hex-input"
              aria-label="Hex color value"
              spellCheck="false"
            />
          </div>
        ) : null}

        {!isPickerOnly ? (
          <div className={styles.hexButton} data-testid="color-picker-buttons">
            <Button
              className={styles.applyButton}
              primary
              scale
              size={ButtonSize.small}
              label={applyButtonLabel}
              onClick={() => onApply(color)}
              testId="color-picker-apply"
              aria-label={applyButtonLabel}
            />
            <Button
              className={styles.cancelButton}
              scale
              size={ButtonSize.small}
              label={cancelButtonLabel}
              onClick={onClose}
              testId="color-picker-cancel"
              aria-label={cancelButtonLabel}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export { ColorPicker };
