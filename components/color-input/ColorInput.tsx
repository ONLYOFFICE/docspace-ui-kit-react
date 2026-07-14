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

import { useState } from "react";
import { HexColorInput } from "react-colorful";
import classNames from "classnames";

import { DropDownItem } from "../drop-down-item";
import { DropDown } from "../drop-down";

import { ColorInputProps } from "./ColorInput.types";
import { ColorPicker } from "../color-picker";
import { globalColors } from "../../providers/theme";
import styles from "./ColorInput.module.scss";

const ColorInput = ({
	className,
	id,
	handleChange,
	defaultColor,
	size,
	scale,
	isDisabled,
	hasError,
	hasWarning,
	dataTestId,
}: ColorInputProps) => {
	const [color, setColor] = useState(
		defaultColor || globalColors.lightBlueMain,
	);
	const [isPickerOpen, setIsPickerOpen] = useState(false);

	const closePicker = () => setIsPickerOpen(false);
	const togglePicker = () => setIsPickerOpen((isOpen) => !isOpen);

	const onChange = (value: string) => {
		handleChange?.(value);
		setColor(value);
	};

	const colorBlockStyles = {
		"--block-color": color,
	} as React.CSSProperties;

	return (
		<div
			data-testid={dataTestId ?? "color-input"}
			className={classNames(styles.wrapper, className)}
			id={id}
		>
			<div
				className={classNames(styles.inputWrapper, { [styles.scale]: scale })}
			>
				<HexColorInput
					className={styles.hexValue}
					prefixed
					color={color.toUpperCase()}
					onChange={onChange}
					data-size={size}
					data-error={hasError ? "true" : undefined}
					data-warning={hasWarning ? "true" : undefined}
					data-scale={scale ? "true" : undefined}
					data-disabled={isDisabled ? "true" : undefined}
					disabled={isDisabled}
				/>
				<span
					className={classNames(styles.colorBlock, {
						[styles.disabled]: isDisabled,
					})}
					style={colorBlockStyles}
					onClick={togglePicker}
				/>
			</div>

			<DropDown
				manualY="48px"
				withBackdrop
				isDefaultMode={false}
				open={isPickerOpen}
				clickOutsideAction={closePicker}
			>
				<DropDownItem
					className={classNames(styles.dropDownItemHex, "drop-down-item-hex")}
				>
					<ColorPicker
						appliedColor={color}
						handleChange={onChange}
						isPickerOnly
						onClose={closePicker}
					/>
				</DropDownItem>
			</DropDown>
		</div>
	);
};

export { ColorInput };
