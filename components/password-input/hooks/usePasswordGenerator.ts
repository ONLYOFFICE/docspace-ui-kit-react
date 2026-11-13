import { ChangeEvent, MouseEvent, useCallback } from "react";

import { InputType } from "../../text-input";
import { TPasswordSettings, TPasswordState } from "../PasswordInput.types";

import { generatePassword } from "./generatePassword";

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
  const getNewPassword = useCallback(
    () => generatePassword(passwordSettings, generatorSpecial),
    [generatorSpecial, passwordSettings],
  );

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
