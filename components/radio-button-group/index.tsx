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

import React, { useEffect, useLayoutEffect } from "react";
import classNames from "classnames";

import { RadioButton } from "../radio-button";
import { Text } from "../text";

import styles from "./RadioButtonGroup.module.scss";
import {
  RadioButtonGroupProps,
  TRadioButtonOption,
} from "./RadioButtonGroup.types";

const RadioButtonGroup = ({
  id,
  className,
  style,
  orientation = "horizontal",
  width,
  options,
  name,
  selected,
  fontSize,
  fontWeight,
  onClick,
  isDisabled,
  spacing,
  dataTestId,
}: RadioButtonGroupProps) => {
  const [selectedOption, setSelectedOption] = React.useState(selected);
  const radioButtonGroupRef = React.useRef<HTMLDivElement>(null);

  const handleOptionChange = (
    changeEvent: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSelectedOption(changeEvent.target.value);
  };

  useEffect(() => {
    setSelectedOption(selected);
  }, [selected]);

  useLayoutEffect(() => {
    if (!radioButtonGroupRef.current) return;

    if (width) {
      radioButtonGroupRef.current.style.setProperty(
        "--radio-button-group-width",
        width,
      );
    }
  }, [width]);

  return (
    <div
      ref={radioButtonGroupRef}
      id={id}
      className={classNames(
        styles.radioButtonGroup,
        styles[orientation],
        className,
      )}
      style={{ width, ...style }}
      data-testid={dataTestId ?? "radio-button-group"}
    >
      {options.map((option: TRadioButtonOption) => {
        if (option.type === "text")
          return (
            <Text
              key="radio-text"
              className={styles.subtext}
              data-testid={option.dataTestId ?? "radio-button-group_text"}
            >
              {option.label}
            </Text>
          );

        return (
          <RadioButton
            id={option.id}
            key={option.value}
            name={name || ""}
            value={option.value}
            isChecked={`${selectedOption}` === `${option.value}`}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              handleOptionChange(e);
              onClick(e);
            }}
            isDisabled={isDisabled || option.disabled}
            label={option.label}
            fontSize={fontSize}
            fontWeight={fontWeight}
            spacing={spacing}
            orientation={orientation}
            autoFocus={option.autoFocus}
            testId={option.dataTestId || option.id}
          />
        );
      })}
    </div>
  );
};

export { RadioButtonGroup };
