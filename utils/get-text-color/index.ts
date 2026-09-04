import hexRgb from "hex-rgb";
import { globalColors } from "../../providers/theme";

const HEX_COLOR_REGEX = /^#?(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

export const getTextColor = (color: string, brightnessDiff: number = 128) => {
	const { black } = globalColors;
	const { white } = globalColors;

	if (!color || !HEX_COLOR_REGEX.test(color)) return white;

	const rgba = hexRgb(color);

	const r = rgba.red;
	const g = rgba.green;
	const b = rgba.blue;

	const textColor =
		(r * 299 + g * 587 + b * 114) / 1000 > brightnessDiff ? black : white;

	return textColor;
};
