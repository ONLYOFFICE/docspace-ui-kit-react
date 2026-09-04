import type React from "react";
import classNames from "classnames";

import type { LoaderProps } from "../Loader.types";
import styles from "../Loader.module.scss";

const Track = ({
	ref,
	size,
	color,
	label,
	id,
	style,
	primary,
	isDisabled,
}: LoaderProps) => {
	const loaderClassNames = classNames(styles.loaderTrack, {
		[styles.primary]: primary,
		[styles.base]: !primary,
		[styles.disabled]: isDisabled,
	});

	const customStyle = {
		"--loader-size": size,
		"--loader-color": color,
	} as React.CSSProperties;

	return (
		<svg
			className={loaderClassNames}
			style={{ ...customStyle, ...style }}
			viewBox="-10 -10 220 220"
			xmlns="http://www.w3.org/2000/svg"
			aria-label={label}
			ref={ref}
			data-testid="track-loader"
		>
			<defs>
				<title>track</title>
				<linearGradient
					id={`spinner-color-${id}-1`}
					gradientUnits="objectBoundingBox"
					x1="0"
					y1="0"
					x2="1"
					y2="1"
				>
					<stop offset="0%" stopColor="currentColor" stopOpacity="0" />
					<stop offset="100%" stopColor="currentColor" stopOpacity=".2" />
				</linearGradient>
				<linearGradient
					id={`spinner-color-${id}-2`}
					gradientUnits="objectBoundingBox"
					x1="0"
					y1="0"
					x2="0"
					y2="1"
				>
					<stop offset="0%" stopColor="currentColor" stopOpacity=".2" />
					<stop offset="100%" stopColor="currentColor" stopOpacity=".4" />
				</linearGradient>
				<linearGradient
					id={`spinner-color-${id}-3`}
					gradientUnits="objectBoundingBox"
					x1="1"
					y1="0"
					x2="0"
					y2="1"
				>
					<stop offset="0%" stopColor="currentColor" stopOpacity=".4" />
					<stop offset="100%" stopColor="currentColor" stopOpacity=".6" />
				</linearGradient>
				<linearGradient
					id={`spinner-color-${id}-4`}
					gradientUnits="objectBoundingBox"
					x1="1"
					y1="1"
					x2="0"
					y2="0"
				>
					<stop offset="0%" stopColor="currentColor" stopOpacity=".6" />
					<stop offset="100%" stopColor="currentColor" stopOpacity=".8" />
				</linearGradient>
				<linearGradient
					id={`spinner-color-${id}-5`}
					gradientUnits="objectBoundingBox"
					x1="0"
					y1="1"
					x2="0"
					y2="0"
				>
					<stop offset="0%" stopColor="currentColor" stopOpacity=".8" />
					<stop offset="100%" stopColor="currentColor" stopOpacity="1" />
				</linearGradient>
				<linearGradient
					id={`spinner-color-${id}-6`}
					gradientUnits="objectBoundingBox"
					x1="0"
					y1="1"
					x2="1"
					y2="0"
				>
					<stop offset="0%" stopColor="currentColor" stopOpacity="1" />
					<stop offset="100%" stopColor="currentColor" stopOpacity="1" />
				</linearGradient>
			</defs>
			<g
				fill="none"
				strokeWidth="40"
				transform="translate(100,100) scale(0.75)"
			>
				<path
					d="M 0,-100 A 100,100 0 0,1 86.6,-50"
					stroke={`url(#spinner-color-${id}-1)`}
				>
					<animateTransform
						from="0 0 0"
						to="360 0 0"
						attributeName="transform"
						type="rotate"
						repeatCount="indefinite"
						dur="1300ms"
					/>
				</path>
				<path
					d="M 86.6,-50 A 100,100 0 0,1 86.6,50"
					stroke={`url(#spinner-color-${id}-2)`}
				>
					<animateTransform
						from="0 0 0"
						to="360 0 0"
						attributeName="transform"
						type="rotate"
						repeatCount="indefinite"
						dur="1300ms"
					/>
				</path>
				<path
					d="M 86.6,50 A 100,100 0 0,1 0,100"
					stroke={`url(#spinner-color-${id}-3)`}
				>
					<animateTransform
						from="0 0 0"
						to="360 0 0"
						attributeName="transform"
						type="rotate"
						repeatCount="indefinite"
						dur="1300ms"
					/>
				</path>
				<path
					d="M 0,100 A 100,100 0 0,1 -86.6,50"
					stroke={`url(#spinner-color-${id}-4)`}
				>
					<animateTransform
						from="0 0 0"
						to="360 0 0"
						attributeName="transform"
						type="rotate"
						repeatCount="indefinite"
						dur="1300ms"
					/>
				</path>
				<path
					d="M -86.6,50 A 100,100 0 0,1 -86.6,-50"
					stroke={`url(#spinner-color-${id}-5)`}
				>
					<animateTransform
						from="0 0 0"
						to="360 0 0"
						attributeName="transform"
						type="rotate"
						repeatCount="indefinite"
						dur="1300ms"
					/>
				</path>
				<path
					d="M -86.6,-50 A 100,100 0 0,1 0,-100"
					stroke={`url(#spinner-color-${id}-6)`}
				>
					<animateTransform
						from="0 0 0"
						to="360 0 0"
						attributeName="transform"
						type="rotate"
						repeatCount="indefinite"
						dur="1300ms"
					/>
				</path>
			</g>
		</svg>
	);
};

Track.displayName = "Track";

export { Track };
