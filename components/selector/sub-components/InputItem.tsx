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

import AcceptIconReactSvg from "../../../assets/selector.input.accept.react.svg";
import CancelIconReactSvg from "../../../assets/selector.input.cancel.react.svg";

import { InputSize, InputType, TextInput } from "../../text-input";
import { IconButton } from "../../icon-button";
import { RoomIcon } from "../../room-icon";
import { RoomLogo } from "../../room-logo";
import { Loader, LoaderTypes } from "../../loader";

import styles from "../Selector.module.scss";
import type { InputItemProps } from "../Selector.types";

const InputItem = ({
	defaultInputValue,
	onAcceptInput,
	onCancelInput,
	style,

	color,
	icon,
	cover,
	roomType,

	placeholder,

	setInputItemVisible,
	setSavedInputValue,
}: InputItemProps) => {
	const [value, setValue] = React.useState(defaultInputValue);
	const [isLoading, setIsLoading] = React.useState(false);

	const requestRunning = React.useRef<boolean>(false);
	const canceled = React.useRef<boolean>(false);
	const inputRef = React.useRef<HTMLInputElement | null>(null);

	const onAcceptInputAction = React.useCallback(async () => {
		if (requestRunning.current || !value) return;
		setSavedInputValue(null);
		setIsLoading(true);
		requestRunning.current = true;

		await onAcceptInput(value);

		canceled.current = true;
		requestRunning.current = false;
		setIsLoading(false);
	}, [onAcceptInput, setSavedInputValue, value]);

	const onCancelInputAction = React.useCallback(() => {
		canceled.current = true;
		setSavedInputValue(null);
		onCancelInput();
	}, [onCancelInput, setSavedInputValue]);

	React.useEffect(() => {
		setInputItemVisible(true);

		return () => {
			setInputItemVisible(false);
		};
	}, [setInputItemVisible]);

	React.useEffect(() => {
		return () => {
			if (!canceled.current) setSavedInputValue(value);
		};
	}, [setSavedInputValue, value]);

	React.useEffect(() => {
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Enter") onAcceptInputAction();
			else if (e.key === "Escape") onCancelInputAction();
		};

		window.addEventListener("keydown", onKeyDown);

		return () => {
			window.removeEventListener("keydown", onKeyDown);
		};
	}, [onAcceptInputAction, onCancelInputAction]);

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newVal = e.target.value;

		setValue(newVal);
	};

	React.useEffect(() => {
		if (inputRef.current) {
			inputRef.current.focus();
			inputRef.current.select();
		}
	}, []);

	return (
		<div
			key="input-item"
			className={classNames(styles.selectorItem, {
				[styles.withIcon]: icon || color || roomType || cover,
			})}
			style={style}
		>
			{cover ? (
				<RoomIcon
					color={color}
					title={value}
					logo={{ cover, large: "", original: "", small: "", medium: "" }}
					showDefault={false}
					className={styles.itemLogo}
				/>
			) : color ? (
				<RoomIcon
					color={color}
					title={value}
					showDefault
					className={styles.itemLogo}
				/>
			) : roomType ? (
				<RoomLogo className={styles.roomLogoContainer} type={roomType} />
			) : icon ? (
				typeof icon === "string" ? (
					<RoomIcon
						title={value}
						className={styles.itemLogo}
						imgClassName={styles.roomlogo}
						logo={icon}
						showDefault={false}
					/>
				) : (
					<div className={styles.itemLogo}>{icon}</div>
				)
			) : null}
			<TextInput
				value={value}
				size={InputSize.base}
				type={InputType.text}
				onChange={onChange}
				forwardedRef={inputRef}
				placeholder={placeholder}
				isDisabled={isLoading}
				testId="selector_input_item"
			/>
			<div
				className={classNames(styles.inputWrapper, {
					[styles.loading]: isLoading,
				})}
				onClick={onAcceptInputAction}
			>
				{isLoading ? (
					<Loader type={LoaderTypes.track} size="16px" />
				) : (
					<IconButton
						iconNode={<AcceptIconReactSvg />}
						size={16}
						dataTestId="selector_new_item_accept"
					/>
				)}
			</div>
			<div
				className={classNames(styles.inputWrapper, {
					[styles.loading]: isLoading,
				})}
				onClick={onCancelInputAction}
			>
				<IconButton
					iconNode={<CancelIconReactSvg />}
					size={16}
					isDisabled={isLoading}
					dataTestId="selector_new_item_cancel"
				/>
			</div>
		</div>
	);
};

export default InputItem;
