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

import { ChangeEvent, MouseEvent, useCallback } from "react";

import { InputType } from "../../text-input";
import { TPasswordSettings, TPasswordState } from "../PasswordInput.types";

const CHARACTER_SETS = {
  LOWERCASE: "abcdefghijklmnopqrstuvwxyz",
  NUMBERS: "0123456789",
} as {
  LOWERCASE: string;
  NUMBERS: string;
};

export const usePasswordGenerator = (
  generatorSpecial: string,
  passwordSettings: TPasswordSettings,
  isDisabled: boolean,
  type: InputType.text | InputType.password,
  onChangeAction: (
    e: ChangeEvent<HTMLInputElement>,
    isGenerated?: boolean,
  ) => void,
  checkPassword: (
    value: string,
    setState: React.Dispatch<React.SetStateAction<TPasswordState>>,
  ) => void,
  setState: React.Dispatch<React.SetStateAction<TPasswordState>>,
) => {
  const generateRandomChar = useCallback((charset: string): string => {
    const randomIndex = Math.floor(Math.random() * charset.length);
    return charset.charAt(randomIndex);
  }, []);

  const getNewPassword = useCallback(() => {
    const length = passwordSettings?.minLength || 8;
    const chars: string[] = [];

    // Add required character types based on settings
    if (passwordSettings?.upperCase) {
      chars.push(generateRandomChar(CHARACTER_SETS.LOWERCASE).toUpperCase());
    }
    if (passwordSettings?.digits) {
      chars.push(generateRandomChar(CHARACTER_SETS.NUMBERS));
    }
    if (passwordSettings?.specSymbols && generatorSpecial) {
      chars.push(generateRandomChar(generatorSpecial));
    }

    // Fill remaining length with random characters
    while (chars.length < length) {
      const charTypes = [CHARACTER_SETS.LOWERCASE];

      if (passwordSettings?.upperCase) {
        charTypes.push(CHARACTER_SETS.LOWERCASE.toUpperCase());
      }
      if (passwordSettings?.digits) {
        charTypes.push(CHARACTER_SETS.NUMBERS);
      }
      if (passwordSettings?.specSymbols && generatorSpecial) {
        charTypes.push(generatorSpecial);
      }

      const randomCharSet =
        charTypes[Math.floor(Math.random() * charTypes.length)];
      chars.push(generateRandomChar(randomCharSet));
    }

    // Shuffle the array to ensure randomness
    return chars
      .sort(() => Math.random() - 0.5)
      .join("")
      .slice(0, length);
  }, [
    generateRandomChar,
    generatorSpecial,
    passwordSettings?.digits,
    passwordSettings?.minLength,
    passwordSettings?.specSymbols,
    passwordSettings?.upperCase,
  ]);

  const onGeneratePassword = useCallback(
    (e: MouseEvent) => {
      if (isDisabled) {
        e.preventDefault();
        return;
      }

      const newPassword = getNewPassword();

      if (type !== InputType.text) {
        setState((s) => ({
          ...s,
          type: InputType.text,
        }));
      }

      checkPassword(newPassword, setState);
      onChangeAction(
        {
          target: { value: newPassword },
        } as ChangeEvent<HTMLInputElement>,
        true,
      );
    },
    [checkPassword, getNewPassword, isDisabled, onChangeAction, setState, type],
  );

  return { onGeneratePassword };
};
