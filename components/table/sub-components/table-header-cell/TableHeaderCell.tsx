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

import SortDescReactSvgUrl from "../../../../assets/sort.desc.react.svg";

import { Checkbox } from "../../../checkbox";
import { Text } from "../../../text";
import { IconButton } from "../../../icon-button";
import { globalColors } from "../../../../providers/theme";

import { TableHeaderCellProps } from "../../Table.types";
import styles from "./TableHeaderCell.module.scss";

const TableHeaderCell = ({
	column,
	index,
	onMouseDown,
	resizable,
	sortBy,
	sorted,
	defaultSize,
	sortingVisible,
	tagRef,
	testId = "table-header-cell",
}: TableHeaderCellProps) => {
	const {
		title,
		enable,
		active,
		minWidth,
		withTagRef,
		default: isDefault,
		checkbox,
		isShort,
	} = column;

	const isActive = (sortBy && column.sortBy === sortBy) || active;

	const onClick = (e: React.MouseEvent) => {
		e.stopPropagation();

		if (!sortingVisible) return;
		column.onClick?.(column.sortBy || "", e);
	};

	const onIconClick = (e: React.MouseEvent) => {
		if (!sortingVisible) return;
		column.onIconClick?.();
		e.stopPropagation();
	};

	const classes = classNames(
		styles.tableHeaderCell,
		"table-container_header-cell",
		{
			[styles.isActive]: isActive,
			[styles.sorted]: sorted,
			[styles.isShort]: isShort,
			[styles.showIcon]: !!column.onClick,
			[styles.sortingVisible]: sortingVisible,
		},
	);

	return (
		<div
			className={classes}
			id={`column_${index}`}
			data-enable={enable}
			data-default={isDefault}
			data-short-colum={isShort}
			data-min-width={minWidth}
			data-default-size={defaultSize}
			ref={withTagRef ? tagRef : null}
			data-testid={testId}
		>
			<div className={styles.tableHeaderItem}>
				<div className={styles.textWrapper} onClick={onClick}>
					{checkbox && (checkbox.isIndeterminate || checkbox.value) ? (
						<Checkbox
							onChange={checkbox.onChange}
							isChecked={checkbox.value}
							isIndeterminate={checkbox.isIndeterminate}
						/>
					) : null}

					<Text
						fontWeight={600}
						className={classNames(styles.text, "header-container-text")}
					>
						{enable ? title : ""}
					</Text>

					{sortingVisible ? (
						<IconButton
							onClick={column.onIconClick ? onIconClick : onClick}
							iconNode={<SortDescReactSvgUrl />}
							className={styles.sortIcon}
							size={12}
							color={globalColors.gray}
							dataTestId="sort-icon"
						/>
					) : null}
				</div>
				{resizable ? (
					<div
						data-column={`${index}`}
						className={classNames(styles.resizeHandle, "not-selectable")}
						onMouseDown={onMouseDown}
						data-testid="resize-handle"
					/>
				) : null}
			</div>
		</div>
	);
};

export { TableHeaderCell };