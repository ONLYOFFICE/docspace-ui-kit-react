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

import { useEffect, useState } from "react";

import { ComboBox, ComboBoxSize, type TOption } from "../../combobox";
import type { AccessSelectorProps, TAccessRight } from "../Selector.types";
import { isMobile } from "../../../utils";
import { AccessRightSelect } from "../../access-right-select";
import { SelectorAccessRightsMode } from "../Selector.enums";
import styles from "../Selector.module.scss";

const SELECTOR_PADDINGS = 32;

const AccessSelector = (props: AccessSelectorProps) => {
	const {
		onAccessRightsChange,
		accessRights,
		selectedAccessRight,
		footerRef,
		accessRightsMode = SelectorAccessRightsMode.Compact,
	} = props;

	const [width, setWidth] = useState(0);

	const isMobileView = isMobile();

	const onSelect = (opt?: TOption) =>
		onAccessRightsChange?.({ ...opt } as TAccessRight);

	useEffect(() => {
		const footerWidth = footerRef?.current?.offsetWidth;
		if (!footerWidth) return;

		setWidth(footerWidth - SELECTOR_PADDINGS);
	}, [footerRef]);

	return accessRightsMode === SelectorAccessRightsMode.Compact ? (
		<ComboBox
			className={styles.comboBox}
			onSelect={onSelect}
			options={accessRights as TOption[]}
			size={ComboBoxSize.content}
			scaled={false}
			manualWidth="auto"
			selectedOption={selectedAccessRight as TOption}
			showDisabledItems
			directionX="right"
			directionY="top"
			forceCloseClickOutside
		/>
	) : (
		<AccessRightSelect
			className={styles.accessRightSelect}
			selectedOption={selectedAccessRight as TOption}
			onSelect={onSelect}
			accessOptions={accessRights as TOption[]}
			size={ComboBoxSize.content}
			scaled={false}
			directionX="left"
			directionY="top"
			fixedDirection={isMobileView}
			manualWidth={isMobileView ? "100%" : `${width}px`}
			isAside={isMobileView}
			manualY={isMobileView ? "0px" : undefined}
			withoutBackground={!isMobileView}
			withBackground={!isMobileView}
			withBlur={isMobileView}
		/>
	);
};

export default AccessSelector;
