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