import type React from "react";

import styles from "../Loader.module.scss";

export const Oval = ({
	size,
	color,
	label,
}: {
	size?: string;
	color?: string;
	label?: string;
}) => {
	const style = {
		"--loader-size": size,
		"--loader-color": color,
	} as React.CSSProperties;

	return (
		<svg
			className={styles.loader}
			style={style}
			viewBox="0 0 38 38"
			xmlns="http://www.w3.org/2000/svg"
			aria-label={label}
			data-testid="oval-loader"
		>
			<g fill="none" fillRule="evenodd">
				<g transform="translate(1 1)" strokeWidth="2">
					<title>oval</title>

					<circle strokeOpacity=".5" cx="18" cy="18" r="18" />
					<path d="M36 18c0-9.94-8.06-18-18-18">
						<animateTransform
							attributeName="transform"
							type="rotate"
							from="0 18 18"
							to="360 18 18"
							dur="1s"
							repeatCount="indefinite"
						/>
					</path>
				</g>
			</g>
		</svg>
	);
};
