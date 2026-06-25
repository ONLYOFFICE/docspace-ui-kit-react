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

import React, { use } from "react";

import { Avatar, AvatarRole, AvatarSize } from "../../avatar";
import { Text } from "../../text";
import { Checkbox } from "../../checkbox";

import { SelectAllContext } from "../contexts/SelectAll";
import styles from "../Selector.module.scss";
import type { SelectAllProps } from "../Selector.types";

const SelectAll = React.memo(
	({ show, isLoading, rowLoader }: SelectAllProps) => {
		const {
			selectAllIcon,
			selectAllLabel,
			isAllChecked,
			isAllIndeterminate,
			onSelectAll,
		} = use(SelectAllContext);

		if (!show) return null;

		if (isLoading) return rowLoader;

		const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
			if (e.target instanceof HTMLElement && e.target.closest(".checkbox"))
				return;

			onSelectAll?.();
		};

		return (
			<div className={styles.selectAll} onClick={onClick}>
				<Avatar
					className={styles.avatar}
					source={selectAllIcon ?? ""}
					role={AvatarRole.user}
					size={AvatarSize.min}
				/>

				<Text
					className={styles.label}
					fontWeight={600}
					fontSize="14px"
					noSelect
					truncate
				>
					{selectAllLabel}
				</Text>

				<Checkbox
					className={styles.checkbox}
					isChecked={isAllChecked}
					isIndeterminate={isAllIndeterminate}
				/>
			</div>
		);
	},
);

SelectAll.displayName = "SelectAll";

export { SelectAll };
