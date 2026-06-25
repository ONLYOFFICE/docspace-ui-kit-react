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

import type React from "react";

import styles from "../Loader.module.scss";

export const DualRing = ({
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
			viewBox="0 0 100 100"
			xmlns="http://www.w3.org/2000/svg"
			aria-label={label}
			data-testid="dual-ring-loader"
		>
			<title>dual ring</title>

			<circle
				cx="50"
				cy="50"
				ng-attr-r="{{config.radius}}"
				ng-attr-stroke-width="{{config.width}}"
				ng-attr-stroke="{{config.c1}}"
				ng-attr-stroke-dasharray="{{config.dasharray}}"
				fill="none"
				strokeLinecap="round"
				r="40"
				strokeWidth="8"
				stroke={color}
				strokeDasharray="62.83185307179586 62.83185307179586"
				transform="rotate(32.3864 50 50)"
			>
				<animateTransform
					attributeName="transform"
					type="rotate"
					calcMode="linear"
					values="0 50 50;360 50 50"
					keyTimes="0;1"
					dur="1.1s"
					begin="0s"
					repeatCount="indefinite"
				/>
			</circle>
			<circle
				cx="50"
				cy="50"
				ng-attr-r="{{config.radius2}}"
				ng-attr-stroke-width="{{config.width}}"
				ng-attr-stroke="{{config.c2}}"
				ng-attr-stroke-dasharray="{{config.dasharray2}}"
				ng-attr-stroke-dashoffset="{{config.dashoffset2}}"
				fill="none"
				strokeLinecap="round"
				r="20"
				strokeWidth="4"
				stroke={color}
				strokeDasharray="29.845130209103033 29.845130209103033"
				strokeDashoffset="29.845130209103033"
				transform="rotate(-360 -8.10878e-8 -8.10878e-8)"
			>
				<animateTransform
					attributeName="transform"
					type="rotate"
					calcMode="linear"
					values="0 50 50;-360 50 50"
					keyTimes="0;1"
					dur="1.1s"
					begin="0s"
					repeatCount="indefinite"
				/>
			</circle>
		</svg>
	);
};
