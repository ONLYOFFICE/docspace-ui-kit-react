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
import type { ChangeEvent } from "react";

import classNames from "classnames";

import CheckboxIndeterminateIcon from "../../assets/checkbox.indeterminate.react.svg";
import CheckboxCheckedIcon from "../../assets/checkbox.checked.react.svg";
import CheckboxIcon from "../../assets/checkbox.react.svg";

import { Text } from "../text";
import { TooltipContainer } from "../tooltip";

import type { CheckboxProps } from "./Checkbox.types";
import styles from "./Checkbox.module.scss";

export * from "./Checkbox.types";

const RenderCheckboxIcon = React.memo(
	({
		isChecked,
		isIndeterminate,
		tabIndex,
	}: {
		isChecked: boolean;
		isIndeterminate: boolean;
		tabIndex: number;
	}) => {
		return isIndeterminate ? (
			<CheckboxIndeterminateIcon
				tabIndex={tabIndex}
				className={classNames(styles.checkbox, "not-selectable")}
			/>
		) : isChecked ? (
			<CheckboxCheckedIcon
				tabIndex={tabIndex}
				className={classNames(styles.checkbox, "not-selectable")}
			/>
		) : (
			<CheckboxIcon
				tabIndex={tabIndex}
				className={classNames(styles.checkbox, "not-selectable")}
			/>
		);
	},
);

const CheckboxPure = ({
	id,
	className,
	style,
	label,
	value,
	title,
	truncate = false,
	hasError = false,
	onChange,
	isChecked = false,
	isIndeterminate = false,
	isDisabled,
	name,
	tabIndex = -1,
	helpButton,
	dataTestId,
	...rest
}: CheckboxProps) => {
	const [checked, setChecked] = React.useState(isChecked);
	const ref = React.useRef<HTMLInputElement | null>(null);
	const prevProps = React.useRef({
		indeterminate: false,
		prevChecked: isChecked,
	});

	React.useEffect(() => {
		if (prevProps.current.indeterminate !== isIndeterminate && ref.current) {
			prevProps.current.indeterminate = isIndeterminate || false;
			ref.current.indeterminate = isIndeterminate || false;
		}
		if (prevProps.current.prevChecked !== isChecked) {
			setChecked(isChecked);

			prevProps.current.prevChecked = isChecked;
		}
	}, [isIndeterminate, isChecked]);

	const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (isDisabled) e.preventDefault();
		e.stopPropagation();

		setChecked(e.target.checked);
		onChange?.(e);
	};

	const onClick = (e: React.MouseEvent<HTMLSpanElement>) => {
		return e.preventDefault();
	};

	return (
		<TooltipContainer
			as="label"
			id={id}
			style={style}
			className={classNames(styles.label, className, {
				[styles.disabled]: isDisabled,
				[styles.indeterminate]: isIndeterminate,
				[styles.error]: hasError,
			})}
			title={title}
			data-testid={dataTestId ?? "checkbox"}
		>
			<input
				className={styles.hiddenInput}
				name={name}
				type="checkbox"
				checked={checked}
				disabled={isDisabled}
				ref={ref}
				value={value}
				onChange={onInputChange}
				tabIndex={-1}
				{...rest}
			/>
			<RenderCheckboxIcon
				tabIndex={tabIndex || 0}
				isChecked={checked || false}
				isIndeterminate={isIndeterminate || false}
			/>
			<div className={`${styles.wrapper} wrapper`}>
				{label ? (
					<Text
						as="span"
						title={title}
						truncate={truncate}
						className={`${styles.checkboxText} checkbox-text`}
						lineHeight="16px"
					>
						{label}
					</Text>
				) : null}
				{helpButton ? (
					<span
						className={`${styles.helpButton} help-button`}
						onClick={onClick}
						data-testid="checkbox-help-button"
					>
						{helpButton}
					</span>
				) : null}
			</div>
		</TooltipContainer>
	);
};

CheckboxPure.displayName = "CheckboxPure";

const Checkbox = React.memo(CheckboxPure);

export { Checkbox };
