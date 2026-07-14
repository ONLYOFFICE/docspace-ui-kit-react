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
	sanitizeValue?: (value: string) => string,
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

			if (sanitizeValue) {
				value = sanitizeValue(value);
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
			sanitizeValue,
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
