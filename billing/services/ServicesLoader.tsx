/*
 * Copyright (C) Ascensio System SIA, 2009-2026
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation, together with the
 * additional terms provided in the LICENSE file.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For
 * details, see the GNU AGPL at: https://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA by email at info@onlyoffice.com
 * or by postal mail at 20A-6 Ernesta Birznieka-Upisha Street, Riga,
 * LV-1050, Latvia, European Union.
 *
 * The interactive user interfaces in modified versions of the Program
 * are required to display Appropriate Legal Notices in accordance with
 * Section 5 of the GNU AGPL version 3.
 *
 * No trademark rights are granted under this License.
 *
 * All non-code elements of the Product, including illustrations,
 * icon sets, and technical writing content, are licensed under the
 * Creative Commons Attribution-ShareAlike 4.0 International License:
 * https://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 * This license applies only to such non-code elements and does not
 * modify or replace the licensing terms applicable to the Program's
 * source code, which remains licensed under the GNU Affero General
 * Public License v3.
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

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
