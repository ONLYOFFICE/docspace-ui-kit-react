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

import classNames from "classnames";

import ArrowIcon from "../../../assets/arrow.right.react.svg";

import { useInterfaceDirection } from "../../../context/InterfaceDirectionContext";

import {
	ContextMenuButton,
	ContextMenuButtonDisplayType,
} from "../../context-menu-button";
import type { ContextMenuModel } from "../../context-menu";
import { Text } from "../../text";

import type {
	TBreadCrumb,
	TDisplayedItem,
	BreadCrumbsProps,
} from "../Selector.types";
import { BreadCrumbsContext } from "../contexts/BreadCrumbs";
import { SearchDispatchContext } from "../contexts/Search";
import styles from "../Selector.module.scss";

const calculateDisplayedItems = (
	items: TBreadCrumb[],
	onClickItem: ({ item }: { item: TBreadCrumb }) => void,
) => {
	const itemsLength = items.length;
	const oldItems: TBreadCrumb[] = [];

	items.forEach((item) =>
		oldItems.push({
			...item,
			id: item.id?.toString(),
		}),
	);
	if (itemsLength > 0) {
		const newItems: TDisplayedItem[] = [];

		if (itemsLength <= 3) {
			oldItems.forEach((item, index) => {
				newItems.push({
					...item,
					isArrow: false,
					isList: false,
					listItems: [],
				});

				if (index !== oldItems.length - 1) {
					newItems.push({
						id: `arrow-${index}`,
						label: "",
						isArrow: true,
						isList: false,
						listItems: [],
					});
				}
			});
		} else {
			newItems.push({
				...oldItems[0],
				isArrow: false,
				isList: false,
				listItems: [],
			});

			newItems.push({
				id: "arrow-1",
				label: "",
				isArrow: true,
				isList: false,
				listItems: [],
			});

			newItems.push({
				id: "drop-down-item",
				label: "",
				isArrow: false,
				isList: true,
				listItems: [],
			});

			newItems.push({
				id: "arrow-2",
				label: "",
				isArrow: true,
				isList: false,
				listItems: [],
			});

			newItems.push({
				...oldItems[itemsLength - 2],
				isArrow: false,
				isList: false,
				listItems: [],
			});

			newItems.push({
				id: "arrow-3",
				label: "",
				isArrow: true,
				isList: false,
				listItems: [],
			});

			newItems.push({
				...oldItems[itemsLength - 1],
				isArrow: false,
				isList: false,
				listItems: [],
			});

			oldItems.splice(0, 1);
			oldItems.splice(oldItems.length - 2, 2);

			oldItems.forEach((item) => {
				newItems[2].listItems?.push({
					...item,
					minWidth: "150px",
					onClick: onClickItem,
				});
			});
		}

		return newItems;
	}

	return [];
};

const BreadCrumbs = ({ visible = true }: BreadCrumbsProps) => {
	const {
		withBreadCrumbs,
		breadCrumbs,
		breadCrumbsLoader,
		isBreadCrumbsLoading,
		onSelectBreadCrumb,
		bodyIsLoading,
	} = React.use(BreadCrumbsContext);
	const setIsSearch = React.use(SearchDispatchContext);

	const { isRTL } = useInterfaceDirection();

	const onClickItem = React.useCallback(
		({ item }: { item: TBreadCrumb }) => {
			if (isBreadCrumbsLoading) return;
			setIsSearch(false);
			onSelectBreadCrumb?.(item);
		},
		[isBreadCrumbsLoading, onSelectBreadCrumb, setIsSearch],
	);

	const [displayedItems, setDisplayedItems] = React.useState<TDisplayedItem[]>(
		breadCrumbs ? calculateDisplayedItems(breadCrumbs, onClickItem) : [],
	);

	React.useEffect(() => {
		if (breadCrumbs && breadCrumbs.length > 0) {
			const items = calculateDisplayedItems(breadCrumbs, onClickItem);
			setDisplayedItems(items);
		}
	}, [breadCrumbs, onClickItem]);

	let gridTemplateColumns = "minmax(1px, max-content)";

	if (displayedItems.length > 5) {
		gridTemplateColumns =
			"minmax(1px, max-content) 12px 16px 12px minmax(1px, max-content) 12px minmax(1px, max-content)";
	} else if (displayedItems.length === 5) {
		gridTemplateColumns =
			"minmax(1px, max-content) 12px minmax(1px, max-content) 12px minmax(1px, max-content)";
	} else if (displayedItems.length === 3) {
		gridTemplateColumns =
			"minmax(1px, max-content) 12px minmax(1px, max-content)";
	}

	if (!withBreadCrumbs || !visible) {
		if (withBreadCrumbs && !visible && bodyIsLoading) return breadCrumbsLoader;

		return null;
	}

	if (isBreadCrumbsLoading) return breadCrumbsLoader;

	return (
		<div
			id="selector_bread_crumbs"
			className={styles.breadCrumbs}
			style={
				{
					"--items-count": displayedItems.length,
					"--grid-template-columns": gridTemplateColumns,
				} as React.CSSProperties
			}
		>
			{displayedItems.map((item, index) =>
				item.isList ? (
					<ContextMenuButton
						key={`bread-crumb-item-${item.id}`}
						className={styles.contextMenuButton}
						displayType={ContextMenuButtonDisplayType.dropdown}
						getData={() => {
							const items = item.listItems
								? ([...item.listItems] as ContextMenuModel[])
								: [];
							return items;
						}}
					/>
				) : item.isArrow ? (
					<ArrowIcon
						className={classNames(styles.arrowRightSvg, {
							[styles.rtl]: isRTL,
						})}
						key={`bread-crumb-item-${item.id}`}
					/>
				) : (
					<Text
						key={`bread-crumb-item-${item.id}`}
						dataTestId={`selector_bread_crumb_item_${item.id}`}
						fontSize="16px"
						fontWeight={600}
						lineHeight="22px"
						className={classNames(styles.itemText, {
							[styles.isNotCurrent]: index !== displayedItems.length - 1,
							[styles.isNotLoading]: !isBreadCrumbsLoading,
						})}
						noSelect
						truncate
						onClick={() => {
							if (index === displayedItems.length - 1 || isBreadCrumbsLoading)
								return;

							setIsSearch(false);

							onSelectBreadCrumb?.({
								id: item.id,
								label: item.label,
								isRoom: item.isRoom,
								isAgent: item.isAgent,
							});
						}}
					>
						{item.label}
					</Text>
				),
			)}
		</div>
	);
};

export { BreadCrumbs };
