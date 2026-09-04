export enum IconSizeType {
	extraSmall = "extraSmall",
	small = "small",
	medium = "medium",
	big = "big",
	scale = "scale",
}

export const isIconSizeType = (size: unknown): size is IconSizeType => {
	return (
		typeof size === "string" &&
		Object.values(IconSizeType).includes(size as IconSizeType)
	);
};
