import React from "react";
import equal from "fast-deep-equal/react";

import { Input } from "./sub-components/Input";

import type { TextInputProps } from "./TextInput.types";
import { InputSize } from "./TextInput.enums";
import styles from "./TextInput.module.scss";

export * from "./TextInput.types";
export * from "./TextInput.enums";

const compare = (
	prevProps: Readonly<TextInputProps>,
	nextProps: Readonly<TextInputProps>,
) => {
	return equal(prevProps, nextProps);
};

export const TextInputPure = (props: TextInputProps) => {
	const {
		withBorder = true,
		size = InputSize.base,
		isAutoFocussed,
		hasError,
		hasWarning,
		scale,
		keepCharPositions,
		guide,
		className,
		isBold,
		fontWeight,
		style,
		testId,
		...rest
	} = props;

	const combinedStyle = {
		...style,
		fontWeight: isBold ? 600 : fontWeight,
	};

	return (
		<Input
			{...rest}
			className={`${styles.textInput} ${className || ""}`}
			style={combinedStyle}
			isAutoFocussed={isAutoFocussed}
			guide={guide}
			size={size}
			data-testid={testId ?? "text-input"}
			data-size={size}
			data-error={hasError ? "true" : undefined}
			data-warning={hasWarning ? "true" : undefined}
			data-scale={scale ? "true" : undefined}
			data-without-border={!withBorder ? "true" : undefined}
			data-keep-char-positions={keepCharPositions ? "true" : undefined}
			data-guide={guide ? "true" : undefined}
		/>
	);
};

const TextInput = React.memo(TextInputPure, compare);

TextInput.displayName = "TextInput";

export { TextInput };
