import React from "react";
import { RectangleSkeleton } from "../../components/rectangle";

import classNames from "classnames";

import { DeviceType } from "../../enums";
import styles from "./styles/ServicesLoader.module.scss";

type ServicesLoaderProps = {
	currentDeviceType?: DeviceType;
};

const LoaderContainer = () => {
	return (
		<div className={styles.loaderContainer}>
			<div className={styles.topRow}>
				<RectangleSkeleton width="32px" height="32px" />
				<RectangleSkeleton width="28px" height="16px" />
			</div>

			<div className={styles.middleRow}>
				<RectangleSkeleton width="100%" height="16px" />
			</div>

			<div className={styles.longRow}>
				<RectangleSkeleton width="100%" height="16px" />
			</div>

			<div className={styles.bottomRow}>
				<RectangleSkeleton width="111px" height="16px" />
			</div>
		</div>
	);
};

const ServicesLoader: React.FC<ServicesLoaderProps> = ({
	currentDeviceType,
}) => {
	const isMobile = currentDeviceType === DeviceType.mobile;

	const gridClassName = isMobile
		? `${styles.gridContainer} ${styles.gridContainerMobile}`
		: `${styles.gridContainer} ${styles.gridContainerDesktop}`;

	return (
		<div className={styles.loaderWrapper}>
			<div
				className={classNames(styles.firstLoader, {
					[styles.firstMobileLoader]: isMobile,
				})}
			>
				<RectangleSkeleton width="100%" height="20px" />
			</div>
			<div className={gridClassName}>
				<LoaderContainer />
				<LoaderContainer />
				<LoaderContainer />
				<LoaderContainer />
			</div>
		</div>
	);
};

export default ServicesLoader;
