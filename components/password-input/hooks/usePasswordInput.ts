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

import { useCallback, useState, useEffect, ChangeEvent } from "react";

import { InputType } from "../../text-input";
import { TPasswordState } from "../PasswordInput.types";

export const usePasswordInput = (
  isSimulateType: boolean,
  simulateSymbol: string,
  simpleView: boolean,
  type: InputType.text | InputType.password,
  checkPassword: (
    value: string,
    setState: React.Dispatch<React.SetStateAction<TPasswordState>>,
  ) => void,
  setState: React.Dispatch<React.SetStateAction<TPasswordState>>,
  onChange?: (e: ChangeEvent<HTMLInputElement>, value?: string) => void,
  valueInput?: string,
) => {
  const [caretPosition, setCaretPosition] = useState<number | null>(null);

  const setPasswordSettings = useCallback(
    (newPassword: string) => {
      let newValue;

      if (!valueInput) return newPassword;

      const oldPassword = valueInput ?? "";
      const oldPasswordLength = oldPassword.length;
      const newCaretPosition = (
        document.getElementById("conversion-password") as HTMLInputElement
      )?.selectionStart;

      setCaretPosition(newCaretPosition);
      const newCharactersUntilCaret = newPassword.substring(
        0,
        newCaretPosition ?? undefined,
      );

      const unchangedStartCharacters = newCharactersUntilCaret
        .split("")
        .filter((el) => el === simulateSymbol).length;

      const unchangedEndingCharacters = newCaretPosition
        ? newPassword.substring(newCaretPosition).length
        : 0;
      const addedCharacters = newCharactersUntilCaret.substring(
        unchangedStartCharacters,
      );

      const startingPartOldPassword = oldPassword.substring(
        0,
        unchangedStartCharacters,
      );
      const countOfCharacters = oldPasswordLength - unchangedEndingCharacters;
      const endingPartOldPassword = oldPassword.substring(countOfCharacters);

      newValue = startingPartOldPassword + addedCharacters;

      if (unchangedEndingCharacters) {
        newValue += endingPartOldPassword;
      }

      return newValue;
    },
    [simulateSymbol, valueInput],
  );

  const onChangeAction = useCallback(
    (e: ChangeEvent<HTMLInputElement>, isGenerated?: boolean) => {
      let { value } = e.target;
      if (isSimulateType && !isGenerated) {
        value = setPasswordSettings(e.target.value);
      }

      onChange?.(e, value);

      if (simpleView) {
        setState((s) => ({
          ...s,
          value,
        }));
        return;
      }

      checkPassword(value, setState);
    },
    [
      isSimulateType,
      onChange,
      simpleView,
      checkPassword,
      setState,
      setPasswordSettings,
    ],
  );

  useEffect(() => {
    if (caretPosition && isSimulateType && type === InputType.password) {
      const input = document.getElementById(
        "conversion-password",
      ) as HTMLInputElement;
      input?.setSelectionRange(caretPosition, caretPosition);
    }
  }, [caretPosition, isSimulateType, type]);

  return {
    caretPosition,
    setCaretPosition,
    setPasswordSettings,
    onChangeAction,
  };
};
