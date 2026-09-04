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
