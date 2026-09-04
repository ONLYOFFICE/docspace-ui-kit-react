import React from "react";

import { RectangleSkeleton } from "../../../rectangle";
import { FilterLoaderProps } from "./FilterLoader.types";
import styles from "./FilterLoader.module.scss";

const FilterLoader = ({ id, className, style, ...rest }: FilterLoaderProps) => {
	const {
		title,
		height,
		borderRadius,
		backgroundColor,
		foregroundColor,
		backgroundOpacity,
		foregroundOpacity,
		speed,
		animate,
	} = rest;

	return (
		<div
			id={id}
			className={`${styles.filterLoader} ${className || ""}`}
			style={style}
			data-testid="filter-loader"
		>
			<RectangleSkeleton
				title={title}
				height={height}
				borderRadius={borderRadius}
				backgroundColor={backgroundColor}
				foregroundColor={foregroundColor}
				backgroundOpacity={backgroundOpacity}
				foregroundOpacity={foregroundOpacity}
				speed={speed}
				animate={animate}
			/>
			<RectangleSkeleton
				title={title}
				height={height}
				borderRadius={borderRadius}
				backgroundColor={backgroundColor}
				foregroundColor={foregroundColor}
				backgroundOpacity={backgroundOpacity}
				foregroundOpacity={foregroundOpacity}
				speed={speed}
				animate={animate}
			/>
		</div>
	);
};

export { FilterLoader };
export default FilterLoader;
