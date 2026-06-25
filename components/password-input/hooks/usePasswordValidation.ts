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

import { useCallback } from "react";
import {
  TPasswordSettings,
  TPasswordState,
  TPasswordValidation,
} from "../PasswordInput.types";

export const usePasswordValidation = (
  passwordSettings: TPasswordSettings,
  onValidateInput?: (
    progressScore: boolean,
    passwordValidation: TPasswordValidation,
  ) => void,
) => {
  const testStrength = useCallback(
    (value: string): TPasswordValidation => {
      if (!passwordSettings) return {} as TPasswordValidation;

      const capitalRegExp = new RegExp(
        passwordSettings.upperCaseRegexStr || "",
      );
      const digitalRegExp = new RegExp(passwordSettings.digitsRegexStr || "");
      const specSymbolsRegExp = new RegExp(
        passwordSettings.specSymbolsRegexStr || "",
      );

      let capital = true;
      let digits = true;
      let special = true;
      let allowed = true;
      let length = true;

      if (passwordSettings.upperCase) {
        capital = capitalRegExp.test(value);
      }

      if (passwordSettings.digits) {
        digits = digitalRegExp.test(value);
      }

      if (passwordSettings.specSymbols) {
        special = specSymbolsRegExp.test(value);
      }

      if (passwordSettings.allowedCharactersRegexStr) {
        const allowedRegExp = new RegExp(
          `^${passwordSettings.allowedCharactersRegexStr}{1,}$`,
        );
        allowed = allowedRegExp.test(value);
      }

      if (passwordSettings?.minLength !== undefined) {
        length = value.trim().length >= passwordSettings.minLength;
      }

      return {
        allowed,
        digits,
        capital,
        special,
        length,
      };
    },
    [passwordSettings],
  );

  const checkPassword = useCallback(
    (
      value: string,
      setState: React.Dispatch<React.SetStateAction<TPasswordState>>,
    ) => {
      const passwordValidation = testStrength(value);
      const progressScore = Object.values(passwordValidation).every(Boolean);

      onValidateInput?.(progressScore, passwordValidation);

      setState((s: TPasswordState) => ({
        ...s,
        value,
        validLength: passwordValidation.length || false,
        validDigits: passwordValidation.digits || false,
        validCapital: passwordValidation.capital || false,
        validSpecial: passwordValidation.special || false,
      }));
    },
    [onValidateInput, testStrength],
  );

  return { testStrength, checkPassword };
};
