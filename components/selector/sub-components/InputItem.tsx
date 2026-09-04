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
