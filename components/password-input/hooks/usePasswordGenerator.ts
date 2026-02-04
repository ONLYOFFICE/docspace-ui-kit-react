// (c) Copyright Ascensio System SIA 2009-2026
//
// This program is a free software product.
// You can redistribute it and/or modify it under the terms
// of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
// Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
// to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
// any third-party rights.
//
// This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
// the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
//
// You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
//
// The  interactive user interfaces in modified source and object code versions of the Program must
// display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
//
// Pursuant to Section 7(b) of the License you must retain the original Product logo when
// distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
// trademark law for use of our trademarks.
//
// All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
// content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
// International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode

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
