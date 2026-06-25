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

import RadioButtonReactSvg from "../../assets/radiobutton.react.svg";
import RadioButtonCheckedReactSvg from "../../assets/radiobutton.checked.react.svg";

import { IconSizeType } from "../../utils";

import { Text } from "../text";

import styles from "./RadioButton.module.scss";
import { RadioButtonProps } from "./RadioButton.types";

const RadiobuttonIcon = ({ isChecked }: { isChecked?: boolean }) => {
  const newProps = {
    "data-size": IconSizeType.medium,
    className: styles.radioButtonIcon,
  };

  return !isChecked ? (
    <RadioButtonReactSvg {...newProps} />
  ) : (
    <RadioButtonCheckedReactSvg {...newProps} />
  );
};

const RadioButton = ({
  isChecked,
  classNameInput,
  name,
  value,
  onChange,
  onClick,
  orientation = "vertical",
  spacing,
  isDisabled,
  id,
  className,
  style,
  fontSize,
  fontWeight,
  label,
  autoFocus,
  testId = "radio-button",
}: RadioButtonProps) => {
  const [isCheckedState, setIsCheckedState] = React.useState(isChecked);
  const labelRef = React.useRef<HTMLLabelElement>(null);

  React.useEffect(() => {
    setIsCheckedState(isChecked);
  }, [isChecked]);

  const onChangeAction = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsCheckedState((s) => !s);
    onClick?.(e);
  };

  return (
    <label
      id={id}
      ref={labelRef}
      className={classNames(styles.label, className, {
        [styles.disabled]: isDisabled,
        [styles.orientationVertical]: orientation === "vertical",
        [styles.orientationHorizontal]: orientation === "horizontal",
        [styles.spacing]: spacing,
      })}
      data-spacing={spacing}
      style={{
        ...style,
        ["--radio-button-spacing" as string]: spacing,
      }}
      data-testid={testId}
    >
      <input
        className={classNames(styles.input, classNameInput)}
        type="radio"
        name={name}
        value={value}
        checked={isCheckedState}
        onChange={onChange || onChangeAction}
        disabled={isDisabled}
        autoFocus={autoFocus}
      />
      <RadiobuttonIcon isChecked={isCheckedState} />
      <Text
        as="span"
        className={classNames(styles.radioButtonText, "radio-button_text")}
        fontSize={fontSize}
        fontWeight={fontWeight}
      >
        {label || value}
      </Text>
    </label>
  );
};

export { RadioButton };
