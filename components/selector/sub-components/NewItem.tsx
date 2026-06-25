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

import { AddButton } from "../../add-button";

import NewItemDropDown from "./NewItemDropDown";
import useCreateDropDown from "../hooks/useCreateDropDown";
import type { NewItemProps } from "../Selector.types";

import styles from "../Selector.module.scss";

const NewItem = ({
	label,
	style,
	dropDownItems,
	onCreateClick,
	hotkey,
	inputItemVisible,
	listHeight,
}: NewItemProps) => {
	const { isOpenDropDown, onCloseDropDown, setIsOpenDropDown } =
		useCreateDropDown();

	const onCreateClickAction = React.useCallback(() => {
		if (isOpenDropDown || inputItemVisible) return;
		if (dropDownItems) return setIsOpenDropDown(true);

		onCreateClick?.();
	}, [
		dropDownItems,
		inputItemVisible,
		isOpenDropDown,
		onCreateClick,
		setIsOpenDropDown,
	]);

	React.useEffect(() => {
		if (isOpenDropDown && inputItemVisible) setIsOpenDropDown(false);
	}, [inputItemVisible, isOpenDropDown, setIsOpenDropDown]);

	const onKeyDown = React.useCallback(
		(e: KeyboardEvent) => {
			if (e.key.toLowerCase() === hotkey && e.shiftKey) {
				onCreateClickAction();
			}
		},
		[hotkey, onCreateClickAction],
	);

	React.useEffect(() => {
		if (!hotkey) return;
		window.removeEventListener("keypress", onKeyDown);
		window.addEventListener("keypress", onKeyDown);

		return () => {
			window.removeEventListener("keypress", onKeyDown);
		};
	}, [hotkey, onCreateClickAction, onKeyDown]);

	return (
		<div
			key="create-new-item"
			style={style}
			className={classNames(styles.selectorItem, styles.hoverable)}
			onClick={onCreateClickAction}
		>
			<AddButton
				isAction
				label={label}
				titleText={label}
				fontSize="14px"
				lineHeight="18px"
				noSelect
				dir="auto"
				truncate
			/>
			{isOpenDropDown && dropDownItems && dropDownItems.length > 0 ? (
				<NewItemDropDown
					dropDownItems={dropDownItems}
					onCloseDropDown={onCloseDropDown}
					listHeight={listHeight}
				/>
			) : null}
		</div>
	);
};

export default NewItem;
