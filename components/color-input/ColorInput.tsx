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
