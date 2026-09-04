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
								roomType: item.roomType,
								shared: item.shared,
								rootFolderType: item.rootFolderType,
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
