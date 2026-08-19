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

import ArrowIcon from "../../../../assets/icons/12/arrow.right.svg";

import { Text } from "../../../text";
import { ContextMenu, type ContextMenuRefType } from "../../../context-menu";

import styles from "../../EmptyView.module.scss";
import type { EmptyViewItemProps } from "../../EmptyView.types";

export const EmptyViewItem = ({
	description,
	icon,
	title,
	onClick,
	disabled,
	model,
	id,
}: EmptyViewItemProps) => {
	const contextRef = React.useRef<ContextMenuRefType>(null);

	if (disabled) return;

	const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		if (!model) return onClick?.(event);

		contextRef.current?.show(event);
	};

	const elementProps = { className: styles.itemIcon };

	return (
		<div
			id={id}
			role="button"
			tabIndex={0}
			aria-label={title}
			onClick={handleClick}
			className={styles.itemWrapper}
		>
			<ContextMenu ref={contextRef} model={model ?? []} />
			{React.cloneElement(icon, elementProps)}
			<div className={styles.itemBody}>
				<Text
					as="h4"
					fontWeight="600"
					lineHeight="20px"
					className={styles.itemHeader}
					noSelect
				>
					{title}
				</Text>
				<Text as="p" fontSize="12px" className={styles.itemSubheading} noSelect>
					{description}
				</Text>
			</div>
			<ArrowIcon className={styles.arrowIcon} />
		</div>
	);
};
