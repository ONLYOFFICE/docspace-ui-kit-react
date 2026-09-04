import type React from "react";

import classNames from "classnames";

import styles from "./Rombs.module.scss";

const Rombs = ({ size = "40px" }: { size?: string }) => {
	const style = {
		"--loader-size": size,
	} as React.CSSProperties;

	return (
		<>
			<div
				data-testid="rombs-loader"
				className={classNames(styles.rombsLoader, styles.blue)}
				style={style}
			/>

			<div
				className={classNames(styles.rombsLoader, styles.green)}
				style={style}
			/>

			<div
				className={classNames(styles.rombsLoader, styles.red)}
				style={style}
			/>
		</>
	);
};

export { Rombs };
