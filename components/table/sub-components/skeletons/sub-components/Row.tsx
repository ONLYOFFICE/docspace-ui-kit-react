import React from "react";
import classNames from "classnames";

import {
	RectangleSkeleton,
	RectangleSkeletonProps,
} from "../../../../rectangle";
import styles from "../Table.module.scss";

const TableRow = ({
	id,
	className,
	style,
	isRectangle = true,
	...rest
}: {
	id?: string;
	key?: string;
	className?: string;
	style?: React.CSSProperties;
	isRectangle?: boolean;
} & RectangleSkeletonProps) => {
	const {
		title,
		borderRadius,
		backgroundColor,
		foregroundColor,
		backgroundOpacity,
		foregroundOpacity,
		speed,
		animate,
	} = rest;

	const rowClassName = classNames(
		styles.row,
		{
			[styles.withGap8]: isRectangle,
			[styles.withGap16]: !isRectangle,
		},
		className,
	);

	return (
		<div id={id} className={rowClassName} style={style}>
			<div className={styles.box1}>
				<RectangleSkeleton
					className={styles.rectangleContent}
					title={title}
					width="100%"
					height="100%"
					borderRadius={borderRadius}
					backgroundColor={backgroundColor}
					foregroundColor={foregroundColor}
					backgroundOpacity={backgroundOpacity}
					foregroundOpacity={foregroundOpacity}
					speed={speed}
					animate={animate}
				/>
			</div>
			<div className={styles.box2}>
				<RectangleSkeleton
					className={styles.firstRowContentMobile}
					title={title}
					height="16px"
					borderRadius={borderRadius}
					backgroundColor={backgroundColor}
					foregroundColor={foregroundColor}
					backgroundOpacity={backgroundOpacity}
					foregroundOpacity={foregroundOpacity}
					speed={speed}
					animate={animate}
				/>
				<RectangleSkeleton
					className={styles.secondRowContentMobile}
					title={title}
					height="12px"
					borderRadius={borderRadius}
					backgroundColor={backgroundColor}
					foregroundColor={foregroundColor}
					backgroundOpacity={backgroundOpacity}
					foregroundOpacity={foregroundOpacity}
					speed={speed}
					animate={animate}
				/>
			</div>
			<RectangleSkeleton
				title={title}
				width="16"
				height="16"
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

export default TableRow;
