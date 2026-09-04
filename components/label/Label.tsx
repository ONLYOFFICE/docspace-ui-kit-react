import { Text } from "../text";

import type { LabelProps } from "./Label.types";
import { globalColors } from "../../providers/theme";

const Label = (props: LabelProps) => {
	const {
		isRequired = false,
		error = false,
		title,
		truncate = false,
		isInline = false,
		htmlFor,
		text,
		display,
		className,
		id,
		style,
		children,
	} = props;
	const errorColor = `var(--label-error-color, ${globalColors.lightErrorStatus})`;
	const errorProp = error ? { color: errorColor } : {};

	return (
		<Text
			as="label"
			id={id}
			style={style}
			htmlFor={htmlFor}
			isInline={isInline}
			display={display}
			{...errorProp}
			fontWeight={600}
			truncate={truncate}
			title={title}
			className={className}
			data-testid="label"
			data-truncate={truncate}
			data-inline={isInline}
			data-error={error}
			aria-required={isRequired}
			aria-invalid={error}
		>
			{text}{" "}
			{isRequired ? (
				<span
					style={{
						color: `var(--label-required-color, ${globalColors.lightErrorStatus})`,
					}}
					aria-hidden="true"
					data-testid="required-mark"
				>
					*
				</span>
			) : null}{" "}
			{children}
		</Text>
	);
};

export { Label };
