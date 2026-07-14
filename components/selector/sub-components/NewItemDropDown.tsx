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

import { Portal } from "../../portal";

import { isMobile as isMobileUtils } from "../../../utils";
import { Backdrop } from "../../backdrop";

import { Scrollbar } from "../../scrollbar";

import styles from "../Selector.module.scss";
import type { NewItemDropDownProps } from "../Selector.types";

export const DROPDOWN_CLASS_NAME = "selector-create-new-dropdown";

const DROPDOWN_CONTAINER_WITH_PADDING = 560;
const PADDING = 80;

const NewItemDropDown = ({
	dropDownItems,
	isEmpty,
	onCloseDropDown,
	listHeight,
}: NewItemDropDownProps) => {
	const [isMobile, setIsMobile] = React.useState(
		isMobileUtils(window.innerWidth),
	);

	React.useEffect(() => {
		window.addEventListener("mouseup", onCloseDropDown);

		return () => {
			window.removeEventListener("mouseup", onCloseDropDown);
		};
	}, [onCloseDropDown]);

	React.useEffect(() => {
		const onResize = () => {
			if (isMobileUtils(window.innerWidth)) return setIsMobile(true);

			setIsMobile(false);
		};

		onResize();

		window.addEventListener("resize", onResize);

		return () => {
			window.removeEventListener("resize", onResize);
		};
	}, []);

	const dropDown =
		dropDownItems.length > 0 ? (
			<div
				className={classNames(
					styles.createDropDown,
					{ [styles.isEmpty]: isEmpty },
					DROPDOWN_CLASS_NAME,
				)}
			>
				{listHeight && listHeight < DROPDOWN_CONTAINER_WITH_PADDING ? (
					<Scrollbar style={{ height: listHeight - PADDING }}>
						{dropDownItems.map((item) => item)}
					</Scrollbar>
				) : (
					dropDownItems.map((item) => item)
				)}
			</div>
		) : null;

	const portal =
		dropDownItems.length > 0 ? (
			<Portal
				visible
				element={
					<>
						<Backdrop
							visible
							onClick={() => onCloseDropDown()}
							withBackground
							isAside
							zIndex={450}
						/>
						<div
							className={classNames(
								styles.createDropDown,
								{ [styles.isEmpty]: isEmpty },
								DROPDOWN_CLASS_NAME,
							)}
						>
							{dropDownItems.map((item) => item)}
						</div>
					</>
				}
			/>
		) : null;

	return isMobile ? portal : dropDown;
};

export default NewItemDropDown;
