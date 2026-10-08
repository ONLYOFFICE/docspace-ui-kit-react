import { Button as ButtonBase } from "./Button";
import { withTooltip } from "../tooltip";
export type { ButtonProps } from "./Button.types";
export { ButtonSize } from "./Button.enums";

const Button = withTooltip(ButtonBase);

export { Button };
